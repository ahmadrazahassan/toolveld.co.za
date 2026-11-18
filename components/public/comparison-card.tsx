import Link from "next/link";
import { CtaButton } from "@/components/ui/button";
import { SoftwareLogo } from "@/components/public/software-logo";
import { RatingOrEmpty } from "@/components/public/rating";
import { hasPublicRating } from "@/lib/reviews-policy";
import type { Comparison, Software } from "@/lib/types";
import { truncate } from "@/lib/utils";
import { formatSoftwarePrice } from "@/lib/format";

const REAL_GAP = 0.2;

function Side({ s, higher }: { s: Software; higher: boolean }) {
  return (
    <div className="flex flex-col items-start gap-3 bg-card p-5">
      <SoftwareLogo name={s.name} logo={s.logo} brandColor={s.brand_color} />
      <div>
        <p className="font-heading text-[17px] font-bold leading-tight">{s.name}</p>
        <div className="mt-1.5">
          <RatingOrEmpty software={s} size={13} />
        </div>
        <p className="mt-1 text-[13px] text-muted-foreground">{formatSoftwarePrice(s)}</p>
      </div>
      {/* The tag slot always takes space so both panels keep the same height. */}
      <span
        className={`inline-flex h-6 items-center rounded-full px-2.5 text-[11px] font-semibold uppercase tracking-[0.08em] ${
          higher ? "bg-ink text-white" : "invisible"
        }`}
        aria-hidden={!higher}
      >
        Higher rated
      </span>
    </div>
  );
}

export function ComparisonCard({ comparison, a, b }: { comparison: Comparison; a: Software; b: Software }) {
  const bothRated = hasPublicRating(a) && hasPublicRating(b);
  const diff = bothRated ? (a.rating_overall ?? 0) - (b.rating_overall ?? 0) : 0;
  const winner = comparison.winner === a.slug ? a : b;
  return (
    <article className="card-modern card-hover relative flex h-full flex-col overflow-hidden">
      <div className="grid grid-cols-2 gap-px bg-border">
        <Side s={a} higher={bothRated && diff >= REAL_GAP} />
        <Side s={b} higher={bothRated && -diff >= REAL_GAP} />
      </div>
      <div className="flex flex-1 flex-col border-t border-border p-5">
        <h3 className="font-heading text-[18px] font-bold leading-tight">
          <Link href={`/compare/${comparison.slug}`} className="stretched-link focus-visible:outline-none">
            {a.name} vs {b.name}
          </Link>
        </h3>
        <p className="mt-1 text-[13px] font-medium text-ink">Our pick: {winner.name}</p>
        <p className="mt-2 text-[14.5px] leading-relaxed text-muted-foreground">{truncate(comparison.verdict, 150)}</p>
        <div className="relative z-[2] mt-auto pt-5">
          <CtaButton href={`/compare/${comparison.slug}`} size="sm" variant="soft">
            Compare
          </CtaButton>
        </div>
      </div>
    </article>
  );
}
