import { SITE_NAME } from "@/lib/site";
import { cn } from "@/lib/utils";
import { SiteSymbol } from "@/components/public/site-symbol";

/** The site symbol beside the wordmark. Use tone="light" on dark backgrounds. */
export function SiteMark({
  className,
  showWordmark = true,
  tone = "dark",
}: {
  className?: string;
  showWordmark?: boolean;
  tone?: "dark" | "light";
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 transition-colors duration-300",
        tone === "light" ? "text-white" : "text-ink",
        className,
      )}
    >
      <SiteSymbol className="size-8" />
      {showWordmark && (
        <span className="font-heading text-[19px] font-bold leading-none tracking-[-0.02em]">{SITE_NAME}</span>
      )}
    </span>
  );
}
