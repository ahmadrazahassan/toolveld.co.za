import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { FileText } from "lucide-react";
import { SectionHeader } from "@/components/public/section-heading";
import { ArticleBody } from "@/components/public/article-body";
import { formatLongDate } from "@/lib/format";
import { getPage, getPages } from "@/lib/queries/content";
import { JsonLd, breadcrumbSchema, buildMetadata } from "@/lib/seo";

/** One LegalPage template for terms, privacy, cookies, affiliate disclosure, how we rate, PAIA and accessibility. */
export const dynamicParams = false;
export const revalidate = 3600;

export async function generateStaticParams() {
  return (await getPages()).map((p) => ({ page: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ page: string }> }): Promise<Metadata> {
  const { page } = await params;
  const p = await getPage(page);
  if (!p) return {};
  return buildMetadata({ title: p.title, description: p.description, path: `/${p.slug}`, eyebrow: "Policy" });
}

export default async function LegalPage({ params }: { params: Promise<{ page: string }> }) {
  const { page } = await params;
  const p = await getPage(page);
  if (!p) notFound();
  return (
    <div className="container-site">
      <JsonLd data={breadcrumbSchema([{ name: p.title, path: `/${p.slug}` }])} />
      <SectionHeader icon={<FileText size={14} />} eyebrow={`Last updated ${formatLongDate(p.updated_at)}`} title={p.title} subtitle={p.description} />
      <div className="mx-auto max-w-[720px]">
        <ArticleBody blocks={p.body} />
      </div>
    </div>
  );
}
