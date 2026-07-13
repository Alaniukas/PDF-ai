import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { getStripe } from "@/lib/stripe";
import { notifyAdminPaidOrder } from "@/lib/notify-admin";
import { getAppUrl } from "@/lib/app-url";
import { purchaseEventId, sendMetaCapiEvent } from "@/lib/meta-capi";
import { createServiceClient } from "@/lib/supabase";

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = request.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!webhookSecret) {
    return NextResponse.json({ error: "Webhook not configured" }, { status: 500 });
  }

  let event: Stripe.Event;
  try {
    const stripe = getStripe();
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const orderIdFromMeta = session.metadata?.order_id;

    try {
      const supabase = createServiceClient();
      let notifyOrderId: string | null = orderIdFromMeta ?? null;

      if (orderIdFromMeta) {
        const { error } = await supabase
          .from("orders")
          .update({
            stripe_session_id: session.id,
            status: "paid",
            amount_cents: session.amount_total || undefined,
            email: session.customer_details?.email || session.customer_email || undefined,
          })
          .eq("id", orderIdFromMeta);

        if (error) {
          console.error("Order update error:", error);
          return NextResponse.json({ error: "Database error" }, { status: 500 });
        }
      } else {
        const { data: upserted, error } = await supabase
          .from("orders")
          .upsert(
            {
              stripe_session_id: session.id,
              email: session.customer_details?.email || session.customer_email || "",
              amount_cents: session.amount_total || 2200,
              package_id: session.metadata?.package_id || "popular",
              status: "paid",
            },
            { onConflict: "stripe_session_id" }
          )
          .select("id")
          .single();

        if (error) {
          console.error("Supabase upsert error:", error);
          return NextResponse.json({ error: "Database error" }, { status: 500 });
        }
        notifyOrderId = upserted?.id ?? null;
      }

      if (notifyOrderId) {
        try {
          await notifyAdminPaidOrder(supabase, notifyOrderId);
        } catch (emailErr) {
          console.error("Admin email failed (order still paid):", emailErr);
        }
      }

      const purchaseEmail =
        session.customer_details?.email || session.customer_email || undefined;
      await sendMetaCapiEvent({
        eventName: "Purchase",
        eventId: purchaseEventId(session.id),
        eventSourceUrl: `${getAppUrl()}/aciu?session_id=${session.id}`,
        userData: {
          email: purchaseEmail,
          externalId: notifyOrderId || orderIdFromMeta || session.id,
        },
        customData: {
          value: (session.amount_total || 0) / 100,
          currency: (session.currency || "eur").toUpperCase(),
          content_name: session.metadata?.package_id || "order",
          content_ids: session.metadata?.package_id
            ? [session.metadata.package_id]
            : undefined,
        },
      });
    } catch (err) {
      console.error("Webhook processing error:", err);
      return NextResponse.json({ error: "Processing error" }, { status: 500 });
    }
  }

  return NextResponse.json({ received: true });
}
