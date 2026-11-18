import { BadgeCheck } from "lucide-react";
import type { ReactNode } from "react";
import { formatDate } from "@/lib/format";
import { cn } from "@/lib/utils";

/** Bone pill with ink text. Pass onPage when it sits directly on the page background. */
export function Badge({
  children,
  onPage = false,
  className,
}: {
  children: ReactNode;
  onPage?: boolean;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full bg-bone px-2.5 py-1 text-[12px] font-medium leading-none text-ink",
        onPage && "ring-1 ring-inset ring-border-strong",
        className,
      )}
    >
      {children}
    </span>
  );
}

/** Tiny ink pill with yellow "Ad" text. Every affiliate link shows it. */
export function AdLabel({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex h-[18px] items-center rounded-full bg-ink px-1.5 font-heading text-[10px] font-bold uppercase leading-none tracking-[0.08em] text-yellow",
        className,
      )}
    >
      Ad
    </span>
  );
}

/** Yellow means a person checked the vendor's price on this date. */
export function PriceCheckedStamp({ date, className, compact = false }: { date: string | null; className?: string; compact?: boolean }) {
  if (!date) {
    return (
      <span
        className={cn(
          "inline-flex items-center gap-1.5 rounded-full bg-bone px-2.5 py-1 text-[12px] font-medium leading-none text-muted-foreground ring-1 ring-inset ring-border-strong",
          className,
        )}
      >
        {compact ? "Not yet checked" : "Price not yet checked"}
      </span>
    );
  }
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 whitespace-nowrap rounded-full bg-yellow px-2.5 py-1 text-[12px] font-semibold leading-none text-ink",
        className,
      )}
    >
      <BadgeCheck size={14} strokeWidth={2.2} aria-hidden="true" />
      {compact ? formatDate(date) : `Price checked ${formatDate(date)}`}
    </span>
  );
}

export function FeaturedBadge() {
  return (
    <span className="inline-flex items-center rounded-full bg-ink px-2.5 py-1 text-[11px] font-semibold uppercase leading-none tracking-[0.08em] text-white">
      Featured
    </span>
  );
}
