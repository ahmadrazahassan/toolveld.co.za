import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MessageSquarePlus } from "lucide-react";
import { SoftwareLogo } from "@/components/public/software-logo";
import { RatingOrEmpty } from "@/components/public/rating";
import { VisitButton, AffiliateDisclosureNote } from "@/components/public/affiliate-link";
import { ShortlistToggle } from "@/components/public/shortlist";
import { ComplianceList, ComplianceMark } from "@/components/public/compliance-list";
import { FaqAccordion } from "@/components/public/faq-accordion";
import { ProductCard } from "@/components/public/product-card";
import { ReviewCard } from "@/components/public/review-card";
import { SectionNav } from "@/components/public/profile/section-nav";
import { CostCalculator } from "@/components/public/profile/cost-calculator";
import { DimensionChart, SizeChart } from "@/components/public/profile/charts";
import { ScreenshotCarousel } from "@/components/public/profile/screenshots";
import { EditorialReview } from "@/components/public/profile/editorial-review";
import { ProfileAnalytics } from "@/components/public/profile/analytics";
import { AddonsTable, BracketTable, PriceSources } from "@/components/public/profile/pricing-detail";
import {
  Integrations,
  PlanCards,
  PriceHistory,
  PriceStampRow,
  PricingTable,
  ProfileSection,
  SpecSheet,
} from "@/components/public/profile/blocks";
import { CtaButton } from "@/components/ui/button";
import { FeaturedBadge } from "@/components/ui/badge";
import { RatingDial, Stars } from "@/components/ui/misc";
import { getCategory } from "@/lib/queries/categories";
import { pairSlug } from "@/lib/queries/content";
import { getCompanySizeCounts, getReviews, getStarDistribution } from "@/lib/queries/reviews";
import { getAlternatives, getAllSoftware, getSoftwareBySlug, toSummary } from "@/lib/queries/software";
import { buildSoftwareFaqs } from "@/lib/faq";
import { hasAffiliateLink } from "@/lib/affiliate";
import { COMPANY_SIZE_LABEL, formatSoftwarePrice } from "@/lib/format";
import { hasPublicRating, RATING_DIMENSIONS } from "@/lib/reviews-policy";
import { COMPLIANCE_CHECKLIST } from "@/lib/site";
import { JsonLd, breadcrumbSchema, buildMetadata, faqSchema, softwareSchema } from "@/lib/seo";

export const revalidate = 3600;

export async function generateStaticParams() {
  const all = await getAllSoftware();
  return all.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const s = await getSoftwareBySlug(slug);
  if (!s) return {};
  return buildMetadata({
    title: `${s.name} review and rand pricing`,
    description: `${s.short_description} ${s.name} starts at ${formatSoftwarePrice(s)}.`,
    path: `/software/${s.slug}`,
    eyebrow: "Software profile",
  });
}

export default async function SoftwareProfilePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const s = await getSoftwareBySlug(slug);
  if (!s) notFound();
  const category = await getCategory(s.category);
  if (!category) notFound();

  const rated = hasPublicRating(s);
  const [all, alternatives, { reviews }, dist, sizes] = await Promise.all([
    getAllSoftware(),
    getAlternatives(s, 3),
    getReviews({ softwareId: s.id, sort: "recent", perPage: 3 }),
    rated ? getStarDistribution(s.id) : Promise.resolve(null),
    rated ? getCompanySizeCounts(s.id) : Promise.resolve(null),
  ]);
  const faqs = buildSoftwareFaqs(s, category);
  const rival = alternatives[0];
  const affiliate = hasAffiliateLink(s.slug);
  const showBankFeeds = category.compliance_focus.includes("vat201");

  const sections = [
    { id: "overview", label: "Overview" },
    ...(s.review ? [{ id: "review", label: "Our review" }] : []),
    { id: "pricing", label: "Pricing" },
    { id: "analytics", label: "Cost analytics" },
    { id: "features", label: "Features" },
    ...(s.screenshots.length ? [{ id: "screenshots", label: "Screenshots" }] : []),
    ...(rated ? [{ id: "ratings", label: "Ratings" }] : []),
    ...(rival ? [{ id: "compare", label: "Compare" }] : []),
    { id: "reviews", label: "Reader reviews" },
    ...(alternatives.length ? [{ id: "alternatives", label: "Alternatives" }] : []),
    { id: "faqs", label: "FAQs" },
  ];

  const focusLabels = COMPLIANCE_CHECKLIST.filter((c) => category.compliance_focus.includes(c.key));

  return (
    <div className="container-site">
      <JsonLd
        data={[
          softwareSchema(s, category.name),
          breadcrumbSchema([
            { name: "Software", path: "/software" },
            { name: category.name, path: `/category/${category.slug}` },
            { name: s.name, path: `/software/${s.slug}` },
          ]),
          faqSchema(faqs),
        ]}
      />

      <nav aria-label="Breadcrumb" className="mb-6 text-[13.5px] text-muted-foreground">
        <ol className="flex flex-wrap items-center gap-1.5">
          <li>
            <Link href="/software" className="hover:text-ink">Software</Link>
          </li>
          <li aria-hidden="true">/</li>
          <li>
            <Link href={`/category/${category.slug}`} className="hover:text-ink">{category.name}</Link>
          </li>
          <li aria-hidden="true">/</li>
          <li aria-current="page" className="text-ink">{s.name}</li>
        </ol>
      </nav>

      {/* Header */}
      <header className="card-modern p-6 md:p-10">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-start">
            <SoftwareLogo name={s.name} logo={s.logo} brandColor={s.brand_color} size="xl" decorative={false} />
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <Link
                  href={`/category/${category.slug}`}
                  className="rounded-full bg-bone px-3 py-1 text-[12.5px] font-medium text-ink hover:bg-border"
                >
                  {category.name}
                </Link>
                {s.featured && <FeaturedBadge />}
              </div>
              <h1 className="mt-3 font-heading text-[36px] font-bold leading-[1.12] tracking-[-0.025em] md:text-[48px]">{s.name}</h1>
              <p className="mt-2 max-w-2xl text-[17px] leading-relaxed text-muted-foreground md:text-[18px]">{s.tagline}</p>
              <div className="mt-4 flex flex-wrap items-center gap-3">
                <RatingOrEmpty software={s} size={16} />
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-3 lg:items-end">
            <div className="flex flex-wrap items-center gap-2">
              <CtaButton href={`/software/${s.slug}/reviews/new`} size="lg">
                Write a review
              </CtaButton>
              <VisitButton software={s} placement="product-header" label="Visit vendor" size="lg" />
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <ShortlistToggle slug={s.slug} name={s.name} />
              <AffiliateDisclosureNote hasAffiliate={affiliate} className="max-w-xs" />
            </div>
          </div>
        </div>
      </header>

      <div className="mt-10 grid gap-10 lg:mt-14 lg:grid-cols-[200px_minmax(0,1fr)] lg:gap-14">
        <SectionNav sections={sections} />

        <div className="min-w-0 space-y-14">
          <ProfileSection id="overview" title="Overview">
            <div className="prose-site max-w-3xl">
              {s.description.map((p, i) => (
                <p key={i} className={i === 0 ? "lead" : undefined}>
                  {p}
                </p>
              ))}
            </div>
            <div className="mt-10 grid gap-8 xl:grid-cols-2">
              <div>
                <h3 className="mb-4 font-heading text-[19px] font-bold">Vendor spec sheet</h3>
                <SpecSheet software={s} showBankFeeds={showBankFeeds} />
              </div>
              <div>
                <h3 className="mb-4 font-heading text-[19px] font-bold">Local compliance</h3>
                <ComplianceList compliance={s.compliance} focus={category.compliance_focus} />
              </div>
            </div>
          </ProfileSection>

          {s.review && (
            <ProfileSection id="review" title={`Our ${s.name} review`}>
              <EditorialReview review={s.review} name={s.name} />
            </ProfileSection>
          )}

          <ProfileSection id="pricing" title="Pricing">
            <PriceStampRow software={s} />
            <div className="mt-6">
              {s.pricing_plans.length ? (
                <PlanCards software={s} />
              ) : (
                <p className="max-w-2xl text-[16px] text-muted-foreground">
                  {s.pricing_model === "quote"
                    ? `${s.name} is sold on quotation, so there is no public list price.`
                    : `We have not yet recorded plan prices for ${s.name}.`}
                </p>
              )}
            </div>
            {s.pricing_note && (
              <p className="mt-5 max-w-3xl rounded-[18px] bg-card p-4 text-[14.5px] leading-relaxed text-muted-foreground ring-1 ring-inset ring-border">
                {s.pricing_note}
              </p>
            )}
            {s.pricing_plans.length > 0 && (
              <div className="mt-8">
                <h3 className="mb-4 font-heading text-[19px] font-bold">Full pricing table</h3>
                <PricingTable software={s} />
              </div>
            )}
            <div className="mt-8 space-y-8">
              <BracketTable software={s} />
              <AddonsTable software={s} />
              <PriceSources software={s} />
            </div>
            <div className="mt-8 grid gap-6 xl:grid-cols-[1.4fr_1fr] xl:items-start">
              <CostCalculator plans={s.pricing_plans} productName={s.name} />
              <PriceHistory software={s} />
            </div>
            <AffiliateDisclosureNote hasAffiliate={affiliate} className="mt-6" />
            <div className="mt-3">
              <VisitButton software={s} placement="product-pricing" label="See prices on the vendor site" />
            </div>
          </ProfileSection>

          <ProfileSection id="analytics" title="Cost analytics">
            <ProfileAnalytics software={s} category={category} all={all} />
          </ProfileSection>

          <ProfileSection id="features" title="Features">
            <ul className="grid gap-3 md:grid-cols-3">
              {s.top_features.map((f, i) => (
                <li key={f.title} className="rounded-[24px] bg-card p-5 ring-1 ring-inset ring-border">
                  <span className="font-heading text-[13px] font-bold text-muted-foreground tabular">0{i + 1}</span>
                  <p className="mt-2 font-heading text-[17px] font-bold leading-snug">{f.title}</p>
                  <p className="mt-2 text-[14.5px] leading-relaxed text-muted-foreground">{f.body}</p>
                </li>
              ))}
            </ul>
            <h3 className="mb-4 mt-10 font-heading text-[19px] font-bold">Everything it does</h3>
            <ul className="grid gap-x-8 gap-y-2.5 sm:grid-cols-2">
              {s.features.map((f) => (
                <li key={f} className="flex items-center gap-2.5 border-b border-border-strong pb-2.5 text-[15px]">
                  <span className="inline-flex size-5 shrink-0 items-center justify-center rounded-full bg-ink text-white" aria-hidden="true">
                    <svg width="10" height="10" viewBox="0 0 12 12"><path d="M2.5 6.5l2.2 2.2 4.8-5.2" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                  </span>
                  {f}
                </li>
              ))}
            </ul>
            <h3 className="mb-4 mt-10 font-heading text-[19px] font-bold">Integrations</h3>
            <Integrations names={s.integrations} />
          </ProfileSection>

          {s.screenshots.length > 0 && (
            <ProfileSection id="screenshots" title="Screenshots">
              <ScreenshotCarousel screenshots={s.screenshots} />
            </ProfileSection>
          )}

          {rated && dist && sizes && (
            <ProfileSection id="ratings" title="Ratings">
              <div className="grid gap-8 xl:grid-cols-[auto_1fr]">
                <div className="flex flex-col items-center gap-3 rounded-[24px] bg-card p-6 ring-1 ring-inset ring-border">
                  <RatingDial value={s.rating_overall ?? 0} />
                  <p className="text-[14px] text-muted-foreground">{s.review_count} moderated reviews</p>
                </div>
                <ul className="space-y-2.5 self-center">
                  {[5, 4, 3, 2, 1].map((star) => {
                    const n = dist[star as 1 | 2 | 3 | 4 | 5];
                    const pct = s.review_count ? (n / s.review_count) * 100 : 0;
                    return (
                      <li key={star} className="grid grid-cols-[56px_1fr_40px] items-center gap-3 text-[14px]">
                        <span>{star} stars</span>
                        <span className="h-2.5 overflow-hidden rounded-full bg-border">
                          <span className="bar-fill block h-full rounded-full bg-ink" style={{ width: `${pct}%` }} />
                        </span>
                        <span className="text-right tabular text-muted-foreground">{n}</span>
                      </li>
                    );
                  })}
                </ul>
              </div>
              <div className="mt-8 grid gap-8 xl:grid-cols-2">
                <div>
                  <h3 className="mb-3 font-heading text-[17px] font-bold">By dimension</h3>
                  <DimensionChart
                    data={RATING_DIMENSIONS.map((d) => ({ label: d.label, value: s[d.key] ?? 0 }))}
                  />
                </div>
                <div>
                  <h3 className="mb-3 font-heading text-[17px] font-bold">Reviewers by company size</h3>
                  <SizeChart data={Object.entries(COMPANY_SIZE_LABEL).map(([k, label]) => ({ label, value: sizes[k] ?? 0 }))} />
                </div>
              </div>
            </ProfileSection>
          )}

          {rival && (
            <ProfileSection id="compare" title={`${s.name} vs ${rival.name}`}>
              <div className="overflow-hidden rounded-[24px] border border-border bg-card">
                <div className="grid grid-cols-[1.2fr_1fr_1fr] gap-px bg-border text-[14.5px]">
                  <div className="bg-bone p-4 font-semibold">Side by side</div>
                  <div className="bg-bone p-4 font-heading font-bold">{s.name}</div>
                  <div className="bg-bone p-4 font-heading font-bold">{rival.name}</div>
                  {hasPublicRating(s) && hasPublicRating(rival)
                    ? RATING_DIMENSIONS.map((d) => (
                        <Row key={d.key} label={d.label} a={<Stars value={s[d.key] ?? 0} size={12} />} b={<Stars value={rival[d.key] ?? 0} size={12} />} />
                      ))
                    : (
                      <Row label="Rating" a={<RatingOrEmpty software={s} size={12} />} b={<RatingOrEmpty software={rival} size={12} />} />
                    )}
                  <Row label="Starting price" a={formatSoftwarePrice(s)} b={formatSoftwarePrice(rival)} />
                  <Row label="Free trial" a={s.free_trial ? "Yes" : "No"} b={rival.free_trial ? "Yes" : "No"} />
                  <Row label="Free version" a={s.free_version ? "Yes" : "No"} b={rival.free_version ? "Yes" : "No"} />
                  {focusLabels.map((c) => (
                    <Row
                      key={c.key}
                      label={c.label}
                      a={<ComplianceMark status={s.compliance[c.key]?.status} />}
                      b={<ComplianceMark status={rival.compliance[c.key]?.status} />}
                    />
                  ))}
                </div>
              </div>
              <div className="mt-5">
                <CtaButton href={`/compare/${pairSlug(s.slug, rival.slug)}`} variant="soft">
                  Full comparison
                </CtaButton>
              </div>
            </ProfileSection>
          )}

          <ProfileSection id="reviews" title="Reader reviews">
            {reviews.length ? (
              <>
                <ul className="space-y-4">
                  {reviews.map((r) => (
                    <li key={r.id}>
                      <ReviewCard review={r} />
                    </li>
                  ))}
                </ul>
                <div className="mt-6 flex flex-wrap gap-2">
                  <CtaButton href={`/software/${s.slug}/reviews`} variant="soft">
                    All reviews
                  </CtaButton>
                  <CtaButton href={`/software/${s.slug}/reviews/new`}>Write a review</CtaButton>
                </div>
              </>
            ) : (
              <div className="flex flex-col items-start gap-4 rounded-[24px] border border-dashed border-border-strong bg-card p-8">
                <span className="inline-flex size-11 items-center justify-center rounded-xl bg-bone" aria-hidden="true">
                  <MessageSquarePlus size={20} />
                </span>
                <div>
                  <p className="font-heading text-[20px] font-bold">Use {s.name} at work? Share how it runs for your team.</p>
                  <p className="mt-1 max-w-lg text-[15px] text-muted-foreground">
                    Your review helps the next business decide. A person reads every review before it goes live.
                  </p>
                </div>
                <CtaButton href={`/software/${s.slug}/reviews/new`}>Write a review</CtaButton>
              </div>
            )}
          </ProfileSection>

          {alternatives.length > 0 && (
            <ProfileSection id="alternatives" title={`Alternatives to ${s.name}`}>
              <ul className="grid gap-4 md:grid-cols-2 2xl:grid-cols-3">
                {alternatives.map((a) => (
                  <li key={a.slug}>
                    <ProductCard software={toSummary(a)} placement="product-alternatives" />
                  </li>
                ))}
              </ul>
              <div className="mt-6">
                <CtaButton href={`/software/${s.slug}/alternatives`} variant="soft">
                  All alternatives
                </CtaButton>
              </div>
            </ProfileSection>
          )}

          <ProfileSection id="faqs" title="Questions people ask">
            <FaqAccordion faqs={faqs} />
          </ProfileSection>

          <AffiliateDisclosureNote hasAffiliate={affiliate} />
        </div>
      </div>
    </div>
  );
}

function Row({ label, a, b }: { label: string; a: React.ReactNode; b: React.ReactNode }) {
  return (
    <>
      <div className="bg-card p-4 text-muted-foreground">{label}</div>
      <div className="bg-card p-4">{a}</div>
      <div className="bg-card p-4">{b}</div>
    </>
  );
}
