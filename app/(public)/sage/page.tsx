import type { Metadata } from "next";
import { SITE_NAME } from "@/lib/site";
import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import { SectionHeader, SectionIntro } from "@/components/public/section-heading";
import { SoftwareLogo } from "@/components/public/software-logo";
import { PriceTag } from "@/components/public/price";
import { ChartCard, StatTiles } from "@/components/public/analytics/chart-card";
import { BracketChart, SimpleBarChart } from "@/components/public/analytics/charts";
import { MultiLineChart } from "@/components/public/analytics/multi-line";
import { PriceCheckedStamp } from "@/components/ui/badge";
import { Table, Td, Th } from "@/components/ui/table";
import { getCategories } from "@/lib/queries/categories";
import { getAllSoftware } from "@/lib/queries/software";
import { cheapestPlan, monthlyForTeam } from "@/lib/pricing";
import { COMPANY_SIZE_LABEL, formatRand, softwarePriceParts } from "@/lib/format";
import { JsonLd, breadcrumbSchema, buildMetadata } from "@/lib/seo";
import type { CompanySize, Software } from "@/lib/types";

export const revalidate = 3600;

export const metadata: Metadata = buildMetadata({
  title: "Sage in South Africa: every product, priced in rand",
  description:
    "Sage Accounting, Sage 50cloud Pastel, Sage Payroll, Sage HR, Sage 200 Evolution, Sage 300 People, Sage Intacct, Sage X3 and Sage CRM compared, with Sage's 2026 to 2027 prices, add ons and payroll brackets.",
  path: "/sage",
  eyebrow: "Vendor guide",
});

const SAGE = "The Sage Group plc";
const SIZES = Object.keys(COMPANY_SIZE_LABEL) as CompanySize[];

const PATHS = [
  {
    title: "Books",
    steps: ["sage-accounting", "sage-pastel-accounting", "sage-evolution", "sage-x3"],
    note: "Cloud ledger for small teams, desktop Pastel for several companies on one machine, Evolution when stock and branches grow, X3 for groups across countries.",
  },
  {
    title: "Payroll and people",
    steps: ["sage-payroll", "sage-payroll-professional", "sage-300-people"],
    note: "Cloud payroll priced by bracket for small teams, desktop Payroll Professional for detailed payrolls, Sage 300 People for large employers.",
  },
  {
    title: "Finance and customers",
    steps: ["sage-hr", "sage-intacct", "sage-crm"],
    note: "Sage HR for leave and records, Intacct when consolidation and reporting become the problem, Sage CRM when sales need to see ERP data.",
  },
];

export default async function SagePage() {
  const [all, categories] = await Promise.all([getAllSoftware(), getCategories()]);
  const sage = all.filter((s) => s.vendor.company === SAGE);
  const bySlug = new Map(all.map((s) => [s.slug, s]));
  const catName = new Map(categories.map((c) => [c.slug, c.name]));
  const priced = sage.filter((s) => s.starting_price !== null);
  const checked = priced.filter((s) => s.price_checked_at);

  const accounting = bySlug.get("sage-accounting");
  const pastel = bySlug.get("sage-pastel-accounting");
  const payroll = bySlug.get("sage-payroll");
  const xero = bySlug.get("xero");

  // Sage Accounting against Pastel (tiers with a stated user count) and Xero, 1 to 10 users.
  const pastelTiers = pastel ? { pricing_plans: pastel.pricing_plans.filter((p) => p.max_seats !== undefined || p.extra_seat_price !== undefined) } : null;
  const ledgerRows = Array.from({ length: 10 }, (_, i) => i + 1).map((n) => {
    const row: Record<string, number | null> = { seats: n };
    if (accounting) row["Sage Accounting"] = round(monthlyForTeam(accounting, n));
    if (pastelTiers) row["Sage 50cloud Pastel"] = round(cheapestPlan(pastelTiers, n)?.monthly ?? null);
    if (xero) row["Xero, for reference"] = round(monthlyForTeam(xero, n));
    return row;
  });
  const ledgerSeries = ["Sage Accounting", "Sage 50cloud Pastel", "Xero, for reference"].filter((k) => k in ledgerRows[0]);

  // Sage HR by headcount
  const hrRows = [5, 10, 20, 30, 50, 75, 100, 150, 200].map((n) => ({
    seats: n,
    "Core HR and leave": n * 28,
    "Core with performance and shifts": n * 56,
    "Every per employee module": n * 80,
  }));

  const addons = (accounting?.pricing_addons ?? []).filter((a) => a.price !== null);
  const brackets = payroll?.pricing_plans.find((p) => p.brackets)?.brackets ?? [];

  return (
    <div className="container-site">
      <JsonLd data={breadcrumbSchema([{ name: "Sage in South Africa", path: "/sage" }])} />
      <SectionHeader
        icon={<span className="inline-block size-2.5 rounded-full bg-ink" />}
        eyebrow="Vendor guide"
        title="Sage in South Africa, every product priced in rand"
        subtitle="Sage sells more business software in South Africa than any other vendor on our register. Here is every product, what it costs under Sage's 2026 to 2027 prices, and which one fits your size."
      />

      <p className="mx-auto -mt-2 mb-10 max-w-3xl rounded-[16px] bg-card px-5 py-4 text-[14.5px] leading-relaxed text-muted-foreground ring-1 ring-border">
        <strong className="font-semibold text-ink">Independent guide.</strong> {SITE_NAME} is not part of Sage and this page is not
        endorsed by Sage. Sage and its product names are trademarks of The Sage Group plc, used here only to identify the products.
        Prices come from Sage&apos;s own South African pages and are dated where we checked them.
      </p>

      <StatTiles
        stats={[
          { label: "Sage products on our register", value: String(sage.length), note: "across 5 categories" },
          { label: "With a public price", value: String(priced.length), note: `${sage.length - priced.length} sold on quotation` },
          { label: "Prices checked by us", value: String(checked.length), note: "on Sage's own price guides and shop" },
          { label: "Cheapest way in", value: "R97", note: "a month incl VAT, Sage Payroll for 1 to 2 employees" },
        ]}
      />

      <section aria-labelledby="sage-table" className="mt-16">
        <SectionIntro id="sage-table" eyebrow="The range" title="Every Sage product," strong="side by side" />
        <Table stickyFirst>
          <thead>
            <tr>
              <Th>Product</Th>
              <Th>Category</Th>
              <Th>Runs as</Th>
              <Th>Starting price</Th>
              <Th>Price check</Th>
              <Th>Best for</Th>
            </tr>
          </thead>
          <tbody>
            {sage.map((s) => (
              <tr key={s.slug}>
                <Td>
                  <Link href={`/software/${s.slug}`} className="inline-flex items-center gap-2.5 font-semibold hover:underline">
                    <SoftwareLogo name={s.name} logo={s.logo} brandColor={s.brand_color} size="sm" />
                    {s.name}
                  </Link>
                </Td>
                <Td className="text-muted-foreground">{catName.get(s.category)}</Td>
                <Td className="text-muted-foreground">{s.deployment === "cloud" ? "Cloud" : s.deployment === "desktop" ? "Desktop" : "Cloud or on premises"}</Td>
                <Td>
                  <PriceTag parts={softwarePriceParts(s)} />
                </Td>
                <Td>
                  <PriceCheckedStamp date={s.price_checked_at} compact />
                </Td>
                <Td className="text-muted-foreground">{s.best_for_sizes.map((k) => COMPANY_SIZE_LABEL[k]).join(", ")}</Td>
              </tr>
            ))}
          </tbody>
        </Table>
      </section>

      <section aria-labelledby="sage-charts" className="mt-16 space-y-6">
        <SectionIntro
          id="sage-charts"
          eyebrow="Pricing analytics"
          title="What Sage costs,"
          strong="worked out"
          subtitle="Every figure comes from Sage's FY27 price guides and its South African shop, checked on 16 Nov 2026. Monthly figures include VAT where Sage states it."
        />

        {accounting && pastel && (
          <ChartCard
            title="Sage Accounting or Pastel, by number of users"
            caption="Cheapest plan for each team size, per month. Pastel's yearly licences are spread over twelve months, and only the Start, Core and Plus tiers are shown because Sage states their user counts. Sage Accounting allows up to five users, so its line stops there. Xero's cheapest plan is included for reference."
            table={{
              head: ["Users", ...ledgerSeries],
              rows: ledgerRows.map((r) => [r.seats as number, ...ledgerSeries.map((k) => (r[k] === null ? "n/a" : formatRand(r[k] as number)))]),
            }}
          >
            <MultiLineChart rows={ledgerRows} series={ledgerSeries} unit="users" />
          </ChartCard>
        )}

        {brackets.length > 0 && (
          <ChartCard
            title="Sage Payroll, every bracket"
            caption="Monthly price for each employee bracket from 1 September 2026, with the cost per employee when the bracket is full. Above 200 employees Sage charges R22,37 per employee."
            table={{
              head: ["Employees", "Per month", "Per year"],
              rows: brackets.map((b) => [b.to === null ? `${b.from} and more` : `${b.from} to ${b.to}`, b.per_unit ? `${formatRand(b.price)} each` : formatRand(b.price), b.per_unit ? "n/a" : formatRand(b.price * 12)]),
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
          {addons.length > 0 && (
            <ChartCard
              title="Sage Accounting add ons, per month"
              caption="Charged per company, except users and storage. Add only what you need."
              table={{ head: ["Add on", "Price", "Charged"], rows: addons.map((a) => [a.name, formatRand(a.price as number), a.unit]) }}
            >
              <SimpleBarChart rows={addons.map((a) => ({ name: a.name.replace("Additional ", "Extra "), price: a.price as number }))} dataKey="price" labelKey="name" name="Per month" height={320} />
            </ChartCard>
          )}
          <ChartCard
            title="Sage HR by headcount"
            caption="R28 per employee for Core HR and leave, R14 each for performance and shift scheduling, and R80 per employee with every per employee module. Recruitment is a further R1 850 a month flat. Sage does not state the VAT basis."
            table={{
              head: ["Employees", "Core", "Core, performance, shifts", "Every module"],
              rows: hrRows.map((r) => [r.seats, formatRand(r["Core HR and leave"]), formatRand(r["Core with performance and shifts"]), formatRand(r["Every per employee module"])]),
            }}
          >
            <MultiLineChart rows={hrRows} series={["Core HR and leave", "Core with performance and shifts", "Every per employee module"]} unit="employees" />
          </ChartCard>
        </div>
      </section>

      <section aria-labelledby="sage-sizes" className="mt-16">
        <SectionIntro id="sage-sizes" eyebrow="Fit" title="Which Sage product" strong="fits your size" />
        <div className="overflow-x-auto rounded-[24px] border border-border bg-card">
          <table className="w-full min-w-[720px] border-collapse text-[14px]">
            <thead>
              <tr>
                <th className="sticky left-0 z-[1] bg-bone px-4 py-3 text-left font-semibold">Product</th>
                {SIZES.map((k) => (
                  <th key={k} className="bg-bone px-3 py-3 text-center font-semibold">
                    {COMPANY_SIZE_LABEL[k]}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {sage.map((s) => (
                <tr key={s.slug} className="border-t border-border">
                  <td className="sticky left-0 z-[1] bg-card px-4 py-3 font-medium">{s.name}</td>
                  {SIZES.map((k) => (
                    <td key={k} className="px-3 py-3 text-center">
                      {s.best_for_sizes.includes(k) ? (
                        <span className="inline-flex size-6 items-center justify-center rounded-full bg-yellow text-ink" aria-label="Good fit">
                          <Check size={13} strokeWidth={3} aria-hidden="true" />
                        </span>
                      ) : (
                        <span className="text-muted-foreground" aria-label="Not a typical fit">
                          ·
                        </span>
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section aria-labelledby="sage-paths" className="mt-16">
        <SectionIntro id="sage-paths" eyebrow="Upgrade paths" title="How businesses" strong="move up the Sage range" />
        <ul className="grid gap-4 lg:grid-cols-3">
          {PATHS.map((p) => (
            <li key={p.title} className="card-modern p-6">
              <p className="font-heading text-[20px] font-bold">{p.title}</p>
              <ol className="mt-4 space-y-2">
                {p.steps
                  .map((slug) => bySlug.get(slug))
                  .filter((s): s is Software => Boolean(s))
                  .map((s, i, arr) => (
                    <li key={s.slug}>
                      <Link href={`/software/${s.slug}`} className="flex items-center gap-3 rounded-[14px] px-2 py-1.5 hover:bg-bone">
                        <span className="inline-flex size-7 items-center justify-center rounded-full bg-ink font-heading text-[13px] font-bold text-white">{i + 1}</span>
                        <span className="flex-1 font-medium">{s.name}</span>
                        {i < arr.length - 1 && <ArrowRight size={15} className="text-muted-foreground" aria-hidden="true" />}
                      </Link>
                    </li>
                  ))}
              </ol>
              <p className="mt-4 text-[14.5px] leading-relaxed text-muted-foreground">{p.note}</p>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

function round(v: number | null) {
  return v === null ? null : Math.round(v);
}
