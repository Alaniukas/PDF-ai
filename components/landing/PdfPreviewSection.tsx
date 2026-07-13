import Link from "next/link";
import { PdfSamplePreviewCard } from "./HeroPdfPreview";
import { SAMPLE_PDF_TITLE, SAMPLE_PDF_URL } from "./PdfSampleViewer";

export function PdfPreviewSection() {
  const previewSections = [
    "Konkretūs žingsniai Jūsų programoms (Excel, Word, Outlook…)",
    "Kur spustelėti, ką kopijuoti, ką įklijuoti — ne tik promptai",
    "Ekrano nuotraukų paaiškinimai su rodyklėmis ir komentarais",
    "Paruošti promptai, formulės, šablonai ir saugumo taisyklės",
    "Kasdienis checklist — ką daryti kiekvieną savaitę",
  ];

  return (
    <section id="pavyzdys" className="section-space scroll-mt-20 border-y border-cream-dark bg-white">
      <div className="layout-shell">
        <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-4 py-1.5 text-xs font-medium uppercase tracking-wider text-amber-900">
          ⚠ Tik pavyzdys — Jūsų gidas bus individualus
        </div>
        <p className="section-number mb-3 text-sm font-medium uppercase tracking-widest text-sage">
          PDF pavyzdys
        </p>
        <h2 className="font-serif text-3xl text-ink md:text-4xl">Štai kaip atrodo tikras gidas</h2>
        <p className="mt-3 max-w-3xl text-ink-muted">
          Peržiūrėkite pavyzdinį dokumentą „{SAMPLE_PDF_TITLE}". Tai iliustracija —{" "}
          <strong className="font-medium text-ink">
            Jūsų PDF bus parašytas pagal Jūsų anketos atsakymus
          </strong>
          , Jūsų pareigas, programas ir ekrano nuotraukas. Gausite per 24 val. el. paštu.
        </p>

        <div className="mt-10 grid items-start gap-10 xl:grid-cols-2 xl:gap-14">
          <div className="order-2 xl:order-1">
            <ul className="grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
              {previewSections.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <span className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-sage text-xs text-white">
                    ✓
                  </span>
                  <span className="text-sm text-ink-muted">{item}</span>
                </li>
              ))}
            </ul>
            <div className="mt-8 rounded-2xl border border-cream-dark bg-cream p-6">
              <p className="font-serif text-lg text-ink">Kuo skirsis Jūsų gidas?</p>
              <ul className="mt-4 grid gap-2 text-sm text-ink-muted sm:grid-cols-2 xl:grid-cols-1">
                <li>· Parašytas pagal Jūsų konkrečią darbo situaciją</li>
                <li>· Pritaikytas programoms, kurias naudojate kasdien</li>
                <li>· Įtraukia Jūsų užduotis — ne bendrą Excel pavyzdį</li>
                <li>· Su ekrano nuotraukų paaiškinimais, jei įkelsite</li>
                <li>· Kalba paprasta — be techninio žargono</li>
              </ul>
              <Link
                href="/anketa?package=popular"
                className="mt-6 inline-flex rounded-full bg-sage px-6 py-2.5 text-sm font-medium text-white hover:bg-sage-dark"
              >
                Gauti savo asmeninį gidą
              </Link>
            </div>
          </div>

          <div className="order-1 xl:order-2 xl:sticky xl:top-24">
            <PdfSamplePreviewCard showLink={false} tall />
            <div className="mt-5 flex flex-wrap gap-3">
              <a
                href={SAMPLE_PDF_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center rounded-full border border-sage px-6 py-3 text-sm font-medium text-sage hover:bg-sage-light"
              >
                Atidaryti naujame lange
              </a>
              <a
                href={SAMPLE_PDF_URL}
                download
                className="inline-flex items-center justify-center rounded-full border border-cream-dark px-6 py-3 text-sm font-medium text-ink-muted hover:text-ink"
              >
                Atsisiųsti
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
