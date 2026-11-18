import type { MetadataRoute } from "next";
import { getCategories } from "@/lib/queries/categories";
import { getArticles, getComparisons, getPages } from "@/lib/queries/content";
import { getAllSoftware } from "@/lib/queries/software";
import { absoluteUrl } from "@/lib/seo";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [software, categories, articles, comparisons, pages] = await Promise.all([
    getAllSoftware(),
    getCategories(),
    getArticles(),
    getComparisons(),
    getPages(),
  ]);
  const staticRoutes = ["/", "/software", "/categories", "/compare", "/blog", "/about", "/contact", "/newsletter", "/finder", "/prices", "/sage"];
  return [
    ...staticRoutes.map((p) => ({ url: absoluteUrl(p), changeFrequency: "weekly" as const, priority: p === "/" ? 1 : 0.7 })),
    ...categories.map((c) => ({ url: absoluteUrl(`/category/${c.slug}`), changeFrequency: "weekly" as const, priority: 0.8 })),
    ...software.flatMap((s) => [
      { url: absoluteUrl(`/software/${s.slug}`), lastModified: s.updated_at, changeFrequency: "weekly" as const, priority: 0.9 },
      { url: absoluteUrl(`/software/${s.slug}/alternatives`), lastModified: s.updated_at, changeFrequency: "monthly" as const, priority: 0.5 },
      ...(s.review_count > 0 ? [{ url: absoluteUrl(`/software/${s.slug}/reviews`), changeFrequency: "weekly" as const, priority: 0.6 }] : []),
    ]),
    ...comparisons.map((c) => ({ url: absoluteUrl(`/compare/${c.slug}`), lastModified: c.updated_at, changeFrequency: "monthly" as const, priority: 0.7 })),
    ...articles.map((a) => ({ url: absoluteUrl(`/blog/${a.slug}`), lastModified: a.updated_at, changeFrequency: "monthly" as const, priority: 0.7 })),
    ...pages.map((p) => ({ url: absoluteUrl(`/${p.slug}`), lastModified: p.updated_at, changeFrequency: "yearly" as const, priority: 0.3 })),
  ];
}
