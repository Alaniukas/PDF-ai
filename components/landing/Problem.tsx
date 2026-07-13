const problems = [
  "Kolegos jau naudoja ChatGPT, o Jūs dar nežinote, ar galima",
  "Vadovas prašo „skaitmenizuoti procesus“, bet niekas nepaaiškino kaip",
  "Bijote padaryti klaidą arba atskleisti konfidencialius duomenis",
  "Nėra laiko mokytis — reikia sprendimo, kuris veikia rytoj",
];

export function Problem() {
  return (
    <section className="section-space border-y border-cream-dark bg-white">
      <div className="layout-shell">
        <p className="section-number mb-3 text-sm font-medium uppercase tracking-widest text-sage">
          Problema
        </p>
        <h2 className="max-w-3xl font-serif text-3xl text-ink md:text-4xl">
          Atpažįsti save bent vienoje situacijoje?
        </h2>
        <ul className="mt-8 grid gap-4 md:grid-cols-2">
          {problems.map((item) => (
            <li
              key={item}
              className="flex gap-4 rounded-2xl border border-cream-dark bg-cream px-5 py-4 text-ink-muted"
            >
              <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-sage-light text-sm text-sage">
                ✓
              </span>
              <span className="leading-relaxed">{item}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
