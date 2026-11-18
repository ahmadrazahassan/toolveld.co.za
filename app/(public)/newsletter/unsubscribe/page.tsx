import type { Metadata } from "next";
import { MailX } from "lucide-react";
import { SectionHeader } from "@/components/public/section-heading";
import { UnsubscribeButton } from "@/components/public/unsubscribe-button";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({ title: "Unsubscribe", path: "/newsletter/unsubscribe", noindex: true });

export default async function UnsubscribePage({ searchParams }: { searchParams: Promise<{ token?: string }> }) {
  const { token = "" } = await searchParams;
  return (
    <div className="container-site">
      <SectionHeader
        icon={<MailX size={14} />}
        eyebrow="Newsletter"
        title="Unsubscribe from the monthly brief"
        subtitle="One click and you are off the list. We keep a record that you unsubscribed, so we never email you again by mistake."
      >
        <div className="mt-8 flex justify-center">
          {token ? (
            <UnsubscribeButton token={token} />
          ) : (
            <p className="text-[15px] text-muted-foreground">Use the unsubscribe link at the bottom of any brief we sent you.</p>
          )}
        </div>
      </SectionHeader>
    </div>
  );
}
