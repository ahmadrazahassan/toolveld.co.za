"use server";

import { CATEGORY_SLUGS, CONTACT_EMAIL, SITE_NAME } from "@/lib/site";
import { emailButton, emailLayout, escapeHtml, inbox, isEmailConfigured, sendEmail, unsubscribeContact } from "@/lib/email/resend";
import { emailLinkOrigin } from "@/lib/email/origin";
import { readToken, signToken } from "@/lib/email/tokens";
import { getAllSoftware } from "@/lib/queries/software";
import { getPublicClient } from "@/lib/supabase/public";
import type { ActionResult, CompanySize, ContactSubject } from "@/lib/types";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const SIZES: CompanySize[] = ["sole", "2-10", "11-50", "51-200", "201-500", "500+"];
const SUBJECTS: ContactSubject[] = ["general", "correction", "listing", "vendor", "advertising"];

function text(fd: FormData, key: string) {
  const v = fd.get(key);
  return typeof v === "string" ? v.trim() : "";
}

/** One line, safe for an email subject. */
function oneLine(s: string, max = 80) {
  return s.replace(/\s+/g, " ").slice(0, max);
}

function isBot(fd: FormData) {
  return text(fd, "company_website").length > 0;
}

const NOT_CONNECTED = `Our email is not connected yet, so this form cannot send. Please email ${CONTACT_EMAIL} instead.`;

/** Rows of label and value for the emails we send to our own inbox. */
function detailsTable(rows: [string, string][]) {
  return `<table role="presentation" cellpadding="0" cellspacing="0" style="width:100%;border-collapse:collapse;font-size:14px">${rows
    .map(
      ([k, v]) =>
        `<tr><td style="padding:8px 12px 8px 0;color:#5f5f66;vertical-align:top;white-space:nowrap">${escapeHtml(k)}</td><td style="padding:8px 0;vertical-align:top">${escapeHtml(v).replace(/\n/g, "<br>")}</td></tr>`,
    )
    .join("")}</table>`;
}

const detailsText = (rows: [string, string][]) => rows.map(([k, v]) => `${k}: ${v}`).join("\n");

/* Newsletter: double opt in. The confirmation link is signed, so no database is needed. */
export async function subscribeToNewsletter(fd: FormData): Promise<ActionResult> {
  if (isBot(fd)) return { ok: true, message: "Thanks. Check your inbox for a confirmation link." };
  const email = text(fd, "email").toLowerCase();
  const consent = text(fd, "consent") === "yes";
  const interests = fd.getAll("interests").filter((v): v is string => typeof v === "string" && (CATEGORY_SLUGS as readonly string[]).includes(v));

  if (!EMAIL_RE.test(email) || email.length > 320) return { ok: false, message: "Please enter a valid email address.", fieldErrors: { email: "Invalid email" } };
  if (!consent) return { ok: false, message: "Please tick the consent box so we can send the brief.", fieldErrors: { consent: "Required" } };

  const token = isEmailConfigured() ? signToken("confirm", email, 7, interests) : null;
  if (!token) return { ok: false, message: `Sign ups are not switched on yet. Please email ${CONTACT_EMAIL} and we will add you.` };

  const link = `${await emailLinkOrigin()}/api/newsletter/confirm?token=${encodeURIComponent(token)}`;
  const sent = await sendEmail({
    to: email,
    subject: `Confirm your ${SITE_NAME} subscription`,
    html: emailLayout(
      "Confirm your subscription",
      `<p>Thanks for signing up to the ${escapeHtml(SITE_NAME)} monthly brief: price changes we caught, new software on the register and the SARS deadlines coming up.</p>${emailButton(link, "Confirm my subscription")}<p style="color:#5f5f66;font-size:13px">This link works for 7 days. If you did not ask for this, ignore this email and nothing will happen.</p>`,
    ),
    text: `Thanks for signing up to the ${SITE_NAME} monthly brief.\n\nConfirm your subscription: ${link}\n\nThis link works for 7 days. If you did not ask for this, ignore this email and nothing will happen.`,
  });
  if (!sent) return { ok: false, message: "We could not send the confirmation email just now. Please try again in a few minutes." };
  return { ok: true, message: "We sent you a link to confirm your subscription. The first brief arrives once you click it." };
}

/* Contact form: delivered to our inbox by email, with Reply going straight to the sender. */
export async function submitContact(fd: FormData): Promise<ActionResult> {
  if (isBot(fd)) return { ok: true, message: "Thanks. We will get back to you." };
  const name = text(fd, "name");
  const email = text(fd, "email").toLowerCase();
  const subject = text(fd, "subject") as ContactSubject;
  const message = text(fd, "message");
  const consent = text(fd, "consent") === "yes";

  const fieldErrors: Record<string, string> = {};
  if (name.length < 2) fieldErrors.name = "Please tell us your name.";
  if (!EMAIL_RE.test(email)) fieldErrors.email = "Please enter a valid email address.";
  if (!SUBJECTS.includes(subject)) fieldErrors.subject = "Please choose a subject.";
  if (message.length < 10) fieldErrors.message = "Please write at least a sentence.";
  if (message.length > 5000) fieldErrors.message = "Please keep it under 5 000 characters.";
  if (!consent) fieldErrors.consent = "Please agree so we can reply.";
  if (Object.keys(fieldErrors).length) return { ok: false, message: "Please fix the highlighted fields.", fieldErrors };

  if (!isEmailConfigured()) return { ok: false, message: NOT_CONNECTED };
  const rows: [string, string][] = [
    ["From", `${name} <${email}>`],
    ["Subject", subject],
    ["Message", message],
  ];
  const mailed = await sendEmail({
    to: inbox(),
    subject: `[${SITE_NAME} contact: ${subject}] ${oneLine(name)}`,
    html: emailLayout(`New message from ${oneLine(name)}`, `${detailsTable(rows)}<p style="color:#5f5f66;font-size:13px">Press Reply to answer ${escapeHtml(name)} directly.</p>`),
    text: detailsText(rows),
    replyTo: email,
  });
  if (!mailed) return { ok: false, message: `We could not send your message just now. Please email ${CONTACT_EMAIL} instead.` };
  return { ok: true, message: "Thanks. Your message is in our inbox and we reply within two working days." };
}

/* Reviews: emailed to our inbox for moderation. Nothing is published until a person checks it. */
export async function submitReview(fd: FormData): Promise<ActionResult> {
  if (isBot(fd)) return { ok: true, message: "Thanks. Your review is waiting for moderation." };
  const softwareId = text(fd, "software_id");
  const nums = ["rating_overall", "rating_ease", "rating_value", "rating_service", "rating_functionality"] as const;
  const ratings: Record<string, number> = {};
  const fieldErrors: Record<string, string> = {};
  for (const k of nums) {
    const v = Number(text(fd, k));
    if (!Number.isInteger(v) || v < 1 || v > 5) fieldErrors[k] = "Choose from 1 to 5 stars.";
    ratings[k] = v;
  }
  const title = text(fd, "title");
  const pros = text(fd, "pros");
  const cons = text(fd, "cons");
  const company_size = text(fd, "company_size") as CompanySize;
  const usage_duration = text(fd, "usage_duration");
  const reviewer_role = text(fd, "reviewer_role");
  const reviewer_first_name = text(fd, "reviewer_first_name");
  const country = text(fd, "country").toUpperCase();
  const email = text(fd, "email").toLowerCase();
  const consent = text(fd, "consent") === "yes";

  if (!softwareId) fieldErrors.software_id = "Missing product.";
  if (title.length < 5 || title.length > 120) fieldErrors.title = "Use 5 to 120 characters.";
  if (pros.length < 20) fieldErrors.pros = "Tell us a little more, at least 20 characters.";
  if (cons.length < 20) fieldErrors.cons = "Tell us a little more, at least 20 characters.";
  if (pros.length > 3000 || cons.length > 3000) fieldErrors.pros = "Please keep each answer under 3 000 characters.";
  if (!SIZES.includes(company_size)) fieldErrors.company_size = "Choose your company size.";
  if (!usage_duration) fieldErrors.usage_duration = "Tell us how long you have used it.";
  if (reviewer_role.length < 2) fieldErrors.reviewer_role = "Tell us your role.";
  if (reviewer_first_name.length < 2) fieldErrors.reviewer_first_name = "Tell us your first name.";
  if (!/^[A-Z]{2}$/.test(country)) fieldErrors.country = "Choose your country.";
  if (!EMAIL_RE.test(email)) fieldErrors.email = "Please enter a valid email address.";
  if (!consent) fieldErrors.consent = "Please confirm the statements above.";
  if (Object.keys(fieldErrors).length) return { ok: false, message: "Please fix the highlighted fields.", fieldErrors };

  if (!isEmailConfigured()) return { ok: false, message: NOT_CONNECTED };
  const product = (await getAllSoftware()).find((s) => s.id === softwareId || s.slug === softwareId);
  const productName = product?.name ?? softwareId;
  const rows: [string, string][] = [
    ["Product", productName],
    ["Overall", `${ratings.rating_overall} of 5`],
    ["Ease of use", `${ratings.rating_ease} of 5`],
    ["Value for money", `${ratings.rating_value} of 5`],
    ["Customer service", `${ratings.rating_service} of 5`],
    ["Functionality", `${ratings.rating_functionality} of 5`],
    ["Title", title],
    ["What they like", pros],
    ["What they dislike", cons],
    ["Reviewer", `${reviewer_first_name}, ${reviewer_role}`],
    ["Company size", company_size],
    ["Used for", usage_duration],
    ["Country", country],
    ["Email", email],
  ];
  const mailed = await sendEmail({
    to: inbox(),
    subject: `[${SITE_NAME} review] ${productName}: ${oneLine(title, 60)}`,
    html: emailLayout(
      `New review of ${productName}`,
      `${detailsTable(rows)}<p style="color:#5f5f66;font-size:13px">Check it before it goes live. Press Reply to ask the reviewer a question.</p>`,
    ),
    text: detailsText(rows),
    replyTo: email,
  });
  if (!mailed) return { ok: false, message: `We could not send your review just now. Please try again in a few minutes.` };
  return {
    ok: true,
    message: "Thank you. A person reads every review before it goes live, usually within three working days.",
  };
}

/* Helpful votes need a database to count them, so they stay off until one is connected. */
export async function markReviewHelpful(reviewId: string, voterId: string): Promise<ActionResult> {
  if (!/^[a-f0-9-]{16,64}$/i.test(voterId)) return { ok: false, message: "Invalid vote." };
  const sb = getPublicClient();
  if (!sb) return { ok: false, message: "Votes are not switched on yet." };
  const { error } = await sb.from("helpful_votes").insert({ review_id: reviewId, voter_id: voterId });
  if (error) return { ok: false, message: "You have already marked this review helpful." };
  return { ok: true, message: "Thanks for the vote." };
}

/* One click unsubscribe from the signed link in our emails. */
export async function unsubscribe(token: string): Promise<ActionResult> {
  const data = readToken(token, "unsubscribe");
  if (!data) return { ok: false, message: "That unsubscribe link is not valid." };
  const done: ActionResult = { ok: true, message: "You are unsubscribed. You will not hear from us again unless you sign up." };
  if ((await unsubscribeContact(data.email)) === "saved") return done;

  // The API key cannot edit contacts, so ask a person to do it in Resend.
  const told = await sendEmail({
    to: inbox(),
    subject: `[${SITE_NAME} newsletter] Unsubscribe ${data.email}`,
    html: emailLayout("Unsubscribe request", `<p>${escapeHtml(data.email)} unsubscribed from the brief. Mark this contact as unsubscribed in Resend, under Contacts.</p>`),
    text: `${data.email} unsubscribed from the brief. Mark this contact as unsubscribed in Resend, under Contacts.`,
  });
  return told ? done : { ok: false, message: `We could not process that just now. Please email ${CONTACT_EMAIL} and we will remove you.` };
}
