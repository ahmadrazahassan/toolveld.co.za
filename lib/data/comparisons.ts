import type { Comparison } from "@/lib/types";

const DATE = "2026-11-16";
const DATE_HR = "2026-11-18";

/** Written verdicts. Pairs without one still get a page built from the data. */
export const comparisons: Comparison[] = [
  {
    slug: "xero-vs-sage-accounting",
    a: "xero",
    b: "sage-accounting",
    winner: "xero",
    verdict:
      "Xero wins for most small businesses that work closely with an accountant. Unlimited users on every plan means your bookkeeper and your accountant log in at no extra cost, and the app store covers stock, point of sale and reporting without custom work. Sage Accounting is cheaper to start and has a strong local support line, but you feel its limits sooner as the team grows.",
    pick_other_if:
      "Pick Sage Accounting if you are a sole owner watching every rand, want to phone a South African support team, or plan to run Sage Payroll from the same vendor.",
    updated_at: DATE,
    status: "published",
  },
  {
    slug: "bamboohr-vs-sage-hr",
    a: "bamboohr",
    b: "sage-hr",
    winner: "sage-hr",
    verdict:
      "Sage HR wins for most South African teams. It is priced in rand per employee, from R28 a month for records and leave, so a company of twenty people pays about R560 a month before any extra modules. BambooHR charges a flat $250 a month before VAT for 25 employees or fewer, about R4 200 at our exchange rate, and the bill moves with the rand. BambooHR is the more polished system, but for leave, records and shifts Sage HR does the job at a fraction of the cost.",
    pick_other_if:
      "Pick BambooHR if you have international staff or investors who expect a polished HR system, you want strong onboarding and headcount reports from day one, and a dollar price suits your budget.",
    updated_at: DATE_HR,
    status: "published",
  },
  {
    slug: "hubspot-crm-vs-zoho-crm",
    a: "hubspot-crm",
    b: "zoho-crm",
    winner: "hubspot-crm",
    verdict:
      "HubSpot wins for small teams buying their first CRM. Sales people keep it up to date because it is easy to use, the free plan is genuinely useful, and marketing and service tools share the same record when you need them. Zoho CRM offers more automation for less money, but it takes more setup before it feels right.",
    pick_other_if:
      "Pick Zoho CRM if you need territories and serious automation on a tight budget, or if your books already run on Zoho Books.",
    updated_at: DATE,
    status: "published",
  },
  {
    slug: "asana-vs-monday-com",
    a: "asana",
    b: "monday-com",
    winner: "asana",
    verdict:
      "Asana wins for teams running many projects at once. Portfolios, goals and the workload view give leaders a clear picture without opening every project, and the structure keeps large teams consistent. monday.com is more flexible and quicker to bend into non project work, but that freedom gets messy across a whole company.",
    pick_other_if:
      "Pick monday.com if you want one tool for projects, sales pipelines, content calendars and trackers, and your team likes building its own boards.",
    updated_at: DATE,
    status: "published",
  },
  {
    slug: "simplepay-vs-sage-payroll",
    a: "simplepay",
    b: "sage-payroll",
    winner: "simplepay",
    verdict:
      "SimplePay is the better payroll for most small and mid sized teams. EMP201, EMP501, IRP5 certificates, UIF, ETI and BCEA leave are all handled, staff get a self service login, and it posts journals into Xero, Sage Accounting and QuickBooks Online. The price per employee falls as you grow, so it stays reasonable well past fifty staff.",
    pick_other_if:
      "Pick Sage Payroll if you already run Sage Accounting, employ fewer than ten people and want one vendor and one support line for books and payroll.",
    updated_at: DATE,
    status: "published",
  },
  {
    slug: "syspro-vs-sage-evolution",
    a: "syspro",
    b: "sage-evolution",
    winner: "syspro",
    verdict:
      "SYSPRO wins for manufacturers. Bills of materials, work in progress, production planning and lot traceability are part of the core product, not add ons, and it scales to much larger operations. Sage 200 Evolution is the easier and usually cheaper step for a business growing out of Pastel, with a familiar accounting core and a wide partner network.",
    pick_other_if:
      "Pick Sage 200 Evolution if you are a distributor or retailer coming from Pastel, your production is simple and you want the shortest path to an ERP.",
    updated_at: DATE,
    status: "published",
  },
  {
    slug: "payspace-vs-sage-300-people",
    a: "payspace",
    b: "sage-300-people",
    winner: "payspace",
    verdict:
      "PaySpace wins for employers moving payroll and HR to the cloud. One employee record drives payroll, leave and HR, the self service app reduces queries, and running payroll in other African countries is part of the product. Sage 300 People is proven at very large scale and suits employers who want to keep systems on their own servers.",
    pick_other_if:
      "Pick Sage 300 People if you need on premises hosting, already have a trusted Sage partner, or run very large union payrolls the team knows inside out.",
    updated_at: DATE,
    status: "published",
  },
  {
    slug: "xero-vs-zoho-books",
    a: "xero",
    b: "zoho-books",
    winner: "zoho-books",
    verdict:
      "Zoho Books wins on cost. A free plan for businesses under R1 million in revenue, paid plans from R99 a month and automation on the mid plans make it the best value ledger on our register. Xero has the larger app store and far more South African accountants who already know it.",
    pick_other_if:
      "Pick Xero if your accountant works in Xero, you need apps for stock or point of sale, or you want unlimited users on every plan.",
    updated_at: DATE,
    status: "published",
  },
];
