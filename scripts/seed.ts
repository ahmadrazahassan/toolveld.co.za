/**
 * Seeds Supabase with the bundled dataset: categories, software, articles, comparisons and pages.
 * It never seeds reviews or ratings. Run with `npm run seed` after the migrations.
 */
import { config } from "dotenv";
import { createClient } from "@supabase/supabase-js";
import { categories } from "../lib/data/categories";
import { allSoftware } from "../lib/data/software";
import { articles } from "../lib/data/articles";
import { comparisons } from "../lib/data/comparisons";
import { pages } from "../lib/data/pages";

config({ path: ".env.local" });

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !key) {
  console.error("Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env.local first.");
  process.exit(1);
}
const sb = createClient(url, key, { auth: { persistSession: false } });

async function upsert(table: string, rows: object[], onConflict: string) {
  const { error } = await sb.from(table).upsert(rows, { onConflict });
  if (error) throw new Error(`${table}: ${error.message}`);
  console.log(`  ${table}: ${rows.length} rows`);
}

async function main() {
  console.log("Seeding bundled dataset");
  await upsert(
    "categories",
    categories.map((c) => ({ ...c })),
    "slug",
  );
  await upsert(
    "software",
    allSoftware.map((s) => {
      // Ratings, review count and price history are owned by database triggers.
      const {
        rating_overall: _o,
        rating_ease: _e,
        rating_value: _v,
        rating_service: _s,
        rating_functionality: _f,
        review_count: _n,
        price_history: _h,
        ...row
      } = s;
      void [_o, _e, _v, _s, _f, _n, _h];
      return row;
    }),
    "id",
  );
  await upsert("articles", articles, "slug");
  await upsert("comparisons", comparisons, "slug");
  await upsert("pages", pages, "slug");
  console.log("Done. No reviews or ratings were seeded.");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
