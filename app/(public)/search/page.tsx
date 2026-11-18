import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Search } from "lucide-react";
import { SectionHeader } from "@/components/public/section-heading";
import { SoftwareLogo } from "@/components/public/software-logo";
import { searchSite } from "@/lib/queries/search";
import { buildMetadata } from "@/lib/seo";
import type { SearchItem } from "@/lib/types";

export const metadata: Metadata = buildMetadata({ title: "Search", path: "/search", noindex: true });

const GROUPS: { type: SearchItem["type"]; label: string }[] = [
  { type: "software", label: "Software" },
  { type: "category", label: "Categories" },
  { type: "comparison", label: "Comparisons" },
  { type: "guide", label: "Guides" },
];

export default async function SearchPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const { q = "" } = await searchParams;
  const query = q.trim().slice(0, 100);
  const results = query ? await searchSite(query) : [];
  return (
    <div className="container-site">
      <SectionHeader
        icon={<Search size={14} />}
        eyebrow="Search"
        title={query ? `Results for “${query}”` : "Search the register"}
        subtitle={query ? `${results.length} ${results.length === 1 ? "result" : "results"}` : "Products, categories, comparisons and guides."}
      />
      <form action="/search" role="search" className="relative mx-auto max-w-[576px]">
        <label htmlFor="q" className="sr-only">
          Search
        </label>
        <Search size={20} className="pointer-events-none absolute left-5 top-1/2 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
        <input
          id="q"
          name="q"
          type="search"
          defaultValue={query}
          placeholder="Search Xero, payroll, VAT201..."
          className="h-16 w-full rounded-[18px] border border-input bg-card pl-14 pr-32 text-[16px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink"
        />
        <button type="submit" className="btn-gloss gloss-ink btn-label absolute right-2 top-1/2 h-12 -translate-y-1/2 rounded-[11px] px-5 text-[12px]">
          Search
        </button>
      </form>

      <div className="mx-auto mt-12 max-w-3xl space-y-10">
        {query && results.length === 0 && (
          <p className="text-center text-[16px] text-muted-foreground">
            Nothing matches that. Try a product name, a category such as payroll, or a rule such as VAT201.
          </p>
        )}
        {GROUPS.map((g) => {
          const items = results.filter((r) => r.type === g.type);
          if (!items.length) return null;
          return (
            <section key={g.type} aria-labelledby={`g-${g.type}`}>
              <h2 id={`g-${g.type}`} className="eyebrow mb-3 text-muted-foreground">
                {g.label} ({items.length})
              </h2>
              <ul className="divide-y divide-border overflow-hidden rounded-[20px] border border-border bg-card">
                {items.map((r) => (
                  <li key={r.href}>
                    <Link href={r.href} className="flex items-center gap-4 px-4 py-3.5 hover:bg-bone">
                      {r.type === "software" && <SoftwareLogo name={r.title} logo={r.logo ?? null} brandColor={null} size="sm" />}
                      <span className="min-w-0 flex-1">
                        <span className="block font-medium">{r.title}</span>
                        <span className="block truncate text-[13.5px] text-muted-foreground">{r.subtitle}</span>
                      </span>
                      <ArrowRight size={16} className="text-muted-foreground" aria-hidden="true" />
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          );
        })}
      </div>
    </div>
  );
}
