"use client";

import { useState, useEffect, useRef } from "react";
import {
  AGE_RANGES,
  AI_EXPERIENCE,
  AI_FEARS,
  AI_PRESSURE,
  AI_TOOLS,
  COMPANY_AI_LICENSE,
  COMPANY_AI_LICENSE_TOOLS,
  COMPANY_AI_LICENSE_YES,
  DELIVERY_OPTIONS,
  DEVICE_TYPE,
  EMPLOYER_TYPES,
  FORM_STEPS,
  HOURS_PER_WEEK,
  StepId,
  TEAM_SIZES,
  TOOLS_USED,
  VIDEO_PLATFORMS,
  YEARS_AT_EMPLOYER,
  YEARS_IN_ROLE,
  stepSchemas,
} from "@/lib/form-schema";
import {
  buildDigitizeFieldsFromGuided,
  combineGuidedAnswers,
  digitizeTaskSectionTitle,
  getDigitizeGuidedQuestions,
  getWorkGuidedQuestions,
} from "@/lib/guided-questions";
import { hasAnalyticsConsent } from "@/lib/analytics/consent";
import {
  createMetaEventId,
  getMetaBrowserIds,
} from "@/lib/analytics/meta-client";
import {
  trackFormAbandon,
  trackFormStart,
  trackFormStep,
  trackInitiateCheckout,
} from "@/lib/analytics/track";
import { Package, PackageId } from "@/lib/packages";
import { GuidedOrFreeField } from "./GuidedOrFreeField";
import { PhotoItem, PhotoUpload } from "./PhotoUpload";
import { normalizeImageFile } from "@/lib/image-upload";

type Props = {
  packageId: PackageId;
  packageInfo: Package;
};

const emptyForm = {
  name: "",
  email: "",
  age_range: "36–40" as const,
  city: "",
  employer_type: "Privatus sektorius" as const,
  employer_name: "",
  job_title: "",
  years_in_role: "1–3 metai" as const,
  years_at_employer: "1–3 metai" as const,
  team_size: "2–5 žmonės" as const,
  device_type: "Windows kompiuteris" as const,
  device_usage: "",
  work_description_mode: "guided" as const,
  responsibilities: "",
  weekly_tasks: "",
  ai_pressure: "Taip, paminėjo kelis kartus" as const,
  ai_pressure_details: "",
  digitize_mode: "guided" as const,
  digitize_what: "",
  current_process: "",
  pain_processes: "",
  repeat_tasks: "",
  hours_per_week: "1–3 val." as const,
  desired_outcome: "",
  tools_used: [] as string[],
  tools_other: "",
  company_ai_license: "Nežinau" as (typeof COMPANY_AI_LICENSE)[number],
  company_ai_license_tools: [] as string[],
  company_ai_license_details: "",
  ai_tools_tried: [] as string[],
  ai_experience: "Visiškai nauja" as const,
  ai_fears: [] as string[],
  ai_fears_other: "",
  screenshot_comments: "",
  additional_context: "",
  delivery_preference: "El. paštu" as const,
  video_call_platform: "Microsoft Teams" as const,
  video_call_times: "",
  consent: false,
};

function FieldLabel({ children, required }: { children: React.ReactNode; required?: boolean }) {
  return (
    <label className="block text-sm font-medium text-ink">
      {children}
      {required && <span className="text-sage"> *</span>}
    </label>
  );
}

function TextInput({
  value,
  onChange,
  type = "text",
  placeholder,
}: {
  value: string;
  onChange: (v: string) => void;
  type?: string;
  placeholder?: string;
}) {
  return (
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="form-field"
    />
  );
}

function TextArea({
  value,
  onChange,
  placeholder,
  rows = 4,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  rows?: number;
}) {
  return (
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      rows={rows}
      className="form-field"
    />
  );
}

function SelectInput({
  value,
  onChange,
  options,
}: {
  value: string;
  onChange: (v: string) => void;
  options: readonly string[];
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="form-field"
    >
      {options.map((opt) => (
        <option key={opt} value={opt}>
          {opt}
        </option>
      ))}
    </select>
  );
}

function CheckboxGroup({
  values,
  options,
  onChange,
}: {
  values: string[];
  options: readonly string[];
  onChange: (v: string[]) => void;
}) {
  function toggle(opt: string) {
    if (values.includes(opt)) {
      onChange(values.filter((v) => v !== opt));
    } else {
      onChange([...values, opt]);
    }
  }

  return (
    <div className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-2">
      {options.map((opt) => (
        <label
          key={opt}
          className="flex cursor-pointer items-start gap-2.5 rounded-lg border border-cream-dark bg-white px-3 py-2.5 text-sm hover:border-sage"
        >
          <input
            type="checkbox"
            checked={values.includes(opt)}
            onChange={() => toggle(opt)}
            className="mt-0.5 h-4 w-4 shrink-0 rounded border-cream-dark text-sage focus:ring-sage"
          />
          <span className="min-w-0 flex-1 break-words leading-snug">{opt}</span>
        </label>
      ))}
    </div>
  );
}

export function FormWizard({ packageId, packageInfo }: Props) {
  const maxTasks = packageInfo.maxTasks;
  const hasVideoCall = packageInfo.hasVideoCall;
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({ ...emptyForm });
  const [photos, setPhotos] = useState<PhotoItem[]>([]);
  const [workGuidedAnswers, setWorkGuidedAnswers] = useState<Record<string, string>>({});
  const [digitizeGuidedAnswers, setDigitizeGuidedAnswers] = useState<Record<string, string>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const stepContentRef = useRef<HTMLDivElement>(null);
  const formStartedRef = useRef(false);
  const completedRef = useRef(false);
  const maxStepReachedRef = useRef(0);

  const currentStepId = FORM_STEPS[step].id as StepId;

  useEffect(() => {
    const el = stepContentRef.current;
    if (!el) return;

    requestAnimationFrame(() => {
      const rect = el.getBoundingClientRect();
      const targetY = window.scrollY + rect.top - window.innerHeight * 0.35;
      window.scrollTo({ top: Math.max(0, targetY), behavior: "smooth" });
    });
  }, [step]);

  useEffect(() => {
    if (!hasAnalyticsConsent()) return;
    if (step > maxStepReachedRef.current) {
      maxStepReachedRef.current = step;
    }
    trackFormStep(FORM_STEPS[step].id, step, packageId);
  }, [step, packageId]);

  useEffect(() => {
    const markStart = () => {
      if (formStartedRef.current || !hasAnalyticsConsent()) return;
      formStartedRef.current = true;
      trackFormStart(packageId);
    };

    const root = stepContentRef.current;
    root?.addEventListener("focusin", markStart);
    root?.addEventListener("input", markStart);
    root?.addEventListener("change", markStart);
    return () => {
      root?.removeEventListener("focusin", markStart);
      root?.removeEventListener("input", markStart);
      root?.removeEventListener("change", markStart);
    };
  }, [packageId, step]);

  useEffect(() => {
    const onLeave = () => {
      if (completedRef.current || !formStartedRef.current || !hasAnalyticsConsent()) return;
      const abandonStep = maxStepReachedRef.current;
      trackFormAbandon(FORM_STEPS[abandonStep].id, abandonStep, packageId);
    };

    window.addEventListener("pagehide", onLeave);
    return () => window.removeEventListener("pagehide", onLeave);
  }, [packageId]);

  function updateField(key: keyof typeof emptyForm, value: string | boolean | string[]) {
    setForm((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => {
      const next = { ...prev };
      delete next[key as string];
      return next;
    });
  }

  const workQuestions = getWorkGuidedQuestions(form.job_title);
  const digitizeQuestions = getDigitizeGuidedQuestions(form.job_title, maxTasks);

  function buildFormForValidation() {
    const data = { ...form };

    if (data.work_description_mode === "guided") {
      const combined = combineGuidedAnswers(workQuestions, workGuidedAnswers);
      data.responsibilities = combined;
      data.weekly_tasks =
        workGuidedAnswers.w3?.trim() ||
        workGuidedAnswers.w4?.trim() ||
        combined ||
        "—";
    }

    if (data.digitize_mode === "guided") {
      const built = buildDigitizeFieldsFromGuided(maxTasks, digitizeGuidedAnswers);
      data.digitize_what = built.digitize_what || data.digitize_what;
      data.current_process = built.current_process || data.current_process;
      data.pain_processes = built.pain_processes || data.pain_processes;
      data.desired_outcome = built.desired_outcome || data.desired_outcome;
      data.repeat_tasks = built.repeat_tasks || data.repeat_tasks;
    } else if (data.digitize_what.trim()) {
      const free = data.digitize_what.trim();
      data.current_process = data.current_process.trim() || free;
      data.pain_processes = data.pain_processes.trim() || free;
      data.desired_outcome = data.desired_outcome.trim() || free;
      data.repeat_tasks = data.repeat_tasks.trim() || free;
    }

    return data;
  }

  function validateStep(): boolean {
    const data = buildFormForValidation();
    const schema = stepSchemas[currentStepId];
    const result = schema.safeParse(data);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.errors.forEach((e) => {
        const key = e.path[0] as string;
        fieldErrors[key] = e.message;
      });
      setErrors(fieldErrors);
      return false;
    }

    if (currentStepId === "photos" && hasVideoCall) {
      if (!form.video_call_times?.trim()) {
        setErrors({ video_call_times: "Nurodykite, kada Jums patogiausia skambinti" });
        return false;
      }
    }

    setErrors({});
    return true;
  }

  function next() {
    if (validateStep()) setStep((s) => Math.min(s + 1, FORM_STEPS.length - 1));
  }

  function back() {
    setStep((s) => Math.max(s - 1, 0));
  }

  async function submit() {
    if (!validateStep()) return;
    setSubmitting(true);

    const payload = buildFormForValidation();
    const body = new FormData();
    body.append("package_id", packageId);
    body.append("answers", JSON.stringify(payload));

    let checkoutEventId: string | undefined;
    if (hasAnalyticsConsent()) {
      const browserIds = getMetaBrowserIds();
      checkoutEventId = createMetaEventId("checkout");
      body.append(
        "meta_tracking",
        JSON.stringify({
          initiate_checkout_event_id: checkoutEventId,
          ...browserIds,
        })
      );
    }

    body.append(
      "photo_manifest",
      JSON.stringify(
        photos.map((p, i) => {
          const file = normalizeImageFile(p.file, i);
          return {
            name: file.name,
            size: file.size,
            type: file.type,
            comment: p.comment,
          };
        })
      )
    );
    photos.forEach((p, i) => {
      const file = normalizeImageFile(p.file, i);
      body.append("photos", file);
      body.append("photo_comments", p.comment);
    });

    const res = await fetch("/api/intake", { method: "POST", body });
    setSubmitting(false);

    const data = await res.json();
    if (res.ok && data.url) {
      completedRef.current = true;
      if (hasAnalyticsConsent() && checkoutEventId) {
        trackInitiateCheckout(packageInfo.priceEur, packageId, checkoutEventId);
      }
      window.location.href = data.url;
    } else {
      const detail =
        typeof data.error === "string"
          ? data.error
          : "Nepavyko pateikti formos. Patikrinkite ar visi laukai užpildyti.";
      alert(
        detail +
          (res.status === 500
            ? `\n\nJei matote Supabase klaidą — atidarykite ${window.location.origin}/api/health ir pataisykite .env.local`
            : "")
      );
    }
  }

  return (
    <div className="min-w-0">
      <div className="mb-6 rounded-xl border border-sage/30 bg-sage-light/40 px-3 py-3 text-sm sm:mb-8 sm:px-4">
        <p className="break-words font-medium text-sage-dark">
          Paketas: {packageInfo.name} — {packageInfo.subtitle} ({packageInfo.priceEur} €)
        </p>
        <p className="mt-1 text-ink-muted">
          {packageInfo.maxTasks === 1
            ? "Papasakokite apie vieną užduotį, kuriai reikia DI sprendimo — kuo detaliau, tuo geriau."
            : `Papasakokite iki ${packageInfo.maxTasks} kasdienių užduočių — kuo detaliau, tuo geriau.`}
          {hasVideoCall && " Po PDF — 15 min. video skambutis pagalbai įdiegti."}
        </p>
        <p className="mt-1 text-xs text-ink-light">
          PDF {packageInfo.pageCount} · Pristatymas per 24 val. el. paštu
        </p>
      </div>
      <div className="mb-8">
        <div className="flex gap-2">
          {FORM_STEPS.map((s, i) => (
            <div
              key={s.id}
              className={`h-1.5 flex-1 rounded-full transition-colors ${
                i <= step ? "bg-sage" : "bg-cream-dark"
              }`}
            />
          ))}
        </div>
        <p className="mt-3 text-sm text-ink-muted">
          {step + 1} / {FORM_STEPS.length} — {FORM_STEPS[step].title}
        </p>
      </div>

      <div ref={stepContentRef} className="min-w-0 space-y-5">
        {currentStepId === "about" && (
          <>
            <div>
              <FieldLabel required>Vardas ir pavardė</FieldLabel>
              <TextInput value={form.name} onChange={(v) => updateField("name", v)} />
              {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
            </div>
            <div>
              <FieldLabel required>El. paštas (PDF siuntimui)</FieldLabel>
              <TextInput
                type="email"
                value={form.email}
                onChange={(v) => updateField("email", v)}
              />
              {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
            </div>
            <div>
              <FieldLabel required>Kiek Jums metų?</FieldLabel>
              <SelectInput
                value={form.age_range}
                onChange={(v) => updateField("age_range", v)}
                options={AGE_RANGES}
              />
            </div>
            <div>
              <FieldLabel required>Miestas / regionas, kuriame dirbate</FieldLabel>
              <TextInput value={form.city} onChange={(v) => updateField("city", v)} />
              {errors.city && <p className="mt-1 text-sm text-red-600">{errors.city}</p>}
            </div>
          </>
        )}

        {currentStepId === "work" && (
          <>
            <div>
              <FieldLabel required>Kur dirbate?</FieldLabel>
              <SelectInput
                value={form.employer_type}
                onChange={(v) => updateField("employer_type", v)}
                options={EMPLOYER_TYPES}
              />
            </div>
            <div>
              <FieldLabel>Įmonės / įstaigos pavadinimas (nebūtina)</FieldLabel>
              <TextInput
                value={form.employer_name || ""}
                onChange={(v) => updateField("employer_name", v)}
              />
            </div>
            <div>
              <FieldLabel required>Jūsų pareigos / pareigybė</FieldLabel>
              <TextInput value={form.job_title} onChange={(v) => updateField("job_title", v)} />
              {errors.job_title && <p className="mt-1 text-sm text-red-600">{errors.job_title}</p>}
            </div>
            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <FieldLabel required>Kiek metų dirbate šiose pareigose?</FieldLabel>
                <SelectInput
                  value={form.years_in_role}
                  onChange={(v) => updateField("years_in_role", v)}
                  options={YEARS_IN_ROLE}
                />
              </div>
              <div>
                <FieldLabel required>Kiek laiko dirbate šioje įmonėje / įstaigoje?</FieldLabel>
                <SelectInput
                  value={form.years_at_employer}
                  onChange={(v) => updateField("years_at_employer", v)}
                  options={YEARS_AT_EMPLOYER}
                />
              </div>
            </div>
            <div>
              <FieldLabel required>Kiek žmonių Jūsų komandoje / skyriuje?</FieldLabel>
              <SelectInput
                value={form.team_size}
                onChange={(v) => updateField("team_size", v)}
                options={TEAM_SIZES}
              />
            </div>
            <div>
              <FieldLabel required>Kokį kompiuterį naudojate darbe?</FieldLabel>
              <SelectInput
                value={form.device_type}
                onChange={(v) => updateField("device_type", v)}
                options={DEVICE_TYPE}
              />
            </div>
            <div>
              <FieldLabel>Ką su juo darote kasdien?</FieldLabel>
              <TextInput
                value={form.device_usage || ""}
                onChange={(v) => updateField("device_usage", v)}
                placeholder="Pvz.: Excel ataskaitos, el. paštas, Word dokumentai, Teams susitikimai…"
              />
              <p className="mt-1 text-xs text-ink-muted">
                Trumpai — kokias programas atidarote ir kam. Nereikia techninių detalių.
              </p>
            </div>
            <GuidedOrFreeField
              label="Papasakokite apie savo darbą"
              required
              hint="Kuo detaliau aprašysite — tuo tikslesnį PDF gidą paruošime. Galite aprašyti patys arba atsakyti į trumpus klausimus pagal Jūsų pareigas."
              mode={form.work_description_mode || "guided"}
              onModeChange={(m) => updateField("work_description_mode", m)}
              freeValue={form.responsibilities}
              onFreeChange={(v) => {
                updateField("responsibilities", v);
                updateField("weekly_tasks", v);
              }}
              guidedQuestions={workQuestions}
              guidedAnswers={workGuidedAnswers}
              onGuidedChange={(id, v) =>
                setWorkGuidedAnswers((prev) => ({ ...prev, [id]: v }))
              }
              freePlaceholder="Aprašykite, ką darote kasdien, su kokiomis programomis dirbate ir kas atima daugiausiai laiko…"
              freeRows={6}
              error={errors.responsibilities || errors.weekly_tasks}
            />
          </>
        )}

        {currentStepId === "digitize" && (
          <>
            <div>
              <FieldLabel required>
                Ar Jūsų vadovas ar darbdavys prašė naudoti dirbtinį intelektą / DI?
              </FieldLabel>
              <SelectInput
                value={form.ai_pressure}
                onChange={(v) => updateField("ai_pressure", v)}
                options={AI_PRESSURE}
              />
            </div>
            <div>
              <FieldLabel>Ką tiksliai sakė vadovas ar kolegos? (citata, situacija)</FieldLabel>
              <TextArea
                value={form.ai_pressure_details || ""}
                onChange={(v) => updateField("ai_pressure_details", v)}
                placeholder="Pvz.: „Reikia greičiau ruošti santraukas — naudok ChatGPT“"
              />
            </div>
            <GuidedOrFreeField
              label={
                maxTasks === 1
                  ? "Kurią užduotį norėtumėte skaitmenizuoti ar galvojate, kad galėtumėte panaudoti DI?"
                  : `Kurias užduotis (iki ${maxTasks}) norėtumėte skaitmenizuoti ar pritaikyti DI?`
              }
              required
              hint={
                maxTasks === 1
                  ? "Kuo detaliau — tuo geriau. Galite aprašyti patys arba atsakyti į klausimus."
                  : `Aprašykite kiekvieną užduotį atskirai (iki ${maxTasks}). Kiekvienai — ką darote, kaip darote, kas erzina ir ko norite.`
              }
              mode={form.digitize_mode || "guided"}
              onModeChange={(m) => updateField("digitize_mode", m)}
              freeValue={form.digitize_what}
              onFreeChange={(v) => updateField("digitize_what", v)}
              guidedQuestions={digitizeQuestions}
              guidedAnswers={digitizeGuidedAnswers}
              onGuidedChange={(id, v) =>
                setDigitizeGuidedAnswers((prev) => ({ ...prev, [id]: v }))
              }
              sectionTitleForQuestion={(q) => digitizeTaskSectionTitle(q.id, maxTasks)}
              freePlaceholder="Aprašykite užduotį, kaip ją darote dabar, kas erzina ir ko norite pasiekti…"
              freeRows={7}
              error={
                errors.digitize_what ||
                errors.current_process ||
                errors.pain_processes ||
                errors.desired_outcome ||
                errors.repeat_tasks
              }
            />
            {form.digitize_mode !== "guided" && (
              <div>
                <FieldLabel required>Ką darote pakartotinai kiekvieną savaitę?</FieldLabel>
                <TextArea
                  value={form.repeat_tasks}
                  onChange={(v) => updateField("repeat_tasks", v)}
                  placeholder="Pvz.: kiekvieną pirmadienį ruošiu ataskaitą, kiekvieną penktadienį suvedu duomenis…"
                />
                {errors.repeat_tasks && (
                  <p className="mt-1 text-sm text-red-600">{errors.repeat_tasks}</p>
                )}
              </div>
            )}
            <div>
              <FieldLabel required>Kiek laiko per savaitę tai užima?</FieldLabel>
              <SelectInput
                value={form.hours_per_week}
                onChange={(v) => updateField("hours_per_week", v)}
                options={HOURS_PER_WEEK}
              />
            </div>
          </>
        )}

        {currentStepId === "tools" && (
          <>
            <div>
              <FieldLabel required>Kokias programas naudojate kasdien?</FieldLabel>
              <CheckboxGroup
                values={form.tools_used}
                options={TOOLS_USED}
                onChange={(v) => updateField("tools_used", v)}
              />
              {errors.tools_used && (
                <p className="mt-1 text-sm text-red-600">{errors.tools_used}</p>
              )}
            </div>
            <div>
              <FieldLabel>Kitos programos — parašykite, jei nėra sąraše</FieldLabel>
              <TextInput
                value={form.tools_other || ""}
                onChange={(v) => updateField("tools_other", v)}
                placeholder="Pvz.: Canva, Notion, SharePoint…"
              />
            </div>
            <div>
              <FieldLabel required>Ar Jūsų įmonė turi nusipirkusią DI licenciją darbuotojams?</FieldLabel>
              <SelectInput
                value={form.company_ai_license}
                onChange={(v) => updateField("company_ai_license", v)}
                options={COMPANY_AI_LICENSE}
              />
              {errors.company_ai_license && (
                <p className="mt-1 text-sm text-red-600">{errors.company_ai_license}</p>
              )}
              <p className="mt-1 text-xs text-ink-muted">
                Pvz. Microsoft 365 Copilot, ChatGPT Team/Enterprise — oficialus įmonės įrankis, ne asmeninis
                ChatGPT.
              </p>
            </div>
            {form.company_ai_license === COMPANY_AI_LICENSE_YES && (
              <>
                <div>
                  <FieldLabel>Kurį DI įrankį įmonė suteikia? (pasirinkite visus, kurie taikomi)</FieldLabel>
                  <CheckboxGroup
                    values={form.company_ai_license_tools}
                    options={COMPANY_AI_LICENSE_TOOLS}
                    onChange={(v) => updateField("company_ai_license_tools", v)}
                  />
                </div>
                <div>
                  <FieldLabel>Papildomai — kokia licencija ar kaip naudojate?</FieldLabel>
                  <TextInput
                    value={form.company_ai_license_details || ""}
                    onChange={(v) => updateField("company_ai_license_details", v)}
                    placeholder="Pvz.: Copilot tik Outlook ir Word, ChatGPT Enterprise visiems…"
                  />
                </div>
              </>
            )}
            <div>
              <FieldLabel required>Ar bandėte naudoti DI įrankius? (pasirinkite visus, kurie taikomi)</FieldLabel>
              <CheckboxGroup
                values={form.ai_tools_tried}
                options={AI_TOOLS}
                onChange={(v) => updateField("ai_tools_tried", v)}
              />
              {errors.ai_tools_tried && (
                <p className="mt-1 text-sm text-red-600">{errors.ai_tools_tried}</p>
              )}
            </div>
            <div>
              <FieldLabel required>Kaip vertintumėte savo DI patirtį?</FieldLabel>
              <SelectInput
                value={form.ai_experience}
                onChange={(v) => updateField("ai_experience", v)}
                options={AI_EXPERIENCE}
              />
            </div>
            <div>
              <FieldLabel required>Ko bijote ar kas stabdo naudojant DI?</FieldLabel>
              <CheckboxGroup
                values={form.ai_fears}
                options={AI_FEARS}
                onChange={(v) => updateField("ai_fears", v)}
              />
              {errors.ai_fears && (
                <p className="mt-1 text-sm text-red-600">{errors.ai_fears}</p>
              )}
            </div>
            <div>
              <FieldLabel>Kita — parašykite patys</FieldLabel>
              <TextInput
                value={form.ai_fears_other || ""}
                onChange={(v) => updateField("ai_fears_other", v)}
              />
            </div>
          </>
        )}

        {currentStepId === "photos" && (
          <>
            <div className="rounded-xl border border-cream-dark bg-cream/50 p-4 text-sm text-ink-muted">
              <p className="font-medium text-ink">Ekrano nuotraukos padeda parašyti tikslesnį gidą</p>
              <p className="mt-1">
                Jei įkelsite nuotraukas su komentarais, PDF gide galėsime parodyti tiksliai Jūsų programos
                langus — kur spustelėti, ką matote ekrane ir kaip turi atrodyti rezultatas.
              </p>
            </div>
            <div>
              <FieldLabel>
                Įkelkite ekrano nuotraukas proceso, kurį norite optimizuoti (iki 5 failų)
              </FieldLabel>
              <div className="mt-2">
                <PhotoUpload photos={photos} onChange={setPhotos} />
              </div>
            </div>
            {photos.length > 0 && (
              <div>
                <FieldLabel>Papildomi komentarai apie nuotraukas</FieldLabel>
                <TextArea
                  value={form.screenshot_comments || ""}
                  onChange={(v) => updateField("screenshot_comments", v)}
                  placeholder="Bendras paaiškinimas, jei reikia…"
                />
              </div>
            )}
            <div>
              <FieldLabel>Ar dar kas nors, ką turėtume žinoti?</FieldLabel>
              <TextArea
                value={form.additional_context || ""}
                onChange={(v) => updateField("additional_context", v)}
              />
            </div>
            <div>
              <FieldLabel required>Kaip norėtumėte gauti PDF?</FieldLabel>
              <SelectInput
                value={form.delivery_preference}
                onChange={(v) =>
                  updateField("delivery_preference", v)
                }
                options={DELIVERY_OPTIONS}
              />
            </div>
            {hasVideoCall && (
              <>
                <div className="rounded-xl border border-sage/30 bg-sage-light/30 p-4">
                  <p className="text-sm font-medium text-sage-dark">
                    Premium paketas — 15 min. video skambutis
                  </p>
                  <p className="mt-1 text-xs text-ink-muted">
                    Susisieksime el. paštu dėl laiko. Padėsime įdiegti sprendimus Jūsų kompiuteryje.
                  </p>
                </div>
                <div>
                  <FieldLabel required>Video skambučio platforma</FieldLabel>
                  <SelectInput
                    value={form.video_call_platform || "Microsoft Teams"}
                    onChange={(v) => updateField("video_call_platform", v)}
                    options={VIDEO_PLATFORMS}
                  />
                </div>
                <div>
                  <FieldLabel required>Kada Jums patogiausia skambinti? (dienos, laikai)</FieldLabel>
                  <TextArea
                    value={form.video_call_times || ""}
                    onChange={(v) => updateField("video_call_times", v)}
                    placeholder="Pvz.: pirmadieniais–ketvirtadieniais 9–12 val., arba penktadieniais po 14 val."
                    rows={3}
                  />
                  {errors.video_call_times && (
                    <p className="mt-1 text-sm text-red-600">{errors.video_call_times}</p>
                  )}
                </div>
              </>
            )}
            <label className="flex cursor-pointer items-start gap-3 rounded-lg border border-cream-dark bg-white p-3 sm:p-4">
              <input
                type="checkbox"
                checked={form.consent === true}
                onChange={(e) => updateField("consent", e.target.checked)}
                className="mt-1 h-4 w-4 shrink-0 rounded border-cream-dark text-sage focus:ring-sage"
              />
              <span className="min-w-0 flex-1 text-sm leading-relaxed text-ink-muted">
                Sutinku, kad mano duomenys būtų naudojami PDF rengimui. Duomenys saugomi ir
                nenaudojami kitiems tikslams.
              </span>
            </label>
            {errors.consent && <p className="text-sm text-red-600">{errors.consent}</p>}
          </>
        )}
      </div>

      <div className="mt-8 flex flex-col-reverse gap-3 sm:mt-10 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
        {step > 0 ? (
          <button
            type="button"
            onClick={back}
            className="w-full rounded-full border border-cream-dark px-6 py-3 text-sm font-medium text-ink-muted hover:text-ink sm:w-auto cursor-pointer"
          >
            Atgal
          </button>
        ) : (
          <div className="hidden sm:block" />
        )}
        {step < FORM_STEPS.length - 1 ? (
          <button
            type="button"
            onClick={next}
            className="w-full rounded-full bg-sage px-8 py-3 text-sm font-medium text-white hover:bg-sage-dark sm:ml-auto sm:w-auto cursor-pointer"
          >
            Toliau
          </button>
        ) : (
          <button
            type="button"
            onClick={submit}
            disabled={submitting}
            className="w-full rounded-full bg-sage px-6 py-3.5 text-sm font-medium leading-snug text-white hover:bg-sage-dark disabled:opacity-50 sm:ml-auto sm:w-auto sm:px-8 cursor-pointer"
          >
            {submitting ? "Ruošiama apmokėjimui…" : `Tęsti į apmokėjimą — ${packageInfo.priceEur} €`}
          </button>
        )}
      </div>
    </div>
  );
}
