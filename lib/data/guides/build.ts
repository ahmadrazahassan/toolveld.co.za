import { EDITORIAL_AUTHOR } from "@/lib/site";
import type { Article, ArticleBlock, FAQ } from "@/lib/types";

export const desk = { name: EDITORIAL_AUTHOR.name, role: EDITORIAL_AUTHOR.role, photo: null };

/** Date the 2026 guide series was researched and published. */
export const SERIES_DATE = "2026-11-17";

function blockText(b: ArticleBlock): string {
  switch (b.type) {
    case "p":
    case "h2":
    case "h3":
      return b.text;
    case "ul":
    case "ol":
      return b.items.join(" ");
    case "table":
      return [...b.head, ...b.rows.flat()].join(" ");
    case "callout":
      return `${b.title} ${b.text}`;
  }
}

/** Reading time at about 220 words a minute, counting the FAQ answers too. */
export function readingMinutes(body: ArticleBlock[], faqs: FAQ[] = []) {
  const text = [...body.map(blockText), ...faqs.map((f) => `${f.question} ${f.answer}`)].join(" ").replace(/\]\([^)]*\)/g, "]");
  const words = text.split(/\s+/).filter(Boolean).length;
  return Math.max(3, Math.round(words / 220));
}

type GuideInput = Omit<Article, "author" | "reading_minutes" | "cover" | "status" | "featured" | "published_at" | "updated_at"> & {
  featured?: boolean;
  cover?: string | null;
  published_at?: string;
  updated_at?: string;
};

export function guide(input: GuideInput): Article {
  return {
    author: desk,
    cover: null,
    status: "published",
    featured: false,
    published_at: SERIES_DATE,
    updated_at: SERIES_DATE,
    ...input,
    reading_minutes: readingMinutes(input.body, input.faqs),
  };
}
