import { BadgeCheck } from "lucide-react";
import { Stars } from "@/components/ui/misc";
import { hasPublicRating } from "@/lib/reviews-policy";
import { SITE_NAME } from "@/lib/site";
import type { Software } from "@/lib/types";
import { cn } from "@/lib/utils";

/**
 * Reader stars once a product has MIN_PUBLIC_REVIEWS published reviews. Before that, the
 * product carries our own written review, so we show that mark instead of an empty state.
 */
export function RatingOrEmpty({
  software,
  size = 14,
  className,
}: {
  software: Pick<Software, "rating_overall" | "review_count">;
  size?: number;
  className?: string;
}) {
  if (hasPublicRating(software) && software.rating_overall !== null) {
    return <Stars value={software.rating_overall} size={size} count={software.review_count} className={className} />;
  }
  return (
    <span className={cn("inline-flex items-center gap-1.5 text-[13px] font-medium text-ink", className)}>
      <span className="inline-flex size-[18px] items-center justify-center rounded-full bg-yellow" aria-hidden="true">
        <BadgeCheck size={12} strokeWidth={2.4} />
      </span>
      Reviewed by {SITE_NAME}
    </span>
  );
}
