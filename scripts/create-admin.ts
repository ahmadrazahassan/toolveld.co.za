/**
 * Creates (or updates) the single administrator from ADMIN_EMAIL and ADMIN_PASSWORD in .env.local.
 */
import { config } from "dotenv";
import { createClient } from "@supabase/supabase-js";

config({ path: ".env.local" });

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
const email = process.env.ADMIN_EMAIL;
const password = process.env.ADMIN_PASSWORD;

if (!url || !key || !email || !password) {
  console.error("Set NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, ADMIN_EMAIL and ADMIN_PASSWORD in .env.local.");
  process.exit(1);
}
if (password.length < 12) {
  console.error("Use an admin password of at least 12 characters.");
  process.exit(1);
}

const sb = createClient(url, key, { auth: { persistSession: false } });

async function main() {
  let userId: string | null = null;
  const { data: created, error } = await sb.auth.admin.createUser({ email, password, email_confirm: true });
  if (created?.user) {
    userId = created.user.id;
    console.log(`Created ${email}`);
  } else {
    // Already exists: find the user and reset the password.
    const { data: list } = await sb.auth.admin.listUsers({ page: 1, perPage: 1000 });
    const existing = list?.users.find((u) => u.email?.toLowerCase() === email!.toLowerCase());
    if (!existing) throw new Error(error?.message ?? "Could not create the admin user.");
    userId = existing.id;
    await sb.auth.admin.updateUserById(userId, { password });
    console.log(`Updated password for ${email}`);
  }
  const { error: adminError } = await sb.from("admins").upsert({ user_id: userId });
  if (adminError) throw new Error(adminError.message);
  console.log("Admin access granted. Sign in at /admin/login.");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
