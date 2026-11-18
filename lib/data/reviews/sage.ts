import type { EditorialReview } from "@/lib/types";
import { REVIEWED, section } from "./helpers";

/**
 * Editorial reviews of the Sage range in South Africa. Every price quoted here comes from
 * Sage's own 2026 to 2027 price guides or its South African online shop, checked on 16 Nov 2026.
 */
export const sageReviews: Record<string, EditorialReview> = {
  "sage-accounting": {
    verdict:
      "Sage Accounting is the safest cloud ledger for a South African owner who wants local support, a VAT201 that matches how SARS thinks, and payroll from the same company. It is cheap to start at R270 a month and stays cheaper than Xero Standard at every team size it supports, but the Accounting plan allows at most five users, so larger finance teams need Xero or a bigger Sage product.",
    buy_if:
      "You run one company with up to five people in the books, you want a South African support line, and you plan to add Sage Payroll later.",
    skip_if:
      "Many people need access, you want a large app store for stock or point of sale, or your accountant works mainly in Xero.",
    pros: [
      "VAT201 figures come straight from tagged transactions",
      "Local support team and a familiar structure for Pastel trained bookkeepers",
      "Clear published pricing with every add on listed in rand",
      "Pairs with Sage Payroll for one vendor and one bill",
      "Bank feeds from the large South African banks",
    ],
    cons: [
      "Only 2 users on the main plan, then R85 a month per extra user",
      "Each extra company costs R460 a month, which adds up for groups",
      "Inventory beyond the basics is a R465 a month add on",
      "Smaller app ecosystem than Xero",
    ],
    reviewed_at: REVIEWED,
    sections: [
      section("what-it-is", "What Sage Accounting is", [
        "Sage Accounting is Sage's cloud ledger for small businesses. South Africans who have been in business a while will remember it as Sage One, and before that as part of the Pastel family's move to the cloud. It is not a cut down Pastel. It is a separate product that runs in the browser and on a phone, with its own way of doing things.",
        "It covers the daily bookkeeping cycle of a small company: quotes and invoices, supplier bills, bank feeds and reconciliation, VAT, and the reports your accountant needs at year end. Sage sells it in two plans and lets you bolt on users, companies and modules as the business grows.",
      ]),
      section("plans", "The two plans, in plain terms", [
        "Start costs R270 a month and gives one company and one user. It is meant for a sole trader or micro business that needs to quote, invoice, see who owes money and file VAT. Bought through Sage's online shop it is R3 240 for a year.",
        "Accounting, which the shop calls Standard, costs R490 a month and gives one company and two users. This is the plan most small businesses should start on, because it adds supplier bills and purchase orders and is the plan that accepts add ons. Through the shop it is from R5 880 a year.",
      ], [
        "Start: R270 a month, 1 company, 1 user, R3 240 a year",
        "Accounting: R490 a month, 1 company, 2 users, from R5 880 a year",
        "Prices apply from 1 October 2026 or your next renewal after that",
      ]),
      section("real-cost", "What it really costs as you grow", [
        "The headline price is only the start. The Accounting plan includes two users, and every user after that is R85 a month. A team of five people in the books therefore pays R490 plus three extra users at R85, which is R745 a month or R8 940 a year.",
        "Add ons are priced per company. A wholesaler that needs Advanced Inventory adds R465, taking that five person team to R1 210 a month. A business with two trading entities pays R460 a month for the second company, before any add ons on that company.",
        "The Accounting plan allows up to five users on Sage's South African pricing page, so plan for that ceiling. Within it, Sage stays cheaper than Xero Standard at R857 a month including VAT: five users cost R745. If more than five people need the books, Sage Accounting no longer fits; Xero includes unlimited users, and within Sage the next step is Sage 50cloud Pastel or Sage 200 Evolution.",
      ], [
        "2 users: R490 a month, R5 880 a year",
        "5 users: R745 a month, R8 940 a year",
        "5 users with Advanced Inventory: R1 210 a month",
        "Most users on the Accounting plan: 5",
        "Against Xero Standard at R857: Sage is cheaper at every size from 1 to 5 users",
      ]),
      section("add-ons", "Every add on, and who needs it", [
        "Sage publishes its add on prices in rand, which most vendors do not. Here is when each one earns its place.",
      ], [
        "Additional user, R85 a month: anyone beyond the two included on Accounting",
        "Additional company, R460 a month: a second trading entity, trust or holding company",
        "Multi Currency, R185 a month per company: you invoice or pay suppliers in dollars, euros or pounds",
        "Time Tracking, R185 a month per company: service businesses that bill hours",
        "Advanced Inventory, R465 a month per company: stock across locations, assemblies or serial numbers",
        "Debtors Manager, R325 a month per company: automated reminders and collections for businesses with many accounts",
        "Additional storage, R20 per GB a month: large volumes of attached documents",
      ]),
      section("local-rules", "VAT, SARS and South African banking", [
        "This is where Sage earns its fee. VAT is tagged on every line as you capture it, and the VAT201 figures come out of the ledger for your period. Zero rated and exempt supplies are handled as separate codes, which matters for exporters and for businesses with mixed supplies.",
        "Bank feeds come from the large South African banks, so reconciliation is a matter of matching rather than importing statements. Check your exact account type, because business credit cards and some smaller banks are handled differently.",
        "As with most products on our register, you still submit the VAT201 on SARS eFiling yourself. Ask Sage whether direct submission is available on your plan before relying on it.",
      ]),
      section("daily-use", "Using it day to day", [
        "The interface is plainer than Xero's and a little slower to click through, but it is logical and South African bookkeepers find their way around quickly. Invoices can carry your logo and banking details, recurring invoices handle monthly retainers, and the cash flow view shows what is coming in and going out over the next few weeks.",
        "The mobile app is useful for capturing an invoice or checking a balance on the road, but most bookkeeping still happens on a laptop.",
      ]),
      section("support", "Support and the Sage partner network", [
        "Sage has a local support team that knows SARS deadlines, local banks and the questions South African businesses actually ask. That is a real advantage over international products whose support works in another time zone.",
        "Sage also runs a large network of accountants and bookkeepers who work in its products, and a learning programme that it now bundles with subscriptions. If you want someone to set up your chart of accounts or train a new bookkeeper, they are not hard to find.",
      ]),
      section("fit", "Where it sits in the Sage family", [
        "Sage Accounting is the cloud entry point. Businesses that outgrow it usually move in one of two directions: to Sage 200 Evolution when stock, branches or job costing become serious, or to Sage Intacct when the problem is multi entity finance and reporting rather than operations.",
        "If you are on Pastel today and mainly want cloud access and simpler admin, Sage Accounting is the lighter move within the same vendor. If you rely on Pastel's depth in stock or multiple companies, look at Evolution instead.",
      ]),
    ],
  },

  "sage-pastel-accounting": {
    verdict:
      "Sage 50cloud Pastel is still a sound choice for businesses that want their books on their own machine, run several companies, and have a bookkeeper who already knows it. It is expensive next to cloud products: the Core licence costs R22 980 a year for four users, about three times what four users pay on Sage Accounting. You are paying for desktop depth, offline speed and multiple companies in one licence.",
    buy_if:
      "You run several companies from one office, your internet is unreliable, or your accountant and bookkeeper are trained on Pastel and you want no disruption.",
    skip_if:
      "Your team works from different places, you share the books with an accountant every month, or you are starting fresh with no Pastel history.",
    pros: [
      "Multiple companies included in every tier from Start upwards",
      "Runs on your own computer or server without needing the internet",
      "Deep local familiarity among bookkeepers and accountants",
      "Yearly licence includes telephone support and upgrades",
      "Clear path to Sage 200 Evolution when you outgrow it",
    ],
    cons: [
      "Much more expensive per user than cloud ledgers",
      "Remote access and accountant access need extra setup",
      "Yearly licence means a large single payment, unless you take a bundle on instalments",
      "VAT basis is not stated on some shop prices, so confirm before you pay",
    ],
    reviewed_at: REVIEWED,
    sections: [
      section("what-it-is", "What Pastel is today", [
        "Pastel has been part of South African bookkeeping since the late 1980s. Sage bought the business when it acquired Softline in 2003, and the desktop product is now sold as Sage 50cloud Pastel. The cloud in the name refers to optional connected services, not to the ledger itself, which still runs on a Windows computer or a server in your office.",
        "Sage's South African shop currently sells it in tiers called Start, Core and Plus, alongside the older Xpress and Partner editions that many businesses still run.",
      ]),
      section("plans", "Every tier and what it costs", [
        "All Pastel licences are yearly. Sage's shop shows Start, Core and Plus including VAT, and lists Xpress and the Partner bundles as starting prices without saying whether VAT is included.",
      ], [
        "Xpress: from R9 600 a year, the entry desktop edition",
        "Start: R16 500 a year including VAT, 2 users and 2 companies",
        "Core: R22 980 a year including VAT, 4 users and 4 companies",
        "Plus: R32 580 a year including VAT, 5 users and 5 companies, extra users R265 a month",
        "Pastel Partner: from R1 510, up to 20 users, unlimited companies and 30 cash books",
        "Xpress and Payroll bundle: from R1 095 a month in instalments",
        "Partner and Payroll bundle: from R1 755 a month in instalments",
      ]),
      section("real-cost", "The cost per user, worked out", [
        "Spread over twelve months, Start costs R1 375 a month for two users, Core R1 915 for four, and Plus R2 715 for five. Per user per year that is R8 250 on Start, R5 745 on Core and R6 516 on Plus, so Core is the best value tier for a small team.",
        "For comparison, four users on Sage Accounting cost R660 a month including VAT, or R7 920 a year, against R22 980 for Pastel Core. The difference buys you four companies in one licence, desktop speed and offline work. If you only run one company, that premium is hard to justify. If you run four, Sage Accounting would charge R460 a month for each extra company, and Pastel looks much more reasonable.",
      ], [
        "Start: R1 375 a month equivalent, R8 250 per user a year",
        "Core: R1 915 a month equivalent, R5 745 per user a year",
        "Plus: R2 715 a month equivalent, R6 516 per user a year",
        "Sixth user on Plus: R265 a month, R3 180 a year",
      ]),
      section("local-rules", "VAT and local reporting", [
        "Pastel handles VAT the way South African accountants expect, with VAT201 figures produced for each period and tax codes for standard, zero rated and exempt supplies. Debtors and creditors age analyses, stock valuation and the standard management reports are all built in.",
        "Bank statements are imported rather than fed live, which is a step backwards if you are used to a cloud ledger. Many businesses accept this because Pastel is fast once the data is in.",
      ]),
      section("daily-use", "Living with a desktop ledger", [
        "Pastel is quick, keyboard friendly and predictable. Experienced bookkeepers capture batches of transactions faster than in most cloud products.",
        "The pain comes from location. Your accountant either visits, remotes into your machine or receives a backup. Two people in different towns cannot work in the same company file without remote desktop or hosting, and backups are your responsibility. Budget for a proper backup routine and an uninterruptible power supply if you rely on it.",
      ]),
      section("support", "Support and partners", [
        "The yearly licence includes unlimited telephone support, software upgrades, access to Sage's customer zone and discounted training. A large network of Sage business partners installs Pastel, migrates data and helps at year end, often on site.",
      ]),
      section("fit", "When to move on, and where to", [
        "Move up to Sage 200 Evolution when stock, branches, job costing or manufacturing outgrow Pastel. The accounting core will feel familiar and Sage partners do this migration often.",
        "Move across to Sage Accounting or Xero when the main problem is location: more than one person working remotely, or an accountant who wants live access. Pick a clean start date, bring across balances and open items rather than full history, and keep the old Pastel company readable for five years for SARS.",
      ]),
    ],
  },

  "sage-payroll": {
    verdict:
      "Sage Payroll is a dependable cloud payroll for small South African teams, priced by headcount bracket so the bill is easy to predict. It covers the full SARS cycle and pairs naturally with Sage Accounting. For most teams under fifty it costs more than SimplePay at SimplePay's own calculator prices, so pick it when one vendor for books and payroll matters more than the last few hundred rand.",
    buy_if: "You already run Sage Accounting, you have under fifty staff, and you value one support line for books and payroll.",
    skip_if: "Price is your first concern, you want a richer employee self service app, or you run complex multi company payrolls.",
    pros: [
      "Official bracket pricing published in rand from 1 to 200 plus employees",
      "Full statutory cycle: EMP201, EMP501, IRP5 and IT3(a), UIF, SDL and ETI",
      "Tax year updates included in the subscription",
      "Same vendor and support line as Sage Accounting",
      "Multi factor sign in protects employee data",
    ],
    cons: [
      "Bracket jumps: going from 10 to 11 employees adds R211 a month",
      "Dearer than SimplePay from three employees upward",
      "Wide brackets mean you can pay for empty places in a band",
      "Fewer HR features than dedicated HR tools",
    ],
    reviewed_at: REVIEWED,
    sections: [
      section("what-it-is", "What Sage Payroll does", [
        "Sage Payroll, sold as Sage Business Cloud Payroll, is a cloud payroll for small and mid sized South African employers. It calculates PAYE from the current tables, deducts UIF up to the earnings ceiling, adds SDL when your payroll passes the threshold, and claims the Employment Tax Incentive for qualifying young employees.",
        "Sage's own 2026 to 2027 update lists the improvements it has made: multi factor sign in, ongoing legislative updates, imports from your financial system, automatic tax year updates and better handling of PAYE, UIF and SDL edge cases.",
      ]),
      section("brackets", "The full price list, bracket by bracket", [
        "Sage charges a fixed monthly price for each band of employees. Everyone in a band pays the same, so three employees and five employees both pay R224. The yearly price is the monthly price times twelve. These prices apply from 1 September 2026, or from your next renewal after that.",
      ], [
        "1 to 2 employees: R97 a month, R1 164 a year",
        "3 to 5: R224 a month, R2 688 a year",
        "6 to 10: R430 a month, R5 160 a year",
        "11 to 15: R641 a month, R7 692 a year",
        "16 to 20: R816 a month, R9 792 a year",
        "21 to 25: R1 018 a month, R12 216 a year",
        "26 to 30: R1 161 a month, R13 932 a year",
        "31 to 40: R1 549 a month, R18 588 a year",
        "41 to 50: R1 832 a month, R21 984 a year",
        "51 to 60: R2 199 a month, R26 388 a year",
        "61 to 70: R2 421 a month, R29 052 a year",
        "71 to 80: R2 769 a month, R33 228 a year",
        "81 to 90: R2 931 a month, R35 172 a year",
        "91 to 100: R3 225 a month, R38 700 a year",
        "101 to 110: R3 355 a month, R40 260 a year",
        "111 to 120: R3 421 a month, R41 052 a year",
        "121 to 130: R3 706 a month, R44 472 a year",
        "131 to 140: R3 838 a month, R46 056 a year",
        "141 to 150: R3 970 a month, R47 640 a year",
        "151 to 175: R4 273 a month, R51 276 a year",
        "176 to 200: R4 475 a month, R53 700 a year",
        "201 and more: R22,37 per employee a month",
      ]),
      section("per-head", "What each employee costs you", [
        "Because you pay per bracket, the cost per employee depends on where you sit inside it. A business at the top of a bracket gets the best rate; one employee more and you jump to the next band.",
        "At 10 employees you pay R43 each. At 11 you pay R58,27 each, because the 11 to 15 band starts at R641. At 50 employees the rate is R36,64, at 100 it is R32,25 and at 200 it falls to R22,38, almost exactly the R22,37 Sage charges per head above 200. If you are about to hire past a bracket edge, the extra cost is the jump, not one person's share.",
      ], [
        "Bracket edge at 10 to 11: plus R211 a month",
        "Bracket edge at 30 to 31: plus R388 a month",
        "Bracket edge at 150 to 151: plus R303 a month",
      ]),
      section("local-rules", "SARS and Department of Employment and Labour", [
        "Each month Sage Payroll produces the EMP201 figures split into PAYE, UIF, SDL and ETI. Twice a year it prepares the EMP501 reconciliation and the IRP5 and IT3(a) certificates from the same data, ready for e@syFile. Monthly UIF declarations for uFiling come from the same records.",
        "Leave is tracked, but check how closely the default leave types follow your BCEA cycles and any sectoral determination that applies to you before you rely on it.",
      ]),
      section("comparison", "Sage Payroll against SimplePay", [
        "The obvious alternative is SimplePay, also built for South Africa. Its price calculator showed a R70 base plus R19,50 for each of the first five employees, R13,60 for the next five and R11 after that, excluding VAT, on 17 November 2026. Sage's pricing page shows its payroll prices including VAT, so we add VAT to SimplePay to compare like with like. For one or two employees Sage is cheaper, R97 against about R103 and R125. From three employees SimplePay is cheaper: five employees cost about R193 on SimplePay against R224 on Sage, ten about R271 against R430 and twenty five about R461 against R1 018.",
        "Sage's case is integration and vendor consolidation. If your books are in Sage Accounting and you want one support line, the extra cost is the price of simplicity. If you use Xero or want the lowest cost, SimplePay is the stronger buy.",
      ]),
      section("fit", "Where it sits in the Sage family", [
        "Sage Payroll is the cloud payroll for small teams. Businesses with complicated payrolls, many pay frequencies or loans and garnishees usually move to Sage Payroll Professional on the desktop, and large employers to Sage 300 People.",
      ]),
    ],
  },

  "sage-payroll-professional": {
    verdict:
      "Sage Payroll Professional is the detailed desktop payroll that grew out of Pastel Payroll, and it remains a strong choice for payroll administrators who want every setting at their fingertips. Sage's shop sells it as Sage Pastel Payroll from R4 920 a year, which is fair for the depth you get, but the price rises with headcount and most buyers also pay a partner for setup and year end help.",
    buy_if: "You employ between ten and a few hundred people, run several pay frequencies or loans and garnishees, and have someone who owns payroll.",
    skip_if: "You want payroll in the cloud with employee self service, or you are a small team where a simple cloud payroll will do.",
    pros: [
      "Full statutory cycle with detailed control over every setting",
      "Handles loans, garnishee orders, cost centres and several pay frequencies",
      "Runs on your own machine, so employee data stays in your office",
      "Large partner network for installation and year end",
      "Bundles with Pastel accounting on monthly instalments",
    ],
    cons: [
      "Desktop only, so remote work needs extra setup",
      "Entry price covers the smallest employee band only",
      "VAT basis and headcount limits are not shown with the shop price",
      "Older interface than modern cloud payrolls",
    ],
    reviewed_at: REVIEWED,
    sections: [
      section("what-it-is", "What it is", [
        "Sage Payroll Professional is the payroll many South African businesses knew as Pastel Payroll, and Sage's online shop still lists it under that name. It runs on a Windows computer or a server and handles the full South African cycle from the monthly EMP201 to the twice yearly EMP501 reconciliation.",
        "Its strength is control. Payroll administrators can set up pay frequencies, deductions, allowances, loans and garnishee orders exactly as the business needs, with cost centres for reporting.",
      ]),
      section("pricing", "Pricing", [
        "Sage's South African shop lists Sage Pastel Payroll on an annual licence from R4 920 a year, which works out to R410 a month. The shop does not say whether VAT is included or how many employees that starting price covers, so ask for the price at your headcount.",
        "Sage also sells payroll bundled with Pastel accounting: the Xpress and Payroll bundle from R1 095 a month and the Partner and Payroll bundle from R1 755 a month, both paid in instalments.",
      ], [
        "Sage Pastel Payroll annual licence: from R4 920 a year",
        "Xpress and Payroll bundle: from R1 095 a month",
        "Partner and Payroll bundle: from R1 755 a month",
        "Budget separately for installation, training and year end support from a partner",
      ]),
      section("local-rules", "Statutory work", [
        "Monthly EMP201 figures, the interim and annual EMP501, IRP5 and IT3(a) certificates, UIF declarations, SDL and ETI are all part of the product. Tax tables are updated each year as part of the licence.",
        "Leave follows South African leave types and can be configured for sectoral rules. HR records sit alongside payroll, though dedicated HR tools go further on performance and onboarding.",
      ]),
      section("daily-use", "Running payroll on it", [
        "Experienced administrators find it fast and thorough. Month end is a predictable routine: capture changes, process, check the reports, pay and file. The depth that makes it powerful also means new users need training, and most businesses lean on a Sage partner for the first year end.",
      ]),
      section("fit", "Where it sits in the Sage family", [
        "Smaller teams that want simplicity should look at Sage Payroll in the cloud, which starts at R97 a month for two employees. Employers with hundreds or thousands of staff, union agreements or Employment Equity reporting needs usually move up to Sage 300 People.",
      ]),
    ],
  },

  "sage-hr": {
    verdict:
      "Sage HR is a light, modern HR tool priced in rand per employee, and its modular pricing is its best feature: start at R28 per employee for records and leave, then add only the modules you need. A thirty person company running everything except recruitment pays about R2 400 a month. It suits growing businesses that want leave out of WhatsApp without buying a large platform.",
    buy_if: "You have between ten and two hundred staff, want leave and records in an app, and prefer to pay only for the modules you use.",
    skip_if: "You need deep performance management, a full applicant tracking system, or HR and payroll on one record.",
    pros: [
      "Rand pricing per employee with clear module prices",
      "Core HR and leave from R28 per employee a month",
      "Phone app staff actually use for leave requests",
      "Shift scheduling and timesheets for hourly teams",
      "30 day free trial with no payment details and no long term contract",
    ],
    cons: [
      "Costs climb with every module and every employee",
      "Built for companies of up to 250 employees, so larger employers need Sage 300 People",
      "Recruitment is a flat R1 850 a month, steep for small hiring volumes",
      "Leave types need checking against BCEA cycles during setup",
      "Payroll is a separate Sage product",
    ],
    reviewed_at: REVIEWED,
    sections: [
      section("what-it-is", "What Sage HR is", [
        "Sage HR started life as CakeHR, an independent HR app that Sage bought and folded into its range. That history shows: it feels like a modern app rather than a traditional Sage product, with a clean interface and a mobile app that staff are happy to use.",
        "The core covers employee records and leave. Everything else is an optional module: performance reviews, shift scheduling, timesheets, expenses and recruitment.",
      ]),
      section("pricing", "Module prices", [
        "Sage prices Sage HR per employee per month in rand. These are the figures on Sage's South African HR page, checked on 17 November 2026. Core HR and leave is compulsory; every other module is optional and can be switched on or off later. The page does not say whether the prices include VAT.",
      ], [
        "Core HR and leave: R28 per employee a month, required",
        "Performance: R14 per employee a month",
        "Shift scheduling: R14 per employee a month",
        "Timesheets: R14 per employee a month",
        "Expenses: R10 per employee a month",
        "Recruitment: R1 850 a month flat",
      ]),
      section("real-cost", "Worked examples", [
        "Because everything is per employee, the bill grows in a straight line with headcount. Here is what typical setups cost each month.",
      ], [
        "15 staff, core only: R420 a month",
        "30 staff, core only: R840 a month",
        "30 staff, core, performance, shifts, timesheets and expenses: R2 400 a month",
        "30 staff, everything including recruitment: R4 250 a month",
        "100 staff, core and performance: R4 200 a month",
        "250 staff, the most Sage HR supports, core only: R7 000 a month",
      ]),
      section("trial", "Trial, contract and limits", [
        "The trial runs for 30 days and Sage does not ask for payment details to start it. After that there is no long term contract: you pay monthly per employee and can cancel, add modules or drop them at any time. Sage also offers a live demo and a self guided product tour if you want to see it before signing up.",
        "Sage built Sage HR for companies with up to 250 employees. Above that, Sage points larger employers to Sage 300 People, which handles payroll and HR on one record at enterprise scale.",
      ]),
      section("local-rules", "BCEA and POPIA", [
        "Leave types are configurable rather than fixed, so take the time during setup to model annual, sick and family responsibility leave on BCEA cycles, plus any sectoral rules. Get this right on day one and the app does the counting for you.",
        "Employee records include personal information protected by POPIA, some of it special personal information. Use role based access so managers see only their teams.",
      ]),
      section("fit", "Where it sits in the Sage family", [
        "Sage HR sits beside Sage Accounting and Sage Payroll for small and mid sized businesses. Large employers who want HR and payroll on one record usually choose Sage 300 People instead.",
      ]),
    ],
  },

  "sage-300-people": {
    verdict:
      "Sage 300 People is a heavyweight payroll and HR system with a long track record among large South African employers. It handles union agreements, shift allowances, many companies and Employment Equity reporting. It is sold only on quotation through partners, so the real decision is the partner and the implementation plan as much as the software.",
    buy_if: "You employ hundreds or thousands of people, need on premises hosting or a familiar Sage partner, and run complex payrolls.",
    skip_if: "You are under a hundred staff, or you want a fully cloud native payroll and HR record with a modern self service app.",
    pros: [
      "Proven at very large scale in South Africa",
      "Employment Equity and skills development reporting alongside payroll",
      "Handles union agreements, shift allowances and many companies",
      "Hosting options include your own servers",
      "Large partner network",
    ],
    cons: [
      "No public pricing, so budgeting needs a full quote",
      "Implementation is a project, often months long",
      "Older interface than cloud rivals",
      "Costs rise with every module",
    ],
    reviewed_at: REVIEWED,
    sections: [
      section("what-it-is", "What it is", [
        "Sage 300 People is the payroll and HR system many large South African employers have run for years, previously sold as Sage VIP. It covers the employee lifecycle from recruitment to exit, with payroll at its heart.",
        "It is built for complexity: many companies, union agreements, shift and overtime rules, loans and garnishees, and the statutory reporting large employers carry.",
      ]),
      section("pricing", "How pricing works", [
        "Sage does not publish a price for Sage 300 People. Partners quote based on the number of employees, the modules you choose and how it is hosted. Implementation, data migration and training are quoted separately and are often a large share of the first year cost.",
        "Ask every partner to separate the quote into these lines, so you can compare like with like.",
      ], [
        "Licence or subscription, by employee band and module",
        "Annual support and tax table updates",
        "Implementation days, with a fixed scope",
        "Data migration from your current payroll",
        "Training for payroll and HR staff",
        "Hosting, if the partner runs it for you",
      ]),
      section("local-rules", "Statutory and equity reporting", [
        "Sage 300 People covers the full SARS payroll cycle and adds the reporting large employers need, such as Employment Equity reports and skills development records. Payroll and HR share data, so changes in HR flow into payroll without retyping.",
      ]),
      section("fit", "Choosing between Sage 300 People and PaySpace", [
        "PaySpace, now part of Deel, is the cloud alternative most large employers compare it with. PaySpace wins on a modern cloud record and payroll in other African countries. Sage 300 People wins where you want on premises hosting, already trust a Sage partner, or run very large union payrolls your team knows inside out.",
      ]),
    ],
  },

  "sage-crm": {
    verdict:
      "Sage CRM is worth buying for one reason: it sees your Sage ERP data. Sales people get balances, orders and invoices on the customer record, and won quotes become orders in Sage 200 Evolution, Sage 300 or Sage X3. As a standalone CRM it is plain, and businesses without a Sage ERP should look elsewhere.",
    buy_if: "You run a Sage ERP and want sales and finance working from the same customer record.",
    skip_if: "You do not run a Sage ERP, or you want modern pipeline management and marketing automation.",
    pros: [
      "Customer balances and order history from Sage ERP on the CRM record",
      "Quotes become orders in the ERP",
      "Can run on your own servers",
      "Sold and configured by Sage partners who know your ERP",
    ],
    cons: [
      "Plain and dated as a standalone CRM",
      "No public price",
      "Smaller marketing and automation toolset than HubSpot or Zoho",
    ],
    reviewed_at: REVIEWED,
    sections: [
      section("what-it-is", "What it is", [
        "Sage CRM is a customer relationship tool designed to sit on top of a Sage ERP. It holds accounts, contacts, opportunities, quotes, service cases and campaigns, and reads finance data from the ERP.",
      ]),
      section("pricing", "Pricing", [
        "Sage CRM is quoted per user through Sage partners, usually as part of an ERP project. Ask for the CRM licence, the integration work and annual support as separate lines.",
      ]),
      section("fit", "Who should buy it", [
        "Distributors and manufacturers running Sage 200 Evolution or Sage X3, whose sales teams keep phoning finance for account balances, get the most from it. If your ERP is not Sage, a modern CRM such as HubSpot or Zoho CRM will serve you better.",
      ]),
    ],
  },

  "sage-evolution": {
    verdict:
      "Sage 200 Evolution is the natural next step for South African businesses that have outgrown Pastel, especially distributors and retailers with serious stock or several branches. It is built for local tax and reporting, and partners are everywhere. Manufacturers with complex production should compare it carefully with SYSPRO.",
    buy_if: "You are a distributor, wholesaler or retail chain moving up from Pastel, with stock, branches or job costing.",
    skip_if: "Your production is complex enough that manufacturing is the core of the system, or you want a cloud native ERP.",
    pros: [
      "Familiar accounting core for Pastel trained staff",
      "Branch accounting with consolidated reporting",
      "Large module list including manufacturing and point of sale",
      "Built for South African tax and reporting",
      "Many experienced local partners",
    ],
    cons: [
      "No public pricing",
      "Runs on your own or a partner's servers rather than as a true cloud service",
      "Manufacturing depth trails SYSPRO",
      "Module costs add up",
    ],
    reviewed_at: REVIEWED,
    sections: [
      section("what-it-is", "What it is", [
        "Sage 200 Evolution began as Pastel Evolution under Softline and has been developed in South Africa for South African businesses. It keeps the familiar accounting core and adds proper inventory, branch accounting, job costing, manufacturing, point of sale, business intelligence and a long list of add ons.",
      ]),
      section("pricing", "How pricing works", [
        "Sage sells Evolution through partners, priced by named users and modules. There is no public price list in rand. Partners also quote hosting if you do not want servers in your office, along with implementation and training.",
      ], [
        "Licences by user and module",
        "Annual support and upgrades",
        "Implementation and data migration from Pastel",
        "Training for finance and operations staff",
        "Hosting, if the partner runs the servers",
      ]),
      section("fit", "Evolution or SYSPRO?", [
        "For distributors and retailers coming from Pastel, Evolution is usually the shorter, cheaper path. For manufacturers where bills of materials, work in progress and traceability are the core of the business, SYSPRO is the stronger system. Our written comparison of the two names SYSPRO the winner for manufacturers.",
      ]),
    ],
  },

  "sage-x3": {
    verdict:
      "Sage X3 is Sage's ERP for larger businesses with operations in several countries or serious manufacturing. Its multi entity finance and warehouse depth make it a real contender for South African groups expanding into the rest of Africa. It is a large project with quoted pricing, and the partner matters as much as the product.",
    buy_if: "You run several legal entities across countries, or manufacture with process or discrete production, and want one system.",
    skip_if: "You are a single entity business, or your needs fit Sage 200 Evolution or a cloud ERP.",
    pros: [
      "Many entities, currencies and languages on one system",
      "Process and discrete manufacturing",
      "Deep warehouse and supply chain features",
      "Cloud or on premises",
    ],
    cons: ["No public pricing", "Implementation is a project measured in months", "Needs a skilled partner"],
    reviewed_at: REVIEWED,
    sections: [
      section("what-it-is", "What it is", [
        "Sage X3 is Sage's enterprise resource planning system for larger companies, originally developed in France and sold worldwide. It covers finance, sales, purchasing, inventory, manufacturing and quality on one platform.",
      ]),
      section("pricing", "How pricing works", [
        "Sage X3 is sold on quotation through Sage partners, based on users, modules and hosting. Expect licences, annual support, implementation and data migration as separate lines.",
      ]),
      section("fit", "Who should buy it", [
        "South African manufacturers and distributors with subsidiaries elsewhere in Africa or overseas, who need consolidation across currencies and serious production features, are its natural buyers. Compare it with SYSPRO and SAP Business One.",
      ]),
    ],
  },

  "sage-intacct": {
    verdict:
      "Sage Intacct is a cloud finance system for finance teams that report a lot, not a full ERP. Its dimensions and fast multi entity consolidation can save days at every month end. Pricing is quoted in rand on request. It suits groups and fast growing companies whose operations run in other systems.",
    buy_if: "Your finance team spends too long on consolidation and management reporting across several entities.",
    skip_if: "You need manufacturing or deep stock in the same system, or you are a single small company.",
    pros: [
      "Dimensions replace a forest of journals and cost centres",
      "Multi entity consolidation in minutes",
      "Cloud only, with no servers to look after",
      "Quoted in rand for South African customers",
    ],
    cons: ["No public pricing", "Not a full ERP: stock and manufacturing live elsewhere", "Confirm South African VAT reporting setup with your partner"],
    reviewed_at: REVIEWED,
    sections: [
      section("what-it-is", "What it is", [
        "Sage Intacct started as an American cloud finance company that Sage bought in 2017. It replaces the general ledger, payables, receivables and cash management, and is built around dimensions: tags for entity, department, location, project or customer on every transaction.",
      ]),
      section("pricing", "How pricing works", [
        "Sage says Intacct pricing in South Africa is tailored to the size and needs of your business and quoted in rand on request. The quote depends on entities, users and modules, plus implementation.",
      ]),
      section("fit", "Who should buy it", [
        "Group finance teams with several entities, professional services firms that report by project, and fast growing companies whose operations run in other systems get the most from it. Compare it with Oracle NetSuite if you also need stock and orders.",
      ]),
    ],
  },
};
