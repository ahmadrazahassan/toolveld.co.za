import { COMPLIANCE_CHECKLIST } from "@/lib/site";
import { formatRand } from "@/lib/format";
import { monthlyForTeam } from "@/lib/pricing";
import type { CompanySize, ComplianceKey, Software } from "@/lib/types";

export const SIZE_HEADCOUNT: Record<CompanySize, number> = {
  sole: 1,
  "2-10": 5,
  "11-50": 25,
  "51-200": 100,
  "201-500": 300,
  "500+": 600,
};

export const BUDGETS = [
  { value: 500, label: "Up to R500 a month" },
  { value: 2000, label: "Up to R2 000 a month" },
  { value: 10000, label: "Up to R10 000 a month" },
  { value: 0, label: "No fixed limit" },
] as const;

export interface FinderInput {
  category: string;
  size: CompanySize;
  budget: number;
  mustHave: ComplianceKey[];
}

export interface FinderResult {
  software: Software;
  monthlyIncl: number | null;
  reasons: string[];
  score: number;
}

/** Monthly cost in rand including VAT for a team. Null when the price is not public. Uses the shared cost engine. */
export function estimateMonthly(s: Software, seats: number): number | null {
  return monthlyForTeam(s, seats);
}

/**
 * Filters and ranks the register deterministically. No AI and no invented scores: every
 * point comes from a field on the product record, and every reason is printed.
 */
export function runFinder(all: Software[], input: FinderInput): FinderResult[] {
  const seats = SIZE_HEADCOUNT[input.size];
  const labels = new Map(COMPLIANCE_CHECKLIST.map((c) => [c.key, c.label]));
  return all
    .filter((s) => s.category === input.category)
    .filter((s) => input.mustHave.every((k) => s.compliance[k]?.status === "covered"))
    .map((s) => {
      const reasons: string[] = [];
      let score = 0;
      const monthly = estimateMonthly(s, seats);

      if (s.best_for_sizes.includes(input.size)) {
        score += 30;
        reasons.push("Built for businesses your size");
      }
      if (monthly !== null) {
        if (!input.budget || monthly <= input.budget) {
          score += 25;
          reasons.push(monthly === 0 ? "Free at your size" : `About ${formatRand(monthly, { whole: true })} a month incl VAT for your team`);
        } else {
          score -= 20;
          reasons.push(`Over budget at about ${formatRand(monthly, { whole: true })} a month incl VAT`);
        }
      } else {
        reasons.push(s.pricing_model === "quote" ? "Sold on quotation, so check the cost" : "Price not yet recorded");
      }
      if (input.mustHave.length) {
        score += 20;
        reasons.push(`Covers ${input.mustHave.map((k) => labels.get(k)).join(", ")}`);
      }
      const coveredCount = Object.values(s.compliance).filter((c) => c?.status === "covered").length;
      score += coveredCount * 3;
      if (s.free_trial) {
        score += 5;
        reasons.push(s.free_trial_days ? `${s.free_trial_days} day free trial` : "Free trial available");
      }
      if (s.free_version) score += 5;
      if (s.price_checked_at) score += 2;
      return { software: s, monthlyIncl: monthly, reasons, score };
    })
    .sort((a, b) => b.score - a.score || a.software.name.localeCompare(b.software.name))
    .slice(0, 3);
}
