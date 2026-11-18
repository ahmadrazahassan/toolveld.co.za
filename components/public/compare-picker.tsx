"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Command } from "cmdk";
import { Popover } from "radix-ui";
import { ChevronDown } from "lucide-react";
import { CtaButton } from "@/components/ui/button";
import { SoftwareLogo } from "@/components/public/software-logo";
import { cn } from "@/lib/utils";
import { canonicalPairSlug } from "@/lib/compare-slug";

export interface PickerOption {
  slug: string;
  name: string;
  logo: string | null;
  category: string;
}

function Combobox({
  label,
  value,
  onChange,
  options,
  exclude,
}: {
  label: string;
  value: string;
  onChange: (slug: string) => void;
  options: PickerOption[];
  exclude?: string;
}) {
  const [open, setOpen] = useState(false);
  const selected = options.find((o) => o.slug === value);
  return (
    <div className="min-w-0 flex-1">
      <p className="mb-1.5 text-[14px] font-medium">{label}</p>
      <Popover.Root open={open} onOpenChange={setOpen}>
        <Popover.Trigger
          className="flex h-14 w-full items-center gap-3 rounded-[16px] border border-input bg-card px-3 text-left text-[15px] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
          aria-label={selected ? `${label}: ${selected.name}` : label}
        >
          {selected ? (
            <>
              <SoftwareLogo name={selected.name} logo={selected.logo} brandColor={null} size="sm" />
              <span className="min-w-0 flex-1 truncate font-medium">{selected.name}</span>
            </>
          ) : (
            <span className="flex-1 pl-1 text-muted-foreground">Choose a product</span>
          )}
          <ChevronDown size={16} aria-hidden="true" />
        </Popover.Trigger>
        <Popover.Portal>
          <Popover.Content
            align="start"
            sideOffset={6}
            className="z-[70] w-[var(--radix-popover-trigger-width)] min-w-[280px] overflow-hidden rounded-[18px] bg-card shadow-[0_24px_48px_-20px_rgba(19,19,21,.35)] ring-1 ring-border"
          >
            <Command label={label}>
              <Command.Input
                autoFocus
                placeholder="Search products"
                className="h-12 w-full border-b border-border bg-transparent px-4 text-[15px] outline-none"
              />
              <Command.List className="max-h-72 overflow-y-auto p-1.5">
                <Command.Empty className="px-3 py-6 text-center text-[14px] text-muted-foreground">No product by that name.</Command.Empty>
                {options
                  .filter((o) => o.slug !== exclude)
                  .map((o) => (
                    <Command.Item
                      key={o.slug}
                      value={`${o.name} ${o.category}`}
                      onSelect={() => {
                        onChange(o.slug);
                        setOpen(false);
                      }}
                      className={cn(
                        "flex cursor-pointer items-center gap-3 rounded-[12px] px-2.5 py-2 data-[selected=true]:bg-bone",
                        o.slug === value && "font-semibold",
                      )}
                    >
                      <SoftwareLogo name={o.name} logo={o.logo} brandColor={null} size="sm" />
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-[14.5px]">{o.name}</span>
                        <span className="block text-[12.5px] text-muted-foreground">{o.category}</span>
                      </span>
                    </Command.Item>
                  ))}
              </Command.List>
            </Command>
          </Popover.Content>
        </Popover.Portal>
      </Popover.Root>
    </div>
  );
}

export function ComparePicker({ options }: { options: PickerOption[] }) {
  const router = useRouter();
  const [a, setA] = useState("");
  const [b, setB] = useState("");
  const ready = a && b && a !== b;
  return (
    <div className="card-modern p-5 md:p-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-end">
        <Combobox label="First product" value={a} onChange={setA} options={options} exclude={b} />
        <span className="hidden pb-4 font-heading text-[15px] font-bold text-muted-foreground md:block" aria-hidden="true">
          vs
        </span>
        <Combobox label="Second product" value={b} onChange={setB} options={options} exclude={a} />
        <CtaButton
          size="lg"
          disabled={!ready}
          onClick={() => ready && router.push(`/compare/${canonicalPairSlug(a, b)}`)}
          className="md:mb-0"
        >
          Compare
        </CtaButton>
      </div>
    </div>
  );
}
