"use client";

import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useRef, useState } from "react";
import { hasAnalyticsConsent } from "@/lib/analytics/consent";
import { loadMetaPixel, trackPurchase } from "@/lib/analytics/track";
import { COMPANY } from "@/lib/company";

function PurchaseTrackerInner() {
  const searchParams = useSearchParams();
  const analyticsFired = useRef(false);
  const [confirmError, setConfirmError] = useState<string | null>(null);

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

        if (!analyticsFired.current && hasAnalyticsConsent()) {
          analyticsFired.current = true;
          loadMetaPixel();
          trackPurchase(data.amountEur || 0, data.packageId);
        }
      })
      .catch(() => setConfirmError("Nepavyko patvirtinti mokėjimo"));
  }, [searchParams]);

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
