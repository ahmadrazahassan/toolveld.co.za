"use client";

import Image from "next/image";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { Screenshot } from "@/lib/types";

export function ScreenshotCarousel({ screenshots }: { screenshots: Screenshot[] }) {
  const [ref, api] = useEmblaCarousel({ align: "start", loop: false });
  return (
    <div className="relative">
      <div ref={ref} className="overflow-hidden rounded-[24px]">
        <ul className="flex gap-4">
          {screenshots.map((s) => (
            <li key={s.src} className="min-w-0 shrink-0 grow-0 basis-[88%] md:basis-[70%]">
              <figure className="overflow-hidden rounded-[20px] border border-border bg-card">
                <Image src={s.src} alt={s.alt} width={1600} height={1000} className="h-auto w-full" />
                <figcaption className="px-4 py-3 text-[13.5px] text-muted-foreground">{s.alt}</figcaption>
              </figure>
            </li>
          ))}
        </ul>
      </div>
      <div className="mt-4 flex gap-2">
        <button
          type="button"
          onClick={() => api?.scrollPrev()}
          className="inline-flex size-10 items-center justify-center rounded-full bg-card ring-1 ring-inset ring-border-strong"
          aria-label="Previous screenshot"
        >
          <ChevronLeft size={18} />
        </button>
        <button
          type="button"
          onClick={() => api?.scrollNext()}
          className="inline-flex size-10 items-center justify-center rounded-full bg-card ring-1 ring-inset ring-border-strong"
          aria-label="Next screenshot"
        >
          <ChevronRight size={18} />
        </button>
      </div>
    </div>
  );
}
