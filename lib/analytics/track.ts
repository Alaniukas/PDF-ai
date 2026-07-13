declare global {
  interface Window {
    fbq?: {
      (...args: unknown[]): void;
      queue?: unknown[];
    };
  }
}

const PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID;

let pixelLoaded = false;

export function isPixelConfigured(): boolean {
  return Boolean(PIXEL_ID);
}

export function loadMetaPixel() {
  if (typeof window === "undefined" || !PIXEL_ID || pixelLoaded) return;

  const script = document.createElement("script");
  script.async = true;
  script.src = "https://connect.facebook.net/en_US/fbevents.js";
  document.head.appendChild(script);

  type FbqStub = ((...args: unknown[]) => void) & { queue: unknown[] };

  const fbq = function (...args: unknown[]) {
    fbq.queue.push(args);
  } as FbqStub;
  fbq.queue = [];
  window.fbq = fbq;
  window.fbq("init", PIXEL_ID, {
    autoConfig: true,
    xfbml: false,
  });
  window.fbq("track", "PageView");

  pixelLoaded = true;
}

export function trackMeta(
  event: string,
  params?: Record<string, unknown>,
  eventId?: string
) {
  if (typeof window === "undefined" || !window.fbq) return;
  if (eventId) {
    window.fbq("track", event, params || {}, { eventID: eventId });
    return;
  }
  if (params) {
    window.fbq("track", event, params);
  } else {
    window.fbq("track", event);
  }
}

export function trackMetaCustom(
  name: string,
  params?: Record<string, unknown>,
  eventId?: string
) {
  if (typeof window === "undefined" || !window.fbq) return;
  if (eventId) {
    window.fbq("trackCustom", name, params || {}, { eventID: eventId });
    return;
  }
  if (params) {
    window.fbq("trackCustom", name, params);
  } else {
    window.fbq("trackCustom", name);
  }
}

export function trackPageView(path: string) {
  trackMeta("PageView");
  trackMetaCustom("PageVisit", { path });
}

export function trackClick(label: string, href?: string) {
  trackMetaCustom("Click", { label, href: href ?? null });
}

export function trackScrollDepth(percent: number, path: string) {
  trackMetaCustom("ScrollDepth", { percent, path });
}

export function trackTimeOnPage(seconds: number, path: string) {
  trackMetaCustom("TimeOnPage", { seconds, path });
}

export function trackLead(source: string, eventId?: string) {
  trackMeta(
    "Lead",
    {
      content_name: source,
    },
    eventId
  );
}

export function trackInitiateCheckout(value: number, packageId: string, eventId?: string) {
  trackMeta(
    "InitiateCheckout",
    {
      value,
      currency: "EUR",
      content_name: packageId,
      content_ids: [packageId],
      num_items: 1,
    },
    eventId
  );
}

export function trackPurchase(value: number, packageId?: string, eventId?: string) {
  trackMeta(
    "Purchase",
    {
      value,
      currency: "EUR",
      content_name: packageId ?? "order",
      content_ids: packageId ? [packageId] : undefined,
      num_items: 1,
    },
    eventId
  );
}
