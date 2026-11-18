/**
 * Resource registry. One field map per table drives both the admin form and the save
 * action, so a field outside this whitelist can never be written. Aggregate rating fields
 * are deliberately absent: only the database trigger writes them.
 */

export type FieldType =
  | "text"
  | "textarea"
  | "number"
  | "boolean"
  | "select"
  | "date"
  | "url"
  | "list" // text[]: one item per line
  | "paragraphs" // text[]: paragraphs separated by a blank line
  | "json";

export interface Field {
  name: string;
  label: string;
  type: FieldType;
  options?: string[];
  required?: boolean;
  nullable?: boolean;
  hint?: string;
  /** Only editable when creating a row. */
  createOnly?: boolean;
}

export interface Resource {
  key: string;
  table: string;
  label: string;
  singular: string;
  primaryKey: string;
  orderBy: string;
  listColumns: { name: string; label: string }[];
  fields: Field[];
  /** Reviews are moderated, not edited. */
  readOnly?: boolean;
  /** The public path to revalidate after a save. */
  publicPath?: (row: Record<string, unknown>) => string;
}

const STATUS = ["published", "draft"];
const SIZES = ["sole", "2-10", "11-50", "51-200", "201-500", "500+"];

export const RESOURCES: Resource[] = [
  {
    key: "software",
    table: "software",
    label: "Software",
    singular: "product",
    primaryKey: "id",
    orderBy: "name",
    listColumns: [
      { name: "name", label: "Name" },
      { name: "category", label: "Category" },
      { name: "price_checked_at", label: "Price checked" },
      { name: "review_count", label: "Reviews" },
      { name: "status", label: "Status" },
    ],
    publicPath: (r) => `/software/${r.slug}`,
    fields: [
      { name: "id", label: "ID", type: "text", required: true, createOnly: true, hint: "Use the slug." },
      { name: "slug", label: "Slug", type: "text", required: true },
      { name: "name", label: "Name", type: "text", required: true },
      { name: "tagline", label: "Tagline", type: "text", required: true },
      { name: "short_description", label: "Short description", type: "textarea", required: true },
      { name: "description", label: "Full description", type: "paragraphs", hint: "Separate paragraphs with a blank line." },
      { name: "category", label: "Category", type: "select", options: ["accounting", "payroll", "hr", "crm", "erp", "project-management"], required: true },
      { name: "deployment", label: "Runs as", type: "select", options: ["cloud", "desktop", "hybrid"] },
      { name: "logo", label: "Logo path or URL", type: "text", nullable: true, hint: "Only a real vendor logo. Leave empty for a monogram." },
      { name: "brand_color", label: "Brand colour", type: "text", nullable: true, hint: "Hex, used only on the logo ring." },
      { name: "website", label: "Website", type: "url", required: true },
      { name: "starting_price", label: "Starting price", type: "number", nullable: true, hint: "Empty means not public. 0 means free." },
      { name: "currency", label: "Currency", type: "select", options: ["ZAR", "USD", "EUR", "GBP"] },
      { name: "billing_period", label: "Billing period", type: "select", options: ["month", "year", "user_month", "user_year", "employee_month", "once"] },
      { name: "price_vat_inclusive", label: "Price includes VAT", type: "boolean" },
      { name: "price_vat_unknown", label: "Vendor does not state the VAT basis", type: "boolean" },
      { name: "pricing_model", label: "Pricing model", type: "select", options: ["published", "quote"] },
      { name: "price_checked_at", label: "Price checked on", type: "date", nullable: true, hint: "Set only after checking the vendor's own pricing page." },
      { name: "pricing_plans", label: "Pricing plans", type: "json", hint: "Plans may carry brackets, included_seats, extra_seat_price, min_seats and max_seats." },
      { name: "pricing_addons", label: "Priced add ons", type: "json" },
      { name: "pricing_sources", label: "Price sources", type: "json", hint: "Label, url and the date you checked it." },
      { name: "pricing_note", label: "Pricing note", type: "textarea", nullable: true },
      { name: "free_trial", label: "Free trial", type: "boolean" },
      { name: "free_trial_days", label: "Trial days", type: "number", nullable: true },
      { name: "free_version", label: "Free version", type: "boolean" },
      { name: "demo", label: "Demo on request", type: "boolean" },
      { name: "features", label: "Features", type: "list" },
      { name: "top_features", label: "Top features", type: "json" },
      { name: "integrations", label: "Integrations", type: "list" },
      { name: "vendor", label: "Vendor details", type: "json" },
      { name: "compliance", label: "Compliance", type: "json", hint: "Keys from the checklist, status covered, gap or unconfirmed." },
      { name: "bank_feeds", label: "Bank feeds", type: "list" },
      { name: "best_for_sizes", label: "Best for sizes", type: "list", hint: SIZES.join(", ") },
      { name: "best_for_roles", label: "Best for roles", type: "list" },
      { name: "alternatives", label: "Alternatives (slugs)", type: "list" },
      { name: "screenshots", label: "Screenshots", type: "json" },
      { name: "review", label: "Editorial review", type: "json", nullable: true, hint: "Verdict, buy_if, skip_if, pros, cons, sections, reviewed_at. Never a score." },
      { name: "featured", label: "Featured", type: "boolean" },
      { name: "status", label: "Status", type: "select", options: STATUS },
    ],
  },
  {
    key: "categories",
    table: "categories",
    label: "Categories",
    singular: "category",
    primaryKey: "slug",
    orderBy: "sort",
    listColumns: [
      { name: "name", label: "Name" },
      { name: "product_count", label: "Products" },
      { name: "sort", label: "Order" },
    ],
    publicPath: (r) => `/category/${r.slug}`,
    fields: [
      { name: "slug", label: "Slug", type: "text", required: true, createOnly: true },
      { name: "name", label: "Name", type: "text", required: true },
      { name: "plural_label", label: "Plural label", type: "text", required: true },
      { name: "description", label: "Description", type: "textarea", required: true },
      { name: "long_intro", label: "Buying guide intro", type: "paragraphs" },
      { name: "icon", label: "Icon", type: "select", options: ["calculator", "wallet", "users", "handshake", "boxes", "kanban"] },
      { name: "compliance_focus", label: "Compliance focus", type: "list" },
      { name: "faqs", label: "FAQs", type: "json" },
      { name: "sort", label: "Order", type: "number" },
    ],
  },
  {
    key: "articles",
    table: "articles",
    label: "Guides",
    singular: "guide",
    primaryKey: "slug",
    orderBy: "published_at",
    listColumns: [
      { name: "title", label: "Title" },
      { name: "topic_label", label: "Topic" },
      { name: "published_at", label: "Published" },
      { name: "status", label: "Status" },
    ],
    publicPath: (r) => `/blog/${r.slug}`,
    fields: [
      { name: "slug", label: "Slug", type: "text", required: true, createOnly: true },
      { name: "title", label: "Title", type: "text", required: true },
      { name: "excerpt", label: "Excerpt", type: "textarea", required: true },
      { name: "topic", label: "Topic", type: "select", options: ["accounting", "payroll", "hr", "crm", "erp", "project-management", "compliance", "buying"] },
      { name: "topic_label", label: "Topic label", type: "text", required: true },
      { name: "author", label: "Author", type: "json" },
      { name: "published_at", label: "Published", type: "date" },
      { name: "updated_at", label: "Updated", type: "date" },
      { name: "reading_minutes", label: "Reading minutes", type: "number" },
      { name: "cover", label: "Cover image", type: "text", nullable: true },
      { name: "body", label: "Body blocks", type: "json" },
      { name: "related_software", label: "Related software (slugs)", type: "list" },
      { name: "featured", label: "Featured", type: "boolean" },
      { name: "status", label: "Status", type: "select", options: STATUS },
    ],
  },
  {
    key: "comparisons",
    table: "comparisons",
    label: "Comparisons",
    singular: "comparison",
    primaryKey: "slug",
    orderBy: "slug",
    listColumns: [
      { name: "slug", label: "Pair" },
      { name: "winner", label: "Winner" },
      { name: "status", label: "Status" },
    ],
    publicPath: (r) => `/compare/${r.slug}`,
    fields: [
      { name: "slug", label: "Slug (a-vs-b)", type: "text", required: true, createOnly: true },
      { name: "a", label: "Product A (slug)", type: "text", required: true },
      { name: "b", label: "Product B (slug)", type: "text", required: true },
      { name: "winner", label: "Winner (slug)", type: "text", required: true, hint: "Every comparison names a winner." },
      { name: "verdict", label: "Verdict", type: "textarea", required: true },
      { name: "pick_other_if", label: "Pick the other one if", type: "textarea", required: true },
      { name: "updated_at", label: "Updated", type: "date" },
      { name: "status", label: "Status", type: "select", options: STATUS },
    ],
  },
  {
    key: "pages",
    table: "pages",
    label: "Pages",
    singular: "page",
    primaryKey: "slug",
    orderBy: "slug",
    listColumns: [
      { name: "title", label: "Title" },
      { name: "updated_at", label: "Updated" },
    ],
    publicPath: (r) => `/${r.slug}`,
    fields: [
      { name: "slug", label: "Slug", type: "text", required: true, createOnly: true },
      { name: "title", label: "Title", type: "text", required: true },
      { name: "description", label: "Description", type: "textarea" },
      { name: "updated_at", label: "Last updated", type: "date" },
      { name: "body", label: "Body blocks", type: "json" },
    ],
  },
  {
    key: "reviews",
    table: "reviews",
    label: "Reviews",
    singular: "review",
    primaryKey: "id",
    orderBy: "created_at",
    readOnly: true,
    listColumns: [
      { name: "title", label: "Title" },
      { name: "software_id", label: "Product" },
      { name: "rating_overall", label: "Stars" },
      { name: "status", label: "Status" },
      { name: "created_at", label: "Submitted" },
    ],
    fields: [],
  },
];

export function getResource(key: string) {
  return RESOURCES.find((r) => r.key === key) ?? null;
}

/** Turns submitted form data into a row, using only whitelisted fields. */
export function parseResourceForm(resource: Resource, fd: FormData, creating: boolean) {
  const row: Record<string, unknown> = {};
  const errors: Record<string, string> = {};
  for (const f of resource.fields) {
    if (f.createOnly && !creating) continue;
    const raw = fd.get(f.name);
    const value = typeof raw === "string" ? raw.trim() : "";
    switch (f.type) {
      case "boolean":
        row[f.name] = raw === "on" || raw === "true";
        break;
      case "number":
        if (value === "") {
          if (f.required) errors[f.name] = "Required";
          row[f.name] = f.nullable ? null : 0;
        } else if (Number.isNaN(Number(value))) errors[f.name] = "Enter a number";
        else row[f.name] = Number(value);
        break;
      case "list":
        row[f.name] = value.split("\n").map((s) => s.trim()).filter(Boolean);
        break;
      case "paragraphs":
        row[f.name] = value.split(/\n\s*\n/).map((s) => s.replace(/\s*\n\s*/g, " ").trim()).filter(Boolean);
        break;
      case "json":
        try {
          row[f.name] = value === "" ? (f.nullable ? null : []) : JSON.parse(value);
        } catch {
          errors[f.name] = "Not valid JSON";
        }
        break;
      case "select":
        if (f.options && value && !f.options.includes(value)) errors[f.name] = "Choose an option";
        row[f.name] = value || null;
        break;
      case "url":
        if (value && !/^https?:\/\//.test(value)) errors[f.name] = "Start with https://";
        row[f.name] = value || null;
        break;
      default:
        if (f.required && !value) errors[f.name] = "Required";
        row[f.name] = value === "" && f.nullable ? null : value;
    }
    if (f.required && (row[f.name] === null || row[f.name] === "") && !errors[f.name]) errors[f.name] = "Required";
  }
  return { row, errors };
}

/** Formats a stored value for the form. */
export function formValue(field: Field, value: unknown): string {
  if (value === null || value === undefined) return "";
  switch (field.type) {
    case "list":
      return Array.isArray(value) ? value.join("\n") : String(value);
    case "paragraphs":
      return Array.isArray(value) ? value.join("\n\n") : String(value);
    case "json":
      return JSON.stringify(value, null, 2);
    default:
      return String(value);
  }
}
