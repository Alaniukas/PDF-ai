"use client";

import Image from "next/image";
import Link from "next/link";
import { SAMPLE_PDF_TITLE, SAMPLE_PDF_URL } from "./PdfSampleViewer";

export const PDF_PREVIEW_PAGES = [
  {
    src: "/images/pdf-preview/page-security.png",
    alt: "PDF gido puslapis — DI įrankių pasirinkimas ir saugumas",
    label: "Saugumas",
    style: "left-[0%] top-[10%] w-[68%] -rotate-[12deg] z-10",
  },
  {
    src: "/images/pdf-preview/page-result.png",
    alt: "PDF gido puslapis — Excel žingsniai ir suformatuota lentelė",
    label: "Žingsniai",
    style: "left-[10%] top-[4%] w-[74%] -rotate-[5deg] z-20",
  },
  {
    src: "/images/pdf-preview/page-intro.png",
    alt: "PDF gido įvadas — praktinis DI taikymas biuro užduotyse",
    label: "Įvadas",
    style: "left-[20%] top-0 w-[82%] rotate-[3deg] z-30",
  },
] as const;

function PdfFanStack({ tall = false }: { tall?: boolean }) {
  return (
    <div
      className={`relative mx-auto w-full ${
        tall ? "max-w-[560px]" : "max-w-[520px]"
      }`}
    >
      <div
        className={`relative overflow-hidden rounded-2xl bg-sage-light/35 ${
          tall ? "h-[300px] sm:h-[440px] md:h-[480px]" : "h-[280px] sm:h-[400px] md:h-[440px]"
        }`}
      >
        {PDF_PREVIEW_PAGES.map((page, i) => (
          <div key={page.src} className={`absolute origin-top-left ${page.style}`}>
            <div className="relative overflow-hidden rounded-lg border border-white/90 bg-white shadow-[0_12px_40px_rgba(44,42,38,0.15)] ring-1 ring-black/[0.04]">
              <Image
                src={page.src}
                alt={page.alt}
                width={480}
                height={620}
                className="block h-auto w-full"
                priority={i === 2}
                sizes="(max-width: 640px) 280px, 400px"
              />
              <span className="absolute bottom-2 left-2 rounded-full bg-ink/75 px-2.5 py-0.5 text-[10px] font-medium text-white">
                {page.label}
              </span>
            </div>
          </div>
        ))}

        <span className="absolute right-3 top-3 z-40 rounded-full bg-amber-100 px-3 py-1 text-[10px] font-bold uppercase tracking-wide text-amber-900 shadow-sm">
          Tik pavyzdys
        </span>

        <div className="absolute bottom-5 right-5 z-40 flex h-12 w-12 flex-col items-center justify-center rounded-full border-2 border-white bg-sage text-white shadow-lg">
          <span className="font-serif text-base leading-none">7</span>
          <span className="text-[8px] uppercase tracking-wide opacity-90">psl.</span>
        </div>
      </div>
    </div>
  );
}

export function PdfSamplePreviewCard({
  showLink = true,
  tall = false,
}: {
  showLink?: boolean;
  tall?: boolean;
}) {
  return (
    <div className="rounded-2xl border border-cream-dark bg-white p-3 shadow-xl sm:p-4">
      <PdfFanStack tall={tall} />

      <div className="mt-4 text-center sm:mt-5">
        <p className="font-serif text-sm text-ink sm:text-base">{SAMPLE_PDF_TITLE}</p>
        <p className="mt-1.5 text-xs leading-relaxed text-ink-muted sm:text-sm">
          Jūsų gidas bus individualus — žingsniai, programų naudojimas, promptai ir ekrano
          paaiškinimai
        </p>
        <div className="mt-3 flex flex-wrap justify-center gap-1.5">
          {["Žingsniai", "Excel", "Promptai", "Saugumas"].map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-sage-light/80 px-2.5 py-0.5 text-[11px] font-medium text-sage-dark"
            >
              {tag}
            </span>
          ))}
        </div>
        {showLink && (
          <Link
            href="#pavyzdys"
            className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-sage hover:underline"
          >
            Peržiūrėti visą PDF →
          </Link>
        )}
      </div>
    </div>
  );
}

export function HeroPdfPreview() {
  return (
    <div className="mx-auto w-full min-w-0 max-w-xl lg:max-w-none">
      <div className="relative">
        <div className="absolute -inset-6 rounded-3xl bg-sage-light/25 blur-2xl" />
        <div className="relative">
          <PdfSamplePreviewCard tall />
          <a
            href={SAMPLE_PDF_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 flex items-center justify-center gap-2 text-xs text-ink-light hover:text-sage"
          >
            <span className="inline-flex h-5 w-5 items-center justify-center rounded bg-sage-light text-[10px] text-sage">
              PDF
            </span>
            Atidaryti pilną pavyzdį
          </a>
        </div>
      </div>
    </div>
  );
}
