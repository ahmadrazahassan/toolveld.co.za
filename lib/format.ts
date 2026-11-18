import { CURRENCY_SYMBOL, FX_RATES, FX_RATE_DATE, SITE_LOCALE, VAT_LABEL, VAT_RATE } from "@/lib/site";
import type { BillingPeriod, Currency, PricingPlan, Software } from "@/lib/types";

const numberFormat = new Intl.NumberFormat(SITE_LOCALE, { maximumFractionDigits: 2, minimumFractionDigits: 0 });
const wholeFormat = new Intl.NumberFormat(SITE_LOCALE, { maximumFractionDigits: 0 });
const dateFormat = new Intl.DateTimeFormat(SITE_LOCALE, {
  day: "numeric",
  month: "short",
  year: "numeric",
  timeZone: "Africa/Johannesburg",
});
const longDateFormat = new Intl.DateTimeFormat(SITE_LOCALE, {
  day: "numeric",
  month: "long",
  year: "numeric",
  timeZone: "Africa/Johannesburg",
});

const FOREIGN_SYMBOL: Record<Exclude<Currency, "ZAR">, string> = { USD: "$", EUR: "€", GBP: "£" };

/** Intl uses a no break space between thousands in en-ZA. We print a plain space: 1 375. */
function spaces(text: string) {
  return text.replace(/[  ]/g, " ");
}

export function formatNumber(value: number) {
  return spaces(numberFormat.format(value));
}

const centsFormat = new Intl.NumberFormat(SITE_LOCALE, { maximumFractionDigits: 2, minimumFractionDigits: 2 });

/** Whole amounts print without cents; anything else always shows two decimals, so 17,50 never reads as 17,5. */
function moneyNumber(value: number) {
  const rounded = Math.round(value * 100) / 100;
  return spaces(Number.isInteger(rounded) ? wholeFormat.format(rounded) : centsFormat.format(rounded));
}

export function formatRand(value: number, opts: { whole?: boolean } = {}) {
  const text = opts.whole ? spaces(wholeFormat.format(Math.round(value))) : moneyNumber(value);
  return `${CURRENCY_SYMBOL}${text}`;
}

export function formatMoney(value: number, currency: Currency) {
  if (currency === "ZAR") return formatRand(value);
  return `${FOREIGN_SYMBOL[currency]}${moneyNumber(value)}`;
}

export const PERIOD_LABEL: Record<BillingPeriod, string> = {
  month: "/mo",
  year: "/yr",
  user_month: "/user/mo",
  user_year: "/user/yr",
  employee_month: "/employee/mo",
  worker_month: "/worker/mo",
  user_licence: "/user licence",
  once: "once off",
};

export const BILLED_LABEL: Record<BillingPeriod, string> = {
  month: "Monthly",
  year: "Yearly",
  user_month: "Per user, monthly",
  user_year: "Per user, yearly",
  employee_month: "Per employee, monthly",
  worker_month: "Per worker, monthly",
  user_licence: "Per user licence",
  once: "Once off",
};

export function vatBasis(inclusive: boolean, unknown = false) {
  if (unknown) return `${VAT_LABEL} not stated`;
  return inclusive ? `incl ${VAT_LABEL}` : `excl ${VAT_LABEL}`;
}

/** Converts a foreign price to rand at the stated rate. */
export function toRand(value: number, currency: Currency) {
  if (currency === "ZAR") return value;
  return value * FX_RATES[currency];
}

export function fxNote(currency: Currency) {
  if (currency === "ZAR") return null;
  const unit = currency === "USD" ? "dollar" : currency === "EUR" ? "euro" : "pound";
  return `Rand estimate at ${formatRand(FX_RATES[currency])} to the ${unit}, our rate on ${formatDate(FX_RATE_DATE)}.`;
}

export interface PriceParts {
  /** Main figure: "R485", "Free", "Quoted". */
  amount: string;
  /** "/mo", "/user/mo". Empty for Free and Quoted. */
  period: string;
  /** "incl VAT" or "excl VAT". Empty for Free and Quoted. */
  basis: string;
  /** "about R151" for foreign prices. */
  estimate: string | null;
  fx: string | null;
  kind: "price" | "free" | "quoted" | "unlisted";
}

export function priceParts(input: {
  price: number | null;
  currency: Currency;
  period: BillingPeriod;
  vatInclusive: boolean;
  vatUnknown?: boolean;
  pricingModel?: "published" | "quote";
}): PriceParts {
  const { price, currency, period, vatInclusive, vatUnknown = false, pricingModel = "quote" } = input;
  if (price === null) {
    return pricingModel === "quote"
      ? { amount: "Quoted", period: "", basis: "", estimate: null, fx: null, kind: "quoted" }
      : { amount: "See vendor", period: "", basis: "", estimate: null, fx: null, kind: "unlisted" };
  }
  if (price === 0) return { amount: "Free", period: "", basis: "", estimate: null, fx: null, kind: "free" };
  const estimate = currency === "ZAR" ? null : `about ${formatRand(toRand(price, currency), { whole: true })}`;
  return {
    amount: formatMoney(price, currency),
    period: PERIOD_LABEL[period],
    basis: vatBasis(vatInclusive, vatUnknown),
    estimate,
    fx: fxNote(currency),
    kind: "price",
  };
}

export type PriceFields = Pick<
  Software,
  "starting_price" | "currency" | "billing_period" | "price_vat_inclusive" | "pricing_model" | "price_vat_unknown"
>;

export function softwarePriceParts(s: PriceFields) {
  return priceParts({
    price: s.starting_price,
    currency: s.currency,
    period: s.billing_period,
    vatInclusive: s.price_vat_inclusive,
    // When the vendor does not state the VAT basis, say so rather than guess.
    vatUnknown: Boolean(s.price_vat_unknown),
    pricingModel: s.pricing_model,
  });
}

export function planPriceParts(p: PricingPlan, pricingModel: "published" | "quote" = "quote") {
  return priceParts({
    price: p.price,
    currency: p.currency,
    period: p.period,
    vatInclusive: p.vat_inclusive,
    vatUnknown: p.vat_unknown,
    pricingModel,
  });
}

/** One line: "R485 /mo incl VAT", "$9 /user/mo excl VAT (about R151)", "Free", "Quoted". */
export function formatPriceLine(parts: PriceParts) {
  if (parts.kind !== "price") return parts.amount;
  return `${parts.amount} ${parts.period} ${parts.basis}${parts.estimate ? ` (${parts.estimate})` : ""}`;
}

export function formatSoftwarePrice(s: PriceFields) {
  return formatPriceLine(softwarePriceParts(s));
}

export function addVat(value: number) {
  return value * (1 + VAT_RATE);
}

export function removeVat(value: number) {
  return value / (1 + VAT_RATE);
}

export function formatDate(iso: string | null | undefined) {
  if (!iso) return "";
  return dateFormat.format(new Date(iso));
}

export function formatLongDate(iso: string | null | undefined) {
  if (!iso) return "";
  return longDateFormat.format(new Date(iso));
}

export function formatRating(value: number | null) {
  if (value === null) return "";
  return value.toFixed(1);
}

export const COMPANY_SIZE_LABEL: Record<string, string> = {
  sole: "Sole trader",
  "2-10": "2 to 10",
  "11-50": "11 to 50",
  "51-200": "51 to 200",
  "201-500": "201 to 500",
  "500+": "500 plus",
};

export function daysSince(iso: string | null, now = new Date()) {
  if (!iso) return Number.POSITIVE_INFINITY;
  return Math.floor((now.getTime() - new Date(iso).getTime()) / 86_400_000);
}

/** ISO date (yyyy-mm-dd) for a number of days before today. */
export function daysAgoIso(days: number) {
  return new Date(Date.now() - days * 86_400_000).toISOString().slice(0, 10);
}
