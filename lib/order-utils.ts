import { PackageId, getPackage } from "@/lib/packages";

export function orderFieldsFromSession(session: {
  id: string;
  amount_total: number | null;
  customer_details?: { email?: string | null } | null;
  customer_email?: string | null;
  metadata?: { package_id?: string; order_id?: string } | null;
}) {
  const packageId = (session.metadata?.package_id as PackageId) || "popular";
  const pkg = getPackage(packageId);

  return {
    stripe_session_id: session.id,
    email: session.customer_details?.email || session.customer_email || "",
    amount_cents: session.amount_total || pkg?.priceCents || 2200,
    package_id: packageId,
    status: "paid" as const,
  };
}
