import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { ResourceForm } from "@/components/admin/forms";
import { getResource } from "@/lib/admin/resources";
import { requireAdmin } from "@/lib/admin/guard";
import { deleteResource, setReviewStatus } from "@/lib/actions/admin";
import { COMPANY_SIZE_LABEL, formatDate } from "@/lib/format";

export default async function ResourceEdit({
  params,
  searchParams,
}: {
  params: Promise<{ resource: string; id: string }>;
  searchParams: Promise<{ saved?: string }>;
}) {
  const { resource: key, id: rawId } = await params;
  const { saved } = await searchParams;
  const resource = getResource(key);
  if (!resource) notFound();
  const { sb } = await requireAdmin();
  if (!sb) return null;
  const id = decodeURIComponent(rawId);
  const creating = id === "new";

  let row: Record<string, unknown> = {};
  if (!creating) {
    const { data } = await sb.from(resource.table).select("*").eq(resource.primaryKey, id).maybeSingle();
    if (!data) notFound();
    row = data as Record<string, unknown>;
  }

  const back = (
    <Link href={`/admin/${resource.key}`} className="inline-flex items-center gap-1.5 text-[14px] text-muted-foreground hover:text-ink">
      <ArrowLeft size={15} aria-hidden="true" /> {resource.label}
    </Link>
  );

  if (resource.key === "reviews") {
    if (creating) notFound();
    const published = row.status === "published";
    return (
      <div className="max-w-3xl space-y-6">
        {back}
        <h1 className="font-heading text-[30px] font-bold tracking-[-0.02em]">{String(row.title)}</h1>
        <div className="card-modern space-y-4 p-6 text-[15px]">
          <p>
            <strong>Product:</strong> {String(row.software_id)} · <strong>Overall:</strong> {String(row.rating_overall)} ·{" "}
            <strong>Ease:</strong> {String(row.rating_ease)} · <strong>Value:</strong> {String(row.rating_value)} ·{" "}
            <strong>Service:</strong> {String(row.rating_service)} · <strong>Functionality:</strong> {String(row.rating_functionality)}
          </p>
          <div>
            <p className="font-semibold">Likes</p>
            <p className="text-muted-foreground">{String(row.pros)}</p>
          </div>
          <div>
            <p className="font-semibold">Dislikes</p>
            <p className="text-muted-foreground">{String(row.cons)}</p>
          </div>
          <p className="text-muted-foreground">
            {String(row.reviewer_first_name)}, {String(row.reviewer_role)}, {COMPANY_SIZE_LABEL[String(row.company_size)]} staff, used for{" "}
            {String(row.usage_duration)}, {String(row.country)}. Email: {String(row.reviewer_email)}. Submitted {formatDate(String(row.created_at))}.
          </p>
          <p className="text-[13.5px] text-muted-foreground">
            Publish only reviews from real users. Decline anything from a vendor, reseller or competitor, or that names private people.
          </p>
        </div>
        <form action={setReviewStatus.bind(null, id, published ? "hidden" : "published")}>
          <button type="submit" className="btn-gloss gloss-ink btn-label inline-flex h-12 items-center rounded-[12px] px-6 text-[12px]">
            {published ? "Hide review" : "Publish review"}
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="max-w-4xl space-y-6">
      {back}
      <h1 className="font-heading text-[30px] font-bold tracking-[-0.02em]">
        {creating ? `New ${resource.singular}` : String(row.name ?? row.title ?? row.slug ?? id)}
      </h1>
      {saved && <p role="status" className="text-[14.5px] font-medium">Created.</p>}
      {!creating && resource.publicPath && (
        <Link href={resource.publicPath(row)} target="_blank" className="text-[14px] underline underline-offset-2">
          View on the site
        </Link>
      )}
      <div className="card-modern p-6 md:p-8">
        <ResourceForm resourceKey={resource.key} originalId={creating ? null : id} fields={resource.fields} values={row} />
      </div>
      {!creating && (
        <form action={deleteResource.bind(null, resource.key, id)}>
          <button type="submit" className="text-[14px] font-medium text-destructive underline underline-offset-2">
            Delete this {resource.singular}
          </button>
        </form>
      )}
    </div>
  );
}
