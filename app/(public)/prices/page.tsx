import type { Metadata } from "next";
import Link from "next/link";
import { ChartLine } from "lucide-react";
import { SectionHeader, SectionIntro } from "@/components/public/section-heading";
import { ChartCard, StatTiles } from "@/components/public/analytics/chart-card";
import { CategoryBarChart, SimpleBarChart, StackedCountChart } from "@/components/public/analytics/charts";
import { PriceCheckedStamp } from "@/components/ui/badge";
import { Table, Td, Th } from "@/components/ui/table";
import { getCategories } from "@/lib/queries/categories";
import { getAllSoftware } from "@/lib/queries/software";
import { categoryPriceComparison, median, monthlyForTeam, REFERENCE_TEAM } from "@/lib/pricing";
import { formatDate, formatRand, formatSoftwarePrice } from "@/lib/format";
import { FX_RATE_DATE, FX_RATES } from "@/lib/site";
import { JsonLd, breadcrumbSchema, buildMetadata } from "@/lib/seo";

export const revalidate = 3600;

export const metadata: Metadata = buildMetadata({
  title: "Rand price index for business software",
  description: "What every product on our register costs a South African team each month, in rand including VAT, with the date we checked each price.",
  path: "/prices",
  eyebrow: "Price index",
});

export default async function PricesPage() {
  const [all, categories] = await Promise.all([getAllSoftware(), getCategories()]);
  const withPrice = all.filter((s) => s.starting_price !== null);
  const checked = all.filter((s) => s.price_checked_at);
  const quoted = all.filter((s) => s.pricing_model === "quote" && s.starting_price === null);
  const freePlans = all.filter((s) => s.free_version);

  const perCategory = categories.map((c) => {
    const ref = REFERENCE_TEAM[c.slug];
    const rows = categoryPriceComparison(all, c.slug, ref.seats);
    const paid = rows.filter((r) => r.monthly > 0).map((r) => r.monthly);
    return { category: c, ref, rows, median: median(paid) };
  });

  const modelRows = categories.map((c) => {
    const items = all.filter((s) => s.category === c.slug);
    return {
      category: c.name,
      // Each product is counted once: a public price we checked, a public price we have not, or quoted.
      // A quoted product stays in the quoted column even after we confirm it still has no public price.
      checked: items.filter((s) => s.price_checked_at && s.starting_price !== null).length,
      unchecked: items.filter((s) => !s.price_checked_at && s.starting_price !== null).length,
      quoted: items.filter((s) => s.starting_price === null).length,
    };
  });

  return (
    <div className="container-site">
      <JsonLd data={breadcrumbSchema([{ name: "Rand price index", path: "/prices" }])} />
      <SectionHeader
        icon={<ChartLine size={14} />}
        eyebrow="Price index"
        title="What business software costs in rand"
        subtitle={`Every product on our register, costed for a typical South African team, per month including VAT. Dollar prices use ${formatRand(FX_RATES.USD)} to the dollar, our rate on ${formatDate(FX_RATE_DATE)}.`}
      />

      <StatTiles
        stats={[
          { label: "Products on the register", value: String(all.length) },
          { label: "With a public price", value: String(withPrice.length), note: `${quoted.length} sold on quotation` },
          { label: "Prices checked by us", value: String(checked.length), note: "on the vendor's own page or price guide" },
          { label: "With a free plan", value: String(freePlans.length) },
        ]}
      />

      <section aria-labelledby="index-overview" className="mt-16 space-y-6">
        <SectionIntro id="index-overview" eyebrow="Overview" title="The register," strong="by price" />
        <div className="grid gap-6 xl:grid-cols-2">
          <ChartCard
            title="Median paid price by category"
            caption="Median monthly cost including VAT of the priced products in each category, for the team size shown in the table. Free plans are left out."
            table={{
              head: ["Category", "Team", "Median per month"],
              rows: perCategory.map((p) => [p.category.name, `${p.ref.seats} ${p.ref.unit}`, p.median === null ? "n/a" : formatRand(p.median, { whole: true })]),
            }}
          >
            <SimpleBarChart
              rows={perCategory.filter((p) => p.median !== null).map((p) => ({ name: p.category.name, median: Math.round(p.median as number) }))}
              dataKey="median"
              labelKey="name"
              name="Median per month"
            />
          </ChartCard>
          <ChartCard
            title="How each category is priced"
            caption="Products with a price we checked ourselves, a public price we have not yet checked, and products sold only on quotation."
            table={{ head: ["Category", "Checked", "Not yet checked", "Quoted"], rows: modelRows.map((r) => [r.category, r.checked, r.unchecked, r.quoted]) }}
          >
            <StackedCountChart
              rows={modelRows}
              keys={[
                { key: "checked", name: "Price checked", fill: "#FED400", stroke: "#131315" },
                { key: "unchecked", name: "Not yet checked", fill: "#8A8A90" },
                { key: "quoted", name: "Quoted", fill: "#131315" },
              ]}
            />
          </ChartCard>
        </div>
      </section>

      {perCategory.map(({ category, ref, rows }) => (
        <section key={category.slug} aria-labelledby={`cat-${category.slug}`} className="mt-16">
          <SectionIntro
            id={`cat-${category.slug}`}
            eyebrow={category.name}
            title={`${category.name} for`}
            strong={`${ref.seats} ${ref.unit}`}
            subtitle="Cheapest plan that covers the team, per month including VAT."
          />
          <div className="grid gap-6 xl:grid-cols-[1.1fr_1fr]">
            {rows.length > 0 ? (
              <ChartCard title={`Monthly cost for ${ref.seats} ${ref.unit}`}>
                <CategoryBarChart rows={rows.map((r) => ({ name: r.name, monthly: Math.round(r.monthly) }))} highlight="" />
              </ChartCard>
            ) : (
              <p className="text-muted-foreground">No public prices in this category yet.</p>
            )}
            <Table>
              <thead>
                <tr>
                  <Th>Product</Th>
                  <Th>For the team</Th>
                  <Th>Starting price</Th>
                  <Th>Checked</Th>
                </tr>
              </thead>
              <tbody>
                {all
                  .filter((s) => s.category === category.slug)
                  .map((s) => ({ s, m: monthlyForTeam(s, ref.seats) }))
                  .sort((a, b) => (a.m ?? Infinity) - (b.m ?? Infinity) || a.s.name.localeCompare(b.s.name))
                  .map(({ s, m }) => (
                    <tr key={s.slug}>
                      <Td className="font-medium">
                        <Link href={`/software/${s.slug}#analytics`} className="hover:underline">
                          {s.name}
                        </Link>
                      </Td>
                      <Td className="font-semibold tabular">{m === null ? (s.pricing_model === "quote" ? "Quoted" : "Not public") : m === 0 ? "Free" : formatRand(m, { whole: true })}</Td>
                      <Td className="text-[13.5px] text-muted-foreground">{formatSoftwarePrice(s)}</Td>
                      <Td>
                        <PriceCheckedStamp date={s.price_checked_at} compact />
                      </Td>
                    </tr>
                  ))}
              </tbody>
            </Table>
          </div>
        </section>
      ))}
    </div>
  );
}
