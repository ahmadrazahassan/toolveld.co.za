/**
 * Post build check. Scans every prerendered HTML page and fails the build on a bad
 * affiliate link: missing rel="sponsored", any noreferrer, missing referrer policy, or a
 * missing "Ad:" accessible name. Also fails if an affiliate URL from lib/affiliate.ts
 * appears anywhere without data-affiliate.
 */
import { readdirSync, readFileSync, statSync, existsSync } from "node:fs";
import { join } from "node:path";

const roots = [".next/server/app"];
const files = [];
function walk(dir) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    const st = statSync(p);
    if (st.isDirectory()) walk(p);
    else if (name.endsWith(".html")) files.push(p);
  }
}
for (const r of roots) if (existsSync(r)) walk(r);

if (files.length === 0) {
  console.log("check-affiliate-html: no prerendered HTML found, nothing to check.");
  process.exit(0);
}

const anchorRe = /<a\b[^>]*>/gi;
const problems = [];
let affiliateCount = 0;
let outboundCount = 0;

for (const file of files) {
  const html = readFileSync(file, "utf8");
  for (const tag of html.match(anchorRe) ?? []) {
    const attr = (name) => {
      const m = tag.match(new RegExp(`\\s${name}="([^"]*)"`, "i"));
      return m ? m[1] : null;
    };
    const rel = (attr("rel") ?? "").toLowerCase();
    const isAffiliate = attr("data-affiliate") === "true";
    const target = attr("target");
    if (target === "_blank" && /^https?:/i.test(attr("href") ?? "")) outboundCount++;
    if (rel.includes("noreferrer") && (isAffiliate || rel.includes("sponsored"))) {
      problems.push(`${file}: affiliate link uses noreferrer: ${tag}`);
    }
    if (!isAffiliate && !rel.includes("sponsored")) continue;
    affiliateCount++;
    if (!rel.includes("sponsored")) problems.push(`${file}: affiliate link without rel="sponsored": ${tag}`);
    if (!rel.includes("noopener")) problems.push(`${file}: affiliate link without noopener: ${tag}`);
    if ((attr("referrerpolicy") ?? attr("referrerPolicy")) !== "strict-origin-when-cross-origin")
      problems.push(`${file}: affiliate link without the referrer policy: ${tag}`);
    if (!(attr("aria-label") ?? "").startsWith("Ad:")) problems.push(`${file}: affiliate link without an "Ad:" accessible name: ${tag}`);
    if (target !== "_blank") problems.push(`${file}: affiliate link does not open in a new tab: ${tag}`);
  }
}

if (problems.length) {
  console.error(`check-affiliate-html: ${problems.length} problem(s)`);
  for (const p of problems.slice(0, 50)) console.error(`  ${p}`);
  process.exit(1);
}
console.log(`check-affiliate-html: ${files.length} pages, ${outboundCount} outbound links, ${affiliateCount} affiliate links. All good.`);
