import { ChartCard, StatTiles } from "@/components/public/analytics/chart-card";
import { BracketChart, CategoryBarChart, CostCurveChart, CoverageDonut, ThreeYearChart } from "@/components/public/analytics/charts";
import { formatDate, formatRand, softwarePriceParts } from "@/lib/format";
import {
  categoryPriceComparison,
  complianceCoverage,
  costCurve,
  median,
  monthlyForTeam,
  pricedPlans,
  REFERENCE_TEAM,
  isLocallyComparable,
  threeYearCost,
  yearsTrading,
} from "@/lib/pricing";
import type { CategoryWithCount } from "@/lib/queries/categories";
import type { Software } from "@/lib/types";

const HEADCOUNT_SIZES = [1, 2, 5, 10, 15, 20, 30, 40, 50, 75, 100, 150, 200];

export function ProfileAnalytics({ software: s, category, all }: { software: Software; category: CategoryWithCount; all: Software[] }) {
  const ref = REFERENCE_TEAM[s.category];
  const plans = pricedPlans(s);
  const perHeadcount = s.category === "payroll" || s.category === "hr";
  const curve = plans.length ? costCurve(s, perHeadcount ? HEADCOUNT_SIZES : undefined) : null;
  const teamCost = monthlyForTeam(s, ref.seats);
  const compare = categoryPriceComparison(all, s.category, ref.seats);
  const peersMedian = median(compare.filter((c) => c.slug !== s.slug).map((c) => c.monthly));
  const threeYear = threeYearCost(s, ref.seats);
  const cov = complianceCoverage(s, category.compliance_focus);
  const peers = all.filter((x) => x.category === s.category);
  const avgCovered = peers.reduce((n, x) => n + complianceCoverage(x, category.compliance_focus).covered, 0) / Math.max(1, peers.length);
  const years = yearsTrading(s.vendor.founded);
  const price = softwarePriceParts(s);
  const brackets = plans.find((p) => p.brackets?.length)?.brackets;

  const stats = [
    {
      label: "Starting price",
      value: price.kind === "price" ? `${price.amount}${price.period.startsWith("/") ? price.period : ` ${price.period}`}` : price.amount,
      note: price.kind === "price" ? price.basis : undefined,
    },
    {
      label: `Cost for ${ref.seats} ${ref.unit}`,
      value: teamCost === null ? (s.pricing_model === "quote" ? "Quoted" : "Not public") : formatRand(teamCost, { whole: true }),
      note: teamCost === null ? undefined : "a month incl VAT, cheapest plan",
    },
    {
      label: "Local checklist",
      value: `${cov.covered} of ${cov.total}`,
      note: cov.gap ? `${cov.gap} ${cov.gap === 1 ? "gap" : "gaps"} named on this page` : cov.unconfirmed ? `${cov.unconfirmed} not yet confirmed` : "Everything covered",
    },
    {
      label: "Against the category",
      value: !isLocallyComparable(s)
        ? "n/a"
        : teamCost !== null && peersMedian !== null
          ? teamCost <= peersMedian
            ? `${Math.round((1 - teamCost / peersMedian) * 100)}% below`
            : `${Math.round((teamCost / peersMedian - 1) * 100)}% above`
          : "n/a",
      note: !isLocallyComparable(s)
        ? "priced per worker abroad"
        : peersMedian !== null
          ? `median of ${formatRand(peersMedian, { whole: true })} for priced peers`
          : "too few priced peers",
    },
    { label: "Plans with a public price", value: String(plans.length), note: s.pricing_addons?.length ? `plus ${s.pricing_addons.length} priced add ons` : undefined },
    { label: "Features listed", value: String(s.features.length), note: `${s.integrations.length} integrations` },
    { label: "Years trading", value: years === null ? "n/a" : String(years), note: s.vendor.founded ? `founded ${s.vendor.founded}` : undefined },
    { label: "Price checked", value: s.price_checked_at ? formatDate(s.price_checked_at) : "Not yet", note: s.free_trial ? `${s.free_trial_days ? `${s.free_trial_days} day` : "Free"} trial` : "No free trial" },
  ];

  return (
    <div className="space-y-6">
      <StatTiles stats={stats} />

      {curve && curve.plans.length > 0 && (
        <ChartCard
          title={`What ${s.name} costs as you grow`}
          caption={`Monthly cost in rand including VAT for each plan, from 1 to ${perHeadcount ? 200 : 100} ${ref.unit}. Flat fees stay level, per person plans climb, and brackets step up. Dollar prices use our stated exchange rate.`}
          table={{
            head: [ref.unit, ...curve.plans],
            rows: curve.rows.map((r) => [r.seats, ...curve.plans.map((p) => (r[p] === null ? "n/a" : formatRand(r[p] as number, { whole: true })))]),
          }}
        >
          <CostCurveChart rows={curve.rows} plans={curve.plans} unit={ref.unit} />
        </ChartCard>
      )}

      {brackets && (
        <ChartCard
          title="Every employee bracket, and the cost per employee"
          caption="Bars show the monthly price for each bracket. The line shows what each employee costs when the bracket is full: it drops inside each bracket and falls steadily as headcount grows."
          table={{
            head: ["Employees", "Per month", "Per year", "Per employee at the top"],
            rows: brackets.map((b) => [
              b.to === null ? `${b.from} and more` : `${b.from} to ${b.to}`,
              b.per_unit ? `${formatRand(b.price)} each` : formatRand(b.price),
              b.per_unit ? "n/a" : formatRand(b.price * 12),
              b.per_unit ? formatRand(b.price) : formatRand(b.price / (b.to ?? 1)),
            ]),
          }}
        >
          <BracketChart
            rows={brackets
              .filter((b) => !b.per_unit && b.to !== null)
              .map((b) => ({ label: `${b.from} to ${b.to}`, monthly: b.price, perHead: Math.round((b.price / (b.to as number)) * 100) / 100 }))}
          />
        </ChartCard>
      )}

      <div className="grid gap-6 xl:grid-cols-2">
        {compare.length >= 2 && (
          <ChartCard
            title={`${category.name} prices for ${ref.seats} ${ref.unit}`}
            caption={
              !isLocallyComparable(s)
                ? `${s.name} prices per worker abroad, so it is left out of this comparison with tools priced for a local team.`
                : teamCost === null
                ? `${s.name} has no public price for this team, so it is not on the chart. These are the priced products in ${category.name.toLowerCase()}, per month including VAT.`
                : `Cheapest plan that covers ${ref.seats} ${ref.unit}, per month including VAT. ${s.name} is the yellow bar.`
            }
            table={{ head: ["Product", "Per month incl VAT", "Price checked"], rows: compare.map((c) => [c.name, formatRand(c.monthly, { whole: true }), c.checked ? "Yes" : "Not yet"]) }}
          >
            <CategoryBarChart rows={compare.map((c) => ({ name: c.name, monthly: Math.round(c.monthly) }))} highlight={s.name} />
          </ChartCard>
        )}

        <ChartCard
          title="Local checklist coverage"
          caption={`${cov.covered} of ${cov.total} rules covered for ${category.name.toLowerCase()}. The average ${category.name.toLowerCase()} product on our register covers ${avgCovered.toFixed(1)}.`}
          table={{ head: ["Status", "Rules"], rows: [["Covered", cov.covered], ["Gap", cov.gap], ["Not confirmed", cov.unconfirmed]] }}
        >
          <CoverageDonut covered={cov.covered} gap={cov.gap} unconfirmed={cov.unconfirmed} />
        </ChartCard>

        {threeYear.length > 0 && (
          <ChartCard
            title={`One and three years for ${ref.seats} ${ref.unit}`}
            caption="Total cost including VAT at today's list prices. Price rises, discounts and implementation are not included."
            table={{ head: ["Plan", "First year", "Three years"], rows: threeYear.map((r) => [r.plan, formatRand(r.year1), formatRand(r.total)]) }}
            className={compare.length >= 2 ? "xl:col-span-2" : undefined}
          >
            <ThreeYearChart rows={threeYear} />
          </ChartCard>
        )}
      </div>

      {plans.length === 0 && (
        <div className="rounded-[24px] bg-card p-6 ring-1 ring-inset ring-border">
          <p className="font-heading text-[18px] font-bold">Why there is no cost chart</p>
          <p className="mt-2 max-w-2xl text-[15px] leading-relaxed text-muted-foreground">
            {s.name} is sold on quotation, so there is no public price to chart. The cost depends on users, modules and the
            implementation work. Ask every partner to separate licences, annual support, implementation, data migration, training
            and hosting, then compare quotes line by line.
          </p>
        </div>
      )}
    </div>
  );
}
