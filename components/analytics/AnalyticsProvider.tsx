"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useRef } from "react";
import { hasAnalyticsConsent } from "@/lib/analytics/consent";
import {
  loadMetaPixel,
  trackClick,
  trackPageView,
  trackScrollDepth,
  trackTimeOnPage,
} from "@/lib/analytics/track";

function AnalyticsInner() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const startRef = useRef(Date.now());
  const scrollMarks = useRef(new Set<number>());
  const path = `${pathname}${searchParams.toString() ? `?${searchParams}` : ""}`;

  useEffect(() => {
    if (hasAnalyticsConsent()) loadMetaPixel();

    const onConsent = () => {
      if (hasAnalyticsConsent()) loadMetaPixel();
    };
    window.addEventListener("cookie-consent-change", onConsent);
    return () => window.removeEventListener("cookie-consent-change", onConsent);
  }, []);

  useEffect(() => {
    if (!hasAnalyticsConsent()) return;

    startRef.current = Date.now();
    scrollMarks.current = new Set();
    trackPageView(path);
  }, [path]);

  useEffect(() => {
    if (!hasAnalyticsConsent()) return;

    const onScroll = () => {
      const doc = document.documentElement;
      const scrollable = doc.scrollHeight - window.innerHeight;
      if (scrollable <= 0) return;
      const percent = Math.round((window.scrollY / scrollable) * 100);
      for (const mark of [25, 50, 75, 100]) {
        if (percent >= mark && !scrollMarks.current.has(mark)) {
          scrollMarks.current.add(mark);
          trackScrollDepth(mark, path);
        }
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [path]);

  useEffect(() => {
    if (!hasAnalyticsConsent()) return;

    const onClick = (e: MouseEvent) => {
      const el = (e.target as HTMLElement).closest("a, button");
      if (!el) return;
      const label =
        el.getAttribute("aria-label") ||
        el.getAttribute("data-track") ||
        (el.textContent ?? "").trim().slice(0, 80) ||
        el.tagName;
      const href = el instanceof HTMLAnchorElement ? el.href : undefined;
      trackClick(label, href);
    };

    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, [path]);

  useEffect(() => {
    if (!hasAnalyticsConsent()) return;

    const sendTime = () => {
      const seconds = Math.round((Date.now() - startRef.current) / 1000);
      if (seconds >= 5) trackTimeOnPage(seconds, path);
    };

    const interval = setInterval(() => {
      const seconds = Math.round((Date.now() - startRef.current) / 1000);
      if ([30, 60, 120, 300].includes(seconds)) trackTimeOnPage(seconds, path);
    }, 1000);

    window.addEventListener("beforeunload", sendTime);
    return () => {
      clearInterval(interval);
      window.removeEventListener("beforeunload", sendTime);
      sendTime();
    };
  }, [path]);

  return null;
}

export function AnalyticsProvider() {
  return (
    <Suspense fallback={null}>
      <AnalyticsInner />
    </Suspense>
  );
}
