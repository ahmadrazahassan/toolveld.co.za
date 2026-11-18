import type { PricePoint, Software } from "@/lib/types";

type ProductInput = Omit<
  Software,
  | "id"
  | "rating_overall"
  | "rating_ease"
  | "rating_value"
  | "rating_service"
  | "rating_functionality"
  | "review_count"
  | "status"
  | "screenshots"
  | "price_history"
  | "featured"
  | "demo"
  | "updated_at"
> &
  Partial<Pick<Software, "screenshots" | "price_history" | "featured" | "demo" | "updated_at">>;

/** The date this register was first compiled. */
export const REGISTER_DATE = "2026-11-16";

/**
 * Fills the fields every bundled product shares. Ratings always start empty and the review
 * count at zero: aggregate ratings are only ever written by the database trigger from
 * published reviews.
 */
export function product(input: ProductInput): Software {
  const firstPoint: PricePoint[] = input.price_checked_at
    ? [
        {
          date: input.price_checked_at,
          price: input.starting_price,
          currency: input.currency,
          vat_inclusive: input.price_vat_inclusive,
          note: "First check on our register",
        },
      ]
    : [];
  return {
    screenshots: [],
    featured: false,
    demo: false,
    updated_at: REGISTER_DATE,
    ...input,
    price_history: input.price_history ?? firstPoint,
    id: input.slug,
    rating_overall: null,
    rating_ease: null,
    rating_value: null,
    rating_service: null,
    rating_functionality: null,
    review_count: 0,
    status: "published",
  };
}
