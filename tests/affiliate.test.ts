import { afterEach, describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { createElement } from "react";
import { AFFILIATE_PROGRAMMES, getOutboundLink } from "@/lib/affiliate";
import { VisitButton } from "@/components/public/affiliate-link";

const product = { slug: "testware", name: "Testware", website: "https://testware.example/" };

afterEach(() => {
  AFFILIATE_PROGRAMMES.length = 0;
});

describe("outbound links", () => {
  it("plain vendor links are nofollow, noopener and carry no Ad label", () => {
    const link = getOutboundLink(product, "directory");
    expect(link.affiliate).toBe(false);
    expect(link.rel).toBe("nofollow noopener");
    const html = renderToStaticMarkup(createElement(VisitButton, { software: product, placement: "directory" }));
    expect(html).toContain('rel="nofollow noopener"');
    expect(html).not.toContain(">Ad<");
  });

  it("affiliate links are sponsored, never noreferrer, and carry the sub id", () => {
    AFFILIATE_PROGRAMMES.push({
      id: "test",
      network: "Test network",
      subIdParam: "subId",
      products: [{ slug: "testware", url: "https://track.example/c?id=1" }],
    });
    const link = getOutboundLink(product, "product-pricing");
    expect(link.affiliate).toBe(true);
    expect(link.rel).toBe("sponsored noopener");
    expect(link.rel).not.toContain("noreferrer");
    expect(link.href).toContain("subId=product-pricing-testware");

    const html = renderToStaticMarkup(createElement(VisitButton, { software: product, placement: "product-pricing" }));
    expect(html).toContain('rel="sponsored noopener"');
    expect(html).toMatch(/referrerpolicy="strict-origin-when-cross-origin"/i);
    expect(html).toMatch(/aria-label="Ad: /);
    expect(html).toContain('target="_blank"');
    expect(html).toContain('data-affiliate="true"');
    expect(html).toContain(">Ad<");
    expect(html).not.toContain("noreferrer");
  });
});
