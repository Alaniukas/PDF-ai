/** Canonical app URL for Stripe redirects and emails. */
export function getAppUrl(): string {
  let url = "";

  if (process.env.NEXT_PUBLIC_APP_URL?.trim()) {
    url = process.env.NEXT_PUBLIC_APP_URL.trim().replace(/\/$/, "");
  } else if (process.env.VERCEL_URL?.trim()) {
    url = `https://${process.env.VERCEL_URL.trim().replace(/^https?:\/\//i, "")}`;
  } else {
    return "http://localhost:3456";
  }

  if (!/^https?:\/\//i.test(url)) {
    url = `https://${url}`;
  }

  try {
    new URL(url);
  } catch {
    throw new Error(
      `NEXT_PUBLIC_APP_URL neteisingas: "${process.env.NEXT_PUBLIC_APP_URL}". Naudokite https://didarbe.lt`,
    );
  }

  return url;
}
