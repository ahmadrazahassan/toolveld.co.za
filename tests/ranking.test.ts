import { describe, expect, it } from "vitest";
import { bayesianScore, rankSoftware } from "@/lib/ranking";
import { allSoftware } from "@/lib/data/software";
import { MIN_PUBLIC_REVIEWS } from "@/lib/site";
import type { Software } from "@/lib/types";

const base = allSoftware[0];
function make(id: string, rating: number | null, count: number): Software {
  return { ...base, id, slug: id, name: id, rating_overall: rating, review_count: count };
}

describe("Bayesian ranking", () => {
  it("ranks many reviews at 4.4 above a handful at 4.8", () => {
    const ranked = rankSoftware([
      make("many", 4.4, 200),
      make("few", 4.8, 6),
      make("c", 4.0, 80),
      make("d", 3.9, 60),
      make("e", 4.2, 120),
    ]);
    expect(ranked[0].software.id).toBe("many");
  });

  it("leaves out products below the public review threshold", () => {
    const ranked = rankSoftware([make("a", 5, MIN_PUBLIC_REVIEWS - 1), make("b", 4, MIN_PUBLIC_REVIEWS)]);
    expect(ranked.map((r) => r.software.id)).toEqual(["b"]);
  });

  it("returns nothing when no product has enough reviews", () => {
    expect(rankSoftware(allSoftware)).toEqual([]);
  });

  it("pulls a score towards the prior mean", () => {
    expect(bayesianScore(5, 1, 4, 10)).toBeCloseTo(4.09, 2);
  });
});
