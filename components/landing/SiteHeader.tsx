"use client";

import Link from "next/link";
import { useState } from "react";
import { PdfSampleModal } from "./PdfSampleViewer";
import { SiteLogo } from "./SiteLogo";

const NAV_LINKS = [
  { href: "#kaip-veikia", label: "Kaip veikia" },
  { href: "#kainos", label: "Paketai" },
  { href: "#apie-mus", label: "Apie mus" },
] as const;

export function SiteHeader() {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-cream-dark bg-cream/95 py-2.5 backdrop-blur-sm sm:py-3">
        <div className="layout-shell flex min-w-0 items-center justify-between gap-3">
          <SiteLogo className="min-w-0 shrink" />
          <nav className="flex min-w-0 flex-wrap items-center justify-end gap-x-2 gap-y-1.5 text-xs sm:gap-x-4 sm:gap-y-2 sm:text-sm">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="whitespace-nowrap text-ink-muted transition-colors hover:text-ink"
              >
                {link.label}
              </a>
            ))}
            <button
              type="button"
              onClick={() => setModalOpen(true)}
              className="whitespace-nowrap text-ink-light underline-offset-2 transition-colors hover:text-ink hover:underline"
            >
              PDF pavyzdys
            </button>
            <Link
              href="/anketa?package=popular"
              className="whitespace-nowrap rounded-full bg-sage px-3.5 py-1.5 text-xs font-semibold text-white shadow-sm transition-colors hover:bg-sage-dark sm:px-5 sm:py-2 sm:text-sm"
            >
              Skaitmenizuoti
            </Link>
          </nav>
        </div>
      </header>
      <PdfSampleModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </>
  );
}
