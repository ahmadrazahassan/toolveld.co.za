import { cache } from "react";
import { allSoftware } from "@/lib/data/software";
import type { CategorySlug, PricePoint, Software, SoftwareSummary } from "@/lib/types";
import { withFallback } from "./db";

type SoftwareRow = Omit<Software, "price_history"> & { price_history?: PricePoint[] | null };

function fromRow(row: SoftwareRow): Software {
  return {
    ...row,
    screenshots: row.screenshots ?? [],
    price_history: (row.price_history ?? []).sort((a, b) => b.date.localeCompare(a.date)),
  };
}

export const getAllSoftware = cache(async (): Promise<Software[]> => {
  return withFallback(
    async (sb) => {
      const { data, error } = await sb
        .from("software")
        .select("*, price_history(date, price, currency, vat_inclusive, note)")
        .eq("status", "published")
        .order("name");
      if (error) throw error;
      return (data as SoftwareRow[]).map(fromRow);
    },
    () =>
      allSoftware
        .filter((s) => s.status === "published")
        .sort((a, b) => a.name.localeCompare(b.name)),
  );
});

export const getSoftwareBySlug = cache(async (slug: string): Promise<Software | null> => {
  const all = await getAllSoftware();
  return all.find((s) => s.slug === slug) ?? null;
});

export const getSoftwareByCategory = cache(async (category: CategorySlug): Promise<Software[]> => {
  const all = await getAllSoftware();
  return all.filter((s) => s.category === category);
});

export async function getSoftwareMap() {
  const all = await getAllSoftware();
  return new Map(all.map((s) => [s.slug, s]));
}

/** Editorially chosen alternatives first, then category peers. */
export async function getAlternatives(software: Software, limit = 3): Promise<Software[]> {
  const all = await getAllSoftware();
  const map = new Map(all.map((s) => [s.slug, s]));
  const chosen = software.alternatives.map((slug) => map.get(slug)).filter((s): s is Software => Boolean(s));
  const peers = all.filter(
    (s) => s.category === software.category && s.slug !== software.slug && !chosen.some((c) => c.slug === s.slug),
  );
  return [...chosen, ...peers].slice(0, limit);
}

export function toSummary(s: Software): SoftwareSummary {
  return {
    id: s.id,
    slug: s.slug,
    name: s.name,
    tagline: s.tagline,
    short_description: s.short_description,
    logo: s.logo,
    brand_color: s.brand_color,
    website: s.website,
    category: s.category,
    starting_price: s.starting_price,
    currency: s.currency,
    billing_period: s.billing_period,
    price_vat_inclusive: s.price_vat_inclusive,
    price_vat_unknown: s.price_vat_unknown,
    pricing_model: s.pricing_model,
    free_trial: s.free_trial,
    free_trial_days: s.free_trial_days,
    free_version: s.free_version,
    deployment: s.deployment,
    rating_overall: s.rating_overall,
    review_count: s.review_count,
  };
}

/** One product per vendor, logos only, ordered by review count then featured then name. */
export function softwareLogoList(items: Software[]) {
  const seenVendors = new Set<string>();
  const ordered = [...items].sort(
    (a, b) => b.review_count - a.review_count || Number(b.featured) - Number(a.featured) || a.name.localeCompare(b.name),
  );
  return ordered.filter((s) => {
    if (!s.logo) return false;
    if (seenVendors.has(s.vendor.company)) return false;
    seenVendors.add(s.vendor.company);
    return true;
  });
}
