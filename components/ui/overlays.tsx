"use client";

import { Dialog as RDialog } from "radix-ui";
import { X } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export const Dialog = RDialog.Root;
export const DialogTrigger = RDialog.Trigger;
export const DialogClose = RDialog.Close;

export function DialogContent({
  title,
  description,
  children,
  className,
  hideTitle = false,
}: {
  title: string;
  description?: string;
  children: ReactNode;
  className?: string;
  hideTitle?: boolean;
}) {
  return (
    <RDialog.Portal>
      <RDialog.Overlay className="fixed inset-0 z-[80] bg-ink/40 backdrop-blur-[2px]" />
      <RDialog.Content
        className={cn(
          "fixed left-1/2 top-[10vh] z-[90] w-[calc(100vw-32px)] max-w-xl -translate-x-1/2 rounded-[24px] bg-card p-6 shadow-[0_40px_80px_-30px_rgba(19,19,21,.45)] focus:outline-none",
          className,
        )}
      >
        <RDialog.Title className={cn("font-heading text-xl font-bold", hideTitle && "sr-only")}>{title}</RDialog.Title>
        {description ? (
          <RDialog.Description className="mt-1 text-[14px] text-muted-foreground">{description}</RDialog.Description>
        ) : (
          <RDialog.Description className="sr-only">{title}</RDialog.Description>
        )}
        {children}
        <RDialog.Close
          className="absolute right-4 top-4 inline-flex size-9 items-center justify-center rounded-full bg-bone text-ink transition hover:bg-border"
          aria-label="Close"
        >
          <X size={16} />
        </RDialog.Close>
      </RDialog.Content>
    </RDialog.Portal>
  );
}

/** A panel that slides in from the left on small screens. Used for the directory filters. */
export function SheetContent({ title, children }: { title: string; children: ReactNode }) {
  return (
    <RDialog.Portal>
      <RDialog.Overlay className="fixed inset-0 z-[80] bg-ink/40" />
      <RDialog.Content className="fixed inset-y-0 left-0 z-[90] flex w-[min(360px,90vw)] flex-col overflow-y-auto rounded-r-[28px] bg-card p-6 focus:outline-none">
        <div className="mb-4 flex items-center justify-between">
          <RDialog.Title className="font-heading text-xl font-bold">{title}</RDialog.Title>
          <RDialog.Description className="sr-only">{title}</RDialog.Description>
          <RDialog.Close
            className="inline-flex size-9 items-center justify-center rounded-full bg-bone text-ink"
            aria-label="Close"
          >
            <X size={16} />
          </RDialog.Close>
        </div>
        {children}
      </RDialog.Content>
    </RDialog.Portal>
  );
}
