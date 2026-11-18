import Image from "next/image";
import { Check, History } from "lucide-react";
import { PriceTag } from "@/components/public/price";
import { PriceCheckedStamp } from "@/components/ui/badge";
import { Table, Td, Th } from "@/components/ui/table";
import { integrationLogo } from "@/lib/assets";
import { BILLED_LABEL, formatDate, formatMoney, formatRand, planPriceParts, vatBasis } from "@/lib/format";
import type { Software } from "@/lib/types";
import { cn } from "@/lib/utils";

export function ProfileSection({
  id,
  title,
  children,
  className,
}: {
  id: string;
  title: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section id={id} aria-labelledby={`${id}-title`} className={cn("border-t border-border-strong pt-10", className)}>
      <h2 id={`${id}-title`} className="font-heading text-[28px] font-bold leading-tight tracking-[-0.02em] md:text-[32px]">
        {title}
      </h2>
      <div className="mt-6">{children}</div>
    </section>
  );
}

export function SpecSheet({ software, showBankFeeds }: { software: Software; showBankFeeds: boolean }) {
  const v = software.vendor;
  const rows: [string, string][] = [
    ["Vendor", v.company],
    ...(v.founded ? ([["Founded", String(v.founded)]] as [string, string][]) : []),
    ...(v.headquarters ? ([["Headquarters", v.headquarters]] as [string, string][]) : []),
    ...(v.local_presence ? ([["In South Africa", v.local_presence]] as [string, string][]) : []),
    ["Runs as", software.deployment === "cloud" ? "Cloud" : software.deployment === "desktop" ? "Desktop" : "Cloud or on premises"],
    ["Support", v.support.join(", ")],
    ["Languages", v.languages.join(", ")],
    ["Countries", v.countries.join(", ")],
    ...(showBankFeeds
      ? ([["Bank feeds", software.bank_feeds.length ? software.bank_feeds.join(", ") : "Not confirmed. Statement import available."]] as [string, string][])
      : []),
  ];
  return (
    <dl className="divide-y divide-border rounded-[20px] border border-border bg-card">
      {rows.map(([k, val]) => (
        <div key={k} className="grid gap-1 px-4 py-3 sm:grid-cols-[160px_1fr] sm:gap-4">
          <dt className="text-[13.5px] text-muted-foreground">{k}</dt>
          <dd className="text-[15px] text-ink">{val}</dd>
        </div>
      ))}
    </dl>
  );
}

export function PlanCards({ software }: { software: Software }) {
  if (!software.pricing_plans.length) return null;
  return (
    <ul className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
      {software.pricing_plans.map((p) => (
        <li
          key={p.name}
          className={cn("relative flex flex-col rounded-[24px] border bg-card p-5", p.popular ? "border-ink shadow-[0_0_0_1px_var(--ink)]" : "border-border")}
        >
          {p.popular && (
            <span className="absolute -top-3 left-5 inline-flex h-6 items-center rounded-full bg-ink px-2.5 text-[11px] font-semibold uppercase tracking-[0.08em] text-white">
              Most popular
            </span>
          )}
          <p className="font-heading text-[17px] font-bold">{p.name}</p>
          <PriceTag parts={planPriceParts(p, software.pricing_model)} className="mt-2" />
          {p.annual_price ? (
            <p className="mt-1 text-[13px] text-muted-foreground">or {formatRand(p.annual_price)} a year</p>
          ) : null}
          {p.users && <p className="mt-1.5 text-[13.5px] text-muted-foreground">{p.users}</p>}
          <ul className="mt-4 space-y-2 border-t border-border pt-4">
            {p.features.map((f) => (
              <li key={f} className="flex items-start gap-2 text-[14px] leading-snug">
                <Check size={15} className="mt-0.5 shrink-0" aria-hidden="true" />
                {f}
              </li>
            ))}
          </ul>
          {p.note && <p className="mt-4 rounded-[12px] bg-bone px-3 py-2 text-[12.5px] leading-snug text-muted-foreground">{p.note}</p>}
        </li>
      ))}
    </ul>
  );
}

export function PricingTable({ software }: { software: Software }) {
  if (!software.pricing_plans.length) return null;
  return (
    <Table stickyFirst>
      <thead>
        <tr>
          <Th>Plan</Th>
          <Th>Price</Th>
          <Th>Billed</Th>
          <Th>VAT</Th>
          <Th>Users</Th>
        </tr>
      </thead>
      <tbody>
        {software.pricing_plans.map((p) => {
          const parts = planPriceParts(p, software.pricing_model);
          return (
            <tr key={p.name}>
              <Td className="font-semibold">{p.name}</Td>
              <Td className="font-semibold tabular">
                {parts.amount}
                {parts.estimate && <span className="block text-[12.5px] font-normal text-muted-foreground">{parts.estimate}</span>}
              </Td>
              <Td className="text-muted-foreground">{parts.kind === "price" ? BILLED_LABEL[p.period] : "n/a"}</Td>
              <Td className="text-muted-foreground">{parts.kind === "price" ? vatBasis(p.vat_inclusive, p.vat_unknown) : "n/a"}</Td>
              <Td className="text-muted-foreground">{p.users ?? "Not stated"}</Td>
            </tr>
          );
        })}
      </tbody>
    </Table>
  );
}

export function PriceHistory({ software }: { software: Software }) {
  return (
    <div className="rounded-[20px] border border-border bg-card p-5">
      <p className="flex items-center gap-2 font-heading text-[16px] font-bold">
        <History size={16} aria-hidden="true" /> Price history
      </p>
      {software.price_history.length === 0 ? (
        <p className="mt-2 text-[14px] text-muted-foreground">
          No checked prices yet. Each check we make is recorded here with its date.
        </p>
      ) : (
        <ol className="mt-4 space-y-4 border-l border-border-strong pl-5">
          {software.price_history.map((p, i) => (
            <li key={`${p.date}-${i}`} className="relative">
              <span className="absolute -left-[26px] top-1.5 size-2.5 rounded-full bg-ink ring-4 ring-card" aria-hidden="true" />
              <p className="text-[13px] text-muted-foreground">{formatDate(p.date)}</p>
              <p className="text-[15px] font-semibold tabular">
                {p.price === null ? "Quoted" : p.price === 0 ? "Free" : `${formatMoney(p.price, p.currency)} ${vatBasis(p.vat_inclusive)}`}
              </p>
              {p.note && <p className="text-[13.5px] text-muted-foreground">{p.note}</p>}
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}

export function PriceStampRow({ software }: { software: Software }) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <PriceCheckedStamp date={software.price_checked_at} />
      <a href={software.website} rel="nofollow noopener" target="_blank" className="text-[13.5px] text-muted-foreground underline underline-offset-2 hover:text-ink">
        Vendor pricing page
      </a>
    </div>
  );
}

export function Integrations({ names }: { names: string[] }) {
  if (!names.length) return <p className="text-[15px] text-muted-foreground">We have not confirmed integrations for this product yet.</p>;
  return (
    <ul className="flex flex-wrap gap-2">
      {names.map((n) => {
        const logo = integrationLogo(n);
        return (
          <li key={n} className="inline-flex h-10 items-center gap-2 rounded-full bg-card pl-2 pr-4 text-[14px] ring-1 ring-inset ring-border">
            {logo ? (
              <Image src={logo} alt="" width={22} height={22} className="size-[22px] rounded-md object-contain" unoptimized />
            ) : (
              <span className="inline-flex size-[22px] items-center justify-center rounded-md bg-bone font-heading text-[11px] font-bold" aria-hidden="true">
                {n.charAt(0)}
              </span>
            )}
            {n}
          </li>
        );
      })}
    </ul>
  );
}
