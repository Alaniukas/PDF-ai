import { z } from "zod";

export const AGE_RANGES = ["30–35", "36–40", "41–45", "46–50", "51–55", "56+"] as const;
export const EMPLOYER_TYPES = [
  "Privatus sektorius",
  "Viešasis sektorius (savivaldybė, ministerija…)",
  "Ne pelno org.",
  "Kita",
] as const;
export const YEARS_IN_ROLE = ["Mažiau nei 1 metus", "1–3 metai", "3–5 metai", "5–10 metų", "Daugiau nei 10 metų"] as const;
export const YEARS_AT_EMPLOYER = ["Mažiau nei 1 metus", "1–3 metai", "3–5 metai", "5–10 metų", "Daugiau nei 10 metų"] as const;
export const TEAM_SIZES = ["Dirbu vienas/viena", "2–5 žmonės", "6–15 žmonių", "Daugiau nei 15"] as const;
export const DEVICE_TYPE = ["Windows kompiuteris", "Mac kompiuteris", "Abu (skirtingose vietose)", "Kita"] as const;
export const HOURS_PER_WEEK = ["Mažiau nei 1 val.", "1–3 val.", "3–5 val.", "5–10 val.", "Daugiau nei 10 val."] as const;
export const AI_PRESSURE = [
  "Taip, aktyviai spaudžia",
  "Taip, paminėjo kelis kartus",
  "Ne, bet kolegos naudoja",
  "Ne",
] as const;
export const TOOLS_USED = [
  "Microsoft Word",
  "Excel",
  "Outlook",
  "Teams",
  "Google Workspace",
  "SAP",
  "Odoo",
  "1C",
  "Custom CRM",
  "Kita",
] as const;
export const COMPANY_AI_LICENSE = [
  "Taip — įmonė turi oficialią DI licenciją darbuotojams",
  "Ne — naudojame nemokamus ar asmeninius įrankius",
  "Nežinau",
] as const;
export const COMPANY_AI_LICENSE_YES = COMPANY_AI_LICENSE[0];
export const COMPANY_AI_LICENSE_TOOLS = [
  "Microsoft 365 Copilot",
  "ChatGPT Team / Enterprise",
  "Google Gemini (Workspace)",
  "GitHub Copilot",
  "Kita",
] as const;
export const AI_TOOLS = [
  "ChatGPT",
  "Copilot",
  "Gemini",
  "Claude",
  "Midjourney",
  "Dar nebandžiau",
  "Kita",
] as const;
export const AI_EXPERIENCE = [
  "Visiškai nauja",
  "Bandžiau kelis kartus",
  "Naudoju retkarčiais",
  "Naudoju reguliariai",
] as const;
export const AI_FEARS = [
  "Padarysiu klaidą",
  "Duomenų saugumas",
  "Nežinau nuo ko pradėti",
  "Vadovas nematys vertės",
  "Techniškai per sudėtinga",
  "Kita",
] as const;
export const DELIVERY_OPTIONS = ["El. paštu", "El. paštu + spausdintą versiją (papildomas mokestis vėliau)"] as const;

export const VIDEO_PLATFORMS = ["Microsoft Teams", "Zoom", "Nesvarbu — patogiau kaip"] as const;

export const stepSchemas = {
  about: z.object({
    name: z.string().min(2, "Įveskite vardą ir pavardę"),
    email: z.string().email("Įveskite teisingą el. paštą"),
    age_range: z.enum(AGE_RANGES, { required_error: "Pasirinkite amžių" }),
    city: z.string().min(2, "Įveskite miestą ar regioną"),
  }),
  work: z.object({
    employer_type: z.enum(EMPLOYER_TYPES, { required_error: "Pasirinkite sektorių" }),
    employer_name: z.string().optional(),
    job_title: z.string().min(2, "Įveskite pareigas"),
    years_in_role: z.enum(YEARS_IN_ROLE, { required_error: "Pasirinkite stažą pareigose" }),
    years_at_employer: z.enum(YEARS_AT_EMPLOYER, { required_error: "Pasirinkite, kiek dirbate šioje vietoje" }),
    team_size: z.enum(TEAM_SIZES, { required_error: "Pasirinkite komandos dydį" }),
    device_type: z.enum(DEVICE_TYPE, { required_error: "Pasirinkite, kokį kompiuterį naudojate" }),
    device_usage: z.string().optional(),
    work_description_mode: z.enum(["free", "guided"]).optional(),
    responsibilities: z.string().min(30, "Aprašykite savo darbą bent 30 simbolių"),
    weekly_tasks: z.string().min(20, "Aprašykite savo darbus bent 20 simbolių"),
  }),
  digitize: z.object({
    ai_pressure: z.enum(AI_PRESSURE, { required_error: "Pasirinkite variantą" }),
    ai_pressure_details: z.string().optional(),
    digitize_mode: z.enum(["free", "guided"]).optional(),
    digitize_what: z.string().min(20, "Aprašykite, ką norite skaitmenizuoti"),
    current_process: z.string().min(20, "Aprašykite, kaip darote dabar"),
    pain_processes: z.string().min(15, "Aprašykite, kas labiausiai erzina"),
    repeat_tasks: z.string().min(20, "Aprašykite pakartotines užduotis"),
    hours_per_week: z.enum(HOURS_PER_WEEK, { required_error: "Pasirinkite laiko sąnaudas" }),
    desired_outcome: z.string().min(15, "Aprašykite, ko norite pasiekti"),
  }),
  tools: z.object({
    tools_used: z.array(z.enum(TOOLS_USED)).min(1, "Pasirinkite bent vieną programą"),
    tools_other: z.string().optional(),
    company_ai_license: z.enum(COMPANY_AI_LICENSE, {
      required_error: "Pasirinkite, ar įmonė turi DI licenciją",
    }),
    company_ai_license_tools: z.array(z.enum(COMPANY_AI_LICENSE_TOOLS)).optional(),
    company_ai_license_details: z.string().optional(),
    ai_tools_tried: z.array(z.enum(AI_TOOLS)).min(1, "Pasirinkite bent vieną variantą"),
    ai_experience: z.enum(AI_EXPERIENCE, { required_error: "Pasirinkite patirties lygį" }),
    ai_fears: z.array(z.enum(AI_FEARS)).min(1, "Pasirinkite bent vieną variantą"),
    ai_fears_other: z.string().optional(),
  }),
  photos: z.object({
    screenshot_comments: z.string().optional(),
    additional_context: z.string().optional(),
    delivery_preference: z.enum(DELIVERY_OPTIONS, { required_error: "Pasirinkite pristatymo būdą" }),
    video_call_platform: z.enum(VIDEO_PLATFORMS).optional(),
    video_call_times: z.string().optional(),
    consent: z.literal(true, {
      errorMap: () => ({ message: "Turite sutikti su duomenų naudojimu" }),
    }),
  }),
};

export const fullFormSchema = stepSchemas.about
  .merge(stepSchemas.work)
  .merge(stepSchemas.digitize)
  .merge(stepSchemas.tools)
  .merge(stepSchemas.photos);

export type IntakeFormData = z.infer<typeof fullFormSchema>;

export const FORM_STEPS = [
  { id: "about", title: "Apie Jus", description: "Pagrindinė informacija" },
  { id: "work", title: "Jūsų darbas", description: "Pareigos ir kasdienė veikla" },
  { id: "digitize", title: "DI ir skaitmenizacija", description: "Ką norite pakeisti" },
  { id: "tools", title: "Programos", description: "Ką naudojate kasdien" },
  { id: "photos", title: "Nuotraukos", description: "Ekrano vaizdai ir komentarai" },
] as const;

export type StepId = (typeof FORM_STEPS)[number]["id"];
