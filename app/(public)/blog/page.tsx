import type { Metadata } from "next";
import Link from "next/link";
import { BookOpen } from "lucide-react";
import { SectionHeader } from "@/components/public/section-heading";
import { ArticleCover } from "@/components/public/article-cover";
import { formatDate } from "@/lib/format";
import { getArticles } from "@/lib/queries/content";
import { JsonLd, breadcrumbSchema, buildMetadata } from "@/lib/seo";
import { cn } from "@/lib/utils";

export const revalidate = 3600;

export const metadata: Metadata = buildMetadata({
  title: "Buying guides and compliance explainers",
  description: "Plain language guides to VAT201, EMP201, POPIA and choosing business software in South Africa.",
  path: "/blog",
  eyebrow: "Guides",
});

export default async function BlogIndex({ searchParams }: { searchParams: Promise<{ topic?: string }> }) {
  const { topic } = await searchParams;
  const articles = await getArticles();
  const topics = Array.from(new Map(articles.map((a) => [a.topic, a.topic_label])).entries());
  const featured = articles.find((a) => a.featured) ?? articles[0];
  const list = articles.filter((a) => a.slug !== featured?.slug && (!topic || a.topic === topic));

  const chip = (active: boolean) =>
    cn(
      "inline-flex h-10 items-center rounded-full px-4 text-[14px] font-medium transition",
      active ? "bg-ink text-white" : "bg-card text-ink ring-1 ring-inset ring-border-strong hover:bg-bone",
    );

  return (
    <div className="container-site">
      <JsonLd data={breadcrumbSchema([{ name: "Guides", path: "/blog" }])} />
      <SectionHeader
        icon={<BookOpen size={14} />}
        eyebrow={`${articles.length} guides`}
        title="Guides for South African rules"
        subtitle="How the returns work, what software should do about them, and the questions to ask before you sign."
      />

      {featured && !topic && (
        <Link href={`/blog/${featured.slug}`} className="group card-modern card-hover grid overflow-hidden md:grid-cols-[1.2fr_1fr]">
          <ArticleCover article={featured} large className="rounded-none" />
          <div className="flex flex-col p-6 md:p-10">
            <p className="eyebrow text-muted-foreground">Featured · {featured.topic_label}</p>
            <h2 className="mt-4 font-heading text-[26px] font-bold leading-tight tracking-[-0.02em] group-hover:underline md:text-[32px]">
              {featured.title}
            </h2>
            <p className="mt-3 text-[16px] leading-relaxed text-muted-foreground">{featured.excerpt}</p>
            <p className="mt-auto pt-6 text-[13.5px] text-muted-foreground">
              {featured.author.name} · {formatDate(featured.published_at)} · {featured.reading_minutes} min read
            </p>
          </div>
        </Link>
      )}

      <nav aria-label="Topics" className="mb-8 mt-12 flex flex-wrap gap-2">
        <Link href="/blog" className={chip(!topic)} aria-current={!topic ? "page" : undefined}>
          All topics
        </Link>
        {topics.map(([key, label]) => (
          <Link key={key} href={`/blog?topic=${key}`} className={chip(topic === key)} aria-current={topic === key ? "page" : undefined}>
            {label}
          </Link>
        ))}
      </nav>

      <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {(topic ? articles.filter((a) => a.topic === topic) : list).map((a) => (
          <li key={a.slug}>
            <article className="card-modern card-hover relative flex h-full flex-col overflow-hidden">
              <ArticleCover article={a} className="rounded-none" />
              <div className="flex flex-1 flex-col p-5">
                <p className="eyebrow text-muted-foreground">{a.topic_label}</p>
                <h3 className="mt-3 font-heading text-[18px] font-bold leading-snug">
                  <Link href={`/blog/${a.slug}`} className="stretched-link">
                    {a.title}
                  </Link>
                </h3>
                <p className="mt-2 line-clamp-3 text-[14.5px] leading-relaxed text-muted-foreground">{a.excerpt}</p>
                <p className="mt-auto pt-4 text-[13px] text-muted-foreground">
                  {a.author.name} · {formatDate(a.published_at)} · {a.reading_minutes} min read
                </p>
              </div>
            </article>
          </li>
        ))}
      </ul>
    </div>
  );
}
