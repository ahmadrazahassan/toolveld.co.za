import type { Software } from "@/lib/types";

/**
 * Vendors describe the same capability in different words: one lists "Bank feeds", another
 * "Bank reconciliation". Comparison tables match on these groups, so a product is never shown
 * as missing a feature it has under another name.
 */
const GROUPS: { label: string; aliases: string[] }[] = [
  // Accounting
  { label: "Accountant access", aliases: ["Accountant access", "Accountant and bookkeeper access"] },
  { label: "Bank feeds and reconciliation", aliases: ["Bank feeds", "Bank reconciliation", "Banking"] },
  { label: "Supplier bills and purchase orders", aliases: ["Bills and purchase orders", "Purchase orders", "Supplier bills", "Purchasing"] },
  { label: "Stock and inventory", aliases: ["Inventory", "Stock items", "Tracked inventory", "Inventory and distribution"] },
  { label: "VAT201 return", aliases: ["VAT201 report", "VAT201 return", "VAT returns"] },
  { label: "Reports and dashboards", aliases: ["Standard reports", "Custom reports", "Reports", "Reports and dashboards", "Reporting dashboards", "Reporting", "Dashboards"] },
  { label: "Multiple companies", aliases: ["Multiple companies", "Multiple entities", "Multi entity finance"] },
  { label: "Consolidation", aliases: ["Multi entity consolidation", "Multi subsidiary consolidation"] },
  { label: "Financial statements", aliases: ["Annual financial statements", "Financial statements"] },
  { label: "Trial balance", aliases: ["Trial balance and adjustments", "Trial balance import"] },
  { label: "Review and sign off", aliases: ["Review and sign off", "Review notes"] },
  { label: "General ledger", aliases: ["General ledger", "Financials", "Accounting"] },
  { label: "Mobile app", aliases: ["Mobile app", "Mobile apps", "Mobile access"] },
  { label: "Document capture", aliases: ["Document capture", "Receipt capture with AutoEntry"] },
  { label: "Time tracking", aliases: ["Time tracking", "Timesheets", "Projects and timesheets"] },
  // Payroll and HR
  { label: "ETI", aliases: ["ETI", "ETI calculation"] },
  { label: "Leave", aliases: ["Leave", "Leave management", "Time off requests"] },
  { label: "UIF and SDL", aliases: ["UIF and SDL", "UIF declarations"] },
  { label: "Payslips", aliases: ["Payslips", "Payslips by email"] },
  { label: "Several pay frequencies", aliases: ["Multiple pay frequencies", "Weekly and monthly pay runs"] },
  { label: "Performance reviews", aliases: ["Performance", "Performance reviews"] },
  { label: "Employee self service", aliases: ["Employee self service", "Employee app"] },
  { label: "Employee records", aliases: ["Employee records", "HR records"] },
  { label: "Expense claims", aliases: ["Expense claims", "Expenses"] },
  // CRM
  { label: "Contacts and companies", aliases: ["Accounts and contacts", "Contact and company records"] },
  { label: "Deal pipeline", aliases: ["Deal pipeline", "Pipelines", "Visual pipeline", "Opportunities", "Lead and opportunity management"] },
  { label: "Email integration", aliases: ["Email integration", "Email sync", "Email tracking", "Built in email"] },
  { label: "Automation", aliases: ["Automation", "Automations", "Workflow automation", "Rules"] },
  { label: "Territories", aliases: ["Territories", "Territory management"] },
  { label: "App marketplace", aliases: ["App marketplace", "Marketplace apps"] },
  { label: "Quotes", aliases: ["Quotes", "Quotes to orders"] },
  { label: "ERP integration", aliases: ["ERP integration", "ERP account view"] },
  // ERP
  { label: "Projects", aliases: ["Project", "Projects", "Project accounting"] },
  { label: "CRM", aliases: ["CRM", "CRM add on"] },
  { label: "Ecommerce", aliases: ["Ecommerce", "Website and ecommerce"] },
  { label: "Sales orders", aliases: ["Sales orders", "Order management"] },
  { label: "Warehouse management", aliases: ["Warehouse management", "Multiple warehouses", "Inventory and warehousing"] },
  // Project management
  { label: "Boards", aliases: ["Kanban", "Kanban boards", "Boards", "Lists and boards"] },
  { label: "Timeline", aliases: ["Timeline", "Timeline view", "Gantt"] },
  { label: "Calendar", aliases: ["Calendar", "Calendar view"] },
];

/** Add ons that switch on a feature from the groups above. Keys are add on names as vendors list them. */
const ADDON_FEATURES: Record<string, string> = {
  "multi currency": "Multiple currencies",
  "additional company": "Multiple companies",
  "time tracking": "Time tracking",
  timesheets: "Time tracking",
  performance: "Performance reviews",
  "shift scheduling": "Shift scheduling",
  recruitment: "Recruitment",
  expenses: "Expense claims",
};

const LOOKUP = new Map<string, string>();
for (const g of GROUPS) for (const a of g.aliases) LOOKUP.set(a.toLowerCase(), g.label);

/** The shared label for a feature name, or the name itself when it has no group. */
export function featureLabel(name: string): string {
  return LOOKUP.get(name.toLowerCase()) ?? name;
}

export type FeatureStatus = "included" | "addon" | "not_listed";

/** Labels this product lists as included, after grouping. */
export function includedFeatures(s: Pick<Software, "features">): Set<string> {
  return new Set(s.features.map(featureLabel));
}

/** Labels this product sells as a paid add on, after grouping. */
export function addonFeatures(s: Pick<Software, "pricing_addons">): Set<string> {
  const out = new Set<string>();
  for (const a of s.pricing_addons ?? []) {
    const label = ADDON_FEATURES[a.name.toLowerCase()];
    if (label) out.add(featureLabel(label));
  }
  return out;
}

/** Every feature row for a comparison, and each product's status on it. */
export function featureRows(products: Pick<Software, "features" | "pricing_addons">[]) {
  const included = products.map(includedFeatures);
  const addons = products.map(addonFeatures);
  const labels = Array.from(new Set(included.flatMap((s) => [...s]))).sort((a, b) => a.localeCompare(b));
  return labels.map((label) => ({
    label,
    statuses: products.map((_, i): FeatureStatus => (included[i].has(label) ? "included" : addons[i].has(label) ? "addon" : "not_listed")),
  }));
}
