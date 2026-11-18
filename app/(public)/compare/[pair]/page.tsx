import type { Metadata } from "next";
import { notFound, permanentRedirect } from "next/navigation";
import { Trophy } from "lucide-react";
import { SoftwareLogo } from "@/components/public/software-logo";
import { RatingOrEmpty } from "@/components/public/rating";
import { VisitButton, AffiliateDisclosureNote } from "@/components/public/affiliate-link";
import { ComplianceMatrix, FeatureMatrix, PricingMatrix, RatingsMatrix } from "@/components/public/compare-matrix";
import { CtaButton } from "@/components/ui/button";
import { getCategories } from "@/lib/queries/categories";
import { getComparisons, resolvePair } from "@/lib/queries/content";
import { hasAffiliateLink } from "@/lib/affiliate";
import { hasPublicRating } from "@/lib/reviews-policy";
import { toRand } from "@/lib/format";
import { JsonLd, breadcrumbSchema, buildMetadata } from "@/lib/seo";
import { unique } from "@/lib/utils";
import type { Software } from "@/lib/types";

export const revalidate = 3600;

export async function generateStaticParams() {
  const list = await getComparisons();
  return list.map((c) => ({ pair: c.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ pair: string }> }): Promise<Metadata> {
  const { pair } = await params;
  const r = await resolvePair(pair);
  if (!r) return {};
  return buildMetadata({
    title: `${r.a.name} vs ${r.b.name}`,
    description: r.comparison
      ? `${r.a.name} or ${r.b.name}? Our pick is ${r.comparison.winner === r.a.slug ? r.a.name : r.b.name}. Rand pricing, local compliance and every feature side by side.`
      : `${r.a.name} and ${r.b.name} side by side: rand pricing, local compliance and features.`,
    // Both orderings share one canonical URL.
    path: `/compare/${r.canonical}`,
    eyebrow: "Head to head",
  });
}

function covered(s: Software, keys: string[]) {
  return keys.filter((k) => s.compliance[k as keyof Software["compliance"]]?.status === "covered").length;
}

export default async function PairPage({ params }: { params: Promise<{ pair: string }> }) {
  const { pair } = await params;
  const r = await resolvePair(pair);
  if (!r) notFound();
  // One URL per pair: the reverse order redirects to the canonical one.
  if (pair !== r.canonical) permanentRedirect(`/compare/${r.canonical}`);
  const { a, b, comparison } = r;
  const categories = await getCategories();
  const focus = unique(categories.filter((c) => c.slug === a.category || c.slug === b.category).flatMap((c) => c.compliance_focus));
  const winner = comparison ? (comparison.winner === a.slug ? a : b) : null;
  const other = winner ? (winner.slug === a.slug ? b : a) : null;
  const anyAffiliate = hasAffiliateLink(a.slug) || hasAffiliateLink(b.slug);

  // Facts for pairs without a written verdict.
  const facts: string[] = [];
  if (!comparison) {
    const pa = a.starting_price === null ? null : toRand(a.starting_price, a.currency);
    const pb = b.starting_price === null ? null : toRand(b.starting_price, b.currency);
    if (pa !== null && pb !== null && pa !== pb) facts.push(`${pa < pb ? a.name : b.name} has the lower starting price.`);
    if (a.free_version !== b.free_version) facts.push(`${a.free_version ? a.name : b.name} has a free plan and ${a.free_version ? b.name : a.name} does not.`);
    const ca = covered(a, focus);
    const cb = covered(b, focus);
    if (ca !== cb) facts.push(`${ca > cb ? a.name : b.name} covers more of the local checklist (${Math.max(ca, cb)} of ${focus.length} against ${Math.min(ca, cb)}).`);
    if (a.category !== b.category) facts.push("These products sit in different categories, so they solve different problems.");
  }

  return (
    <div className="container-site">
      <JsonLd
        data={breadcrumbSchema([
          { name: "Compare", path: "/compare" },
          { name: `${a.name} vs ${b.name}`, path: `/compare/${r.canonical}` },
        ])}
      />

      <header className="card-modern overflow-hidden">
        <div className="grid gap-px bg-border md:grid-cols-2">
          {[a, b].map((p) => (
            <div key={p.slug} className="flex flex-col items-start gap-4 bg-card p-6 md:p-10">
              <SoftwareLogo name={p.name} logo={p.logo} brandColor={p.brand_color} size="lg" decorative={false} />
              <div>
                <p className="font-heading text-[26px] font-bold leading-tight">{p.name}</p>
                <p className="mt-1 text-[15px] text-muted-foreground">{p.tagline}</p>
                <div className="mt-3">
                  <RatingOrEmpty software={p} />
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                <CtaButton href={`/software/${p.slug}`} size="sm">
                  Read review
                </CtaButton>
                <VisitButton software={p} placement="compare-hero" />
              </div>
            </div>
          ))}
        </div>
        <div className="border-t border-border px-6 py-5 text-center md:px-10">
          <h1 className="font-heading text-[30px] font-bold leading-tight tracking-[-0.025em] md:text-[40px]">
            {a.name} vs {b.name}
          </h1>
          {winner && (
            <p className="mt-2 inline-flex items-center gap-2 text-[15px] font-medium">
              <Trophy size={16} aria-hidden="true" /> Our pick: {winner.name}
            </p>
          )}
        </div>
      </header>
      <AffiliateDisclosureNote hasAffiliate={anyAffiliate} className="mt-4" />

      <div className="mt-14 space-y-14">
        {[a, b].some(hasPublicRating) && (
          <section aria-labelledby="ratings">
            <h2 id="ratings" className="mb-5 font-heading text-[26px] font-bold tracking-[-0.02em]">Ratings</h2>
            <RatingsMatrix products={[a, b]} />
          </section>
        )}
        <section aria-labelledby="local">
          <h2 id="local" className="mb-5 font-heading text-[26px] font-bold tracking-[-0.02em]">Local compliance</h2>
          <ComplianceMatrix products={[a, b]} focus={focus} />
        </section>
        <section aria-labelledby="pricing">
          <h2 id="pricing" className="mb-5 font-heading text-[26px] font-bold tracking-[-0.02em]">Pricing compared</h2>
          <PricingMatrix products={[a, b]} />
        </section>
        <section aria-labelledby="features">
          <h2 id="features" className="mb-5 font-heading text-[26px] font-bold tracking-[-0.02em]">Every feature</h2>
          <FeatureMatrix products={[a, b]} />
        </section>

        <section aria-labelledby="verdict" className="on-dark rounded-[40px] bg-panel p-7 text-on-panel md:p-12">
          <p className="eyebrow text-on-panel-muted">The verdict</p>
          {comparison && winner && other ? (
            <>
              <h2 id="verdict" className="mt-4 font-heading text-[30px] font-normal leading-[1.08] tracking-[-0.03em] md:text-[40px]">
                <strong className="font-bold text-yellow">{winner.name}</strong> wins
              </h2>
              <p className="mt-5 max-w-3xl text-[17px] leading-relaxed text-white/85">{comparison.verdict}</p>
              <p className="mt-4 max-w-3xl text-[17px] leading-relaxed text-on-panel-muted">{comparison.pick_other_if}</p>
              <div className="mt-8 flex flex-wrap gap-2">
                <CtaButton href={`/software/${winner.slug}`} variant="onDark">
                  {`Read the ${winner.name} review`}
                </CtaButton>
              </div>
            </>
          ) : (
            <>
              <h2 id="verdict" className="mt-4 font-heading text-[28px] font-normal leading-[1.1] tracking-[-0.03em] md:text-[36px]">
                The numbers, <strong className="font-bold text-yellow">side by side</strong>
              </h2>
              <p className="mt-4 max-w-3xl text-[17px] text-on-panel-muted">
                Price, local compliance and team fit for both products, laid out so you can make the call.
              </p>
              {facts.length > 0 && (
                <ul className="mt-6 max-w-3xl space-y-2 text-[16px] text-white/85">
                  {facts.map((f) => (
                    <li key={f} className="flex gap-3">
                      <span className="mt-2.5 size-1.5 shrink-0 rounded-full bg-yellow" aria-hidden="true" />
                      {f}
                    </li>
                  ))}
                </ul>
              )}
            </>
          )}
        </section>
      </div>
    </div>
  );
}
