import type { Metadata } from "next";
import Link from "next/link";
import { Compass } from "lucide-react";
import { SectionHeader } from "@/components/public/section-heading";
import { SoftwareLogo } from "@/components/public/software-logo";
import { VisitButton, AffiliateDisclosureNote } from "@/components/public/affiliate-link";
import { CtaButton } from "@/components/ui/button";
import { getCategories } from "@/lib/queries/categories";
import { getAllSoftware } from "@/lib/queries/software";
import { BUDGETS, runFinder } from "@/lib/finder";
import { hasAffiliateLink } from "@/lib/affiliate";
import { COMPANY_SIZE_LABEL } from "@/lib/format";
import { COMPLIANCE_CHECKLIST } from "@/lib/site";
import { buildMetadata } from "@/lib/seo";
import type { CompanySize, ComplianceKey } from "@/lib/types";
import { cn } from "@/lib/utils";

export const metadata: Metadata = buildMetadata({
  title: "Which one fits? Software finder",
  description: "Four questions about your business, three products that fit, and the reasons for each. No AI and no invented scores.",
  path: "/finder",
  eyebrow: "Finder",
});

type SP = Promise<Record<string, string | string[] | undefined>>;

const pill =
  "inline-flex cursor-pointer items-center rounded-full px-4 py-2.5 text-[14.5px] font-medium ring-1 ring-inset ring-border-strong transition hover:bg-bone has-[:checked]:bg-ink has-[:checked]:text-white has-[:checked]:ring-ink has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-ink";

export default async function FinderPage({ searchParams }: { searchParams: SP }) {
  const sp = await searchParams;
  const [categories, software] = await Promise.all([getCategories(), getAllSoftware()]);
  const category = typeof sp.category === "string" ? sp.category : "";
  const size = (typeof sp.size === "string" && sp.size in COMPANY_SIZE_LABEL ? sp.size : "") as CompanySize | "";
  const budget = Number(sp.budget ?? -1);
  const must = (Array.isArray(sp.must) ? sp.must : sp.must ? [sp.must] : []).filter((k): k is ComplianceKey =>
    COMPLIANCE_CHECKLIST.some((c) => c.key === k),
  );
  const ready = Boolean(category && size && budget >= 0);
  const results = ready ? runFinder(software, { category, size: size as CompanySize, budget, mustHave: must }) : [];
  const selectedCat = categories.find((c) => c.slug === category);
  const focusItems = COMPLIANCE_CHECKLIST.filter((c) => (selectedCat ? selectedCat.compliance_focus.includes(c.key) : true));

  return (
    <div className="container-site">
      <SectionHeader
        icon={<Compass size={14} />}
        eyebrow="Which one fits?"
        title="Four questions, three good fits"
        subtitle="Answer for your business and we filter the register by hand written rules. Every result shows its reasons. No AI and no invented scores."
      />

      <form action="/finder" method="get" className="card-modern mx-auto max-w-4xl space-y-10 p-6 md:p-10">
        <fieldset>
          <legend className="font-heading text-[19px] font-bold">1. What do you need?</legend>
          <div className="mt-4 flex flex-wrap gap-2">
            {categories.map((c) => (
              <label key={c.slug} className={pill}>
                <input type="radio" name="category" value={c.slug} defaultChecked={category === c.slug} required className="sr-only" />
                {c.name}
              </label>
            ))}
          </div>
        </fieldset>
        <fieldset>
          <legend className="font-heading text-[19px] font-bold">2. How many people will it cover?</legend>
          <div className="mt-4 flex flex-wrap gap-2">
            {Object.entries(COMPANY_SIZE_LABEL).map(([v, l]) => (
              <label key={v} className={pill}>
                <input type="radio" name="size" value={v} defaultChecked={size === v} required className="sr-only" />
                {l}
              </label>
            ))}
          </div>
        </fieldset>
        <fieldset>
          <legend className="font-heading text-[19px] font-bold">3. What is your monthly budget?</legend>
          <div className="mt-4 flex flex-wrap gap-2">
            {BUDGETS.map((b) => (
              <label key={b.value} className={pill}>
                <input type="radio" name="budget" value={b.value} defaultChecked={budget === b.value} required className="sr-only" />
                {b.label}
              </label>
            ))}
          </div>
        </fieldset>
        <fieldset>
          <legend className="font-heading text-[19px] font-bold">4. Which local rules must it cover?</legend>
          <p className="mt-1 text-[14px] text-muted-foreground">Optional. Products that do not cover every rule you tick are left out.</p>
          <div className="mt-4 flex flex-wrap gap-2">
            {focusItems.map((c) => (
              <label key={c.key} className={pill}>
                <input type="checkbox" name="must" value={c.key} defaultChecked={must.includes(c.key)} className="sr-only" />
                {c.label}
              </label>
            ))}
          </div>
        </fieldset>
        <CtaButton type="submit" size="lg">
          Show my fits
        </CtaButton>
      </form>

      {ready && (
        <section aria-labelledby="fits" className="mx-auto mt-14 max-w-5xl">
          <h2 id="fits" className="mb-6 font-heading text-[28px] font-bold tracking-[-0.02em]">
            {results.length ? `Your top ${results.length}` : "No product fits every answer"}
          </h2>
          {results.length === 0 ? (
            <p className="text-[16px] text-muted-foreground">
              Try unticking a rule or raising the budget. Rules marked not yet confirmed on a profile do not count as covered.
            </p>
          ) : (
            <ol className="grid gap-4 md:grid-cols-3">
              {results.map((r, i) => (
                <li key={r.software.slug} className={cn("card-modern relative flex flex-col p-6", i === 0 && "ring-2 ring-ink")}>
                  <span className="font-heading text-[56px] font-bold leading-[0.9] tracking-[-0.05em]">{i + 1}</span>
                  <div className="mt-4 flex items-center gap-3">
                    <SoftwareLogo name={r.software.name} logo={r.software.logo} brandColor={r.software.brand_color} />
                    <h3 className="font-heading text-[19px] font-bold">
                      <Link href={`/software/${r.software.slug}`} className="hover:underline">
                        {r.software.name}
                      </Link>
                    </h3>
                  </div>
                  <ul className="mt-4 space-y-2 text-[14.5px]">
                    {r.reasons.map((reason) => (
                      <li key={reason} className="flex gap-2.5">
                        <span className="mt-2 size-1.5 shrink-0 rounded-full bg-ink" aria-hidden="true" />
                        {reason}
                      </li>
                    ))}
                  </ul>
                  <div className="mt-auto flex flex-wrap gap-2 pt-6">
                    <CtaButton href={`/software/${r.software.slug}`} size="sm">
                      Read review
                    </CtaButton>
                    <VisitButton software={r.software} placement="finder" />
                  </div>
                </li>
              ))}
            </ol>
          )}
          <AffiliateDisclosureNote hasAffiliate={results.some((r) => hasAffiliateLink(r.software.slug))} className="mt-5" />
          <p className="mt-3 text-[13px] text-muted-foreground">
            Costs use each product&apos;s starting price for your team size, converted to rand at our stated rate and shown including VAT.
            Quoted products have no public price, so check with the vendor.
          </p>
        </section>
      )}
    </div>
  );
}
