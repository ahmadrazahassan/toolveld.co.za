import { cn } from "@/lib/utils";

/**
 * The Toolveld symbol: a tick under the sun on a yellow badge.
 * The tick is the choice made, the sun is the open veld it was made in.
 * The badge carries its own colours, so it reads the same on light and dark surfaces.
 * Same shapes as public/brand/toolveld-symbol.svg and app/icon.svg.
 */
export function SiteSymbol({ className, title }: { className?: string; title?: string }) {
  return (
    <svg
      viewBox="0 0 64 64"
      className={cn("shrink-0", className)}
      role={title ? "img" : undefined}
      aria-label={title}
      aria-hidden={title ? undefined : true}
    >
      <rect width="64" height="64" rx="15" fill="#FED400" />
      <circle cx="21.5" cy="20.5" r="6.5" fill="#131315" />
      <path
        d="M17 37.5l10 9.5L48 24"
        fill="none"
        stroke="#131315"
        strokeWidth="9.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
