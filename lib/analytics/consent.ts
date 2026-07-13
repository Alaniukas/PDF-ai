export type CookieConsent = "pending" | "essential" | "all";

const STORAGE_KEY = "cookie_consent";

export function getConsent(): CookieConsent {
  if (typeof window === "undefined") return "pending";
  const value = localStorage.getItem(STORAGE_KEY);
  if (value === "essential" || value === "all") return value;
  return "pending";
}

export function setConsent(consent: Exclude<CookieConsent, "pending">) {
  localStorage.setItem(STORAGE_KEY, consent);
  window.dispatchEvent(new CustomEvent("cookie-consent-change", { detail: consent }));
}

export function hasAnalyticsConsent(): boolean {
  return getConsent() === "all";
}
