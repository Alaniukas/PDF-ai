import Link from "next/link";
import { HeroPdfPreview } from "./HeroPdfPreview";

export function Hero() {
  return (
    <section className="section-space relative overflow-hidden">
      <div className="layout-shell grid items-center gap-10 lg:grid-cols-2 lg:gap-14">
        <div className="animate-fade-in">
          <p className="mb-3 text-sm font-medium uppercase tracking-widest text-sage">
            Asmeninis DI darbo gidas
          </p>
          <h1 className="font-serif text-4xl leading-tight text-ink md:text-5xl lg:text-[3.25rem]">
            Vadovas spaudžia naudoti dirbtinį intelektą — o Jūs nežinote, nuo ko pradėti?
          </h1>
          <p className="mt-5 text-lg leading-relaxed text-ink-muted">
            Visi aplinkui sako DI, AI, ChatGPT… o Jūs tiesiog norite normaliai atlikti savo darbą.
            Užpildykite trumpą anketą — ir per{" "}
            <strong className="font-medium text-ink">24 val.</strong> gausite asmeninį PDF gidą:
            žingsniai, programų naudojimas, paruošti promptai ir ekrano paaiškinimai — be
            techninio žargono.
          </p>
          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/anketa?package=popular"
              className="inline-flex items-center justify-center rounded-full bg-sage px-8 py-3.5 text-base font-medium text-white shadow-sm transition-colors hover:bg-sage-dark"
            >
              Skaitmenizuoti darbą
            </Link>
            <a
              href="#pavyzdys"
              className="inline-flex items-center justify-center rounded-full border border-sage/40 bg-sage-light/40 px-8 py-3.5 text-base font-medium text-sage-dark transition-colors hover:bg-sage-light"
            >
              Peržiūrėti PDF pavyzdį
            </a>
          </div>
          <p className="mt-4 text-sm text-ink-light">
            Pirmiausia anketą (~10 min) · Tada apmokėjimas · PDF per 24 val.
          </p>
        </div>
        <HeroPdfPreview />
      </div>
    </section>
  );
}
