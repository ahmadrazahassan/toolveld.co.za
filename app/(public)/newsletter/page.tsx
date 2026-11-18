import type { Metadata } from "next";
import { Check, Mail } from "lucide-react";
import { SectionHeader } from "@/components/public/section-heading";
import { NewsletterForm } from "@/components/public/newsletter-form";
import { getCategories } from "@/lib/queries/categories";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "The monthly brief",
  description: "One email a month: price changes we caught, new products on the register and the SARS deadlines coming up.",
  path: "/newsletter",
  eyebrow: "Newsletter",
});

export default async function NewsletterPage({ searchParams }: { searchParams: Promise<{ status?: string }> }) {
  const { status } = await searchParams;
  const categories = await getCategories();
  return (
    <div className="container-site">
      <SectionHeader
        icon={<Mail size={14} />}
        eyebrow="Newsletter"
        title="The monthly brief, nothing more"
        subtitle="Price changes we caught, new products on the register and the SARS deadlines coming up. One email a month."
      />
      {status === "confirmed" && (
        <p role="status" className="mx-auto mb-8 flex max-w-2xl items-center gap-3 rounded-[18px] bg-card p-4 text-[15px] ring-1 ring-inset ring-border">
          <span className="inline-flex size-6 items-center justify-center rounded-full bg-yellow text-ink" aria-hidden="true">
            <Check size={14} strokeWidth={3} />
          </span>
          Your subscription is confirmed. The next brief will reach your inbox.
        </p>
      )}
      {status === "invalid" && (
        <p role="alert" className="mx-auto mb-8 max-w-2xl rounded-[18px] bg-card p-4 text-[15px] text-destructive ring-1 ring-inset ring-border">
          That confirmation link is not valid or has already been used.
        </p>
      )}
      <div className="on-dark mx-auto max-w-2xl rounded-[40px] bg-panel p-7 text-on-panel md:p-12">
        <NewsletterForm categories={categories.map((c) => ({ slug: c.slug, name: c.name }))} />
      </div>
    </div>
  );
}
