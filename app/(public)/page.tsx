import type { Metadata } from "next";
import { HomeHero } from "@/components/public/home/hero";
import type { HeroBoard } from "@/components/public/home/hero-board";
import { REFERENCE_TEAM, categoryPriceComparison } from "@/lib/pricing";
import { CategoryExplorer } from "@/components/public/home/category-explorer";
import { FreshlyChecked, GuideLibrary, GuidesShowcase, NewsletterPanel, ReviewWall, TopRated } from "@/components/public/home/sections";
import { ComparisonCard } from "@/components/public/comparison-card";
import { MarketInsights } from "@/components/public/home/market-insights";
import { SectionHeader, SectionIntro } from "@/components/public/section-heading";
import { AffiliateDisclosureNote } from "@/components/public/affiliate-link";
import { CtaButton } from "@/components/ui/button";
import { LayoutGrid } from "lucide-react";
import { getCategories } from "@/lib/queries/categories";
import { getArticles, getComparisons } from "@/lib/queries/content";
import { getPublishedReviewTotal, getRecentReviews, getStarDistribution } from "@/lib/queries/reviews";
import { getAllSoftware, toSummary } from "@/lib/queries/software";
import { getGuidesBackground, getHeroImage } from "@/lib/server-assets";
import { hasAffiliateLink } from "@/lib/affiliate";
import { rankSoftware } from "@/lib/ranking";
import { hasPublicRating, MIN_PUBLIC_REVIEWS } from "@/lib/reviews-policy";
import { JsonLd, buildMetadata, organizationSchema, websiteSchema } from "@/lib/seo";
import { SITE_DESCRIPTION, SITE_NAME, SITE_TAGLINE } from "@/lib/site";

export const revalidate = 3600;

export const metadata: Metadata = {
  ...buildMetadata({ title: `${SITE_NAME}: ${SITE_TAGLINE}`, description: SITE_DESCRIPTION, path: "/" }),
  title: { absolute: `${SITE_NAME}: ${SITE_TAGLINE}` },
};

function quarterStart(d = new Date()) {
  return new Date(Date.UTC(d.getUTCFullYear(), Math.floor(d.getUTCMonth() / 3) * 3, 1)).toISOString().slice(0, 10);
}

export default async function HomePage() {
  const [software, categories, comparisons, articles, reviewTotal] = await Promise.all([
    getAllSoftware(),
    getCategories(),
    getComparisons(),
    getArticles(),
    getPublishedReviewTotal(),
  ]);
  const bySlug = new Map(software.map((s) => [s.slug, s]));
  const byId = new Map(software.map((s) => [s.id, s]));

  // 1. Hero: a price board per category, cheapest first, for that category's reference team
  const hero = getHeroImage();
  const boards: HeroBoard[] = categories
    .map((c) => {
      const ref = REFERENCE_TEAM[c.slug];
      const rows = categoryPriceComparison(software, c.slug, ref.seats)
        .slice(0, 4)
        .map((r) => {
          const s = bySlug.get(r.slug)!;
          return { slug: s.slug, name: s.name, logo: s.logo, brandColor: s.brand_color, monthly: r.monthly };
        });
      return { slug: c.slug, name: c.name, icon: c.icon, seats: ref.seats, unit: ref.unit, total: c.product_count, rows };
    })
    .filter((b) => b.rows.length >= 3);
  const checkedOn =
    software
      .filter((s) => s.starting_price !== null && s.price_checked_at)
      .map((s) => s.price_checked_at!)
      .sort()
      .at(-1) ?? null;

  // 2. Explorer groups, up to six products each
  const groups = categories.map((c) => ({
    slug: c.slug,
    name: c.name,
    icon: c.icon,
    count: c.product_count,
    products: software
      .filter((s) => s.category === c.slug)
      .sort(
        (a, b) =>
          Number(b.featured) - Number(a.featured) ||
          b.review_count - a.review_count ||
          Number(a.starting_price === null) - Number(b.starting_price === null) ||
          a.name.localeCompare(b.name),
      )
      .slice(0, 6)
      .map(toSummary),
  }));
  const explorerHasAffiliate = groups.some((g) => g.products.some((p) => hasAffiliateLink(p.slug)));

  // 3. Comparisons
  const compCards = comparisons
    .filter((c) => bySlug.has(c.a) && bySlug.has(c.b))
    .slice(0, 4);

  // 4. Top rated
  const ranked = rankSoftware(software);
  const showTopRated = software.some(hasPublicRating) && ranked.length > 0;
  const distributions: Record<string, number[]> = {};
  if (showTopRated) {
    for (const r of ranked.slice(0, 3)) {
      const d = await getStarDistribution(r.software.id);
      distributions[r.software.slug] = [d[1], d[2], d[3], d[4], d[5]];
    }
  }

  // 6. Review wall
  const showWall = reviewTotal >= MIN_PUBLIC_REVIEWS;
  const recent = showWall ? await getRecentReviews(60) : [];

  // 7. Freshly checked: one per category, most recent first
  const since = quarterStart();
  const fresh: typeof software = [];
  const usedCats = new Set<string>();
  for (const s of [...software]
    .filter((s) => s.price_checked_at && s.price_checked_at >= since && s.starting_price !== null)
    .sort((a, b) => (b.price_checked_at ?? "").localeCompare(a.price_checked_at ?? "") || Number(b.featured) - Number(a.featured))) {
    if (usedCats.has(s.category)) continue;
    usedCats.add(s.category);
    fresh.push(s);
    if (fresh.length === 3) break;
  }

  return (
    <>
      <JsonLd data={[organizationSchema(), websiteSchema()]} />
      <HomeHero hero={hero} boards={boards} checkedOn={checkedOn} categories={categories} />

      <div className="mt-16 space-y-16 md:mt-24 md:space-y-24">
        <section aria-labelledby="explorer" className="container-site reveal">
          <SectionHeader
            as="h2"
            id="explorer"
            icon={<LayoutGrid size={14} />}
            eyebrow="Browse by category"
            title="Start from the work you need done"
            subtitle={`${software.length} products across ${categories.length} categories, each priced in rand and checked against local rules.`}
          />
          <CategoryExplorer groups={groups} />
          <AffiliateDisclosureNote hasAffiliate={explorerHasAffiliate} className="mx-auto mt-6 max-w-xl justify-center text-center" />
        </section>

        <section aria-labelledby="head-to-head" className="container-site reveal">
          <SectionIntro
            id="head-to-head"
            eyebrow="Head to head"
            title="Two products, one page,"
            strong="a clear winner"
            subtitle="Every written comparison names a winner and says who should pick the other one."
            action={<CtaButton href="/compare">Build a comparison</CtaButton>}
          />
          <ul className="grid gap-4 md:grid-cols-2">
            {compCards.map((c) => (
              <li key={c.slug}>
                <ComparisonCard comparison={c} a={bySlug.get(c.a)!} b={bySlug.get(c.b)!} />
              </li>
            ))}
          </ul>
        </section>

        <MarketInsights software={software} categories={categories} />

        {showTopRated && <TopRated ranked={ranked} distributions={distributions} />}

        <NewsletterPanel categories={categories.map((c) => ({ slug: c.slug, name: c.name }))} />

        {showWall && (
          <ReviewWall
            reviews={recent}
            softwareById={byId}
            totals={{ reviews: reviewTotal, products: software.filter((s) => s.review_count > 0).length }}
          />
        )}

        {fresh.length > 0 && <FreshlyChecked products={fresh} />}

        <GuideLibrary articles={articles} />

        <GuidesShowcase articles={articles} background={getGuidesBackground()} />
      </div>
    </>
  );
}
