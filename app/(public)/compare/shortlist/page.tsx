import type { Metadata } from "next";
import { ListChecks } from "lucide-react";
import { SectionHeader } from "@/components/public/section-heading";
import { ComplianceMatrix, FeatureMatrix, PricingMatrix, RatingsMatrix } from "@/components/public/compare-matrix";
import { AffiliateDisclosureNote, VisitButton } from "@/components/public/affiliate-link";
import { CtaButton } from "@/components/ui/button";
import { getCategories } from "@/lib/queries/categories";
import { getAllSoftware } from "@/lib/queries/software";
import { hasAffiliateLink } from "@/lib/affiliate";
import { hasPublicRating } from "@/lib/reviews-policy";
import { buildMetadata } from "@/lib/seo";
import { unique } from "@/lib/utils";

export const metadata: Metadata = buildMetadata({
  title: "Your shortlist compared",
  path: "/compare/shortlist",
  noindex: true,
});

export default async function ShortlistPage({ searchParams }: { searchParams: Promise<{ ids?: string }> }) {
  const { ids = "" } = await searchParams;
  const [software, categories] = await Promise.all([getAllSoftware(), getCategories()]);
  const map = new Map(software.map((s) => [s.slug, s]));
  const products = unique(ids.split(",").map((x) => x.trim()))
    .map((slug) => map.get(slug))
    .filter((s): s is NonNullable<typeof s> => Boolean(s))
    .slice(0, 4);

  if (products.length < 2) {
    return (
      <div className="container-site">
        <SectionHeader
          icon={<ListChecks size={14} />}
          eyebrow="Shortlist"
          title="Add at least two products"
          subtitle="Use the Shortlist button on any product card or profile. Up to four products can be compared at once."
        >
          <div className="mt-8 flex justify-center">
            <CtaButton href="/software">Browse software</CtaButton>
          </div>
        </SectionHeader>
      </div>
    );
  }

  const focus = unique(categories.filter((c) => products.some((p) => p.category === c.slug)).flatMap((c) => c.compliance_focus));

  return (
    <div className="container-site">
      <SectionHeader
        icon={<ListChecks size={14} />}
        eyebrow={`${products.length} products`}
        title="Your shortlist, side by side"
        subtitle="Prices with the VAT basis, local compliance and every feature we list. Your shortlist lives in this browser only."
      />
      <div className="space-y-12">
        {products.some(hasPublicRating) && (
          <section aria-labelledby="sl-ratings">
            <h2 id="sl-ratings" className="mb-5 font-heading text-[24px] font-bold">Ratings</h2>
            <RatingsMatrix products={products} />
          </section>
        )}
        <section aria-labelledby="sl-pricing">
          <h2 id="sl-pricing" className="mb-5 font-heading text-[24px] font-bold">Pricing</h2>
          <PricingMatrix products={products} />
        </section>
        <section aria-labelledby="sl-local">
          <h2 id="sl-local" className="mb-5 font-heading text-[24px] font-bold">Local compliance</h2>
          <ComplianceMatrix products={products} focus={focus} />
        </section>
        <section aria-labelledby="sl-features">
          <h2 id="sl-features" className="mb-5 font-heading text-[24px] font-bold">Features</h2>
          <FeatureMatrix products={products} />
        </section>
        <section aria-labelledby="sl-next" className="card-modern p-6">
          <h2 id="sl-next" className="font-heading text-[20px] font-bold">Next steps</h2>
          <ul className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {products.map((p) => (
              <li key={p.slug} className="flex flex-col gap-2 rounded-[18px] bg-bone p-4">
                <p className="font-heading font-bold">{p.name}</p>
                <div className="flex flex-wrap gap-2">
                  <CtaButton href={`/software/${p.slug}`} size="xs">
                    Read review
                  </CtaButton>
                  <VisitButton software={p} placement="compare-shortlist" size="xs" />
                </div>
              </li>
            ))}
          </ul>
          <AffiliateDisclosureNote hasAffiliate={products.some((p) => hasAffiliateLink(p.slug))} className="mt-4" />
        </section>
      </div>
    </div>
  );
}
