import { NextRequest, NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";
import { notifyAdminPaidOrder } from "@/lib/notify-admin";
import { getAppUrl } from "@/lib/app-url";
import { purchaseEventId, sendMetaCapiEvent } from "@/lib/meta-capi";
import { createServiceClient } from "@/lib/supabase";
import { orderFieldsFromSession } from "@/lib/order-utils";
import { getPackage } from "@/lib/packages";

export async function GET(request: NextRequest) {
  const sessionId = request.nextUrl.searchParams.get("session_id");
  if (!sessionId) {
    return NextResponse.json({ error: "Missing session_id" }, { status: 400 });
  }

  try {
    const stripe = getStripe();
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.payment_status !== "paid") {
      return NextResponse.json({ error: "Mokėjimas nepatvirtintas" }, { status: 402 });
    }

    const supabase = createServiceClient();
    const fields = orderFieldsFromSession(session);
    const orderIdFromMeta = session.metadata?.order_id;

    let order: {
      id: string;
      status: string;
      email: string;
      package_id: string;
    } | null = null;

    let wasPending = false;

    if (orderIdFromMeta) {
      const { data: existing } = await supabase
        .from("orders")
        .select("id, status, email, package_id")
        .eq("id", orderIdFromMeta)
        .maybeSingle();

      if (existing) {
        wasPending = existing.status === "pending_payment";
        const { data: updated, error } = await supabase
          .from("orders")
          .update(fields)
          .eq("id", orderIdFromMeta)
          .select("id, status, email, package_id")
          .single();

        if (error) {
          console.error("Order update error:", error);
          return NextResponse.json({ error: "Database error" }, { status: 500 });
        }
        order = updated;
      }
    }

    if (!order) {
      const { data: bySession } = await supabase
        .from("orders")
        .select("id, status, email, package_id")
        .eq("stripe_session_id", sessionId)
        .maybeSingle();

      if (bySession) {
        wasPending = bySession.status === "pending_payment";
        if (wasPending) {
          const { data: updated, error } = await supabase
            .from("orders")
            .update(fields)
            .eq("id", bySession.id)
            .select("id, status, email, package_id")
            .single();

          if (error) {
            console.error("Order update error:", error);
            return NextResponse.json({ error: "Database error" }, { status: 500 });
          }
          order = updated;
        } else {
          order = bySession;
        }
      }
    }

    if (!order) {
      const { data: inserted, error } = await supabase
        .from("orders")
        .upsert(fields, { onConflict: "stripe_session_id" })
        .select("id, status, email, package_id")
        .single();

      if (error) {
        console.error("Order upsert error:", error);
        return NextResponse.json({ error: "Database error" }, { status: 500 });
      }
      order = inserted;
      wasPending = true;
    }

    if (wasPending && order.status === "paid") {
      try {
        await notifyAdminPaidOrder(supabase, order.id);
      } catch (emailErr) {
        console.error("Admin email failed (order still paid):", emailErr);
      }

      const fbp = request.cookies.get("_fbp")?.value;
      const fbc = request.cookies.get("_fbc")?.value;
      const clientIp =
        request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
        request.headers.get("x-real-ip") ||
        undefined;

      await sendMetaCapiEvent({
        eventName: "Purchase",
        eventId: purchaseEventId(sessionId),
        eventSourceUrl: `${getAppUrl()}/aciu?session_id=${sessionId}`,
        userData: {
          email: order.email,
          externalId: order.id,
          fbp,
          fbc,
          clientIp,
          userAgent: request.headers.get("user-agent") || undefined,
        },
        customData: {
          value: (fields.amount_cents || 0) / 100,
          currency: "EUR",
          content_name: order.package_id,
          content_ids: [order.package_id],
        },
      });
    }

    const pkg = getPackage(order.package_id);

    return NextResponse.json({
      email: order.email,
      orderId: order.id,
      packageId: order.package_id,
      package: pkg,
      amountEur: (fields.amount_cents || 0) / 100,
      alreadySubmitted: order.status === "form_submitted" || order.status === "pdf_sent",
    });
  } catch (error) {
    console.error("Session verify error:", error);
    const message = error instanceof Error ? error.message : "Invalid session";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
