import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { SectionIntro } from "@/components/public/section-heading";
import { CategoryIcon } from "@/components/public/category-icon";
import { IconTile } from "@/components/ui/misc";
import { getCategories } from "@/lib/queries/categories";
import { JsonLd, breadcrumbSchema, buildMetadata } from "@/lib/seo";

export const revalidate = 3600;

export const metadata: Metadata = buildMetadata({
  title: "Software categories",
  description: "Accounting, payroll, HR, CRM, ERP and project management software for South African businesses.",
  path: "/categories",
  eyebrow: "Categories",
});

export default async function CategoriesPage() {
  const categories = await getCategories();
  return (
    <div className="container-site">
      <JsonLd data={breadcrumbSchema([{ name: "Categories", path: "/categories" }])} />
      <h1 className="sr-only">Software categories</h1>
      <SectionIntro
        id="categories-title"
        eyebrow="Categories"
        title="Six kinds of software,"
        strong="one register"
        subtitle="Start with the job, not the brand. Each category lists the products we cover and the local rules that matter for it."
      />
      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {categories.map((c) => (
          <li key={c.slug}>
            <Link
              href={`/category/${c.slug}`}
              className="group card-modern card-hover flex h-full flex-col p-6"
            >
              <IconTile>
                <CategoryIcon name={c.icon} size={19} />
              </IconTile>
              <p className="mt-5 font-heading text-[22px] font-bold">{c.name}</p>
              <p className="mt-2 text-[15px] leading-relaxed text-muted-foreground">{c.description}</p>
              <div className="mt-auto flex items-center justify-between pt-6">
                <span className="text-[14px] font-medium">
                  <span className="font-heading text-[18px] font-bold tabular">{c.product_count}</span> products
                </span>
                <span className="inline-flex size-9 items-center justify-center rounded-[11px] bg-yellow text-ink transition-transform group-hover:translate-x-0.5" aria-hidden="true">
                  <ArrowRight size={16} strokeWidth={2.4} />
                </span>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
