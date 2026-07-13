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

function digitizeTaskQuestions(taskNum: number, totalTasks: number): GuidedQuestion[] {
  const multi = totalTasks > 1;

  return [
    {
      id: `t${taskNum}_what`,
      label: multi
        ? "Ką norėtumėte optimizuoti?"
        : "Kurią užduotį norėtumėte skaitmenizuoti ar pritaikyti DI?",
      placeholder: "Pvz.: susitikimų santraukos, Excel ataskaitos, laiškų atsakymai…",
    },
    {
      id: `t${taskNum}_how`,
      label: "Kaip ją darote dabar? (žingsniais)",
      placeholder: "Pvz.: 1) atidarau failą, 2) filtruoju duomenis, 3) kopijuoju į ataskaitą…",
    },
    {
      id: `t${taskNum}_pain`,
      label: "Kas labiausiai erzina šiame procese?",
      placeholder: "Pvz.: rankinis suvedimas, klaidos, lėtas formatavimas…",
    },
    {
      id: `t${taskNum}_goal`,
      label: "Kaip turėtų atrodyti idealus rezultatas?",
      placeholder: "Pvz.: sutaupyčiau 2 val., viskas automatiškai, mažiau klaidų…",
    },
  ];
}

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

export function getDigitizeGuidedQuestions(_jobTitle: string, maxTasks: number): GuidedQuestion[] {
  const questions: GuidedQuestion[] = [];
  for (let i = 1; i <= maxTasks; i++) {
    questions.push(...digitizeTaskQuestions(i, maxTasks));
  }
  return questions;
}

export function buildDigitizeFieldsFromGuided(
  maxTasks: number,
  answers: Record<string, string>
): {
  digitize_what: string;
  current_process: string;
  pain_processes: string;
  desired_outcome: string;
  repeat_tasks: string;
} {
  const whats: string[] = [];
  const hows: string[] = [];
  const pains: string[] = [];
  const goals: string[] = [];

  for (let i = 1; i <= maxTasks; i++) {
    const what = answers[`t${i}_what`]?.trim();
    const how = answers[`t${i}_how`]?.trim();
    const pain = answers[`t${i}_pain`]?.trim();
    const goal = answers[`t${i}_goal`]?.trim();

    if (what) {
      whats.push(maxTasks > 1 ? `${i} užduotis: ${what}` : what);
    }
    if (how) {
      hows.push(maxTasks > 1 ? `${i} užduotis:\n${how}` : how);
    }
    if (pain) {
      pains.push(maxTasks > 1 ? `${i} užduotis: ${pain}` : pain);
    }
    if (goal) {
      goals.push(maxTasks > 1 ? `${i} užduotis: ${goal}` : goal);
    }
  }

  const digitize_what = whats.join("\n\n");
  const current_process = hows.join("\n\n");
  const pain_processes = pains.join("\n\n");
  const desired_outcome = goals.join("\n\n");

  return {
    digitize_what,
    current_process,
    pain_processes,
    desired_outcome,
    repeat_tasks: digitize_what,
  };
}

export function digitizeTaskSectionTitle(questionId: string, maxTasks: number): string | null {
  const match = questionId.match(/^t(\d+)_what$/);
  if (!match || maxTasks <= 1) return null;
  return `${match[1]} užduotis`;
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
