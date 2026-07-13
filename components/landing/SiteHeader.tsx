"use client";

import { useState } from "react";
import { PdfSampleButton, PdfSampleModal } from "./PdfSampleViewer";
import { SiteLogo } from "./SiteLogo";

export function SiteHeader() {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-cream-dark bg-cream/95 py-3 backdrop-blur-sm">
        <div className="layout-shell flex items-center justify-between gap-4">
          <SiteLogo className="shrink-0" />
          <nav className="flex items-center gap-2 text-sm sm:gap-5">
            <PdfSampleButton variant="header" onClick={() => setModalOpen(true)} />
            <a
              href="#pavyzdys"
              className="text-ink-muted transition-colors hover:text-ink sm:hidden"
            >
              Pavyzdys ↓
            </a>
            <a
              href="#kaip-veikia"
              className="hidden text-ink-muted transition-colors hover:text-ink sm:inline"
            >
              Kaip veikia
            </a>
            <a href="#kainos" className="text-ink-muted transition-colors hover:text-ink">
              Paketai
            </a>
            <a
              href="#apie-mus"
              className="hidden text-ink-muted transition-colors hover:text-ink md:inline"
            >
              Apie mus
            </a>
          </nav>
        </div>
      </header>
      <PdfSampleModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </>
  );
}
