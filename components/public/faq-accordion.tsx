"use client";

import { Accordion } from "radix-ui";
import { Plus } from "lucide-react";
import type { FAQ } from "@/lib/types";

export function FaqAccordion({ faqs }: { faqs: FAQ[] }) {
  return (
    <Accordion.Root type="multiple" className="border-t border-border-strong">
      {faqs.map((f, i) => (
        <Accordion.Item key={i} value={`faq-${i}`} className="border-b border-border-strong">
          <Accordion.Header>
            <Accordion.Trigger className="group flex w-full items-start justify-between gap-6 py-5 text-left font-heading text-[17px] font-bold leading-snug text-ink md:text-[18px]">
              {f.question}
              <span className="mt-0.5 inline-flex size-7 shrink-0 items-center justify-center rounded-full bg-card ring-1 ring-inset ring-border-strong transition-transform duration-200 group-data-[state=open]:rotate-45">
                <Plus size={15} aria-hidden="true" />
              </span>
            </Accordion.Trigger>
          </Accordion.Header>
          <Accordion.Content className="overflow-hidden pb-5 pr-12 text-[16px] leading-relaxed text-muted-foreground">
            {f.answer}
          </Accordion.Content>
        </Accordion.Item>
      ))}
    </Accordion.Root>
  );
}
