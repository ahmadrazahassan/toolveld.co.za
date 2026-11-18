import Link from "next/link";
import { notFound } from "next/navigation";
import { CtaButton } from "@/components/ui/button";
import { Table, Td, Th } from "@/components/ui/table";
import { getResource } from "@/lib/admin/resources";
import { requireAdmin } from "@/lib/admin/guard";
import { setReviewStatus } from "@/lib/actions/admin";
import { formatDate } from "@/lib/format";
import { cn } from "@/lib/utils";

function cell(value: unknown) {
  if (value === null || value === undefined || value === "") return "";
  if (typeof value === "string" && /^\d{4}-\d{2}-\d{2}/.test(value)) return formatDate(value);
  return String(value);
}

export default async function ResourceList({
  params,
  searchParams,
}: {
  params: Promise<{ resource: string }>;
  searchParams: Promise<{ status?: string }>;
}) {
  const { resource: key } = await params;
  const { status } = await searchParams;
  const resource = getResource(key);
  if (!resource) notFound();
  const { sb } = await requireAdmin();
  if (!sb) return null;

  let query = sb.from(resource.table).select("*").order(resource.orderBy, { ascending: resource.orderBy !== "created_at" && resource.orderBy !== "published_at" });
  if (resource.key === "reviews" && (status === "hidden" || status === "published")) query = query.eq("status", status);
  const { data, error } = await query.limit(500);
  const rows = (data ?? []) as Record<string, unknown>[];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="font-heading text-[32px] font-bold tracking-[-0.02em]">{resource.label}</h1>
        {!resource.readOnly && <CtaButton href={`/admin/${resource.key}/new`}>{`New ${resource.singular}`}</CtaButton>}
      </div>
      {resource.key === "reviews" && (
        <div className="flex gap-2">
          {[
            ["", "All"],
            ["hidden", "Waiting or hidden"],
            ["published", "Published"],
          ].map(([v, l]) => (
            <Link
              key={v}
              href={v ? `/admin/reviews?status=${v}` : "/admin/reviews"}
              className={cn(
                "inline-flex h-9 items-center rounded-full px-4 text-[14px] font-medium",
                (status ?? "") === v ? "bg-ink text-white" : "bg-card ring-1 ring-inset ring-border-strong",
              )}
            >
              {l}
            </Link>
          ))}
        </div>
      )}
      {error && <p className="text-destructive">{error.message}</p>}
      <Table>
        <thead>
          <tr>
            {resource.listColumns.map((c) => (
              <Th key={c.name}>{c.label}</Th>
            ))}
            <Th className="text-right">Actions</Th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => {
            const id = String(row[resource.primaryKey]);
            return (
              <tr key={id}>
                {resource.listColumns.map((c, i) => (
                  <Td key={c.name} className={i === 0 ? "font-medium" : "text-muted-foreground"}>
                    {i === 0 ? (
                      <Link href={`/admin/${resource.key}/${encodeURIComponent(id)}`} className="hover:underline">
                        {cell(row[c.name])}
                      </Link>
                    ) : (
                      cell(row[c.name])
                    )}
                  </Td>
                ))}
                <Td className="text-right">
                  {resource.key === "reviews" ? (
                    <form action={setReviewStatus.bind(null, id, row.status === "published" ? "hidden" : "published")}>
                      <button type="submit" className="rounded-full bg-bone px-3 py-1.5 text-[13px] font-medium ring-1 ring-inset ring-border-strong hover:bg-border">
                        {row.status === "published" ? "Hide" : "Publish"}
                      </button>
                    </form>
                  ) : (
                    <Link href={`/admin/${resource.key}/${encodeURIComponent(id)}`} className="text-[13.5px] font-medium underline underline-offset-2">
                      Edit
                    </Link>
                  )}
                </Td>
              </tr>
            );
          })}
          {rows.length === 0 && (
            <tr>
              <Td colSpan={resource.listColumns.length + 1} className="py-10 text-center text-muted-foreground">
                Nothing here yet.
              </Td>
            </tr>
          )}
        </tbody>
      </Table>
    </div>
  );
}
