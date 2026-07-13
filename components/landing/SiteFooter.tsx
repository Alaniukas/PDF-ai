import Link from "next/link";
import { COMPANY } from "@/lib/company";

export function SiteFooter() {
  return (
    <footer className="border-t border-cream-dark bg-cream py-10">
      <div className="layout-shell flex flex-col items-center gap-6 text-center text-sm text-ink-light sm:flex-row sm:items-start sm:justify-between sm:text-left">
        <div>
          <p className="font-medium text-ink">{COMPANY.productName}</p>
          <p className="mt-1">{COMPANY.name}</p>
          <p className="mt-1">Įmonės kodas: {COMPANY.code}</p>
        </div>
        <div className="flex flex-col items-center gap-2 sm:items-end">
          <a href={`mailto:${COMPANY.email}`} className="font-medium text-ink-muted hover:text-ink">
            {COMPANY.email}
          </a>
          <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 sm:justify-end">
            <Link href="/privatumo-politika" className="hover:text-ink">
              Privatumo politika
            </Link>
            <Link href="/taisykles" className="hover:text-ink">
              Taisyklės
            </Link>
          </div>
          <p className="text-xs">© {new Date().getFullYear()} · Saugus mokėjimas per Stripe</p>
        </div>
      </div>
    </footer>
  );
}
