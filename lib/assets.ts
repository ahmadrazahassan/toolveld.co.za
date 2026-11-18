/** Integration logos we hold in /public/integrations. Integrations without a file render as text. */
const INTEGRATION_LOGOS: Record<string, string> = {
  Xero: "/integrations/xero.svg",
  "Sage Accounting": "/integrations/sage-accounting.svg",
  "QuickBooks Online": "/integrations/quickbooks-online.svg",
  "Zoho Books": "/integrations/zoho-books.svg",
  "Zoho Desk": "/integrations/zoho-desk.svg",
  Slack: "/integrations/slack.svg",
  Shopify: "/integrations/shopify.svg",
  Stripe: "/integrations/stripe.svg",
  WooCommerce: "/integrations/woocommerce.svg",
  Mailchimp: "/integrations/mailchimp.svg",
  Zapier: "/integrations/zapier.svg",
  "Microsoft 365": "/integrations/microsoft-365.svg",
  "Microsoft Teams": "/integrations/microsoft-teams.svg",
  "WhatsApp Business": "/integrations/whatsapp-business.svg",
  PayPal: "/integrations/paypal.svg",
  DocuSign: "/integrations/docusign.png",
  Dropbox: "/integrations/dropbox.com.png",
  "Google Workspace": "/integrations/google.com.png",
  Gmail: "/integrations/gmail.com.png",
  Outlook: "/integrations/outlook.com.png",
  Yoco: "/integrations/yoco.com.png",
  SimplePay: "/integrations/simplepay.co.za.png",
  HubSpot: "/integrations/hubspot.com.png",
  Salesforce: "/integrations/salesforce.png",
  SAP: "/integrations/sap.com.png",
  Oracle: "/integrations/oracle.com.png",
  GitHub: "/integrations/github.com.png",
  Figma: "/integrations/figma.com.png",
  Zoom: "/integrations/zoom.us.png",
  Deputy: "/integrations/deputy.com.png",
  Dext: "/integrations/dext.com.png",
  Hubdoc: "/integrations/hubdoc.com.png",
  "Syft Analytics": "/integrations/syft-analytics.png",
  Fathom: "/integrations/fathomhq.com.png",
  Cin7: "/integrations/cin7.com.png",
  Atlassian: "/integrations/atlassian.com.png",
  Tableau: "/integrations/tableau.com.png",
  Greenhouse: "/integrations/greenhouse.svg",
  Expensify: "/integrations/expensify.svg",
  Square: "/integrations/square.svg",
  "SAP Concur": "/integrations/sap-concur.svg",
  Amazon: "/integrations/amazon.svg",
  TalentLMS: "/integrations/talentlms.png",
  Avalara: "/integrations/avalara.png",
};

export function integrationLogo(name: string): string | null {
  return INTEGRATION_LOGOS[name] ?? null;
}

export function flagPath(countryCode: string) {
  return `/flags/${countryCode.toLowerCase()}.svg`;
}

/** The hero photo. The first of these that exists in /public is used. */
export const HERO_IMAGES = ["/hero.jpg", "/hero.png", "/hero.webp"];
export const HERO_ALT = "The Johannesburg skyline and its highways under a deep blue sky";
/** Tiny blurred copy of public/hero.png, shown while the photo loads. Regenerate if the photo changes. */
export const HERO_BLUR = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAOCAIAAAC6mkspAAAACXBIWXMAAAsSAAALEgHS3X78AAAD0UlEQVQozxXOaVMaBwCA4f3Smcw0piapk1hFRVCQFRZQ9nBxYZddlmvZA1BYELm8OARUQIV6RohWx8ajGDXG6kwTO+n0Lzb9/s48L8BPJcbp0ADCdYDMM5DtMHKd42IXEurGIwPU7DA7N8TO26OVTO0oWGj2u3NDvoKWL8NywxCsaYTKgH+tj68oxSpgtvn8oZnKapWL5SBfSuVM9tKpHkfq5WS8m0qPeBcZeXlpbef6480/T3+nasdYrK4L1kzRbaO8Zc0cxOuXi/vXudYd0GuyD1oYhA0J0fniWiNb2d/cO46V3yn9ywrfspIraviCXix45+qR1ZZlpq6brjuXWue3f908fvv05d/5g7vIr9fBxhWgI/xam6gmRNgT9SVX+ezOdKkVXz8VyidC5cy38ntk8yy4fu4qf3AWT6XqeWD9/4Xlo/vo7m1q/za8eb5z8XDx+A0gphYdsSIlFxZK6/nNJpdckfP12ephonYY3zjJ7l6cXn0+bt9l9y5Xmu13H26q79u/XT2c3D2lts6yWyel3dPvwcPXJ4DPNqT8llzeTdZamfrxbLGeb7zP753n98+zu2fFg4tS87LaPFvdai6Va4ft+6M/Pp1+vG8/fGldPexf/rl9+bDXfjz+/BVA+RguzdKRBU88R06lp8JheWHZFc+LmaKQLknpQqK0GUjmWEnGGW6hsu2VM2QgPlNqBJZqwfwGv7TOZzcC+TpgQmAzbLHZJxmaFN10UPD4OA9CUJKHgTA7L4oYyaoMKOOgLDDmFySccikhlJNCDo9gwckxgjbZ2GGzFYBhkMCMIQYlrUbQAHrdTEqWvAyFT+BvlDrCRlJO1xCExoL+tCzBOD6CWBMRiXJ95xiGpnjRjxCYATYCkE5hAJUBepyY0OmNoxHe5aFtHpaCTGaNfkzkXA4b6qCJhMz73LTBbJzAkEzIERKIXDq4lku6XFadUWXBzMDISLdioAPV9zpRkCXHOAZ14IiHsdgJQyTgjoWcGKa14hoc0+gNfYhFz9pRwUPHwz7JTzMkbJ3QQ9CwyaQHent/HFS/0Gp+ccGDFu1brbbLZ4O8OOi0gSJHqjVdkPFnLfiCJtWpiHNhNhqW3H52Qj+q8HNOjnNjKGSdxGEMBkaHXtNQz4jmVbeik2cQh01nMChYwrIYZmkSg/R9vEM7zU0uJ6cKySiBm+y4alqi7A5HIpVBUFQFQirQqBoBAa3yZV//s87XP/QonvcOdA6BP73pfq4Zfesm9TJPpQLkXNibCQuy4PY7LdYxNeMkFxcWh9XqfpUWhMwUYhwc7B948+o/eEdC9P9tsWMAAAAASUVORK5CYII=";
export const HERO_PLACEHOLDER = "/hero-placeholder.svg";
export const GUIDES_BG = "/guides-bg.jpg";
