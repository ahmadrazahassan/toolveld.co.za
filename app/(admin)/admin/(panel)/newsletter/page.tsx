import { CtaButton } from "@/components/ui/button";
import { Table, Td, Th } from "@/components/ui/table";
import { requireAdmin } from "@/lib/admin/guard";
import { formatDate } from "@/lib/format";

export default async function NewsletterAdmin() {
  const { sb } = await requireAdmin();
  if (!sb) return null;
  const { data } = await sb.from("newsletter_subscribers").select("*").order("created_at", { ascending: false }).limit(1000);
  const rows = data ?? [];
  const confirmed = rows.filter((r) => r.confirmed_at && !r.unsubscribed_at).length;
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-[32px] font-bold tracking-[-0.02em]">Newsletter</h1>
          <p className="text-muted-foreground">
            {confirmed} confirmed of {rows.length} sign ups
          </p>
        </div>
        <CtaButton href="/admin/newsletter/export" arrow={false}>
          Export CSV
        </CtaButton>
      </div>
      <Table>
        <thead>
          <tr>
            <Th>Email</Th>
            <Th>Topics</Th>
            <Th>Consent</Th>
            <Th>Status</Th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.id}>
              <Td className="font-medium">{r.email}</Td>
              <Td className="text-muted-foreground">{(r.interests ?? []).join(", ") || "All"}</Td>
              <Td className="text-muted-foreground">{formatDate(r.consent_at)}</Td>
              <Td className="text-muted-foreground">{r.unsubscribed_at ? "Unsubscribed" : r.confirmed_at ? "Confirmed" : "Waiting for confirmation"}</Td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
}
