const audiences = [
  {
    title: "Biuro darbuotojams",
    description: "Administracija, HR, buhalterija — kasdien dirba su dokumentais ir procesais.",
    icon: "📋",
  },
  {
    title: "Viešojo sektoriaus darbuotojams",
    description: "Savivaldybės, ministerijos, įstaigos — kur skaitmenizacija jau nebe pasirinkimas.",
    icon: "🏛️",
  },
  {
    title: "Visiems, kuriems vadovas pasakė „naudok DI“",
    description: "Bet niekas neparodė kaip — ir nėra laiko patiems ieškoti atsakymų internete.",
    icon: "💡",
  },
];

export function ForWhom() {
  return (
    <section className="section-space">
      <div className="layout-shell">
        <p className="section-number mb-3 text-sm font-medium uppercase tracking-widest text-sage">
          Kam skirta
        </p>
        <h2 className="max-w-4xl font-serif text-3xl text-ink md:text-4xl">
          Jei dirbate ofise ir norite aiškumo — ne dar vieno neaiškaus seminaro
        </h2>
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {audiences.map((item) => (
            <div
              key={item.title}
              className="rounded-2xl border border-cream-dark bg-white p-6 shadow-sm"
            >
              <span className="text-2xl">{item.icon}</span>
              <h3 className="mt-3 font-serif text-lg text-ink">{item.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-muted">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
