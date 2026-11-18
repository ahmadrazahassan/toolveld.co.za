import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Shuffle } from "lucide-react";
import { SectionHeader } from "@/components/public/section-heading";
import { SoftwareLogo } from "@/components/public/software-logo";
import { RatingOrEmpty } from "@/components/public/rating";
import { SoftwarePrice } from "@/components/public/price";
import { VisitButton, AffiliateDisclosureNote } from "@/components/public/affiliate-link";
import { ComplianceMark } from "@/components/public/compliance-list";
import { CtaButton } from "@/components/ui/button";
import { getCategory } from "@/lib/queries/categories";
import { pairSlug } from "@/lib/queries/content";
import { getAlternatives, getAllSoftware, getSoftwareBySlug, toSummary } from "@/lib/queries/software";
import { hasAffiliateLink } from "@/lib/affiliate";
import { formatSoftwarePrice } from "@/lib/format";
import { COMPLIANCE_CHECKLIST } from "@/lib/site";
import { JsonLd, breadcrumbSchema, buildMetadata } from "@/lib/seo";
import type { Software } from "@/lib/types";

export const revalidate = 3600;

export async function generateStaticParams() {
  return (await getAllSoftware()).map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const s = await getSoftwareBySlug(slug);
  if (!s) return {};
  return buildMetadata({
    title: `Alternatives to ${s.name}`,
    description: `The closest alternatives to ${s.name} for South African businesses, compared on rand pricing and local compliance.`,
    path: `/software/${s.slug}/alternatives`,
    eyebrow: "Alternatives",
  });
}

function whyAlternative(s: Software, alt: Software) {
  const reasons: string[] = [];
  if (alt.free_version && !s.free_version) reasons.push("has a free plan");
  if (alt.deployment !== s.deployment) reasons.push(alt.deployment === "cloud" ? "runs fully in the cloud" : alt.deployment === "desktop" ? "runs on your own machine" : "can run in the cloud or on premises");
  if (alt.pricing_model === "published" && s.pricing_model === "quote") reasons.push("publishes its prices");
  const overlap = alt.best_for_sizes.filter((x) => s.best_for_sizes.includes(x));
  if (overlap.length) reasons.push("serves businesses of a similar size");
  return reasons.length ? `${alt.name} ${reasons.slice(0, 2).join(" and ")}.` : alt.tagline;
}

export default async function AlternativesPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const s = await getSoftwareBySlug(slug);
  if (!s) notFound();
  const [alts, category] = await Promise.all([getAlternatives(s, 6), getCategory(s.category)]);
  const top = alts[0];
  const focus = COMPLIANCE_CHECKLIST.filter((c) => category?.compliance_focus.includes(c.key));

  return (
    <div className="container-site">
      <JsonLd
        data={breadcrumbSchema([
          { name: "Software", path: "/software" },
          { name: s.name, path: `/software/${s.slug}` },
          { name: "Alternatives", path: `/software/${s.slug}/alternatives` },
        ])}
      />
      <SectionHeader
        icon={<Shuffle size={14} />}
        eyebrow={`${alts.length} alternatives`}
        title={`Alternatives to ${s.name}`}
        subtitle={
          s.alternatives.length
            ? "Chosen by our editors first, then the closest products in the same category."
            : "The closest products in the same category."
        }
      />

      <ul className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {alts.map((a) => (
          <li key={a.slug} className="card-modern card-hover relative flex flex-col p-6">
            <div className="flex items-center gap-3">
              <SoftwareLogo name={a.name} logo={a.logo} brandColor={a.brand_color} />
              <div>
                <h2 className="font-heading text-[19px] font-bold leading-tight">
                  <Link href={`/software/${a.slug}`} className="stretched-link">
                    {a.name}
                  </Link>
                </h2>
                <RatingOrEmpty software={a} size={12} />
              </div>
            </div>
            <p className="mt-4 text-[15px] leading-relaxed text-muted-foreground">
              <span className="font-semibold text-ink">Why consider it: </span>
              {whyAlternative(s, a)}
            </p>
            <div className="mt-auto pt-5">
              <SoftwarePrice software={toSummary(a)} />
              <div className="relative z-[2] mt-4 flex flex-wrap gap-2">
                <CtaButton href={`/compare/${pairSlug(s.slug, a.slug)}`} size="sm">
                  Compare
                </CtaButton>
                <VisitButton software={a} placement="product-alternatives" />
              </div>
            </div>
          </li>
        ))}
      </ul>
      <AffiliateDisclosureNote hasAffiliate={alts.some((a) => hasAffiliateLink(a.slug))} className="mt-6" />

      {top && (
        <section aria-labelledby="side-by-side" className="mt-16">
          <h2 id="side-by-side" className="mb-6 font-heading text-[28px] font-bold tracking-[-0.02em]">
            {s.name} against {top.name}
          </h2>
          <div className="overflow-hidden rounded-[24px] border border-border bg-card">
            <div className="grid grid-cols-[1.2fr_1fr_1fr] gap-px bg-border text-[14.5px]">
              {[
                ["", s.name, top.name],
                ["Starting price", formatSoftwarePrice(s), formatSoftwarePrice(top)],
                ["Free trial", s.free_trial ? "Yes" : "No", top.free_trial ? "Yes" : "No"],
                ["Free version", s.free_version ? "Yes" : "No", top.free_version ? "Yes" : "No"],
              ].map(([k, a, b], i) => (
                <div key={k || "head"} className="contents">
                  <div className={i === 0 ? "bg-bone p-4" : "bg-card p-4 text-muted-foreground"}>{k}</div>
                  <div className={i === 0 ? "bg-bone p-4 font-heading font-bold" : "bg-card p-4"}>{a}</div>
                  <div className={i === 0 ? "bg-bone p-4 font-heading font-bold" : "bg-card p-4"}>{b}</div>
                </div>
              ))}
              {focus.map((c) => (
                <div key={c.key} className="contents">
                  <div className="bg-card p-4 text-muted-foreground">{c.label}</div>
                  <div className="bg-card p-4">
                    <ComplianceMark status={s.compliance[c.key]?.status} />
                  </div>
                  <div className="bg-card p-4">
                    <ComplianceMark status={top.compliance[c.key]?.status} />
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="mt-5">
            <CtaButton href={`/compare/${pairSlug(s.slug, top.slug)}`} variant="soft">
              Full comparison
            </CtaButton>
          </div>
        </section>
      )}
    </div>
  );
}
