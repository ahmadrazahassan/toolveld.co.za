import { NextResponse } from "next/server";
import { getServerClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

function csvCell(v: unknown) {
  const s = Array.isArray(v) ? v.join(" ") : v === null || v === undefined ? "" : String(v);
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

/** CSV of confirmed, subscribed readers. Admin only. */
export async function GET() {
  const sb = await getServerClient();
  if (!sb) return new NextResponse("Not configured", { status: 404 });
  const { data: auth } = await sb.auth.getUser();
  if (!auth.user) return new NextResponse("Unauthorised", { status: 401 });
  const { data: isAdmin } = await sb.rpc("is_admin");
  if (!isAdmin) return new NextResponse("Forbidden", { status: 403 });

  const { data } = await sb
    .from("newsletter_subscribers")
    .select("email, interests, consent_at, confirmed_at")
    .not("confirmed_at", "is", null)
    .is("unsubscribed_at", null)
    .order("confirmed_at");
  const lines = ["email,interests,consent_at,confirmed_at", ...(data ?? []).map((r) => [r.email, r.interests, r.consent_at, r.confirmed_at].map(csvCell).join(","))];
  return new NextResponse(lines.join("\n"), {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="subscribers-${new Date().toISOString().slice(0, 10)}.csv"`,
      "Cache-Control": "no-store",
    },
  });
}
