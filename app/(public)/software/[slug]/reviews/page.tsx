import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MessagesSquare } from "lucide-react";
import { SectionHeader } from "@/components/public/section-heading";
import { ReviewCard } from "@/components/public/review-card";
import { SoftwareLogo } from "@/components/public/software-logo";
import { CtaButton } from "@/components/ui/button";
import { RatingDial } from "@/components/ui/misc";
import { getReviews, getStarDistribution, type ReviewSort } from "@/lib/queries/reviews";
import { getSoftwareBySlug } from "@/lib/queries/software";
import { hasPublicRating } from "@/lib/reviews-policy";
import { COMPANY_SIZE_LABEL } from "@/lib/format";
import { MIN_PUBLIC_REVIEWS } from "@/lib/site";
import { JsonLd, breadcrumbSchema, buildMetadata } from "@/lib/seo";
import type { CompanySize } from "@/lib/types";
import { cn } from "@/lib/utils";

const SORTS: { value: ReviewSort; label: string }[] = [
  { value: "recent", label: "Most recent" },
  { value: "helpful", label: "Most helpful" },
  { value: "highest", label: "Highest rated" },
  { value: "lowest", label: "Lowest rated" },
];
const PER_PAGE = 10;

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const s = await getSoftwareBySlug(slug);
  if (!s) return {};
  return buildMetadata({
    title: `${s.name} reviews`,
    description: `Moderated reviews of ${s.name} from South African businesses.`,
    path: `/software/${s.slug}/reviews`,
    eyebrow: "Reviews",
    noindex: s.review_count === 0,
  });
}

type SP = Promise<Record<string, string | undefined>>;

export default async function ReviewsPage({ params, searchParams }: { params: Promise<{ slug: string }>; searchParams: SP }) {
  const { slug } = await params;
  const sp = await searchParams;
  const s = await getSoftwareBySlug(slug);
  if (!s) notFound();

  const stars = Number(sp.stars) || undefined;
  const size = (sp.size && sp.size in COMPANY_SIZE_LABEL ? sp.size : undefined) as CompanySize | undefined;
  const sort = (SORTS.some((o) => o.value === sp.sort) ? sp.sort : "recent") as ReviewSort;
  const page = Math.max(1, Number(sp.page) || 1);
  const [{ reviews, total }, dist] = await Promise.all([
    getReviews({ softwareId: s.id, stars, size, sort, page, perPage: PER_PAGE }),
    getStarDistribution(s.id),
  ]);
  const pages = Math.max(1, Math.ceil(total / PER_PAGE));
  const rated = hasPublicRating(s);

  const href = (patch: Record<string, string | number | undefined>) => {
    const q = new URLSearchParams();
    const merged = { stars, size, sort: sort === "recent" ? undefined : sort, page: undefined, ...patch };
    for (const [k, v] of Object.entries(merged)) if (v !== undefined) q.set(k, String(v));
    const str = q.toString();
    return `/software/${s.slug}/reviews${str ? `?${str}` : ""}`;
  };

  const chip = (active: boolean) =>
    cn(
      "inline-flex h-9 items-center rounded-full px-3.5 text-[13.5px] font-medium transition",
      active ? "bg-ink text-white" : "bg-card text-ink ring-1 ring-inset ring-border-strong hover:bg-bone",
    );

  return (
    <div className="container-site">
      <JsonLd
        data={breadcrumbSchema([
          { name: "Software", path: "/software" },
          { name: s.name, path: `/software/${s.slug}` },
          { name: "Reviews", path: `/software/${s.slug}/reviews` },
        ])}
      />
      <SectionHeader
        icon={<MessagesSquare size={14} />}
        eyebrow={`${s.name} reviews`}
        title={`What people say about ${s.name}`}
        subtitle="Every review is read by a person before it goes live. We describe them as moderated, because we cannot prove who every reviewer is."
      />

      <div className="grid gap-10 lg:grid-cols-[300px_minmax(0,1fr)]">
        <aside className="space-y-6 self-start lg:sticky lg:top-28">
          <div className="card-modern flex flex-col items-center p-6 text-center">
            <SoftwareLogo name={s.name} logo={s.logo} brandColor={s.brand_color} size="lg" />
            <p className="mt-3 font-heading text-[20px] font-bold">{s.name}</p>
            {rated ? (
              <div className="mt-4">
                <RatingDial value={s.rating_overall ?? 0} size={120} />
                <p className="mt-2 text-[14px] text-muted-foreground">{s.review_count} moderated reviews</p>
              </div>
            ) : (
              <p className="mt-3 text-[14px] text-muted-foreground">
                No rating yet. It appears once {MIN_PUBLIC_REVIEWS} reviews are published.
              </p>
            )}
            <div className="mt-5">
              <CtaButton href={`/software/${s.slug}/reviews/new`}>Write a review</CtaButton>
            </div>
          </div>
          {rated && (
            <ul className="space-y-2">
              {[5, 4, 3, 2, 1].map((n) => (
                <li key={n} className="grid grid-cols-[52px_1fr_32px] items-center gap-3 text-[13.5px]">
                  <span>{n} stars</span>
                  <span className="h-2 overflow-hidden rounded-full bg-border">
                    <span className="bar-fill block h-full bg-ink" style={{ width: `${(dist[n as 1] / Math.max(1, s.review_count)) * 100}%` }} />
                  </span>
                  <span className="text-right tabular text-muted-foreground">{dist[n as 1]}</span>
                </li>
              ))}
            </ul>
          )}
        </aside>

        <div className="min-w-0">
          <div className="mb-6 space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="mr-1 text-[13px] text-muted-foreground">Stars</span>
              <Link href={href({ stars: undefined })} className={chip(!stars)}>
                All
              </Link>
              {[5, 4, 3, 2, 1].map((n) => (
                <Link key={n} href={href({ stars: n })} className={chip(stars === n)}>
                  {n}
                </Link>
              ))}
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="mr-1 text-[13px] text-muted-foreground">Company size</span>
              <Link href={href({ size: undefined })} className={chip(!size)}>
                Any
              </Link>
              {Object.entries(COMPANY_SIZE_LABEL).map(([v, l]) => (
                <Link key={v} href={href({ size: v })} className={chip(size === v)}>
                  {l}
                </Link>
              ))}
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="mr-1 text-[13px] text-muted-foreground">Sort</span>
              {SORTS.map((o) => (
                <Link key={o.value} href={href({ sort: o.value === "recent" ? undefined : o.value })} className={chip(sort === o.value)}>
                  {o.label}
                </Link>
              ))}
            </div>
          </div>

          {reviews.length ? (
            <ul className="space-y-4">
              {reviews.map((r) => (
                <li key={r.id}>
                  <ReviewCard review={r} />
                </li>
              ))}
            </ul>
          ) : (
            <div className="rounded-[24px] border border-dashed border-border-strong bg-card p-10 text-center">
              <p className="font-heading text-[22px] font-bold">{total === 0 && !stars && !size ? `Use ${s.name} at work?` : "No reviews match"}</p>
              <p className="mx-auto mt-2 max-w-md text-[15px] text-muted-foreground">
                {total === 0 && !stars && !size
                  ? "Share how it runs for your team. A person reads every review before it goes live."
                  : "Try a different filter."}
              </p>
            </div>
          )}

          {pages > 1 && (
            <nav aria-label="Pagination" className="mt-8 flex items-center justify-between">
              {page > 1 ? (
                <Link href={href({ page: page - 1 })} className={chip(false)}>
                  Previous
                </Link>
              ) : (
                <span />
              )}
              <span className="text-[14px] text-muted-foreground">
                Page {page} of {pages}
              </span>
              {page < pages ? (
                <Link href={href({ page: page + 1 })} className={chip(false)}>
                  Next
                </Link>
              ) : (
                <span />
              )}
            </nav>
          )}
        </div>
      </div>
    </div>
  );
}
