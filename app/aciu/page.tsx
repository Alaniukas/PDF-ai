import Link from "next/link";
import { PurchaseTracker } from "@/components/analytics/PurchaseTracker";

export default function AciuPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center overflow-x-clip px-4 py-8 text-center sm:px-6">
      <PurchaseTracker />
      <div className="max-w-md animate-fade-in">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-sage-light text-2xl text-sage">
          ✓
        </div>
        <h1 className="font-serif text-3xl text-ink">Ačiū!</h1>
        <p className="mt-4 text-lg leading-relaxed text-ink-muted">
          Jūsų anketą gavome ir mokėjimas patvirtintas. Per{" "}
          <strong className="font-medium text-ink">24 valandas</strong> paruošime asmeninį
          PDF gidą su žingsniais, programų naudojimu ir ekrano paaiškinimais — ir atsiųsime el. paštu.
        </p>
        <p className="mt-4 text-sm text-ink-light">
          Jei užsakėte Premium paketą — susisieksime dėl 15 min. video skambučio laiko.
        </p>
        <Link
          href="/"
          className="mt-8 inline-block rounded-full bg-sage px-8 py-3 text-sm font-medium text-white hover:bg-sage-dark"
        >
          Grįžti į pradžią
        </Link>
      </div>
    </div>
  );
}
