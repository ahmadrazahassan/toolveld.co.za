import Image from "next/image";
import type { CSSProperties, ReactNode } from "react";
import { flagPath } from "@/lib/assets";
import { cn } from "@/lib/utils";

const STAR_PATH =
  "M12 2.6l2.83 5.73 6.32.92-4.57 4.46 1.08 6.29L12 17.03l-5.66 2.97 1.08-6.29L2.85 9.25l6.32-.92L12 2.6z";

function StarGlyph({ fill, size }: { fill: number; size: number }) {
  return (
    <span className="relative inline-block" style={{ width: size, height: size }} aria-hidden="true">
      <svg viewBox="0 0 24 24" width={size} height={size} className="absolute inset-0">
        <path d={STAR_PATH} fill="none" stroke="var(--chart-4)" strokeWidth="1.5" strokeLinejoin="round" />
      </svg>
      {fill > 0 && (
        <span className="absolute inset-y-0 left-0 overflow-hidden" style={{ width: `${fill * 100}%` }}>
          <svg viewBox="0 0 24 24" width={size} height={size}>
            <path d={STAR_PATH} fill="var(--star)" stroke="var(--ink)" strokeWidth="1" strokeLinejoin="round" />
          </svg>
        </span>
      )}
    </span>
  );
}

/** Five stars with the number always printed beside them. */
export function Stars({
  value,
  size = 16,
  showValue = true,
  className,
  count,
}: {
  value: number;
  size?: number;
  showValue?: boolean;
  className?: string;
  count?: number;
}) {
  return (
    <span className={cn("inline-flex items-center gap-1.5", className)}>
      <span className="inline-flex items-center gap-0.5" role="img" aria-label={`${value.toFixed(1)} out of 5 stars`}>
        {[0, 1, 2, 3, 4].map((i) => (
          <StarGlyph key={i} size={size} fill={Math.max(0, Math.min(1, value - i))} />
        ))}
      </span>
      {showValue && <span className="font-heading text-[15px] font-bold tabular">{value.toFixed(1)}</span>}
      {count !== undefined && <span className="text-[13px] text-muted-foreground">({count})</span>}
    </span>
  );
}

/** SVG ring that sweeps in on load. Track in --border, value arc in ink, number in Pally. */
export function RatingDial({ value, size = 132, label }: { value: number; size?: number; label?: string }) {
  const stroke = 10;
  const r = (size - stroke) / 2;
  const length = 2 * Math.PI * r;
  const offset = length * (1 - value / 5);
  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="-rotate-90" aria-hidden="true">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--border)" strokeWidth={stroke} />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="var(--ink)"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={length}
          strokeDashoffset={offset}
          className="dial-sweep"
          style={{ "--dial-length": length } as CSSProperties}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-heading text-[34px] font-bold leading-none tracking-[-0.02em]">{value.toFixed(1)}</span>
        <span className="mt-1 text-[12px] text-muted-foreground">{label ?? "out of 5"}</span>
      </div>
    </div>
  );
}

export function Flag({ code, size = 16, className }: { code: string; size?: number; className?: string }) {
  return (
    <Image
      src={flagPath(code)}
      alt=""
      width={Math.round(size * 1.333)}
      height={size}
      className={cn("inline-block rounded-[2px] object-cover", className)}
      style={{ width: Math.round(size * 1.333), height: size }}
      unoptimized
    />
  );
}

export function Skeleton({ className }: { className?: string }) {
  return <div className={cn("animate-pulse rounded-2xl bg-bone", className)} />;
}

export function Rule({ className }: { className?: string }) {
  return <hr className={cn("border-0 border-t border-border-strong", className)} />;
}

export function VisuallyHidden({ children }: { children: ReactNode }) {
  return <span className="sr-only">{children}</span>;
}

/** Category icon tile: 40px bone square that turns yellow on hover of its group. */
export function IconTile({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex size-10 shrink-0 items-center justify-center rounded-xl bg-bone text-ink transition-colors group-hover:bg-yellow",
        className,
      )}
      aria-hidden="true"
    >
      {children}
    </span>
  );
}

export function Eyebrow({ children, className }: { children: ReactNode; className?: string }) {
  return <p className={cn("eyebrow text-muted-foreground", className)}>{children}</p>;
}
