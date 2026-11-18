import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

/** White body, bone header row, hairline rows. Pass stickyFirst for wide tables. */
export function Table({ className, stickyFirst = false, ...props }: ComponentProps<"table"> & { stickyFirst?: boolean }) {
  return (
    // relative: keeps absolutely positioned children (sr-only labels) inside the scroll area,
    // so they never widen the page on phones.
    <div className="relative overflow-x-auto rounded-[20px] border border-border bg-card">
      <table
        {...props}
        className={cn(
          "w-full border-collapse text-left text-[15px] leading-snug",
          stickyFirst && "[&_tr>*:first-child]:sticky [&_tr>*:first-child]:left-0 [&_tr>*:first-child]:z-[1] [&_td:first-child]:bg-card",
          className,
        )}
      />
    </div>
  );
}

export function Th({ className, ...props }: ComponentProps<"th">) {
  return (
    <th
      {...props}
      className={cn("border-b border-border bg-bone px-4 py-3 text-[13px] font-semibold text-ink", className)}
    />
  );
}

export function Td({ className, ...props }: ComponentProps<"td">) {
  return <td {...props} className={cn("border-b border-border px-4 py-3 align-top", className)} />;
}
