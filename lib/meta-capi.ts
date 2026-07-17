import { createHash } from "crypto";
import { getAppUrl } from "@/lib/app-url";

export type MetaCapiEventName = "Lead" | "InitiateCheckout" | "Purchase" | "PageView";

export type MetaCapiUserData = {
  email?: string;
  phone?: string;
  firstName?: string;
  lastName?: string;
  city?: string;
  clientIp?: string;
  userAgent?: string;
  fbp?: string;
  fbc?: string;
  externalId?: string;
};

export type MetaCapiCustomData = {
  value?: number;
  currency?: string;
  content_name?: string;
  content_ids?: string[];
};

function hashMetaValue(value: string): string {
  return createHash("sha256").update(value.trim().toLowerCase()).digest("hex");
}

function buildUserData(data: MetaCapiUserData): Record<string, string | string[]> {
  const userData: Record<string, string | string[]> = {};

  if (data.email) userData.em = [hashMetaValue(data.email)];
  if (data.phone) userData.ph = [hashMetaValue(data.phone)];
  if (data.firstName) userData.fn = [hashMetaValue(data.firstName)];
  if (data.lastName) userData.ln = [hashMetaValue(data.lastName)];
  if (data.city) userData.ct = [hashMetaValue(data.city)];
  if (data.externalId) userData.external_id = [hashMetaValue(data.externalId)];
  if (data.clientIp) userData.client_ip_address = data.clientIp;
  if (data.userAgent) userData.client_user_agent = data.userAgent;
  if (data.fbp) userData.fbp = data.fbp;
  if (data.fbc) userData.fbc = data.fbc;

  return userData;
}

export function isMetaCapiConfigured(): boolean {
  const pixelId = (process.env.NEXT_PUBLIC_META_PIXEL_ID || process.env.META_PIXEL_ID || "").trim();
  return Boolean(pixelId && process.env.META_CAPI_ACCESS_TOKEN?.trim());
}

export async function sendMetaCapiEvent(options: {
  eventName: MetaCapiEventName;
  eventId: string;
  eventSourceUrl?: string;
  userData?: MetaCapiUserData;
  customData?: MetaCapiCustomData;
}): Promise<{ ok: boolean; skipped?: boolean; error?: string }> {
  const pixelId = (process.env.NEXT_PUBLIC_META_PIXEL_ID || process.env.META_PIXEL_ID || "").trim();
  const accessToken = process.env.META_CAPI_ACCESS_TOKEN?.trim();

  if (!pixelId || !accessToken) {
    return { ok: false, skipped: true };
  }

  const eventSourceUrl = options.eventSourceUrl || getAppUrl();

  try {
    const response = await fetch(
      `https://graph.facebook.com/v21.0/${pixelId}/events?access_token=${accessToken}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          data: [
            {
              event_name: options.eventName,
              event_time: Math.floor(Date.now() / 1000),
              event_id: options.eventId,
              event_source_url: eventSourceUrl,
              action_source: "website",
              user_data: buildUserData(options.userData || {}),
              custom_data: options.customData,
            },
          ],
        }),
      }
    );

    const result = await response.json().catch(() => ({}));

    if (!response.ok) {
      console.error("Meta CAPI error:", result);
      return {
        ok: false,
        error: typeof result?.error?.message === "string" ? result.error.message : "Meta CAPI failed",
      };
    }

    return { ok: true };
  } catch (error) {
    console.error("Meta CAPI request failed:", error);
    return { ok: false, error: error instanceof Error ? error.message : "Meta CAPI failed" };
  }
}

export function splitName(fullName: string): { firstName?: string; lastName?: string } {
  const parts = fullName.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return {};
  if (parts.length === 1) return { firstName: parts[0] };
  return { firstName: parts[0], lastName: parts.slice(1).join(" ") };
}

export function purchaseEventId(stripeSessionId: string): string {
  return `purchase-${stripeSessionId}`;
}
