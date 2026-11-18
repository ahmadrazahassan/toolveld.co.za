import { describe, expect, it } from "vitest";
import { allSoftware } from "@/lib/data/software";
import { categories } from "@/lib/data/categories";
import { comparisons } from "@/lib/data/comparisons";
import { articles } from "@/lib/data/articles";
import { pages } from "@/lib/data/pages";
import { buildSoftwareFaqs } from "@/lib/faq";
import { parseResourceForm, RESOURCES } from "@/lib/admin/resources";

const slugs = new Set(allSoftware.map((s) => s.slug));

describe("bundled dataset", () => {
  it("never ships invented ratings or reviews", () => {
    for (const s of allSoftware) {
      expect(s.review_count).toBe(0);
      expect(s.rating_overall).toBeNull();
      expect(s.rating_ease).toBeNull();
      expect(s.rating_value).toBeNull();
      expect(s.rating_service).toBeNull();
      expect(s.rating_functionality).toBeNull();
    }
  });

  it("has unique slugs and valid categories", () => {
    expect(slugs.size).toBe(allSoftware.length);
    const cats = new Set(categories.map((c) => c.slug));
    for (const s of allSoftware) expect(cats.has(s.category)).toBe(true);
  });

  it("points alternatives and comparisons at real products, and every comparison names a winner", () => {
    for (const s of allSoftware) for (const a of s.alternatives) expect(slugs.has(a), `${s.slug} -> ${a}`).toBe(true);
    for (const c of comparisons) {
      expect(slugs.has(c.a)).toBe(true);
      expect(slugs.has(c.b)).toBe(true);
      expect([c.a, c.b]).toContain(c.winner);
      expect(c.slug).toBe(`${c.a}-vs-${c.b}`);
    }
  });

  it("only marks a price as checked when there is a price history entry", () => {
    for (const s of allSoftware) {
      if (s.price_checked_at) expect(s.price_history.length).toBeGreaterThan(0);
      else expect(s.price_history.length).toBe(0);
    }
  });

  it("never invents a logo file path that does not exist", async () => {
    const { existsSync } = await import("node:fs");
    for (const s of allSoftware) if (s.logo) expect(existsSync(`public${s.logo}`), s.logo).toBe(true);
  });
});

describe("copy rules", () => {
  const BANNED = [/\bseamless/i, /\bempower/i, /\bunlock/i, /\belevate/i, /game changer/i, /\bjourney\b/i, /\bleverag(e|ing)\b/i, /cutting edge/i, /trusted by thousands/i, /fast paced world/i, /\bsolutions?\b/i, /\bverified review/i];

  function strings(value: unknown, out: string[] = []): string[] {
    if (typeof value === "string") out.push(value);
    else if (Array.isArray(value)) value.forEach((v) => strings(v, out));
    else if (value && typeof value === "object")
      Object.entries(value).forEach(([k, v]) => {
        // Anchor ids, block types and legal company names are not copy.
        if (!["id", "type", "company", "reviewed_at", "url"].includes(k)) strings(v, out);
      });
    return out;
  }

  const copy = [
    ...allSoftware.flatMap((s) =>
      strings([s.name, s.tagline, s.short_description, s.description, s.pricing_note, s.top_features, s.features, s.pricing_plans, s.pricing_addons, s.vendor, s.compliance, s.review]),
    ),
    ...strings(categories.map((c) => [c.name, c.plural_label, c.description, c.long_intro, c.faqs])),
    ...strings(comparisons.map((c) => [c.verdict, c.pick_other_if])),
    ...strings(articles.map((a) => [a.title, a.excerpt, a.body, a.faqs])),
    ...strings(pages.map((p) => [p.title, p.description, p.body])),
  ].filter((t) => !/^https?:\/\//.test(t));

  it("uses no em dashes, en dashes or hyphen punctuation", () => {
    const offenders = copy.filter((t) => /[–—]|\s-\s|\w-\w/.test(t.replace(/\]\([^)]*\)/g, "]").replace(/\b[a-z0-9]+(-[a-z0-9]+)+\b(?=")/g, "")));
    // Slugs inside copy are not allowed either, so this list must be empty.
    expect(offenders).toEqual([]);
  });

  it("avoids the banned words", () => {
    const offenders = copy.filter((t) => BANNED.some((re) => re.test(t)));
    expect(offenders).toEqual([]);
  });
});

describe("editorial reviews", () => {
  it("cover every product, with pros, cons and several sections", () => {
    for (const s of allSoftware) {
      expect(s.review, s.slug).toBeDefined();
      expect(s.review!.pros.length, s.slug).toBeGreaterThanOrEqual(2);
      expect(s.review!.cons.length, s.slug).toBeGreaterThanOrEqual(2);
      expect(s.review!.sections.length, s.slug).toBeGreaterThanOrEqual(1);
      expect(s.review!.verdict.length, s.slug).toBeGreaterThan(80);
    }
  });

  it("give the Sage range the deepest treatment", () => {
    const sage = allSoftware.filter((s) => s.vendor.company === "The Sage Group plc");
    expect(sage.length).toBeGreaterThanOrEqual(10);
    for (const s of sage) expect(s.review!.sections.length, s.slug).toBeGreaterThanOrEqual(3);
  });

  it("never carry an editorial star rating", () => {
    for (const s of allSoftware) expect(JSON.stringify(s.review)).not.toMatch(/"(score|stars|rating)":/);
  });
});

describe("generated FAQs", () => {
  it("state the VAT basis and name compliance gaps from the record", () => {
    const xero = allSoftware.find((s) => s.slug === "xero")!;
    const cat = categories.find((c) => c.slug === "accounting")!;
    const faqs = buildSoftwareFaqs(xero, cat);
    const cost = faqs.find((f) => f.question.includes("cost"))!;
    expect(cost.answer).toContain("incl VAT");
    const local = faqs.find((f) => f.question.includes("requirements"))!;
    expect(local.answer).toContain("Gaps: SARS eFiling");
  });
});

describe("admin registry", () => {
  it("never lets a form write aggregate rating fields", () => {
    for (const r of RESOURCES) {
      for (const f of r.fields) expect(f.name).not.toMatch(/^rating_|review_count/);
    }
    const software = RESOURCES.find((r) => r.key === "software")!;
    const fd = new FormData();
    fd.set("rating_overall", "5");
    fd.set("review_count", "999");
    const { row } = parseResourceForm(software, fd, false);
    expect(row).not.toHaveProperty("rating_overall");
    expect(row).not.toHaveProperty("review_count");
  });
});

describe("guides", () => {
  const blogSlugs = new Set(articles.map((a) => a.slug));
  const compareSlugs = new Set(comparisons.map((c) => c.slug));
  const categorySlugs = new Set<string>(categories.map((c) => c.slug));
  const STATIC = new Set(["/prices", "/finder", "/software", "/categories", "/compare", "/blog", "/about", "/contact", "/newsletter", "/sage"]);

  function linksIn(value: unknown, out: string[] = []): string[] {
    if (typeof value === "string") for (const m of value.matchAll(/\]\((\/[^)\s]*)\)/g)) out.push(m[1]);
    else if (Array.isArray(value)) value.forEach((v) => linksIn(v, out));
    else if (value && typeof value === "object") Object.values(value).forEach((v) => linksIn(v, out));
    return out;
  }

  it("has unique slugs", () => {
    expect(blogSlugs.size).toBe(articles.length);
  });

  it("gives every guide a cover file that exists, with alt text and a credit", async () => {
    const { existsSync } = await import("node:fs");
    for (const a of articles) {
      expect(a.cover, a.slug).toBeTruthy();
      expect(existsSync(`public${a.cover}`), a.slug).toBe(true);
      expect(a.cover_alt, a.slug).toBeTruthy();
      expect(a.cover_credit?.url, a.slug).toMatch(/^https:\/\/unsplash\.com\//);
    }
  });

  it("only links to pages that exist", () => {
    for (const a of articles) {
      for (const href of linksIn([a.body, a.faqs])) {
        const [, section, slug] = href.split("/");
        const ok =
          STATIC.has(href) ||
          (section === "software" && slugs.has(slug)) ||
          (section === "blog" && blogSlugs.has(slug)) ||
          (section === "compare" && compareSlugs.has(slug)) ||
          (section === "category" && categorySlugs.has(slug));
        expect(ok, `${a.slug} links to ${href}`).toBe(true);
      }
      for (const s of a.related_software) expect(slugs.has(s), `${a.slug} relates ${s}`).toBe(true);
    }
  });

  it("gives every 2026 guide an FAQ and a search length description", () => {
    for (const a of articles.filter((x) => x.published_at === "2026-11-17")) {
      expect(a.faqs?.length ?? 0, a.slug).toBeGreaterThanOrEqual(3);
      expect(a.excerpt.length, a.slug).toBeLessThanOrEqual(200);
    }
  });
});
