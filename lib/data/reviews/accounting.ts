import type { EditorialReview } from "@/lib/types";
import { REVISED, section } from "./helpers";

export const accountingReviews: Record<string, EditorialReview> = {
  xero: {
    verdict:
      "Xero is the best cloud ledger on our register for South African businesses that work closely with an accountant, and the clear pick once more than six people need the books. Unlimited users on every plan and a very large app store make it the most flexible choice. It costs more than Sage Accounting for very small teams and does not run South African payroll, so most users pair it with SimplePay.",
    buy_if: "Several people need the books, your accountant works in Xero, or you need apps for stock, point of sale or reporting.",
    skip_if: "You are a sole owner watching every rand, or you want accounting and payroll from one South African vendor with a phone line.",
    pros: [
      "Unlimited users on every plan",
      "More than a thousand connected apps",
      "Reconciliation that learns from your past matches",
      "Used by many South African accounting practices",
      "VAT201 figures from the ledger",
      "Direct feeds for the large South African banks",
    ],
    cons: [
      "No South African payroll, so you add SimplePay or similar",
      "Starter plan limits invoices and bills each month",
      "Support is online only, with no phone line",
      "You still file the VAT201 on eFiling yourself",
      "Data is hosted offshore",
    ],
    reviewed_at: REVISED,
    sections: [
      section("what-it-is", "What Xero is", [
        "Xero is a New Zealand cloud accounting company founded in 2006 that now sells in many countries, including South Africa with rand pricing. It is the ledger many South African practices move clients to when they leave desktop software, which matters more than any single feature: your accountant's familiarity saves billable hours every year end.",
        "Everything runs in the browser and on the mobile app. There is nothing to install, updates arrive automatically, and you, your bookkeeper and your accountant all work on the same live file.",
      ]),
      section("plans", "Plans and prices", [
        "All three plans are priced in rand including VAT, with unlimited users. When we checked, new South African customers got 90% off the base plan for the first three months; the discount does not cover add ons or payment fees.",
      ], [
        "Starter: R485 a month, R5 820 a year, with monthly limits on invoices and bills",
        "Standard: R857 a month, R10 284 a year, unlimited invoices and bills",
        "Premium: R1 195 a month, R14 340 a year, adds multiple currencies",
        "First year with the intro offer: about R4 511 on Starter and R7 970 on Standard",
      ]),
      section("real-cost", "Real cost with payroll", [
        "Because Xero has no South African payroll, an employer needs a second product. SimplePay is the usual pairing because it posts payroll journals straight into Xero. At SimplePay's calculator prices, ten employees add R235,50 a month before VAT, about R271 with VAT, so Xero Standard plus payroll for ten staff comes to about R1 128 a month.",
        "Against Sage Accounting, the comparison depends on team size. Sage's Accounting plan costs R490 for two users plus R85 for each extra user, up to its limit of five users, so three users pay R575 and five pay R745. Up to five users Sage is cheaper than Xero Standard; beyond five, Sage Accounting no longer fits and Xero's unlimited users are the simpler answer.",
      ]),
      section("daily-use", "What it is like to use every day", [
        "The heart of Xero is the bank reconciliation screen. Transactions arrive from the bank feed each morning, Xero suggests a match from your invoices, bills and past rules, and you confirm with one click. After a few months most routine lines reconcile themselves, which is where small businesses save the most time.",
        "Invoicing is quick, with repeating invoices for retainers and online payment links where you have a payment app connected. Bills can be captured from email or a document capture app such as Dext, and the reports most owners need, profit and loss, the balance sheet, aged debtors and aged creditors, are a click away.",
      ]),
      section("local-rules", "VAT and South African banks", [
        "Xero builds the VAT201 figures from your ledger for your tax period. You capture them on SARS eFiling yourself, so check the period dates match your VAT category, especially if you file every two months. Direct bank feeds are available for Absa, FNB, Standard Bank, Nedbank and Investec; check your exact account type before relying on a feed, and fall back to statement imports where needed.",
        "Xero publishes data processing terms and hosts data offshore, which is lawful under POPIA when the protections are in place. Keep the terms on file with your POPIA records.",
      ]),
      section("apps", "The app store", [
        "Xero's real moat is its app store. Inventory, point of sale, document capture, reporting and payment apps connect without custom work. For a retailer using a card machine provider and a Shopify store, the right apps can replace hours of manual capture each month. Budget for the apps too: several popular ones charge their own monthly fee in dollars.",
      ]),
      section("setup", "Setting it up and moving your data", [
        "A clean start is to open Xero at the beginning of a VAT period or financial year, load opening balances from your accountant's trial balance, and bring in open customer invoices and supplier bills. Most practices that use Xero offer a fixed price setup. Connect bank feeds early, because feeds only bring in recent history.",
      ]),
      section("support", "Support", [
        "Support is through Xero's online help centre and email cases. There is no phone line, which some owners find frustrating when something urgent breaks. In practice most South African Xero users lean on their accountant or a Xero partner for help, so choose a partner you can phone.",
      ]),
      section("fit", "Who should pick something else", [
        "Sole traders with simple needs may prefer Zoho Books' free plan or Sage Accounting Start at R270. Businesses that want everything from one South African vendor with phone support should look at Sage Accounting and Sage Payroll. Offices that need deep stock control on a local server are better served by Sage 50cloud Pastel or Palladium.",
      ]),
      section("questions", "Questions to answer before you buy", [], [
        "Does my accountant already use Xero, and will they help set it up?",
        "Will I outgrow Starter's monthly invoice and bill limits this year?",
        "Does my bank and account type have a direct feed?",
        "Which apps will I need, and what do they cost each month?",
        "Which payroll product will I connect, and how will its journals post?",
      ]),
    ],
  },

  "zoho-books": {
    verdict:
      "Zoho Books is the best value ledger on our register: a genuine free plan for businesses under R1 million in revenue, paid plans from R99 a month excluding VAT, and automation on the mid plans that rivals charge much more for. It suits service businesses and teams already on Zoho. Expect to do more setup yourself, because fewer South African accountants know it well.",
    buy_if: "You want the lowest running cost, invoice often, or already use Zoho CRM or Zoho People.",
    skip_if: "Your accountant works only in Xero or Sage, or you need a large local partner network.",
    pros: [
      "Free plan for revenue under R1 million",
      "Rand pricing that does not move with the exchange rate",
      "Workflow rules and client portal on mid plans",
      "Projects and timesheets for service businesses",
      "Part of the wider Zoho suite",
    ],
    cons: [
      "Smaller South African partner network",
      "Bank feed coverage needs checking for your bank",
      "Many plans to choose from can confuse",
      "Prices exclude VAT, so add 15% when comparing",
    ],
    reviewed_at: REVISED,
    sections: [
      section("what-it-is", "What Zoho Books is", [
        "Zoho Books is the accounting app from Zoho Corporation, an Indian software company founded in 1996 that sells dozens of business apps. The South African edition is priced in rand and set up for local VAT. It shares data with Zoho CRM, Zoho People and Zoho Desk, so a business that already runs on Zoho gets one customer and employee record across sales, support and finance.",
      ]),
      section("plans", "Plans and prices", [
        "Zoho Books prices exclude VAT. Monthly billing prices are shown here; annual billing cuts each paid plan by about 17%.",
      ], [
        "Free: R0, 1 user plus your accountant, revenue under R1 million a year",
        "Standard: R99 a month (R113,85 incl VAT), 3 users",
        "Professional: R199 a month (R228,85 incl VAT), 5 users",
        "Premium: R299 a month (R343,85 incl VAT), 10 users",
        "Elite: R1 290 a month (R1 483,50 incl VAT), 10 users, advanced inventory",
        "Ultimate: R2 490 a month (R2 863,50 incl VAT), 15 users, built in analytics",
      ]),
      section("real-cost", "What it costs against the alternatives", [
        "Five users on Zoho Books Professional cost R228,85 a month including VAT. The same five users cost R745 on Sage Accounting and R857 on Xero Standard. Ten users on Premium cost R343,85, against R857 on Xero; Sage Accounting's plan stops at five users. Zoho is the cheapest by a wide margin at every team size we tested.",
        "Over a year, a five person business saves about R6 200 against Sage Accounting and about R7 500 against Xero Standard. That is real money for a small firm, as long as the extra setup time does not eat it.",
      ]),
      section("daily-use", "What it does well", [
        "Zoho Books is strongest for businesses that invoice a lot. Recurring invoices, automatic payment reminders, a client portal where customers see and pay their invoices, and retainer invoices are all there. Service businesses get projects and timesheets, so billable hours flow into invoices without retyping.",
        "Workflow rules on the mid plans can send emails, update fields or alert staff when something happens, such as an invoice going overdue. That kind of automation usually costs extra elsewhere.",
      ]),
      section("local-rules", "South African edition", [
        "The South African edition handles VAT and produces return figures for your period. As with Xero, you submit on eFiling yourself. Statement import works for every bank; confirm a direct feed for yours before you rely on it, because feed coverage changes.",
        "Zoho publishes data processing terms for POPIA purposes. Keep them on file, and limit who can see sensitive customer details with Zoho's user roles.",
      ]),
      section("setup", "Setup takes longer than Xero", [
        "Because fewer South African bookkeepers use Zoho daily, expect to do more of the setup yourself: the chart of accounts, tax rates, invoice templates and bank rules. Zoho's help centre is thorough. Allow a weekend for a small business and get your accountant to check the opening balances and VAT settings.",
      ]),
      section("support", "Support", [
        "Zoho offers email, phone and an online help centre. Response quality is generally good on the paid plans, and the free plan relies more on the help centre.",
      ]),
      section("fit", "Who should pick something else", [
        "If your accountant wants live access in the product they use daily, follow their lead. Many South African practices are set up for Xero or Sage and charge more to work in something unfamiliar. Businesses that need payroll from the same vendor should look at Sage Accounting and Sage Payroll.",
      ]),
      section("questions", "Questions to answer before you buy", [], [
        "Will my revenue stay under R1 million, so the free plan still applies next year?",
        "Is my accountant willing to work in Zoho Books?",
        "Does my bank have a direct feed, or will I import statements?",
        "Do I already use other Zoho apps that would share data with it?",
      ]),
    ],
  },

  "palladium-accounting": {
    verdict:
      "Palladium is a South African accounting system with stock and point of sale in the same database, and unusually open pricing for this end of the market. It suits retailers, wholesalers and trade businesses that need more stock control than a cloud ledger offers, at a per user price published in rand.",
    buy_if: "You sell over a counter and from a warehouse, need job costing, and want a local vendor.",
    skip_if: "You are a service business with no stock, or you want a pure cloud product with a large app store.",
    pros: [
      "Accounting, inventory and point of sale in one database",
      "Tiered rand pricing published on its website",
      "Job costing for contractors",
      "Payroll and hosting from the same vendor",
      "Built in South Africa",
    ],
    cons: [
      "Per user subscription adds up for big teams",
      "Support plan is compulsory in year one on the purchase option",
      "Smaller ecosystem than Xero or Sage",
      "Ask how VAT returns are submitted and where hosted data lives",
    ],
    reviewed_at: REVISED,
    sections: [
      section("what-it-is", "What Palladium is", [
        "Palladium is accounting software developed in South Africa for businesses that trade in physical goods. Its selling point is that the ledger, the stock records and the till all share one database, so a sale at the counter updates stock and the books at the same moment. It can run on your own server or be hosted by Palladium.",
      ]),
      section("pricing", "Published prices, explained", [
        "Palladium publishes tier examples in rand, all excluding VAT. A new client buying eight licences pays R4 049 per user a year on subscription, or R7 139 per user once off on the purchase option, which needs a support plan in year one. Monthly billing is offered but not priced on the page.",
      ], [
        "8 users on subscription: R32 392 a year excl VAT, about R2 699 a month",
        "8 users bought once off: R57 112 excl VAT, plus support",
        "Extra user on subscription: R3 745 a year",
        "Hosting: R116 per user a month, so R928 a month for 8 users",
        "Palladium Payroll: R550 a month for 55 employees, about R10 per employee",
        "API for third party links: R5 000 a year",
      ]),
      section("real-cost", "Subscription or purchase?", [
        "On the published examples, buying outright costs about the same as one year and nine months of subscription. If you plan to run Palladium for years and have your own server, buying can pay off, but remember support renewals after year one. If you want hosting, updates and support in one fee, the subscription is simpler.",
        "Eight users on subscription with hosting come to about R3 627 a month excluding VAT, or about R4 171 including VAT. Compare that with a cloud ledger plus a separate stock app and point of sale system, which often ends up in the same range once all three subscriptions are added.",
      ]),
      section("daily-use", "Stock, till and job costing", [
        "Counter sales, quotes, sales orders, purchase orders and goods received notes all flow through the same stock records. Contractors can cost jobs against materials and labour and see what each job actually made. For hardware, auto spares and building supply businesses, that link between the counter, the warehouse and the ledger is the main reason to choose it.",
      ]),
      section("local-rules", "VAT and local rules", [
        "Palladium has a VAT201 report built in. Ask the vendor how the return figures reach eFiling and whether any submission is direct. If you choose hosting, ask where the servers are and get the data processing terms for your POPIA file.",
      ]),
      section("setup", "Getting started", [
        "Plan a full stock take before go live, because a stock system is only as good as its opening quantities and costs. Import item codes, prices and customers from your old system, train counter staff before the first trading day, and run the old system in parallel for one month end if you can.",
      ]),
      section("support", "Support", [
        "Support is by phone and email from Palladium and its resellers. On the purchase option, the year one support plan is compulsory; after that, decide whether to renew based on how much you rely on updates and help.",
      ]),
      section("fit", "Who it suits", [
        "Hardware stores, auto spares, building suppliers and wholesalers with a counter and a warehouse get the most from it. Service businesses will find a cloud ledger simpler and cheaper. Distributors with thousands of lines across several branches should also compare Omni Accounts and Sage 200 Evolution.",
      ]),
      section("questions", "Questions to ask before you buy", [], [
        "What is the price per user at my exact number of licences?",
        "How are VAT returns submitted, and where is hosted data kept?",
        "Which till hardware and card machines work with it?",
        "What does support cost after year one on the purchase option?",
        "Can you show my three hardest stock transactions in a demo?",
      ]),
    ],
  },

  "omni-accounts": {
    verdict:
      "Omni Accounts is a South African accounting and inventory system for distributors with heavy stock and several branches. It is sold on quotation with installation and training, which makes it a considered purchase rather than a sign up. For large stock lists and busy counters it is a serious local alternative to Sage 200 Evolution.",
    buy_if: "You hold thousands of stock lines across branches and want a local system that keeps stock and the ledger in step.",
    skip_if: "You need cloud access from anywhere, or your stock is simple.",
    pros: ["Built for heavy stock and branch transfers", "Full trading cycle from quote to delivery", "Bills of materials for assemblers", "Local installation and on site support", "Data held on your own server"],
    cons: ["No public pricing", "Desktop deployment", "Smaller user community than Sage", "Remote access needs extra setup"],
    reviewed_at: REVISED,
    sections: [
      section("what-it-is", "What Omni Accounts is", [
        "Omni Accounts is a South African accounting and trading system aimed at distributors, wholesalers and retail chains. It is installed on your own server and covers the whole trading cycle: quotes, orders, picking, delivery, invoicing, purchasing and stock, with the ledger updated as each step happens.",
      ]),
      section("pricing", "How pricing works", [
        "Omni is sold on quotation with installation and training. It says most packages are a once off licence, with annual licence fees on all but the smallest and a monthly rental option. Its website showed no current price list when we checked on 17 November 2026.",
      ], [
        "Licence, once off or monthly rental",
        "Annual licence fee, where it applies",
        "Installation and data conversion",
        "Training for counter, warehouse and finance staff",
        "On site support visits, if you want them",
      ]),
      section("daily-use", "Where it shines", [
        "Omni is built for volume: thousands of stock lines, branch transfers, several price lists and busy counters. Bills of materials let assemblers build finished goods from components, and stock is costed as it moves. Because everything is in one system, the stock value on the balance sheet should match what the warehouse holds, which is the problem many growing distributors are trying to fix.",
      ]),
      section("deployment", "Running it on your own server", [
        "Data on your own server is good for control and POPIA, but it puts the server, backups and power on you. Budget for a reliable server, an uninterruptible power supply that covers outages long enough to shut down safely, and offsite backups. Branches and remote staff need a secure remote connection, which your installer should set up and test.",
      ]),
      section("local-rules", "VAT and local rules", [
        "Omni has a VAT201 report built in. Ask how the figures reach eFiling and how the system handles your VAT category and period dates.",
      ]),
      section("setup", "Implementation", [
        "Expect a project, not a download: a stock list clean up, price list setup, opening balances and staff training. Ask for a written plan with dates, and keep your old system running until the first month end balances.",
      ]),
      section("fit", "Who it suits", [
        "Distributors, wholesalers and multi branch retailers. Compare it with Sage 200 Evolution and Palladium on the same stock list, and ask each vendor to demo your three hardest transactions. Businesses that want staff to work from anywhere in a browser should look at cloud systems instead.",
      ]),
      section("questions", "Questions to ask before you buy", [], [
        "What is the licence, annual fee and training cost as separate lines?",
        "How do branches and remote staff connect, and what does that cost?",
        "How are backups handled, and who tests a restore?",
        "Who supports us on site, and how quickly in a crisis?",
      ]),
    ],
  },

  draftworx: {
    verdict:
      "Draftworx is working paper and financial statement software for accounting practices, not a bookkeeping ledger. Its published per user and per entity pricing makes budgeting easy: R8 800 per user licence for most practices, plus small per entity template fees. Practices that prepare many close corporation, company and trust statements get real time savings.",
    buy_if: "You run an accounting practice that prepares annual financial statements and working papers.",
    skip_if: "You are a business looking for a bookkeeping ledger.",
    pros: ["Statements update when the trial balance changes", "Templates for the reporting frameworks local practices use", "Published rand pricing", "Cloud templates priced per entity", "Imports trial balances from Xero and Sage Accounting"],
    cons: ["Licence term and VAT basis not stated on the price list", "Full IFRS licence costs R54 350 per user", "Not a tax filing tool"],
    reviewed_at: REVISED,
    sections: [
      section("what-it-is", "What Draftworx is", [
        "Draftworx is South African software that turns a client's trial balance into annual financial statements and the working papers that support them. It is used by accounting officers, independent reviewers and small audit practices. The client's books stay in their own ledger; Draftworx takes the year end numbers and produces compliant statements.",
      ]),
      section("pricing", "Prices in rand", [
        "Draftworx lists desktop licences per user and cloud templates per entity for each financial year. Its page does not state whether the desktop licence is yearly or whether prices include VAT, so check both before you buy. Volume discounts apply to desktop licences.",
      ], [
        "Draftworx Prac: R8 800 per user",
        "Draftworx Corp SME: R8 800 per user",
        "Draftworx Corp IFRS: R54 350 per user",
        "DigiSign: R2 430 per user",
        "Cloud template, sole proprietor: R80 per entity per year",
        "Cloud template, close corporation, trust, NPO and similar: R165 per entity per year",
        "Cloud template, IFRS for SMEs: R330 per entity per year",
        "Cloud template, full IFRS or consolidation: R3 325 per entity per year",
        "Working papers: compilation R165, accounting officer R330, independent review R815 per engagement",
      ]),
      section("real-cost", "A worked example", [
        "A three person practice on Draftworx Prac pays R26 400 in licences. If it prepares 150 close corporation and trust statements a year on cloud templates, that adds R24 750. Thirty IFRS for SMEs statements add R9 900, and twenty independent review files add R16 300. The total of about R77 350 a year works out to roughly R390 per engagement.",
      ]),
      section("daily-use", "How it saves time", [
        "The core idea is linked statements: map the trial balance once, and the statements, notes and working papers update when an adjustment is posted. Late audit or review adjustments no longer mean retyping notes. Trial balances can come in from Xero and Sage Accounting, which removes another manual step for practices whose clients use them.",
      ]),
      section("frameworks", "Frameworks and engagements", [
        "Templates cover the frameworks small practices deal with: IFRS for SMEs, full IFRS, close corporations, trusts, non profit organisations, schools and sole proprietors. Working papers follow the engagement type, whether a compilation, an accounting officer's engagement or an independent review.",
      ]),
      section("setup", "Getting started", [
        "Start with a handful of simple close corporation or trust files, set up your practice's standard mappings and letterheads, then move the rest of the client base across at their next year end. Draftworx offers training, which is worth it for the person who will build the templates.",
      ]),
      section("fit", "Draftworx or Caseware?", [
        "Draftworx suits small and mid sized practices that want predictable pricing. Caseware suits larger audit firms that need a firm wide engagement method and detailed review trails.",
      ]),
      section("questions", "Questions to ask before you buy", [], [
        "Is the desktop licence yearly or once off, and do the prices include VAT?",
        "Which templates will we use, and how many entities per year?",
        "How does the trial balance import work from our clients' ledgers?",
        "What training is included?",
      ]),
    ],
  },

  caseware: {
    verdict:
      "Caseware Working Papers is the engagement file many audit and accounting firms run on, and it scales from small practices to large networks. It is sold on quotation through Caseware's local office and distributors. For audit firms that need a consistent method and a clear review trail, it is the reference product.",
    buy_if: "You run an audit or accounting firm that needs firm wide templates and detailed review sign off.",
    skip_if: "You are a small practice that mainly compiles statements and wants simple published pricing.",
    pros: ["Firm wide audit method through templates", "Clear review trail for every section", "Scales to large practices", "Local office and distributors", "Widely known by audit staff"],
    cons: ["No public pricing", "Steeper learning curve than simpler tools", "Templates need someone to own them"],
    reviewed_at: REVISED,
    sections: [
      section("what-it-is", "What Caseware is", [
        "Caseware International was founded in Toronto in 1988, and Working Papers is its long standing engagement file product. Firms use it to hold the whole audit or review file: the trial balance, lead schedules, adjustments, working papers, sign offs and the financial statements, all linked. It is sold in South Africa through a local office and distributors.",
      ]),
      section("pricing", "How pricing works", [
        "Caseware is licensed per practice on quotation. Its website showed no price list when we checked on 17 November 2026. Ask for these lines separately so you can compare the total with Draftworx's published prices.",
      ], [
        "Licence per user",
        "Templates included, and their annual fee",
        "Annual maintenance and upgrades",
        "Training for staff and for whoever maintains templates",
      ]),
      section("daily-use", "Why audit firms use it", [
        "The strength is consistency. A firm sets its method once in templates, and every engagement follows it: the same procedures, the same documentation and the same sign off points. Reviewers can see what was done, by whom and when, which is what quality reviews and regulators look for. Because many audit trainees learn on it, new staff often arrive already knowing the software.",
      ]),
      section("templates", "Templates make or break it", [
        "Caseware is only as good as the templates behind it. Larger firms appoint someone to own their templates and keep them current with standards changes. Smaller firms usually rely on the templates their distributor supplies, so ask what is included and how updates arrive.",
      ]),
      section("setup", "Rolling it out", [
        "Roll out on new engagements first and train reviewers as well as preparers, since the review trail is where much of the value sits. Expect a learning curve for staff who have only used spreadsheets.",
      ]),
      section("fit", "Who it suits", [
        "Audit firms and larger practices with several partners and reviewers. Small practices compiling statements may find Draftworx simpler and cheaper.",
      ]),
      section("questions", "Questions to ask before you buy", [], [
        "What is the price per user, including templates and maintenance?",
        "Which templates fit our engagement types?",
        "Who updates templates when standards change?",
        "What training is included for preparers and reviewers?",
      ]),
    ],
  },
};
