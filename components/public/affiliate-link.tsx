import Link from "next/link";
import { Info } from "lucide-react";
import { CtaButton } from "@/components/ui/button";
import { AdLabel } from "@/components/ui/badge";
import { AFFILIATE_REFERRER_POLICY, getOutboundLink, type Placement } from "@/lib/affiliate";
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
  label = "Visit site",
  size = "sm",
  full = false,
  className,
}: {
  software: Pick<Software, "slug" | "name" | "website">;
  placement: Placement;
  label?: string;
  size?: "xs" | "sm" | "default" | "lg";
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
          variant="tint"
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
      variant="tint"
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

/** Sits next to every commercial button group. Says plainly when no link earns us anything. */
export function AffiliateDisclosureNote({ hasAffiliate, className }: { hasAffiliate: boolean; className?: string }) {
  return (
    <p className={cn("flex items-start gap-2 text-[13px] leading-snug text-muted-foreground", className)}>
      <Info size={14} className="mt-0.5 shrink-0" aria-hidden="true" />
      <span>
        {hasAffiliate
          ? "Links marked Ad may earn us a commission at no cost to you. Rankings are set before any commercial relationship is considered. "
          : "Visit site links go straight to the vendor and earn us nothing. "}
        <Link href="/affiliate-disclosure" className="underline underline-offset-2 hover:text-ink">
          How we make money
        </Link>
      </span>
    </p>
  );
}
