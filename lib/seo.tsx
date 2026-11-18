import type { Metadata } from "next";
import {
  CONTACT_EMAIL,
  CONTACT_PHONE,
  OG_LOCALE,
  SITE_ADDRESS,
  SITE_DESCRIPTION,
  SITE_NAME,
  SITE_URL,
  SOCIAL_LINKS,
} from "@/lib/site";
import { hasPublicRating } from "@/lib/reviews-policy";
import type { Article, FAQ, Software } from "@/lib/types";

export function absoluteUrl(path = "/") {
  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

export function ogImageUrl(title: string, eyebrow?: string) {
  const params = new URLSearchParams({ title });
  if (eyebrow) params.set("eyebrow", eyebrow);
  return `/api/og?${params.toString()}`;
}

export function buildMetadata(input: {
  title?: string;
  description?: string;
  path: string;
  eyebrow?: string;
  type?: "website" | "article";
  noindex?: boolean;
}): Metadata {
  const description = input.description ?? SITE_DESCRIPTION;
  const image = ogImageUrl(input.title ?? SITE_NAME, input.eyebrow);
  return {
    title: input.title,
    description,
    alternates: { canonical: input.path },
    openGraph: {
      type: input.type ?? "website",
      url: input.path,
      siteName: SITE_NAME,
      locale: OG_LOCALE,
      title: input.title ?? SITE_NAME,
      description,
      images: [{ url: image, width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      title: input.title ?? SITE_NAME,
      description,
      images: [image],
    },
    robots: input.noindex ? { index: false, follow: false } : undefined,
  };
}

export function JsonLd({ data }: { data: Record<string, unknown> | Record<string, unknown>[] }) {
  return (
    <script
      type="application/ld+json"
      // JSON.stringify output with "<" escaped cannot break out of the script tag.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}

export function organizationSchema() {
  const sameAs = Object.values(SOCIAL_LINKS).filter(Boolean);
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE_NAME,
    url: SITE_URL,
    logo: absoluteUrl("/icon.svg"),
    email: CONTACT_EMAIL,
    ...(CONTACT_PHONE ? { telephone: CONTACT_PHONE } : {}),
    address: {
      "@type": "PostalAddress",
      ...(SITE_ADDRESS.street ? { streetAddress: SITE_ADDRESS.street } : {}),
      addressLocality: SITE_ADDRESS.locality,
      addressRegion: SITE_ADDRESS.region,
      postalCode: SITE_ADDRESS.postalCode,
      addressCountry: SITE_ADDRESS.country,
    },
    ...(sameAs.length ? { sameAs } : {}),
  };
}

export function websiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    url: SITE_URL,
    potentialAction: {
      "@type": "SearchAction",
      target: { "@type": "EntryPoint", urlTemplate: `${SITE_URL}/search?q={search_term_string}` },
      "query-input": "required name=search_term_string",
    },
  };
}

export function breadcrumbSchema(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [{ name: "Home", path: "/" }, ...items].map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

export function faqSchema(faqs: FAQ[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: { "@type": "Answer", text: f.answer },
    })),
  };
}

export function softwareSchema(s: Software, categoryName: string) {
  const offers =
    s.starting_price !== null
      ? {
          offers: {
            "@type": "Offer",
            price: s.starting_price,
            priceCurrency: s.currency,
            url: s.website,
          },
        }
      : {};
  const rating = hasPublicRating(s)
    ? {
        aggregateRating: {
          "@type": "AggregateRating",
          ratingValue: s.rating_overall,
          reviewCount: s.review_count,
          bestRating: 5,
          worstRating: 1,
        },
      }
    : {};
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: s.name,
    description: s.short_description,
    applicationCategory: "BusinessApplication",
    applicationSubCategory: categoryName,
    operatingSystem: s.deployment === "desktop" ? "Windows" : "Web",
    url: absoluteUrl(`/software/${s.slug}`),
    ...(s.logo ? { image: absoluteUrl(s.logo) } : {}),
    publisher: { "@type": "Organization", name: s.vendor.company },
    ...offers,
    ...rating,
  };
}

export function articleSchema(a: Article) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: a.title,
    description: a.excerpt,
    datePublished: a.published_at,
    dateModified: a.updated_at,
    author: { "@type": a.author.photo ? "Person" : "Organization", name: a.author.name },
    publisher: { "@type": "Organization", name: SITE_NAME, logo: { "@type": "ImageObject", url: absoluteUrl("/icon.svg") } },
    image: a.cover ? [absoluteUrl(a.cover), absoluteUrl(ogImageUrl(a.title, a.topic_label))] : absoluteUrl(ogImageUrl(a.title, a.topic_label)),
    mainEntityOfPage: absoluteUrl(`/blog/${a.slug}`),
  };
}
