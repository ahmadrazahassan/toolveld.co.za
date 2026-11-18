import Link from "next/link";
import { Info } from "lucide-react";
import { CtaButton } from "@/components/ui/button";
import { AdLabel } from "@/components/ui/badge";
import { SoftwareLogo } from "@/components/public/software-logo";
import { AFFILIATE_REFERRER_POLICY, getOutboundLink, hasAffiliateLink, type Placement } from "@/lib/affiliate";
import type { Software } from "@/lib/types";
import { cn } from "@/lib/utils";

/**
 * The only component that renders a link to a vendor's site. Affiliate links carry
 * rel="sponsored noopener" (never noreferrer), the referrer policy, an Ad label and an
 * accessible name starting "Ad:". Everything else is a plain nofollow link.
 */
export function VisitButton({
  software,
  placement,
  label = "Visit website",
  size = "sm",
  variant = "tint",
  full = false,
  className,
}: {
  software: Pick<Software, "slug" | "name" | "website">;
  placement: Placement;
  label?: string;
  size?: "xs" | "sm" | "default" | "lg";
  /** "yellow" is the strong call to action; "tint" suits cards with other buttons beside it. */
  variant?: "tint" | "yellow" | "default" | "soft";
  full?: boolean;
  className?: string;
}) {
  const link = getOutboundLink(software, placement);
  if (link.affiliate) {
    return (
      <span className={cn("inline-flex items-center gap-2", full && "w-full", className)}>
        <CtaButton
          href={link.href}
          external
          variant={variant}
          size={size}
          icon="external"
          full={full}
          rel={link.rel}
          target="_blank"
          referrerPolicy={AFFILIATE_REFERRER_POLICY}
          aria-label={`Ad: ${label} for ${software.name} (opens in a new tab)`}
          data-affiliate="true"
          data-subid={link.subId ?? undefined}
        >
          {label}
        </CtaButton>
        <AdLabel />
      </span>
    );
  }
  return (
    <CtaButton
      href={link.href}
      external
      variant={variant}
      size={size}
      icon="external"
      full={full}
      rel={link.rel}
      target="_blank"
      className={className}
      aria-label={`${label} for ${software.name} (opens in a new tab)`}
    >
      {label}
    </CtaButton>
  );
}

/**
 * A full width call to action panel: logo, a short line, Visit website and an optional
 * second button, with the disclosure note underneath.
 */
export function VisitBanner({
  software,
  placement,
  title,
  body,
  secondary,
  tone = "light",
  className,
}: {
  software: Pick<Software, "slug" | "name" | "website" | "logo" | "brand_color">;
  placement: Placement;
  title: string;
  body?: string | null;
  secondary?: React.ReactNode;
  tone?: "light" | "accent";
  className?: string;
}) {
  return (
    <aside
      aria-label={`Visit ${software.name}`}
      className={cn(
        "rounded-[24px] p-5 ring-1 ring-inset md:p-7",
        tone === "accent" ? "bg-yellow-wash ring-[#f1dc7a]" : "bg-card ring-border",
        className,
      )}
    >
      <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
        <div className="flex min-w-0 items-center gap-4">
          <SoftwareLogo name={software.name} logo={software.logo} brandColor={software.brand_color} />
          <div className="min-w-0">
            <p className="font-heading text-[19px] font-bold leading-snug tracking-[-0.01em] md:text-[21px]">{title}</p>
            {body && <p className="mt-1 text-[14.5px] leading-snug text-muted-foreground">{body}</p>}
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2 md:shrink-0 md:justify-end">
          <VisitButton software={software} placement={placement} variant="yellow" size="default" />
          {secondary}
        </div>
      </div>
      <AffiliateDisclosureNote hasAffiliate={hasAffiliateLink(software.slug)} className="mt-4" />
    </aside>
  );
}

/** Sits next to every commercial button group. Says plainly when no link earns us anything. */
export function AffiliateDisclosureNote({ hasAffiliate, className }: { hasAffiliate: boolean; className?: string }) {
  return (
    <p className={cn("flex items-start gap-2 text-[13px] leading-snug text-muted-foreground", className)}>
      <Info size={14} className="mt-0.5 shrink-0" aria-hidden="true" />
      <span>
        {hasAffiliate
          ? "Links marked Ad may earn us a commission at no cost to you. Rankings are set before any commercial relationship is considered. "
          : "Visit website links go straight to the vendor and earn us nothing. "}
        <Link href="/affiliate-disclosure" className="underline underline-offset-2 hover:text-ink">
          How we make money
        </Link>
      </span>
    </p>
  );
}
