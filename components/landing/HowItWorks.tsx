const steps = [
  {
    number: "01",
    title: "Užpildykite anketą",
    description: "Atsakykite į klausimus apie savo darbą, pareigas, programas. Įveskite el. paštą — juo atsiųsime PDF.",
    time: "~10 min",
  },
  {
    number: "02",
    title: "Pasirinkite paketą ir apmokėkite",
    description: "Po anketos — saugus mokėjimas per Stripe. Vienkartinis mokestis, jokių prenumeratų.",
    time: "~2 min",
  },
  {
    number: "03",
    title: "Gaukite PDF gidą per 24 val.",
    description: "Asmeninis dokumentas su žingsniais, programų naudojimu ir ekrano paaiškinimais — pritaikytas Jūsų situacijai, el. paštu.",
    time: "24 val.",
  },
];

export function HowItWorks() {
  return (
    <section id="kaip-veikia" className="section-space scroll-mt-20">
      <div className="layout-shell">
        <p className="section-number mb-3 text-sm font-medium uppercase tracking-widest text-sage">
          Kaip tai veikia
        </p>
        <h2 className="font-serif text-3xl text-ink md:text-4xl">
          Trys žingsniai. Aiškiai ir paprastai.
        </h2>
        <div className="mt-10 grid gap-5 lg:grid-cols-3">
          {steps.map((step) => (
            <div
              key={step.number}
              className="flex flex-col rounded-2xl border border-cream-dark bg-white p-6 shadow-sm"
            >
              <div className="flex items-center justify-between gap-3">
                <span className="section-number font-serif text-2xl text-sage">{step.number}</span>
                <span className="rounded-full bg-sage-light px-3 py-1 text-xs font-medium text-sage">
                  {step.time}
                </span>
              </div>
              <h3 className="mt-4 font-serif text-xl text-ink">{step.title}</h3>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-ink-muted">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
