import { comparisons } from "@/lib/data/comparisons";

/**
 * The one URL slug for a pair of products. A written comparison keeps its own order;
 * any other pair is sorted alphabetically, so "b-vs-a" and "a-vs-b" never both exist.
 * Light enough to import from the proxy and from client components.
 */
export function canonicalPairSlug(left: string, right: string) {
  const written = comparisons.find((c) => (c.a === left && c.b === right) || (c.a === right && c.b === left));
  const [first, second] = written ? [written.a, written.b] : [left, right].sort();
  return `${first}-vs-${second}`;
}
