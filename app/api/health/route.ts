import { NextResponse } from "next/server";
import { getAppUrl } from "@/lib/app-url";
import { isMetaCapiConfigured } from "@/lib/meta-capi";
import { getSupabaseProjectRef, normalizeSupabaseUrl } from "@/lib/supabase";

function validateAppUrl(): string | null {
  try {
    getAppUrl();
    return null;
  } catch (error) {
    return error instanceof Error ? error.message : "NEXT_PUBLIC_APP_URL neteisingas";
  }
}

export async function GET() {
  const urlRaw = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
  const url = urlRaw ? normalizeSupabaseUrl(urlRaw) : "";
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";
  const stripeKey = process.env.STRIPE_SECRET_KEY || "";

  const urlRef = getSupabaseProjectRef(url);
  const anonRef = getSupabaseProjectRef(anonKey);
  const serviceRef = getSupabaseProjectRef(serviceKey);

  const issues: string[] = [];
  const warnings: string[] = [];

  if (!url) issues.push("Trūksta NEXT_PUBLIC_SUPABASE_URL");
  if (!anonKey) issues.push("Trūksta NEXT_PUBLIC_SUPABASE_ANON_KEY");
  if (!serviceKey) issues.push("Trūksta SUPABASE_SERVICE_ROLE_KEY");
  if (!stripeKey) issues.push("Trūksta STRIPE_SECRET_KEY");

  const appUrlIssue = validateAppUrl();
  if (appUrlIssue) issues.push(appUrlIssue);

  if (urlRaw && /\/rest\/v1\/?$/i.test(urlRaw.trim())) {
    issues.push(
      "NEXT_PUBLIC_SUPABASE_URL turi būti be /rest/v1/ — naudokite tik https://jqvlfatzquclkfrclxuh.supabase.co"
    );
  }

  if (url && !urlRef) {
    issues.push(
      "NEXT_PUBLIC_SUPABASE_URL neteisingas. Turi būti tik: https://jqvlfatzquclkfrclxuh.supabase.co (be /rest/v1/, be kabučių, be tarpų)"
    );
  }

  if (anonKey && !anonRef) {
    issues.push("NEXT_PUBLIC_SUPABASE_ANON_KEY neteisingas — nukopijuokite anon raktą iš Supabase → Settings → API");
  }

  if (serviceKey && !serviceRef) {
    issues.push("SUPABASE_SERVICE_ROLE_KEY neteisingas — nukopijuokite service_role raktą iš Supabase → Settings → API");
  }
  if (!process.env.STRIPE_WEBHOOK_SECRET) {
    warnings.push(
      "Trūksta STRIPE_WEBHOOK_SECRET — webhook neveiks, bet /api/session vis tiek patvirtins mokėjimą"
    );
  }

  const pixelId = (process.env.NEXT_PUBLIC_META_PIXEL_ID || process.env.META_PIXEL_ID || "").trim();
  if (!pixelId) {
    warnings.push("Trūksta NEXT_PUBLIC_META_PIXEL_ID — Meta Pixel neveiks");
  } else if (!isMetaCapiConfigured()) {
    warnings.push(
      "Trūksta META_CAPI_ACCESS_TOKEN — veiks tik naršyklės Pixel, be server-side Conversions API"
    );
  }

  const clarityId = (process.env.NEXT_PUBLIC_CLARITY_ID || "").trim();
  if (!clarityId) {
    warnings.push("Trūksta NEXT_PUBLIC_CLARITY_ID — heatmaps / Clarity neveiks");
  }

  if (urlRef && anonRef && urlRef !== anonRef) {
    issues.push(`Anon raktas iš kito projekto (${anonRef}), URL projektas: ${urlRef}`);
  }

  if (urlRef && serviceRef && urlRef !== serviceRef) {
    issues.push(
      `SERVICE ROLE raktas iš KITO projekto (${serviceRef}). Reikia rakto iš projekto ${urlRef} (org PDF → alaniukas). Atidarykite: https://supabase.com/dashboard/project/${urlRef}/settings/api → service_role → Copy → įklijuokite į .env.local`
    );
  }

  const ok = issues.length === 0;

  return NextResponse.json({
    ok,
    project: urlRef,
    checks: {
      supabase_url: !!url,
      supabase_anon: anonRef === urlRef,
      supabase_service_role: serviceRef === urlRef,
      stripe: !!stripeKey,
      app_url: !appUrlIssue,
      meta_pixel: !!pixelId,
      meta_capi: isMetaCapiConfigured(),
      clarity: !!clarityId,
    },
    app_url: appUrlIssue ? null : getAppUrl(),
    issues,
    warnings,
  });
}
