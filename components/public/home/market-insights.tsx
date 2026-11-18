import { ChartCard, StatTiles } from "@/components/public/analytics/chart-card";
import { ShareBarChart, SimpleBarChart, StackedCountChart } from "@/components/public/analytics/charts";
import { MultiLineChart } from "@/components/public/analytics/multi-line";
import { SectionIntro } from "@/components/public/section-heading";
import { CtaButton } from "@/components/ui/button";
import { formatDate, formatRand } from "@/lib/format";
import { REFERENCE_TEAM, categoryPriceComparison, median, monthlyForTeam } from "@/lib/pricing";
import { FX_RATE_DATE, FX_RATES } from "@/lib/site";
import type { Category, ComplianceKey, Software } from "@/lib/types";

const HIRING_STEPS = [1, 2, 3, 5, 8, 10, 15, 20, 25, 30, 40, 50];

/** Share of products confirmed as covered for one or more checklist keys. */
function coverage(all: Software[], keys: ComplianceKey[]) {
  const relevant = all.filter((s) => keys.some((k) => s.compliance[k]));
  const covered = relevant.filter((s) => keys.every((k) => !s.compliance[k] || s.compliance[k]?.status === "covered"));
  return { covered: covered.length, total: relevant.length };
}

/**
 * The register read as a market: what software costs, who bills in dollars, how payroll prices
 * grow with headcount and how much of the local rulebook vendors confirm. Every figure is worked
 * out from the same records and cost engine as the product pages.
 */
export function MarketInsights({ software, categories }: { software: Software[]; categories: Category[] }) {
  const priced = software.filter((s) => s.starting_price !== null);
  const inDollars = priced.filter((s) => s.currency === "USD");
  const checked = software.filter((s) => s.price_checked_at);

  const accountingTeam = REFERENCE_TEAM.accounting.seats;
  const cheapestAccounting = categoryPriceComparison(software, "accounting", accountingTeam).find((r) => r.monthly > 0);
  const cheapestName = software.find((s) => s.slug === cheapestAccounting?.slug)?.name;

  const ledgers = software.filter((s) => s.compliance.sars_efiling);
  const directEfiling = ledgers.filter((s) => s.compliance.sars_efiling?.status === "covered");

  // Payroll as the business hires: the two payrolls with a full public price list.
  const payrollSeries = software.filter((s) => s.category === "payroll" && s.pricing_model === "published" && s.billing_period === "month");
  const payrollRows = HIRING_STEPS.map((n) => {
    const row: Record<string, number | null> = { seats: n };
    for (const s of payrollSeries) {
      const m = monthlyForTeam(s, n);
      row[s.name] = m === null ? null : Math.round(m);
    }
    return row;
  });
  const at25 = payrollSeries.map((s) => ({ name: s.name, monthly: monthlyForTeam(s, 25) })).filter((r) => r.monthly !== null) as { name: string; monthly: number }[];
  at25.sort((a, b) => a.monthly - b.monthly);

  // Billing currency by category.
  const currencyRows = categories.map((c) => {
    const items = software.filter((s) => s.category === c.slug);
    return {
      category: c.name,
      rand: items.filter((s) => s.starting_price !== null && s.currency === "ZAR").length,
      dollars: items.filter((s) => s.starting_price !== null && s.currency !== "ZAR").length,
      quoted: items.filter((s) => s.starting_price === null).length,
    };
  });

  // Local rules confirmed by vendors.
  const ruleRows = [
    { label: "POPIA terms published", ...coverage(software, ["popia"]) },
    { label: "EMP201, EMP501, IRP5", ...coverage(software, ["emp201", "emp501", "irp5"]) },
    { label: "UIF, SDL and ETI", ...coverage(software, ["uif", "sdl", "eti"]) },
    { label: "VAT201 from the ledger", ...coverage(software, ["vat201"]) },
    { label: "BCEA leave rules", ...coverage(software, ["bcea"]) },
    { label: "Direct SARS eFiling", ...coverage(software, ["sars_efiling"]) },
  ];

  // Median monthly price per category for its reference team.
  const medianRows = categories
    .map((c) => {
      const ref = REFERENCE_TEAM[c.slug];
      const paid = categoryPriceComparison(software, c.slug, ref.seats)
        .filter((r) => r.monthly > 0)
        .map((r) => r.monthly);
      const m = median(paid);
      return { name: c.name, team: `${ref.seats} ${ref.unit}`, median: m === null ? null : Math.round(m) };
    })
    .filter((r): r is { name: string; team: string; median: number } => r.median !== null);

  return (
    <section aria-labelledby="market" className="container-site reveal">
      <SectionIntro
        id="market"
        eyebrow="Market insights"
        title="South African business software,"
        strong="in numbers"
        subtitle={`Worked out from every product on our register, in rand including VAT. Dollar prices use ${formatRand(FX_RATES.USD)} to the dollar, our rate on ${formatDate(FX_RATE_DATE)}.`}
        action={<CtaButton href="/prices">Open the price index</CtaButton>}
      />

      <StatTiles
        stats={[
          {
            label: `Cheapest accounting for ${accountingTeam} users`,
            value: cheapestAccounting ? formatRand(cheapestAccounting.monthly, { whole: true }) : "n/a",
            note: cheapestName ? `a month incl VAT, ${cheapestName}` : undefined,
          },
          {
            label: "Billed in US dollars",
            value: `${inDollars.length} of ${priced.length}`,
            note: "priced products, so the rand sets your bill",
          },
          {
            label: "Direct SARS eFiling",
            value: `${directEfiling.length} of ${ledgers.length}`,
            note: "ledgers confirmed to submit returns for you",
          },
          {
            label: "Checked by a person",
            value: `${checked.length} of ${software.length}`,
            note: "against the vendor's own page or price guide",
          },
        ]}
      />

      <div className="mt-6 grid gap-6 xl:grid-cols-2">
        <ChartCard
          title="Payroll cost as you hire"
          caption={
            at25.length >= 2
              ? `Monthly cost including VAT from 1 to 50 employees. At 25 employees ${at25[0].name} costs ${formatRand(at25[0].monthly, { whole: true })} and ${at25[at25.length - 1].name} ${formatRand(at25[at25.length - 1].monthly, { whole: true })}. Bracket pricing steps up; per employee pricing climbs gently.`
              : "Monthly cost including VAT as headcount grows."
          }
          table={{
            head: ["Employees", ...payrollSeries.map((s) => s.name)],
            rows: payrollRows.map((r) => [r.seats as number, ...payrollSeries.map((s) => (r[s.name] === null ? "n/a" : formatRand(r[s.name] as number, { whole: true })))]),
          }}
        >
          <MultiLineChart rows={payrollRows} series={payrollSeries.map((s) => s.name)} unit="employees" />
        </ChartCard>

        <ChartCard
          title="Who carries the exchange rate"
          caption="Products priced in rand, priced in US dollars, or sold only on quotation. A dollar price moves every month with the rand."
          table={{ head: ["Category", "Rand", "US dollars", "Quoted"], rows: currencyRows.map((r) => [r.category, r.rand, r.dollars, r.quoted]) }}
        >
          <StackedCountChart
            rows={currencyRows}
            keys={[
              { key: "rand", name: "Priced in rand", fill: "#FED400", stroke: "#131315" },
              { key: "dollars", name: "Priced in dollars", fill: "#8A8A90" },
              { key: "quoted", name: "Quoted", fill: "#131315" },
            ]}
          />
        </ChartCard>

        <ChartCard
          title="Local rules vendors confirm"
          caption="Share of products, where the rule applies, that we could confirm cover it. Not confirmed is not the same as missing: it means the vendor has not shown it."
          table={{ head: ["Rule", "Confirmed", "Products checked", "Share"], rows: ruleRows.map((r) => [r.label, r.covered, r.total, r.total ? `${Math.round((r.covered / r.total) * 100)}%` : "n/a"]) }}
        >
          <ShareBarChart rows={ruleRows} />
        </ChartCard>

        <ChartCard
          title="Typical monthly cost by category"
          caption="Median price a month including VAT of the priced products in each category, for the team size in the table. Free plans are left out."
          table={{ head: ["Category", "Team", "Median per month"], rows: medianRows.map((r) => [r.name, r.team, formatRand(r.median, { whole: true })]) }}
        >
          <SimpleBarChart rows={medianRows} dataKey="median" labelKey="name" name="Median per month" />
        </ChartCard>
      </div>
    </section>
  );
}
