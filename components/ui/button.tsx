import Link from "next/link";
import { cva, type VariantProps } from "class-variance-authority";
import { ArrowRight, ArrowUpRight, LoaderCircle } from "lucide-react";
import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * CtaButton is the only call to action on the site. A glossy rounded rectangle with an
 * uppercase label on the left and a yellow chip holding an arrow on the right. The chip is a
 * flex sibling of the label, never positioned on top of it. Fills, sheen and hover light live
 * in the .btn-gloss classes in globals.css.
 */
const pill = cva(
  "btn-gloss group/cta inline-flex shrink-0 select-none items-center justify-between whitespace-nowrap hover:-translate-y-px active:translate-y-0 active:scale-[0.985] disabled:pointer-events-none disabled:opacity-60 aria-disabled:pointer-events-none aria-disabled:opacity-60",
  {
    variants: {
      variant: {
        default: "gloss-ink",
        soft: "gloss-light",
        onDark: "on-dark gloss-on-dark",
        tint: "gloss-tint",
        yellow: "gloss-yellow",
      },
      size: {
        xs: "h-8 gap-2 rounded-[9px] pl-3.5 pr-2 text-[11px]",
        sm: "h-10 gap-2.5 rounded-[10px] pl-4 pr-1 text-[11.5px]",
        default: "h-12 gap-3 rounded-[12px] pl-5 pr-1.5 text-[12px]",
        lg: "h-14 gap-3.5 rounded-[14px] pl-6 pr-1.5 text-[12.5px]",
      },
      plain: { true: "", false: "" },
      full: { true: "w-full", false: "" },
    },
    defaultVariants: { variant: "default", size: "default", plain: false, full: false },
  },
);

const chip = cva(
  "inline-flex shrink-0 items-center justify-center transition-transform duration-200 ease-out group-hover/cta:translate-x-0.5",
  {
    variants: {
      variant: {
        default: "gloss-chip text-ink",
        soft: "gloss-chip text-ink",
        onDark: "gloss-chip text-ink",
        tint: "bg-transparent text-ink",
        yellow: "gloss-chip-ink text-yellow",
      },
      size: {
        xs: "size-4 rounded-[4px]",
        sm: "size-8 rounded-[7px]",
        default: "size-9 rounded-[8px]",
        lg: "size-11 rounded-[10px]",
      },
      plain: { true: "", false: "" },
    },
    defaultVariants: { variant: "default", size: "default", plain: false },
  },
);

const ICON_SIZE = { xs: 11, sm: 15, default: 16, lg: 18 } as const;

type CommonProps = VariantProps<typeof pill> & {
  children: ReactNode;
  /** Hide the chip, for example on Save buttons. */
  arrow?: boolean;
  icon?: "forward" | "external";
  pending?: boolean;
  className?: string;
};

type LinkProps = CommonProps & {
  href: string;
  external?: boolean;
  rel?: string;
  target?: string;
  referrerPolicy?: ComponentProps<"a">["referrerPolicy"];
  "aria-label"?: string;
  "data-affiliate"?: string;
  "data-subid"?: string;
};

type ButtonProps = CommonProps & Omit<ComponentProps<"button">, "children" | "className"> & { href?: undefined };

export type CtaButtonProps = LinkProps | ButtonProps;

const OWN_PROPS = ["variant", "size", "plain", "full", "className", "children", "arrow", "icon", "pending", "href"] as const;

function Inner({
  children,
  arrow = true,
  icon = "forward",
  pending,
  variant,
  size,
  plain,
}: Pick<CommonProps, "children" | "arrow" | "icon" | "pending" | "variant" | "size" | "plain">) {
  const Icon = icon === "external" ? ArrowUpRight : ArrowRight;
  const px = ICON_SIZE[size ?? "default"];
  return (
    <>
      <span className={cn(plain ? "font-heading text-[14px] font-medium normal-case tracking-normal" : "btn-label", "relative z-[1]")}>
        {children}
      </span>
      {arrow || pending ? (
        <span className={cn(chip({ variant, size, plain }), "relative z-[1]")} aria-hidden="true">
          {pending ? <LoaderCircle size={px} className="animate-spin" strokeWidth={2.4} /> : <Icon size={px} strokeWidth={2.4} />}
        </span>
      ) : (
        <span className="w-2" aria-hidden="true" />
      )}
    </>
  );
}

export function CtaButton(props: CtaButtonProps) {
  const { variant, size, plain, full, className, children, arrow, icon, pending } = props;
  const classes = cn(pill({ variant, size, plain, full }), plain && "gap-2", className);
  const inner = (
    <Inner arrow={arrow} icon={icon} pending={pending} variant={variant} size={size} plain={plain}>
      {children}
    </Inner>
  );

  if (props.href !== undefined) {
    const { href, external, rel, target, referrerPolicy } = props;
    if (external) {
      return (
        <a
          href={href}
          className={classes}
          rel={rel ?? "noopener"}
          target={target ?? "_blank"}
          referrerPolicy={referrerPolicy}
          aria-label={props["aria-label"]}
          data-affiliate={props["data-affiliate"]}
          data-subid={props["data-subid"]}
        >
          {inner}
        </a>
      );
    }
    return (
      <Link href={href} className={classes} aria-label={props["aria-label"]}>
        {inner}
      </Link>
    );
  }

  const bag: Record<string, unknown> = { ...props };
  for (const key of OWN_PROPS) delete bag[key];
  const rest = bag as ComponentProps<"button">;
  return (
    <button {...rest} type={rest.type ?? "button"} disabled={rest.disabled || pending} aria-busy={pending || undefined} className={classes}>
      {inner}
    </button>
  );
}

/** Circular icon button, used for search, menu and dismiss controls. */
export function IconButton({ className, children, ...rest }: ComponentProps<"button">) {
  return (
    <button
      type="button"
      {...rest}
      className={cn(
        "inline-flex size-11 shrink-0 items-center justify-center rounded-full bg-card/85 text-ink ring-1 ring-inset ring-border-strong backdrop-blur-xl transition hover:bg-card",
        className,
      )}
    >
      {children}
    </button>
  );
}
