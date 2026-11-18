/**
 * Everything the site sends or stores goes through Resend. There is no database.
 *
 *   RESEND_API_KEY      Resend API key. A "Sending access" key sends email only; a
 *                       "Full access" key also saves newsletter contacts in Resend.
 *   EMAIL_FROM          Sender, e.g. "Toolveld <hello@toolveld.co.za>". The domain must be
 *                       verified in Resend. Until then only "onboarding@resend.dev" works, and
 *                       it can only deliver to the email address of your Resend account.
 *   CONTACT_INBOX       Where contact messages, reviews and subscriber notices are delivered.
 *                       Falls back to CONTACT_EMAIL from lib/site.ts.
 *   RESEND_SEGMENT_ID   Optional. Newsletter contacts are also added to this segment.
 *
 * Server code only: the key never reaches the browser.
 */
import { CONTACT_EMAIL, SITE_NAME } from "@/lib/site";

const API = "https://api.resend.com";

const apiKey = () => process.env.RESEND_API_KEY?.trim() ?? "";
const sender = () => process.env.EMAIL_FROM?.trim() ?? "";
const segmentId = () => process.env.RESEND_SEGMENT_ID?.trim() ?? "";

/** The inbox that receives contact messages, reviews and subscriber notices. */
export function inbox() {
  return process.env.CONTACT_INBOX?.trim() || CONTACT_EMAIL;
}

export function isEmailConfigured() {
  return Boolean(apiKey() && sender());
}

interface ResendResponse {
  ok: boolean;
  status: number;
  name: string | null;
}

async function call(path: string, method: "POST" | "PATCH", body?: unknown): Promise<ResendResponse> {
  const key = apiKey();
  if (!key) return { ok: false, status: 0, name: "missing_api_key" };
  try {
    const res = await fetch(`${API}${path}`, {
      method,
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: body === undefined ? undefined : JSON.stringify(body),
      cache: "no-store",
    });
    let name: string | null = null;
    if (!res.ok) {
      try {
        name = ((await res.json()) as { name?: string }).name ?? null;
      } catch {
        name = null;
      }
    }
    return { ok: res.ok, status: res.status, name };
  } catch {
    return { ok: false, status: 0, name: "network_error" };
  }
}

export async function sendEmail({
  to,
  subject,
  html,
  text,
  replyTo,
}: {
  to: string;
  subject: string;
  html: string;
  text: string;
  replyTo?: string;
}): Promise<boolean> {
  const from = sender();
  if (!from) return false;
  const res = await call("/emails", "POST", { from, to, subject, html, text, ...(replyTo ? { reply_to: replyTo } : {}) });
  return res.ok;
}

export type ContactResult = "saved" | "restricted" | "failed";

/** Adds a confirmed subscriber to Resend Contacts, or resubscribes one already there. */
export async function saveContact(email: string): Promise<ContactResult> {
  const segment = segmentId();
  const created = await call("/contacts", "POST", {
    email,
    unsubscribed: false,
    ...(segment ? { segments: [{ id: segment }] } : {}),
  });
  if (created.ok) return "saved";
  if (created.name === "restricted_api_key" || created.status === 401) return "restricted";

  // Most likely the contact exists already: switch it back on and make sure it is in the segment.
  const updated = await call(`/contacts/${encodeURIComponent(email)}`, "PATCH", { unsubscribed: false });
  if (!updated.ok) return updated.name === "restricted_api_key" ? "restricted" : "failed";
  if (segment) await call(`/contacts/${encodeURIComponent(email)}/segments/${encodeURIComponent(segment)}`, "POST");
  return "saved";
}

/** Marks a contact as unsubscribed from all Broadcasts. */
export async function unsubscribeContact(email: string): Promise<ContactResult> {
  const res = await call(`/contacts/${encodeURIComponent(email)}`, "PATCH", { unsubscribed: true });
  if (res.ok) return "saved";
  return res.name === "restricted_api_key" || res.status === 401 ? "restricted" : "failed";
}

export function escapeHtml(s: string) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

/** A plain, branded wrapper that reads well in every mail client. Pass already escaped HTML. */
export function emailLayout(heading: string, bodyHtml: string) {
  return `<!doctype html><html><body style="margin:0;background:#f1f1f1;font-family:Arial,Helvetica,sans-serif;color:#131315">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f1f1f1;padding:32px 12px"><tr><td align="center">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#ffffff;border-radius:16px;overflow:hidden">
<tr><td style="background:#131315;padding:18px 28px"><span style="display:inline-block;background:#fed400;color:#131315;font-weight:bold;border-radius:8px;padding:4px 10px;font-size:15px">${escapeHtml(SITE_NAME)}</span></td></tr>
<tr><td style="padding:28px">
<h1 style="margin:0 0 16px;font-size:22px;line-height:1.3">${escapeHtml(heading)}</h1>
<div style="font-size:15px;line-height:1.6">${bodyHtml}</div>
</td></tr></table>
</td></tr></table></body></html>`;
}

/** Big yellow button for email bodies. */
export function emailButton(href: string, label: string) {
  return `<p style="margin:24px 0"><a href="${escapeHtml(href)}" style="display:inline-block;background:#fed400;color:#131315;font-weight:bold;text-decoration:none;border-radius:10px;padding:12px 22px">${escapeHtml(label)}</a></p>`;
}
