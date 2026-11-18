import type { Metadata } from "next";
import { Scale } from "lucide-react";
import { SectionHeader } from "@/components/public/section-heading";
import { ComparePicker } from "@/components/public/compare-picker";
import { ComparisonCard } from "@/components/public/comparison-card";
import { getCategories } from "@/lib/queries/categories";
import { getComparisons } from "@/lib/queries/content";
import { getAllSoftware } from "@/lib/queries/software";
import { JsonLd, breadcrumbSchema, buildMetadata } from "@/lib/seo";

export const revalidate = 3600;

export const metadata: Metadata = buildMetadata({
  title: "Compare business software side by side",
  description: "Put any two products side by side: rand pricing, local compliance, features and a written verdict that names a winner.",
  path: "/compare",
  eyebrow: "Compare",
});

export default async function ComparePage() {
  const [software, comparisons, categories] = await Promise.all([getAllSoftware(), getComparisons(), getCategories()]);
  const bySlug = new Map(software.map((s) => [s.slug, s]));
  const catName = new Map(categories.map((c) => [c.slug, c.name]));
  const options = software.map((s) => ({ slug: s.slug, name: s.name, logo: s.logo, category: catName.get(s.category) ?? s.category }));
  const written = comparisons.filter((c) => bySlug.has(c.a) && bySlug.has(c.b));

  return (
    <div className="container-site">
      <JsonLd data={breadcrumbSchema([{ name: "Compare", path: "/compare" }])} />
      <SectionHeader
        icon={<Scale size={14} />}
        eyebrow="Compare"
        title="Two products, one page"
        subtitle="Pick any two products on the register. You get prices with the VAT basis, the local compliance gaps and every feature side by side."
      />
      <div className="mx-auto max-w-4xl">
        <ComparePicker options={options} />
      </div>

      <section aria-labelledby="written" className="mt-16">
        <h2 id="written" className="mb-2 font-heading text-[28px] font-bold tracking-[-0.02em]">
          Written comparisons
        </h2>
        <p className="mb-8 text-[16px] text-muted-foreground">{written.length} head to heads with a verdict that names a winner.</p>
        <ul className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {written.map((c) => (
            <li key={c.slug}>
              <ComparisonCard comparison={c} a={bySlug.get(c.a)!} b={bySlug.get(c.b)!} />
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
