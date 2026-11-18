import { describe, expect, it } from "vitest";
import { canonicalPairSlug } from "@/lib/compare-slug";
import { comparisons } from "@/lib/data/comparisons";

describe("canonicalPairSlug", () => {
  it("gives the same slug for either order", () => {
    expect(canonicalPairSlug("trello", "asana")).toBe("asana-vs-trello");
    expect(canonicalPairSlug("asana", "trello")).toBe("asana-vs-trello");
  });

  it("keeps the order of a written comparison", () => {
    for (const c of comparisons) {
      expect(canonicalPairSlug(c.b, c.a)).toBe(c.slug);
      expect(canonicalPairSlug(c.a, c.b)).toBe(c.slug);
    }
  });
});
