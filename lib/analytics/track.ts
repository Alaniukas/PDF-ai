declare global {
  interface Window {
    fbq?: FbqFunction;
    _fbq?: FbqFunction;
    clarity?: (...args: unknown[]) => void;
  }
}

type FbqFunction = ((...args: unknown[]) => void) & {
  callMethod?: (...args: unknown[]) => void;
  queue?: unknown[];
  loaded?: boolean;
  version?: string;
  push?: (...args: unknown[]) => void;
};

const PIXEL_ID = (process.env.NEXT_PUBLIC_META_PIXEL_ID || "").trim();
const CLARITY_ID = (process.env.NEXT_PUBLIC_CLARITY_ID || "").trim();

let pixelLoaded = false;
let clarityLoaded = false;

export function isPixelConfigured(): boolean {
  return Boolean(PIXEL_ID);
}

export function isClarityConfigured(): boolean {
  return Boolean(CLARITY_ID);
}

/** Official-style stub so fbevents.js can drain the queue reliably. */
function ensureFbqStub(): FbqFunction {
  if (window.fbq) return window.fbq;

  const fbq: FbqFunction = function (...args: unknown[]) {
    if (fbq.callMethod) {
      fbq.callMethod(...args);
    } else {
      fbq.queue = fbq.queue || [];
      fbq.queue.push(args);
    }
  };
  fbq.push = fbq;
  fbq.loaded = true;
  fbq.version = "2.0";
  fbq.queue = [];
  window.fbq = fbq;
  if (!window._fbq) window._fbq = fbq;
  return fbq;
}

export function loadMetaPixel() {
  if (typeof window === "undefined" || !PIXEL_ID || pixelLoaded) return;

  const fbq = ensureFbqStub();

  if (!document.getElementById("meta-pixel-script")) {
    const script = document.createElement("script");
    script.id = "meta-pixel-script";
    script.async = true;
    script.src = "https://connect.facebook.net/en_US/fbevents.js";
    const first = document.getElementsByTagName("script")[0];
    first?.parentNode?.insertBefore(script, first);
  }

  fbq("init", PIXEL_ID, {
    autoConfig: true,
    xfbml: false,
  });
  // PageView is fired by AnalyticsProvider via trackPageView (avoids duplicates)
  pixelLoaded = true;
}

export function loadClarity() {
  if (typeof window === "undefined" || !CLARITY_ID || clarityLoaded) return;

  type ClarityStub = ((...args: unknown[]) => void) & { q?: unknown[] };
  const existing = window.clarity as ClarityStub | undefined;
  if (!existing) {
    const stub: ClarityStub = function (...args: unknown[]) {
      stub.q = stub.q || [];
      stub.q.push(args);
    };
    stub.q = [];
    window.clarity = stub;
  }

  if (!document.getElementById("ms-clarity-script")) {
    const script = document.createElement("script");
    script.id = "ms-clarity-script";
    script.async = true;
    script.src = `https://www.clarity.ms/tag/${CLARITY_ID}`;
    document.head.appendChild(script);
  }

  clarityLoaded = true;
}

/** Load all consent-gated analytics (Pixel + Clarity). */
export function loadConsentedAnalytics() {
  loadMetaPixel();
  loadClarity();
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

function clarityEvent(name: string, data?: Record<string, string>) {
  if (typeof window === "undefined" || !window.clarity) return;
  try {
    if (data) {
      for (const [key, value] of Object.entries(data)) {
        window.clarity("set", key, value);
      }
    }
    window.clarity("event", name);
  } catch {
    // Clarity must not break UX
  }
}

export function trackPageView(path: string) {
  trackMeta("PageView");
  trackMetaCustom("PageVisit", { path });
  clarityEvent("page_view", { path });
}

export function trackClick(label: string, href?: string) {
  trackMetaCustom("Click", { label, href: href ?? null });
}

export function trackScrollDepth(percent: number, path: string) {
  trackMetaCustom("ScrollDepth", { percent, path });
  if (percent === 50 || percent === 100) {
    clarityEvent(`scroll_${percent}`, { path });
  }
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
  clarityEvent("lead", { source });
}

export function trackFormStart(packageId: string) {
  trackMetaCustom("FormStart", { content_name: packageId, package_id: packageId });
  clarityEvent("form_start", { package_id: packageId });
}

export function trackFormStep(stepId: string, stepIndex: number, packageId: string) {
  trackMetaCustom("FormStep", {
    content_name: stepId,
    step_id: stepId,
    step_index: stepIndex + 1,
    package_id: packageId,
  });
  clarityEvent("form_step", {
    step_id: stepId,
    step: String(stepIndex + 1),
    package_id: packageId,
  });
}

export function trackFormAbandon(stepId: string, stepIndex: number, packageId: string) {
  trackMetaCustom("FormAbandon", {
    content_name: stepId,
    step_id: stepId,
    step_index: stepIndex + 1,
    package_id: packageId,
  });
  clarityEvent("form_abandon", {
    step_id: stepId,
    step: String(stepIndex + 1),
    package_id: packageId,
  });
}

export function trackCheckoutCancelled(packageId: string) {
  trackMetaCustom("CheckoutCancelled", {
    content_name: packageId,
    package_id: packageId,
  });
  clarityEvent("checkout_cancelled", { package_id: packageId });
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
  clarityEvent("initiate_checkout", {
    package_id: packageId,
    value: String(value),
  });
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
  clarityEvent("purchase", {
    package_id: packageId ?? "order",
    value: String(value),
  });
}
