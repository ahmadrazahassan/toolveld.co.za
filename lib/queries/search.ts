import { cache } from "react";
import { formatSoftwarePrice } from "@/lib/format";
import type { SearchItem } from "@/lib/types";
import { getCategories } from "./categories";
import { getArticles, getComparisons } from "./content";
import { getAllSoftware } from "./software";

/** The search index the public layout loads on the server and hands to the palette. */
export const getSearchIndex = cache(async (): Promise<SearchItem[]> => {
  const [software, categories, comparisons, articles] = await Promise.all([
    getAllSoftware(),
    getCategories(),
    getComparisons(),
    getArticles(),
  ]);
  const names = new Map(software.map((s) => [s.slug, s.name]));
  const categoryName = new Map(categories.map((c) => [c.slug, c.name]));
  return [
    ...software.map<SearchItem>((s) => ({
      type: "software",
      title: s.name,
      subtitle: `${categoryName.get(s.category) ?? s.category} · ${formatSoftwarePrice(s)}`,
      href: `/software/${s.slug}`,
      logo: s.logo,
      keywords: `${s.vendor.company} ${s.tagline} ${s.features.join(" ")}`,
    })),
    ...categories.map<SearchItem>((c) => ({
      type: "category",
      title: c.name,
      subtitle: `${c.product_count} products`,
      href: `/category/${c.slug}`,
      keywords: c.description,
    })),
    ...comparisons
      .filter((c) => names.has(c.a) && names.has(c.b))
      .map<SearchItem>((c) => ({
        type: "comparison",
        title: `${names.get(c.a)} vs ${names.get(c.b)}`,
        subtitle: `Winner: ${names.get(c.winner)}`,
        href: `/compare/${c.slug}`,
      })),
    ...articles.map<SearchItem>((a) => ({
      type: "guide",
      title: a.title,
      subtitle: `${a.topic_label} · ${a.reading_minutes} min read`,
      href: `/blog/${a.slug}`,
      keywords: a.excerpt,
    })),
  ];
});

/** Server side search for the /search page. Simple, deterministic term matching. */
export async function searchSite(query: string) {
  const index = await getSearchIndex();
  const terms = query.toLowerCase().split(/\s+/).filter(Boolean);
  if (!terms.length) return [];
  return index
    .map((item) => {
      const hay = `${item.title} ${item.subtitle} ${item.keywords ?? ""}`.toLowerCase();
      const title = item.title.toLowerCase();
      let score = 0;
      for (const t of terms) {
        if (!hay.includes(t)) return null;
        score += title.includes(t) ? 3 : 1;
        if (title.startsWith(t)) score += 2;
      }
      return { item, score };
    })
    .filter((x): x is { item: SearchItem; score: number } => x !== null)
    .sort((a, b) => b.score - a.score)
    .map((x) => x.item);
}
