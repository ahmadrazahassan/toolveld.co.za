"use client";

import { useEffect, useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

export interface NavSection {
  id: string;
  label: string;
}

/** Scroll spy. A sticky left rail from 1024px and a collapsible sticky bar below that. */
export function SectionNav({ sections }: { sections: NavSection[] }) {
  const [active, setActive] = useState(sections[0]?.id ?? "");
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const els = sections.map((s) => document.getElementById(s.id)).filter((e): e is HTMLElement => Boolean(e));
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: "-25% 0px -65% 0px", threshold: 0 },
    );
    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [sections]);

  const current = sections.find((s) => s.id === active) ?? sections[0];

  return (
    <>
      {/* Mobile: collapsible sticky bar */}
      <div className="sticky top-3 z-30 lg:hidden">
        <div className="rounded-[22px] bg-card/95 shadow-[0_12px_32px_-18px_rgba(19,19,21,.35)] ring-1 ring-inset ring-border backdrop-blur-xl">
          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            aria-expanded={open}
            aria-controls="section-nav-list"
            className="flex h-12 w-full items-center justify-between px-5 text-[15px] font-medium"
          >
            <span>
              <span className="text-muted-foreground">On this page: </span>
              {current?.label}
            </span>
            <ChevronDown size={16} className={cn("transition-transform", open && "rotate-180")} aria-hidden="true" />
          </button>
          {open && (
            <ul id="section-nav-list" className="border-t border-border p-2">
              {sections.map((s) => (
                <li key={s.id}>
                  <a
                    href={`#${s.id}`}
                    onClick={() => setOpen(false)}
                    className={cn("block rounded-full px-4 py-2.5 text-[15px]", s.id === active ? "bg-ink text-white" : "text-ink hover:bg-bone")}
                  >
                    {s.label}
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Desktop: sticky rail */}
      <nav aria-label="Sections" className="sticky top-28 hidden self-start lg:block">
        <p className="eyebrow mb-4 text-muted-foreground">On this page</p>
        <ul className="space-y-1 border-l border-border-strong">
          {sections.map((s) => (
            <li key={s.id}>
              <a
                href={`#${s.id}`}
                aria-current={s.id === active ? "location" : undefined}
                className={cn(
                  "-ml-px block border-l-2 py-1.5 pl-4 text-[14.5px] transition-colors",
                  s.id === active ? "border-ink font-semibold text-ink" : "border-transparent text-muted-foreground hover:text-ink",
                )}
              >
                {s.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </>
  );
}
