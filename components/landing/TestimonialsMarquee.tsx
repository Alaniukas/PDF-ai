const testimonials = [
  {
    name: "Adlona",
    age: 47,
    role: "Buhalterė, Vilnius",
    stars: 5,
    text: "galvojau bus sudėtinga bet viskas labai aiškiai paaiškinta net excel formules supratau per pusvalandį",
  },
  {
    name: "Birutė",
    age: 52,
    role: "Administratorė, Kaunas",
    stars: 4,
    text: "labai padėjo tik galėtų būti dar vienas pavyzdys su word bet šiaip viskas aišku ir naudoju jau antrą savaitę",
  },
  {
    name: "Irena",
    age: 44,
    role: "Personalo specialistė",
    stars: 5,
    text: "uzpildziau anketą vakare o ryte jau turėjau pdf su visais zingsniais tiesiog nusipelne kiekvieno euro",
  },
  {
    name: "Ieva",
    age: 38,
    role: "Projektų koordinatorė",
    stars: 4,
    text: "geras gidas tik video skambutį reikėjo palaukt kelias dienas bet kai susiskambinom viskas susidėliojo",
  },
  {
    name: "Dalia",
    age: 56,
    role: "Viešojo sektoriaus darbuotoja",
    stars: 5,
    text: "bijojau kad bus per sudėtinga techniškai bet parašyta paprastai kaip kolegė paaiškintų prie kavos",
  },
  {
    name: "Onutė",
    age: 49,
    role: "Dokumentų tvarkytoja",
    stars: 4,
    text: "santraukos dabar darau per pusę laiko gal trūksta tik vieno skyriaus apie outlook bet likusiu patenkinta",
  },
  {
    name: "Rita",
    age: 41,
    role: "HR asistentė",
    stars: 5,
    text: "premium paketas vertas nes per video skambutį padėjo viską susidėlioti kompe dabar naudoju kasdien",
  },
  {
    name: "Giedrė",
    age: 35,
    role: "Marketingo specialistė",
    stars: 4,
    text: "patiko kad ne bendras vadovėlis o pagal mano darbą vienintelis minusas kad norėčiau dar ilgesnio checklist",
  },
];

function Stars({ count }: { count: number }) {
  const filled = "★".repeat(count);
  const empty = "☆".repeat(5 - count);
  return (
    <span className="text-amber-500" aria-label={`${count} iš 5 žvaigždučių`}>
      {filled}
      <span className="text-amber-200">{empty}</span>
    </span>
  );
}

function TestimonialCard({
  name,
  age,
  role,
  stars,
  text,
}: (typeof testimonials)[number]) {
  const initial = name.charAt(0);

  return (
    <article className="mx-3 flex w-[300px] shrink-0 flex-col rounded-2xl border border-cream-dark bg-white px-5 py-4 shadow-sm sm:w-[340px]">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-sage-light font-serif text-lg text-sage-dark">
          {initial}
        </div>
        <div className="min-w-0">
          <p className="font-medium text-ink">
            {name}, {age} m.
          </p>
          <p className="truncate text-xs text-ink-light">{role}</p>
        </div>
      </div>
      <div className="mt-2">
        <Stars count={stars} />
      </div>
      <p className="mt-2 text-sm leading-relaxed text-ink-muted">&ldquo;{text}&rdquo;</p>
    </article>
  );
}

export function TestimonialsMarquee() {
  const loop = [...testimonials, ...testimonials];

  return (
    <section className="overflow-hidden border-y border-cream-dark bg-white py-8 md:py-10">
      <div className="layout-shell mb-5 text-center">
        <p className="text-xs font-medium uppercase tracking-widest text-sage">
          Atsiliepimai
        </p>
        <p className="mt-1 font-serif text-xl text-ink md:text-2xl">
          Kas jau gavo savo gidą
        </p>
      </div>

      <div className="relative">
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-white to-transparent sm:w-24" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-white to-transparent sm:w-24" />

        <div className="marquee-track flex w-max">
          {loop.map((item, i) => (
            <TestimonialCard key={`${item.name}-${i}`} {...item} />
          ))}
        </div>
      </div>
    </section>
  );
}
