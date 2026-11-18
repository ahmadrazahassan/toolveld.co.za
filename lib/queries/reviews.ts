import { cache } from "react";
import type { CompanySize, Review } from "@/lib/types";
import { withFallback } from "./db";

/**
 * Reviews only ever come from the database. The bundled dataset holds none, because we never
 * generate, invent or seed reviews. Without a database every list below is empty.
 */

export type ReviewSort = "recent" | "helpful" | "highest" | "lowest";

export interface ReviewQuery {
  softwareId: string;
  stars?: number;
  size?: CompanySize;
  sort?: ReviewSort;
  page?: number;
  perPage?: number;
}

export async function getReviews(q: ReviewQuery): Promise<{ reviews: Review[]; total: number }> {
  const perPage = q.perPage ?? 10;
  const page = Math.max(1, q.page ?? 1);
  return withFallback(
    async (sb) => {
      let query = sb
        .from("published_reviews")
        .select("*", { count: "exact" })
        .eq("software_id", q.softwareId)
        .eq("status", "published");
      if (q.stars) query = query.eq("rating_overall", q.stars);
      if (q.size) query = query.eq("company_size", q.size);
      const order: Record<ReviewSort, [string, boolean]> = {
        recent: ["created_at", false],
        helpful: ["helpful_count", false],
        highest: ["rating_overall", false],
        lowest: ["rating_overall", true],
      };
      const [col, asc] = order[q.sort ?? "recent"];
      const { data, count, error } = await query
        .order(col, { ascending: asc })
        .order("created_at", { ascending: false })
        .range((page - 1) * perPage, page * perPage - 1);
      if (error) throw error;
      return { reviews: (data ?? []) as Review[], total: count ?? 0 };
    },
    () => ({ reviews: [], total: 0 }),
    { fallbackOnEmpty: false },
  );
}

export async function getStarDistribution(softwareId: string): Promise<Record<1 | 2 | 3 | 4 | 5, number>> {
  const empty = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  return withFallback(
    async (sb) => {
      const { data, error } = await sb
        .from("published_reviews")
        .select("rating_overall, company_size")
        .eq("software_id", softwareId)
        .eq("status", "published");
      if (error) throw error;
      const dist = { ...empty };
      for (const r of data ?? []) {
        const k = Math.round(r.rating_overall) as 1 | 2 | 3 | 4 | 5;
        if (dist[k] !== undefined) dist[k] += 1;
      }
      return dist;
    },
    () => empty,
    { fallbackOnEmpty: false },
  );
}

export async function getCompanySizeCounts(softwareId: string): Promise<Record<string, number>> {
  return withFallback(
    async (sb) => {
      const { data, error } = await sb
        .from("published_reviews")
        .select("company_size")
        .eq("software_id", softwareId)
        .eq("status", "published");
      if (error) throw error;
      const counts: Record<string, number> = {};
      for (const r of data ?? []) counts[r.company_size] = (counts[r.company_size] ?? 0) + 1;
      return counts;
    },
    () => ({}),
    { fallbackOnEmpty: false },
  );
}

export const getPublishedReviewTotal = cache(async (): Promise<number> => {
  return withFallback(
    async (sb) => {
      const { count, error } = await sb
        .from("published_reviews")
        .select("id", { count: "exact", head: true })
        .eq("status", "published");
      if (error) throw error;
      return count ?? 0;
    },
    () => 0,
    { fallbackOnEmpty: false },
  );
});

/** Recent published reviews, used by the review wall. */
export const getRecentReviews = cache(async (limit = 60): Promise<Review[]> => {
  return withFallback(
    async (sb) => {
      const { data, error } = await sb
        .from("published_reviews")
        .select("*")
        .eq("status", "published")
        .order("created_at", { ascending: false })
        .limit(limit);
      if (error) throw error;
      return (data ?? []) as Review[];
    },
    () => [],
    { fallbackOnEmpty: false },
  );
});
