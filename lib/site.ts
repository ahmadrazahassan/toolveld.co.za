/**
 * Project facts. This is the only file that may hold the brand name, domain, currency,
 * VAT rate, contact details or the local compliance checklist. Everything else imports from here.
 * To move the site to another market, change this file and nothing else.
 */

export const SITE_NAME = "Toolveld";
export const SITE_DOMAIN = "toolveld.co.za";
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || `https://${SITE_DOMAIN}`).replace(/\/$/, "");
export const SITE_TAGLINE = "Business software, compared in rand";
export const SITE_DESCRIPTION =
  "Independent reviews of accounting, payroll, HR, CRM and ERP software for South African businesses, with rand prices, VAT basis and SARS and POPIA checks.";
/** What the name means, used on the About page. */
export const SITE_NAME_MEANING =
  "Veld is the South African word for open country. Toolveld lays every tool out in the open so you can see what it really costs.";

export const CONTACT_EMAIL = `hello@${SITE_DOMAIN}`;
export const PRIVACY_EMAIL = `privacy@${SITE_DOMAIN}`;
/** Leave empty until a real line is in place. Empty values are not rendered anywhere. */
export const CONTACT_PHONE: string = "+27 64 415 7783";

export const SITE_ADDRESS: {
  street: string;
  locality: string;
  region: string;
  postalCode: string;
  country: string;
  countryName: string;
} = {
  street: "",
  locality: "Johannesburg",
  region: "Gauteng",
  postalCode: "2001",
  country: "ZA",
  countryName: "South Africa",
};

/** Full name of the founder. Also the POPIA information officer. Empty until supplied. */
export const SITE_FOUNDER: string = "Laila Shahid";
/** CIPC registration number, shown in the legal pages once registered. */
export const COMPANY_REGISTRATION: string = "";

export const MARKET = "South Africa";
export const MARKET_ADJECTIVE = "South African";
export const MARKET_FLAG = "za";
export const SITE_LOCALE = "en-ZA";
export const OG_LOCALE = "en_ZA";

export const CURRENCY = "ZAR";
export const CURRENCY_SYMBOL = "R";
export const VAT_RATE = 0.15;
export const VAT_LABEL = "VAT";

/** Rates used to show a rand estimate beside prices billed in foreign currency. */
export const FX_RATES = {
  USD: 16.8,
  EUR: 19.5,
  GBP: 22.4,
} as const;
export const FX_RATE_DATE = "2026-11-16";

export type ComplianceKey =
  | "sars_efiling"
  | "vat201"
  | "emp201"
  | "emp501"
  | "irp5"
  | "uif"
  | "sdl"
  | "eti"
  | "popia"
  | "bcea";

export const COMPLIANCE_CHECKLIST: { key: ComplianceKey; label: string; description: string }[] = [
  { key: "sars_efiling", label: "SARS eFiling", description: "Produces returns in the format SARS eFiling accepts, or submits them directly." },
  { key: "vat201", label: "VAT201", description: "Builds the VAT201 return from your ledger for each VAT period." },
  { key: "emp201", label: "EMP201", description: "Monthly employer declaration of PAYE, UIF and SDL." },
  { key: "emp501", label: "EMP501", description: "Interim and annual employer reconciliation." },
  { key: "irp5", label: "IRP5 / IT3(a)", description: "Employee tax certificates issued with the EMP501." },
  { key: "uif", label: "UIF", description: "Calculates contributions and produces the uFiling declaration." },
  { key: "sdl", label: "SDL", description: "Skills Development Levy on payrolls above the SARS threshold." },
  { key: "eti", label: "ETI", description: "Employment Tax Incentive claimed for qualifying young employees." },
  { key: "popia", label: "POPIA", description: "Data hosting, processing terms and access controls that support POPIA duties." },
  { key: "bcea", label: "BCEA", description: "Leave, hours and payslip rules from the Basic Conditions of Employment Act." },
];

export const BANKS = ["Absa", "FNB", "Standard Bank", "Nedbank", "Capitec", "TymeBank", "Investec", "Discovery Bank"] as const;

export const CATEGORY_SLUGS = ["accounting", "payroll", "hr", "crm", "erp", "project-management"] as const;

/** Only links that exist are rendered. Fill these in once the profiles are live. */
export const SOCIAL_LINKS: { linkedin: string; x: string; facebook: string; youtube: string } = {
  linkedin: "",
  x: "",
  facebook: "",
  youtube: "",
};

/** A product needs this many published reviews before it shows a rating or a rank. */
export const MIN_PUBLIC_REVIEWS = 5;

/** People shown on the About page. Real people only, with their consent. */
export const TEAM: { name: string; role: string; photo: string; bio: string }[] = [];

/** The editorial byline used on guides until named writers are added to TEAM. */
export const EDITORIAL_DESK = `The ${SITE_NAME} desk`;

export const NAV_LINKS = [
  { href: "/software", label: "Software" },
  { href: "/categories", label: "Categories" },
  { href: "/compare", label: "Compare" },
  { href: "/blog", label: "Guides" },
  { href: "/about", label: "About" },
] as const;
