import { NextRequest, NextResponse } from "next/server";
import { sendMetaCapiEvent } from "@/lib/meta-capi";

type MetaEventBody = {
  event_name?: string;
  event_id?: string;
  event_source_url?: string;
  email?: string;
  first_name?: string;
  last_name?: string;
  city?: string;
  external_id?: string;
  fbp?: string;
  fbc?: string;
  value?: number;
  currency?: string;
  content_name?: string;
};

const ALLOWED_EVENTS = new Set(["Lead", "InitiateCheckout", "Purchase", "PageView"]);

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as MetaEventBody;

    if (!body.event_name || !body.event_id || !ALLOWED_EVENTS.has(body.event_name)) {
      return NextResponse.json({ error: "Invalid event" }, { status: 400 });
    }

    const clientIp =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      request.headers.get("x-real-ip") ||
      undefined;

    const result = await sendMetaCapiEvent({
      eventName: body.event_name as "Lead" | "InitiateCheckout" | "Purchase" | "PageView",
      eventId: body.event_id,
      eventSourceUrl: body.event_source_url,
      userData: {
        email: body.email,
        firstName: body.first_name,
        lastName: body.last_name,
        city: body.city,
        externalId: body.external_id,
        fbp: body.fbp,
        fbc: body.fbc,
        clientIp,
        userAgent: request.headers.get("user-agent") || undefined,
      },
      customData: {
        value: body.value,
        currency: body.currency || "EUR",
        content_name: body.content_name,
      },
    });

    if (result.skipped) {
      return NextResponse.json({ ok: true, skipped: true });
    }

    if (!result.ok) {
      return NextResponse.json({ error: result.error || "Meta CAPI failed" }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Meta event route error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
