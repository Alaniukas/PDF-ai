import Link from "next/link";
import { SiteLogo } from "@/components/landing/SiteLogo";

export default function AnketaLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-cream">
      <header className="border-b border-cream-dark bg-cream/95 px-6 py-3">
        <div className="mx-auto flex max-w-2xl items-center justify-between">
          <SiteLogo />
          <Link href="/" className="text-sm text-ink-muted hover:text-ink">
            ← Pradžia
          </Link>
        </div>
      </header>
      {children}
    </div>
  );
}
