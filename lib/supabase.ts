import { createClient, SupabaseClient } from "@supabase/supabase-js";

function getSupabaseUrl(): string {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!url) throw new Error("NEXT_PUBLIC_SUPABASE_URL is not set");
  return url;
}

export function getSupabaseProjectRef(value: string): string | null {
  const urlMatch = value.match(/https:\/\/([^.]+)\.supabase\.co/);
  if (urlMatch) return urlMatch[1];

  try {
    const payload = value.split(".")[1];
    if (!payload) return null;
    const decoded = JSON.parse(Buffer.from(payload, "base64url").toString("utf8")) as {
      ref?: string;
    };
    return decoded.ref ?? null;
  } catch {
    return null;
  }
}

export function createBrowserClient(): SupabaseClient {
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!key) throw new Error("NEXT_PUBLIC_SUPABASE_ANON_KEY is not set");
  return createClient(getSupabaseUrl(), key);
}

export function createServiceClient(): SupabaseClient {
  const url = getSupabaseUrl();
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!serviceKey) {
    throw new Error("SUPABASE_SERVICE_ROLE_KEY is not set");
  }

  const urlRef = getSupabaseProjectRef(url);
  const serviceRef = getSupabaseProjectRef(serviceKey);

  if (urlRef && serviceRef && urlRef !== serviceRef) {
    throw new Error(
      `SUPABASE_SERVICE_ROLE_KEY is from project "${serviceRef}", but URL is project "${urlRef}". ` +
        `Copy service_role from https://supabase.com/dashboard/project/${urlRef}/settings/api`
    );
  }

  return createClient(url, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
