-- Editorial reviews, priced add ons, price sources and an unknown VAT flag on software.
-- Editorial reviews never carry a score: ratings are still written only by the trigger in 0002.

alter table public.software
  add column if not exists price_vat_unknown boolean not null default false,
  add column if not exists pricing_addons jsonb not null default '[]'::jsonb,
  add column if not exists pricing_sources jsonb not null default '[]'::jsonb,
  add column if not exists review jsonb;

comment on column public.software.review is 'Editorial review: verdict, buy_if, skip_if, pros, cons, sections, reviewed_at. No scores.';
comment on column public.software.pricing_sources is 'Where each price came from: label, url, checked_at.';
