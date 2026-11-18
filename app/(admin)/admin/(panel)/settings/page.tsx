import { SettingForm } from "@/components/admin/forms";
import { Table, Td, Th } from "@/components/ui/table";
import { requireAdmin } from "@/lib/admin/guard";
import { formatDate } from "@/lib/format";

export default async function SettingsPage() {
  const { sb } = await requireAdmin();
  if (!sb) return null;
  const { data } = await sb.from("site_settings").select("*").order("key");
  return (
    <div className="space-y-6">
      <h1 className="font-heading text-[32px] font-bold tracking-[-0.02em]">Settings</h1>
      <p className="max-w-2xl text-[15px] text-muted-foreground">
        Brand facts such as the name, VAT rate and contact details live in lib/site.ts so they can never drift between pages.
        Use settings for operational values such as the newsletter sender name.
      </p>
      <div className="card-modern p-6">
        <SettingForm />
      </div>
      <Table>
        <thead>
          <tr>
            <Th>Key</Th>
            <Th>Value</Th>
            <Th>Updated</Th>
          </tr>
        </thead>
        <tbody>
          {(data ?? []).map((s) => (
            <tr key={s.key}>
              <Td className="font-mono text-[13px]">{s.key}</Td>
              <Td className="font-mono text-[13px]">{JSON.stringify(s.value)}</Td>
              <Td className="text-muted-foreground">{formatDate(s.updated_at)}</Td>
            </tr>
          ))}
          {!data?.length && (
            <tr>
              <Td colSpan={3} className="py-8 text-center text-muted-foreground">
                No settings yet.
              </Td>
            </tr>
          )}
        </tbody>
      </Table>
    </div>
  );
}
