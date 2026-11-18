import { headers } from "next/headers";
import { SITE_URL } from "@/lib/site";

/**
 * The address links in emails should point to. Never taken from the Host header in production,
 * so a forged header cannot put someone else's domain into an email we send.
 *   Production on Vercel: NEXT_PUBLIC_SITE_URL if set, else the project's production domain.
 *   Preview on Vercel:    that deployment's own URL.
 *   Local development:    http://localhost with the port in use.
 */
export async function emailLinkOrigin(): Promise<string> {
  if (process.env.VERCEL_ENV === "production") {
    if (process.env.NEXT_PUBLIC_SITE_URL) return SITE_URL;
    const prod = process.env.VERCEL_PROJECT_PRODUCTION_URL;
    return prod ? `https://${prod}` : SITE_URL;
  }
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  const host = (await headers()).get("host") ?? "";
  if (/^(localhost|127\.0\.0\.1)(:\d+)?$/.test(host)) return `http://${host}`;
  return SITE_URL;
}
