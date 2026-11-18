import { COMPLIANCE_CHECKLIST, MARKET_ADJECTIVE } from "@/lib/site";
import { COMPANY_SIZE_LABEL, formatPriceLine, formatRating, planPriceParts, softwarePriceParts } from "@/lib/format";
import { hasPublicRating } from "@/lib/reviews-policy";
import type { Category, FAQ, Software } from "@/lib/types";

function list(items: string[]) {
  if (items.length <= 1) return items.join("");
  return `${items.slice(0, -1).join(", ")} and ${items[items.length - 1]}`;
}

/**
 * Builds a product's FAQs from its own record, so the answers can never drift from the page.
 */
export function buildSoftwareFaqs(s: Software, category: Pick<Category, "compliance_focus" | "plural_label">): FAQ[] {
  const faqs: FAQ[] = [];
  const price = softwarePriceParts(s);

  // Cost
  let cost: string;
  if (price.kind === "free") {
    const paid = s.pricing_plans.filter((p) => p.price && p.price > 0);
    cost = `${s.name} has a free plan.`;
    if (paid.length) cost += ` Paid plans start at ${formatPriceLine(planPriceParts(paid[0], s.pricing_model))}.`;
  } else if (price.kind === "quoted") {
    cost = `${s.name} is sold on quotation, so there is no public list price.`;
  } else if (price.kind === "unlisted") {
    cost = `We have not yet recorded a price for ${s.name}. Check the vendor's own pricing page.`;
  } else {
    cost = `${s.name} starts at ${formatPriceLine(price)}.`;
    if (price.fx) cost += ` ${price.fx}`;
  }
  if (s.pricing_note) cost += ` ${s.pricing_note}`;
  faqs.push({ question: `How much does ${s.name} cost?`, answer: cost });

  // Trial and free version
  const trialParts: string[] = [];
  if (s.free_trial) trialParts.push(s.free_trial_days ? `a ${s.free_trial_days} day free trial` : "a free trial");
  if (s.free_version) trialParts.push("a free plan");
  if (s.demo) trialParts.push("a demo on request");
  faqs.push({
    question: `Is there a free trial or free version of ${s.name}?`,
    answer: trialParts.length
      ? `Yes. ${s.name} offers ${list(trialParts)}.`
      : `No. ${s.name} does not offer a free trial or free version at the moment.`,
  });

  // Local compliance
  const focus = COMPLIANCE_CHECKLIST.filter((c) => category.compliance_focus.includes(c.key));
  const covered = focus.filter((c) => s.compliance[c.key]?.status === "covered").map((c) => c.label);
  const gaps = focus.filter((c) => s.compliance[c.key]?.status === "gap").map((c) => c.label);
  const unconfirmed = focus
    .filter((c) => !s.compliance[c.key] || s.compliance[c.key]?.status === "unconfirmed")
    .map((c) => c.label);
  let compliance = covered.length ? `${s.name} covers ${list(covered)}.` : `We have not confirmed any local checklist items for ${s.name} yet.`;
  if (gaps.length) compliance += ` Gaps: ${list(gaps)}.`;
  if (unconfirmed.length) compliance += ` Not yet confirmed: ${list(unconfirmed)}.`;
  faqs.push({ question: `Does ${s.name} meet ${MARKET_ADJECTIVE} requirements?`, answer: compliance });

  // Bank feeds (only where they matter)
  if (category.compliance_focus.includes("vat201")) {
    faqs.push({
      question: `Which ${MARKET_ADJECTIVE} banks does ${s.name} connect to?`,
      answer: s.bank_feeds.length
        ? `${s.name} has bank feeds for ${list(s.bank_feeds)}. Check your exact account type with the vendor.`
        : `We have not confirmed direct bank feeds for ${s.name}. Statements can be imported from your bank instead.`,
    });
  }

  // Integrations
  if (s.integrations.length) {
    faqs.push({
      question: `What does ${s.name} integrate with?`,
      answer: `${s.name} connects with ${list(s.integrations.slice(0, 8))}${s.integrations.length > 8 ? ", among others" : ""}.`,
    });
  }

  // What reviewers say (only with enough reviews)
  if (hasPublicRating(s)) {
    faqs.push({
      question: `What do reviewers say about ${s.name}?`,
      answer: `${s.name} has an average rating of ${formatRating(s.rating_overall)} out of 5 from ${s.review_count} moderated reviews.`,
    });
  }

  // Who it suits
  const sizes = s.best_for_sizes.filter((k) => k !== "sole").map((k) => COMPANY_SIZE_LABEL[k].toLowerCase());
  const roles = list(s.best_for_roles.map((r) => r.charAt(0).toLowerCase() + r.slice(1)));
  faqs.push({
    question: `Who is ${s.name} best for?`,
    answer: `${s.name} suits ${roles}${sizes.length ? ` in businesses of ${list(sizes)} people` : ""}${
      s.best_for_sizes.includes("sole") ? ", and sole traders" : ""
    }.`,
  });

  return faqs;
}
