"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getResource, parseResourceForm } from "@/lib/admin/resources";
import { getServerClient } from "@/lib/supabase/server";
import type { ActionResult } from "@/lib/types";

/** Every admin action re-checks the session and the admins table on the server. */
async function adminClient() {
  const sb = await getServerClient();
  if (!sb) throw new Error("Supabase is not configured.");
  const { data: auth } = await sb.auth.getUser();
  if (!auth.user) redirect("/admin/login");
  const { data: isAdmin } = await sb.rpc("is_admin");
  if (!isAdmin) redirect("/admin/login?error=not-admin");
  return sb;
}

export async function signIn(_: ActionResult | null, fd: FormData): Promise<ActionResult> {
  const sb = await getServerClient();
  if (!sb) return { ok: false, message: "Connect Supabase first. See the README." };
  const email = String(fd.get("email") ?? "").trim();
  const password = String(fd.get("password") ?? "");
  const { error } = await sb.auth.signInWithPassword({ email, password });
  if (error) return { ok: false, message: "That email and password do not match." };
  const { data: isAdmin } = await sb.rpc("is_admin");
  if (!isAdmin) {
    await sb.auth.signOut();
    return { ok: false, message: "This account is not an administrator." };
  }
  redirect("/admin");
}

export async function signOut() {
  const sb = await getServerClient();
  if (sb) await sb.auth.signOut();
  redirect("/admin/login");
}

export async function saveResource(resourceKey: string, originalId: string | null, _: ActionResult | null, fd: FormData): Promise<ActionResult> {
  const resource = getResource(resourceKey);
  if (!resource || resource.readOnly) return { ok: false, message: "Unknown resource." };
  const sb = await adminClient();
  const creating = originalId === null;
  const { row, errors } = parseResourceForm(resource, fd, creating);
  if (Object.keys(errors).length) return { ok: false, message: "Please fix the highlighted fields.", fieldErrors: errors };

  const query = creating
    ? sb.from(resource.table).insert(row).select().single()
    : sb.from(resource.table).update(row).eq(resource.primaryKey, originalId).select().single();
  const { data, error } = await query;
  if (error) return { ok: false, message: error.message };

  revalidatePath("/", "layout");
  const id = (data as Record<string, unknown>)[resource.primaryKey];
  if (creating) redirect(`/admin/${resource.key}/${encodeURIComponent(String(id))}?saved=1`);
  return { ok: true, message: "Saved. The public site updates within a minute." };
}

export async function deleteResource(resourceKey: string, id: string) {
  const resource = getResource(resourceKey);
  if (!resource || resource.readOnly) return;
  const sb = await adminClient();
  await sb.from(resource.table).delete().eq(resource.primaryKey, id);
  revalidatePath("/", "layout");
  redirect(`/admin/${resource.key}`);
}

export async function setReviewStatus(id: string, status: "published" | "hidden") {
  const sb = await adminClient();
  await sb.from("reviews").update({ status }).eq("id", id);
  revalidatePath("/", "layout");
}

export async function setMessageHandled(id: string, handled: boolean) {
  const sb = await adminClient();
  await sb.from("contact_messages").update({ handled }).eq("id", id);
  revalidatePath("/admin/inbox");
}

export async function saveSetting(_: ActionResult | null, fd: FormData): Promise<ActionResult> {
  const sb = await adminClient();
  const key = String(fd.get("key") ?? "").trim();
  const raw = String(fd.get("value") ?? "");
  if (!/^[a-z0-9_.]+$/.test(key)) return { ok: false, message: "Keys use lowercase letters, numbers, dots and underscores." };
  let value: unknown;
  try {
    value = JSON.parse(raw);
  } catch {
    value = raw;
  }
  const { error } = await sb.from("site_settings").upsert({ key, value });
  if (error) return { ok: false, message: error.message };
  revalidatePath("/admin/settings");
  return { ok: true, message: "Setting saved." };
}
