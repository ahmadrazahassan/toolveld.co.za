"use client";

import Link from "next/link";
import { useId, useState } from "react";
import { ArrowRight } from "lucide-react";
import { CategoryIcon } from "@/components/public/category-icon";
import { SoftwareLogo } from "@/components/public/software-logo";
import { formatRand } from "@/lib/format";
import type { IconName } from "@/lib/types";
import { cn } from "@/lib/utils";

export interface HeroBoard {
  slug: string;
  name: string;
  icon: IconName;
  seats: number;
  unit: string;
  total: number;
  rows: { slug: string; name: string; logo: string | null; brandColor: string | null; monthly: number }[];
}

const SHORT_NAME: Record<string, string> = { "project-management": "Projects" };

/** The price board on the hero photo: cheapest products per category for a typical team, in rand incl VAT. */
export function HeroPriceBoard({ boards }: { boards: HeroBoard[] }) {
  const [active, setActive] = useState(boards[0]?.slug);
  const baseId = useId();
  const board = boards.find((b) => b.slug === active) ?? boards[0];
  if (!board) return null;
  const max = Math.max(...board.rows.map((r) => r.monthly), 1);

  return (
    <div className="rounded-[22px] bg-card p-2 shadow-[0_1px_2px_rgba(19,19,21,.08),0_30px_60px_-24px_rgba(19,19,21,.55)] ring-1 ring-black/5">
      <div role="tablist" aria-label="Category" className="flex gap-1 overflow-x-auto rounded-[16px] bg-bone p-1 [scrollbar-width:none]">
        {boards.map((b) => {
          const selected = b.slug === board.slug;
          return (
            <button
              key={b.slug}
              type="button"
              role="tab"
              id={`${baseId}-tab-${b.slug}`}
              aria-selected={selected}
              aria-controls={`${baseId}-panel`}
              onClick={() => setActive(b.slug)}
              className={cn(
                "inline-flex h-9 shrink-0 items-center gap-1.5 rounded-[11px] px-3 text-[13px] font-medium transition-[background-color,color,box-shadow]",
                selected
                  ? "bg-card text-ink shadow-[0_1px_2px_rgba(19,19,21,.1),inset_0_0_0_1px_var(--border)]"
                  : "text-muted-foreground hover:text-ink",
              )}
            >
              <CategoryIcon name={b.icon} size={14} />
              {SHORT_NAME[b.slug] ?? b.name}
            </button>
          );
        })}
      </div>

      <div id={`${baseId}-panel`} role="tabpanel" aria-labelledby={`${baseId}-tab-${board.slug}`} className="px-3 pb-2 pt-4 sm:px-4">
        <div className="flex items-baseline justify-between gap-3">
          <p className="font-heading text-[16px] font-bold leading-tight text-ink">
            Cheapest for {board.seats} {board.unit}
          </p>
          <p className="shrink-0 text-[12px] text-muted-foreground">per month, incl VAT</p>
        </div>

        <ol className="mt-3 space-y-1">
          {board.rows.map((r, i) => (
            <li key={r.slug}>
              <Link
                href={`/software/${r.slug}`}
                className="group/row grid grid-cols-[20px_32px_minmax(0,1fr)_auto] items-center gap-3 rounded-[12px] px-2 py-2 transition-colors hover:bg-bone"
              >
                <span className="text-center font-heading text-[13px] font-bold text-muted-foreground tabular">{i + 1}</span>
                <SoftwareLogo name={r.name} logo={r.logo} brandColor={r.brandColor} size="sm" />
                <span className="min-w-0">
                  <span className="block truncate text-[14.5px] font-semibold leading-tight text-ink">{r.name}</span>
                  <span className="mt-1.5 block h-1.5 overflow-hidden rounded-full bg-bone group-hover/row:bg-border">
                    <span
                      className={cn("block h-full rounded-full transition-[width] duration-500 ease-out", i === 0 ? "bg-yellow" : "bg-ink/25")}
                      style={{ width: `${Math.max(6, (r.monthly / max) * 100)}%` }}
                    />
                  </span>
                </span>
                <span className="font-heading text-[16px] font-bold text-ink tabular">
                  {r.monthly === 0 ? "Free" : formatRand(r.monthly, { whole: true })}
                </span>
              </Link>
            </li>
          ))}
        </ol>

        <Link
          href={`/category/${board.slug}`}
          className="group/all mt-3 flex items-center justify-between rounded-[12px] border-t border-border px-2 pt-3 text-[13.5px] font-medium text-ink"
        >
          <span>
            See all {board.total} {board.name} products
          </span>
          <ArrowRight size={16} className="transition-transform group-hover/all:translate-x-0.5" aria-hidden="true" />
        </Link>
      </div>
    </div>
  );
}
