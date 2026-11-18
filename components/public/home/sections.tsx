import Image from "next/image";
import Link from "next/link";
import { ArrowRight, BookOpen, Check, Quote, ReceiptText, Users } from "lucide-react";
import { SoftwareLogo } from "@/components/public/software-logo";
import { SectionIntro } from "@/components/public/section-heading";
import { ArticleCover } from "@/components/public/article-cover";
import { NewsletterForm } from "@/components/public/newsletter-form";
import { PriceTag } from "@/components/public/price";
import { AffiliateDisclosureNote } from "@/components/public/affiliate-link";
import { CtaButton } from "@/components/ui/button";
import { PriceCheckedStamp } from "@/components/ui/badge";
import { Flag, Stars } from "@/components/ui/misc";
import { COMPANY_SIZE_LABEL, formatDate, formatMoney, formatPriceLine, planPriceParts, softwarePriceParts } from "@/lib/format";
import { hasAffiliateLink } from "@/lib/affiliate";
import type { RankedSoftware } from "@/lib/ranking";
import type { Article, Review, Software } from "@/lib/types";
import { truncate } from "@/lib/utils";

/* 4. Top rated */
export function TopRated({ ranked, distributions }: { ranked: RankedSoftware[]; distributions: Record<string, number[]> }) {
  const anyAffiliate = ranked.some((r) => hasAffiliateLink(r.software.slug));
  return (
    <section aria-labelledby="top-rated" className="container-site reveal">
      <SectionIntro
        id="top-rated"
        eyebrow="Ranked by weighted average"
        title="The highest rated,"
        strong="fairly ranked"
        subtitle="Two hundred reviews at 4.4 tell you more than six at 4.8. Our ranking pulls small samples towards the average, so a handful of fans cannot buy the top spot."
        action={
          <CtaButton href="/software?sort=rating" variant="soft">
            See the full ranking
          </CtaButton>
        }
      />
      <ol className="tray grid gap-2 md:grid-cols-3">
        {ranked.slice(0, 3).map(({ software: s, rank }) => {
          const dist = distributions[s.slug] ?? [0, 0, 0, 0, 0];
          const total = dist.reduce((a, b) => a + b, 0) || 1;
          return (
            <li key={s.slug} className="tray-card relative flex flex-col bg-card p-6">
              <span className="font-heading text-[72px] font-bold leading-[0.9] tracking-[-0.05em] text-ink md:text-[96px]">{rank}</span>
              <div className="mt-6 flex items-center gap-3">
                <SoftwareLogo name={s.name} logo={s.logo} brandColor={s.brand_color} />
                <div>
                  <h3 className="font-heading text-[18px] font-bold leading-tight">
                    <Link href={`/software/${s.slug}`} className="stretched-link">
                      {s.name}
                    </Link>
                  </h3>
                  <Stars value={s.rating_overall ?? 0} size={13} count={s.review_count} />
                </div>
              </div>
              <div className="mt-5 flex h-2 overflow-hidden rounded-full bg-border" aria-label="Star distribution, five stars first">
                {[4, 3, 2, 1, 0].map((i) => (
                  <span
                    key={i}
                    className="bar-fill h-full"
                    style={{
                      width: `${(dist[i] / total) * 100}%`,
                      background: i >= 3 ? "var(--ink)" : i === 2 ? "var(--chart-3)" : "var(--chart-4)",
                    }}
                  />
                ))}
              </div>
            </li>
          );
        })}
      </ol>
      {anyAffiliate && <AffiliateDisclosureNote hasAffiliate className="mt-4" />}
    </section>
  );
}

/* 5. Newsletter */
export function NewsletterPanel({ categories }: { categories: { slug: string; name: string }[] }) {
  const promises = ["One email a month, never more", "Consent recorded as POPIA requires", "One click unsubscribe in every email"];
  return (
    <section aria-labelledby="newsletter-title" className="container-site reveal">
      <div className="on-dark relative isolate grid gap-10 overflow-hidden rounded-[40px] bg-panel p-7 text-on-panel sm:p-10 lg:grid-cols-2 lg:gap-16 lg:p-14">
        {/* The flag mown into a lawn, under a flat ink tint so the form stays easy to read */}
        <Image
          src="/images/flag-lawn.jpg"
          alt=""
          fill
          sizes="(min-width: 1440px) 1344px, 100vw"
          className="-z-20 object-cover object-[40%_42%]"
        />
        <div className="absolute inset-0 -z-10 bg-ink/[0.64]" aria-hidden="true" />
        <div>
          <p className="eyebrow text-on-panel-muted">Newsletter</p>
          <h2 id="newsletter-title" className="mt-4 font-heading text-[32px] font-normal leading-[1.04] tracking-[-0.03em] md:text-[40px]">
            The monthly brief, <strong className="font-bold text-yellow">nothing more</strong>
          </h2>
          <p className="mt-4 max-w-md text-[17px] leading-relaxed text-on-panel-muted">
            Price changes we caught, new products on the register and the SARS deadlines coming up. Written for people who
            run the books, not for marketers.
          </p>
          <ul className="mt-8 space-y-3">
            {promises.map((p) => (
              <li key={p} className="flex items-center gap-3 text-[15.5px]">
                <span className="inline-flex size-6 shrink-0 items-center justify-center rounded-full bg-yellow text-ink" aria-hidden="true">
                  <Check size={14} strokeWidth={3} />
                </span>
                {p}
              </li>
            ))}
          </ul>
        </div>
        <div className="lg:pt-2">
          <NewsletterForm categories={categories} />
        </div>
      </div>
    </section>
  );
}

/* 6. Review wall */
export function ReviewWall({
  reviews,
  softwareById,
  totals,
}: {
  reviews: Review[];
  softwareById: Map<string, Software>;
  totals: { reviews: number; products: number };
}) {
  // Deal round robin from up to twelve products so each row carries different logos.
  const byProduct = new Map<string, Review[]>();
  for (const r of reviews) {
    if (!softwareById.has(r.software_id)) continue;
    const list = byProduct.get(r.software_id) ?? [];
    list.push(r);
    byProduct.set(r.software_id, list);
  }
  const queues = Array.from(byProduct.values()).slice(0, 12);
  const dealt: Review[] = [];
  while (queues.some((q) => q.length)) for (const q of queues) if (q.length) dealt.push(q.shift()!);
  const rows: Review[][] = [[], [], []];
  dealt.forEach((r, i) => rows[i % 3].push(r));

  return (
    <section aria-labelledby="review-wall" className="reveal">
      <div className="on-dark full-bleed overflow-hidden rounded-[40px] bg-panel py-16 text-on-panel md:py-24">
        <div className="container-site text-center">
          <h2 id="review-wall" className="font-heading text-[30px] font-medium leading-[1.18] tracking-[-0.02em] md:text-[42px]">
            What owners <span className="text-yellow">actually say</span>
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-[17px] text-on-panel-muted">
            {totals.reviews} moderated reviews across {totals.products} products. Every one read by a person before it went live.
          </p>
        </div>
        <div className="mt-12 space-y-4">
          {rows.map((row, i) =>
            row.length ? (
              <div key={i} className="marquee marquee-mask marquee-scroller">
                <ul
                  className="marquee-track"
                  data-direction={i % 2 ? "reverse" : "forward"}
                  style={{ ["--marquee-duration" as string]: `${70 + i * 18}s` }}
                >
                  {[...row, ...row].map((r, j) => {
                    const s = softwareById.get(r.software_id)!;
                    return (
                      <li
                        key={`${r.id}-${j}`}
                        aria-hidden={j >= row.length || undefined}
                        className="w-[320px] shrink-0 rounded-[24px] border border-white/10 bg-white/[0.06] p-6"
                      >
                        <Quote size={28} className="text-yellow" aria-hidden="true" />
                        <p className="mt-3 font-heading text-[17px] font-bold leading-snug text-white">{r.title}</p>
                        <p className="mt-2 line-clamp-2 text-[14.5px] text-white/70">{r.pros}</p>
                        <Stars value={r.rating_overall} size={13} className="mt-4 [&_.font-heading]:text-white" />
                        <div className="mt-4 flex items-center gap-2.5 border-t border-white/10 pt-4">
                          <SoftwareLogo name={s.name} logo={s.logo} brandColor={s.brand_color} size="sm" />
                          <div className="min-w-0 text-[13px] leading-tight">
                            <p className="truncate font-semibold text-white">{s.name}</p>
                            <p className="flex items-center gap-1.5 text-white/65">
                              {r.reviewer_first_name}, {COMPANY_SIZE_LABEL[r.company_size]} staff
                              <Flag code={r.country} size={10} />
                            </p>
                          </div>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ) : null,
          )}
        </div>
      </div>
    </section>
  );
}

/* 7. Freshly checked */
export function FreshlyChecked({ products }: { products: Software[] }) {
  return (
    <section aria-labelledby="freshly-checked" className="container-site reveal">
      <SectionIntro
        id="freshly-checked"
        eyebrow="Freshly checked"
        title="Prices we"
        strong="confirmed this quarter"
        subtitle="A person opened the vendor's own pricing page and wrote down what it said. The yellow stamp carries the date."
        action={
          <CtaButton href="/prices" variant="soft">
            Everything we track
          </CtaButton>
        }
      />
      <ul className="grid gap-4 md:grid-cols-3">
        {products.map((s) => {
          const [latest, previous] = s.price_history;
          const note =
            previous && previous.price !== null && latest?.price !== null && latest
              ? `${latest.price > previous.price ? "Up" : latest.price < previous.price ? "Down" : "Unchanged"} from ${formatMoney(previous.price, previous.currency)} on ${formatDate(previous.date)}.`
              : "First check on our register.";
          return (
            <li key={s.slug} className="card-modern card-hover relative flex flex-col p-6">
              <PriceCheckedStamp date={s.price_checked_at} className="self-start" />
              <div className="mt-6 flex items-center gap-3">
                <SoftwareLogo name={s.name} logo={s.logo} brandColor={s.brand_color} />
                <h3 className="font-heading text-[18px] font-bold leading-tight">
                  <Link href={`/software/${s.slug}#pricing`} className="stretched-link">
                    {s.name}
                  </Link>
                </h3>
              </div>
              <div className="mt-5">
                <PriceTag parts={softwarePriceParts(s)} large />
                {s.starting_price === 0 && s.pricing_plans.some((p) => p.price && p.price > 0) && (
                  <p className="mt-1 text-[14px] font-medium text-ink">
                    Paid plans from {formatPriceLine(planPriceParts(s.pricing_plans.find((p) => p.price && p.price > 0)!, s.pricing_model))}
                  </p>
                )}
              </div>
              <p className="mt-2 text-[14px] text-muted-foreground">{note}</p>
              {s.pricing_note && <p className="mt-3 border-t border-border pt-3 text-[13.5px] text-muted-foreground">{truncate(s.pricing_note, 120)}</p>}
            </li>
          );
        })}
      </ul>
    </section>
  );
}

/* 8. Guides showcase */
export function GuidesShowcase({ articles, background }: { articles: Article[]; background: string | null }) {
  return (
    <section aria-labelledby="guides-showcase" className="reveal">
      <div className="on-dark full-bleed relative overflow-hidden rounded-[40px] bg-panel text-on-panel">
        {background ? (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={background} alt="" className="absolute inset-0 h-full w-full object-cover object-[62%_40%]" />
            <div className="absolute inset-0 bg-ink/[0.8]" aria-hidden="true" />
          </>
        ) : (
          <div
            className="absolute inset-0"
            style={{ background: "radial-gradient(60% 45% at 50% 0%, rgba(254,212,0,.16), transparent 70%)" }}
            aria-hidden="true"
          />
        )}
        <div className="container-site relative py-16 md:py-24">
          <div className="mx-auto max-w-2xl text-center">
            <p className="eyebrow text-on-panel-muted">Guides</p>
            <h2 id="guides-showcase" className="mt-4 font-heading text-[30px] font-medium leading-[1.18] tracking-[-0.02em] md:text-[42px]">
              Written for <span className="text-yellow">South African rules</span>, not borrowed ones
            </h2>
            <p className="mt-4 text-[17px] text-on-panel-muted">
              VAT201, EMP201, POPIA and the questions to ask before you sign. Plain language, checked against the source.
            </p>
          </div>
          <ul className="mt-14 grid gap-3 sm:grid-cols-2 lg:grid-cols-4 md:mt-24">
            {[...articles.filter((a) => a.featured), ...articles.filter((a) => !a.featured)].slice(0, 4).map((a) => (
              <li key={a.slug} className="group relative flex flex-col rounded-[24px] border border-white/10 bg-[#1c1c1e]/70 p-6 backdrop-blur-md transition hover:bg-[#26262a]/80">
                <ArticleCover article={a} className="-mx-2 -mt-2 mb-5 rounded-[16px]" />
                <p className="eyebrow text-yellow">{a.topic_label}</p>
                <h3 className="mt-3 font-heading text-[18px] font-bold leading-snug text-white">
                  <Link href={`/blog/${a.slug}`} className="stretched-link">
                    {a.title}
                  </Link>
                </h3>
                <div className="mt-auto flex items-center justify-between pt-6 text-[13.5px] text-on-panel-muted">
                  <span>{a.reading_minutes} min read</span>
                  <ArrowRight size={16} className="text-yellow transition-transform group-hover:translate-x-1" aria-hidden="true" />
                </div>
              </li>
            ))}
          </ul>
          <div className="mt-10 flex justify-center">
            <CtaButton href="/blog" variant="onDark">
              All guides
            </CtaButton>
          </div>
        </div>
      </div>
    </section>
  );
}

/* Guide library: every guide, grouped by the job the reader is doing */
const GUIDE_GROUPS = [
  { key: "software", title: "Choosing software", icon: BookOpen, topics: ["accounting", "crm", "erp", "project-management", "buying"], href: "/blog", more: "More buying guides" },
  { key: "tax", title: "Tax and SARS", icon: ReceiptText, topics: ["compliance"], href: "/blog?topic=compliance", more: "More on tax and SARS" },
  { key: "payroll", title: "Payroll and staff", icon: Users, topics: ["payroll", "hr"], href: "/blog?topic=payroll", more: "More on payroll" },
] as const;

export function GuideLibrary({ articles }: { articles: Article[] }) {
  return (
    <section aria-labelledby="guide-library" className="container-site reveal">
      <SectionIntro
        id="guide-library"
        eyebrow={`${articles.length} guides`}
        title="Answers to what South African owners"
        strong="search for most"
        subtitle="VAT registration, PAYE, the EMP201, minimum wage and which software to buy, written for local rules and checked against the source."
        action={<CtaButton href="/blog">All guides</CtaButton>}
      />
      <div className="grid gap-4 lg:grid-cols-3">
        {GUIDE_GROUPS.map((g) => {
          const list = articles.filter((a) => (g.topics as readonly string[]).includes(a.topic)).slice(0, 6);
          if (!list.length) return null;
          const Icon = g.icon;
          return (
            <div key={g.key} className="flex flex-col rounded-[24px] bg-card p-6 ring-1 ring-inset ring-border md:p-7">
              <div className="flex items-center gap-3">
                <span className="inline-flex size-9 items-center justify-center rounded-[10px] bg-yellow text-ink" aria-hidden="true">
                  <Icon size={17} />
                </span>
                <h3 className="font-heading text-[19px] font-bold">{g.title}</h3>
              </div>
              <ul className="mt-5 flex-1 divide-y divide-border">
                {list.map((a) => (
                  <li key={a.slug}>
                    <Link href={`/blog/${a.slug}`} className="group flex items-start justify-between gap-4 py-3.5">
                      <span className="text-[15px] font-medium leading-snug text-ink group-hover:underline group-hover:underline-offset-4">
                        {a.title}
                      </span>
                      <span className="mt-0.5 shrink-0 text-[12.5px] text-muted-foreground tabular">{a.reading_minutes} min</span>
                    </Link>
                  </li>
                ))}
              </ul>
              <Link href={g.href} className="mt-4 inline-flex items-center gap-1.5 text-[14px] font-semibold text-ink hover:underline hover:underline-offset-4">
                {g.more}
                <ArrowRight size={15} aria-hidden="true" />
              </Link>
            </div>
          );
        })}
      </div>
    </section>
  );
}
