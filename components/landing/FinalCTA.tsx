import Link from "next/link";

export function FinalCTA() {
  return (
    <section className="section-space">
      <div className="layout-shell">
        <div className="mx-auto max-w-4xl rounded-3xl border border-cream-dark bg-white px-8 py-12 text-center shadow-sm md:px-14 md:py-14">
        <h2 className="font-serif text-3xl text-ink md:text-4xl">
          Pasiruošę supaprastinti savo darbą?
        </h2>
        <p className="mt-4 text-lg text-ink-muted">
          Nebereikia apsimetinėti, kad suprantate DI.
        </p>
        <p className="mt-2 text-ink-muted">
          Užpildykite anketą — per 24 val. gausite asmeninį gidą su žingsniais ir programų naudojimu el. paštu.
        </p>
        <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <Link
            href="/anketa?package=popular"
            className="inline-flex items-center justify-center rounded-full bg-sage px-8 py-3.5 text-base font-medium text-white shadow-sm transition-colors hover:bg-sage-dark"
          >
            Skaitmenizuoti darbą
          </Link>
          <a
            href="#kainos"
            className="inline-flex items-center justify-center rounded-full px-8 py-3.5 text-base font-medium text-ink-muted transition-colors hover:text-ink"
          >
            Peržiūrėti paketus
          </a>
        </div>
        <p className="mt-4 text-sm text-ink-light">Nuo 14 € · Anketa ~10 min</p>
        </div>
      </div>
    </section>
  );
}
