import { ThumbsDown, ThumbsUp } from "lucide-react";
import { Flag, Stars } from "@/components/ui/misc";
import { HelpfulButton } from "@/components/public/helpful-button";
import { COMPANY_SIZE_LABEL, formatDate } from "@/lib/format";
import type { Review } from "@/lib/types";

export function ReviewCard({ review }: { review: Review }) {
  return (
    <article className="card-modern p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Stars value={review.rating_overall} size={15} />
        <time dateTime={review.created_at} className="text-[13px] text-muted-foreground">
          {formatDate(review.created_at)}
        </time>
      </div>
      <h3 className="mt-3 font-heading text-[18px] font-bold leading-snug">{review.title}</h3>
      <div className="mt-4 grid gap-4 md:grid-cols-2">
        <div>
          <p className="flex items-center gap-2 text-[13px] font-semibold text-ink">
            <ThumbsUp size={14} aria-hidden="true" /> What they like
          </p>
          <p className="mt-1.5 text-[15px] leading-relaxed text-muted-foreground">{review.pros}</p>
        </div>
        <div>
          <p className="flex items-center gap-2 text-[13px] font-semibold text-ink">
            <ThumbsDown size={14} aria-hidden="true" /> What they dislike
          </p>
          <p className="mt-1.5 text-[15px] leading-relaxed text-muted-foreground">{review.cons}</p>
        </div>
      </div>
      <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-border pt-4">
        <p className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[13.5px] text-muted-foreground">
          <span className="font-semibold text-ink">{review.reviewer_first_name}</span>
          <span>{review.reviewer_role}</span>
          <span aria-hidden="true">&middot;</span>
          <span>{COMPANY_SIZE_LABEL[review.company_size]} staff</span>
          <span aria-hidden="true">&middot;</span>
          <span>Used for {review.usage_duration}</span>
          <Flag code={review.country} size={11} />
        </p>
        <HelpfulButton reviewId={review.id} count={review.helpful_count} />
      </div>
    </article>
  );
}
