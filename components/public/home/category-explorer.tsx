"use client";

import { Tabs } from "radix-ui";
import { CategoryIcon } from "@/components/public/category-icon";
import { ProductCard } from "@/components/public/product-card";
import { CtaButton } from "@/components/ui/button";
import type { IconName, SoftwareSummary } from "@/lib/types";

export interface ExplorerGroup {
  slug: string;
  name: string;
  icon: IconName;
  count: number;
  products: SoftwareSummary[];
}

/** Client side tabs. Every group ships with the page, so switching never navigates. */
export function CategoryExplorer({ groups }: { groups: ExplorerGroup[] }) {
  return (
    <Tabs.Root defaultValue={groups[0]?.slug}>
      <Tabs.List
        aria-label="Categories"
        className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-2 sm:mx-0 sm:flex-wrap sm:justify-center sm:overflow-visible sm:px-0"
      >
        {groups.map((g) => (
          <Tabs.Trigger
            key={g.slug}
            value={g.slug}
            className="inline-flex h-11 shrink-0 items-center gap-2 rounded-full bg-card px-4 text-[14.5px] font-medium text-ink ring-1 ring-inset ring-border-strong transition-colors hover:bg-bone data-[state=active]:bg-ink data-[state=active]:text-white data-[state=active]:ring-ink"
          >
            <CategoryIcon name={g.icon} size={16} />
            {g.name}
          </Tabs.Trigger>
        ))}
      </Tabs.List>
      {groups.map((g) => (
        <Tabs.Content key={g.slug} value={g.slug} className="mt-8 focus-visible:outline-none">
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {g.products.map((s) => (
              <li key={s.slug}>
                <ProductCard software={s} placement="home-explorer" />
              </li>
            ))}
          </ul>
          <div className="mt-8 flex justify-center">
            <CtaButton href={`/category/${g.slug}`} variant="soft">
              {`All ${g.count} in ${g.name}`}
            </CtaButton>
          </div>
        </Tabs.Content>
      ))}
    </Tabs.Root>
  );
}
