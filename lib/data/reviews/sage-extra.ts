import type { ReviewSection } from "@/lib/types";
import { section } from "./helpers";

/** Further sections for the Sage products sold on quotation, where the buying process is the hard part. */
export const sageExtraSections: Record<string, ReviewSection[]> = {
  "sage-evolution": [
    section("modules", "The modules that matter", [
      "Evolution is sold as a core with modules. Most buyers start with the core financials and inventory, then add what their operation needs. Knowing which modules you actually need before talking to a partner keeps the quote honest.",
    ], [
      "Core financials: general ledger, debtors, creditors, cash book and VAT",
      "Inventory: multiple warehouses, lots and serial numbers, stock valuation",
      "Branch accounting: separate books per branch with consolidated reports",
      "Job costing: book labour and materials against a job and see its margin",
      "Manufacturing: bills of materials and production for assemblers",
      "Point of sale: counter sales that update stock and the ledger together",
      "Business intelligence: reports and dashboards over Evolution data",
      "Sage CRM: customer records that read balances and orders from Evolution",
    ]),
    section("local-rules", "South African tax and reporting", [
      "Evolution was built here, so VAT201 reporting, local banking file formats and the way South African accountants close a year are part of the product rather than localisation added by a partner. That shortens implementation compared with international ERPs that need a South African layer.",
    ]),
    section("implementation", "What an implementation looks like", [
      "A typical move from Pastel to Evolution for a distributor runs from a few weeks for a simple setup to several months for multi branch businesses with custom reports. The partner maps your processes, sets up the company, migrates balances and open items, trains staff and supports the first month end.",
      "The biggest risks are data quality and scope creep. Clean your stock codes and customer records before the project starts, and agree in writing what is in scope.",
    ], [
      "Week 1 to 2: process mapping and design",
      "Week 2 to 6: setup, data cleaning and migration tests",
      "Parallel run for at least one month end",
      "Go live at the start of a financial period",
    ]),
    section("questions", "Questions to ask every partner", [
      "Use these to compare quotes. A partner who cannot answer them clearly is a risk.",
    ], [
      "How many Evolution implementations have you done in our industry in the last two years?",
      "Can we speak to two of those customers?",
      "Is implementation fixed price or time and materials, and what is out of scope?",
      "Who is our named consultant, and who covers when they are on leave?",
      "What does annual support include, and how much does it rise each year?",
      "Where will the data be hosted, and who is responsible for backups?",
    ]),
  ],
  "sage-x3": [
    section("modules", "What it covers", [], [
      "Finance across many legal entities, currencies and languages",
      "Sales, purchasing and inventory with landed costs",
      "Process manufacturing for food, chemicals and pharmaceuticals",
      "Discrete manufacturing for assembled products",
      "Warehouse management with bins, picking and stock rules",
      "Quality control and traceability",
      "Business intelligence across the group",
    ]),
    section("africa", "Running a group across Africa", [
      "X3's real advantage for South African companies is multi country finance. A group with a South African parent and subsidiaries in Botswana, Namibia or Kenya can run each entity in its own currency and tax setup, then consolidate in rand. Check that your partner has done localisation for each country you operate in, because tax and statutory reporting differ.",
    ]),
    section("implementation", "Implementation", [
      "X3 projects usually run for several months and need a dedicated internal project lead, not just a partner. Budget for process design, data migration, integrations, testing and training, and plan go live at a period start.",
    ]),
    section("questions", "Questions to ask", [], [
      "Which countries have you localised X3 for, and can we speak to a customer in each?",
      "How will consolidation in rand work for our group?",
      "What is fixed price and what is time and materials?",
      "Will you host it, or will we, and what does each cost a year?",
    ]),
  ],
  "sage-intacct": [
    section("dimensions", "Why dimensions change month end", [
      "In a traditional ledger, reporting by branch, project or department means extra accounts, cost centres or journals. In Intacct each transaction carries tags, and reports slice on any of them. A professional services firm can see margin by client, by partner and by office from the same entries without building separate ledgers.",
      "For groups, the same idea makes consolidation quick: entities share a chart of accounts and inter company transactions are tracked, so consolidated statements are a report rather than a spreadsheet exercise.",
    ]),
    section("local-rules", "South African VAT and reporting", [
      "Intacct came from the American market. Ask your partner exactly how South African VAT reporting and the VAT201 are configured, and see it working on test data before you sign.",
    ]),
    section("questions", "Questions to ask", [], [
      "How is the VAT201 produced for South African entities?",
      "Which systems will feed Intacct with sales, stock and payroll, and who builds those links?",
      "How many entities and users does the quote cover, and what does each extra one cost?",
      "Is the price fixed in rand for the term?",
    ]),
  ],
  "sage-crm": [
    section("integration", "How the ERP link works", [
      "The point of Sage CRM is that sales and finance share one customer. A sales person opening an account sees the balance, overdue invoices and recent orders from the ERP. A quote won in CRM becomes a sales order in the ERP, so nobody retypes it.",
      "Make sure the partner configures which fields synchronise in which direction, and who owns the master record for customer details. Conflicts between two systems are the most common source of trouble.",
    ]),
    section("alternatives", "When to choose something else", [
      "If your sales team lives on WhatsApp and email, a modern CRM with a mobile app and messaging integration may serve them better, even without the ERP link. HubSpot and Zoho CRM both connect to accounting systems through integrations, though not as tightly as Sage CRM connects to Sage ERP.",
    ]),
  ],
  "sage-300-people": [
    section("modules", "What it covers", [], [
      "Payroll with union agreements, shift allowances and overtime rules",
      "Leave management across many companies",
      "Employment Equity reporting",
      "Skills development and training records",
      "Recruitment and onboarding",
      "Performance management",
      "Employee self service",
    ]),
    section("implementation", "Implementation", [
      "Large payroll migrations need parallel runs. Run the old and new payroll side by side for at least one month, ideally two, and reconcile every employee before switching. Plan the switch for the start of a tax year or after the interim EMP501 to keep reconciliations simple.",
    ]),
    section("questions", "Questions to ask", [], [
      "How many employees and companies does the quote cover?",
      "Which modules are included, and which are extra?",
      "How are tax table updates and year end support priced?",
      "Will you host it, and where is the data stored?",
      "Can we speak to an employer of our size in our industry?",
    ]),
  ],
};
