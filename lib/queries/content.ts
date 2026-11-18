import { cache } from "react";
import { canonicalPairSlug } from "@/lib/compare-slug";
import { articles as bundledArticles } from "@/lib/data/articles";
import { comparisons as bundledComparisons } from "@/lib/data/comparisons";
import { pages as bundledPages } from "@/lib/data/pages";
import type { Article, Comparison, Page, Software } from "@/lib/types";
import { withFallback } from "./db";
import { getAllSoftware } from "./software";

export const getArticles = cache(async (): Promise<Article[]> => {
  return withFallback(
    async (sb) => {
      const { data, error } = await sb
        .from("articles")
        .select("*")
        .eq("status", "published")
        .order("published_at", { ascending: false });
      if (error) throw error;
      return data as Article[];
    },
    () =>
      bundledArticles
        .filter((a) => a.status === "published")
        .sort((a, b) => b.published_at.localeCompare(a.published_at)),
  );
});

export const getArticle = cache(async (slug: string) => {
  const list = await getArticles();
  return list.find((a) => a.slug === slug) ?? null;
});

export const getComparisons = cache(async (): Promise<Comparison[]> => {
  return withFallback(
    async (sb) => {
      const { data, error } = await sb.from("comparisons").select("*").eq("status", "published");
      if (error) throw error;
      return data as Comparison[];
    },
    () => bundledComparisons.filter((c) => c.status === "published"),
  );
});

export const getPages = cache(async (): Promise<Page[]> => {
  return withFallback(
    async (sb) => {
      const { data, error } = await sb.from("pages").select("*");
      if (error) throw error;
      return data as Page[];
    },
    () => bundledPages,
  );
});

export const getPage = cache(async (slug: string) => {
  const list = await getPages();
  return list.find((p) => p.slug === slug) ?? null;
});

/** Always the canonical order, so internal links never hit a redirect. */
export function pairSlug(a: string, b: string) {
  return canonicalPairSlug(a, b);
}

/**
 * Resolves "a-vs-b" in either order. Returns both products, the written comparison if one
 * exists, and the canonical slug so both orderings share one canonical URL.
 */
export async function resolvePair(pair: string): Promise<{
  a: Software;
  b: Software;
  comparison: Comparison | null;
  canonical: string;
} | null> {
  const all = await getAllSoftware();
  const slugs = new Set(all.map((s) => s.slug));
  const parts = pair.split("-vs-");
  // Slugs can contain "-vs-" only in theory; try every split point to be safe.
  let left: string | null = null;
  let right: string | null = null;
  for (let i = 1; i < parts.length; i++) {
    const l = parts.slice(0, i).join("-vs-");
    const r = parts.slice(i).join("-vs-");
    if (slugs.has(l) && slugs.has(r) && l !== r) {
      left = l;
      right = r;
      break;
    }
  }
  if (!left || !right) return null;
  const comps = await getComparisons();
  const comparison = comps.find((c) => (c.a === left && c.b === right) || (c.a === right && c.b === left)) ?? null;
  const [first, second] = comparison ? [comparison.a, comparison.b] : [left, right].sort();
  const map = new Map(all.map((s) => [s.slug, s]));
  return {
    a: map.get(first)!,
    b: map.get(second)!,
    comparison,
    canonical: pairSlug(first, second),
  };
}
