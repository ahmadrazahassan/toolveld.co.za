import { cache } from "react";
import { categories as bundled } from "@/lib/data/categories";
import type { Category, CategorySlug } from "@/lib/types";
import { withFallback } from "./db";
import { getAllSoftware } from "./software";

export type CategoryWithCount = Category & { product_count: number };

export const getCategories = cache(async (): Promise<CategoryWithCount[]> => {
  const [list, software] = await Promise.all([
    withFallback(
      async (sb) => {
        const { data, error } = await sb.from("categories").select("*").order("sort");
        if (error) throw error;
        return data as Category[];
      },
      () => [...bundled].sort((a, b) => a.sort - b.sort),
    ),
    getAllSoftware(),
  ]);
  return list.map((c) => ({ ...c, product_count: software.filter((s) => s.category === c.slug).length }));
});

export const getCategory = cache(async (slug: string): Promise<CategoryWithCount | null> => {
  const list = await getCategories();
  return list.find((c) => c.slug === slug) ?? null;
});

export async function getCategoryName(slug: CategorySlug) {
  const c = await getCategory(slug);
  return c?.name ?? slug;
}
