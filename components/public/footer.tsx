import Image from "next/image";
import Link from "next/link";
import { SiteMark } from "@/components/public/site-mark";
import { Flag } from "@/components/ui/misc";
import { getHeroImage } from "@/lib/server-assets";
import { CONTACT_EMAIL, CONTACT_PHONE, MARKET_FLAG, SITE_ADDRESS, SITE_DOMAIN, SITE_NAME, SOCIAL_LINKS } from "@/lib/site";

/** The big links, one per main section of the site. */
const PRIMARY = [
  { href: "/software", label: "Software" },
  { href: "/categories", label: "Categories" },
  { href: "/compare", label: "Compare" },
  { href: "/blog", label: "Guides" },
  { href: "/about", label: "About" },
];

const EXPLORE = [
  { href: "/finder", label: "Which one fits?" },
  { href: "/prices", label: "Rand price index" },
  { href: "/sage", label: "Sage in South Africa" },
  { href: "/how-we-rate", label: "How we rate" },
  { href: "/newsletter", label: "Newsletter" },
  { href: "/partners", label: "Work with us" },
];

const LEGAL = [
  { href: "/terms", label: "Terms of use" },
  { href: "/privacy", label: "Privacy policy" },
  { href: "/cookies", label: "Cookie policy" },
  { href: "/affiliate-disclosure", label: "Affiliate disclosure" },
  { href: "/paia-manual", label: "PAIA manual" },
  { href: "/accessibility", label: "Accessibility" },
];

const SOCIAL_LABEL: Record<keyof typeof SOCIAL_LINKS, string> = {
  linkedin: "LinkedIn",
  x: "X",
  facebook: "Facebook",
  youtube: "YouTube",
};

const heading = "text-[11px] font-semibold uppercase tracking-[0.14em] text-white/45";
const smallLink =
  "text-[14px] text-white/60 underline decoration-white/25 underline-offset-[5px] transition-colors hover:text-white hover:decoration-white/70";

/** A small diamond where a dashed rule meets a guide line. */
function Node({ className }: { className: string }) {
  return <span className={`absolute size-[7px] rotate-45 bg-white/35 ${className}`} aria-hidden="true" />;
}

export function Footer() {
  const year = new Date().getFullYear();
  const photo = getHeroImage();
  const socials = (Object.keys(SOCIAL_LINKS) as (keyof typeof SOCIAL_LINKS)[]).filter((k) => SOCIAL_LINKS[k]);

  return (
    <footer className="on-dark mt-24 bg-[#1c1c1e] text-white md:mt-32" aria-labelledby="footer-heading">
      <h2 id="footer-heading" className="sr-only">
        Site footer
      </h2>

      {/* 1. Photo strip with guide lines */}
      <div className="relative h-28 overflow-hidden md:h-36" aria-hidden="true">
        {!photo.placeholder && (
          <Image src={photo.src} alt="" fill sizes="100vw" className="object-cover object-[50%_78%]" />
        )}
        <div className="absolute inset-0 bg-[#1c1c1e]/55" />
        <div className="container-site relative h-full">
          <div className="relative h-full border-x border-dashed border-white/20">
            <div className="absolute inset-x-0 top-[62%] border-t border-dashed border-white/25" />
            <Node className="-left-1 top-[62%] -translate-y-1/2" />
            <Node className="-right-1 top-[62%] -translate-y-1/2" />
          </div>
        </div>
      </div>

      {/* 2. Main grid */}
      <div className="container-site">
        <div className="grid gap-12 border-x border-dashed border-white/10 px-5 py-14 sm:px-8 md:py-20 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)_minmax(0,1.6fr)] lg:gap-10 lg:px-12">
          <div>
            <Link href="/" className="inline-flex">
              <SiteMark tone="light" />
              <span className="sr-only"> home</span>
            </Link>
            <p className="mt-6 text-[13.5px] leading-relaxed text-white/50">
              {SITE_ADDRESS.street && (
                <>
                  {SITE_ADDRESS.street}
                  <br />
                </>
              )}
              {SITE_ADDRESS.locality}, {SITE_ADDRESS.region}
              <br />
              {SITE_ADDRESS.countryName} {SITE_ADDRESS.postalCode}
            </p>
          </div>

          <nav aria-label="Main sections">
            <p className={heading}>Site</p>
            <ul className="mt-6 space-y-2.5">
              {PRIMARY.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="font-heading text-[26px] font-medium leading-tight tracking-[-0.02em] text-white transition-colors hover:text-yellow md:text-[28px]"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="grid grid-cols-2 gap-x-8 gap-y-12 sm:grid-cols-3">
            <nav aria-label="Explore">
              <p className={heading}>Explore</p>
              <ul className="mt-6 space-y-3">
                {EXPLORE.map((l) => (
                  <li key={l.href}>
                    <Link href={l.href} className={smallLink}>
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            <div>
              <p className={heading}>Reach us</p>
              <ul className="mt-6 space-y-3">
                <li>
                  <a href={`mailto:${CONTACT_EMAIL}`} className={smallLink}>
                    {CONTACT_EMAIL}
                  </a>
                </li>
                {CONTACT_PHONE && (
                  <li>
                    <a href={`tel:${CONTACT_PHONE.replace(/\s/g, "")}`} className={smallLink}>
                      {CONTACT_PHONE}
                    </a>
                  </li>
                )}
                <li>
                  <Link href="/contact" className={smallLink}>
                    Contact form
                  </Link>
                </li>
                {socials.map((k) => (
                  <li key={k}>
                    <a href={SOCIAL_LINKS[k]} target="_blank" rel="noopener" className={smallLink}>
                      {SOCIAL_LABEL[k]}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <nav aria-label="Legal">
              <p className={heading}>Legal</p>
              <ul className="mt-6 space-y-3">
                {LEGAL.map((l) => (
                  <li key={l.href}>
                    <Link href={l.href} className={smallLink}>
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </div>
      </div>

      {/* 3. Dashed rule across the full width */}
      <div className="relative border-t border-dashed border-white/20">
        <div className="container-site relative">
          <Node className="-top-1 left-4 md:left-8 lg:left-12" />
          <Node className="-top-1 right-4 md:right-8 lg:right-12" />
        </div>
      </div>

      {/* 4. Closing line */}
      <div className="container-site">
        <div className="flex flex-col gap-8 border-x border-dashed border-white/10 px-5 py-10 sm:px-8 md:flex-row md:items-end md:justify-between md:py-12 lg:px-12">
          <p className="font-heading text-[22px] font-medium leading-[1.25] tracking-[-0.015em] text-white md:text-[26px]">
            Business software,
            <br />
            compared in rand.
          </p>
          <div className="space-y-2 text-[13px] text-white/45 md:text-right">
            <p className="inline-flex items-center gap-2">
              <Flag code={MARKET_FLAG} size={11} />
              Made in {SITE_ADDRESS.locality}
            </p>
            <p>
              &copy; {year} {SITE_NAME}. All rights reserved. {SITE_DOMAIN}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
