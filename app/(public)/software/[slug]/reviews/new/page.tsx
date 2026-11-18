import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PenLine } from "lucide-react";
import { SectionHeader } from "@/components/public/section-heading";
import { ReviewForm } from "@/components/public/review-form";
import { getSoftwareBySlug } from "@/lib/queries/software";
import { buildMetadata } from "@/lib/seo";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const s = await getSoftwareBySlug(slug);
  if (!s) return {};
  return buildMetadata({ title: `Write a review of ${s.name}`, path: `/software/${s.slug}/reviews/new`, noindex: true });
}

export default async function NewReviewPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const s = await getSoftwareBySlug(slug);
  if (!s) notFound();
  return (
    <div className="container-site max-w-4xl">
      <SectionHeader
        icon={<PenLine size={14} />}
        eyebrow="Write a review"
        title={`How is ${s.name} working for you?`}
        subtitle="Honest, specific reviews help the next business decide. A person reads every review before it goes live, and your email is never shown."
      />
      <ReviewForm softwareId={s.id} softwareName={s.name} />
    </div>
  );
}
