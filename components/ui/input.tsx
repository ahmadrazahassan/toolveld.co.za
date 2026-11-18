import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/utils";

const field =
  "block h-12 w-full rounded-[14px] border border-input bg-card px-4 text-[15px] text-ink placeholder:text-muted-foreground/80 transition-shadow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink focus-visible:ring-offset-0 aria-[invalid=true]:border-destructive";

export function Input({ className, ...props }: ComponentProps<"input">) {
  return <input {...props} className={cn(field, className)} />;
}

export function Textarea({ className, ...props }: ComponentProps<"textarea">) {
  return <textarea {...props} className={cn(field, "h-auto min-h-32 py-3 leading-relaxed", className)} />;
}

export function Select({ className, children, ...props }: ComponentProps<"select">) {
  return (
    <div className="relative">
      <select {...props} className={cn(field, "appearance-none pr-10", className)}>
        {children}
      </select>
      <svg
        className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2"
        width="12"
        height="12"
        viewBox="0 0 12 12"
        aria-hidden="true"
      >
        <path d="M2 4.5l4 4 4-4" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      </svg>
    </div>
  );
}

export function Label({ className, children, ...props }: ComponentProps<"label">) {
  return (
    <label {...props} className={cn("mb-1.5 block text-[14px] font-medium text-ink", className)}>
      {children}
    </label>
  );
}

export function Checkbox({ className, ...props }: Omit<ComponentProps<"input">, "type">) {
  return (
    <input
      type="checkbox"
      {...props}
      className={cn(
        "size-5 shrink-0 cursor-pointer appearance-none rounded-md border border-input bg-card transition checked:border-ink checked:bg-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink",
        "bg-center bg-no-repeat checked:bg-[url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3E%3Cpath d='M3.5 8.5l3 3 6-7' fill='none' stroke='%23fed400' stroke-width='2.2' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E\")]",
        className,
      )}
    />
  );
}

export function FieldError({ children, id }: { children?: ReactNode; id?: string }) {
  if (!children) return null;
  return (
    <p id={id} className="mt-1.5 text-[13px] font-medium text-destructive">
      {children}
    </p>
  );
}

export function FieldHint({ children }: { children: ReactNode }) {
  return <p className="mt-1.5 text-[13px] text-muted-foreground">{children}</p>;
}

/** Honeypot field. Hidden from people and assistive tech, tempting to bots. */
export function Honeypot() {
  return (
    <div aria-hidden="true" className="absolute -left-[10000px] top-auto h-px w-px overflow-hidden">
      <label>
        Leave this field empty
        <input type="text" name="company_website" tabIndex={-1} autoComplete="off" defaultValue="" />
      </label>
    </div>
  );
}
