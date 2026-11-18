import type { Metadata } from "next";
import { Mail, MapPin, Phone } from "lucide-react";
import { SectionHeader } from "@/components/public/section-heading";
import { ContactForm } from "@/components/public/contact-form";
import { CONTACT_EMAIL, CONTACT_PHONE, SITE_ADDRESS } from "@/lib/site";
import { JsonLd, breadcrumbSchema, buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Contact us",
  description: "Questions, corrections, vendor responses and listing requests.",
  path: "/contact",
  eyebrow: "Contact",
});

export default async function ContactPage({ searchParams }: { searchParams: Promise<{ subject?: string }> }) {
  const { subject = "general" } = await searchParams;
  const listing = subject === "listing";
  return (
    <div className="container-site">
      <JsonLd data={breadcrumbSchema([{ name: "Contact", path: "/contact" }])} />
      <SectionHeader
        icon={<Mail size={14} />}
        eyebrow="Contact"
        title={listing ? "List your software" : "Talk to us"}
        subtitle={
          listing
            ? "Tell us about the product, who it is for and where it is sold in South Africa. Listings are free. A listing never changes a rating, a rank or a verdict."
            : "Spotted a wrong price or a missing feature? Want to reply to a review as the vendor? We read every message and reply within two working days."
        }
      />
      <div className="mx-auto grid max-w-5xl gap-10 lg:grid-cols-[1fr_300px]">
        <ContactForm defaultSubject={subject} />
        <aside className="space-y-4 self-start">
          <div className="rounded-[24px] bg-card p-6 ring-1 ring-inset ring-border">
            <p className="font-heading text-[17px] font-bold">Other ways to reach us</p>
            <ul className="mt-4 space-y-3 text-[15px]">
              <li className="flex items-center gap-3">
                <Mail size={16} aria-hidden="true" />
                <a href={`mailto:${CONTACT_EMAIL}`} className="underline underline-offset-2">
                  {CONTACT_EMAIL}
                </a>
              </li>
              {CONTACT_PHONE && (
                <li className="flex items-center gap-3">
                  <Phone size={16} aria-hidden="true" />
                  <a href={`tel:${CONTACT_PHONE.replace(/\s/g, "")}`}>{CONTACT_PHONE}</a>
                </li>
              )}
              <li className="flex items-start gap-3">
                <MapPin size={16} className="mt-1" aria-hidden="true" />
                <span>
                  {SITE_ADDRESS.street && <>{SITE_ADDRESS.street}, </>}
                  {SITE_ADDRESS.locality}, {SITE_ADDRESS.region}
                </span>
              </li>
            </ul>
          </div>
          <div className="rounded-[24px] bg-card p-6 ring-1 ring-inset ring-border">
            <p className="font-heading text-[17px] font-bold">Corrections</p>
            <p className="mt-2 text-[14.5px] leading-relaxed text-muted-foreground">
              Send the page, what is wrong and a link to the source. Prices are checked against the vendor&apos;s own pricing page
              before we change them.
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}
