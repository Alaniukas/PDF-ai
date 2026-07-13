"use client";

import Link from "next/link";

export default function Error({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-cream px-6 text-center">
      <h1 className="font-serif text-2xl text-ink">Kažkas nepavyko</h1>
      <p className="mt-3 max-w-md text-ink-muted">
        Serveris gali būti perkrautas arba cache sugadintas. Paleiskite{" "}
        <strong className="text-ink">clean-dev.bat</strong>, tada vėl{" "}
        <strong className="text-ink">dev.bat</strong>.
      </p>
      <div className="mt-6 flex flex-wrap justify-center gap-3">
        <button
          type="button"
          onClick={() => reset()}
          className="rounded-full bg-sage px-6 py-2.5 text-sm font-medium text-white hover:bg-sage-dark cursor-pointer"
        >
          Bandyti dar kartą
        </button>
        <Link
          href="/"
          className="rounded-full border border-cream-dark px-6 py-2.5 text-sm font-medium text-ink-muted hover:text-ink"
        >
          Grįžti į pradžią
        </Link>
      </div>
    </div>
  );
}
