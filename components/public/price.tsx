import { softwarePriceParts, type PriceParts } from "@/lib/format";
import type { SoftwareSummary } from "@/lib/types";
import { cn } from "@/lib/utils";

/** Starting price in Pally with the period and VAT basis beside it. */
export function PriceTag({ parts, className, large = false }: { parts: PriceParts; className?: string; large?: boolean }) {
  return (
    <span className={cn("inline-flex flex-wrap items-baseline gap-x-1.5 gap-y-0.5", className)}>
      <span className={cn("font-heading font-bold tracking-[-0.01em] text-ink tabular", large ? "text-[28px]" : "text-[18px]")}>
        {parts.amount}
      </span>
      {parts.period && <span className="text-[13px] font-medium text-ink">{parts.period}</span>}
      {parts.basis && <span className="text-[13px] text-muted-foreground">{parts.basis}</span>}
      {parts.estimate && <span className="text-[13px] text-muted-foreground">({parts.estimate})</span>}
    </span>
  );
}

export function SoftwarePrice({ software, label = true, className }: { software: SoftwareSummary; label?: boolean; className?: string }) {
  const parts = softwarePriceParts(software);
  return (
    <div className={className}>
      {label && (
        <p className="mb-0.5 text-[12px] text-muted-foreground">
          {parts.kind === "price" ? "From" : parts.kind === "free" ? "Starting price" : "Price"}
        </p>
      )}
      <PriceTag parts={parts} />
    </div>
  );
}
