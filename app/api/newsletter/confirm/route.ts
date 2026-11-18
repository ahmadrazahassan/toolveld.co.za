import { NextResponse } from "next/server";
import { CATEGORY_SLUGS, SITE_NAME } from "@/lib/site";
import { emailButton, emailLayout, escapeHtml, inbox, saveContact, sendEmail } from "@/lib/email/resend";
import { emailLinkOrigin } from "@/lib/email/origin";
import { readToken, signToken } from "@/lib/email/tokens";

/**
 * Double opt in: the link in the confirmation email lands here. The subscriber is saved in
 * Resend Contacts. If the API key can only send email, our inbox is told instead so a person
 * can add the address in Resend.
 */
export async function GET(request: Request) {
  const url = new URL(request.url);
  const back = (status: string) => NextResponse.redirect(new URL(`/newsletter?status=${status}`, url.origin));
  const data = readToken(url.searchParams.get("token") ?? "", "confirm");
  if (!data) return back("invalid");

  const { email } = data;
  const interests = data.interests.filter((i) => (CATEGORY_SLUGS as readonly string[]).includes(i));
  const saved = await saveContact(email);
  if (saved !== "saved") {
    const told = await sendEmail({
      to: inbox(),
      subject: `[${SITE_NAME} newsletter] New subscriber ${email}`,
      html: emailLayout(
        "New confirmed subscriber",
        `<p><strong>${escapeHtml(email)}</strong> confirmed their subscription to the brief.</p><p>Interests: ${escapeHtml(interests.join(", ") || "none chosen")}</p><p style="color:#5f5f66;font-size:13px">Add this address in Resend under Contacts. The site could not add it itself because the API key only has sending access.</p>`,
      ),
      text: `${email} confirmed their subscription to the brief.\nInterests: ${interests.join(", ") || "none chosen"}\n\nAdd this address in Resend under Contacts.`,
    });
    if (!told) return back("error");
  }

  const unsubscribeToken = signToken("unsubscribe", email, 3650);
  const origin = await emailLinkOrigin();
  const unsubscribeLink = unsubscribeToken ? `${origin}/newsletter/unsubscribe?token=${encodeURIComponent(unsubscribeToken)}` : `${origin}/newsletter/unsubscribe`;
  await sendEmail({
    to: email,
    subject: `You are subscribed to the ${SITE_NAME} brief`,
    html: emailLayout(
      "You are on the list",
      `<p>Thanks for confirming. Once a month you will get the price changes we caught, new software on the register and the SARS deadlines coming up.</p>${emailButton(`${origin}/prices`, "See this month's prices")}<p style="color:#5f5f66;font-size:13px">Changed your mind? <a href="${escapeHtml(unsubscribeLink)}" style="color:#5f5f66">Unsubscribe with one click</a>.</p>`,
    ),
    text: `Thanks for confirming. Once a month you will get the price changes we caught, new software on the register and the SARS deadlines coming up.\n\nUnsubscribe: ${unsubscribeLink}`,
  });
  return back("confirmed");
}
