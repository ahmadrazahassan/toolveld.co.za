"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useTransition } from "react";
import { SlidersHorizontal } from "lucide-react";
import { Dialog, DialogTrigger } from "@/components/ui/overlays";
import { SheetContent } from "@/components/ui/overlays";
import { cn } from "@/lib/utils";

export interface FilterOptions {
  categories: { slug: string; name: string; count: number }[];
  sizes: { value: string; label: string }[];
  sorts: { value: string; label: string }[];
}

const RATINGS = [
  { value: "", label: "Any" },
  { value: "4.5", label: "4.5 and up" },
  { value: "4", label: "4.0 and up" },
  { value: "3.5", label: "3.5 and up" },
];
const PRICING = [
  { value: "", label: "Any" },
  { value: "free", label: "Free version" },
  { value: "trial", label: "Free trial" },
  { value: "paid", label: "Paid only" },
];

function useQueryUpdater() {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const [pending, start] = useTransition();
  const set = (key: string, value: string) => {
    const next = new URLSearchParams(params.toString());
    if (value) next.set(key, value);
    else next.delete(key);
    start(() => router.push(`${pathname}${next.size ? `?${next.toString()}` : ""}`, { scroll: false }));
  };
  return { params, set, pending };
}

function RadioGroup({
  legend,
  name,
  options,
  value,
  onChange,
}: {
  legend: string;
  name: string;
  options: { value: string; label: string; count?: number }[];
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <fieldset>
      <legend className="eyebrow mb-3 text-muted-foreground">{legend}</legend>
      <div className="space-y-1">
        {options.map((o) => {
          const checked = value === o.value;
          return (
            <label
              key={o.value || "all"}
              className={cn(
                "flex cursor-pointer items-center justify-between rounded-full px-3.5 py-2 text-[14.5px] transition has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-ink",
                checked ? "bg-ink text-white" : "text-ink hover:bg-bone",
              )}
            >
              <span className="flex items-center gap-2">
                <input type="radio" name={name} value={o.value} checked={checked} onChange={() => onChange(o.value)} className="sr-only" />
                {o.label}
              </span>
              {o.count !== undefined && <span className={cn("text-[12.5px] tabular", checked ? "text-white/70" : "text-muted-foreground")}>{o.count}</span>}
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}

function FilterFields({ options }: { options: FilterOptions }) {
  const { params, set } = useQueryUpdater();
  const total = options.categories.reduce((n, c) => n + c.count, 0);
  return (
    <div className="space-y-8">
      <RadioGroup
        legend="Category"
        name="category"
        value={params.get("category") ?? ""}
        onChange={(v) => set("category", v)}
        options={[{ value: "", label: "All categories", count: total }, ...options.categories.map((c) => ({ value: c.slug, label: c.name, count: c.count }))]}
      />
      <RadioGroup legend="Minimum rating" name="rating" value={params.get("rating") ?? ""} onChange={(v) => set("rating", v)} options={RATINGS} />
      <RadioGroup legend="Pricing" name="pricing" value={params.get("pricing") ?? ""} onChange={(v) => set("pricing", v)} options={PRICING} />
      <RadioGroup
        legend="Best for"
        name="size"
        value={params.get("size") ?? ""}
        onChange={(v) => set("size", v)}
        options={[{ value: "", label: "Any size" }, ...options.sizes]}
      />
    </div>
  );
}

export function DirectorySidebar({ options }: { options: FilterOptions }) {
  return (
    <aside aria-label="Filters" className="sticky top-28 hidden self-start lg:block">
      <FilterFields options={options} />
    </aside>
  );
}

export function DirectoryToolbar({ options, count }: { options: FilterOptions; count: number }) {
  const { params, set, pending } = useQueryUpdater();
  return (
    <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
      <p className="text-[15px] text-muted-foreground" aria-live="polite">
        <span className="font-heading text-[18px] font-bold text-ink tabular">{count}</span> {count === 1 ? "product" : "products"}
        {pending && <span className="ml-2">Updating</span>}
      </p>
      <div className="flex items-center gap-2">
        <Dialog>
          <DialogTrigger className="inline-flex h-11 items-center gap-2 rounded-full bg-card px-4 text-[14.5px] font-medium ring-1 ring-inset ring-border-strong lg:hidden">
            <SlidersHorizontal size={16} aria-hidden="true" /> Filters
          </DialogTrigger>
          <SheetContent title="Filters">
            <FilterFields options={options} />
          </SheetContent>
        </Dialog>
        <label htmlFor="sort" className="sr-only">
          Sort by
        </label>
        <div className="relative">
          <select
            id="sort"
            value={params.get("sort") ?? options.sorts[0]?.value ?? "name"}
            onChange={(e) => set("sort", e.target.value === options.sorts[0]?.value ? "" : e.target.value)}
            className="h-11 appearance-none rounded-full bg-card pl-4 pr-10 text-[14.5px] font-medium ring-1 ring-inset ring-border-strong focus-visible:outline-2 focus-visible:outline-ink"
          >
            {options.sorts.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
          <svg className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2" width="12" height="12" viewBox="0 0 12 12" aria-hidden="true">
            <path d="M2 4.5l4 4 4-4" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
          </svg>
        </div>
      </div>
    </div>
  );
}
