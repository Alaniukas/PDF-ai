"use client";

import { PackageId, formatPrice } from "@/lib/packages";

export function CheckoutButton({
  packageId,
  className = "",
  variant = "primary",
  children,
}: {
  packageId: PackageId;
  className?: string;
  variant?: "primary" | "secondary" | "outline";
  children: React.ReactNode;
}) {
  async function handleCheckout() {
    const res = await fetch("/api/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ packageId }),
    });
    const data = await res.json();
    if (data.url) {
      window.location.href = data.url;
    } else {
      alert(data.error || "Nepavyko pradėti mokėjimo. Bandykite vėliau.");
    }
  }

  const base =
    variant === "primary"
      ? "bg-sage hover:bg-sage-dark text-white shadow-sm"
      : variant === "outline"
        ? "border border-sage text-sage hover:bg-sage-light bg-transparent"
        : "bg-white hover:bg-cream-dark text-ink border border-cream-dark";

  return (
    <button
      type="button"
      onClick={handleCheckout}
      className={`inline-flex items-center justify-center rounded-full px-8 py-3.5 text-base font-medium transition-colors cursor-pointer ${base} ${className}`}
    >
      {children}
    </button>
  );
}

export function PriceFromTag() {
  return (
    <span className="font-medium text-sage">nuo {formatPrice(14)}</span>
  );
}

export function PackagePrice({ eur }: { eur: number }) {
  return <span className="font-medium text-sage">{formatPrice(eur)}</span>;
}
