"use server";

import { randomBytes } from "node:crypto";
import { CATEGORY_SLUGS, CONTACT_EMAIL, SITE_NAME, SITE_URL } from "@/lib/site";
import { getPublicClient } from "@/lib/supabase/public";
import type { ActionResult, CompanySize, ContactSubject } from "@/lib/types";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const SIZES: CompanySize[] = ["sole", "2-10", "11-50", "51-200", "201-500", "500+"];
const SUBJECTS: ContactSubject[] = ["general", "correction", "listing", "vendor", "advertising"];

function text(fd: FormData, key: string) {
  const v = fd.get(key);
  return typeof v === "string" ? v.trim() : "";
}

function isBot(fd: FormData) {
  return text(fd, "company_website").length > 0;
}

const NOT_CONNECTED = `Our database is not connected yet, so this form cannot save. Please email ${CONTACT_EMAIL} instead.`;

function escapeHtml(s: string) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

async function sendEmail(to: string, subject: string, html: string, replyTo?: string) {
  const key = process.env.RESEND_API_KEY;
  const from = process.env.EMAIL_FROM;
  if (!key || !from) return false;
  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({ from, to, subject, html, ...(replyTo ? { reply_to: replyTo } : {}) }),
    });
    return res.ok;
  } catch {
    return false;
  }
}

/* Newsletter: double opt in. */
export async function subscribeToNewsletter(fd: FormData): Promise<ActionResult> {
  if (isBot(fd)) return { ok: true, message: "Thanks. Check your inbox for a confirmation link." };
  const email = text(fd, "email").toLowerCase();
  const consent = text(fd, "consent") === "yes";
  const interests = fd.getAll("interests").filter((v): v is string => typeof v === "string" && (CATEGORY_SLUGS as readonly string[]).includes(v));

  if (!EMAIL_RE.test(email)) return { ok: false, message: "Please enter a valid email address.", fieldErrors: { email: "Invalid email" } };
  if (!consent) return { ok: false, message: "Please tick the consent box so we can send the brief.", fieldErrors: { consent: "Required" } };

  const sb = getPublicClient();
  if (!sb) return { ok: false, message: NOT_CONNECTED };

  const token = randomBytes(24).toString("hex");
  const { error } = await sb.rpc("newsletter_subscribe", { p_email: email, p_interests: interests, p_token: token });
  if (error) return { ok: false, message: "Something went wrong on our side. Please try again in a minute." };

  const link = `${SITE_URL}/api/newsletter/confirm?token=${token}`;
  const sent = await sendEmail(
    email,
    `Confirm your ${SITE_NAME} subscription`,
    `<p>Thanks for signing up to the ${SITE_NAME} monthly brief.</p><p><a href="${link}">Confirm your subscription</a></p><p>If you did not ask for this, ignore this email and nothing will happen.</p>`,
  );
  return {
    ok: true,
    message: sent
      ? "We sent you a link to confirm your subscription. The first brief arrives once you click it."
      : "You are on the list. We will send a confirmation link before the first brief goes out.",
  };
}

/* Contact form. */
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

  const done = { ok: true, message: "Thanks. Your message is in our inbox and we reply within two working days." };
  const sb = getPublicClient();
  if (sb) {
    const { error } = await sb.from("contact_messages").insert({ name, email, subject, message, consent });
    if (error) return { ok: false, message: "Something went wrong on our side. Please try again in a minute." };
  }
  // Also email the message to the inbox, so nothing is lost before the database is connected.
  const mailed = await sendEmail(
    CONTACT_EMAIL,
    `[${SITE_NAME} contact: ${subject}] ${name}`,
    `<p><strong>From:</strong> ${escapeHtml(name)} &lt;${escapeHtml(email)}&gt;</p><p><strong>Subject:</strong> ${subject}</p><p>${escapeHtml(message).replace(/\n/g, "<br>")}</p>`,
    email,
  );
  if (!sb && !mailed) return { ok: false, message: NOT_CONNECTED };
  return done;
}

/* Reviews: saved hidden, published only after moderation. */
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

  const sb = getPublicClient();
  if (!sb) return { ok: false, message: NOT_CONNECTED };
  const { error } = await sb.from("reviews").insert({
    software_id: softwareId,
    ...ratings,
    title,
    pros,
    cons,
    company_size,
    usage_duration,
    reviewer_role,
    reviewer_first_name,
    country,
    reviewer_email: email,
    status: "hidden",
  });
  if (error) return { ok: false, message: "Something went wrong on our side. Please try again in a minute." };
  return {
    ok: true,
    message: "Thank you. A person reads every review before it goes live, usually within three working days.",
  };
}

/* Helpful votes: one per browser, counted by a database trigger. */
export async function markReviewHelpful(reviewId: string, voterId: string): Promise<ActionResult> {
  if (!/^[a-f0-9-]{16,64}$/i.test(voterId)) return { ok: false, message: "Invalid vote." };
  const sb = getPublicClient();
  if (!sb) return { ok: false, message: "Votes are not switched on yet." };
  const { error } = await sb.from("helpful_votes").insert({ review_id: reviewId, voter_id: voterId });
  if (error) return { ok: false, message: "You have already marked this review helpful." };
  return { ok: true, message: "Thanks for the vote." };
}

/* One click unsubscribe. */
export async function unsubscribe(token: string): Promise<ActionResult> {
  if (!/^[a-f0-9]{48}$/.test(token)) return { ok: false, message: "That unsubscribe link is not valid." };
  const sb = getPublicClient();
  if (!sb) return { ok: false, message: NOT_CONNECTED };
  const { data, error } = await sb.rpc("newsletter_unsubscribe", { p_token: token });
  if (error || !data) return { ok: false, message: "We could not find that subscription. It may already be removed." };
  return { ok: true, message: "You are unsubscribed. You will not hear from us again unless you sign up." };
}
