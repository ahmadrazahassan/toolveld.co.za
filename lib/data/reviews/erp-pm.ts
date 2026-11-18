import type { EditorialReview } from "@/lib/types";
import { REVISED, section } from "./helpers";

const ERP_QUOTE_LINES = [
  "Licences or subscription, by user type and module",
  "Annual support and upgrades",
  "Implementation, with a fixed scope",
  "Data migration and cleaning",
  "Training",
  "Hosting, if someone else runs the servers",
];

const ERP_QUESTIONS = [
  "Can you demo our three hardest transactions with our own data?",
  "Which customers in our industry can we call, chosen by us?",
  "What is fixed in the implementation price, and what is billed by the hour?",
  "How is South African VAT set up, and how do the VAT201 figures reach eFiling?",
  "Who supports us after go live, and how quickly do they respond?",
];

const ERP_ROLLOUT =
  "Most ERP failures come from the project rather than the software. Clean your stock, customer and supplier lists before migration, run at least one month end in parallel, avoid going live in your busiest month and name one person inside the business who owns the project and has time to do it.";

const PM_POPIA =
  "The vendor hosts data outside South Africa and publishes data processing terms. Keep them on file for POPIA, and avoid putting ID numbers, health details or other sensitive personal information in tasks and comments.";

const PM_DOLLARS =
  "Prices are in US dollars, so the rand cost moves with the exchange rate. Most large foreign vendors add 15% South African VAT to the invoice, and your bank may add a foreign transaction fee on card payments.";

export const erpPmReviews: Record<string, EditorialReview> = {
  syspro: {
    verdict:
      "SYSPRO is the ERP we would shortlist first for a South African manufacturer. Founded in Johannesburg in 1978, it handles bills of materials, work in progress, production planning and lot traceability in the core product, with local partners close by. It is sold on quotation, and implementation is a serious project.",
    buy_if: "You manufacture or distribute with complex stock, traceability or production planning.",
    skip_if: "You are a small business with simple stock, where Sage 200 Evolution or a cloud ledger will do.",
    pros: ["Manufacturing depth in the core product", "Lot and serial traceability", "Johannesburg head office and local partners", "Cloud or on premises", "Long track record with South African manufacturers"],
    cons: ["No public pricing", "Months long implementation", "More system than small businesses need"],
    reviewed_at: REVISED,
    sections: [
      section("what-it-is", "What SYSPRO is", [
        "SYSPRO was founded in Johannesburg in 1978 and is one of the few ERP vendors with South African roots that sells internationally. It focuses on manufacturers and distributors: food and beverage, industrial equipment, packaging, electronics and similar businesses where stock, production and traceability are the heart of the operation.",
      ]),
      section("pricing", "How pricing works", [
        "SYSPRO quotes through its own team and partners. Its website showed no price list when we checked on 17 November 2026, and third party estimates vary widely, so insist on a quote with these lines separated.",
      ], ERP_QUOTE_LINES),
      section("manufacturing", "Manufacturing and traceability", [
        "Bills of materials, routings, work in progress and production planning are in the core product rather than bolted on. Lot and serial traceability lets a food or medical device manufacturer trace a batch from raw material to customer, which recalls and audits demand. Material planning works out what to buy and make from orders and forecasts.",
      ]),
      section("local-rules", "South African fit", [
        "Financials carry South African tax settings for VAT. Ask how the VAT201 figures reach eFiling. Data can live on your own servers or be hosted, which gives you control over where personal information sits for POPIA.",
      ]),
      section("implementation", "Implementation", [
        ERP_ROLLOUT,
        "For manufacturers, budget extra time to get bills of materials and routings right before go live. Wrong costings in the ERP mean wrong margins in every report.",
      ]),
      section("fit", "SYSPRO or Sage 200 Evolution?", [
        "Our written comparison names SYSPRO the winner for manufacturers. Distributors and retailers coming from Pastel usually find Evolution the shorter, cheaper path.",
      ]),
      section("questions", "Questions to ask before you buy", [], ERP_QUESTIONS),
    ],
  },

  "sap-business-one": {
    verdict:
      "SAP Business One brings SAP's integrated approach to growing businesses and has many experienced South African partners. It is a strong choice for subsidiaries of groups that run full SAP and for distributors who want a well known name.",
    buy_if: "You report into a group that runs SAP, or you want an integrated ERP with a large partner network.",
    skip_if: "You need deep manufacturing, or you want cloud native software with published prices.",
    pros: ["One database for finance, sales, stock and purchasing", "Fits under a group SAP landscape", "Large local partner network", "On premises or hosted"],
    cons: ["No public pricing", "Partner add ons often needed", "Light manufacturing only"],
    reviewed_at: REVISED,
    sections: [
      section("what-it-is", "What SAP Business One is", [
        "SAP Business One is the small and mid sized business ERP from SAP, the German software company founded in 1972. It is a separate product from SAP's large enterprise systems, but it shares the same integrated idea: finance, sales, purchasing, stock and basic production in one database.",
      ]),
      section("pricing", "How pricing works", [
        "SAP partners quote by user type and add ons. SAP's page offered only a quote request when we checked on 17 November 2026. Compare at least three partners on the same scope, with these lines separated.",
      ], ERP_QUOTE_LINES),
      section("group-fit", "Why groups choose it", [
        "Subsidiaries of groups that run full SAP often use Business One because it can report into the parent's systems and the group's IT team already knows the vendor. For distributors, it offers a recognised name and a large pool of consultants.",
      ]),
      section("add-ons", "Partner add ons", [
        "Many partners sell their own add ons for industries such as manufacturing, retail or field service. They can fill real gaps, but they also tie you to that partner. Ask who owns the add on, how it is updated when SAP releases a new version and what happens if you change partners.",
      ]),
      section("local-rules", "South African fit", [
        "A South African localisation is available. Ask your partner to show VAT201 reporting working with your own transactions. On premises or hosted options let you choose where data sits.",
      ]),
      section("implementation", "Implementation", [ERP_ROLLOUT]),
      section("fit", "Who should pick something else", [
        "Manufacturers with complex production should compare SYSPRO. Businesses that live in Microsoft 365 should compare Business Central, which publishes its licence prices.",
      ]),
      section("questions", "Questions to ask before you buy", [], ERP_QUESTIONS),
    ],
  },

  "dynamics-365-business-central": {
    verdict:
      "Business Central is the natural ERP for businesses that live in Microsoft 365. Licences are published at $80 per user a month for Essentials and $110 for Premium, paid yearly, which makes it one of only two ERPs on our register with a public price. The partner's South African localisation and implementation are where the real cost and risk sit.",
    buy_if: "You run on Microsoft 365, Teams and Excel and want an ERP that fits inside them.",
    skip_if: "Your partner cannot show you a working South African VAT setup.",
    pros: ["Public per user licence prices", "Works inside Teams, Excel and Outlook", "Power BI reporting", "Cheap Team Members licence for light users", "Large app marketplace"],
    cons: ["Dollar pricing paid yearly", "South African localisation depends on the partner", "Implementation often costs more than year one licences"],
    reviewed_at: REVISED,
    sections: [
      section("what-it-is", "What Business Central is", [
        "Dynamics 365 Business Central is Microsoft's ERP for small and mid sized businesses. It covers finance, sales, purchasing, stock, projects and, on Premium, manufacturing and service. It runs in the cloud and is designed to work with the Microsoft tools most offices already use.",
      ]),
      section("pricing", "Licence prices, checked on Microsoft's site", [
        "Prices are per user per month, paid yearly, and the price at checkout can differ by country. Rand figures use our stated rate and include VAT.",
      ], [
        "Essentials: $80, about R1 546 per user a month",
        "Premium: $110, about R2 125, adds manufacturing and service",
        "Team Members: $8, about R155, for staff who read and approve",
        "10 Essentials users: about R15 456 a month",
      ]),
      section("savings", "Use Team Members licences", [
        "Many staff only need to look up stock, approve purchases or enter time. Team Members licences cost a tenth of Essentials. A business with ten full users and twenty light users pays about R18 547 a month including VAT, instead of R46 368 if everyone had Essentials.",
      ]),
      section("microsoft", "Inside Microsoft 365", [
        "Staff can look up a customer or stock item from inside Teams, edit lists in Excel and send documents from Outlook. Power BI sits on top for reporting. For businesses that already live in these tools, the ERP feels less like a separate system to learn.",
      ]),
      section("local-rules", "The localisation question", [
        "South African VAT reporting and local banking formats come from your partner's localisation rather than Microsoft directly. Ask every partner to demo VAT201 figures and a bank import with your own data, and ask who maintains the localisation when Microsoft releases updates.",
      ]),
      section("implementation", "Implementation", [
        "Partners quote implementation and localisation separately, and that work usually costs more than the first year of licences. " + ERP_ROLLOUT,
      ]),
      section("fit", "Who should pick something else", [
        "Manufacturers with complex production should compare SYSPRO. Businesses that do not use Microsoft 365 lose much of the advantage.",
      ]),
      section("questions", "Questions to ask before you buy", [], ERP_QUESTIONS),
    ],
  },

  odoo: {
    verdict:
      "Odoo lets a growing business start with one free app and add accounting, stock, CRM, manufacturing or ecommerce as it needs them. That modular start is its great strength; complexity as apps pile up is its weakness, and a good partner matters.",
    buy_if: "You want to start small with one app and grow into a full suite without a big ERP project on day one.",
    skip_if: "You need South African localisation proven out of the box with no partner.",
    pros: ["One app free for unlimited users", "Everything shares one database", "Open source Community edition", "Published per user prices", "Cheap licences for light users"],
    cons: ["Dollar pricing per user", "Gets complex as you add apps", "Check South African localisation with your partner", "Hosting and partner work cost extra"],
    reviewed_at: REVISED,
    sections: [
      section("what-it-is", "What Odoo is", [
        "Odoo is a Belgian company founded in 2005 that sells a suite of business apps on one database: accounting, invoicing, CRM, sales, stock, manufacturing, ecommerce, website, HR and more. There is an open source Community edition and a paid Enterprise edition with more apps and support.",
      ]),
      section("pricing", "Prices, checked on Odoo's site", [
        "Prices are per user a month on yearly billing, from Odoo's pricing page on 17 November 2026. A first year discount applies to the users you order at the start. Odoo.sh hosting and partner implementation cost extra. Rand figures use our stated rate and include VAT.",
      ], [
        "One App Free: one app, unlimited users",
        "Standard: $8,95, about R173 per user; $7,25, about R140, in the first year",
        "Custom: $16,40, about R317 per user; $13,40, about R259, in the first year",
        "Light users for simple tasks: $2,90, about R56",
        "10 users on Standard after the first year: about R1 729 a month",
      ]),
      section("modular", "Start with one app", [
        "The modular start is Odoo's best feature. A business can begin with CRM or invoicing for free, then add stock when it needs it and manufacturing later, without changing systems. Because everything shares one database, a sale in CRM becomes an order, a delivery and an invoice without retyping.",
      ]),
      section("complexity", "Where it gets hard", [
        "Each app adds settings, and the interactions between apps are where problems appear. Customisations made in the code can make upgrades painful. Keep customisation to a minimum, and choose a partner who has done businesses like yours.",
      ]),
      section("local-rules", "South African fit", [
        "A South African localisation is available for accounting. Check it with your partner, including VAT201 figures and bank statement imports. Self hosting is possible if you want data on your own servers.",
      ]),
      section("implementation", "Implementation", [ERP_ROLLOUT]),
      section("fit", "Who should pick something else", [
        "Businesses that want a local vendor and a familiar path from Pastel should look at Sage 200 Evolution. Microsoft 365 businesses should compare Business Central.",
      ]),
      section("questions", "Questions to ask before you buy", [], [
        "Which apps do we need now, and which in two years?",
        "Standard or Custom plan, and why?",
        "Who hosts it, and what does hosting cost?",
        "How much customisation is in the partner's proposal, and who maintains it?",
      ]),
    ],
  },

  netsuite: {
    verdict:
      "NetSuite is a cloud ERP built for groups: subsidiaries, currencies and consolidation sit in the core. Fast growing South African companies with offices abroad shortlist it for that reason. Pricing is an annual base licence plus users and modules, on quotation.",
    buy_if: "You run several subsidiaries across currencies and want one cloud system.",
    skip_if: "You are a single entity business with simple needs.",
    pros: ["Multi subsidiary consolidation in the core", "Cloud from the start", "Finance, stock, orders and ecommerce together", "Owned by Oracle, with local presence"],
    cons: ["No public pricing", "Annual commitments", "Partner implementation needed", "Ask how South African VAT is configured"],
    reviewed_at: REVISED,
    sections: [
      section("what-it-is", "What NetSuite is", [
        "NetSuite was founded in 1998 as one of the first cloud business systems and is now owned by Oracle. It covers financials, stock, order management, purchasing, ecommerce and, with modules, manufacturing and professional services.",
      ]),
      section("pricing", "How pricing works", [
        "NetSuite is an annual licence made up of the core platform, optional modules and the number of users, plus a once off implementation fee, all on quotation. NetSuite's page gave no figures when we checked on 17 November 2026.",
      ], ERP_QUOTE_LINES),
      section("groups", "Built for groups", [
        "Subsidiaries, currencies, intercompany transactions and consolidation are part of the core product. A South African company with offices in Kenya, the United Kingdom or Australia can close each entity in its own currency and consolidate in one system, instead of stitching spreadsheets together at month end.",
      ]),
      section("local-rules", "South African fit", [
        "Ask how South African VAT reporting is configured and who maintains it. NetSuite publishes data processing terms for POPIA purposes, and data is hosted in Oracle's cloud.",
      ]),
      section("implementation", "Implementation", [ERP_ROLLOUT]),
      section("fit", "Who should pick something else", [
        "Single entity businesses will pay for capability they do not use. Finance teams focused on reporting and consolidation should compare Sage Intacct; Microsoft 365 businesses should compare Business Central.",
      ]),
      section("questions", "Questions to ask before you buy", [], [
        ...ERP_QUESTIONS.slice(0, 3),
        "How do price increases at renewal work on our annual contract?",
      ]),
    ],
  },

  asana: {
    verdict:
      "Asana is the best work management tool on our register for teams running many projects at once. Portfolios, goals and workload views give leaders a clear picture. Starter at $10,99 a user on yearly billing covers most small teams.",
    buy_if: "You run many projects in parallel and need to see them together.",
    skip_if: "You mainly want flexible boards for non project work, where monday.com is more flexible.",
    pros: ["Portfolios and workload views", "Forms turn requests into tasks", "Rules automate routine moves", "Clean, calm interface"],
    cons: ["Dollar pricing", "Portfolios and workload need the higher plan", "Less flexible for non project work"],
    reviewed_at: REVISED,
    sections: [
      section("what-it-is", "What Asana is", [
        "Asana was founded in San Francisco in 2008 to help teams coordinate work without endless email. Work lives in projects, as lists, boards, timelines or calendars, and every task has one owner and a due date. Above projects sit portfolios and goals, which show leaders how everything is tracking.",
      ]),
      section("pricing", "Prices, checked on Asana's site", [
        PM_DOLLARS + " Rand figures use our stated rate and include VAT.",
      ], [
        "Personal: free",
        "Starter: $10,99 a user a month yearly, about R212; $13,49 monthly, about R261",
        "Advanced: $24,99 yearly, about R483; $30,49 monthly",
        "10 users on Starter: about R2 123 a month",
        "25 users on Advanced: about R12 070 a month",
      ]),
      section("daily-use", "Where it shines", [
        "Marketing teams, agencies and operations teams that juggle many projects get the most from Asana. Forms let other departments submit requests that arrive as tasks with the right details. Rules move tasks, assign people and set due dates automatically. The workload view shows who is overloaded before deadlines slip.",
      ]),
      section("plans", "Starter or Advanced?", [
        "Starter covers projects, timelines, forms and basic rules, which is enough for most small teams. Advanced adds portfolios, goals and workload, which matter once a manager is responsible for many projects at once. Upgrade when you find yourself building status reports by hand.",
      ]),
      section("local", "South African fit", [PM_POPIA]),
      section("fit", "Who should pick something else", [
        "Teams that want one flexible tool for sales pipelines, hiring and asset tracking as well as projects should compare monday.com. Software teams should use Jira. Very small teams with simple work may be happy on Trello.",
      ]),
      section("questions", "Questions to answer before you buy", [], [
        "Do we need portfolios and workload now, or can we start on Starter?",
        "Who will set up project templates so every team works the same way?",
        "Will we bill yearly to get the lower price?",
      ]),
    ],
  },

  "monday-com": {
    verdict:
      "monday.com bends into almost any workflow, from projects to sales pipelines and hiring trackers. Non technical teams build useful boards in an afternoon. Seats are sold with a three seat minimum, and governance matters as the company grows.",
    buy_if: "You want one flexible tool for many kinds of work.",
    skip_if: "You need a structured method across many projects, where Asana wins.",
    pros: ["Very flexible boards", "Quick for non technical teams", "Free for two seats", "Dashboards across boards"],
    cons: ["Three seat minimum on paid plans", "Seats sold in set bundle sizes", "Gets messy without governance"],
    reviewed_at: REVISED,
    sections: [
      section("what-it-is", "What monday.com is", [
        "monday.com is an Israeli company founded in Tel Aviv in 2012. Its product is a board made of rows and columns, a bit like a colourful spreadsheet, where each column can be a status, a person, a date, a number or a file. Boards can be built for almost any process, and automations and dashboards sit on top.",
      ]),
      section("pricing", "Prices, checked on monday.com", [
        PM_DOLLARS + " Prices vary by billing country. Rand figures use our stated rate and include VAT.",
      ], [
        "Free: up to two seats",
        "Basic: $9 a seat a month yearly, about R174, minimum 3 seats",
        "Standard: $12, about R232 per seat",
        "Pro: $19, about R367 per seat",
        "3 seats on Standard, the minimum: about R696 a month",
        "10 seats on Standard: about R2 318 a month",
      ]),
      section("seats", "Watch the seat bundles", [
        "Paid plans are sold in seat bundles rather than one seat at a time, so a team between bundle sizes pays for seats it does not use. Check the bundle that fits your headcount before comparing prices with tools that charge per user.",
      ]),
      section("daily-use", "Where it shines", [
        "Operations teams, marketing teams and small companies that want one tool for many kinds of work get the most from monday.com. A sales pipeline, a hiring tracker, a content calendar and a project plan can all live in one account, with dashboards that pull numbers from several boards.",
      ]),
      section("governance", "Keep it tidy", [
        "The flexibility that makes monday.com quick to start can make it messy at scale. Agree on standard status labels, board templates and who may create new boards, or you will end up with dozens of boards that work in different ways.",
      ]),
      section("local", "South African fit", [PM_POPIA]),
      section("fit", "Who should pick something else", [
        "Teams running many structured projects should compare Asana, and our written comparison covers the two side by side. Software teams should use Jira.",
      ]),
      section("questions", "Questions to answer before you buy", [], [
        "Which seat bundle fits our headcount?",
        "Who will own board templates and naming rules?",
        "Which automations need the Pro plan?",
      ]),
    ],
  },

  clickup: {
    verdict:
      "ClickUp packs tasks, docs, whiteboards and chat into one app with a generous free plan and low paid prices. It can replace several subscriptions for a small team, at the cost of a busy interface.",
    buy_if: "You want to cut the number of tools your team pays for.",
    skip_if: "Your team wants simplicity above all.",
    pros: ["Free plan with unlimited members", "Low price per user", "Docs, chat and tasks together", "Many views of the same work"],
    cons: ["Busy interface", "Promotional pricing may change", "Can be slow to learn"],
    reviewed_at: REVISED,
    sections: [
      section("what-it-is", "What ClickUp is", [
        "ClickUp was founded in San Diego in 2017 with the aim of replacing several work apps with one. Tasks, documents, whiteboards, goals, time tracking and chat all live in the same workspace, and the same tasks can be viewed as lists, boards, calendars or timelines.",
      ]),
      section("pricing", "Prices, checked on ClickUp's site", [
        PM_DOLLARS + " ClickUp showed Core and Business as discounted from $12 and $25 when we checked, so confirm the price you will renew at. Rand figures use our stated rate and include VAT.",
      ], [
        "Free Forever: unlimited members",
        "Core: $9 a user a month yearly, about R174; about R232 at the undiscounted $12",
        "Business: $17, about R328; about R483 at the undiscounted $25",
        "10 users on Core: about R1 739 a month",
        "10 users on Business: about R3 284 a month",
      ]),
      section("consolidation", "The case for one app", [
        "A small agency paying separately for a task tool, a wiki and a whiteboard can often replace all three with ClickUp and save money. Having documents and tasks in one place also means less hunting for the latest version of a brief.",
      ]),
      section("learning-curve", "The learning curve", [
        "ClickUp's breadth is also its weakness. There are many settings, views and features, and new users can feel lost. Start with a simple structure, switch off features you do not need and add more once the team is comfortable.",
      ]),
      section("local", "South African fit", [PM_POPIA]),
      section("fit", "Who should pick something else", [
        "Teams that value simplicity should look at Trello. Teams running many structured projects should compare Asana. Software teams should use Jira.",
      ]),
      section("questions", "Questions to answer before you buy", [], [
        "Which tools would ClickUp replace, and what do they cost today?",
        "What price will we renew at once the discount ends?",
        "Who will design the workspace structure?",
      ]),
    ],
  },

  trello: {
    verdict:
      "Trello is the simplest board most people already know, and for small teams it is often all they need. Standard costs $5 a user on yearly billing.",
    buy_if: "You want a simple board with no training.",
    skip_if: "You need portfolios, workload or detailed reporting.",
    pros: ["No training needed", "Cheap paid plans", "Power ups add features", "Owned by Atlassian"],
    cons: ["Free plan capped at 10 collaborators", "Deliberately simple", "Reporting is limited"],
    reviewed_at: REVISED,
    sections: [
      section("what-it-is", "What Trello is", [
        "Trello launched in 2011 and is now owned by Atlassian, the Australian company behind Jira. It is a Kanban board: work sits on cards that move across columns such as to do, doing and done. Cards hold checklists, due dates, attachments and comments.",
      ]),
      section("pricing", "Prices, checked on Trello's site", [
        PM_DOLLARS + " Rand figures use our stated rate and include VAT.",
      ], [
        "Free: up to 10 collaborators per workspace",
        "Standard: $5 a user a month yearly, about R97; $6 monthly",
        "Premium: $10 yearly, about R193; $12,50 monthly",
        "Enterprise: $17,50 yearly, about R338",
        "10 users on Standard: about R966 a month",
        "10 users on Premium: about R1 932 a month",
      ]),
      section("daily-use", "Why small teams stick with it", [
        "Nobody needs training to use Trello, which is why so many small teams start there and stay. Power ups add calendars, custom fields and connections to other tools, and simple automation moves cards when something happens.",
      ]),
      section("limits", "Where it runs out", [
        "Trello is deliberately simple. It has no real workload view, limited reporting and no portfolio layer for many projects. When a manager starts building status reports by hand, it is time to look at Asana or monday.com.",
      ]),
      section("local", "South African fit", [PM_POPIA]),
      section("fit", "Who should pick something else", [
        "Teams that run many projects at once should compare Asana. Teams that want docs and chat in the same app should compare ClickUp.",
      ]),
      section("questions", "Questions to answer before you buy", [], [
        "Will we stay within ten collaborators on the free plan?",
        "Do we need Premium's views, or is Standard enough?",
      ]),
    ],
  },

  jira: {
    verdict:
      "Jira is the default tracker for software teams, with sprints, backlogs and links to code. It is free for up to ten users, and Standard costs $9,70 a user a month for small teams on monthly billing. Teams outside engineering usually prefer friendlier tools.",
    buy_if: "You run a software team with sprints and releases.",
    skip_if: "Your team is not building software.",
    pros: ["Built for sprints and releases", "Linked to code", "Free for ten users", "Price per user falls as teams grow"],
    cons: ["Steeper learning curve", "Heavy for non technical teams", "Configuration can sprawl"],
    reviewed_at: REVISED,
    sections: [
      section("what-it-is", "What Jira is", [
        "Jira is Atlassian's issue and project tracker, first released in 2002, and the most widely used tool for software teams. Work is tracked as issues in a backlog, planned into sprints or managed on a Kanban board, and linked to code changes and releases.",
      ]),
      section("pricing", "Prices, checked on Atlassian's calculator", [
        "Figures are from Atlassian's price calculator on 17 November 2026, on monthly billing for a team of 10 to 25 users. The rate per user falls as the team grows: at 300 users it showed $8,48 for Standard and $15,56 for Premium. Yearly billing saves up to 17%. " + PM_DOLLARS + " Rand figures use our stated rate and include VAT.",
      ], [
        "Free: up to 10 users",
        "Standard: $9,70 a user, about R187",
        "Premium: $19,60 a user, about R379",
        "20 users on Standard: about R3 748 a month",
      ]),
      section("daily-use", "Built for software teams", [
        "Backlogs, sprint planning, story points, burndown charts and release tracking are all built in. Issues link to branches and pull requests in code hosting tools, so anyone can see what was built for each issue. Automation rules handle routine moves, such as closing an issue when its code is merged.",
      ]),
      section("configuration", "Keep the configuration simple", [
        "Jira can be configured endlessly, with custom fields, workflows and issue types. Every addition makes it heavier. Start with a standard template, change it only when the team agrees a change is needed and appoint one person to own the configuration.",
      ]),
      section("local", "South African fit", [PM_POPIA]),
      section("fit", "Who should pick something else", [
        "Teams that are not building software usually find Trello, Asana or monday.com easier. Many companies run Jira for developers and a friendlier tool for everyone else.",
      ]),
      section("questions", "Questions to answer before you buy", [], [
        "Will we stay within ten users on the free plan?",
        "Who will own the Jira configuration?",
        "Which code hosting tool will we connect?",
      ]),
    ],
  },
};
