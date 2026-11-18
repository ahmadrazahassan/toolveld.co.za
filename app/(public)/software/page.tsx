import type { Metadata } from "next";
import { Suspense } from "react";
import { LayoutList, SearchX } from "lucide-react";
import { SectionHeader } from "@/components/public/section-heading";
import { DirectorySidebar, DirectoryToolbar, type FilterOptions } from "@/components/public/directory-filters";
import { ProductListCard } from "@/components/public/product-card";
import { AffiliateDisclosureNote } from "@/components/public/affiliate-link";
import { CtaButton } from "@/components/ui/button";
import { getCategories } from "@/lib/queries/categories";
import { getAllSoftware, toSummary } from "@/lib/queries/software";
import { availableSorts, sortSoftware, type SortKey } from "@/lib/sorting";
import { publicRating } from "@/lib/reviews-policy";
import { hasAffiliateLink } from "@/lib/affiliate";
import { COMPANY_SIZE_LABEL } from "@/lib/format";
import { JsonLd, breadcrumbSchema, buildMetadata } from "@/lib/seo";
import type { CompanySize } from "@/lib/types";

export const metadata: Metadata = buildMetadata({
  title: "All business software, priced in rand",
  description: "Every product on our register with rand pricing, VAT basis, free trials and local compliance checks. Filter by category, price and company size.",
  path: "/software",
  eyebrow: "Directory",
});

type Search = Promise<Record<string, string | string[] | undefined>>;

function one(v: string | string[] | undefined) {
  return Array.isArray(v) ? v[0] : v;
}

export default async function SoftwareDirectory({ searchParams }: { searchParams: Search }) {
  const sp = await searchParams;
  const [software, categories] = await Promise.all([getAllSoftware(), getCategories()]);
  const catName = new Map(categories.map((c) => [c.slug, c.name]));

  const category = one(sp.category) ?? "";
  const rating = Number(one(sp.rating) ?? 0);
  const pricing = one(sp.pricing) ?? "";
  const size = (one(sp.size) ?? "") as CompanySize | "";
  const sorts = availableSorts(software);
  const requestedSort = (one(sp.sort) ?? "") as SortKey;
  const sort: SortKey = sorts.some((s) => s.value === requestedSort) ? requestedSort : "name";

  const filtered = software.filter((s) => {
    if (category && s.category !== category) return false;
    if (rating && (publicRating(s) ?? 0) < rating) return false;
    if (pricing === "free" && !s.free_version) return false;
    if (pricing === "trial" && !s.free_trial) return false;
    if (pricing === "paid" && s.free_version) return false;
    if (size && !s.best_for_sizes.includes(size)) return false;
    return true;
  });
  const results = sortSoftware(filtered, sort);

  const options: FilterOptions = {
    categories: categories.map((c) => ({ slug: c.slug, name: c.name, count: c.product_count })),
    sizes: Object.entries(COMPANY_SIZE_LABEL).map(([value, label]) => ({ value, label })),
    sorts: sorts.map((s) => ({ value: s.value, label: s.label })),
  };

  return (
    <div className="container-site">
      <JsonLd data={breadcrumbSchema([{ name: "Software", path: "/software" }])} />
      <SectionHeader
        icon={<LayoutList size={14} />}
        eyebrow={`${software.length} products`}
        title="All business software"
        subtitle="Every product on our register, priced in rand with the VAT basis shown and checked against South African rules."
      />
      <div className="grid gap-10 lg:grid-cols-[240px_minmax(0,1fr)]">
        <Suspense>
          <DirectorySidebar options={options} />
        </Suspense>
        <div className="min-w-0">
          <Suspense>
            <DirectoryToolbar options={options} count={results.length} />
          </Suspense>
          <h2 className="sr-only">Results</h2>
          {results.length ? (
            <ul className="space-y-3">
              {results.map((s) => (
                <li key={s.slug}>
                  <ProductListCard software={toSummary(s)} categoryName={catName.get(s.category) ?? s.category} placement="directory" />
                </li>
              ))}
            </ul>
          ) : (
            <div className="flex flex-col items-center rounded-[24px] border border-dashed border-border-strong bg-card px-6 py-16 text-center">
              <SearchX size={28} aria-hidden="true" />
              <p className="mt-4 font-heading text-[22px] font-bold">Nothing matches those filters</p>
              <p className="mt-2 max-w-md text-[15px] text-muted-foreground">
                {rating ? "Ratings appear only once a product has enough published reviews, so the rating filter is strict for now. " : ""}
                Try removing a filter or two.
              </p>
              <div className="mt-6">
                <CtaButton href="/software" variant="soft">
                  Reset filters
                </CtaButton>
              </div>
            </div>
          )}
          <AffiliateDisclosureNote hasAffiliate={results.some((s) => hasAffiliateLink(s.slug))} className="mt-6" />
        </div>
      </div>
    </div>
  );
}
