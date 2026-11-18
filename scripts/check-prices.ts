/**
 * Lists products whose price has not been checked in 90 days, or never.
 * Reads Supabase when configured, otherwise the bundled dataset.
 */
import { config } from "dotenv";
import { createClient } from "@supabase/supabase-js";
import { allSoftware } from "../lib/data/software";

config({ path: ".env.local" });

const STALE_DAYS = 90;

type Row = { name: string; slug: string; price_checked_at: string | null; website: string };

async function load(): Promise<{ rows: Row[]; source: string }> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (url && key) {
    const sb = createClient(url, key, { auth: { persistSession: false } });
    const { data, error } = await sb.from("software").select("name, slug, price_checked_at, website").eq("status", "published");
    if (!error && data?.length) return { rows: data as Row[], source: "Supabase" };
  }
  return { rows: allSoftware, source: "bundled dataset" };
}

async function main() {
  const { rows, source } = await load();
  const now = Date.now();
  const stale = rows
    .map((r) => ({ ...r, days: r.price_checked_at ? Math.floor((now - new Date(r.price_checked_at).getTime()) / 86_400_000) : Infinity }))
    .filter((r) => r.days >= STALE_DAYS)
    .sort((a, b) => b.days - a.days || a.name.localeCompare(b.name));
  console.log(`Source: ${source}. ${stale.length} of ${rows.length} products need a price check.\n`);
  for (const r of stale) {
    console.log(`${r.days === Infinity ? "never  " : `${String(r.days).padStart(4)} d `} ${r.name.padEnd(42)} ${r.website}`);
  }
}

main();
