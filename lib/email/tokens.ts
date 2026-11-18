/**
 * Signed links for the newsletter, so confirming and unsubscribing need no database.
 * A token carries the email address, what it is for and when it expires, plus an HMAC
 * signature made with NEWSLETTER_SECRET. Without that variable the secret is derived from
 * RESEND_API_KEY, so links keep working until the key changes.
 */
import { createHash, createHmac, timingSafeEqual } from "node:crypto";

export type TokenPurpose = "confirm" | "unsubscribe";

interface Payload {
  p: TokenPurpose;
  e: string;
  i?: string[];
  x: number;
}

function secret() {
  const own = process.env.NEWSLETTER_SECRET?.trim();
  if (own) return own;
  const key = process.env.RESEND_API_KEY?.trim();
  return key ? createHash("sha256").update(`newsletter-links|${key}`).digest("hex") : "";
}

const b64 = (buf: Buffer | string) => Buffer.from(buf).toString("base64url");
const sign = (data: string, key: string) => createHmac("sha256", key).update(data).digest("base64url");

export function signToken(purpose: TokenPurpose, email: string, validDays: number, interests?: string[]): string | null {
  const key = secret();
  if (!key) return null;
  const payload: Payload = { p: purpose, e: email, x: Date.now() + validDays * 86_400_000, ...(interests?.length ? { i: interests } : {}) };
  const data = b64(JSON.stringify(payload));
  return `${data}.${sign(data, key)}`;
}

export function readToken(token: string, purpose: TokenPurpose): { email: string; interests: string[] } | null {
  const key = secret();
  if (!key || token.length > 2000) return null;
  const [data, sig] = token.split(".");
  if (!data || !sig) return null;
  const expected = Buffer.from(sign(data, key));
  const given = Buffer.from(sig);
  if (expected.length !== given.length || !timingSafeEqual(expected, given)) return null;
  try {
    const payload = JSON.parse(Buffer.from(data, "base64url").toString("utf8")) as Payload;
    if (payload.p !== purpose || typeof payload.e !== "string" || payload.x < Date.now()) return null;
    return { email: payload.e, interests: Array.isArray(payload.i) ? payload.i : [] };
  } catch {
    return null;
  }
}
