import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Info, Scale, ShieldCheck, Users } from "lucide-react";
import { SectionHeader, SectionIntro } from "@/components/public/section-heading";
import { ComplianceMark } from "@/components/public/compliance-list";
import { CtaButton } from "@/components/ui/button";
import { getAllSoftware } from "@/lib/queries/software";
import { getCategories } from "@/lib/queries/categories";
import {
  COMPANY_REGISTRATION,
  COMPLIANCE_CHECKLIST,
  CONTACT_EMAIL,
  CONTACT_PHONE,
  MIN_PUBLIC_REVIEWS,
  PRIVACY_EMAIL,
  SITE_ADDRESS,
  SITE_FOUNDER,
  SITE_NAME,
  SITE_NAME_MEANING,
  TEAM,
} from "@/lib/site";
import { JsonLd, breadcrumbSchema, buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "About us",
  description: `Why ${SITE_NAME} exists, how we rate software and what we will not trade.`,
  path: "/about",
  eyebrow: "About",
});

const PRINCIPLES = [
  {
    icon: Scale,
    title: "Rankings before revenue",
    body: "Ratings come only from published reader reviews, and rankings are worked out by a fixed formula before any commercial relationship is considered. No vendor can pay to move up.",
  },
  {
    icon: ShieldCheck,
    title: "Every price shows the VAT",
    body: "A rand figure without its VAT basis is half a fact. Every price on the site says whether VAT is in it, and every checked price carries the date we checked it.",
  },
  {
    icon: Info,
    title: "Gaps stay visible",
    body: "If a product does not file your EMP501 or produce a VAT201, we say so on its profile. The gap is usually where the decision gets made.",
  },
];

export default async function AboutPage() {
  const [software, categories] = await Promise.all([getAllSoftware(), getCategories()]);
  return (
    <div className="container-site">
      <JsonLd data={breadcrumbSchema([{ name: "About", path: "/about" }])} />
      <SectionHeader
        icon={<Users size={14} />}
        eyebrow="About"
        title={`Why ${SITE_NAME} exists`}
        subtitle={`${SITE_NAME_MEANING} We built it because choosing business software in South Africa should not mean reading American reviews with dollar prices and US tax rules.`}
      />

      <figure className="relative mx-auto mb-14 aspect-[16/9] max-w-6xl overflow-hidden rounded-[28px] bg-bone sm:aspect-[21/8] md:mb-20 md:rounded-[36px]">
        <Image
          src="/images/cape-town-flag-building.jpg"
          alt="An apartment block in Cape Town painted with the South African flag, behind palm trees on a city street"
          fill
          priority
          sizes="(min-width: 1280px) 1152px, 100vw"
          className="object-cover object-[52%_40%]"
        />
      </figure>

      <div className="prose-site mx-auto max-w-3xl">
        <p className="lead">
          Most software guides are written for a market that is not ours. They compare prices in dollars, ignore VAT, and never
          mention the EMP201, the VAT201 or POPIA. A Durban bookkeeper or a Pretoria payroll manager gets very little from them.
        </p>
        <p>
          {SITE_NAME} is an independent register of business software for South Africa. We cover {software.length} products
          across {categories.length} categories today, from Xero and SimplePay to SYSPRO and Sage 300 People. Every profile
          shows the price in rand with its VAT basis, the local rules the product covers, and the gaps it leaves.
        </p>
        <p>
          We are based in {SITE_ADDRESS.locality}. We do not sell software, and we do not take payment to change a rating, a rank
          or a verdict.
        </p>
      </div>

      <section aria-labelledby="principles" className="mt-20">
        <SectionIntro id="principles" eyebrow="Principles" title="Three things" strong="we will not trade" />
        <ul className="grid gap-4 md:grid-cols-3">
          {PRINCIPLES.map(({ icon: Icon, title, body }) => (
            <li key={title} className="card-modern p-6">
              <span className="inline-flex size-11 items-center justify-center rounded-xl bg-bone" aria-hidden="true">
                <Icon size={20} />
              </span>
              <p className="mt-5 font-heading text-[20px] font-bold">{title}</p>
              <p className="mt-2 text-[15px] leading-relaxed text-muted-foreground">{body}</p>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="method" className="mt-20 grid gap-10 lg:grid-cols-2 lg:gap-16">
        <div>
          <p className="eyebrow text-muted-foreground">Rating method</p>
          <h2 id="method" className="mt-4 font-heading text-[30px] font-medium leading-[1.18] tracking-[-0.02em] md:text-[38px]">
            How a product earns a rating
          </h2>
          <ol className="mt-6 space-y-5">
            {[
              ["Readers write reviews", "Anyone who uses the software at work can review it. Vendors, resellers and competitors cannot."],
              ["A person moderates each one", "We read every review before it goes live and remove any that break our rules."],
              [`${MIN_PUBLIC_REVIEWS} reviews before a rating`, `A star rating appears once ${MIN_PUBLIC_REVIEWS} reviews are published, so no product is judged on one or two opinions.`],
              ["A weighted ranking", "Rankings pull small samples towards the average, so many reviews at 4.4 beat a few at 4.8."],
            ].map(([t, b], i) => (
              <li key={t} className="flex gap-4">
                <span className="font-heading text-[28px] font-bold leading-none tabular">{i + 1}</span>
                <div>
                  <p className="font-heading text-[17px] font-bold">{t}</p>
                  <p className="mt-1 text-[15px] text-muted-foreground">{b}</p>
                </div>
              </li>
            ))}
          </ol>
          <div className="mt-8">
            <CtaButton href="/how-we-rate" variant="soft">
              Read the full policy
            </CtaButton>
          </div>
        </div>
        <div className="self-start rounded-[28px] bg-card p-6 ring-1 ring-inset ring-border md:p-8">
          <p className="font-heading text-[20px] font-bold">The local compliance bar</p>
          <p className="mt-2 text-[15px] text-muted-foreground">
            Every profile is checked against the South African rules that matter for its category.
          </p>
          <ul className="mt-6 grid gap-3 sm:grid-cols-2">
            {COMPLIANCE_CHECKLIST.map((c) => (
              <li key={c.key} className="flex items-center gap-3 text-[15px] font-medium">
                <ComplianceMark status="covered" />
                {c.label}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {TEAM.length > 0 && (
        <section aria-labelledby="people" className="mt-20">
          <SectionIntro id="people" eyebrow="People" title="Who is" strong="behind it" />
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {TEAM.map((p) => (
              <li key={p.name} className="card-modern p-5">
                <Image src={p.photo} alt={p.name} width={96} height={96} className="size-20 rounded-2xl object-cover" />
                <p className="mt-4 font-heading text-[18px] font-bold">{p.name}</p>
                <p className="text-[14px] text-muted-foreground">{p.role}</p>
                <p className="mt-3 text-[14.5px] leading-relaxed">{p.bio}</p>
              </li>
            ))}
          </ul>
        </section>
      )}

      <section aria-labelledby="company" className="mt-20">
        <SectionIntro id="company" eyebrow="Company" title="Who runs" strong={SITE_NAME} />
        <dl className="grid gap-px overflow-hidden rounded-[28px] bg-border ring-1 ring-inset ring-border sm:grid-cols-2 lg:grid-cols-3">
          {(
            [
              SITE_FOUNDER ? ["Founder and editor", SITE_FOUNDER] : null,
              ["Based in", `${SITE_ADDRESS.street ? `${SITE_ADDRESS.street}, ` : ""}${SITE_ADDRESS.locality}, ${SITE_ADDRESS.region}, ${SITE_ADDRESS.countryName}`],
              COMPANY_REGISTRATION ? ["CIPC registration", COMPANY_REGISTRATION] : null,
              ["General and vendor enquiries", CONTACT_EMAIL],
              ["Privacy and PAIA requests", PRIVACY_EMAIL],
              CONTACT_PHONE ? ["Phone", CONTACT_PHONE] : null,
            ].filter(Boolean) as [string, string][]
          ).map(([label, value]) => (
            <div key={label} className="bg-card p-6">
              <dt className="text-[13px] font-medium text-muted-foreground">{label}</dt>
              <dd className="mt-1.5 break-words font-heading text-[18px] font-bold">
                {value.includes("@") ? (
                  <a href={`mailto:${value}`} className="underline decoration-border underline-offset-4 hover:decoration-ink">
                    {value}
                  </a>
                ) : (
                  value
                )}
              </dd>
            </div>
          ))}
        </dl>
        <p className="mt-4 text-[14px] text-muted-foreground">
          Vendors and affiliate programmes: see{" "}
          <Link href="/partners" className="font-medium text-ink underline underline-offset-4">
            how to work with us
          </Link>
          .
        </p>
      </section>

      <section aria-labelledby="about-contact" className="mt-20 rounded-[40px] bg-card p-8 text-center ring-1 ring-inset ring-border md:p-14">
        <h2 id="about-contact" className="font-heading text-[30px] font-medium leading-tight tracking-[-0.02em] md:text-[38px]">
          Spotted something we got wrong?
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-[16px] text-muted-foreground">
          Tell us. Corrections from readers and vendors are how a register like this stays accurate.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-2">
          <CtaButton href="/contact?subject=correction">Send a correction</CtaButton>
          <CtaButton href="/contact" variant="soft">
            Get in touch
          </CtaButton>
        </div>
      </section>
    </div>
  );
}
