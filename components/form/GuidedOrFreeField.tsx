"use client";

import { DescriptionMode, GuidedQuestion } from "@/lib/guided-questions";

function ModeToggle({
  mode,
  onChange,
}: {
  mode: DescriptionMode;
  onChange: (m: DescriptionMode) => void;
}) {
  return (
    <div className="mt-2 flex flex-wrap gap-2">
      <button
        type="button"
        onClick={() => onChange("free")}
        className={`rounded-full px-4 py-2 text-sm font-medium transition-colors cursor-pointer ${
          mode === "free"
            ? "bg-sage text-white"
            : "border border-cream-dark bg-white text-ink-muted hover:border-sage"
        }`}
      >
        Aprašysiu pats
      </button>
      <button
        type="button"
        onClick={() => onChange("guided")}
        className={`rounded-full px-4 py-2 text-sm font-medium transition-colors cursor-pointer ${
          mode === "guided"
            ? "bg-sage text-white"
            : "border border-cream-dark bg-white text-ink-muted hover:border-sage"
        }`}
      >
        Atsakysiu į klausimus
      </button>
    </div>
  );
}

export function GuidedOrFreeField({
  label,
  required,
  mode,
  onModeChange,
  freeValue,
  onFreeChange,
  guidedQuestions,
  guidedAnswers,
  onGuidedChange,
  freePlaceholder,
  freeRows = 5,
  hint,
  error,
  sectionTitleForQuestion,
}: {
  label: string;
  required?: boolean;
  mode: DescriptionMode;
  onModeChange: (m: DescriptionMode) => void;
  freeValue: string;
  onFreeChange: (v: string) => void;
  guidedQuestions: GuidedQuestion[];
  guidedAnswers: Record<string, string>;
  onGuidedChange: (id: string, value: string) => void;
  freePlaceholder?: string;
  freeRows?: number;
  hint?: string;
  error?: string;
  sectionTitleForQuestion?: (question: GuidedQuestion) => string | null;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-ink">
        {label}
        {required && <span className="text-sage"> *</span>}
      </label>
      {hint && <p className="mt-1 text-xs leading-relaxed text-ink-muted">{hint}</p>}
      <ModeToggle mode={mode} onChange={onModeChange} />

      {mode === "free" ? (
        <textarea
          value={freeValue}
          onChange={(e) => onFreeChange(e.target.value)}
          placeholder={freePlaceholder}
          rows={freeRows}
          className="form-field mt-3 bg-white"
        />
      ) : (
        <div className="mt-3 space-y-4 rounded-xl border border-sage/20 bg-sage-light/15 p-3 sm:p-4">
          <p className="text-xs text-sage-dark">
            Atsakykite į klausimus pagal Jūsų pareigas — kuo detaliau, tuo tikslesnis bus Jūsų
            PDF gidas.
          </p>
          {guidedQuestions.map((q) => {
            const sectionTitle = sectionTitleForQuestion?.(q);
            return (
              <div key={q.id}>
                {sectionTitle && (
                  <p className="mb-3 border-b border-sage/20 pb-2 font-serif text-base text-sage-dark">
                    {sectionTitle}
                  </p>
                )}
                <label className="block text-sm font-medium text-ink">{q.label}</label>
                <textarea
                  value={guidedAnswers[q.id] || ""}
                  onChange={(e) => onGuidedChange(q.id, e.target.value)}
                  placeholder={q.placeholder}
                  rows={3}
                  className="form-field mt-1.5 bg-white text-sm"
                />
              </div>
            );
          })}
        </div>
      )}
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
}
