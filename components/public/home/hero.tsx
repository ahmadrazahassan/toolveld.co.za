import Image from "next/image";
import Link from "next/link";
import { Search } from "lucide-react";
import { CategoryIcon } from "@/components/public/category-icon";
import { HeroPriceBoard, type HeroBoard } from "@/components/public/home/hero-board";
import { PriceCheckedStamp } from "@/components/ui/badge";
import { Flag } from "@/components/ui/misc";
import { MARKET_ADJECTIVE, MARKET_FLAG } from "@/lib/site";
import type { CategoryWithCount } from "@/lib/queries/categories";
import type { HeroImage } from "@/lib/server-assets";

/**
 * Full bleed hero. The city photo fills the whole section and sits under the header. Three
 * layers keep every word legible: a dark wash from the left behind the copy, a dark band at
 * the top behind the navigation, and a long fade at the bottom into the page colour.
 */
export function HomeHero({
  hero,
  boards,
  checkedOn,
  categories,
}: {
  hero: HeroImage;
  boards: HeroBoard[];
  checkedOn: string | null;
  categories: CategoryWithCount[];
}) {
  return (
    <section aria-labelledby="hero-title" className="on-dark relative isolate -mt-24 sm:-mt-28">
      <div className="absolute inset-0 -z-20 overflow-hidden bg-ink">
        <Image
          src={hero.src}
          alt={hero.alt}
          fill
          priority
          sizes="100vw"
          className="object-cover object-[50%_60%]"
          unoptimized={hero.placeholder}
          placeholder={hero.blur ? "blur" : "empty"}
          blurDataURL={hero.blur ?? undefined}
        />
        {/* Legibility washes */}
        <div className="absolute inset-0 bg-ink/55 lg:bg-transparent lg:bg-[linear-gradient(90deg,rgba(19,19,21,.9)_0%,rgba(19,19,21,.74)_38%,rgba(19,19,21,.35)_68%,rgba(19,19,21,.2)_100%)]" aria-hidden="true" />
        <div className="absolute inset-x-0 top-0 h-48 bg-[linear-gradient(180deg,rgba(19,19,21,.7),rgba(19,19,21,0))]" aria-hidden="true" />
      </div>
      {/* Bottom blend into the page. It overhangs the section edge so no seam shows. */}
      <div
        className="pointer-events-none absolute inset-x-0 -bottom-1.5 -z-10 h-64 bg-[linear-gradient(180deg,rgba(241,241,241,0)_0%,rgba(241,241,241,.06)_20%,rgba(241,241,241,.3)_45%,rgba(241,241,241,.7)_68%,rgba(241,241,241,.94)_86%,#f1f1f1_96%)]"
        aria-hidden="true"
      />

      <div className="container-site grid grid-cols-1 items-center gap-12 pb-44 pt-36 sm:pt-44 lg:grid-cols-[minmax(0,1fr)_minmax(0,500px)] lg:gap-14 lg:pb-52 lg:pt-48 xl:grid-cols-[minmax(0,1fr)_540px] xl:gap-24">
        <div>
          <span className="inline-flex items-center gap-2 rounded-[10px] bg-white/10 px-3 py-1.5 text-[13px] font-medium text-white shadow-[inset_0_0_0_1px_rgba(255,255,255,.22)] backdrop-blur-md">
            <Flag code={MARKET_FLAG} size={12} />
            Software for {MARKET_ADJECTIVE} business
          </span>
          <h1
            id="hero-title"
            className="mt-6 font-heading text-[42px] font-bold leading-[0.98] tracking-[-0.04em] text-white [text-shadow:0_2px_24px_rgba(0,0,0,.35)] sm:text-[58px] xl:text-[72px]"
          >
            Every tool compared, <span className="text-yellow">every price</span> in rand.
          </h1>
          <p className="mt-6 max-w-[560px] text-[17px] leading-[1.6] text-white/85 [text-shadow:0_1px_12px_rgba(0,0,0,.4)] md:text-[18.5px]">
            Accounting, payroll, HR, CRM, ERP and project software, checked against SARS, POPIA and the BCEA, with every
            price showing whether VAT is in it.
          </p>

          <form action="/search" role="search" className="relative mt-9 max-w-[580px]">
            <label htmlFor="hero-search" className="sr-only">
              Search software
            </label>
            <Search size={20} className="pointer-events-none absolute left-5 top-1/2 z-[1] -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
            <input
              id="hero-search"
              name="q"
              type="search"
              placeholder="Search Xero, payroll, VAT201..."
              className="h-16 w-full rounded-[18px] border border-white/20 bg-card pl-14 pr-32 text-[16px] text-ink shadow-[0_20px_44px_-18px_rgba(0,0,0,.6)] placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow"
            />
            <button
              type="submit"
              className="btn-gloss gloss-ink btn-label absolute right-2 top-1/2 inline-flex h-12 -translate-y-1/2 items-center rounded-[11px] px-5 text-[12px]"
            >
              Search
            </button>
          </form>

          <div className="mt-5 flex flex-wrap items-center gap-2">
            <span className="mr-1 text-[13px] text-white/70">Popular</span>
            {categories.map((c) => (
              <Link
                key={c.slug}
                href={`/category/${c.slug}`}
                className="inline-flex h-9 items-center gap-1.5 rounded-full bg-white/[0.08] px-3.5 text-[13.5px] font-medium text-white shadow-[inset_0_0_0_1px_rgba(255,255,255,.22)] backdrop-blur-md transition-colors hover:bg-white hover:text-ink"
              >
                <CategoryIcon name={c.icon} size={15} />
                {c.name}
              </Link>
            ))}
          </div>
        </div>

        <div className="relative">
          {checkedOn && (
            <div className="mb-3 flex justify-end">
              <PriceCheckedStamp date={checkedOn} className="shadow-[0_8px_20px_-8px_rgba(0,0,0,.6)]" />
            </div>
          )}
          <HeroPriceBoard boards={boards} />
        </div>
      </div>
    </section>
  );
}
