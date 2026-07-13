"use client";

export function getMetaCookie(name: "_fbp" | "_fbc"): string | undefined {
  if (typeof document === "undefined") return undefined;
  const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : undefined;
}

export function getMetaBrowserIds(): { fbp?: string; fbc?: string } {
  return {
    fbp: getMetaCookie("_fbp"),
    fbc: getMetaCookie("_fbc"),
  };
}

export function createMetaEventId(prefix?: string): string {
  const id = crypto.randomUUID();
  return prefix ? `${prefix}-${id}` : id;
}

export function purchaseEventId(stripeSessionId: string): string {
  return `purchase-${stripeSessionId}`;
}

type ServerMetaEvent = {
  event_name: "Lead" | "InitiateCheckout" | "Purchase" | "PageView";
  event_id: string;
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

export async function sendServerMetaEvent(payload: ServerMetaEvent): Promise<void> {
  try {
    await fetch("/api/meta-event", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      keepalive: true,
    });
  } catch {
    // Analytics must not block UX
  }
}
