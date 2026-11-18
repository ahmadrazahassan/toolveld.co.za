import { MIN_PUBLIC_REVIEWS } from "@/lib/site";
import type { Software } from "@/lib/types";

export { MIN_PUBLIC_REVIEWS };

/** A product shows a rating, a count and a place in any ranking only from MIN_PUBLIC_REVIEWS published reviews. */
export function hasPublicRating(s: Pick<Software, "review_count" | "rating_overall">) {
  return s.review_count >= MIN_PUBLIC_REVIEWS && s.rating_overall !== null;
}

export function publicRating(s: Pick<Software, "review_count" | "rating_overall">) {
  return hasPublicRating(s) ? s.rating_overall : null;
}

export const RATING_DIMENSIONS = [
  { key: "rating_ease", label: "Ease of use" },
  { key: "rating_value", label: "Value for money" },
  { key: "rating_service", label: "Customer service" },
  { key: "rating_functionality", label: "Functionality" },
] as const;

export type RatingDimensionKey = (typeof RATING_DIMENSIONS)[number]["key"];

