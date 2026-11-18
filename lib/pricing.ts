import { FX_RATES, VAT_RATE } from "@/lib/site";
import type { CategorySlug, ComplianceKey, Currency, PricingPlan, Software } from "@/lib/types";

/**
 * One cost engine for the calculator, the charts, the finder and the price index, so every
 * number on the site comes from the same arithmetic.
 */

const PER_SEAT = new Set(["user_month", "user_year", "employee_month", "worker_month"]);

export function isPerSeat(plan: PricingPlan) {
  return PER_SEAT.has(plan.period) || Boolean(plan.brackets?.length) || Boolean(plan.seat_tiers?.length) || plan.extra_seat_price !== undefined;
}

/** Plans with a usable public price. */
export function pricedPlans(s: Pick<Software, "pricing_plans">) {
  return s.pricing_plans.filter((p) => (p.price !== null && p.price > 0) || p.brackets?.length);
}

/** Cost for one month in the plan's own currency, for a given number of people. Null when it cannot be worked out. */
export function planMonthlyCost(plan: PricingPlan, seats: number): number | null {
  if (plan.max_seats !== undefined && seats > plan.max_seats) return null;
  if (plan.seats_unknown) return null;
  if (plan.brackets?.length) {
    const b = plan.brackets.find((x) => seats >= x.from && (x.to === null || seats <= x.to));
    if (!b) return null;
    return b.per_unit ? b.price * seats : b.price;
  }
  if (plan.price === null) return null;
  const billed = Math.max(seats, plan.min_seats ?? 1);
  let monthly: number;
  switch (plan.period) {
    case "user_month":
    case "employee_month":
    case "worker_month":
      monthly = plan.price * billed;
      break;
    case "user_year":
      monthly = (plan.price * billed) / 12;
      break;
    case "year":
      monthly = plan.price / 12;
      break;
    case "user_licence":
      // A licence per user with no stated term: spread over twelve months as a yearly figure.
      monthly = (plan.price * billed) / 12;
      break;
    case "once":
      monthly = plan.price / 36;
      break;
    default:
      monthly = plan.price;
  }
  if (plan.extra_seat_price !== undefined) {
    const extra = Math.max(0, seats - (plan.included_seats ?? 0));
    monthly += extra * plan.extra_seat_price;
  }
  if (plan.seat_tiers?.length) {
    let counted = 0;
    for (const tier of plan.seat_tiers) {
      const cap = tier.upto ?? Infinity;
      const inTier = Math.max(0, Math.min(seats, cap) - counted);
      monthly += inTier * tier.price;
      counted += inTier;
      if (counted >= seats) break;
    }
  }
  return monthly;
}

export function toRand(value: number, currency: Currency) {
  return currency === "ZAR" ? value : value * FX_RATES[currency];
}

/** Monthly cost in rand including VAT. Prices whose VAT basis is unknown are treated as including VAT. */
export function planMonthlyRandIncl(plan: PricingPlan, seats: number): number | null {
  const m = planMonthlyCost(plan, seats);
  if (m === null) return null;
  const rand = toRand(m, plan.currency);
  return plan.vat_inclusive || plan.vat_unknown ? rand : rand * (1 + VAT_RATE);
}

/** The cheapest priced plan for a team size, by monthly rand cost including VAT. */
export function cheapestPlan(s: Pick<Software, "pricing_plans">, seats: number) {
  let best: { plan: PricingPlan; monthly: number } | null = null;
  for (const plan of pricedPlans(s)) {
    const m = planMonthlyRandIncl(plan, seats);
    if (m === null) continue;
    if (!best || m < best.monthly) best = { plan, monthly: m };
  }
  return best;
}

/** Monthly rand including VAT for the cheapest way to cover a team. Free plans count when they cover the team. */
export function monthlyForTeam(s: Software, seats: number): number | null {
  // A free plan counts only when it covers the whole team. Plans without a stated cap are unlimited.
  const freeFits = s.pricing_plans.some((p) => p.price === 0 && !p.brackets?.length && (p.max_seats === undefined || seats <= p.max_seats));
  if (freeFits) return 0;
  const paid = cheapestPlan(s, seats);
  return paid ? paid.monthly : null;
}

export const TEAM_SIZES = [1, 2, 3, 5, 8, 10, 15, 20, 25, 30, 40, 50, 75, 100];

/** Data for the "cost as your team grows" chart: one row per team size, one key per plan. */
export function costCurve(s: Pick<Software, "pricing_plans">, sizes = TEAM_SIZES) {
  const plans = pricedPlans(s);
  return {
    plans: plans.map((p) => p.name),
    rows: sizes.map((n) => {
      const row: Record<string, number | null> & { seats: number } = { seats: n };
      for (const p of plans) {
        const v = planMonthlyRandIncl(p, n);
        row[p.name] = v === null ? null : Math.round(v);
      }
      return row;
    }),
  };
}

/** Thirty six months of cost per plan for a team, in rand including VAT. */
export function threeYearCost(s: Pick<Software, "pricing_plans">, seats: number) {
  return pricedPlans(s)
    .map((p) => {
      const m = planMonthlyRandIncl(p, seats);
      return m === null ? null : { plan: p.name, year1: Math.round(m * 12), total: Math.round(m * 36) };
    })
    .filter((x): x is { plan: string; year1: number; total: number } => x !== null);
}

export interface CoverageCounts {
  covered: number;
  gap: number;
  unconfirmed: number;
  total: number;
}

export function complianceCoverage(s: Pick<Software, "compliance">, focus: ComplianceKey[]): CoverageCounts {
  const counts = { covered: 0, gap: 0, unconfirmed: 0, total: focus.length };
  for (const key of focus) {
    const st = s.compliance[key]?.status;
    if (st === "covered") counts.covered++;
    else if (st === "gap") counts.gap++;
    else counts.unconfirmed++;
  }
  return counts;
}

/**
 * Products priced per worker abroad (Employer of Record and contractor platforms) do not compare
 * with tools priced for a local team, so they stay out of category cost comparisons.
 */
export function isLocallyComparable(s: Pick<Software, "pricing_plans">) {
  const plans = pricedPlans(s);
  return !(plans.length > 0 && plans.every((p) => p.period === "worker_month"));
}

/** Category peers with a public price, costed for the same team, cheapest first. */
export function categoryPriceComparison(all: Software[], category: CategorySlug, seats: number) {
  return all
    .filter((s) => s.category === category && isLocallyComparable(s))
    .map((s) => ({ slug: s.slug, name: s.name, monthly: monthlyForTeam(s, seats), checked: Boolean(s.price_checked_at) }))
    .filter((x): x is { slug: string; name: string; monthly: number; checked: boolean } => x.monthly !== null)
    .sort((a, b) => a.monthly - b.monthly);
}

export function median(values: number[]) {
  if (!values.length) return null;
  const v = [...values].sort((a, b) => a - b);
  const mid = Math.floor(v.length / 2);
  return v.length % 2 ? v[mid] : (v[mid - 1] + v[mid]) / 2;
}

export function yearsTrading(founded: number | undefined, now = new Date()) {
  return founded ? now.getUTCFullYear() - founded : null;
}

/** The team size used to compare products fairly within a category. */
export const REFERENCE_TEAM: Record<CategorySlug, { seats: number; unit: string }> = {
  accounting: { seats: 3, unit: "users" },
  payroll: { seats: 10, unit: "employees" },
  hr: { seats: 25, unit: "employees" },
  crm: { seats: 5, unit: "users" },
  erp: { seats: 10, unit: "users" },
  "project-management": { seats: 10, unit: "users" },
};

