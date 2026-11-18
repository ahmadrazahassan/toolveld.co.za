import { describe, expect, it } from "vitest";
import { formatPriceLine, formatRand, priceParts, softwarePriceParts } from "@/lib/format";
import { allSoftware } from "@/lib/data/software";

describe("rand formatting", () => {
  it("groups thousands with a plain space", () => {
    expect(formatRand(1375)).toBe("R1 375");
    expect(formatRand(1250000)).toBe("R1 250 000");
    expect(formatRand(485)).toBe("R485");
  });

  it("rounds when asked for whole rands", () => {
    expect(formatRand(151.2, { whole: true })).toBe("R151");
  });
});

describe("price parts", () => {
  it("shows Quoted for a null price sold on quotation", () => {
    expect(priceParts({ price: null, currency: "ZAR", period: "month", vatInclusive: false, pricingModel: "quote" }).amount).toBe("Quoted");
  });

  it("does not call an unrecorded list price Quoted", () => {
    expect(priceParts({ price: null, currency: "ZAR", period: "month", vatInclusive: false, pricingModel: "published" }).amount).toBe("See vendor");
  });

  it("shows Free for zero, which is different from null", () => {
    const p = priceParts({ price: 0, currency: "ZAR", period: "month", vatInclusive: false });
    expect(p.amount).toBe("Free");
    expect(p.kind).toBe("free");
  });

  it("always states the VAT basis", () => {
    expect(formatPriceLine(priceParts({ price: 240, currency: "ZAR", period: "month", vatInclusive: true }))).toBe("R240 /mo incl VAT");
    expect(formatPriceLine(priceParts({ price: 1375, currency: "ZAR", period: "month", vatInclusive: false }))).toBe("R1 375 /mo excl VAT");
  });

  it("gives a rand estimate with the rate for foreign prices", () => {
    const p = priceParts({ price: 10, currency: "USD", period: "user_month", vatInclusive: false });
    expect(p.amount).toBe("$10");
    expect(p.estimate).toMatch(/^about R\d/);
    expect(p.fx).toMatch(/to the dollar/);
  });

  it("every bundled product with a price shows its VAT basis", () => {
    for (const s of allSoftware) {
      const p = softwarePriceParts(s);
      if (p.kind === "price") expect(p.basis).toMatch(/^(incl VAT|excl VAT|VAT not stated)$/);
    }
  });
});
