import Link from "next/link";
import { requireAdmin } from "@/lib/admin/guard";
import { daysAgoIso, formatDate } from "@/lib/format";

export default async function AdminDashboard() {
  const { sb } = await requireAdmin();
  if (!sb) return null;
  const stale = daysAgoIso(90);
  const [software, pending, published, messages, subscribers, stalePrices, recent] = await Promise.all([
    sb.from("software").select("id", { count: "exact", head: true }),
    sb.from("reviews").select("id", { count: "exact", head: true }).eq("status", "hidden").is("moderated_at", null),
    sb.from("reviews").select("id", { count: "exact", head: true }).eq("status", "published"),
    sb.from("contact_messages").select("id", { count: "exact", head: true }).eq("handled", false),
    sb.from("newsletter_subscribers").select("id", { count: "exact", head: true }).not("confirmed_at", "is", null).is("unsubscribed_at", null),
    sb.from("software").select("id, name, price_checked_at").or(`price_checked_at.is.null,price_checked_at.lt.${stale}`).order("price_checked_at", { ascending: true, nullsFirst: true }).limit(12),
    sb.from("reviews").select("id, title, software_id, created_at").eq("status", "hidden").is("moderated_at", null).order("created_at", { ascending: false }).limit(6),
  ]);

  const tiles = [
    { label: "Products", value: software.count ?? 0, href: "/admin/software" },
    { label: "Reviews waiting", value: pending.count ?? 0, href: "/admin/reviews?status=hidden" },
    { label: "Published reviews", value: published.count ?? 0, href: "/admin/reviews?status=published" },
    { label: "Unhandled messages", value: messages.count ?? 0, href: "/admin/inbox" },
    { label: "Confirmed subscribers", value: subscribers.count ?? 0, href: "/admin/newsletter" },
  ];

  return (
    <div className="space-y-10">
      <h1 className="font-heading text-[32px] font-bold tracking-[-0.02em]">Dashboard</h1>
      <ul className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
        {tiles.map((t) => (
          <li key={t.label}>
            <Link href={t.href} className="card-modern card-hover block p-5">
              <p className="text-[13.5px] text-muted-foreground">{t.label}</p>
              <p className="mt-2 font-heading text-[34px] font-bold leading-none tabular">{t.value}</p>
            </Link>
          </li>
        ))}
      </ul>
      <div className="grid gap-6 xl:grid-cols-2">
        <section className="card-modern p-6">
          <h2 className="font-heading text-[20px] font-bold">Reviews waiting for moderation</h2>
          {recent.data?.length ? (
            <ul className="mt-4 divide-y divide-border">
              {recent.data.map((r) => (
                <li key={r.id} className="flex items-center justify-between gap-3 py-3 text-[14.5px]">
                  <Link href={`/admin/reviews/${r.id}`} className="font-medium hover:underline">
                    {r.title}
                  </Link>
                  <span className="shrink-0 text-muted-foreground">
                    {r.software_id} · {formatDate(r.created_at)}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-3 text-[15px] text-muted-foreground">Nothing waiting.</p>
          )}
        </section>
        <section className="card-modern p-6">
          <h2 className="font-heading text-[20px] font-bold">Prices not checked in 90 days</h2>
          {stalePrices.data?.length ? (
            <ul className="mt-4 divide-y divide-border">
              {stalePrices.data.map((s) => (
                <li key={s.id} className="flex items-center justify-between gap-3 py-3 text-[14.5px]">
                  <Link href={`/admin/software/${s.id}`} className="font-medium hover:underline">
                    {s.name}
                  </Link>
                  <span className="text-muted-foreground">{s.price_checked_at ? formatDate(s.price_checked_at) : "Never"}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-3 text-[15px] text-muted-foreground">Every price is fresh.</p>
          )}
        </section>
      </div>
    </div>
  );
}
