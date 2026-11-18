/**
 * Cover photos for every guide. Each is an Unsplash photo, downloaded through the Unsplash
 * API, cropped to 1600 by 900 and stored in public/images/guides. The credit is shown under
 * the cover on the guide page, as the Unsplash guidelines ask.
 */
type Cover = { cover: string; cover_alt: string; cover_credit: { name: string; url: string } };

const unsplash = (username: string) => `https://unsplash.com/@${username}?utm_source=toolveld&utm_medium=referral`;

const c = (slug: string, alt: string, name: string, username: string): [string, Cover] => [
  slug,
  { cover: `/images/guides/${slug}.jpg`, cover_alt: alt, cover_credit: { name, url: unsplash(username) } },
];

export const guideCovers: Record<string, Cover> = Object.fromEntries([
  c("best-accounting-software-south-africa", "A laptop showing an accounting dashboard with charts", "Carlos Muza", "kmuza"),
  c("best-payroll-software-south-africa", "A team of colleagues working on laptops around a meeting table", "Christina @ wocintechchat.com", "wocintechchat"),
  c("sage-vs-xero-south-africa", "A person working in cloud accounting software on a laptop", "Campaign Creators", "campaign_creators"),
  c("free-accounting-software-south-africa", "A laptop on a desk in a small home office", "Mikey Harris", "mikeyharris"),
  c("best-crm-small-business-south-africa", "A sales team meeting around a boardroom table", "Christina @ wocintechchat.com", "wocintechchat"),
  c("how-to-register-for-vat-south-africa", "A person working through figures with a calculator and notebook", "Jakub Żerdzicki", "jakubzerdzicki"),
  c("sars-tax-invoice-requirements", "A business owner checking a paper invoice against a laptop", "SumUp", "sumup"),
  c("e-invoicing-south-africa-sars", "An invoice open in billing software on a laptop", "SumUp", "sumup"),
  c("provisional-tax-due-dates-south-africa", "A calendar with due dates marked by red pins", "Towfiqu barbhuiya", "towfiqu999999"),
  c("cipc-annual-return-guide", "A company director signing a document", "Scott Graham", "amstram"),
  c("emp201-due-date-penalties", "An open monthly planner on a desk", "Eric Rothermel", "erothermel"),
  c("how-to-calculate-paye-uif-south-africa", "A calculator and pen on a sheet of salary workings", "Aaron Lefler", "alefler"),
  c("minimum-wage-south-africa-2026", "Two construction workers taking a break on a roof", "David Geneugelijk", "davidgeneugelijk"),
  c("leave-pay-public-holiday-pay-south-africa", "Camps Bay and the Twelve Apostles in Cape Town at sunset", "Jaman Asad", "asadsnapper"),
  c("overtime-calculation-south-africa", "A person working late in a dark office", "Vitaly Gariev", "silverkblack"),
  c("vat201-what-your-software-should-do", "A calculator lying on a pile of receipts", "FIN", "fin21"),
  c("emp201-emp501-without-the-panic", "Payroll reports, a notebook and a calculator on a desk", "Jakub Żerdzicki", "jakubzerdzicki"),
  c("popia-checklist-for-software", "A padlock resting on a computer keyboard", "FlyD", "flyd2069"),
  c("choosing-accounting-software-start-with-your-bank", "A card machine next to a laptop on an office desk", "Tyler Franta", "tfrants"),
  c("moving-off-pastel", "A laptop on a wooden desk beside a window", "Roberto Nickson", "rpnickson"),
  c("crm-when-customers-live-on-whatsapp", "A phone with WhatsApp open in a hand", "Dimitri Karastelev", "dkfra19"),
  c("how-to-read-an-erp-quote", "A large warehouse with racks of stock", "Adrian Sulyok", "sulyok_imaging"),
  c("best-hr-software-south-africa", "An HR manager interviewing a candidate across an office desk", "Vitaly Gariev", "silverkblack"),
  c("best-project-management-software-south-africa", "Hands holding sticky notes marked To Do, Doing and Done", "Eden Constantino", "edenconstantin0"),
  c("best-erp-software-south-africa", "Workers on a production line inside a food processing plant", "Arno Senoner", "arnosenoner"),
  c("how-to-register-a-company-south-africa", "A sign in a shop window that reads Come in, we are open", "Tim Mossholder", "timmossholder"),
  c("tax-compliance-status-pin-sars", "Two people shaking hands over a signed document", "Amina Atar", "minaslens"),
  c("turnover-tax-south-africa", "A hairstylist working on a client in a small salon", "Giorgio Trovato", "giorgiotrovato"),
  c("small-business-corporation-tax-south-africa", "A business owner working on a laptop in a home office", "Brooke Cagle", "brookecagle"),
  c("employment-tax-incentive-eti-south-africa", "A smiling young barista at work in a coffee shop", "Brooke Cagle", "brookecagle"),
  c("uif-registration-for-employers", "A kitchen team preparing food together in a restaurant", "Negley Stockman", "negley"),
  c("coida-return-of-earnings", "Racks of hard hats in a construction site store", "Pop & Zebra", "popandzebra"),
  c("severance-pay-notice-period-south-africa", "An employee carrying a box of belongings out of the office", "Vitaly Gariev", "silverkblack"),
]);
