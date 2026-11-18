"use client";

import { useState } from "react";
import { cn, initials } from "@/lib/utils";

const SIZES = { sm: 36, md: 48, lg: 72, xl: 96 } as const;

/**
 * The vendor's real logo inside a ring tinted with the vendor's own colour. That ring is the
 * only place a vendor colour appears. Without a logo, or if the file fails to load, an ink
 * monogram tile. Never an invented logo.
 *
 * Logos are a few kilobytes each, so they load eagerly: lazy loading left tiles empty on
 * first view while the browser waited to fetch them.
 */
export function SoftwareLogo({
  name,
  logo,
  brandColor,
  size = "md",
  className,
  decorative = true,
}: {
  name: string;
  logo: string | null;
  brandColor: string | null;
  size?: keyof typeof SIZES;
  className?: string;
  decorative?: boolean;
}) {
  const [failed, setFailed] = useState(false);
  const px = SIZES[size];
  const radius = Math.round(px * 0.28);

  if (!logo || failed) {
    return (
      <span
        className={cn("inline-flex shrink-0 items-center justify-center bg-ink font-heading font-bold text-yellow", className)}
        style={{ width: px, height: px, borderRadius: radius, fontSize: Math.round(px * 0.46) }}
        role={decorative ? undefined : "img"}
        aria-label={decorative ? undefined : `${name} monogram`}
        aria-hidden={decorative || undefined}
      >
        {initials(name)}
      </span>
    );
  }

  const ring = brandColor ?? "var(--border)";
  const inner = Math.round(px * 0.66);
  return (
    <span
      className={cn("inline-flex shrink-0 items-center justify-center bg-white", className)}
      style={{
        width: px,
        height: px,
        borderRadius: radius,
        boxShadow: `inset 0 0 0 1.5px color-mix(in srgb, ${ring} 55%, white), 0 0 0 3px color-mix(in srgb, ${ring} 14%, transparent)`,
      }}
    >
      {/* A plain img: these are tiny static files, so the image optimiser adds nothing but delay. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={logo}
        alt={decorative ? "" : `${name} logo`}
        width={inner}
        height={inner}
        loading="eager"
        decoding="async"
        draggable={false}
        onError={() => setFailed(true)}
        className="object-contain"
        style={{ width: inner, height: inner }}
      />
    </span>
  );
}
