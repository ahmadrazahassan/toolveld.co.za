import Link from "next/link";
import { Check, Minus, Quote } from "lucide-react";
import { formatLongDate } from "@/lib/format";
import { EDITORIAL_AUTHOR, MIN_PUBLIC_REVIEWS } from "@/lib/site";
import type { EditorialReview as Review } from "@/lib/types";

/** Our editorial review. It never carries a score; ratings come only from readers. */
export function EditorialReview({ review, name }: { review: Review; name: string }) {
  return (
    <div className="space-y-10">
      <div className="on-dark rounded-[32px] bg-panel p-6 text-on-panel md:p-10">
        <Quote size={30} className="text-yellow" aria-hidden="true" />
        <p className="mt-4 font-heading text-[21px] font-medium leading-[1.4] tracking-[-0.01em] text-white md:text-[25px]">
          {review.verdict}
        </p>
        <div className="mt-8 grid gap-4 md:grid-cols-2">
          <div className="rounded-[20px] bg-white/[0.06] p-5 ring-1 ring-white/10">
            <p className="eyebrow text-yellow">Buy it if</p>
            <p className="mt-2 text-[15.5px] leading-relaxed text-white/85">{review.buy_if}</p>
          </div>
          <div className="rounded-[20px] bg-white/[0.06] p-5 ring-1 ring-white/10">
            <p className="eyebrow text-on-panel-muted">Look elsewhere if</p>
            <p className="mt-2 text-[15.5px] leading-relaxed text-white/85">{review.skip_if}</p>
          </div>
        </div>
        <p className="mt-6 text-[13px] text-on-panel-muted">
          Reviewed {formatLongDate(review.reviewed_at)} by{" "}
          <Link href="/about" className="font-medium text-white underline underline-offset-2 hover:text-yellow">
            {EDITORIAL_AUTHOR.name}
          </Link>
          {EDITORIAL_AUTHOR.isPerson ? `, ${EDITORIAL_AUTHOR.role.toLowerCase()}` : ""}. Our reviews carry no score: {name}&apos;s
          rating comes only from reader reviews, once {MIN_PUBLIC_REVIEWS} are published.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="card-modern p-6">
          <h3 className="font-heading text-[18px] font-bold">What we like</h3>
          <ul className="mt-4 space-y-3">
            {review.pros.map((p) => (
              <li key={p} className="flex gap-3 text-[15px] leading-snug">
                <span className="mt-0.5 inline-flex size-5 shrink-0 items-center justify-center rounded-full bg-yellow text-ink" aria-hidden="true">
                  <Check size={12} strokeWidth={3} />
                </span>
                {p}
              </li>
            ))}
          </ul>
        </div>
        <div className="card-modern p-6">
          <h3 className="font-heading text-[18px] font-bold">What we would change</h3>
          <ul className="mt-4 space-y-3">
            {review.cons.map((c) => (
              <li key={c} className="flex gap-3 text-[15px] leading-snug">
                <span className="mt-0.5 inline-flex size-5 shrink-0 items-center justify-center rounded-full ring-1 ring-inset ring-border-strong" aria-hidden="true">
                  <Minus size={12} strokeWidth={3} />
                </span>
                {c}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="space-y-10">
        {review.sections.map((s) => (
          <section key={s.id} aria-labelledby={`review-${s.id}`} className="max-w-3xl">
            <h3 id={`review-${s.id}`} className="font-heading text-[22px] font-bold leading-tight tracking-[-0.015em]">
              {s.title}
            </h3>
            <div className="prose-site mt-4">
              {s.paragraphs.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
              {s.bullets && (
                <ul>
                  {s.bullets.map((b) => (
                    <li key={b}>{b}</li>
                  ))}
                </ul>
              )}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
