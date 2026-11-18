import type { ComplianceKey } from "@/lib/site";
import type { CATEGORY_SLUGS } from "@/lib/site";

export type { ComplianceKey };

export type CategorySlug = (typeof CATEGORY_SLUGS)[number];

export type IconName =
  | "calculator"
  | "wallet"
  | "users"
  | "handshake"
  | "boxes"
  | "kanban";

export interface FAQ {
  question: string;
  answer: string;
}

export interface Category {
  slug: CategorySlug;
  name: string;
  /** Used in headings such as "The best accounting software". */
  plural_label: string;
  description: string;
  long_intro: string[];
  icon: IconName;
  /** Which local checklist items matter for this category. */
  compliance_focus: ComplianceKey[];
  faqs: FAQ[];
  sort: number;
}

export type ComplianceStatus = "covered" | "gap" | "unconfirmed";

export interface ComplianceItem {
  status: ComplianceStatus;
  note?: string;
}

export type CompanySize = "sole" | "2-10" | "11-50" | "51-200" | "201-500" | "500+";

export type Currency = "ZAR" | "USD" | "EUR" | "GBP";

export type BillingPeriod =
  | "month"
  | "year"
  | "user_month"
  | "user_year"
  | "employee_month"
  | "worker_month"
  | "user_licence"
  | "once";

/** One row of a headcount bracket price list, such as Sage Payroll. */
export interface PriceBracket {
  from: number;
  /** null means open ended. */
  to: number | null;
  /** Monthly price for the whole bracket, or per person when per_unit is true. */
  price: number;
  per_unit?: boolean;
}

export interface PricingPlan {
  name: string;
  price: number | null;
  period: BillingPeriod;
  currency: Currency;
  vat_inclusive: boolean;
  users?: string;
  features: string[];
  popular?: boolean;
  /** The vendor did not state whether this price includes VAT. */
  vat_unknown?: boolean;
  /** Price for a full year when the vendor lists one. */
  annual_price?: number | null;
  /** Seats included in a flat fee, and the monthly price of each extra seat. */
  included_seats?: number;
  extra_seat_price?: number;
  /**
   * Sliding rates per person on top of the base price, such as SimplePay. Each tier covers
   * people up to `upto` (null means everyone after the last tier) at its own monthly rate.
   */
  seat_tiers?: { upto: number | null; price: number }[];
  /** Minimum seats billed on per seat plans. */
  min_seats?: number;
  /** Most people the plan allows. The cost maths skips the plan above this. */
  max_seats?: number;
  /** The vendor does not say how many people the plan covers, so team cost maths leaves it out. */
  seats_unknown?: boolean;
  /** Headcount brackets. When present they replace price for cost maths. */
  brackets?: PriceBracket[];
  note?: string;
}

export interface PricingAddon {
  name: string;
  price: number | null;
  /** "per company a month", "per user a month", "once off". */
  unit: string;
  currency: Currency;
  vat_inclusive: boolean;
  vat_unknown?: boolean;
  note?: string;
}

export interface PriceSource {
  label: string;
  url: string;
  checked_at: string | null;
}

export interface ReviewSection {
  id: string;
  title: string;
  paragraphs: string[];
  bullets?: string[];
}

/** Our own editorial review. It carries no star rating: ratings come only from readers. */
export interface EditorialReview {
  verdict: string;
  buy_if: string;
  skip_if: string;
  pros: string[];
  cons: string[];
  sections: ReviewSection[];
  reviewed_at: string;
}

export interface PricePoint {
  date: string;
  price: number | null;
  currency: Currency;
  vat_inclusive: boolean;
  note?: string;
}

export interface Screenshot {
  src: string;
  alt: string;
}

export interface VendorDetails {
  company: string;
  founded?: number;
  headquarters?: string;
  local_presence?: string;
  support: string[];
  languages: string[];
  countries: string[];
}

export interface TopFeature {
  title: string;
  body: string;
}

export interface Software {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  short_description: string;
  description: string[];
  logo: string | null;
  brand_color: string | null;
  website: string;
  screenshots: Screenshot[];
  category: CategorySlug;
  deployment: "cloud" | "desktop" | "hybrid";

  starting_price: number | null;
  currency: Currency;
  billing_period: BillingPeriod;
  price_vat_inclusive: boolean;
  /** The vendor did not state whether the starting price includes VAT. */
  price_vat_unknown?: boolean;
  /** "quote" means the vendor sells on quotation. "published" means a list price exists. */
  pricing_model: "published" | "quote";
  free_trial: boolean;
  free_trial_days?: number;
  free_version: boolean;
  demo: boolean;
  pricing_plans: PricingPlan[];
  pricing_addons?: PricingAddon[];
  pricing_sources?: PriceSource[];
  pricing_note?: string;
  price_checked_at: string | null;
  price_history: PricePoint[];

  features: string[];
  top_features: TopFeature[];
  integrations: string[];

  vendor: VendorDetails;
  compliance: Partial<Record<ComplianceKey, ComplianceItem>>;
  bank_feeds: string[];
  best_for_sizes: CompanySize[];
  best_for_roles: string[];

  /** Written by the database trigger only. Never by application code. */
  rating_overall: number | null;
  rating_ease: number | null;
  rating_value: number | null;
  rating_service: number | null;
  rating_functionality: number | null;
  review_count: number;

  alternatives: string[];
  featured: boolean;
  status: "published" | "draft";
  updated_at: string;

  review?: EditorialReview;
}

/** The slim shape client components receive, so pages do not ship whole records. */
export type SoftwareSummary = Pick<
  Software,
  | "id"
  | "slug"
  | "name"
  | "tagline"
  | "short_description"
  | "logo"
  | "brand_color"
  | "website"
  | "category"
  | "starting_price"
  | "currency"
  | "billing_period"
  | "price_vat_inclusive"
  | "price_vat_unknown"
  | "pricing_model"
  | "free_trial"
  | "free_trial_days"
  | "free_version"
  | "deployment"
  | "rating_overall"
  | "review_count"
>;

export interface Review {
  id: string;
  software_id: string;
  rating_overall: number;
  rating_ease: number;
  rating_value: number;
  rating_service: number;
  rating_functionality: number;
  title: string;
  pros: string;
  cons: string;
  reviewer_first_name: string;
  reviewer_role: string;
  company_size: CompanySize;
  usage_duration: string;
  country: string;
  helpful_count: number;
  status: "published" | "hidden";
  created_at: string;
}

export type ArticleBlock =
  | { type: "p"; text: string }
  | { type: "h2"; text: string; id: string }
  | { type: "h3"; text: string }
  | { type: "ul"; items: string[] }
  | { type: "ol"; items: string[] }
  | { type: "table"; head: string[]; rows: string[][] }
  | { type: "callout"; title: string; text: string };

export interface Article {
  slug: string;
  title: string;
  excerpt: string;
  topic: CategorySlug | "compliance" | "buying";
  topic_label: string;
  author: { name: string; role: string; photo: string | null };
  published_at: string;
  updated_at: string;
  reading_minutes: number;
  cover: string | null;
  /** Describes the cover photo for screen readers and image search. */
  cover_alt?: string;
  /** Photographer credit for a stock cover, linked to their profile. */
  cover_credit?: { name: string; url: string };
  body: ArticleBlock[];
  related_software: string[];
  featured: boolean;
  status: "published" | "draft";
  /** Questions answered at the foot of the guide, also published as FAQPage structured data. */
  faqs?: FAQ[];
}

export interface Comparison {
  slug: string;
  a: string;
  b: string;
  winner: string;
  verdict: string;
  pick_other_if: string;
  updated_at: string;
  status: "published" | "draft";
}

export interface Page {
  slug: string;
  title: string;
  description: string;
  updated_at: string;
  body: ArticleBlock[];
}

export interface NewsletterSubscriber {
  id: string;
  email: string;
  interests: CategorySlug[];
  consent_at: string;
  confirmed_at: string | null;
  unsubscribed_at: string | null;
  token: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: ContactSubject;
  message: string;
  consent: boolean;
  handled: boolean;
  created_at: string;
}

export type ContactSubject = "general" | "correction" | "listing" | "vendor" | "advertising";

export interface SearchItem {
  type: "software" | "category" | "comparison" | "guide";
  title: string;
  subtitle: string;
  href: string;
  logo?: string | null;
  keywords?: string;
}

export type ActionResult = { ok: true; message: string } | { ok: false; message: string; fieldErrors?: Record<string, string> };
