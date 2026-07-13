"use client";

import { useState } from "react";

const faqs = [
  {
    q: "Kaip vyksta užsakymas?",
    a: "Pirmiausia užpildote anketą (įskaitant el. paštą), tada apmokate pasirinktą paketą per Stripe. PDF atsiunčiame el. paštu per 24 valandas.",
  },
  {
    q: "Kuo skiriasi paketai?",
    a: "„Viena užduotis“ (14 €) — gidas vienai užduočiai (iki 5 psl.) su žingsniais ir programų naudojimu. „Darbo dienos optimizavimas“ (22 €) — iki 3 užduočių, PDF iki 12 psl. su checklist. „Premium“ (43 €) — tas pats + 15 min. video skambutis pagalbai įdiegti.",
  },
  {
    q: "Kas yra šis PDF?",
    a: "Tai asmeninis darbo gidas, parašytas pagal Jūsų atsakymus anketoje. Ne bendras DI vadovėlis — o konkretūs žingsniai, programų naudojimas, paruošti promptai ir ekrano nuotraukų paaiškinimai Jūsų pareigoms.",
  },
  {
    q: "Kiek laiko trunka?",
    a: "Anketą užpildysite per ~10 minučių. PDF paruošime ir atsiųsime el. paštu per 24 valandas.",
  },
  {
    q: "Ar reikia techninių žinių?",
    a: "Ne. Gidas rašomas paprasta kalba, be žargono. Jei mokate naudotis el. paštu ir Word — pakaks.",
  },
  {
    q: "Ar mano duomenys saugūs?",
    a: "Taip. Duomenys naudojami tik Jūsų PDF rengimui, saugomi saugioje duomenų bazėje ir nenaudojami kitiems tikslams.",
  },
  {
    q: "Ką daryti, jei PDF netinka?",
    a: "Susisiekite el. paštu — aptarsime ir pakoreguosime. Jūsų pasitenkinimas svarbus.",
  },
];

export function FAQ() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section className="section-space border-y border-cream-dark bg-white">
      <div className="layout-shell max-w-5xl">
        <p className="section-number mb-4 text-sm font-medium uppercase tracking-widest text-sage">
          DUK
        </p>
        <h2 className="font-serif text-3xl text-ink md:text-4xl">Dažniausiai užduodami klausimai</h2>
        <div className="mt-10 divide-y divide-cream-dark">
          {faqs.map((item, i) => (
            <div key={item.q} className="py-5">
              <button
                type="button"
                onClick={() => setOpen(open === i ? null : i)}
                className="flex w-full items-center justify-between text-left cursor-pointer"
              >
                <span className="font-medium text-ink pr-4">{item.q}</span>
                <span className="shrink-0 text-sage">{open === i ? "−" : "+"}</span>
              </button>
              {open === i && (
                <p className="mt-3 leading-relaxed text-ink-muted">{item.a}</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
