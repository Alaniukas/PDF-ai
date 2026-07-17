"use client";

import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useRef, useState } from "react";
import { hasAnalyticsConsent } from "@/lib/analytics/consent";
import { purchaseEventId } from "@/lib/analytics/meta-client";
import { loadConsentedAnalytics, trackPurchase } from "@/lib/analytics/track";
import { COMPANY } from "@/lib/company";

type PurchaseInfo = {
  amountEur: number;
  packageId?: string;
  sessionId: string;
};

function PurchaseTrackerInner() {
  const searchParams = useSearchParams();
  const analyticsFired = useRef(false);
  const [purchase, setPurchase] = useState<PurchaseInfo | null>(null);
  const [confirmError, setConfirmError] = useState<string | null>(null);
  const [analyticsOn, setAnalyticsOn] = useState(false);

  useEffect(() => {
    const sync = () => setAnalyticsOn(hasAnalyticsConsent());
    sync();
    window.addEventListener("cookie-consent-change", sync);
    return () => window.removeEventListener("cookie-consent-change", sync);
  }, []);

  useEffect(() => {
    const sessionId = searchParams.get("session_id");
    if (!sessionId) return;

    fetch(`/api/session?session_id=${encodeURIComponent(sessionId)}`)
      .then(async (res) => {
        const data = await res.json().catch(() => ({}));
        if (!res.ok) {
          setConfirmError(
            typeof data.error === "string" ? data.error : "Nepavyko patvirtinti mokėjimo"
          );
          return;
        }

        setPurchase({
          amountEur: data.amountEur || 0,
          packageId: data.packageId,
          sessionId,
        });
      })
      .catch(() => setConfirmError("Nepavyko patvirtinti mokėjimo"));
  }, [searchParams]);

  useEffect(() => {
    if (!analyticsOn || !purchase || analyticsFired.current) return;
    analyticsFired.current = true;
    loadConsentedAnalytics();
    trackPurchase(purchase.amountEur, purchase.packageId, purchaseEventId(purchase.sessionId));
  }, [analyticsOn, purchase]);

  if (confirmError) {
    return (
      <p className="mb-6 max-w-md rounded-lg bg-amber-50 px-4 py-3 text-sm text-amber-900">
        {confirmError}. Jei mokėjimas Stripe puslapyje buvo sėkmingas, rašykite{" "}
        <a href={`mailto:${COMPANY.email}`} className="font-medium underline">
          {COMPANY.email}
        </a>
        .
      </p>
    );
  }

  return null;
}

export function PurchaseTracker() {
  return (
    <Suspense fallback={null}>
      <PurchaseTrackerInner />
    </Suspense>
  );
}
