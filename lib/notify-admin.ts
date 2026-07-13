import { Resend } from "resend";
import { COMPANY } from "@/lib/company";
import { PACKAGES, PackageId } from "@/lib/packages";
import type { SupabaseClient } from "@supabase/supabase-js";

const ADMIN_EMAIL = process.env.ADMIN_NOTIFICATION_EMAIL || "alaniukasa@gmail.com";

type OrderRow = {
  id: string;
  email: string | null;
  package_id: string | null;
  amount_cents: number | null;
  status: string | null;
  created_at: string | null;
};

type Answers = {
  name?: string;
  email?: string;
  job_title?: string;
  city?: string;
  employer_name?: string;
  work_description_mode?: string;
  responsibilities?: string;
  digitize_what?: string;
  delivery_preference?: string;
};

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function formatEur(cents: number | null): string {
  if (cents == null) return "—";
  return `${(cents / 100).toFixed(2).replace(".", ",")} €`;
}

export async function notifyAdminPaidOrder(
  supabase: SupabaseClient,
  orderId: string
): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.warn("RESEND_API_KEY nenustatytas — admin el. laiškas neišsiųstas");
    return;
  }

  const { data: order, error: orderError } = await supabase
    .from("orders")
    .select("id, email, package_id, amount_cents, status, created_at")
    .eq("id", orderId)
    .single();

  if (orderError || !order) {
    console.error("Notify admin: order not found", orderId, orderError);
    return;
  }

  const row = order as OrderRow;

  const { data: responseRow } = await supabase
    .from("form_responses")
    .select("answers")
    .eq("order_id", orderId)
    .maybeSingle();

  const { count: photoCount } = await supabase
    .from("uploads")
    .select("*", { count: "exact", head: true })
    .eq("order_id", orderId);

  const answers = (responseRow?.answers ?? {}) as Answers;
  const packageId = (row.package_id || "popular") as PackageId;
  const pkg = PACKAGES[packageId];
  const supabaseRef = process.env.NEXT_PUBLIC_SUPABASE_URL?.match(/https:\/\/([^.]+)/)?.[1];
  const dashboardOrders = supabaseRef
    ? `https://supabase.com/dashboard/project/${supabaseRef}/editor/orders?filter=id%3Aeq%3A${orderId}`
    : null;

  const from =
    process.env.RESEND_FROM || `${COMPANY.productName} <onboarding@resend.dev>`;

  const subject = `Naujas apmokėtas užsakymas — ${answers.name || row.email || orderId}`;

  const html = `
    <div style="font-family:system-ui,sans-serif;line-height:1.5;color:#2c2a26;max-width:560px">
      <h1 style="font-size:20px;margin:0 0 16px">Naujas apmokėtas užsakymas</h1>
      <p style="margin:0 0 20px">Klientas apmokėjo — galite ruošti PDF per 24 val.</p>

      <table style="width:100%;border-collapse:collapse;font-size:14px">
        <tr><td style="padding:6px 0;color:#6b6560">Užsakymo ID</td><td><strong>${escapeHtml(orderId)}</strong></td></tr>
        <tr><td style="padding:6px 0;color:#6b6560">Vardas</td><td>${escapeHtml(answers.name || "—")}</td></tr>
        <tr><td style="padding:6px 0;color:#6b6560">El. paštas</td><td>${escapeHtml(row.email || answers.email || "—")}</td></tr>
        <tr><td style="padding:6px 0;color:#6b6560">Paketas</td><td>${escapeHtml(pkg ? `${pkg.name} — ${pkg.subtitle}` : packageId)}</td></tr>
        <tr><td style="padding:6px 0;color:#6b6560">Suma</td><td><strong>${formatEur(row.amount_cents)}</strong></td></tr>
        <tr><td style="padding:6px 0;color:#6b6560">Pareigos</td><td>${escapeHtml(answers.job_title || "—")}</td></tr>
        <tr><td style="padding:6px 0;color:#6b6560">Miestas</td><td>${escapeHtml(answers.city || "—")}</td></tr>
        <tr><td style="padding:6px 0;color:#6b6560">Nuotraukos</td><td>${photoCount ?? 0} vnt.</td></tr>
        <tr><td style="padding:6px 0;color:#6b6560">PDF pristatymas</td><td>${escapeHtml(answers.delivery_preference || "El. paštu")}</td></tr>
      </table>

      ${
        answers.responsibilities || answers.digitize_what
          ? `<div style="margin-top:20px;padding:14px;background:#f0ebe3;border-radius:8px;font-size:14px">
        ${answers.responsibilities ? `<p style="margin:0 0 8px"><strong>Darbas:</strong><br>${escapeHtml(answers.responsibilities.slice(0, 500))}${answers.responsibilities.length > 500 ? "…" : ""}</p>` : ""}
        ${answers.digitize_what ? `<p style="margin:0"><strong>Skaitmenizuoti:</strong><br>${escapeHtml(answers.digitize_what.slice(0, 500))}${answers.digitize_what.length > 500 ? "…" : ""}</p>` : ""}
      </div>`
          : ""
      }

      ${
        dashboardOrders
          ? `<p style="margin-top:24px"><a href="${dashboardOrders}" style="color:#5c7a6b">Atidaryti Supabase → orders</a></p>
      <p style="font-size:12px;color:#9a948d">Pilni atsakymai: Table Editor → form_responses · Nuotraukos: Storage → intake-uploads</p>`
          : `<p style="margin-top:24px;font-size:12px;color:#9a948d">Peržiūrėkite Supabase → orders, form_responses, intake-uploads</p>`
      }
    </div>
  `;

  const resend = new Resend(apiKey);
  const { error } = await resend.emails.send({
    from,
    to: ADMIN_EMAIL,
    subject,
    html,
  });

  if (error) {
    console.error("Resend error:", error);
  } else {
    console.log("Admin notification sent to", ADMIN_EMAIL, "order", orderId);
  }
}
