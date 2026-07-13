"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getConsent, setConsent, type CookieConsent } from "@/lib/analytics/consent";
import { loadMetaPixel } from "@/lib/analytics/track";

export function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = getConsent();
    setVisible(consent === "pending");
    if (consent === "all") loadMetaPixel();
  }, []);

  const accept = (level: Exclude<CookieConsent, "pending">) => {
    setConsent(level);
    if (level === "all") loadMetaPixel();
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-label="Slapukų sutikimas"
      className="fixed inset-x-0 bottom-0 z-50 border-t border-cream-dark bg-white/98 p-4 shadow-lg backdrop-blur-sm sm:p-6"
      style={{ paddingBottom: "max(1rem, env(safe-area-inset-bottom))" }}
    >
      <div className="layout-shell flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="max-w-3xl text-sm leading-relaxed text-ink-muted">
          <p className="font-medium text-ink">Slapukai ir statistika</p>
          <p className="mt-1">
            Naudojame būtinus slapukus svetainės veikimui. Jūsų sutikimu taip pat naudojame
            analitikos ir Meta (Facebook) Pixel slapukus, kad matytume, kaip lankytojai naudojasi
            svetaine — kur spustelėja, kiek laiko praleidžia, iš kur atėjo — ir galėtume matuoti
            Meta reklamų efektyvumą. Daugiau —{" "}
            <Link href="/privatumo-politika" className="text-sage underline hover:text-sage-dark">
              privatumo politikoje
            </Link>
            .
          </p>
        </div>
        <div className="flex shrink-0 flex-wrap gap-2">
          <button
            type="button"
            onClick={() => accept("essential")}
            className="rounded-full border border-cream-dark px-5 py-2.5 text-sm font-medium text-ink-muted hover:bg-cream cursor-pointer"
          >
            Tik būtini
          </button>
          <button
            type="button"
            onClick={() => accept("all")}
            className="rounded-full bg-sage px-5 py-2.5 text-sm font-medium text-white hover:bg-sage-dark cursor-pointer"
          >
            Sutinku su visais
          </button>
        </div>
      </div>
    </div>
  );
}
