import Link from "next/link";
import { COMPANY } from "@/lib/company";

export function LegalCompanyBlock() {
  return (
    <p className="mt-2">
      {COMPANY.name}
      <br />
      Įmonės kodas: {COMPANY.code}
      <br />
      El. paštas:{" "}
      <a href={`mailto:${COMPANY.email}`} className="text-sage hover:underline">
        {COMPANY.email}
      </a>
    </p>
  );
}

export function LegalPageShell({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-cream">
      <header className="border-b border-cream-dark px-6 py-4">
        <div className="mx-auto flex max-w-3xl items-center justify-between">
          <Link href="/" className="font-serif text-lg text-ink hover:text-sage">
            DI darbo gidas
          </Link>
          <Link href="/" className="text-sm text-ink-muted hover:text-ink">
            ← Pradžia
          </Link>
        </div>
      </header>
      <article className="mx-auto max-w-3xl px-6 py-12">
        <h1 className="font-serif text-3xl text-ink">{title}</h1>
        <p className="mt-4 text-sm text-ink-light">Paskutinį kartą atnaujinta: 2026 m. liepa</p>
        <div className="mt-8 space-y-8 text-ink-muted leading-relaxed">{children}</div>
      </article>
    </div>
  );
}
