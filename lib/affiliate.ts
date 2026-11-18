/**
 * Every affiliate tracking link lives in this file, exactly as the programme issued it.
 * No affiliate URL may appear anywhere else in the codebase. `VisitButton` is the only
 * component that renders one.
 *
 * Products without a programme get a plain `nofollow` link to the vendor's own site.
 * When a programme is signed, add it here and list it in the affiliate disclosure.
 */

export type Placement =
  | "home-explorer"
  | "directory"
  | "category"
  | "product-header"
  | "product-sidebar"
  | "product-sticky"
  | "product-review"
  | "product-plan"
  | "product-table"
  | "product-pricing"
  | "product-features"
  | "product-compare"
  | "product-footer"
  | "product-alternatives"
  | "product-reviews-page"
  | "compare-hero"
  | "compare-shortlist"
  | "top-rated"
  | "finder";

export interface AffiliateProduct {
  /** Our software slug. */
  slug: string;
  /** The tracking link exactly as issued. */
  url: string;
}

export interface AffiliateProgramme {
  id: string;
  network: string;
  /** Query parameter the network reads for our sub id. */
  subIdParam: string;
  products: AffiliateProduct[];
}

export const AFFILIATE_PROGRAMMES: AffiliateProgramme[] = [
  {
    // Xero partner programme, run on PartnerStack. Joined 18 November 2026.
    // utm_content carries the placement, so Xero's reports show which spot sent the click.
    id: "xero",
    network: "PartnerStack",
    subIdParam: "utm_content",
    products: [
      {
        slug: "xero",
        url: "https://xero5440.partnerlinks.io/1ckut6a0r1ph?utm_medium=toolveld.co.za&utm_source=toolveld.co.za&utm_campaign=toolveld.co.za",
      },
    ],
  },
];

/** Programmes we belong to, as readers see them on the disclosure page. */
export const ACTIVE_PROGRAMMES = [{ vendor: "Xero", network: "PartnerStack", joined: "18 November 2026" }];

export const AFFILIATE_REL = "sponsored noopener";
export const PLAIN_REL = "nofollow noopener";
export const AFFILIATE_REFERRER_POLICY = "strict-origin-when-cross-origin" as const;

export interface OutboundLink {
  href: string;
  affiliate: boolean;
  rel: string;
  subId: string | null;
}

export function buildSubId(placement: Placement, slug: string) {
  return `${placement}-${slug}`;
}

export function findAffiliate(slug: string) {
  for (const programme of AFFILIATE_PROGRAMMES) {
    const product = programme.products.find((p) => p.slug === slug);
    if (product) return { programme, product };
  }
  return null;
}

export function hasAffiliateLink(slug: string) {
  return findAffiliate(slug) !== null;
}

export function getOutboundLink(software: { slug: string; website: string }, placement: Placement): OutboundLink {
  const match = findAffiliate(software.slug);
  if (!match) {
    return { href: software.website, affiliate: false, rel: PLAIN_REL, subId: null };
  }
  const subId = buildSubId(placement, software.slug);
  const url = new URL(match.product.url);
  url.searchParams.set(match.programme.subIdParam, subId);
  return { href: url.toString(), affiliate: true, rel: AFFILIATE_REL, subId };
}
