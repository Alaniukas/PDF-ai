export type PackageId = "starter" | "popular" | "premium";

export type Package = {
  id: PackageId;
  name: string;
  subtitle: string;
  priceEur: number;
  priceCents: number;
  badge: string | null;
  description: string;
  includes: string[];
  result: string;
  audience: string;
  maxTasks: number;
  pageCount: string;
  hasVideoCall: boolean;
};

export const PACKAGES: Record<PackageId, Package> = {
  starter: {
    id: "starter",
    name: "Švelnus startas",
    subtitle: "Viena užduotis",
    priceEur: 14,
    priceCents: 1400,
    badge: null,
    description:
      "Išbandykite paslaugą su minimalia rizika — viena konkreti užduotis, pilnai išnarpliota.",
    includes: [
      "Aprašote vieną konkrečią užduotį (pvz. susitikimo suvestinės, lentelės formatavimas)",
      "Žingsnis po žingsnio instrukcijos — ką spustelėti ir kur ką įklijuoti",
      "Kaip naudoti Jūsų programas (Excel, Word, Outlook ir kt.) su DI",
      "Paruošti promptai + ekrano vietų paaiškinimai su nuotraukomis",
      "Asmeninis PDF gidas (iki 5 psl.) — tik Jūsų užduočiai",
    ],
    result:
      "Aiškus, praktiškas gidas — ne teorija, o konkretūs veiksmai vienai problemai.",
    audience: "Norintiems pamėginti ir pamatyti, kaip tai veikia praktikoje.",
    maxTasks: 1,
    pageCount: "iki 5 psl.",
    hasVideoCall: false,
  },
  popular: {
    id: "popular",
    name: "Darbo dienos optimizavimas",
    subtitle: "Iki 3 užduočių",
    priceEur: 22,
    priceCents: 2200,
    badge: "Populiariausias",
    description:
      "Didžiausia vertė — pilnas darbo dienos gidas su sprendimais, programomis ir saugumo taisyklėmis.",
    includes: [
      "Aprašote iki 3 kasdienių užduočių, kurios atima daugiausiai laiko",
      "Išsamus PDF gidas (iki 12 psl.) — kiekvienai užduočiai atskiras skyrius",
      "Detalūs žingsniai: programų meniu, mygtukai, ką kopijuoti ir kur įklijuoti",
      "Paruošti promptai, formulės, šablonai ir ekrano nuotraukų paaiškinimai",
      "DI saugumo taisyklės + kasdienis kontrolinis sąrašas (checklist)",
    ],
    result:
      "Pilnas gidas, kuris palengvina visą darbo dieną — ne tik vieną užduotį.",
    audience: "Tiems, kurie rimtai nori palengvinti kasdienį darbą ofise.",
    maxTasks: 3,
    pageCount: "iki 12 psl.",
    hasVideoCall: false,
  },
  premium: {
    id: "premium",
    name: "Gidas + Pagalba įdiegiant",
    subtitle: "Premium",
    priceEur: 43,
    priceCents: 4300,
    badge: "Premium",
    description:
      "Viskas iš populiariausio paketo + asmeninė pagalba, kad viskas veiktų Jūsų kompiuteryje.",
    includes: [
      "Viskas, kas yra „Darbo dienos optimizavimo“ pakete (iki 12 psl.)",
      "15 min. video skambutis (Teams / Zoom) — įdiegiam kartu",
      "Padedame įkelti formules į Excel, susitvarkyti ChatGPT ir DI nustatymus",
      "Peržiūrime Jūsų ekrano nuotraukas ir paaiškiname gyvai",
      "Garantija, kad viskas veiks Jūsų kompiuteryje",
    ],
    result:
      "Ne tik gidas — bet ir užtikrinimas, kad viskas tikrai veiks praktikoje.",
    audience: "Tiems, kurie nori maksimalaus dėmesio ir saugumo.",
    maxTasks: 3,
    pageCount: "iki 12 psl.",
    hasVideoCall: true,
  },
};

export const PACKAGE_LIST: Package[] = [
  PACKAGES.starter,
  PACKAGES.popular,
  PACKAGES.premium,
];

export function getPackage(id: string | null | undefined): Package | null {
  if (!id || !(id in PACKAGES)) return null;
  return PACKAGES[id as PackageId];
}

export function formatPrice(eur: number): string {
  return `${eur.toFixed(0).replace(".", ",")} €`;
}

export const MIN_PRICE_EUR = PACKAGES.starter.priceEur;
export const DELIVERY_HOURS = 24;
