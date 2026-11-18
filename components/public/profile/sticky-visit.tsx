"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

/**
 * Phones and tablets only. Slides up from the bottom once the profile header has scrolled
 * out of view, and hides again over the site footer so it never covers the legal links.
 */
export function StickyVisitBar({
  watchId,
  title,
  meta,
  children,
}: {
  watchId: string;
  title: string;
  meta?: string;
  children: React.ReactNode;
}) {
  const [pastHeader, setPastHeader] = useState(false);
  const [atFooter, setAtFooter] = useState(false);

  useEffect(() => {
    const header = document.getElementById(watchId);
    const footer = document.querySelector("footer");
    const observers: IntersectionObserver[] = [];
    if (header) {
      const io = new IntersectionObserver(([e]) => setPastHeader(!e.isIntersecting && e.boundingClientRect.top < 0));
      io.observe(header);
      observers.push(io);
    }
    if (footer) {
      const io = new IntersectionObserver(([e]) => setAtFooter(e.isIntersecting));
      io.observe(footer);
      observers.push(io);
    }
    return () => observers.forEach((o) => o.disconnect());
  }, [watchId]);

  const show = pastHeader && !atFooter;

  return (
    <div
      inert={!show}
      className={cn(
        "fixed inset-x-0 bottom-0 z-40 p-3 transition-transform duration-300 ease-out lg:hidden",
        show ? "translate-y-0" : "translate-y-[130%]",
      )}
    >
      <div className="mx-auto flex max-w-xl items-center justify-between gap-3 rounded-[20px] bg-card/95 p-2 pl-4 shadow-[0_16px_40px_-16px_rgba(19,19,21,.45)] ring-1 ring-inset ring-border backdrop-blur-xl">
        <div className="min-w-0">
          <p className="truncate font-heading text-[15px] font-bold leading-tight">{title}</p>
          {meta && <p className="truncate text-[12.5px] text-muted-foreground">{meta}</p>}
        </div>
        {children}
      </div>
    </div>
  );
}
