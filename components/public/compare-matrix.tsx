import Link from "next/link";
import { Check, Minus, Plus } from "lucide-react";
import { SoftwareLogo } from "@/components/public/software-logo";
import { RatingOrEmpty } from "@/components/public/rating";
import { PriceTag } from "@/components/public/price";
import { ComplianceMark, statusText } from "@/components/public/compliance-list";
import { PriceCheckedStamp } from "@/components/ui/badge";
import { Stars } from "@/components/ui/misc";
import { softwarePriceParts } from "@/lib/format";
import { hasPublicRating, RATING_DIMENSIONS } from "@/lib/reviews-policy";
import { COMPLIANCE_CHECKLIST } from "@/lib/site";
import type { ComplianceKey, Software } from "@/lib/types";
import { featureRows } from "@/lib/features";
import { cn } from "@/lib/utils";

function Grid({ cols, children }: { cols: number; children: React.ReactNode }) {
  // Two products fit on a phone; three or four scroll sideways with the first column pinned.
  const narrow = cols <= 2;
  return (
    <div className="overflow-x-auto rounded-[24px] border border-border bg-card">
      <div
        className={cn("grid gap-px bg-border text-[14px] sm:text-[14.5px] [&>div]:p-3 sm:[&>div]:p-4", !narrow && "min-w-[560px]")}
        style={{
          gridTemplateColumns: narrow
            ? `minmax(96px,0.8fr) repeat(${cols}, minmax(0,1fr))`
            : `minmax(140px,1.1fr) repeat(${cols}, minmax(150px,1fr))`,
        }}
      >
        {children}
      </div>
    </div>
  );
}

function HeadRow({ products }: { products: Software[] }) {
  return (
    <>
      <div className="sticky left-0 top-0 z-[2] bg-bone p-4" />
      {products.map((p) => (
        <div key={p.slug} className="sticky top-0 z-[1] flex min-w-0 flex-col items-start gap-2 bg-bone p-4 sm:flex-row sm:items-center sm:gap-2.5">
          <SoftwareLogo name={p.name} logo={p.logo} brandColor={p.brand_color} size="sm" />
          <Link href={`/software/${p.slug}`} className="min-w-0 break-words font-heading font-bold leading-tight hover:underline">
            {p.name}
          </Link>
        </div>
      ))}
    </>
  );
}

function Row({ label, cells }: { label: React.ReactNode; cells: React.ReactNode[] }) {
  return (
    <>
      <div className="sticky left-0 z-[1] bg-card p-4 text-muted-foreground">{label}</div>
      {cells.map((c, i) => (
        <div key={i} className="bg-card p-4">
          {c}
        </div>
      ))}
    </>
  );
}

export function RatingsMatrix({ products }: { products: Software[] }) {
  const allRated = products.every(hasPublicRating);
  return (
    <Grid cols={products.length}>
      <HeadRow products={products} />
      <Row label="Overall" cells={products.map((p) => <RatingOrEmpty key={p.slug} software={p} size={13} />)} />
      {allRated &&
        RATING_DIMENSIONS.map((d) => (
          <Row key={d.key} label={d.label} cells={products.map((p) => <Stars key={p.slug} value={p[d.key] ?? 0} size={12} />)} />
        ))}
    </Grid>
  );
}

export function ComplianceMatrix({ products, focus }: { products: Software[]; focus: ComplianceKey[] }) {
  const items = COMPLIANCE_CHECKLIST.filter((c) => focus.includes(c.key));
  return (
    <Grid cols={products.length}>
      <HeadRow products={products} />
      {items.map((c) => (
        <Row
          key={c.key}
          label={c.label}
          cells={products.map((p) => {
            const st = p.compliance[c.key]?.status;
            return (
              <span key={p.slug} className="inline-flex items-center gap-2">
                <ComplianceMark status={st} />
                <span className={st === "covered" ? "text-ink" : "text-muted-foreground"}>{statusText(st)}</span>
              </span>
            );
          })}
        />
      ))}
    </Grid>
  );
}

export function PricingMatrix({ products }: { products: Software[] }) {
  return (
    <Grid cols={products.length}>
      <HeadRow products={products} />
      <Row label="Starting price" cells={products.map((p) => <PriceTag key={p.slug} parts={softwarePriceParts(p)} />)} />
      <Row label="Price checked" cells={products.map((p) => <PriceCheckedStamp key={p.slug} date={p.price_checked_at} compact />)} />
      <Row label="Free trial" cells={products.map((p) => (p.free_trial ? `Yes${p.free_trial_days ? `, ${p.free_trial_days} days` : ""}` : "No"))} />
      <Row label="Free version" cells={products.map((p) => (p.free_version ? "Yes" : "No"))} />
      <Row label="Plans listed" cells={products.map((p) => (p.pricing_plans.length ? String(p.pricing_plans.length) : "Quoted"))} />
      <Row label="Runs as" cells={products.map((p) => (p.deployment === "cloud" ? "Cloud" : p.deployment === "desktop" ? "Desktop" : "Cloud or on premises"))} />
    </Grid>
  );
}

export function FeatureMatrix({ products }: { products: Software[] }) {
  // Features are grouped so the same capability under two names lands on one row.
  const rows = featureRows(products);
  return (
    <div className="max-h-[640px] overflow-auto rounded-[24px] border border-border bg-card">
      <div
        className={cn("grid gap-px bg-border text-[14px] sm:text-[14.5px] [&>div]:p-3 sm:[&>div]:p-4", products.length > 2 && "min-w-[560px]")}
        style={{
          gridTemplateColumns:
            products.length > 2
              ? `minmax(170px,1.2fr) repeat(${products.length}, minmax(130px,1fr))`
              : `minmax(110px,1fr) repeat(${products.length}, minmax(0,1fr))`,
        }}
      >
        <HeadRow products={products} />
        {rows.map((r) => (
          <Row
            key={r.label}
            label={<span className="text-ink">{r.label}</span>}
            cells={r.statuses.map((st, i) =>
              st === "included" ? (
                <span key={products[i].slug} className="inline-flex items-center gap-1.5 font-medium text-ink">
                  <span className="inline-flex size-5 items-center justify-center rounded-full bg-ink text-white" aria-hidden="true">
                    <Check size={12} strokeWidth={3} />
                  </span>
                  Has it
                </span>
              ) : st === "addon" ? (
                <span key={products[i].slug} className="inline-flex items-center gap-1.5 font-medium text-ink">
                  <span className="inline-flex size-5 items-center justify-center rounded-full bg-yellow text-ink" aria-hidden="true">
                    <Plus size={12} strokeWidth={3} />
                  </span>
                  Paid add on
                </span>
              ) : (
                <span key={products[i].slug} className="inline-flex items-center gap-1.5 text-muted-foreground">
                  <Minus size={14} aria-hidden="true" /> Not listed
                </span>
              ),
            )}
          />
        ))}
      </div>
    </div>
  );
}
