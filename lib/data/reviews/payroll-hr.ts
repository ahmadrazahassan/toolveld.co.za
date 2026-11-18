import type { EditorialReview } from "@/lib/types";
import { REVISED, section } from "./helpers";

export const payrollHrReviews: Record<string, EditorialReview> = {
  simplepay: {
    verdict:
      "SimplePay is the payroll we would recommend to most small and mid sized South African employers. It does the full SARS cycle, leave to BCEA rules and employee self service, and its base fee plus a falling per employee fee keeps it cheap from one employee to a few hundred. It is the default partner for Xero and works with Sage Accounting and QuickBooks Online too.",
    buy_if: "You employ between one and a few hundred people and want payroll that just works, at a low cost.",
    skip_if: "You need payroll and full HR on one enterprise record, or payroll in many countries.",
    pros: [
      "Full SARS cycle: EMP201, EMP501, IRP5, UIF, SDL and ETI",
      "Leave to BCEA rules out of the box",
      "Employee self service for payslips, leave and tax certificates",
      "Posts journals to Xero, Sage Accounting and QuickBooks Online",
      "Price per employee falls as you grow",
      "Builds the uFiling declaration for UIF",
    ],
    cons: [
      "Prices come from a calculator rather than a published table",
      "Support is by email and help centre rather than phone",
      "Lighter HR features than dedicated HR systems",
      "Each company is billed separately",
    ],
    reviewed_at: REVISED,
    sections: [
      section("what-it-is", "What SimplePay is", [
        "SimplePay is a cloud payroll built and supported in Cape Town for South African employers. It does one job, payroll and the statutory work around it, and does it thoroughly. Employers run payroll in the browser, staff get payslips and leave on their phones, and the SARS and UIF submissions come out of the same data.",
      ]),
      section("pricing", "How SimplePay charges", [
        "SimplePay charges a base fee of R70 a month plus a fee for each employee paid, excluding VAT. The per employee fee falls in steps: R19,50 for each of the first five, R13,60 for employees six to ten and R11 for each employee after that. These figures come from SimplePay's own price calculator on 17 November 2026. Employers above 500 staff and payroll bureaus get a quote.",
      ], [
        "1 employee: R89,50 a month excl VAT",
        "5 employees: R167,50 a month excl VAT",
        "10 employees: R235,50 a month excl VAT",
        "25 employees: R400,50 a month excl VAT",
        "50 employees: R675,50 a month excl VAT",
      ]),
      section("local-rules", "The SARS and UIF work it does for you", [
        "Every month SimplePay works out PAYE, UIF, SDL and ETI and gives you the EMP201 figures. Twice a year it builds the EMP501 reconciliation and the IRP5 and IT3(a) certificates from the same data. It also produces the UIF declaration for uFiling. This is most of the reason small businesses buy payroll software, and SimplePay does it well.",
        "It flags SDL once your payroll passes R500 000 a year and works out ETI for qualifying young employees, two places where hand calculated payrolls often go wrong.",
      ]),
      section("leave", "Leave and self service", [
        "South African leave types come built in: annual leave, sick leave on its three year cycle and family responsibility leave, with balances that update as leave is taken. Employees apply on the self service app, managers approve, and the payslip reflects it. Staff can download their own payslips and tax certificates, which removes a steady stream of requests to the person who runs payroll.",
      ]),
      section("comparison", "SimplePay against Sage Payroll", [
        "Sage shows its payroll prices including VAT, so these SimplePay figures include VAT too. For one or two employees Sage Payroll is slightly cheaper: R97 a month against about R103 and R125. From three employees SimplePay pulls ahead: five employees cost about R193 against R224, ten about R271 against R430, 25 about R461 against R1 018 and 50 about R777 against R1 832. SimplePay also includes self service on every account. Sage Payroll wins only if you want books and payroll from one vendor on Sage Accounting. Our written comparison names SimplePay the winner.",
      ]),
      section("setup", "Moving from another payroll", [
        "The easiest time to switch is the start of a tax year in March, because the year to date figures start at zero. Mid year switches work too, but you must load each employee's year to date earnings and tax so the EMP501 and IRP5 add up. SimplePay's help centre walks through both.",
      ]),
      section("support", "Support", [
        "Support is by email and a detailed help centre. Response times are generally good, but there is no phone line for urgent problems on pay day, so run payroll a day or two early in the first months.",
      ]),
      section("fit", "Who should pick something else", [
        "Employers with several hundred staff across many companies and pay structures, or with payroll in other African countries, should look at PaySpace or Sage 300 People. Businesses that want one vendor for books and payroll with a phone line should look at Sage Accounting with Sage Payroll.",
      ]),
      section("questions", "Questions to answer before you buy", [], [
        "How many employees will I pay in a year's time, and what does the calculator show at that number?",
        "How many companies do I run payroll for, since each is billed separately?",
        "Which accounting product will receive the payroll journals?",
        "Will I switch at the start of the tax year or mid year?",
      ]),
    ],
  },

  payspace: {
    verdict:
      "PaySpace is the strongest cloud payroll and HR system on our register for mid sized and large South African employers, and the only one built from the start for payroll across many African countries. It is quoted per employee, and since 2024 it is part of Deel. Compare it with Sage 300 People if you employ hundreds of people.",
    buy_if: "You employ more than fifty people, run several companies or pay frequencies, or pay staff in other African countries.",
    skip_if: "You are a small business, where SimplePay or Sage Payroll will cost far less.",
    pros: ["Payroll and HR on one employee record", "Several companies, cost centres and pay frequencies", "Payroll across many African countries", "Cloud with employee self service", "Full South African statutory cycle"],
    cons: ["No public pricing", "Implementation is a project", "More than a small business needs", "Roadmap now set by Deel"],
    reviewed_at: REVISED,
    sections: [
      section("what-it-is", "What PaySpace is", [
        "PaySpace is a cloud payroll and HR system built for complex employers: several legal entities, weekly and monthly pay runs, cost centres, union deductions and staff in more than one African country. Payroll, leave, employee records and reporting share one employee record, so a change made once flows everywhere.",
      ]),
      section("pricing", "How pricing works", [
        "PaySpace quotes per employee per month, with implementation usually quoted separately. Its website showed no price list when we checked on 17 November 2026. Ask for these lines in writing.",
      ], [
        "Rate per employee per month at your headcount",
        "Which modules are included in that rate",
        "Implementation, data migration and parallel runs",
        "Training for payroll and HR staff",
        "Price increases at renewal",
      ]),
      section("local-rules", "South African compliance", [
        "PaySpace covers the full statutory cycle: EMP201, EMP501, IRP5 certificates, UIF, SDL and ETI, with BCEA leave rules. For larger employers it also handles the reporting load that comes with size, such as Employment Equity reporting for designated employers.",
      ]),
      section("daily-use", "Day to day", [
        "Employees use self service for payslips, leave and tax certificates, and managers approve leave and changes in the same system. Payroll teams get detailed reports by company and cost centre and can run several pay frequencies side by side.",
      ]),
      section("deel", "What the Deel purchase means", [
        "Deel bought PaySpace in 2024 to give its global payroll a strong South African and African engine. Existing customers still run on PaySpace. Ask about the product roadmap and any change to contracts at renewal, and get any commitments in writing.",
      ]),
      section("implementation", "Implementation", [
        "Moving a large payroll is a project. Expect a data clean up, mapping of pay elements, at least one parallel run against your old payroll and sign off from finance before go live. Switching at the start of a tax year keeps the year to date figures simple.",
      ]),
      section("fit", "PaySpace or Sage 300 People?", [
        "PaySpace wins for employers moving to the cloud and for groups with payroll in other African countries. Sage 300 People suits employers who want on premises hosting or already rely on a Sage partner. Our written comparison covers both in detail.",
      ]),
      section("questions", "Questions to ask before you buy", [], [
        "What is the per employee rate at our headcount, and what does it include?",
        "What does implementation cost, and how many parallel runs are included?",
        "Which African countries can we pay through the same system?",
        "How will the Deel ownership affect our contract and support?",
      ]),
    ],
  },

  bamboohr: {
    verdict:
      "BambooHR is one of the friendliest HR systems available, and staff actually use it. For South African companies it is an HR record and onboarding tool, not payroll, and BCEA leave rules need setting up by hand. It is priced in US dollars, which makes it expensive next to Sage HR or Zoho People for most local teams.",
    buy_if: "You are a growing company with international staff or investors who expect a polished HR system.",
    skip_if: "You want rand pricing, South African leave templates or payroll in the same tool.",
    pros: ["Clean employee records and onboarding", "Staff happily use the app", "Good reports on headcount and turnover", "Flat fee for teams of 25 or fewer"],
    cons: ["Priced in US dollars", "No South African payroll", "BCEA leave cycles must be configured by you", "Data is hosted offshore"],
    reviewed_at: REVISED,
    sections: [
      section("what-it-is", "What BambooHR is", [
        "BambooHR was founded in 2008 in Lindon, Utah, and is built for small and mid sized companies that want their first proper HR system. It holds employee records, runs onboarding and offboarding checklists, tracks time off and produces headcount and turnover reports. Its payroll is a United States product and is not available for South Africa.",
      ]),
      section("pricing", "Prices, checked on BambooHR's site", [
        "BambooHR charges a flat monthly fee for companies with 25 employees or fewer. Above 25, it charges per employee, with volume discounts applied automatically. Prices are in US dollars before VAT. Rand figures use our stated rate and include 15% VAT.",
      ], [
        "Core: $250 a month up to 25 staff, about R4 830; then from $10,25 per employee",
        "Pro: $425 a month up to 25 staff, about R8 211; then from $17,50 per employee",
        "Elite: $650 a month up to 25 staff, about R12 558; then from $25 per employee",
        "40 staff on Core at the starting rate: about $410, roughly R7 921 a month before volume discounts",
      ]),
      section("real-cost", "Against the local options", [
        "Twenty employees on Core cost about R4 830 a month. The same twenty on Sage HR core cost R560, and on Zoho People Essential about R483 including VAT. BambooHR's flat fee is the same whether you have five staff or twenty five, so it is especially expensive for very small teams.",
      ]),
      section("daily-use", "Why people like it", [
        "The employee app is clear, onboarding checklists make sure contracts, bank details and equipment are sorted before day one, and managers can find what they need without training. If adoption has been the problem with past HR tools, BambooHR is a strong answer.",
      ]),
      section("local-rules", "South African setup", [
        "There are no South African leave templates, so configure annual leave, the 36 month sick leave cycle, family responsibility leave and parental leave yourself. Payroll stays in a local product such as SimplePay. Data is hosted offshore; keep BambooHR's data processing terms with your POPIA records.",
      ]),
      section("fit", "Who should pick something else", [
        "Most South African businesses under two hundred staff will get similar day to day value from Sage HR or Zoho People at a fraction of the cost, with local leave defaults or easier local setup.",
      ]),
      section("questions", "Questions to answer before you buy", [], [
        "Is the polish worth several thousand rand a month more than a local option?",
        "Who will set up and maintain the South African leave policies?",
        "How will employee changes reach our payroll product?",
        "What happens to the price when we pass 25 employees?",
      ]),
    ],
  },

  "zoho-people": {
    verdict:
      "Zoho People is a highly configurable HR system with a free tier for very small teams and paid plans from $1,25 per user a month. It rewards careful setup: spend a week shaping leave types, approvals and forms to South African rules and it fits closely. It is a natural choice for businesses already on Zoho Books or Zoho CRM.",
    buy_if: "You already use Zoho, or you want attendance and leave with flexible forms at a low price.",
    skip_if: "You want HR that works to BCEA rules on day one with no setup.",
    pros: ["Free tier for very small teams", "Low price per user", "Attendance tracking built in", "Highly configurable forms and approvals", "Shares data with other Zoho apps"],
    cons: ["Needs setup time to match local leave rules", "Prices shown in US dollars", "Many settings to learn"],
    reviewed_at: REVISED,
    sections: [
      section("what-it-is", "What Zoho People is", [
        "Zoho People is the HR app from Zoho Corporation. It covers employee records, leave, attendance, shifts, timesheets and performance, and it shares data with Zoho Books, Zoho CRM and the rest of the Zoho suite.",
      ]),
      section("pricing", "Prices, checked on Zoho's site", [
        "Prices are per user a month on yearly billing, from Zoho's pricing page on 17 November 2026, which showed US dollars. Zoho adds VAT on top. Monthly billing costs more, and companies above 500 users get a quote.",
      ], [
        "Free: for very small teams",
        "Essential HR: $1,25 per user, about R24 incl VAT",
        "Professional: $2 per user, about R39 incl VAT",
        "Premium: $3 per user, about R58 incl VAT",
        "Enterprise: $4,50 per user, about R87 incl VAT",
      ]),
      section("real-cost", "What a team pays", [
        "Twenty five users on Essential HR cost about R604 a month including VAT, and on Professional about R966. That is in the same range as Sage HR's core module for the same team and far below BambooHR.",
      ]),
      section("daily-use", "What it does well", [
        "Zoho People's strength is flexibility. Custom forms capture whatever your business needs, approval chains can follow departments and locations, and attendance can come from the app or from attendance devices. Businesses with shift workers get scheduling and timesheets in the same place.",
      ]),
      section("setup", "Getting the setup right", [
        "Model annual leave, sick leave on its three year cycle, family responsibility leave and parental leave before inviting staff. Set approval chains by department, and restrict who can see personal information to meet POPIA duties. Allow about a week for a small business, and test with one department first.",
      ]),
      section("local-rules", "South African fit", [
        "Leave types are configurable rather than preset for the BCEA, so the quality of your setup decides how well it fits. Payroll stays in a South African product. Zoho publishes data processing terms; keep them with your POPIA records.",
      ]),
      section("fit", "Who should pick something else", [
        "Teams that want leave to work to BCEA rules with little setup, or who want a phone line in South Africa, should compare Sage HR. Companies above about fifty staff who want payroll and HR on one record should look at PaySpace.",
      ]),
      section("questions", "Questions to answer before you buy", [], [
        "Who will configure the leave policies, and when?",
        "Which plan includes the attendance and shift features we need?",
        "Do we already use Zoho apps that would share employee data?",
        "How will leave taken reach our payroll each month?",
      ]),
    ],
  },

  deel: {
    verdict:
      "Deel is the best tool on our register for one specific job: paying and employing people outside South Africa without opening a company there. Contractors cost from $49 each a month and Employer of Record staff from $599. For a purely local team it is unnecessary.",
    buy_if: "You hire contractors or full time staff in other countries.",
    skip_if: "Everyone you employ is in South Africa.",
    pros: ["Hire abroad without your own entity", "Contracts and payments in many currencies", "Owns PaySpace for South African payroll depth", "One place for all international workers"],
    cons: ["Dollar pricing per worker adds up", "Employer of Record is costly for low salaries", "Global Payroll and Deel HR are priced on request"],
    reviewed_at: REVISED,
    sections: [
      section("what-it-is", "What Deel is", [
        "Deel was founded in San Francisco in 2019 to help companies hire people anywhere. It writes local contracts, pays workers in their own currency and, through its Employer of Record service, legally employs staff on your behalf in countries where you have no company. In 2024 it bought PaySpace, the South African payroll and HR system.",
      ]),
      section("pricing", "Prices, checked on Deel's site", [
        "All prices are starting prices in US dollars per worker per month. Rand figures use our stated rate and are before any VAT.",
      ], [
        "Contractors: $49, about R823 a month each",
        "Contractor of Record: $325, about R5 460",
        "Employer of Record: $599, about R10 063",
        "Five contractors abroad: about $245, or roughly R4 116 a month",
        "Global Payroll and Deel HR: priced on request",
      ]),
      section("how-it-works", "Contractor or Employer of Record?", [
        "For contractors, Deel generates the contract, collects invoices and pays them, and you pay Deel. For employees, the Employer of Record option makes Deel's local entity the legal employer, handling local payroll tax, benefits and employment law, while the person works for you day to day. Misclassifying a full time employee as a contractor can create tax and labour risks in their country, so use Employer of Record when the relationship looks like employment.",
      ]),
      section("when-it-pays", "When it pays for itself", [
        "Opening a company abroad means registration, local accountants, payroll and legal advice. For one to five people in a country, Employer of Record is usually cheaper and much faster. Above that, compare it with setting up your own entity. For low salaries the fixed $599 fee is a large share of the cost of employment.",
      ]),
      section("local-rules", "The South African side", [
        "Your payments to Deel leave South Africa, so your bank treats them as foreign payments with the usual reporting. Ask your accountant how the fees and payments are treated for tax. Keep Deel's data processing terms on file for POPIA, since you share personal information about the people you hire.",
      ]),
      section("fit", "Who should pick something else", [
        "If everyone you employ is in South Africa, a local payroll such as SimplePay, Sage Payroll or PaySpace does the job for far less.",
      ]),
      section("questions", "Questions to answer before you buy", [], [
        "Are the people abroad really contractors, or employees in substance?",
        "How many people will we have in each country in two years?",
        "What does Global Payroll cost if we later open our own entities?",
        "How will we pay Deel, and what does our bank charge?",
      ]),
    ],
  },
};
