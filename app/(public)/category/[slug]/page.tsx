import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SectionHeader } from "@/components/public/section-heading";
import { CategoryIcon } from "@/components/public/category-icon";
import { ProductListCard } from "@/components/public/product-card";
import { FaqAccordion } from "@/components/public/faq-accordion";
import { AffiliateDisclosureNote } from "@/components/public/affiliate-link";
import { ComplianceMark } from "@/components/public/compliance-list";
import { getCategories, getCategory } from "@/lib/queries/categories";
import { getSoftwareByCategory, toSummary } from "@/lib/queries/software";
import { rankSoftware } from "@/lib/ranking";
import { hasAffiliateLink } from "@/lib/affiliate";
import { COMPLIANCE_CHECKLIST } from "@/lib/site";
import { JsonLd, breadcrumbSchema, buildMetadata, faqSchema } from "@/lib/seo";

export const revalidate = 3600;

export async function generateStaticParams() {
  const list = await getCategories();
  return list.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const c = await getCategory(slug);
  if (!c) return {};
  return buildMetadata({
    title: `The best ${c.plural_label} in South Africa`,
    description: `${c.product_count} ${c.plural_label} products compared on rand pricing and local compliance. ${c.description}`,
    path: `/category/${c.slug}`,
    eyebrow: c.name,
  });
}

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const category = await getCategory(slug);
  if (!category) notFound();
  const products = await getSoftwareByCategory(category.slug);

  // Ranked within the category; unranked products follow in name order.
  const ranked = rankSoftware(products);
  const rankedIds = new Set(ranked.map((r) => r.software.id));
  const rest = products.filter((p) => !rankedIds.has(p.id)).sort((a, b) => Number(b.featured) - Number(a.featured) || a.name.localeCompare(b.name));
  const focus = COMPLIANCE_CHECKLIST.filter((c) => category.compliance_focus.includes(c.key));

  return (
    <div className="container-site">
      <JsonLd
        data={[
          breadcrumbSchema([
            { name: "Categories", path: "/categories" },
            { name: category.name, path: `/category/${category.slug}` },
          ]),
          faqSchema(category.faqs),
        ]}
      />
      <SectionHeader
        icon={<CategoryIcon name={category.icon} size={14} />}
        eyebrow={`${category.product_count} products`}
        title={`The best ${category.plural_label}`}
        subtitle={category.description}
      />

      <h2 className="sr-only">{category.name} products</h2>
      <ul className="space-y-3">
        {ranked.map((r) => (
          <li key={r.software.slug}>
            <ProductListCard software={toSummary(r.software)} categoryName={category.name} placement="category" rank={r.rank} />
          </li>
        ))}
        {rest.map((s) => (
          <li key={s.slug}>
            <ProductListCard software={toSummary(s)} categoryName={category.name} placement="category" />
          </li>
        ))}
      </ul>
      <AffiliateDisclosureNote hasAffiliate={products.some((p) => hasAffiliateLink(p.slug))} className="mt-6" />

      <section aria-labelledby="buying-guide" className="mt-20 grid gap-10 border-t border-border-strong pt-12 lg:grid-cols-[1fr_380px] lg:gap-16">
        <div>
          <p className="eyebrow text-muted-foreground">Buying guide</p>
          <h2 id="buying-guide" className="mt-4 font-heading text-[30px] font-medium leading-[1.18] tracking-[-0.02em] md:text-[38px]">
            How to choose {category.plural_label}
          </h2>
          <div className="prose-site mt-6 max-w-3xl">
            {category.long_intro.map((p, i) => (
              <p key={i} className={i === 0 ? "lead" : undefined}>
                {p}
              </p>
            ))}
          </div>
        </div>
        <aside className="self-start rounded-[24px] bg-card p-6 ring-1 ring-inset ring-border">
          <p className="font-heading text-[18px] font-bold">Local rules that matter here</p>
          <ul className="mt-4 space-y-3">
            {focus.map((c) => (
              <li key={c.key} className="flex items-start gap-3">
                <ComplianceMark status="covered" />
                <span>
                  <span className="block text-[15px] font-semibold">{c.label}</span>
                  <span className="block text-[13.5px] leading-snug text-muted-foreground">{c.description}</span>
                </span>
              </li>
            ))}
          </ul>
          <p className="mt-4 text-[13px] text-muted-foreground">Each profile marks these as covered, a gap or not yet confirmed.</p>
        </aside>
      </section>

      <section aria-labelledby="category-faqs" className="mt-16">
        <h2 id="category-faqs" className="mb-6 font-heading text-[28px] font-bold tracking-[-0.02em]">
          {category.name} questions
        </h2>
        <FaqAccordion faqs={category.faqs} />
      </section>
    </div>
  );
}
