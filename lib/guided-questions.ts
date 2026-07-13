export type GuidedQuestion = {
  id: string;
  label: string;
  placeholder: string;
};

const WORK_KEYWORDS: Record<string, GuidedQuestion[]> = {
  buhalter: [
    { id: "w1", label: "Su kokiomis ataskaitomis ar dokumentais dirbate dažniausiai?", placeholder: "Pvz.: PVM deklaracijos, sąskaitos, banko išrašai…" },
    { id: "w2", label: "Kokias Excel funkcijas naudojate kasdien?", placeholder: "Pvz.: filtrai, pivot lentelės, formulės…" },
    { id: "w3", label: "Kas užima daugiausiai laiko?", placeholder: "Pvz.: duomenų suvedimas, tikrinimas, suderinimai…" },
    { id: "w4", label: "Ką norėtumėte automatizuoti ar pagreitinti?", placeholder: "Pvz.: mėnesio ataskaitos, sąskaitų registras…" },
  ],
  administr: [
    { id: "w1", label: "Kokius dokumentus ruošiate ar tvarkote?", placeholder: "Pvz.: protokolai, laiškai, sutartys…" },
    { id: "w2", label: "Su kokiais programomis dirbate kasdien?", placeholder: "Pvz.: Word, Outlook, Excel…" },
    { id: "w3", label: "Kokios užduotys kartojasi kiekvieną savaitę?", placeholder: "Pvz.: susitikimų organizavimas, atsakymai į laiškus…" },
    { id: "w4", label: "Kas Jums labiausiai erzina?", placeholder: "Pvz.: tas pats laiškas 10 kartų, rankinis formatavimas…" },
  ],
  hr: [
    { id: "w1", label: "Su kokiais HR procesais dirbate?", placeholder: "Pvz.: atranka, adaptacija, atostogos, dokumentai…" },
    { id: "w2", label: "Kokius dokumentus rengiate dažniausiai?", placeholder: "Pvz.: sutartys, pranešimai, ataskaitos…" },
    { id: "w3", label: "Kur prarandate daugiausiai laiko?", placeholder: "Pvz.: laiškų atsakymai, duomenų suvedimas…" },
    { id: "w4", label: "Ką norėtumėte supaprastinti?", placeholder: "Pvz.: kandidatų santraukos, darbuotojų užklausos…" },
  ],
  personal: [
    { id: "w1", label: "Su kokiais HR procesais dirbate?", placeholder: "Pvz.: atranka, adaptacija, atostogos…" },
    { id: "w2", label: "Kokius dokumentus rengiate dažniausiai?", placeholder: "Pvz.: sutartys, pranešimai…" },
    { id: "w3", label: "Kur prarandate daugiausiai laiko?", placeholder: "Pvz.: laiškų atsakymai…" },
    { id: "w4", label: "Ką norėtumėte supaprastinti?", placeholder: "Pvz.: kandidatų santraukos…" },
  ],
};

const DEFAULT_WORK: GuidedQuestion[] = [
  { id: "w1", label: "Ką dažniausiai darote darbo dienos metu?", placeholder: "Pvz.: ruošiu ataskaitas, atsakinėju į laiškus…" },
  { id: "w2", label: "Su kokiomis programomis dirbate?", placeholder: "Pvz.: Excel, Word, Outlook, Teams…" },
  { id: "w3", label: "Kokios užduotys kartojasi kiekvieną savaitę?", placeholder: "Pvz.: mėnesio suvestinės, susitikimų protokolai…" },
  { id: "w4", label: "Kas Jums labiausiai erzina ar atima laiko?", placeholder: "Pvz.: rankinis kopijavimas, ilgas formatavimas…" },
];

const DEFAULT_DIGITIZE: GuidedQuestion[] = [
  { id: "d1", label: "Kurią užduotį norėtumėte skaitmenizuoti ar pritaikyti DI?", placeholder: "Pvz.: susitikimų santraukos, Excel ataskaitos…" },
  { id: "d2", label: "Kaip ją darote dabar? (trumpai, žingsniais)", placeholder: "Pvz.: 1) atidarau failą, 2) filtruoju, 3) kopijuoju…" },
  { id: "d3", label: "Kiek laiko tai užima per savaitę?", placeholder: "Pvz.: ~3 val. per savaitę" },
  { id: "d4", label: "Kas labiausiai erzina šiame procese?", placeholder: "Pvz.: rankinis suvedimas, klaidos, lėtas formatavimas…" },
  { id: "d5", label: "Kaip turėtų atrodyti idealus rezultatas?", placeholder: "Pvz.: sutaupyčiau 2 val., viskas automatiškai…" },
];

function matchKeyword(jobTitle: string): GuidedQuestion[] | null {
  const lower = jobTitle.toLowerCase();
  for (const [key, questions] of Object.entries(WORK_KEYWORDS)) {
    if (lower.includes(key)) return questions;
  }
  return null;
}

export function getWorkGuidedQuestions(jobTitle: string): GuidedQuestion[] {
  return matchKeyword(jobTitle) ?? DEFAULT_WORK;
}

export function getDigitizeGuidedQuestions(jobTitle: string, maxTasks: number): GuidedQuestion[] {
  const base = DEFAULT_DIGITIZE;
  if (maxTasks <= 1) return base;

  const extra: GuidedQuestion[] = [];
  for (let i = 2; i <= maxTasks; i++) {
    extra.push({
      id: `d_extra_${i}`,
      label: `${i}-oji užduotis, kurią norėtumėte optimizuoti`,
      placeholder: "Trumpai aprašykite užduotį…",
    });
  }
  return [...base, ...extra];
}

export function combineGuidedAnswers(
  questions: GuidedQuestion[],
  answers: Record<string, string>
): string {
  return questions
    .map((q) => {
      const a = answers[q.id]?.trim();
      if (!a) return null;
      return `${q.label}\n${a}`;
    })
    .filter(Boolean)
    .join("\n\n");
}

export type DescriptionMode = "free" | "guided";
