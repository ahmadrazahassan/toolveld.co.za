import "server-only";
import { redirect } from "next/navigation";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { getServerClient } from "@/lib/supabase/server";

/** Server side check used by every admin page. */
export async function requireAdmin() {
  if (!isSupabaseConfigured()) return { configured: false as const, sb: null, email: null };
  const sb = await getServerClient();
  if (!sb) return { configured: false as const, sb: null, email: null };
  const { data } = await sb.auth.getUser();
  if (!data.user) redirect("/admin/login");
  const { data: isAdmin } = await sb.rpc("is_admin");
  if (!isAdmin) redirect("/admin/login?error=not-admin");
  return { configured: true as const, sb, email: data.user.email ?? "" };
}
