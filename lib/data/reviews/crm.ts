import type { EditorialReview } from "@/lib/types";
import { REVISED, section } from "./helpers";

const POPIA_MARKETING =
  "Under POPIA, direct marketing by email, SMS or WhatsApp needs the person's consent, unless they are an existing customer who bought something similar and was given the chance to opt out. Record the basis for each contact in the CRM, and honour opt outs everywhere.";

export const crmReviews: Record<string, EditorialReview> = {
  "hubspot-crm": {
    verdict:
      "HubSpot is the best first CRM for most South African small businesses. The free plan is genuinely useful, sales people keep it up to date, and marketing and service tools share the same record when you need them. Costs climb steeply on the upper tiers and are billed in dollars, so model the plan you will need in two years.",
    buy_if: "You are buying your first CRM, want something your team will actually use, and may add marketing later.",
    skip_if: "You need territories and heavy automation on a tight budget, where Zoho CRM goes further for less.",
    pros: ["Free plan with contacts, deals and email tracking", "Very easy for sales people to adopt", "One record across sales, marketing and service", "WhatsApp, Gmail, Outlook and Teams integrations", "Large library of free training"],
    cons: ["Dollar pricing exposes you to the exchange rate", "Professional and Enterprise are a big step up in price", "Onboarding fees on upper tiers", "Data is hosted offshore"],
    reviewed_at: REVISED,
    sections: [
      section("what-it-is", "What HubSpot is", [
        "HubSpot was founded in 2006 in Cambridge, Massachusetts, as a marketing software company and has grown into a full customer platform. The CRM is the shared record at the centre: contacts, companies, deals and tickets. Sales, marketing and service tools, which HubSpot calls hubs, sit on top of that record and are bought separately.",
      ]),
      section("pricing", "Pricing, in rand terms", [
        "The free plan has user and feature limits but covers the basics: contacts, deals, a pipeline, email tracking and meeting links. Starter's regular price is $20 a seat a month, and new customers were offered $7 a seat on annual billing for the first year when we checked. Third party guides put Sales Hub Professional at about $90 a seat on annual billing and Enterprise at about $150, plus once off onboarding fees; we have not checked those two tiers on HubSpot's own page. Rand figures use our stated rate and include VAT.",
      ], [
        "Starter: about R386 a seat a month at the regular price, about R135 on the first year offer",
        "5 seats on Starter at the regular price: about R1 932 a month",
        "5 seats on Professional, third party figure: about R8 694 a month",
        "The jump from Starter to Professional is the decision most growing teams face",
      ]),
      section("daily-use", "Why sales teams keep it up to date", [
        "A CRM only works if people use it. HubSpot's biggest strength is adoption: emails from Gmail or Outlook log themselves against the contact, meeting links book straight into calendars, and the pipeline board is easy to read. Managers get a pipeline they can trust without chasing reps for updates.",
      ]),
      section("local", "Selling the South African way", [
        "HubSpot connects to WhatsApp Business, so chats can sit against the contact and the deal, which matters in a market where many customers prefer WhatsApp to email. " + POPIA_MARKETING,
        "HubSpot offers a data processing agreement and hosts data offshore. Keep the agreement with your POPIA records.",
      ]),
      section("growth", "Plan for the price of growth", [
        "Many teams start free, move to Starter and then hit a feature they need, such as sequences, forecasting or custom reports, that sits on Professional. That step multiplies the bill several times and adds an onboarding fee. Before you commit, list the features you expect to need in two years and price the plan that includes them.",
      ]),
      section("setup", "Getting started", [
        "Import your contacts from a spreadsheet, set up your pipeline stages to match how you actually sell, connect email and calendars, and agree as a team which fields are compulsory. HubSpot Academy's free courses are some of the best vendor training available.",
      ]),
      section("fit", "Who should pick something else", [
        "Teams that need territories, forecasting and complex automation without paying Professional prices get more from Zoho CRM. Pure pipeline teams may prefer Pipedrive. Field sales reps taking orders on the road are better served by Skynamo.",
      ]),
      section("questions", "Questions to answer before you buy", [], [
        "Which features will we need in two years, and which plan includes them?",
        "How many seats will we pay for, and who only needs view access?",
        "How will we record POPIA consent for marketing contacts?",
        "Will we connect WhatsApp Business, and who owns that number?",
      ]),
    ],
  },

  salesforce: {
    verdict:
      "Salesforce can model almost any sales process, and South Africa has a deep bench of partners to implement it. That power is wasted on small teams and expensive at every level: Starter Suite is $25 a seat, but the full Sales Cloud editions start at $195. Buy it when your sales operation genuinely needs it and you have an admin or partner to run it.",
    buy_if: "You run a large, complex sales operation with territories, approvals and a dedicated CRM admin.",
    skip_if: "You are a small team, where HubSpot or Zoho CRM give you most of the value for a fraction of the cost.",
    pros: ["Models almost any sales process", "Large South African partner bench", "Huge app marketplace", "Starter Suite is affordable for small teams", "Johannesburg office"],
    cons: ["Full Sales Cloud editions are very expensive", "Needs an admin or partner to run", "Implementation often costs more than year one licences", "Only Starter Suite can be billed monthly"],
    reviewed_at: REVISED,
    sections: [
      section("what-it-is", "What Salesforce is", [
        "Salesforce was founded in San Francisco in 1999 and is the largest CRM vendor in the world. Sales Cloud is its sales product, and it sits on a platform that can be customised far beyond what most CRMs allow: custom objects, approval processes, territories and automation. That flexibility is why large organisations choose it, and why it needs skilled people to run.",
      ]),
      section("pricing", "Every edition, checked on Salesforce's site", [
        "All prices are per user per month in US dollars. Starter Suite can be billed monthly or yearly; every other edition is billed yearly. Rand figures use our stated rate and include VAT.",
      ], [
        "Starter Suite: $25, about R483 per user a month",
        "Pro Suite: $100, about R1 932",
        "Sales Cloud Core: $195, about R3 767",
        "Sales Cloud Advanced: $395, about R7 631",
        "Sales Cloud Max: $550, about R10 626",
        "10 users on Pro Suite: about R19 320 a month",
      ]),
      section("real-cost", "The cost beyond licences", [
        "Implementation by a partner is a separate cost and is often larger than the first year of licences. Most organisations also need someone to run the system after go live, either an internal administrator or a partner on a retainer. Add both to the licence cost before you compare Salesforce with simpler CRMs.",
      ]),
      section("daily-use", "What it does best", [
        "Salesforce shines when the sales process is complicated: several product lines, approval steps for discounts, territories, partner channels and detailed forecasting. Reports and dashboards can answer almost any question if the data model is right, and the marketplace adds tools for quoting, electronic signatures and analytics.",
      ]),
      section("local", "South African fit", [
        "Salesforce has a Johannesburg office and a large local partner network, so implementation help is easy to find. It offers a data processing addendum for POPIA purposes, and data is hosted offshore. " + POPIA_MARKETING,
      ]),
      section("fit", "Who it suits", [
        "Banks, insurers, telecoms and large distributors with structured sales teams. For a ten person sales team, start with HubSpot or Zoho CRM and move only when you hit their limits. Businesses running a Sage ERP should also look at Sage CRM, which reads ERP data directly.",
      ]),
      section("questions", "Questions to ask before you buy", [], [
        "Which edition do we actually need, and why not the one below?",
        "What will implementation cost, and what is the fixed scope?",
        "Who will administer the system after go live?",
        "How will Salesforce connect to our ERP or accounting system?",
      ]),
    ],
  },

  "zoho-crm": {
    verdict:
      "Zoho CRM gives you most of what the expensive CRMs do at a fraction of the price, with a free plan for up to three users. Automation, territories and forecasting arrive on mid plans. It needs more setup than HubSpot to feel right, but rewards it, especially for businesses already on Zoho Books.",
    buy_if: "You want serious automation and territories on a budget, or your books are already in Zoho Books.",
    skip_if: "You want the easiest possible CRM with no setup.",
    pros: ["Free for up to three users", "Low price per user", "Automation and territories on mid plans", "WhatsApp Business integration", "Part of the Zoho suite"],
    cons: ["Busy interface until configured", "Prices shown in US dollars", "Fewer local partners than HubSpot or Salesforce"],
    reviewed_at: REVISED,
    sections: [
      section("what-it-is", "What Zoho CRM is", [
        "Zoho CRM is the sales app from Zoho Corporation. It covers leads, contacts, deals, pipelines, email, forecasting and automation, and it shares data with Zoho Books, Zoho Desk and the rest of the Zoho suite. It is one of the most capable CRMs for its price.",
      ]),
      section("pricing", "Prices, checked on Zoho's site", [
        "Prices are per user a month on yearly billing, from Zoho's pricing page on 17 November 2026, which showed US dollars when we looked. Zoho adds VAT on top, and monthly billing costs more. Rand figures use our stated rate and include VAT.",
      ], [
        "Free: up to three users",
        "Standard: $14, about R270 per user",
        "Professional: $23, about R444 per user",
        "Enterprise: $40, about R773 per user",
        "Ultimate: $52, about R1 005 per user",
        "5 users on Standard: about R1 352 a month",
        "10 users on Professional: about R4 444 a month",
      ]),
      section("daily-use", "Where it beats the competition", [
        "Zoho CRM puts workflow rules, assignment rules, territories and forecasting on plans that cost a fraction of HubSpot Professional. A sales manager can route leads by region, send follow ups automatically and see a forecast by rep without paying enterprise prices. Its WhatsApp Business integration suits South African customers who prefer chat.",
      ]),
      section("setup", "The setup it needs", [
        "Out of the box Zoho CRM shows a lot of modules and fields. Spend time hiding what you do not use, setting up your pipeline stages and making key fields compulsory. A clean setup makes the difference between a CRM people avoid and one they rely on.",
      ]),
      section("local", "South African fit", [
        "Zoho publishes data processing terms for POPIA purposes. " + POPIA_MARKETING,
        "If you use Zoho Books, quotes and invoices can link to CRM deals, which avoids retyping customer details.",
      ]),
      section("fit", "Zoho CRM or HubSpot?", [
        "Our written comparison picks HubSpot for teams buying their first CRM, because adoption matters most. Pick Zoho when you need territories and automation without paying HubSpot Professional prices.",
      ]),
      section("questions", "Questions to answer before you buy", [], [
        "Who will configure the CRM before the team starts using it?",
        "Which plan includes the automation and territories we need?",
        "Do we already use other Zoho apps that would share data?",
        "Can Zoho bill us in rand, and what will our bank charge for dollar billing?",
      ]),
    ],
  },

  pipedrive: {
    verdict:
      "Pipedrive is a pipeline first CRM that small sales teams adopt in a day. Every deal shows its next action, and the mobile app is excellent. Several features that used to be standard are now paid add ons, so price the add ons you will use before you compare.",
    buy_if: "You run a small sales team that lives in its pipeline.",
    skip_if: "You want marketing and service tools on the same record.",
    pros: ["Built around the visual pipeline", "Quick to adopt", "Strong mobile app", "14 day free trial", "WhatsApp Business integration"],
    cons: ["Dollar pricing", "Add ons for lead capture and campaigns cost extra", "Thinner reporting outside the pipeline"],
    reviewed_at: REVISED,
    sections: [
      section("what-it-is", "What Pipedrive is", [
        "Pipedrive was founded in Tallinn, Estonia, in 2010 by people who had run sales teams and wanted a CRM built around how sellers actually work. The pipeline board is the centre of the product: every deal sits in a stage, and every deal should have a next activity scheduled.",
      ]),
      section("pricing", "Prices, checked on Pipedrive's site", [
        "Prices are per seat a month on yearly billing, from Pipedrive's pricing page on 17 November 2026, and exclude VAT. Monthly billing is $19, $34, $64 and $89. Add ons such as LeadBooster and Campaigns cost extra. Rand figures use our stated rate and include VAT.",
      ], [
        "Lite: $14, about R270 per seat",
        "Growth: $24, about R464 per seat",
        "Premium: $49, about R947 per seat",
        "Ultimate: $69, about R1 333 per seat",
        "5 seats on Growth, yearly: about R2 318 a month",
        "10 seats on Growth, yearly: about R4 637 a month",
      ]),
      section("daily-use", "Why sellers like it", [
        "The rule that every deal needs a next step changes behaviour. Deals without an activity turn red, so nothing goes quiet without someone noticing. Email syncs to deals, calls can be logged from the mobile app, and simple automations move deals or create tasks when stages change.",
      ]),
      section("add-ons", "Watch the add ons", [
        "Lead capture forms and chat, email campaigns and some other tools are sold as add ons. A team that needs them can end up paying close to the next plan up. List what you need and price the full bundle before you compare Pipedrive with HubSpot or Zoho CRM.",
      ]),
      section("local", "South African fit", [
        "Pipedrive offers a data processing agreement for POPIA purposes. " + POPIA_MARKETING,
      ]),
      section("fit", "Who should pick something else", [
        "Teams that want marketing and service on the same record should look at HubSpot. Teams that need territories and complex automation on a budget should look at Zoho CRM. Field reps taking orders offline should look at Skynamo.",
      ]),
      section("questions", "Questions to answer before you buy", [], [
        "Which add ons will we need, and what do they cost together?",
        "Will we bill yearly to get the lower price?",
        "Does it connect to our accounting software for quotes and invoices?",
      ]),
    ],
  },

  freshsales: {
    verdict:
      "Freshsales is one of the cheapest ways to get a proper sales CRM with a built in phone dialler. Growth costs $9 a seat on yearly billing. It suits inside sales teams that live on calls and email.",
    buy_if: "Your sellers spend their day on the phone and email.",
    skip_if: "You need the largest ecosystem of integrations.",
    pros: ["Built in phone and email", "Low entry price", "21 day free trial", "Shared customer view with Freshdesk"],
    cons: ["Dollar pricing", "Pro tier is a big jump from Growth", "Smaller app ecosystem than HubSpot or Salesforce"],
    reviewed_at: REVISED,
    sections: [
      section("what-it-is", "What Freshsales is", [
        "Freshsales is the sales CRM from Freshworks, a company founded in 2010 and now based in San Mateo in the United States. It is best known for Freshdesk, its support desk, and Freshsales shares customer records with it, so sales and support see the same history.",
      ]),
      section("pricing", "Prices, checked on Freshworks' site", [
        "Prices are per seat a month on annual billing; monthly billing costs about 20% more. Rand figures use our stated rate and include VAT.",
      ], [
        "Growth: $9, about R174 per seat",
        "Pro: $39, about R753 per seat",
        "Enterprise: $59, about R1 140 per seat",
        "5 seats on Growth: about R869 a month",
        "10 seats on Pro: about R7 535 a month",
      ]),
      section("daily-use", "Calling and email in the CRM", [
        "The phone and email tools are the reason to choose it. Reps can call from the CRM, calls are logged against the contact and email sequences follow up automatically. For an inside sales team making dozens of calls a day, keeping the dialler and the record together saves time and keeps the history complete. Check call rates for South African numbers before you rely on the built in phone.",
      ]),
      section("local", "South African fit", [
        "Freshworks offers a data processing addendum for POPIA purposes. " + POPIA_MARKETING,
      ]),
      section("fit", "Who should pick something else", [
        "Teams that need a large integration ecosystem or marketing on the same record should look at HubSpot. Pipeline focused teams that rarely phone should compare Pipedrive.",
      ]),
      section("questions", "Questions to answer before you buy", [], [
        "What do calls to South African numbers cost through the built in phone?",
        "Which features force the jump from Growth to Pro?",
        "Do we use Freshdesk, and would shared records help?",
      ]),
    ],
  },

  skynamo: {
    verdict:
      "Skynamo is the best tool on our register for field sales reps who visit customers and take orders, even without signal. It was built in Stellenbosch for wholesalers and manufacturers, and it connects orders straight to the back office. It is not a general CRM.",
    buy_if: "Your reps drive territories, take orders on site and need the catalogue and prices offline.",
    skip_if: "Your sales happen on email and video calls.",
    pros: ["Works offline", "Orders flow straight to the ERP", "Visit planning and rep tracking", "Built and supported in South Africa", "Rep sees customer pricing and stock on site"],
    cons: ["No public pricing", "Not a general purpose CRM", "Value depends on the ERP connection"],
    reviewed_at: REVISED,
    sections: [
      section("what-it-is", "What Skynamo is", [
        "Skynamo is a field sales app built in Stellenbosch for companies whose reps visit shops, pharmacies, hardware stores and other trade customers. The rep's app holds the customer list, product catalogue, customer specific prices and order history, and it works without signal. Orders sync to the back office when the phone reconnects.",
      ]),
      section("pricing", "How pricing works", [
        "Skynamo quotes per rep based on users, products and ERP integration. Its pricing page lists what each plan includes and offers month to month, annual and ERP integrated rollouts, and an optional analytics add on, but asks you to talk to sales for the price, as it did on 17 November 2026.",
      ]),
      section("daily-use", "A day on the road", [
        "A rep plans the day's visits, checks in at each customer, sees what they ordered last time and what they usually buy, captures the order with the right price list and leaves. Managers see which customers were visited, which were missed and what each rep sold, which is hard to know from a spreadsheet.",
      ]),
      section("erp", "The ERP connection is the point", [
        "The real value comes when orders flow straight into your ERP or accounting system, so nobody retypes them and stock and pricing stay current on the rep's phone. Ask which systems Skynamo connects to as standard, and what a connection to yours involves, before you sign.",
      ]),
      section("local", "Built for local conditions", [
        "Offline working matters on South African roads and in rural areas with patchy signal, and during power cuts that take down local towers. Skynamo is a South African company with published privacy terms, which simplifies the POPIA file.",
      ]),
      section("fit", "Who should pick something else", [
        "Teams that sell by email, video call and phone need a general CRM such as HubSpot, Zoho CRM or Pipedrive instead. Businesses on a Sage ERP with an office based sales team should look at Sage CRM.",
      ]),
      section("questions", "Questions to ask before you buy", [], [
        "What is the price per rep at our team size?",
        "Does it connect to our ERP as standard, and what does that cost?",
        "How does it handle our customer specific price lists and promotions?",
        "How long does a typical rollout take?",
      ]),
    ],
  },
};
