# Build prompt: a business software guide in ink and yellow

**How to use this file**

1. Fill in the **Project facts** block in Part 0. Everything else is ready.
2. Copy `Pally-Variable.woff2` and `Pally-Bold.otf` out of `Pally_Complete.zip` (paths in Part 3.2) so you can give them to the builder.
3. Paste everything from Part 0 down into your AI builder (Claude Code, Cursor, v0, Lovable or Bolt).
   If the tool has a small context window, paste Parts 0 to 4 first, then paste one phase from Part 9 at a time.

---

You are building a complete, production ready website from scratch. It is an independent, editorial
guide where businesses find, compare and review business software. It has the same structure, page
layout and behaviour as an existing site I own, but it has a **new name, a new visual identity, new
copy and some new features**. Follow this brief exactly. Where it gives a number, use that number.
Where it is silent, choose the calmer, simpler option.

---

## Part 0. Project facts

All of these live in **`lib/site.ts`**. No other file may hardcode the name, domain, currency, VAT rate,
phone, email or address. Import them.

```
SITE_NAME            [NEW BRAND NAME]
SITE_DOMAIN          [newbrand.co.za]
SITE_TAGLINE         [one line, e.g. "Business software, compared in rand"]
SITE_DESCRIPTION     [two sentences for meta descriptions]
CONTACT_EMAIL        [hello@newbrand.co.za]
CONTACT_PHONE        [+27 ...]
SITE_ADDRESS         { street, locality, region, postalCode, country }
SITE_FOUNDER         [full name]   (also the POPIA information officer)
MARKET               South Africa
SITE_LOCALE          en-ZA         OG_LOCALE en_ZA
CURRENCY             ZAR, written "R", thousands grouped with a space: R1 375
VAT_RATE             0.15
LOCAL CHECKLIST      SARS eFiling, VAT201, EMP201, EMP501, IRP5 / IT3(a), UIF, SDL, ETI, POPIA, BCEA
BANKS                Absa, FNB, Standard Bank, Nedbank, Capitec, TymeBank, Investec, Discovery Bank
CATEGORIES           Accounting, Payroll, HR, CRM, ERP, Project management
SOCIAL_LINKS         { linkedin, x, facebook, youtube }
MIN_PUBLIC_REVIEWS   5
```

If I later change the market, only this block and the local checklist change. Write the code so that is true.

---

## Part 1. What you are building

**One sentence:** an independent register of business software for [MARKET], with prices in the local
currency, checks against local compliance rules, honest rankings and side by side comparisons.

**What the reader can do**

- Browse six categories and every product inside them.
- Open a full product profile: overview, pricing in rand with the VAT basis, features, integrations,
  screenshots, ratings, reviews, alternatives and FAQs.
- Compare any two products on one page, in either order, with a written verdict that names a winner.
- Read buying guides and compliance explainers.
- Write a review, mark reviews helpful, subscribe to a monthly newsletter, contact the team.

**How it makes money:** affiliate commission and paid listing enquiries. Trust is the only asset a
directory has, so: rankings are computed before any commercial relationship is considered, every
commercial link is labelled "Ad", and a disclosure sits next to every commercial button.

**The feel:** a well edited magazine that happens to be a directory. Large confident type, generous
space, a floating pill navigation, rounded panels, hairline rules, near black ink on a light grey page,
and one loud yellow used sparingly so that it always means something. Not a SaaS template. No
gradients across whole sections, no glassy blobs, no stock 3D icons.

**Write all copy fresh.** Do not reuse sentences from any existing website. Example headlines in this
brief show the length and tone; you may use them or write better ones.

---

## Part 2. Tech stack

- **Next.js 16** (latest stable 16.x), App Router, React 19, **TypeScript strict**.
- **Tailwind CSS 4** with tokens declared on `:root` and mapped through `@theme inline` in `app/globals.css`.
- **Supabase** (Postgres, Auth, Storage) through `@supabase/ssr`.
- `radix-ui` primitives, `cmdk` (search palette), `embla-carousel-react` (screenshots), `recharts`
  (rating charts), `sonner` (toasts), `lucide-react` (icons), `class-variance-authority`, `clsx`,
  `tailwind-merge`, `@vercel/analytics`.
- Deploy on Vercel. `proxy.ts` (Next 16's renamed middleware) handles redirects and refreshes the admin session.

**The site must render fully without a database.** Every query in `lib/queries/*` first tries Supabase
and falls back to a bundled dataset in `lib/data/*`, so local development and the first deploy work
before any migration has run.

Folder layout:

```
app/
  (public)/     navbar + footer shell, every public route
  (admin)/      admin shell: login, dashboard, CRUD, inbox, newsletter, settings
  api/          og image, newsletter confirm
  fonts/        Pally-Variable.woff2
  sitemap.ts  robots.ts  not-found.tsx  globals.css  layout.tsx
components/
  ui/           primitives: button, badge, card, input, select, table, overlays, misc
  public/       everything the site renders
  admin/        admin shell and the registry driven form
lib/
  site.ts  types.ts  format.ts  utils.ts  seo.tsx  ranking.ts  faq.ts  affiliate.ts
  reviews-policy.ts  assets.ts  sorting.ts
  data/         bundled dataset (categories, software by category, articles, comparisons, pages)
  queries/      Supabase reads, each with a local fallback
  actions/      server actions: forms, reviews, admin
  admin/        resource registry
supabase/migrations/   0001_schema.sql  0002_triggers.sql  0003_rls.sql
scripts/        seed, create-admin, check-prices, check-affiliate-html
tests/          unit tests
```

---

## Part 3. Design system

### 3.1 Colour

The palette is four colours. Use exactly these values.

| Name | HEX | RGB | CMYK | HSB | Role |
|---|---|---|---|---|---|
| **Ink** | `#131315` | 19, 19, 21 | 10, 10, 0, 92 | 240°, 10%, 8% | All text, primary buttons, active states, dark panels |
| **Signal yellow** | `#FED400` | 254, 212, 0 | 0, 17, 100, 0 | 50°, 100%, 100% | The one accent |
| **Bone** | `#F2F1EF` | 242, 241, 239 | 0, 0, 1, 5 | 40°, 1%, 95% | Soft fills that sit on white: chips, table heads, eyebrow pills |
| **Page** | `#F1F1F1` | 241, 241, 241 | 0, 0, 0, 5 | 0°, 0%, 95% | **The global background of every page** |

Put these tokens on `:root` in `app/globals.css` and map them in `@theme inline`:

```css
:root {
  /* Brand */
  --ink:            #131315;
  --yellow:         #FED400;
  --yellow-hover:   #E8C200;   /* hover on yellow fills, ink on it is 10.7:1 */
  --yellow-wash:    #FFF6CC;   /* pale tint for highlighted rows and the outbound button */
  --bone:           #F2F1EF;

  /* Surfaces */
  --background:     #F1F1F1;   /* body, every page */
  --card:           #FFFFFF;   /* cards, tables, inputs, nav capsules, footer body */
  --muted:          #F2F1EF;   /* soft fills on white */
  --panel:          #131315;   /* dark sections: newsletter, review wall, guides showcase */

  /* Text */
  --foreground:       #131315;
  --muted-foreground: #5C5C61; /* secondary text */
  --on-panel:         #FFFFFF;
  --on-panel-muted:   rgba(255, 255, 255, 0.65);

  /* Lines */
  --border:         #E4E3E0;   /* hairlines inside white cards */
  --border-strong:  #D2D1CD;   /* rules drawn directly on the #F1F1F1 page */
  --input:          #D2D1CD;
  --ring:           #131315;   /* focus ring on light; use --yellow on dark panels */

  /* Semantic */
  --primary: #131315;  --primary-foreground: #FFFFFF;
  --accent:  #FED400;  --accent-foreground:  #131315;
  --destructive: #B42318;      /* errors, price rose, product withdrawn */
  --star: #FED400;

  /* Charts */
  --chart-1: #131315;  --chart-2: #FED400;  --chart-3: #8A8A90;  --chart-4: #C9C8C4;

  --radius: 0.5rem;
}
body { background: var(--background); color: var(--foreground); }
::selection { background: var(--yellow); color: var(--ink); }
```

Also set `viewport.themeColor` to `#F1F1F1`. The site is **light only**. No dark mode toggle. The dark
look comes from fixed ink panels inside the page.

**Measured contrast. Do not change a value without recomputing.**

| Pair | Ratio | Verdict |
|---|---|---|
| Ink on page `#F1F1F1` | 16.4 : 1 | Body text |
| Ink on white | 18.6 : 1 | Body text |
| Ink on yellow | 12.9 : 1 | Text and icons on yellow |
| White on ink | 18.6 : 1 | Text on dark panels |
| Yellow on ink | 12.9 : 1 | Accent words and icons on dark panels |
| Muted `#5C5C61` on page | 5.9 : 1 | Secondary text |
| Muted on white | 6.6 : 1 | Secondary text |
| White 65% on ink | 8.2 : 1 | Secondary text on dark panels |
| **White on yellow** | **1.4 : 1** | **Forbidden** |
| **Yellow on page or white** | **1.3 : 1** | **Forbidden as text, icon, border or focus ring** |

**The yellow rules, absolute**

1. Text on yellow is always ink. Never white.
2. Yellow is never text, an outline or a thin icon on a light surface. It is a **fill** there, and the
   fill always carries ink text or an ink icon.
3. On light surfaces yellow appears only in: the button chip, the footer call to action band, the
   "price checked" stamp, star fills, the "covered" tick in compliance lists, the skip link and text
   selection. That is the whole list.
4. On ink panels yellow may also colour emphasis words in headings, icons and quote marks.
5. `#F2F1EF` and `#F1F1F1` are almost identical. A bone fill placed directly on the page must carry a
   1px `--border-strong` hairline or it disappears. Cards on the page are white, not bone.
6. No other hues. No green, no blue, no orange. The only exception is `--destructive` for errors, and a
   vendor's own brand colour on that vendor's logo ring (see 3.4).

### 3.2 Typography: Pally and Inter Tight

**Pally** carries headings, the wordmark, big statistics, rank numerals, prices on cards, ratings and
button labels. **Inter Tight** carries body copy, labels, form fields, table cells and long articles.

**Pally is self hosted from the Fontshare zip I am giving you** (`Pally_Complete.zip`, by Indian Type
Foundry, ITF Free Font License):

- `Pally_Complete/Fonts/WEB/fonts/Pally-Variable.woff2` → `app/fonts/Pally-Variable.woff2`
  (variable, `wght` axis 400 to 700, so 400, 500, 600 and 700 all work from one 35 KB file)
- `Pally_Complete/Fonts/OTF/Pally-Bold.otf` → `app/api/og/Pally-Bold.otf` (for the OG image route,
  because `next/og` cannot read woff2)

**Licence rules:** self hosting on our own website is allowed. Do **not** subset, convert, rename or
edit the font files, and do not run them through any font tool. Use them exactly as shipped. The
repository must stay private, because the licence forbids redistributing the files.

**Inter Tight** comes from `next/font/google`.

```ts
// app/layout.tsx
import localFont from "next/font/local";
import { Inter_Tight } from "next/font/google";

const pally = localFont({
  src: "./fonts/Pally-Variable.woff2",
  variable: "--font-pally",
  weight: "400 700",
  display: "swap",
});

const interTight = Inter_Tight({
  subsets: ["latin"],
  variable: "--font-inter-tight",
  display: "swap",
});

// <html lang={SITE_LOCALE} className={`${pally.variable} ${interTight.variable} antialiased`}>
```

```css
@theme inline {
  --font-sans:    var(--font-inter-tight), ui-sans-serif, system-ui, sans-serif;
  --font-heading: var(--font-pally), var(--font-inter-tight), sans-serif;
}
h1, h2, h3, h4, h5, h6 { font-family: var(--font-heading); }
```

Use `font-heading` explicitly on non heading elements that should be Pally (stats, prices, button labels).

**Type scale**

| Use | Font | Size, mobile → desktop | Weight | Line height | Tracking |
|---|---|---|---|---|---|
| Home hero H1 | Pally | 40 → 52 → 56 px | 700 | 1.0 | -0.035em |
| Home section title | Pally | 32 → 40 px | 400, closing words 700 | 1.04 | -0.03em |
| Inner page H1 | Pally | 36 → 48 px | 700 | 1.12 | -0.025em |
| Centred section H2 | Pally | 30 → 42 px | 500 | 1.18 | -0.02em |
| Card title | Pally | 16 to 18 px | 700 | 1.25 | -0.01em |
| Big statistic | Pally | 30 → 36 px | 700 | 1.0 | -0.02em |
| Rank numeral | Pally | 72 → 96 px | 700 | 0.9 | -0.05em |
| Button label | Pally | 11 to 12.5 px | 600, UPPERCASE | 1.0 | +0.055em |
| Footer wordmark | Pally | `clamp(3.5rem, 17.5vw, 15rem)` | 700 | 1.0 | -0.055em |
| Body | Inter Tight | 16 px | 400 | 1.7 | 0 |
| Lead paragraph | Inter Tight | 17 → 18 px | 400 | 1.6 | 0 |
| Article body | Inter Tight | 17.2 px | 400 | 1.85 | 0 |
| Meta, captions | Inter Tight | 14 px | 400 to 500 | 1.5 | 0 |
| Eyebrow / micro label | Inter Tight | 11 px | 700, UPPERCASE | 1.0 | +0.14em |
| Prices and numbers in tables | Inter Tight | 15 px | 600, `tabular-nums` | 1.4 | 0 |

Use `text-balance` on headings and `text-pretty` on paragraphs.

### 3.3 Layout, radius, depth

- `.container-site`: `max-width: 1440px`, centred, side padding 16 px, 32 px from 768 px, 48 px from 1024 px.
- `.full-bleed`: `width: 100vw; margin-inline: calc(50% - 50vw)`. `body` gets `overflow-x: clip`
  (never `hidden`, it breaks `position: sticky`).
- Vertical rhythm between home sections: 64 px mobile, 96 px desktop.
- `<main>` has `padding-top` of 96 px (112 px from 640 px) to clear the floating navbar.
- **Radius:** pills `9999px`; inputs 14 px; chips inside buttons 10 to 12 px; cards 24 px; trays 28 px;
  hero photo 24 px mobile, 32 px desktop; big panels 40 px.
- **Card** (`.card-modern`): white, 1px `--border`, 24 px radius, shadow
  `0 1px 2px rgba(19,19,21,.04), 0 12px 32px -16px rgba(19,19,21,.14)`. Hover variant lifts 4 px and
  deepens the shadow to `0 24px 48px -20px rgba(19,19,21,.22)`.
- **Tray** (`.tray`): a recessed holder for a row of cards. Background ink at 4%, padding 8 px,
  radius 28 px. Cards inside (`.tray-card`) have radius 22 px.
- Phone first. Every page works at 375 px with no horizontal scroll and 16 px side gutters.

### 3.4 Core components

**`CtaButton`: the only call to action on the site.** Every button that moves the reader forward is
this component, so they are identical, not merely similar.

- A pill. Uppercase Pally 600 label on the left. On the right, a **yellow chip** (rounded square,
  not a circle) holding an ink arrow. The chip is a flex sibling of the label, never absolutely
  positioned, so it can never overlap text.
- Variants:
  - `default`: ink pill, white label, yellow chip with ink arrow.
  - `soft`: white pill, 1px `--border-strong` inset ring, ink label, yellow chip.
  - `onDark`: white pill, ink label, yellow chip. For ink panels.
  - `tint`: the **outbound / commercial** button. `--yellow-wash` fill, ink label, 1px ink 14% ring,
    transparent chip with an ink up right arrow, and a narrow band of light that sweeps across once
    on hover. It must look clearly different from `default`, because "our review" and "the vendor's
    site" are different destinations.
  - `plain` modifier: sentence case label, weight 500, circular chip. Used in the navbar.
- Sizes: `xs` 32 px tall, `sm` 40 px, `default` 48 px, `lg` 56 px; chip 16 / 32 / 36 / 44 px.
- Props: `href` or button, `variant`, `size`, `arrow` (hide chip for Save), `icon: "forward" | "external"`,
  `pending` (spinner replaces the arrow and the button is disabled).
- Motion: hover lifts 1 px and deepens the shadow, the chip nudges 2 px right; active scales to 0.985.

**`SectionIntro`** (home page sections): micro label eyebrow; a big heading set in two weights, the
closing words bold (for example: "The comparisons buyers **actually run**"); a muted subtitle; the
CTA on the right of the same row, aligned to the bottom; then a full width 1px `--border-strong` rule.

**`SectionHeader`** (inner pages): centred. A bone eyebrow pill with a small lucide icon and text,
then the heading, then a muted subtitle, max width 576 px. `align="left"` option.

**Other primitives**

- **Badge:** bone pill, ink text, 12 px, 1px hairline when on the page.
- **"Ad" label:** a tiny ink pill with yellow "Ad" text. Every affiliate link shows it.
- **Price checked stamp:** yellow pill, ink text, "Price checked 1 Jul 2026". If the price has never
  been checked: bone pill, muted text, "Price not yet checked". On this site yellow on a stamp means
  "a human checked this on a date".
- **Stars:** five stars, yellow fill with a 1 px ink stroke, empty stars stroke only in `#C9C8C4`.
  The number ("4.6") is always printed beside them.
- **Rating dial:** SVG ring, track `--border`, value arc ink, number in Pally 700 in the centre,
  sweeps in on load.
- **Compliance list:** covered = yellow circle with an ink tick; gap = outlined circle with a muted
  cross and the word "Gap". Gaps are where the decision is usually made, so they must be visible.
- **Inputs and selects:** 48 px tall, white, 1px `--input`, radius 14 px, 2 px ink focus ring.
- **Tables:** white body, bone header row, hairline rows, sticky first column on wide tables.
- **FAQ accordion:** hairline separated, plus icon that rotates to a cross.
- **Category icon tile:** 40 px bone square with a lucide icon; turns yellow on hover.
- **Software logo:** the real vendor logo inside a ring tinted with the vendor's own brand colour.
  That ring is the only place a vendor colour appears; the rest of the page wears our palette. If we
  have no logo, show a monogram tile: ink square, yellow initial in Pally 700. Never invent a logo.
- **Site mark** (until a real logo is supplied): a 32 px yellow rounded square (radius 10 px) with the
  brand initial in ink Pally 700, beside the wordmark in Pally 700, tracking -0.02em.

### 3.5 Motion

- Sections fade up 28 px as they enter, CSS only: `animation-timeline: view()`,
  `animation-range: entry 0% entry 42%`, inside `@supports` and `prefers-reduced-motion: no-preference`.
- Rating bars fill from zero, the dial sweeps, cards lift on hover, the navbar hides on scroll down.
- Marquee rows hold their content twice and travel exactly half their width, so there is no seam.
  Hover or keyboard focus pauses a row.
- `prefers-reduced-motion: reduce` flattens every animation and transition. Marquees stop and become
  rows the reader scrolls sideways by hand.

### 3.6 Accessibility

- A "Skip to content" link, yellow with ink text, hidden until focused.
- A visible focus ring on everything: 2 px ink with 2 px offset on light, 2 px yellow on ink panels.
- Every interactive element reachable by keyboard; the search palette opens with Ctrl K or Cmd K.
- Real alt text for content images, empty alt for decorative ones, `aria-label` on icon buttons,
  `aria-current="page"` on the active nav link, landmarks and `aria-labelledby` on every section.
- Target Lighthouse accessibility of 95 or more on every page type.

---

## Part 4. The site shell

### 4.1 Navbar: floating capsules, no bar

The header is fixed at the top with **no background bar**. Every control is its own floating pill,
so the page shows through the gaps.

- **Left:** the site mark and wordmark in a solid white capsule, 48 px tall.
- **Centre:** five nav links as separate pills, 44 px tall: Software, Categories, Compare, Guides,
  About. Inactive: white at 85% with `backdrop-blur-xl` and a 1px `--border-strong` ring. Active: ink
  fill, white text. From 1280 px the group is dead centre of the bar; between 1024 and 1280 px it
  stays in the flow; below 1024 px it moves into the mobile menu.
- **Right:** a circular search button (opens the command palette), a `soft plain` CtaButton
  "List your software" (hidden below 768 px), and a menu button below 1024 px.
- Scrolling down past 120 px slides the header up out of view; scrolling up brings it back and closes
  the mobile menu.
- **Mobile menu:** a white panel with 28 px radius drops below the capsules: the links as full width
  pills (active one in ink) and a full width CtaButton at the bottom.

### 4.2 Search palette

`cmdk` inside a dialog: white, 24 px radius, grouped results for Software, Categories, Comparisons and
Guides, built from a search index the public layout loads on the server. Keyboard first. A full
`/search` page exists for long result lists.

### 4.3 Footer: three bands

1. **Yellow call to action band**, full bleed, `#FED400` background, ink text. Centred on mobile, one
   row from 1024 px: a heading in two weights (for example "Still deciding? **Talk to us**") and two
   inline underlined links, "Get in touch" and "List your software". This is the loudest yellow on the
   site; nothing else gets a band this size.
2. **Body**, white. Left column (max 320 px): the site mark, tagline, a heading with the country flag
   and locality, then the address, phone and email. Right: three link columns with micro label titles:
   - Browse: All software, Categories, Compare products, Buying guides, Search
   - Company: About, Contact, How we rate, Newsletter, List your software
   - Legal: Terms of use, Privacy policy, Cookie policy, Affiliate disclosure, PAIA manual, Accessibility
   
   Then a hairline and the copyright row: "© {year} {SITE_NAME}. {SITE_TAGLINE}." Social icons for
   LinkedIn, X, Facebook and YouTube as inline SVG glyphs.
3. **The giant wordmark:** `SITE_NAME` in Pally 700 at `clamp(3.5rem, 17.5vw, 15rem)`, ink,
   tracking -0.055em, `aria-hidden`, clipped by the bottom edge of the footer with a bottom margin of
   `-0.29em` so the crop stays constant as it scales.

### 4.4 Other shell pieces

- `sonner` toasts bottom right: white, 16 px radius, hairline border.
- A designed 404 page using `SectionHeader`, a search bar and links to the main sections.
- Loading skeletons for the directory, profile and guides routes in bone and white.

---

## Part 5. Pages, section by section

### 5.1 Home `/`

Revalidate hourly. Sections in this exact order:

**1. Hero**

- A full width photograph, aspect ratio 16:10 on mobile and 16:7 from 640 px, radius 24 / 32 px,
  `object-cover`, `priority`, blur placeholder. **No text sits on it** and it has no darkening wash.
  The image file is `public/hero.jpg`, which I will supply. Until then use a neutral placeholder.
- Under it, a two column grid (`1.3fr / 1fr`, bottom aligned, stacks on mobile):
  - Left: a small outlined pill with the country flag and "Software for South African business";
    the H1 on two lines with an authored line break (example: "Every tool compared, / every price in
    rand."); a muted 18 px subtitle naming the six categories and the local compliance rules.
  - Right: a small muted label "Reviewed here", then a wrapping row of five product logos with their
    names, at 70% opacity rising to 100% on hover. Only products we hold a real logo for, one per
    vendor, ordered by review count. These are products we review, not partners, and a screen reader
    sentence says so.
- Centred below, max 576 px: a large pill search bar, then a row of "Popular" category chips (outline
  pills with a small icon; hover fills ink with white text).
- Three statistics on hairline rules, not in a card: a top border, three columns divided by vertical
  hairlines (stacked with horizontal hairlines on mobile). Pally 700 numbers, muted labels: "Products
  reviewed", "Categories covered", and "Reader reviews" only once there are at least
  `MIN_PUBLIC_REVIEWS`, otherwise "Guides published".

**2. Category explorer**

- `SectionHeader`, eyebrow "Browse by category", heading like "Start from the work you need done".
- Client side tabs for the six categories (no navigation on switch; ship all six groups, up to six
  products each). Active tab is an ink pill.
- Each product card: logo, name, one line description, rating or "No reviews yet", starting price with
  its VAT basis, and two buttons: **Read review** (`default`, stays on site) and **Visit site** (`tint`,
  outbound, "Ad" label when it is an affiliate link). The card title link stretches over the card,
  so both buttons sit above that overlay with a higher z-index.
- Affiliate disclosure note under the grid.

**3. Head to head comparisons**

- `SectionIntro`: eyebrow "Head to head", title "Two products, one page, **a clear winner**", CTA
  "Build a comparison".
- Two column grid of four comparison cards. Each card: two identical panels side by side separated by
  a 1 px hairline (use `gap-px` over the border colour), each with logo, name and rating. A small ink
  "Higher rated" tag appears only when both have public ratings and the gap is real. Both panels keep
  the same height whether or not the tag renders. Under the panels, the verdict trimmed to 150
  characters and one button through to the full comparison.

**4. Top rated** (render only when at least one product has `MIN_PUBLIC_REVIEWS` reviews)

- `SectionIntro`: eyebrow "Ranked by weighted average", title "The highest rated, **fairly ranked**",
  a subtitle explaining that many reviews at 4.4 outrank a handful at 4.8, CTA "See the full ranking".
- A tray holding three ranked cards. The **rank numeral** is the largest thing in each card (Pally 700,
  72 to 96 px, ink). Then logo, name, rating and a sentiment strip built from the real star distribution.
- Disclosure note if any card carries an affiliate link.

**5. Newsletter**

- A rounded 40 px **ink panel**, two columns from 1024 px.
- Left: a white heading with the closing words in yellow (for example "The monthly brief, **nothing
  more**"), a white 65% subtitle, and three promises each with a yellow circle holding an ink tick:
  one email a month; consent recorded as POPIA requires; one click unsubscribe.
- Right: the newsletter form (email, optional interest checkboxes for the six categories, a consent
  checkbox) with an `onDark` CtaButton. Double opt in through `/api/newsletter/confirm`.

**6. Review wall** (render only when published reviews reach `MIN_PUBLIC_REVIEWS`)

- A full bleed ink panel with 40 px curved ends that breaks out of the container.
- A centred heading in white with a yellow emphasis word, a subtitle with the live totals.
- Three marquee rows travelling in alternating directions at different speeds, with both ends
  feathered by a mask. Cards: white at 6% on ink, 1 px white 10% border, radius 24 px, a big yellow
  quote mark, the review title in white Pally 700, two lines of body in white 70%, stars, the product
  logo and name, reviewer first name, company size and flag. Reviews are dealt round robin from twelve
  products so each row carries different logos.

**7. Freshly checked**

- `SectionIntro`: eyebrow "Freshly checked", title "Prices we **confirmed this quarter**", CTA
  "Everything we track".
- Three cards. The **price checked stamp leads each card** (top left), then logo, name, the price with
  VAT basis and a short note of what changed.

**8. Guides showcase**

- A full bleed ink panel with 40 px curved ends, like the review wall, so the two dark panels read as a pair.
- Background: `public/guides-bg.jpg` if I supply one, under a veil that is darkest at the top (to hold
  the title) and bottom (to hold the cards), lightest in the middle. With no image, plain ink with one
  soft yellow radial glow at the top centre.
- The title centred in the upper third in white, then a row of article cards on the dark floor: category
  micro label, white title, reading time, arrow.

### 5.2 Software directory `/software`

- `SectionHeader` with the live product count.
- Left sidebar from 1024 px (a sheet on mobile): **Category** (radio, "All categories"), **Minimum
  rating** (Any, 4.5+, 4.0+, 3.5+), **Pricing** (Free version, Free trial, Paid only), **Best for**
  (company size: Sole trader, 2 to 10, 11 to 50, 51 to 200, 201 to 500, 500 plus).
- Sort select: Name A to Z, Most reviewed, Highest rated, Recently updated, Lowest starting price.
  The two rating sorts appear only once products have public ratings; until then the default is A to Z.
- All filters live in the URL query string so results are shareable and the back button works.
- Results as wide list cards: logo, name, category, tagline, rating or "No reviews yet", starting price
  with VAT basis, free trial / free version badges, Read review and Visit site buttons.
- `?category=` pre filters. An empty state with a reset button.

### 5.3 Categories `/categories` and `/category/[slug]`

- Index: `SectionIntro` then six category panels (icon tile, name, description, product count, arrow).
- Category page: `SectionHeader` ("The best {category}"), the ranked product list for that category
  (ranked within the category), then a buying guide section with the category's long editorial intro
  in prose, then FAQs.

### 5.4 Product profile `/software/[slug]`

The most important page. Statically generated for every product.

- **Header:** logo in its brand ring, H1 product name, tagline, category link, star rating with the
  count, or "No reviews yet" with an invitation. CTAs: **Write a review** (`lg`, default) and **Visit
  vendor** (`tint`, outbound, affiliate aware). A small "Featured" badge only if set.
- **Section navigation:** a sticky left rail from 1024 px and a collapsible sticky bar on mobile showing
  the current section, driven by a scroll spy. Sections use `scroll-margin-top: 8rem`.
- **Sections, in order:**
  1. **Overview:** full description in prose; a vendor spec sheet (vendor, founded, support types,
     languages, countries, bank feeds); the local compliance list with gaps marked.
  2. **Pricing:** plan cards (name, price with period and VAT basis, user limit, features, "Most
     popular" flag), a price note, the full pricing table, and the price checked stamp.
  3. **Features:** top features as a highlighted grid, the full feature checklist in two columns,
     integrations with logos where we hold them.
  4. **Screenshots:** an embla carousel. Only rendered when screenshots exist.
  5. **Ratings:** only with `MIN_PUBLIC_REVIEWS` or more: the overall dial, star distribution bars,
     a bar chart of the four dimensions (ease of use, value for money, customer service,
     functionality), and a company size chart. Charts use ink and yellow only (yellow bars get a
     1 px ink outline).
  6. **Compare:** this product against its top alternative on every rating dimension, and a button to
     the full comparison page.
  7. **Reviews:** the three most recent with a link to all, or an empty state inviting the first review.
  8. **Alternatives:** cards for the closest alternatives, with a link to the alternatives page.
  9. **FAQs:** generated from the product's own data (see 6.5), in the accordion.
  10. **Disclosure:** the affiliate disclosure note when the page carries an affiliate link.

### 5.5 Reviews

- `/software/[slug]/reviews`: rating summary, filters (star rating, company size), sort (Most recent,
  Most helpful, Highest rated, Lowest rated), review cards with a "Helpful" button (one vote per
  browser), pagination.
- `/software/[slug]/reviews/new`: overall rating plus the four dimensions (star inputs that work with a
  keyboard), title, what you like, what you dislike, company size, how long you have used it, role,
  country, email (never shown), consent. Submissions are saved as **hidden** and published only after
  moderation in the admin. Server side validation and a honeypot field.
- **Review card:** stars, title, date, pros and cons with small icons, reviewer first name, role,
  company size, usage time and country flag, helpful count.

### 5.6 Alternatives `/software/[slug]/alternatives`

`SectionHeader` "Alternatives to {product}", editorially chosen alternatives if set (otherwise category
peers), each as a card with why it is an alternative, then a side by side against the top alternative.

### 5.7 Compare `/compare` and `/compare/[pair]`

- Index: a selector with two searchable comboboxes that routes to `/compare/a-vs-b`, then the written
  comparisons as cards.
- Pair page: **both orderings resolve** (`a-vs-b` and `b-vs-a` render the same page with the same
  canonical URL). A pair with no written verdict still renders a useful page from the data.
- Sections: hero "{A} vs {B}" with both logos and CTAs; side by side ratings; **local compliance**
  matrix with gaps marked; **pricing compared** with VAT basis on each; the **full feature matrix**
  with sticky headers and "has it / does not" marks; **the verdict**, which names a winner and says who
  should pick the other one.

### 5.8 Guides `/blog` and `/blog/[slug]`

- Index: `SectionHeader`, a featured article, then a grid with category filter chips. Cards: cover
  image, category micro label, title, excerpt, author, date, reading time.
- Article: category, H1, author with photo, published and updated dates, reading time, cover image,
  article prose (the first paragraph larger as a lead), a table of contents from 1024 px, related
  products mentioned, related articles, newsletter prompt.

### 5.9 About, Contact, Newsletter, Search, Legal

- **About:** story, "Three things we will not trade" principles cards, the rating method explained,
  the local compliance bar, named people with photos and roles, a contact prompt.
- **Contact:** a form with name, email, subject (General, Correction, List your software, Vendor
  response, Advertising), message and consent. `?subject=listing` preselects the listing subject.
  Saved to the database and shown in the admin inbox.
- **Newsletter** page and a one click **unsubscribe** page.
- **Search:** results grouped by software, categories, comparisons and guides.
- **Legal**, all from one `LegalPage` template with its own prose style (bulleted lists with small
  yellow dots outlined in ink, numbered lists, tables with bone header cells): Terms of use, Privacy
  policy, Cookie policy, Affiliate disclosure, Editorial policy ("How we rate"), PAIA manual,
  Accessibility statement. Each shows a "Last updated" date.

---

## Part 6. Data, backend and admin

### 6.1 Types and dataset

Types in `lib/types.ts`: `Category`, `Software` (name, slug, tagline, short and full description, logo,
screenshots, category, starting price, currency, billing period, `price_vat_inclusive`, free trial,
free version, demo, pricing plans, pricing note, `price_checked_at`, features, top features,
integrations, brand colour, vendor details, support types, countries, languages, `compliance`,
`bank_feeds`, best for size and role, the five rating fields and review count, featured, status),
`PricingPlan`, `Review`, `Article`, `Comparison`, `Page`, `NewsletterSubscriber`, `ContactMessage`.

Seed the bundled dataset with real products and real public information. Products start with **zero
reviews and no ratings**. Any price you are not sure of gets `price_checked_at: null` so the page says
"Price not yet checked".

### 6.2 Supabase

- `0001_schema.sql`: tables for every type, indexes, a full text search column on software and articles.
- `0002_triggers.sql`: recompute the five rating averages and review count from **published reviews
  only**; keep category product counts; record price history when a price changes; an audit log of
  admin writes; helpful vote counting.
- `0003_rls.sql`: row level security on every table. The public reads only published rows and may only
  insert reviews, newsletter sign ups and contact messages. Only the admin writes the rest. Storage
  buckets for logos, screenshots and article images.
- Scripts: `npm run seed`, `npm run create-admin` (reads `ADMIN_EMAIL` and `ADMIN_PASSWORD` from
  `.env.local`), `npm run check-prices` (lists products not checked in 90 days).
- `.env.example` lists every variable with a comment. Never commit `.env.local`.

### 6.3 Ratings and ranking

- **Aggregate ratings are never written by application code.** Only the database trigger writes them.
  The admin has no field for them.
- **Never generate, invent or seed reviews or ratings.** Not for demos, not as placeholders.
- A product shows a rating, a count and a place in any ranking only with at least `MIN_PUBLIC_REVIEWS`
  published reviews. Below that it says "No reviews yet".
- `lib/ranking.ts`: a **Bayesian weighted average**. Blend each product's average towards the mean of
  the set being ranked, weighted by review count, using the median review count as the prior weight.
  Compute priors from the set, so a category page ranks within its category.

### 6.4 Prices

- Always show the basis: `R240 /mo incl VAT`, `R1 375 /mo excl VAT`.
- `null` price shows "Quoted". `0` shows "Free". They are different things.
- Products billed in USD, EUR or GBP show the foreign price and a rand estimate at a stated rate and date.
- Format with `Intl.NumberFormat("en-ZA")` so thousands are grouped with a space.

### 6.5 Generated FAQs

`lib/faq.ts` builds each product's FAQs from its own record: what it costs with the VAT basis, free
trial and free version, local compliance coverage with the gaps named, bank feeds, integrations, what
reviewers say (only with enough reviews) and who it suits. They can never drift from the page data.

### 6.6 Affiliate links: one file, one component

- `lib/affiliate.ts` holds every affiliate tracking link exactly as issued, the products in each
  programme and the placement ids. No affiliate URL may appear anywhere else in the codebase.
- `VisitButton` (`components/public/affiliate-link.tsx`) is the only component that renders one. Each
  affiliate `<a>` carries `rel="sponsored noopener"` (**never** `noreferrer`),
  `referrerpolicy="strict-origin-when-cross-origin"`, `target="_blank"`, the visible "Ad" label, an
  accessible name starting "Ad:", and a `subId` naming the surface and product (for example
  `product-pricing-{slug}`). No redirect of ours in front of it.
- Vendors outside a programme get a plain `rel="nofollow noopener"` link to their own site.
- `AffiliateDisclosureNote` sits next to every commercial button group.
- Unit tests check the attributes, and a post build script scans every page's HTML and fails the build
  on a bad affiliate link.

### 6.7 SEO

- Metadata on every page with a title template `%s | {SITE_NAME}`, description, canonical URL,
  Open Graph and Twitter cards.
- `/api/og`: dynamic OG images, 1200 × 630, ink background, white Pally Bold title, a yellow bar and
  the wordmark.
- JSON-LD: Organization and WebSite with SearchAction on the home page; SoftwareApplication on
  profiles (AggregateRating only with `MIN_PUBLIC_REVIEWS` reviews); Article on guides; FAQPage;
  BreadcrumbList on every inner page.
- `sitemap.ts` lists every published entity; `robots.ts` blocks `/admin`.
- `proxy.ts` holds a redirects table.

### 6.8 Admin `/admin`

- Supabase email login for a single administrator. Every admin route checks the session on the server.
- Shell: an ink sidebar with white links; the active link has a 3 px yellow bar on the left.
- Dashboard: counts, reviews waiting for moderation, unhandled messages, prices not checked in 90 days.
- **Generic CRUD through a resource registry** (`lib/admin/resources.ts`): one field map per table drives
  both the form and the save action, so a field outside the whitelist can never be written. Resources:
  software, categories, articles, comparisons, pages, reviews (publish / hide).
- Contact inbox with a "handled" toggle, newsletter list with CSV export, site settings.

---

## Part 7. New in this build

Features the original site did not have. Build them after everything else works.

1. **Shortlist.** A "Shortlist" toggle on every product card and profile. Up to four products, saved
   in `localStorage` (wrapped in try/catch). A floating ink bar at the bottom of the screen shows the
   logos and a "Compare shortlist" button: two products go to `/compare/a-vs-b`, three or four go to a
   new `/compare/shortlist?ids=` matrix page.
2. **Cost calculator** on every profile's Pricing section: a team size slider and a monthly / annual
   switch, giving the total in rand with the VAT basis, and for foreign currency products the rand
   estimate with the rate date.
3. **"Which one fits?" finder** at `/finder`: four questions (category, team size, monthly budget,
   must have compliance items) that filter and rank the dataset deterministically and show the top
   three with reasons. No AI, no invented scores.
4. **Price history** on each profile: a small timeline of price changes recorded by the database trigger,
   with the date each was checked.

---

## Part 8. Copy rules

- State numbers, not adjectives: "39 products", never "many products".
- Comparisons name a winner.
- Use the local terms when they are the right terms: VAT201, EMP201, EMP501, IRP5, e@syFile, SARS,
  POPIA, BCEA, CIPC.
- No em dashes and no hyphen punctuation in published copy. Rewrite the sentence instead.
- Banned words: seamless, empower, unlock, elevate, game changer, solution (meaning software),
  journey, leverage (as a verb), cutting edge, trusted by thousands, in today's fast paced world.
- Reviews are described as moderated, never as "verified".
- Button labels are short verbs: Read review, Visit site, Compare, Write a review, Subscribe.

---

## Part 9. Build order

Work in these phases. **After each phase, stop, run the site, and show me screenshots at 375 px and
1440 px before continuing.**

1. **Foundation:** Next.js project, `lib/site.ts`, fonts (Part 3.2), tokens and global CSS (3.1 to
   3.5), UI primitives, `CtaButton`, `SectionIntro`, `SectionHeader`, the navbar, footer, search
   palette and 404.
2. **Data layer:** types, the bundled dataset, query functions with local fallbacks, ranking, formatting.
3. **Home page** (5.1), every section in order.
4. **Directory and categories** (5.2, 5.3).
5. **Product profile, reviews and alternatives** (5.4 to 5.6).
6. **Compare** (5.7).
7. **Guides, about, contact, newsletter, search, legal** (5.8, 5.9).
8. **SEO and affiliate system** (6.6, 6.7) with tests.
9. **Supabase and admin** (6.2, 6.8), seed and admin scripts.
10. **New features** (Part 7).
11. **Final check** against Part 10.

---

## Part 10. Definition of done

- [ ] `body` computes to `background-color: rgb(241, 241, 241)` on every page.
- [ ] DevTools shows Pally on every heading, stat, price and button label, and Inter Tight on body text.
- [ ] No white text on yellow anywhere; no yellow text, border or focus ring on a light surface.
- [ ] No colour outside the palette except `--destructive` and vendor logo rings.
- [ ] Every page works at 375 px with no horizontal scroll, and at 1440 px.
- [ ] Keyboard reaches everything with a visible focus ring; skip link works; reduced motion respected.
- [ ] Lighthouse accessibility 95+ and performance 90+ on home, directory, profile and article.
- [ ] Site runs with no database configured.
- [ ] No generated reviews or ratings exist; ratings appear only from `MIN_PUBLIC_REVIEWS` real reviews.
- [ ] Every price shows its VAT basis; null is "Quoted", zero is "Free".
- [ ] Every affiliate link has `sponsored`, no `noreferrer`, the referrer policy, an "Ad" label and a
      disclosure nearby; the post build check passes.
- [ ] JSON-LD validates; the sitemap lists every published page; `/admin` is not indexed.
- [ ] Pally font files are unmodified copies from the zip and the repository is private.
- [ ] `npm run lint`, `npm test` and `npm run build` all pass with zero errors.
