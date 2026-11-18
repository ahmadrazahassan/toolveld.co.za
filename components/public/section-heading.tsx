import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * Home page section intro: eyebrow, a heading set in two weights with the closing words bold,
 * a muted subtitle, the CTA on the right aligned to the bottom, then a full width rule.
 */
export function SectionIntro({
  id,
  eyebrow,
  title,
  strong,
  subtitle,
  action,
  className,
}: {
  id: string;
  eyebrow: string;
  title: string;
  strong: string;
  subtitle?: string;
  action?: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("mb-8 md:mb-10", className)}>
      <div className="flex flex-col gap-6 pb-7 md:flex-row md:items-end md:justify-between md:pb-8">
        <div className="max-w-3xl">
          <p className="eyebrow mb-4 text-muted-foreground">{eyebrow}</p>
          <h2
            id={id}
            className="font-heading text-[32px] font-normal leading-[1.04] tracking-[-0.03em] text-ink md:text-[40px]"
          >
            {title} <strong className="font-bold">{strong}</strong>
          </h2>
          {subtitle && <p className="mt-4 max-w-2xl text-[17px] leading-relaxed text-muted-foreground">{subtitle}</p>}
        </div>
        {action && <div className="shrink-0">{action}</div>}
      </div>
      <hr className="border-0 border-t border-border-strong" />
    </div>
  );
}

/**
 * Inner page header: centred bone eyebrow pill with an icon, the heading, a muted subtitle.
 */
export function SectionHeader({
  id,
  icon,
  eyebrow,
  title,
  subtitle,
  align = "center",
  as: Tag = "h1",
  className,
  children,
}: {
  id?: string;
  icon?: ReactNode;
  eyebrow: string;
  title: ReactNode;
  subtitle?: ReactNode;
  align?: "center" | "left";
  as?: "h1" | "h2";
  className?: string;
  children?: ReactNode;
}) {
  const centred = align === "center";
  return (
    <div className={cn("mb-10 md:mb-14", centred && "text-center", className)}>
      <span className="inline-flex items-center gap-2 rounded-full bg-bone px-3.5 py-1.5 text-[13px] font-medium text-ink ring-1 ring-inset ring-border-strong">
        {icon && <span aria-hidden="true">{icon}</span>}
        {eyebrow}
      </span>
      <Tag
        id={id}
        className={cn(
          "mt-5 font-heading text-ink",
          Tag === "h1"
            ? "text-[36px] font-bold leading-[1.12] tracking-[-0.025em] md:text-[48px]"
            : "text-[30px] font-medium leading-[1.18] tracking-[-0.02em] md:text-[42px]",
          centred && "mx-auto max-w-3xl",
        )}
      >
        {title}
      </Tag>
      {subtitle && (
        <p className={cn("mt-4 max-w-[576px] text-[17px] leading-relaxed text-muted-foreground md:text-[18px]", centred && "mx-auto")}>
          {subtitle}
        </p>
      )}
      {children}
    </div>
  );
}
