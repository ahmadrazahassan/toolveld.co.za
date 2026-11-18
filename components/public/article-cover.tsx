import Image from "next/image";
import type { Article } from "@/lib/types";
import { cn } from "@/lib/utils";

/**
 * Article cover. Uses the supplied image when there is one; otherwise a typographic cover in
 * ink with the topic in yellow, so no stock photography is needed.
 */
export function ArticleCover({ article, className, large = false }: { article: Article; className?: string; large?: boolean }) {
  if (article.cover) {
    return (
      <div className={cn("relative overflow-hidden rounded-[20px] bg-bone", large ? "aspect-[16/8]" : "aspect-[16/10]", className)}>
        <Image
          src={article.cover}
          alt={large ? (article.cover_alt ?? "") : ""}
          fill
          priority={large}
          className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
          sizes={large ? "(min-width: 1024px) 1024px, 100vw" : "(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"}
        />
      </div>
    );
  }
  return (
    <div
      className={cn(
        "on-dark relative flex flex-col justify-between overflow-hidden rounded-[20px] bg-ink p-5 text-white",
        large ? "aspect-[16/8] md:p-10" : "aspect-[16/10]",
        className,
      )}
      aria-hidden="true"
    >
      <span className="eyebrow text-yellow">{article.topic_label}</span>
      <span className={cn("font-heading font-bold leading-[1.05] tracking-[-0.03em]", large ? "text-[28px] md:text-[44px]" : "text-[20px]")}>
        {article.title.split(" ").slice(0, 6).join(" ")}
        {article.title.split(" ").length > 6 ? "…" : ""}
      </span>
      <span className="absolute -bottom-10 -right-10 size-40 rounded-full bg-yellow/90" />
    </div>
  );
}
