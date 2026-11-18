import Link from "next/link";
import { Search, SignpostBig } from "lucide-react";
import { SectionHeader } from "@/components/public/section-heading";

const LINKS = [
  { href: "/software", label: "All software" },
  { href: "/categories", label: "Categories" },
  { href: "/compare", label: "Compare" },
  { href: "/blog", label: "Blog" },
  { href: "/finder", label: "Which one fits?" },
];

export function NotFoundContent() {
  return (
    <div className="container-site py-6">
      <SectionHeader
        icon={<SignpostBig size={14} />}
        eyebrow="Error 404"
        title="That page is not on the register"
        subtitle="The link may be old, or the product may have been renamed. Search for it, or start from one of the sections below."
      />
      <form action="/search" role="search" className="relative mx-auto max-w-[576px]">
        <label htmlFor="nf-q" className="sr-only">
          Search
        </label>
        <Search size={20} className="pointer-events-none absolute left-5 top-1/2 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
        <input
          id="nf-q"
          name="q"
          type="search"
          placeholder="Search products and guides"
          className="h-16 w-full rounded-[18px] border border-input bg-card pl-14 pr-32 text-[16px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink"
        />
        <button type="submit" className="btn-gloss gloss-ink btn-label absolute right-2 top-1/2 h-12 -translate-y-1/2 rounded-[11px] px-5 text-[12px]">
          Search
        </button>
      </form>
      <ul className="mt-8 flex flex-wrap justify-center gap-2">
        {LINKS.map((l) => (
          <li key={l.href}>
            <Link
              href={l.href}
              className="inline-flex h-10 items-center rounded-full bg-card px-4 text-[14.5px] font-medium ring-1 ring-inset ring-border-strong hover:bg-ink hover:text-white"
            >
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
