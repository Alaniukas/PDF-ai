import { NextRequest, NextResponse } from "next/server";
import { getAppUrl } from "@/lib/app-url";
import { getStripe } from "@/lib/stripe";
import { createServiceClient, getSupabaseProjectRef } from "@/lib/supabase";
import { fullFormSchema } from "@/lib/form-schema";
import { detectImageMime, imageContentType, mimeToExt } from "@/lib/image-upload";
import { sendMetaCapiEvent, splitName } from "@/lib/meta-capi";
import { PACKAGES, PackageId } from "@/lib/packages";

function supabaseConfigError(): string | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";
  const urlRef = getSupabaseProjectRef(url);
  const keyRef = getSupabaseProjectRef(serviceKey);

  if (!urlRef || !keyRef) return null;
  if (urlRef !== keyRef) {
    return `Supabase raktai iš skirtingų projektų (URL: ${urlRef}, service role: ${keyRef}). Dashboard → Settings → API → service_role — įklijuokite į .env.local`;
  }
  return null;
}

export async function POST(request: NextRequest) {
  try {
    const configError = supabaseConfigError();
    if (configError) {
      return NextResponse.json({ error: configError }, { status: 500 });
    }

    const formData = await request.formData();
    const answersRaw = formData.get("answers") as string;
    const packageId = formData.get("package_id") as PackageId;
    const metaTrackingRaw = formData.get("meta_tracking") as string | null;
    let metaTracking: {
      initiate_checkout_event_id?: string;
      fbp?: string;
      fbc?: string;
    } = {};

    if (metaTrackingRaw) {
      try {
        metaTracking = JSON.parse(metaTrackingRaw);
      } catch {
        console.warn("Invalid meta_tracking JSON");
      }
    }

    if (!answersRaw || !packageId) {
      return NextResponse.json({ error: "Trūksta duomenų" }, { status: 400 });
    }

    const pkg = PACKAGES[packageId];
    if (!pkg) {
      return NextResponse.json({ error: "Neteisingas paketas" }, { status: 400 });
    }

    const parsed = JSON.parse(answersRaw);
    const validation = fullFormSchema.safeParse(parsed);
    if (!validation.success) {
      return NextResponse.json(
        { error: "Formos validacijos klaida", details: validation.error.flatten() },
        { status: 400 }
      );
    }

    const supabase = createServiceClient();
    const email = validation.data.email;

    const { data: order, error: orderError } = await supabase
      .from("orders")
      .insert({
        email,
        package_id: packageId,
        amount_cents: pkg.priceCents,
        status: "pending_payment",
      })
      .select("id")
      .single();

    if (orderError || !order) {
      console.error("Order create error:", orderError);
      return NextResponse.json(
        {
          error:
            orderError?.message?.includes("JWT")
              ? "Supabase service role raktas neteisingas. Atnaujinkite SUPABASE_SERVICE_ROLE_KEY .env.local faile."
              : "Nepavyko sukurti užsakymo",
        },
        { status: 500 }
      );
    }

    const files = formData.getAll("photos") as File[];
    const comments = formData.getAll("photo_comments") as string[];
    const manifestRaw = formData.get("photo_manifest") as string | null;
    let manifest: Array<{ name?: string; size?: number; comment?: string }> = [];

    if (manifestRaw) {
      try {
        manifest = JSON.parse(manifestRaw);
      } catch {
        console.warn("Invalid photo_manifest JSON");
      }
    }

    const { error: responseError } = await supabase.from("form_responses").insert({
      order_id: order.id,
      answers: {
        ...validation.data,
        ...(manifest.length > 0 ? { _photo_manifest: manifest } : {}),
      },
    });

    if (responseError) {
      console.error("Form response error:", responseError);
      return NextResponse.json({ error: "Nepavyko išsaugoti atsakymų" }, { status: 500 });
    }

    console.log("Intake photos received:", {
      files: files.length,
      manifest: manifest.length,
      orderId: order.id,
    });

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const buffer = file ? Buffer.from(await file.arrayBuffer()) : Buffer.alloc(0);

      if (!file || buffer.length === 0) {
        console.warn("Skipping empty photo upload", {
          index: i,
          name: file?.name,
          reportedSize: file?.size,
        });
        continue;
      }

      const contentType = imageContentType(file, mimeToExt(detectImageMime(buffer)), buffer);
      const ext = mimeToExt(contentType);
      const path = `${order.id}/${Date.now()}-${i}.${ext}`;

      const { error: uploadError } = await supabase.storage
        .from("intake-uploads")
        .upload(path, buffer, { contentType, upsert: false });

      if (uploadError) {
        console.error("Storage upload error:", uploadError, {
          path,
          contentType,
          size: buffer.length,
          fileType: file.type,
        });
        continue;
      }

      const { error: metaError } = await supabase.from("uploads").insert({
        order_id: order.id,
        file_path: path,
        comment: comments[i] || manifest[i]?.comment || "",
      });

      if (metaError) {
        console.error("Upload metadata error:", metaError, { path });
      }
    }

    if (manifest.length > 0 && files.length === 0) {
      console.error("Photo manifest present but no files received in FormData", {
        orderId: order.id,
        manifest,
      });
    }

    if (metaTracking.initiate_checkout_event_id) {
      const { firstName, lastName } = splitName(validation.data.name);
      const clientIp =
        request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
        request.headers.get("x-real-ip") ||
        undefined;

      await sendMetaCapiEvent({
        eventName: "InitiateCheckout",
        eventId: metaTracking.initiate_checkout_event_id,
        eventSourceUrl: `${getAppUrl()}/anketa?package=${packageId}`,
        userData: {
          email: validation.data.email,
          firstName,
          lastName,
          city: validation.data.city,
          externalId: order.id,
          fbp: metaTracking.fbp,
          fbc: metaTracking.fbc,
          clientIp,
          userAgent: request.headers.get("user-agent") || undefined,
        },
        customData: {
          value: pkg.priceEur,
          currency: "EUR",
          content_name: packageId,
          content_ids: [packageId],
        },
      });
    }

    const stripe = getStripe();
    const appUrl = getAppUrl();

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      customer_email: email,
      line_items: [
        {
          price_data: {
            currency: "eur",
            product_data: {
              name: `${pkg.name}: ${pkg.subtitle}`,
              description: pkg.description,
            },
            unit_amount: pkg.priceCents,
          },
          quantity: 1,
        },
      ],
      metadata: {
        package_id: pkg.id,
        order_id: order.id,
      },
      success_url: `${appUrl}/aciu?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${appUrl}/anketa?package=${packageId}&cancelled=true`,
      billing_address_collection: "auto",
    });

    await supabase
      .from("orders")
      .update({ stripe_session_id: session.id })
      .eq("id", order.id);

    if (!session.url) {
      return NextResponse.json({ error: "Nepavyko sukurti mokėjimo" }, { status: 500 });
    }

    return NextResponse.json({ url: session.url, package_id: pkg.id, amount: pkg.priceEur });
  } catch (error) {
    console.error("Intake error:", error);
    const message = error instanceof Error ? error.message : "Serverio klaida";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
