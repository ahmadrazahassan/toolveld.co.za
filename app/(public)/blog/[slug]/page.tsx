import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SiteMark } from "@/components/public/site-mark";
import { ArticleBody } from "@/components/public/article-body";
import { FaqAccordion } from "@/components/public/faq-accordion";
import { ArticleCover } from "@/components/public/article-cover";
import { ProductCard } from "@/components/public/product-card";
import { NewsletterForm } from "@/components/public/newsletter-form";
import { AffiliateDisclosureNote } from "@/components/public/affiliate-link";
import { getCategories } from "@/lib/queries/categories";
import { getArticle, getArticles } from "@/lib/queries/content";
import { getSoftwareMap, toSummary } from "@/lib/queries/software";
import { hasAffiliateLink } from "@/lib/affiliate";
import { formatLongDate } from "@/lib/format";
import { JsonLd, articleSchema, breadcrumbSchema, buildMetadata, faqSchema } from "@/lib/seo";
import type { Software } from "@/lib/types";

export const revalidate = 3600;

export async function generateStaticParams() {
  return (await getArticles()).map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const a = await getArticle(slug);
  if (!a) return {};
  return buildMetadata({ title: a.title, description: a.excerpt, path: `/blog/${a.slug}`, eyebrow: a.topic_label, type: "article" });
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const a = await getArticle(slug);
  if (!a) notFound();
  const [all, map, categories] = await Promise.all([getArticles(), getSoftwareMap(), getCategories()]);
  const related = all.filter((x) => x.slug !== a.slug && (x.topic === a.topic || x.related_software.some((s) => a.related_software.includes(s)))).slice(0, 3);
  const products = a.related_software.map((s) => map.get(s)).filter((s): s is Software => Boolean(s));
  const toc = a.body.filter((b): b is Extract<typeof b, { type: "h2" }> => b.type === "h2");

  return (
    <article className="container-site">
      <JsonLd
        data={[
          articleSchema(a),
          breadcrumbSchema([
            { name: "Guides", path: "/blog" },
            { name: a.title, path: `/blog/${a.slug}` },
          ]),
          ...(a.faqs?.length ? [faqSchema(a.faqs)] : []),
        ]}
      />
      <header className="mx-auto max-w-3xl text-center">
        <Link href={`/blog?topic=${a.topic}`} className="eyebrow inline-flex rounded-full bg-bone px-3 py-2 text-ink ring-1 ring-inset ring-border-strong">
          {a.topic_label}
        </Link>
        <h1 className="mt-6 font-heading text-[36px] font-bold leading-[1.12] tracking-[-0.025em] md:text-[48px]">{a.title}</h1>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-x-3 gap-y-2 text-[14px] text-muted-foreground">
          <span className="inline-flex items-center gap-2 font-medium text-ink">
            <SiteMark showWordmark={false} />
            <span>
              <Link href="/about" className="hover:underline hover:underline-offset-2">
                {a.author.name}
              </Link>
              {a.author.role && a.author.role !== "Editorial team" && (
                <span className="font-normal text-muted-foreground">, {a.author.role.toLowerCase()}</span>
              )}
            </span>
          </span>
          <span aria-hidden="true">·</span>
          <span>
            Published <time dateTime={a.published_at}>{formatLongDate(a.published_at)}</time>
          </span>
          {a.updated_at !== a.published_at && (
            <>
              <span aria-hidden="true">·</span>
              <span>
                Updated <time dateTime={a.updated_at}>{formatLongDate(a.updated_at)}</time>
              </span>
            </>
          )}
          <span aria-hidden="true">·</span>
          <span>{a.reading_minutes} min read</span>
        </div>
      </header>

      <figure className="mx-auto mt-10 max-w-5xl">
        <ArticleCover article={a} large />
        {a.cover_credit && (
          <figcaption className="mt-2.5 text-right text-[12.5px] text-muted-foreground">
            Photo by{" "}
            <a href={a.cover_credit.url} target="_blank" rel="noopener" className="underline underline-offset-2 hover:text-ink">
              {a.cover_credit.name}
            </a>{" "}
            on{" "}
            <a href="https://unsplash.com/?utm_source=toolveld&utm_medium=referral" target="_blank" rel="noopener" className="underline underline-offset-2 hover:text-ink">
              Unsplash
            </a>
          </figcaption>
        )}
      </figure>

      <div className="mx-auto mt-12 grid max-w-6xl gap-12 lg:grid-cols-[220px_minmax(0,1fr)]">
        <aside className="hidden lg:block">
          {toc.length > 0 && (
            <nav aria-label="Contents" className="sticky top-28">
              <p className="eyebrow mb-4 text-muted-foreground">Contents</p>
              <ol className="space-y-2 border-l border-border-strong">
                {toc.map((h) => (
                  <li key={h.id}>
                    <a href={`#${h.id}`} className="-ml-px block border-l-2 border-transparent py-1 pl-4 text-[14px] text-muted-foreground hover:border-ink hover:text-ink">
                      {h.text}
                    </a>
                  </li>
                ))}
                {a.faqs?.length ? (
                  <li>
                    <a href="#questions" className="-ml-px block border-l-2 border-transparent py-1 pl-4 text-[14px] text-muted-foreground hover:border-ink hover:text-ink">
                      Questions people ask
                    </a>
                  </li>
                ) : null}
              </ol>
            </nav>
          )}
        </aside>
        <div className="min-w-0 max-w-[720px]">
          <ArticleBody blocks={a.body} lead />

          {a.faqs?.length ? (
            <section aria-labelledby="questions" className="mt-16">
              <h2 id="questions" className="mb-4 font-heading text-[26px] font-bold tracking-[-0.02em]">
                Questions people ask
              </h2>
              <FaqAccordion faqs={a.faqs} />
            </section>
          ) : null}

          {products.length > 0 && (
            <section aria-labelledby="mentioned" className="mt-16 border-t border-border-strong pt-10">
              <h2 id="mentioned" className="font-heading text-[24px] font-bold">Products in this guide</h2>
              <ul className="mt-6 grid gap-4 sm:grid-cols-2">
                {products.map((p) => (
                  <li key={p.slug}>
                    <ProductCard software={toSummary(p)} placement="directory" />
                  </li>
                ))}
              </ul>
              <AffiliateDisclosureNote hasAffiliate={products.some((p) => hasAffiliateLink(p.slug))} className="mt-4" />
            </section>
          )}

          <section aria-labelledby="article-newsletter" className="mt-16 rounded-[28px] bg-card p-6 ring-1 ring-inset ring-border md:p-8">
            <h2 id="article-newsletter" className="font-heading text-[24px] font-bold">
              Get the next guide in the monthly brief
            </h2>
            <p className="mb-6 mt-2 text-[15px] text-muted-foreground">One email a month. Unsubscribe with one click.</p>
            <NewsletterForm categories={categories.map((c) => ({ slug: c.slug, name: c.name }))} tone="light" />
          </section>
        </div>
      </div>

      {related.length > 0 && (
        <section aria-labelledby="related" className="mx-auto mt-20 max-w-6xl border-t border-border-strong pt-12">
          <h2 id="related" className="mb-6 font-heading text-[26px] font-bold">Keep reading</h2>
          <ul className="grid gap-4 md:grid-cols-3">
            {related.map((r) => (
              <li key={r.slug} className="card-modern card-hover relative p-5">
                <p className="eyebrow text-muted-foreground">{r.topic_label}</p>
                <h3 className="mt-3 font-heading text-[17px] font-bold leading-snug">
                  <Link href={`/blog/${r.slug}`} className="stretched-link">
                    {r.title}
                  </Link>
                </h3>
                <p className="mt-3 text-[13px] text-muted-foreground">{r.reading_minutes} min read</p>
              </li>
            ))}
          </ul>
        </section>
      )}
    </article>
  );
}
