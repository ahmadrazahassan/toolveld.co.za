import { hasPublicRating } from "@/lib/reviews-policy";
import type { Software } from "@/lib/types";

export interface RankedSoftware {
  software: Software;
  score: number;
  rank: number;
}

export function median(values: number[]) {
  if (values.length === 0) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
}

/**
 * Bayesian weighted average. A product's average is pulled towards the mean of the set
 * being ranked, with the median review count of that set as the prior weight.
 */
export function bayesianScore(avg: number, count: number, priorMean: number, priorWeight: number) {
  if (count + priorWeight === 0) return 0;
  return (count * avg + priorWeight * priorMean) / (count + priorWeight);
}

/**
 * Ranks only products with a public rating. Priors come from the set passed in,
 * so a category page ranks within its own category.
 */
export function rankSoftware(items: Software[]): RankedSoftware[] {
  const rated = items.filter(hasPublicRating);
  if (rated.length === 0) return [];
  const totalReviews = rated.reduce((sum, s) => sum + s.review_count, 0);
  const priorMean = rated.reduce((sum, s) => sum + (s.rating_overall ?? 0) * s.review_count, 0) / totalReviews;
  const priorWeight = median(rated.map((s) => s.review_count));
  return rated
    .map((software) => ({
      software,
      score: bayesianScore(software.rating_overall ?? 0, software.review_count, priorMean, priorWeight),
    }))
    .sort(
      (a, b) =>
        b.score - a.score ||
        b.software.review_count - a.software.review_count ||
        a.software.name.localeCompare(b.software.name),
    )
    .map((entry, i) => ({ ...entry, rank: i + 1 }));
}
