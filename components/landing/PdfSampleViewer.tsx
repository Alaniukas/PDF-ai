"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { PDF_PREVIEW_PAGES } from "./HeroPdfPreview";

export const SAMPLE_PDF_URL = "/sample-guide.pdf";
export const SAMPLE_PDF_TITLE = "DI Taikymo Gidas: Excel Procesų Optimizavimas";

function SampleDisclaimer({ compact }: { compact?: boolean }) {
  return (
    <div
      className={`rounded-xl border border-amber-200/80 bg-amber-50/90 ${
        compact ? "px-3 py-2 text-xs" : "px-4 py-3 text-sm"
      }`}
    >
      <p className="font-medium text-amber-900">
        ⚠ Tai tik pavyzdys — ne Jūsų asmeninis gidas
      </p>
      <p className={`mt-1 text-amber-800/90 ${compact ? "text-xs" : ""}`}>
        Jūsų PDF bus parašytas individualiai: žingsniai, programų naudojimas, promptai ir
        ekrano paaiškinimai — pagal Jūsų anketą.
      </p>
    </div>
  );
}

export function PdfEmbed({
  className = "",
  height = "min(70vh, 720px)",
}: {
  className?: string;
  height?: string;
}) {
  return (
    <div
      className={`overflow-hidden rounded-xl border-2 border-sage/20 bg-white shadow-inner ${className}`}
    >
      <div className="flex items-center gap-2 border-b border-cream-dark bg-cream px-4 py-2.5">
        <span className="rounded-full bg-sage/15 px-2.5 py-0.5 text-xs font-medium uppercase tracking-wider text-sage">
          Pavyzdys
        </span>
        <span className="truncate text-xs text-ink-muted">{SAMPLE_PDF_TITLE}</span>
      </div>
      <iframe
        src={`${SAMPLE_PDF_URL}#view=FitH&toolbar=0&navpanes=0`}
        title={SAMPLE_PDF_TITLE}
        className="w-full border-0 bg-white"
        style={{ height }}
      />
    </div>
  );
}

export function PdfSampleModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  useEffect(() => {
    if (open) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-ink/50 p-0 sm:items-center sm:p-4"
      onClick={onClose}
    >
      <div
        className="flex max-h-[95vh] w-full max-w-4xl flex-col overflow-hidden rounded-t-2xl bg-cream sm:rounded-2xl shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4 border-b border-cream-dark px-5 py-4 sm:px-6">
          <div>
            <p className="text-xs font-medium uppercase tracking-widest text-sage">
              PDF pavyzdys
            </p>
            <h3 className="mt-1 font-serif text-xl text-ink sm:text-2xl">{SAMPLE_PDF_TITLE}</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="shrink-0 rounded-full p-2 text-ink-light transition-colors hover:bg-cream-dark hover:text-ink cursor-pointer"
            aria-label="Uždaryti"
          >
            ✕
          </button>
        </div>

        <div className="overflow-y-auto px-5 py-4 sm:px-6">
          <SampleDisclaimer />
          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            {PDF_PREVIEW_PAGES.map((page) => (
              <div
                key={page.src}
                className="overflow-hidden rounded-xl border border-cream-dark bg-white"
              >
                <Image
                  src={page.src}
                  alt={page.alt}
                  width={400}
                  height={520}
                  className="h-auto w-full"
                />
                <p className="border-t border-cream-dark px-3 py-2 text-xs text-ink-muted">
                  {page.label}
                </p>
              </div>
            ))}
          </div>
          <div className="mt-4 flex flex-wrap gap-3">
            <a
              href={SAMPLE_PDF_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center rounded-full bg-sage px-5 py-2.5 text-sm font-medium text-white hover:bg-sage-dark"
            >
              Atidaryti naujame lange
            </a>
            <a
              href={SAMPLE_PDF_URL}
              download
              className="inline-flex items-center justify-center rounded-full border border-sage px-5 py-2.5 text-sm font-medium text-sage hover:bg-sage-light"
            >
              Atsisiųsti pavyzdį
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export function PdfSampleButton({
  variant = "header",
  onClick,
}: {
  variant?: "header" | "pill";
  onClick: () => void;
}) {
  if (variant === "pill") {
    return (
      <button
        type="button"
        onClick={onClick}
        className="inline-flex items-center gap-2 rounded-full border border-sage/40 bg-sage-light/60 px-4 py-2 text-sm font-medium text-sage-dark transition-colors hover:bg-sage-light cursor-pointer"
      >
        <span className="rounded bg-white/80 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-sage">
          Pavyzdys
        </span>
        Peržiūrėti PDF
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex items-center gap-1.5 rounded-full border border-sage bg-sage-light/50 px-3 py-1.5 text-sm font-medium text-sage-dark transition-colors hover:bg-sage-light cursor-pointer"
    >
      <span className="text-[10px] font-bold uppercase tracking-wide">PDF</span>
      Pavyzdys
    </button>
  );
}

export { SampleDisclaimer };
