# Toolveld

An independent register of business software for South Africa. Prices in rand with the VAT
basis, checks against SARS, POPIA and BCEA rules, honest rankings and side by side comparisons.

*Veld* is the South African word for open country. Toolveld lays every tool out in the open.

## Run it

```bash
npm install
npm run dev        # http://localhost:3000
```

The site runs without a database. Product data comes from the bundled dataset in `lib/data`.
Email runs on Resend (`lib/email`): the contact form and new reviews are emailed to
`CONTACT_INBOX`, and newsletter sign ups use a signed double opt in link and are saved in Resend
Contacts. See `.env.example` for the variables.

| Command | What it does |
| --- | --- |
| `npm run dev` | Development server |
| `npm run build` | Production build, then `check-affiliate-html` scans every page |
| `npm run lint` | ESLint |
| `npm test` | Unit tests (formatting, ranking, affiliate attributes, data and copy rules) |
| `npm run seed` | Loads the bundled dataset into Supabase. Never seeds reviews or ratings |
| `npm run create-admin` | Creates the single administrator from `.env.local` |
| `npm run check-prices` | Lists products whose price was not checked in 90 days |

## Before launch: facts only you can supply

All brand facts live in `lib/site.ts`. Nothing else hardcodes them.

- `SITE_NAME`, `SITE_DOMAIN`: currently Toolveld and toolveld.co.za. Register the domain before launch.
- `CONTACT_PHONE`, `SITE_ADDRESS.street`: empty, so they are not shown. Fill them in when real.
- `SITE_FOUNDER`: also the POPIA information officer named in the privacy policy and PAIA manual.
- `COMPANY_REGISTRATION`: your CIPC number, shown in the legal pages once set.
- `SOCIAL_LINKS`: only links that are filled in are rendered.
- `TEAM`: real people with their consent. The About page hides the people section while it is empty.
- `FX_RATES` and `FX_RATE_DATE`: the rand estimate shown beside dollar prices.
- `public/hero.jpg`: the hero photo. Until it exists a Table Mountain illustration is used.
- `public/guides-bg.jpg`: optional background for the guides panel.

## Honesty rules the code enforces

- **No invented reviews or ratings.** The dataset ships every product with zero reviews. A test fails if that changes.
- **Ratings only from 5 published reviews** (`MIN_PUBLIC_REVIEWS`). Below that a product says "No reviews yet".
- **Only the database writes ratings.** A trigger recomputes them from published reviews, and a guard trigger reverts any other write. The admin form has no rating fields.
- **Prices always show the VAT basis.** `null` with a quote model shows "Quoted", `0` shows "Free".
- **Checked prices carry a date.** 8 prices were checked on the vendors' own pages on 16 Nov 2026 (Xero, Zoho Books, HubSpot, Freshsales, Asana, monday.com, ClickUp, Trello). Every other price shows "Price not yet checked" until someone checks it.
- **Affiliate links** live only in `lib/affiliate.ts` and render only through `VisitButton`. There are no programmes yet, so every vendor link is a plain `nofollow` link and the disclosure says so.
- **Logos are real vendor logos or an ink monogram.** QuickEasy and PaySpace use monograms because the supplied files were not their real marks.
- **Copy rules** (no dashes, banned words) are checked by `tests/data.test.ts`.

## Supabase

1. Create a project and run `supabase/migrations/0001_schema.sql`, `0002_triggers.sql`, `0003_rls.sql` in order.
2. Copy `.env.example` to `.env.local` and fill in the keys.
3. `npm run seed`, then `npm run create-admin`.
4. Sign in at `/admin/login`.

Newsletter confirmation emails are sent through Resend when `RESEND_API_KEY` and `EMAIL_FROM`
are set. Without them, sign ups are stored and the reader is told a confirmation link will follow.

## Fonts

Pally (Indian Type Foundry, ITF Free Font License) is self hosted from `app/fonts/Pally-Variable.woff2`,
with `app/api/og/Pally-Bold.otf` for the share images. The files are unmodified copies from
`Pally_Complete.zip`. The licence forbids redistributing them, so keep this repository private.
