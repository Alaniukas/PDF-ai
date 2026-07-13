"use client";

import { Suspense, useCallback, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { FormWizard } from "@/components/form/FormWizard";
import { SiteLogo } from "@/components/landing/SiteLogo";
import { trackLead } from "@/lib/analytics/track";
import { hasAnalyticsConsent } from "@/lib/analytics/consent";
import { PACKAGE_LIST, PackageId, getPackage } from "@/lib/packages";

function AnketaContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const packageParam = searchParams.get("package") as PackageId | null;
  const cancelled = searchParams.get("cancelled") === "true";

  const [selectedPackage, setSelectedPackage] = useState<PackageId>(
    packageParam && getPackage(packageParam) ? packageParam : "popular"
  );

  const packageInfo = getPackage(selectedPackage)!;

  useEffect(() => {
    if (packageParam && getPackage(packageParam)) {
      setSelectedPackage(packageParam);
    }
  }, [packageParam]);

  useEffect(() => {
    if (hasAnalyticsConsent()) {
      trackLead(`anketa_${selectedPackage}`);
    }
  }, [selectedPackage]);

  const selectPackage = useCallback(
    (id: PackageId) => {
      setSelectedPackage(id);
      router.replace(`/anketa?package=${id}`, { scroll: false });
    },
    [router]
  );

  return (
    <div className="min-h-screen px-6 py-12">
      <div className="mx-auto max-w-2xl">
        <div className="mb-8 text-center">
          <div className="mb-6 flex justify-center">
            <SiteLogo />
          </div>
          <Link href="/" className="text-sm text-sage hover:underline">
            ← Grįžti
          </Link>
          <p className="mt-4 text-sm font-medium uppercase tracking-widest text-sage">
            1 žingsnis — Anketa
          </p>
          <h1 className="mt-2 font-serif text-3xl text-ink">Papasakokite apie savo darbą</h1>
          <p className="mt-3 text-ink-muted">
            Užpildykite anketą, tada apmokėsite pasirinktą paketą. PDF atsiųsime Jūsų el. paštu per{" "}
            <strong className="text-ink">24 val.</strong> — su žingsniais, programų naudojimu ir ekrano paaiškinimais.
          </p>
          {cancelled && (
            <p className="mt-3 rounded-lg bg-amber-50 px-4 py-2 text-sm text-amber-900">
              Mokėjimas atšauktas. Galite tęsti — pasirinktas paketas: {packageInfo.subtitle} ({packageInfo.priceEur} €)
            </p>
          )}
        </div>

        <div className="mb-8 rounded-2xl border border-cream-dark bg-white p-5">
          <p className="text-sm font-medium text-ink">Pasirinkite paketą</p>
          <p className="mt-1 text-xs text-ink-muted">
            Kaina ir klausimų skaičius priklauso nuo pasirinkto paketo
          </p>
          <div className="mt-3 grid gap-2 sm:grid-cols-3">
            {PACKAGE_LIST.map((pkg) => (
              <button
                key={pkg.id}
                type="button"
                onClick={() => selectPackage(pkg.id)}
                className={`rounded-xl border px-3 py-3 text-left text-sm transition-all cursor-pointer ${
                  selectedPackage === pkg.id
                    ? "border-sage bg-sage-light/50 text-ink ring-2 ring-sage/30"
                    : "border-cream-dark hover:border-sage/50"
                }`}
              >
                <span className="font-medium">{pkg.subtitle}</span>
                <span className="mt-1 block font-serif text-lg text-sage">{pkg.priceEur} €</span>
                <span className="mt-0.5 block text-xs text-ink-light">PDF {pkg.pageCount}</span>
              </button>
            ))}
          </div>
          <div className="mt-4 rounded-xl bg-sage-light/40 px-4 py-3 text-sm">
            <p className="font-medium text-sage-dark">
              Dabar pasirinkta: {packageInfo.name} — {packageInfo.subtitle}
            </p>
            <p className="mt-1 text-ink-muted">{packageInfo.description}</p>
            <p className="mt-2 text-xs text-ink-light">
              Apmokėsite <strong className="text-ink">{packageInfo.priceEur} €</strong> per Stripe ·{" "}
              {packageInfo.maxTasks === 1 ? "1 užduotis" : `Iki ${packageInfo.maxTasks} užduočių`}
            </p>
          </div>
        </div>

        <div className="rounded-2xl border border-cream-dark bg-white p-6 md:p-10">
          <FormWizard
            key={selectedPackage}
            packageId={selectedPackage}
            packageInfo={packageInfo}
          />
        </div>
      </div>
    </div>
  );
}

export default function AnketaPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center">
          <p className="text-ink-muted">Kraunama…</p>
        </div>
      }
    >
      <AnketaContent />
    </Suspense>
  );
}
