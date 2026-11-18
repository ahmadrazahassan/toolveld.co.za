import Link from "next/link";
import { CtaButton } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SoftwareLogo } from "@/components/public/software-logo";
import { SoftwarePrice } from "@/components/public/price";
import { RatingOrEmpty } from "@/components/public/rating";
import { VisitButton } from "@/components/public/affiliate-link";
import { ShortlistToggle } from "@/components/public/shortlist";
import type { Placement } from "@/lib/affiliate";
import type { SoftwareSummary } from "@/lib/types";
import { cn } from "@/lib/utils";

/**
 * Product card. The title link stretches over the whole card; the buttons sit above that
 * overlay with a higher z-index so both stay clickable.
 */
export function ProductCard({
  software,
  placement,
  className,
}: {
  software: SoftwareSummary;
  placement: Placement;
  className?: string;
}) {
  return (
    <article className={cn("card-modern card-hover relative flex h-full flex-col p-5", className)}>
      <div className="flex items-start justify-between gap-3">
        <SoftwareLogo name={software.name} logo={software.logo} brandColor={software.brand_color} />
        <ShortlistToggle slug={software.slug} name={software.name} compact />
      </div>
      <h3 className="mt-4 font-heading text-[18px] font-bold leading-[1.25] tracking-[-0.01em]">
        <Link href={`/software/${software.slug}`} className="stretched-link focus-visible:outline-none">
          {software.name}
        </Link>
      </h3>
      <p className="mt-1.5 line-clamp-2 text-[14.5px] leading-snug text-muted-foreground">{software.short_description}</p>
      <div className="mt-3">
        <RatingOrEmpty software={software} />
      </div>
      <div className="mt-auto pt-4">
        <SoftwarePrice software={software} />
        <div className="relative z-[2] mt-4 flex flex-wrap gap-2">
          <CtaButton href={`/software/${software.slug}`} size="sm">
            Read review
          </CtaButton>
          <VisitButton software={software} placement={placement} />
        </div>
      </div>
    </article>
  );
}

/** Wide list card for the directory and category pages. */
export function ProductListCard({
  software,
  categoryName,
  placement,
  rank,
}: {
  software: SoftwareSummary;
  categoryName: string;
  placement: Placement;
  rank?: number;
}) {
  return (
    <article className="card-modern card-hover relative grid gap-5 p-5 sm:p-6 md:grid-cols-[auto_1fr_auto] md:items-center">
      <div className="flex items-center gap-4">
        {rank !== undefined && (
          <span className="font-heading text-[40px] font-bold leading-none tracking-[-0.05em] text-ink tabular">{rank}</span>
        )}
        <SoftwareLogo name={software.name} logo={software.logo} brandColor={software.brand_color} size="lg" />
      </div>
      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
          <h3 className="font-heading text-[20px] font-bold leading-tight tracking-[-0.01em]">
            <Link href={`/software/${software.slug}`} className="stretched-link focus-visible:outline-none">
              {software.name}
            </Link>
          </h3>
          <span className="text-[13px] text-muted-foreground">{categoryName}</span>
        </div>
        <p className="mt-1.5 text-[15px] leading-snug text-muted-foreground">{software.tagline}</p>
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <RatingOrEmpty software={software} />
          {software.free_version && <Badge>Free version</Badge>}
          {software.free_trial && <Badge>Free trial{software.free_trial_days ? `, ${software.free_trial_days} days` : ""}</Badge>}
          {software.deployment === "desktop" && <Badge>Desktop</Badge>}
        </div>
      </div>
      <div className="flex flex-col gap-4 md:items-end md:text-right">
        <SoftwarePrice software={software} />
        <div className="relative z-[2] flex flex-wrap items-center gap-2 md:justify-end">
          <ShortlistToggle slug={software.slug} name={software.name} />
          <CtaButton href={`/software/${software.slug}`} size="sm">
            Read review
          </CtaButton>
          <VisitButton software={software} placement={placement} />
        </div>
      </div>
    </article>
  );
}
