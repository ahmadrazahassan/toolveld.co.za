import { NextResponse } from "next/server";
import { getPublicClient } from "@/lib/supabase/public";

/** Double opt in: the link in the confirmation email lands here. */
export async function GET(request: Request) {
  const url = new URL(request.url);
  const token = url.searchParams.get("token") ?? "";
  const back = (status: string) => NextResponse.redirect(new URL(`/newsletter?status=${status}`, url.origin));
  if (!/^[a-f0-9]{48}$/.test(token)) return back("invalid");
  const sb = getPublicClient();
  if (!sb) return back("invalid");
  const { data, error } = await sb.rpc("newsletter_confirm", { p_token: token });
  if (error || !data) return back("invalid");
  return back("confirmed");
}
