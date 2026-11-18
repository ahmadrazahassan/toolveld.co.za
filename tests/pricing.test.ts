import { describe, expect, it } from "vitest";
import { allSoftware } from "@/lib/data/software";
import { costCurve, monthlyForTeam, planMonthlyCost, planMonthlyRandIncl, threeYearCost } from "@/lib/pricing";
import type { PricingPlan } from "@/lib/types";

const get = (slug: string) => allSoftware.find((s) => s.slug === slug)!;

describe("cost engine", () => {
  it("prices Sage Payroll by bracket, matching Sage's FY27 guide", () => {
    const plan = get("sage-payroll").pricing_plans[0];
    expect(planMonthlyCost(plan, 2)).toBe(97);
    expect(planMonthlyCost(plan, 3)).toBe(224);
    expect(planMonthlyCost(plan, 10)).toBe(430);
    expect(planMonthlyCost(plan, 11)).toBe(641);
    expect(planMonthlyCost(plan, 200)).toBe(4475);
    expect(planMonthlyCost(plan, 250)).toBeCloseTo(250 * 22.37, 2);
  });

  it("prices SimplePay on sliding rates, matching its own calculator", () => {
    const plan = get("simplepay").pricing_plans[0];
    const cases: [number, number][] = [[1, 89.5], [2, 109], [5, 167.5], [10, 235.5], [11, 246.5], [20, 345.5], [25, 400.5], [50, 675.5], [100, 1225.5]];
    for (const [seats, total] of cases) expect(planMonthlyCost(plan, seats)).toBeCloseTo(total, 2);
  });

  it("charges BambooHR a flat fee up to 25 people, then per employee", () => {
    const core = get("bamboohr").pricing_plans.find((p) => p.name === "Core")!;
    expect(planMonthlyCost(core, 10)).toBe(250);
    expect(planMonthlyCost(core, 25)).toBe(250);
    expect(planMonthlyCost(core, 40)).toBeCloseTo(410, 2);
  });

  it("adds Sage Accounting's R85 extra users above the two included", () => {
    const plan = get("sage-accounting").pricing_plans.find((p) => p.name.startsWith("Accounting"))!;
    expect(planMonthlyCost(plan, 2)).toBe(490);
    expect(planMonthlyCost(plan, 5)).toBe(745);
    expect(planMonthlyCost(plan, 3)).toBe(575);
  });

  it("skips plans that do not allow the team size", () => {
    const sage = get("sage-accounting");
    const start = sage.pricing_plans.find((p) => p.name === "Start")!;
    expect(planMonthlyCost(start, 1)).toBe(270);
    expect(planMonthlyCost(start, 3)).toBeNull();
    expect(monthlyForTeam(sage, 3)).toBe(575);
    expect(monthlyForTeam(get("hubspot-crm"), 2)).toBe(0);
    expect(monthlyForTeam(get("hubspot-crm"), 3)).toBeGreaterThan(0);
  });

  it("keeps Xero flat for any number of users", () => {
    const plan = get("xero").pricing_plans.find((p) => p.name === "Standard")!;
    expect(planMonthlyCost(plan, 1)).toBe(857);
    expect(planMonthlyCost(plan, 40)).toBe(857);
  });

  it("spreads yearly licences over twelve months", () => {
    const core = get("sage-pastel-accounting").pricing_plans.find((p) => p.name === "Core")!;
    expect(planMonthlyCost(core, 4)).toBe(1915);
  });

  it("bills the monday.com three seat minimum", () => {
    const std = get("monday-com").pricing_plans.find((p) => p.name === "Standard")!;
    expect(planMonthlyCost(std, 1)).toBe(planMonthlyCost(std, 3));
  });

  it("adds VAT to prices that exclude it and converts dollars at the stated rate", () => {
    const plan: PricingPlan = { name: "x", price: 100, period: "month", currency: "USD", vat_inclusive: false, features: [] };
    expect(planMonthlyRandIncl(plan, 1)).toBeCloseTo(100 * 16.8 * 1.15, 2);
  });

  it("builds chart data with one row per team size", () => {
    const curve = costCurve(get("xero"));
    expect(curve.plans).toEqual(["Starter", "Standard", "Premium"]);
    expect(curve.rows[0].seats).toBe(1);
    expect(threeYearCost(get("xero"), 5)[0].total).toBe(485 * 36);
  });
});

describe("Sage facts checked against Sage South Africa's own pages", () => {
  it("caps Sage Accounting at five users", () => {
    const sage = get("sage-accounting");
    expect(monthlyForTeam(sage, 5)).toBe(745);
    expect(monthlyForTeam(sage, 6)).toBeNull();
  });

  it("keeps Pastel Xpress out of team costs because Sage gives no user count", () => {
    const pastel = get("sage-pastel-accounting");
    expect(monthlyForTeam(pastel, 3)).toBe(1915);
  });

  it("shows Sage Payroll including VAT, as Sage's pricing page does", () => {
    const payroll = get("sage-payroll");
    expect(payroll.price_vat_inclusive).toBe(true);
    expect(payroll.price_vat_unknown).toBeFalsy();
    expect(payroll.pricing_plans[0].vat_inclusive).toBe(true);
  });
});

describe("feature groups", async () => {
  const { featureRows } = await import("@/lib/features");
  it("never marks Sage Accounting as missing bank feeds, the VAT201 or multiple currencies", () => {
    const rows = featureRows([get("xero"), get("sage-accounting")]);
    const status = (label: string) => rows.find((r) => r.label === label)?.statuses[1];
    expect(status("Bank feeds and reconciliation")).toBe("included");
    expect(status("VAT201 return")).toBe("included");
    expect(status("Multiple currencies")).toBe("addon");
  });
});
