import Link from "next/link";
import { PackagePrice } from "@/components/CheckoutButton";
import { PACKAGE_LIST } from "@/lib/packages";

export function PricingSection() {
  return (
    <section id="kainos" className="section-space scroll-mt-20 border-y border-cream-dark bg-cream">
      <div className="layout-shell">
        <p className="section-number mb-4 text-sm font-medium uppercase tracking-widest text-sage">
          Paketai
        </p>
        <h2 className="font-serif text-3xl text-ink md:text-4xl">
          Pasirinkite, kas Jums tinka
        </h2>
        <p className="mt-4 max-w-2xl text-ink-muted">
          Pirmiausia užpildysite anketą, tada apmokėsite pasirinktą paketą. Gausite ne tik
          promptus — o pilną gidą su žingsniais, programų naudojimu ir ekrano paaiškinimais.
          PDF per 24 val. el. paštu.
        </p>

        <div className="mt-10 grid gap-5 lg:grid-cols-3">
          {PACKAGE_LIST.map((pkg) => {
            const isPopular = pkg.id === "popular";
            return (
              <div
                key={pkg.id}
                className={`relative flex flex-col rounded-2xl border p-5 sm:p-6 md:p-8 ${
                  isPopular
                    ? "border-sage bg-white shadow-lg ring-1 ring-sage/20 lg:scale-[1.02]"
                    : "border-cream-dark bg-white"
                }`}
              >
                {pkg.badge && (
                  <span
                    className={`absolute -top-3 left-6 rounded-full px-3 py-1 text-xs font-medium ${
                      isPopular ? "bg-sage text-white" : "bg-ink text-white"
                    }`}
                  >
                    {pkg.badge}
                  </span>
                )}

                <div className="mb-6">
                  <p className="text-sm font-medium text-sage">{pkg.name}</p>
                  <h3 className="mt-1 font-serif text-xl text-ink md:text-2xl">
                    {pkg.subtitle}
                  </h3>
                  <p className="mt-4 font-serif text-4xl text-ink">
                    <PackagePrice eur={pkg.priceEur} />
                  </p>
                  <p className="mt-1 text-xs text-ink-light">PDF {pkg.pageCount}</p>
                  <p className="mt-3 text-sm leading-relaxed text-ink-muted">
                    {pkg.description}
                  </p>
                </div>

                <ul className="mb-6 flex-1 space-y-3">
                  {pkg.includes.map((item) => (
                    <li key={item} className="flex gap-2 text-sm text-ink-muted">
                      <span className="mt-0.5 shrink-0 text-sage">✓</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>

                <div className="mb-6 rounded-xl bg-cream px-4 py-3 text-xs text-ink-muted">
                  <p>
                    <strong className="font-medium text-ink">Rezultatas:</strong> {pkg.result}
                  </p>
                </div>

                <Link
                  href={`/anketa?package=${pkg.id}`}
                  className={`inline-flex w-full items-center justify-center rounded-full px-8 py-3.5 text-base font-medium transition-colors ${
                    isPopular
                      ? "bg-sage text-white hover:bg-sage-dark shadow-sm"
                      : "border border-sage text-sage hover:bg-sage-light"
                  }`}
                >
                  Pradėti — {pkg.priceEur} €
                </Link>
              </div>
            );
          })}
        </div>

        <p className="mt-10 text-center text-sm text-ink-light">
          Saugus mokėjimas per Stripe · Vienkartinis mokestis · Jokių prenumeratų
        </p>
      </div>
    </section>
  );
}
