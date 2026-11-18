import { requireAdmin } from "@/lib/admin/guard";
import { setMessageHandled } from "@/lib/actions/admin";
import { formatDate } from "@/lib/format";
import { cn } from "@/lib/utils";

const SUBJECT: Record<string, string> = {
  general: "General",
  correction: "Correction",
  listing: "Listing",
  vendor: "Vendor response",
  advertising: "Advertising",
};

export default async function Inbox() {
  const { sb } = await requireAdmin();
  if (!sb) return null;
  const { data } = await sb.from("contact_messages").select("*").order("handled").order("created_at", { ascending: false }).limit(200);
  return (
    <div className="space-y-6">
      <h1 className="font-heading text-[32px] font-bold tracking-[-0.02em]">Inbox</h1>
      <ul className="space-y-3">
        {(data ?? []).map((m) => (
          <li key={m.id} className={cn("card-modern p-5", m.handled && "opacity-60")}>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="font-semibold">
                {m.name} <span className="font-normal text-muted-foreground">&lt;{m.email}&gt;</span>
              </p>
              <span className="text-[13px] text-muted-foreground">
                {SUBJECT[m.subject] ?? m.subject} · {formatDate(m.created_at)}
              </span>
            </div>
            <p className="mt-3 whitespace-pre-wrap text-[15px]">{m.message}</p>
            <div className="mt-4 flex items-center gap-3">
              <a href={`mailto:${m.email}`} className="text-[14px] font-medium underline underline-offset-2">
                Reply by email
              </a>
              <form action={setMessageHandled.bind(null, m.id, !m.handled)}>
                <button type="submit" className="rounded-full bg-bone px-3 py-1.5 text-[13px] font-medium ring-1 ring-inset ring-border-strong">
                  {m.handled ? "Mark as not handled" : "Mark as handled"}
                </button>
              </form>
            </div>
          </li>
        ))}
        {!data?.length && <li className="text-muted-foreground">No messages yet.</li>}
      </ul>
    </div>
  );
}
