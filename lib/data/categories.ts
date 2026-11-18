import type { Category } from "@/lib/types";

export const categories: Category[] = [
  {
    slug: "accounting",
    name: "Accounting",
    plural_label: "accounting software",
    description: "Ledgers, invoices, bank feeds and the VAT201 at the end of every period.",
    icon: "calculator",
    compliance_focus: ["vat201", "sars_efiling", "popia"],
    sort: 1,
    long_intro: [
      "Most small businesses in South Africa choose accounting software twice. Once when they register for VAT and need a proper ledger, and again a few years later when the first choice can no longer keep up with stock, a second company or an accountant who wants direct access. Picking well the first time saves a painful migration.",
      "Start with your bank. A direct feed from FNB, Absa, Standard Bank, Nedbank or Capitec turns reconciliation into a ten minute job. A manual statement import turns it into a Saturday. Then look at VAT: the product should build your VAT201 from the ledger for your VAT category, whether you file every two months or monthly.",
      "Desktop products such as Sage Pastel still run thousands of South African businesses and are perfectly sound. Cloud products win when more than one person needs the books at the same time, or when your accountant sits in another city. Price the plan you will need in a year, not the one you need today.",
    ],
    faqs: [
      {
        question: "Do I need accounting software before I register for VAT?",
        answer:
          "Not by law, but it helps. SARS expects VAT vendors to keep records that support every VAT201 for five years. A ledger that tags VAT on each transaction makes that far easier than a spreadsheet.",
      },
      {
        question: "Which products build a VAT201 return?",
        answer:
          "Every accounting product on our register marked as covering VAT201 produces the return figures from your ledger. Very few submit directly to SARS eFiling, so check the compliance list on each profile for the detail.",
      },
      {
        question: "Is cloud accounting safe under POPIA?",
        answer:
          "POPIA allows data to sit outside South Africa if the country or the contract gives adequate protection. Large vendors publish data processing terms that cover this. Ask where your data is hosted and keep a copy of the terms on file.",
      },
    ],
  },
  {
    slug: "payroll",
    name: "Payroll",
    plural_label: "payroll software",
    description: "PAYE, UIF, SDL and ETI worked out each month, with the EMP201 ready to file.",
    icon: "wallet",
    compliance_focus: ["emp201", "emp501", "irp5", "uif", "sdl", "eti", "bcea", "popia"],
    sort: 2,
    long_intro: [
      "Payroll is the one piece of business software where a small mistake becomes a SARS penalty. A good South African payroll product works out PAYE from the current tax tables, deducts UIF up to the earnings ceiling, adds SDL when your payroll crosses the threshold and claims ETI for qualifying young employees without you touching a formula.",
      "The monthly EMP201 is due by the 7th. Twice a year the EMP501 reconciliation has to match every EMP201 you filed, and IRP5 and IT3(a) certificates have to go out to staff. Products differ most in how much of that they hand you ready to submit, and how much you still assemble yourself in e@syFile.",
      "Count employees honestly when you compare prices. Most payroll products charge per employee per month, so a cheap base fee can turn expensive at forty staff. Also check whether leave is tracked to BCEA rules or left to a spreadsheet.",
    ],
    faqs: [
      {
        question: "When is the EMP201 due?",
        answer:
          "By the 7th of the month after the payroll month. When the 7th falls on a weekend or public holiday, it is due on the last business day before it.",
      },
      {
        question: "What is the difference between the EMP201 and the EMP501?",
        answer:
          "The EMP201 is the monthly declaration and payment of PAYE, UIF and SDL. The EMP501 is the reconciliation done twice a year, which checks that your monthly declarations, payments and employee tax certificates all agree.",
      },
      {
        question: "Can payroll software claim the Employment Tax Incentive?",
        answer:
          "Yes, if it supports ETI. The product works out the incentive for each qualifying employee and reduces the PAYE on your EMP201. Check the compliance list on each profile, because a few products leave ETI to you.",
      },
    ],
  },
  {
    slug: "hr",
    name: "HR",
    plural_label: "HR software",
    description: "Employee records, leave, onboarding and performance in one place.",
    icon: "users",
    compliance_focus: ["bcea", "popia"],
    sort: 3,
    long_intro: [
      "HR software usually starts as a leave tracker. Someone gets tired of approving leave on WhatsApp and reconciling it against a spreadsheet at month end. From there it grows into the record of every contract, warning, review and exit interview in the company.",
      "In South Africa two laws shape the choice. The Basic Conditions of Employment Act sets the leave rules: annual, sick, family responsibility and parental leave each run on their own cycle. POPIA covers everything you store about staff, which includes ID numbers, medical notes and bank details, so access controls matter more here than in any other category.",
      "If you already run payroll, check how the HR product talks to it. Leave taken in the HR tool should reach payroll without a person retyping it. Some payroll products include enough HR that a separate tool is not needed until about fifty staff.",
    ],
    faqs: [
      {
        question: "Do I need HR software if my payroll already tracks leave?",
        answer:
          "Often not below about fifty employees. Separate HR software earns its place when you need onboarding checklists, performance reviews, document signing or a self service app for staff.",
      },
      {
        question: "How does POPIA affect HR software?",
        answer:
          "Employee data is personal information, and some of it is special personal information such as health records. You need to limit who can see it, record why you hold it and be able to show staff what you store about them.",
      },
      {
        question: "Can HR software apply BCEA leave rules?",
        answer:
          "The better products ship with South African leave types and accrual rules. International products often need you to set up the leave cycles yourself, which is where mistakes creep in.",
      },
    ],
  },
  {
    slug: "crm",
    name: "CRM",
    plural_label: "CRM software",
    description: "Leads, deals and customer history for sales teams of every size.",
    icon: "handshake",
    compliance_focus: ["popia"],
    sort: 4,
    long_intro: [
      "A CRM is only as good as the data your sales team is willing to put into it. The best choice for a ten person team in Durban is often the one people actually open on their phones between meetings, not the one with the longest feature list.",
      "South African teams sell on WhatsApp more than almost anywhere else. Check how a CRM handles WhatsApp Business conversations, because a deal history that misses the chat where the customer said yes is not much of a history.",
      "POPIA applies to every contact you store. Direct marketing by email or SMS needs consent or an existing customer relationship, and the CRM should record which one applies to each contact. Most international CRMs price in US dollars, so budget for the exchange rate as well as the seat count.",
    ],
    faqs: [
      {
        question: "Does POPIA let me email leads from my CRM?",
        answer:
          "Only with consent, or where the person is an existing customer and you are marketing similar products, and every message offers a way to opt out. A CRM that records consent per contact makes this easy to prove.",
      },
      {
        question: "Why are most CRM prices in US dollars?",
        answer:
          "Most CRM vendors bill South African customers from offshore entities. We show the dollar price with a rand estimate at a stated rate so you can compare like with like.",
      },
      {
        question: "Is there a free CRM worth using?",
        answer:
          "HubSpot and Zoho both have free plans that are useful for small teams. The limits arrive with automation, reporting and extra users, so price the paid plan you would grow into.",
      },
    ],
  },
  {
    slug: "erp",
    name: "ERP",
    plural_label: "ERP software",
    description: "Finance, stock, manufacturing and distribution run from one system.",
    icon: "boxes",
    compliance_focus: ["vat201", "sars_efiling", "popia"],
    sort: 5,
    long_intro: [
      "ERP software is what a business moves to when accounting, stock and operations can no longer live in separate tools. In South Africa that move often happens at around R50 million in turnover, or earlier for manufacturers and distributors with complex stock.",
      "Almost every ERP on our register is sold and implemented through local partners, and the partner matters as much as the product. Ask how many implementations of this product they have done in your industry, and speak to two of those customers before you sign.",
      "The licence is the smaller part of the cost. Implementation, data migration, training and the first year of support often cost more than the software itself, which is why nearly every price in this category is quoted rather than published.",
    ],
    faqs: [
      {
        question: "Why are ERP prices quoted rather than listed?",
        answer:
          "Because the price depends on users, modules, hosting and the implementation work. A quote that does not separate licence, implementation and annual support is hard to compare, so ask for all three as separate lines.",
      },
      {
        question: "How long does an ERP implementation take?",
        answer:
          "For a mid sized South African business, three to nine months is common. Data migration and process changes take longer than installing the software.",
      },
      {
        question: "Should we pick a South African ERP?",
        answer:
          "SYSPRO and Sage Evolution were built here and have deep local partner networks. International products such as SAP Business One and Business Central are also well supported locally. Partner strength in your region matters more than where the vendor started.",
      },
    ],
  },
  {
    slug: "project-management",
    name: "Project management",
    plural_label: "project management software",
    description: "Tasks, timelines and workloads for teams that ship work together.",
    icon: "kanban",
    compliance_focus: ["popia"],
    sort: 6,
    long_intro: [
      "Project management tools are cheap to start and expensive to leave. Once a team has two years of tasks, files and comments in one product, moving out takes weeks. Spend an afternoon trying the two or three that fit before the team gets attached to the first one.",
      "All of the products on our register bill in US dollars, so the rand cost moves with the exchange rate. Most offer a free plan, and the paid plans usually earn their price through timelines, workload views and automation rather than basic task lists.",
      "Think about who outside the team will use it. Agencies that share boards with clients need guest access that does not cost a full seat. Engineering teams usually want a tool that links work to code. Operations teams tend to want forms and automation.",
    ],
    faqs: [
      {
        question: "Which project tools have a free plan?",
        answer:
          "Asana, Trello, monday.com, ClickUp and Jira all have free plans. The limits differ: some cap users, some cap boards or storage, and some hold back views such as timelines.",
      },
      {
        question: "Do project tools charge for guests and clients?",
        answer:
          "It depends on the product and plan. Check guest rules before you invite clients, because some tools count a guest as a paid seat once they can edit work.",
      },
      {
        question: "Is a project tool covered by POPIA?",
        answer:
          "Yes, if you store personal information in it, such as client contact details or employee notes. Keep sensitive personal information in systems built for it, and use the access settings the tool provides.",
      },
    ],
  },
];
