import Link from "next/link";
import { HeroPdfPreview } from "./HeroPdfPreview";

export function Hero() {
  return (
    <section className="section-space relative overflow-hidden pb-8 pt-5 sm:pb-10 sm:pt-0 md:pb-10">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-48 bg-gradient-to-b from-sage-light/35 to-transparent lg:hidden" />

      <div className="layout-shell relative grid items-center gap-8 sm:gap-10 lg:grid-cols-2 lg:gap-14">
        <div className="animate-fade-in">
          <p className="mb-3 text-xs font-medium uppercase tracking-widest text-sage sm:text-sm">
            Asmeninis DI darbo gidas
          </p>

          <div className="max-lg:rounded-2xl max-lg:border max-lg:border-sage/25 max-lg:bg-white/80 max-lg:px-4 max-lg:py-4 max-lg:shadow-[0_8px_30px_rgba(92,122,107,0.12)] lg:hidden">
            <h1 className="font-serif leading-[1.15] min-[400px]:leading-[1.2]">
              <span className="relative block pl-3 text-[1.65rem] font-semibold text-sage-dark min-[400px]:text-[1.85rem]">
                <span
                  aria-hidden
                  className="absolute top-1 bottom-1 left-0 w-1 rounded-full bg-sage"
                />
                Vadovas spaudžia naudoti dirbtinį intelektą
              </span>
              <span className="mt-2 block text-[1.35rem] font-normal text-ink min-[400px]:text-[1.5rem]">
                — o Jūs nežinote, nuo ko pradėti?
              </span>
            </h1>
          </div>

          <h1 className="hidden font-serif text-4xl leading-tight text-ink md:text-5xl lg:block lg:text-[3.25rem]">
            Vadovas spaudžia naudoti dirbtinį intelektą — o Jūs nežinote, nuo ko pradėti?
          </h1>

          <p className="mt-4 text-[0.9375rem] leading-relaxed text-ink-muted sm:hidden">
            Užpildykite trumpą anketą — per{" "}
            <strong className="font-medium text-ink">24 val.</strong> gausite asmeninį PDF gidą su
            žingsniais, promptais ir ekrano paaiškinimais. Be techninio žargono.
          </p>
          <p className="mt-5 hidden text-base leading-relaxed text-ink-muted sm:block sm:text-lg">
            Visi aplinkui sako DI, AI, ChatGPT… o Jūs tiesiog norite normaliai atlikti savo darbą.
            Užpildykite trumpą anketą — ir per{" "}
            <strong className="font-medium text-ink">24 val.</strong> gausite asmeninį PDF gidą:
            žingsniai, programų naudojimas, paruošti promptai ir ekrano paaiškinimai — be
            techninio žargono.
          </p>
          <div className="mt-5 flex flex-col gap-2.5 sm:mt-7 sm:flex-row sm:gap-3">
            <Link
              href="/anketa?package=popular"
              className="inline-flex w-full items-center justify-center rounded-full bg-sage px-6 py-3 text-base font-medium text-white shadow-sm transition-colors hover:bg-sage-dark sm:w-auto sm:py-3.5 sm:px-8"
            >
              Skaitmenizuoti darbą
            </Link>
            <a
              href="#pavyzdys"
              className="inline-flex w-full items-center justify-center rounded-full border border-sage/40 bg-sage-light/40 px-6 py-3 text-base font-medium text-sage-dark transition-colors hover:bg-sage-light sm:w-auto sm:py-3.5 sm:px-8"
            >
              Peržiūrėti PDF pavyzdį
            </a>
          </div>
          <p className="mt-3 text-xs text-ink-light sm:mt-4 sm:text-sm">
            Pirmiausia anketą (~10 min) · Tada apmokėjimas · PDF per 24 val.
          </p>
        </div>

        <HeroPdfPreview compactOnMobile />
      </div>
    </section>
  );
}
