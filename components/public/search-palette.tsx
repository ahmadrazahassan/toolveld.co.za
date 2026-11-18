"use client";

import { Command } from "cmdk";
import { useRouter } from "next/navigation";
import { ArrowRight, BookOpen, LayoutGrid, Scale, Search } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/overlays";
import { SoftwareLogo } from "@/components/public/software-logo";
import type { SearchItem } from "@/lib/types";

const GROUPS: { type: SearchItem["type"]; heading: string }[] = [
  { type: "software", heading: "Software" },
  { type: "category", heading: "Categories" },
  { type: "comparison", heading: "Comparisons" },
  { type: "guide", heading: "Guides" },
];

function ItemIcon({ item }: { item: SearchItem }) {
  if (item.type === "software") return <SoftwareLogo name={item.title} logo={item.logo ?? null} brandColor={null} size="sm" />;
  const Icon = item.type === "category" ? LayoutGrid : item.type === "comparison" ? Scale : BookOpen;
  return (
    <span className="inline-flex size-9 items-center justify-center rounded-[10px] bg-bone" aria-hidden="true">
      <Icon size={16} />
    </span>
  );
}

export function SearchPalette({
  open,
  onOpenChange,
  index,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  index: SearchItem[];
}) {
  const router = useRouter();
  const go = (href: string) => {
    onOpenChange(false);
    router.push(href);
  };
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent title="Search" hideTitle className="top-[8vh] max-w-2xl p-0">
        <Command label="Search software, categories, comparisons and guides" className="flex max-h-[70vh] flex-col">
          <div className="flex items-center gap-3 border-b border-border px-5">
            <Search size={18} className="shrink-0 text-muted-foreground" aria-hidden="true" />
            <Command.Input
              autoFocus
              placeholder="Search software, categories, guides"
              className="h-16 w-full bg-transparent pr-10 text-[16px] text-ink outline-none placeholder:text-muted-foreground"
            />
          </div>
          <Command.List className="overflow-y-auto overscroll-contain p-2">
            <Command.Empty className="px-4 py-10 text-center text-[15px] text-muted-foreground">
              Nothing matches that yet. Try a product name or a category.
            </Command.Empty>
            {GROUPS.map((g) => {
              const items = index.filter((i) => i.type === g.type);
              if (!items.length) return null;
              return (
                <Command.Group
                  key={g.type}
                  heading={g.heading}
                  className="[&_[cmdk-group-heading]]:text-[11px] [&_[cmdk-group-heading]]:font-bold [&_[cmdk-group-heading]]:uppercase [&_[cmdk-group-heading]]:tracking-[0.14em] [&_[cmdk-group-heading]]:px-3 [&_[cmdk-group-heading]]:pb-2 [&_[cmdk-group-heading]]:pt-4 [&_[cmdk-group-heading]]:text-muted-foreground"
                >
                  {items.map((item) => (
                    <Command.Item
                      key={item.href}
                      value={`${item.title} ${item.subtitle} ${item.keywords ?? ""}`}
                      onSelect={() => go(item.href)}
                      className="flex cursor-pointer items-center gap-3 rounded-[14px] px-3 py-2.5 data-[selected=true]:bg-bone"
                    >
                      <ItemIcon item={item} />
                      <span className="min-w-0 flex-1">
                        <span className="block truncate font-medium text-ink">{item.title}</span>
                        <span className="block truncate text-[13px] text-muted-foreground">{item.subtitle}</span>
                      </span>
                      <ArrowRight size={15} className="shrink-0 text-muted-foreground" aria-hidden="true" />
                    </Command.Item>
                  ))}
                </Command.Group>
              );
            })}
          </Command.List>
          <div className="flex items-center justify-between border-t border-border px-5 py-3 text-[12.5px] text-muted-foreground">
            <span>Enter to open, Esc to close</span>
            <button type="button" className="underline underline-offset-2 hover:text-ink" onClick={() => go("/search")}>
              Full search page
            </button>
          </div>
        </Command>
      </DialogContent>
    </Dialog>
  );
}
