import { hasPublicRating } from "@/lib/reviews-policy";
import { rankSoftware } from "@/lib/ranking";
import { toRand } from "@/lib/format";
import type { Software } from "@/lib/types";

export type SortKey = "name" | "reviews" | "rating" | "updated" | "price";

export const SORT_OPTIONS: { value: SortKey; label: string; needsRatings?: boolean }[] = [
  { value: "name", label: "Name A to Z" },
  { value: "reviews", label: "Most reviewed", needsRatings: true },
  { value: "rating", label: "Highest rated", needsRatings: true },
  { value: "updated", label: "Recently updated" },
  { value: "price", label: "Lowest starting price" },
];

export function availableSorts(items: Software[]) {
  const anyRated = items.some(hasPublicRating);
  return SORT_OPTIONS.filter((o) => !o.needsRatings || anyRated);
}

function comparablePrice(s: Software) {
  if (s.starting_price === null) return Number.POSITIVE_INFINITY;
  return toRand(s.starting_price, s.currency);
}

export function sortSoftware(items: Software[], key: SortKey): Software[] {
  const list = [...items];
  switch (key) {
    case "reviews":
      return list.sort((a, b) => b.review_count - a.review_count || a.name.localeCompare(b.name));
    case "rating": {
      const order = new Map(rankSoftware(list).map((r) => [r.software.id, r.rank]));
      return list.sort((a, b) => (order.get(a.id) ?? 1e9) - (order.get(b.id) ?? 1e9) || a.name.localeCompare(b.name));
    }
    case "updated":
      return list.sort((a, b) => b.updated_at.localeCompare(a.updated_at) || a.name.localeCompare(b.name));
    case "price":
      return list.sort((a, b) => comparablePrice(a) - comparablePrice(b) || a.name.localeCompare(b.name));
    default:
      return list.sort((a, b) => a.name.localeCompare(b.name));
  }
}
