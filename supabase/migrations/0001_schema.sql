-- Toolveld schema. Tables for every type in lib/types.ts, indexes and full text search.

create extension if not exists pgcrypto;

-- Admins: the single administrator is added by `npm run create-admin`.
create table if not exists public.admins (
  user_id uuid primary key references auth.users (id) on delete cascade,
  created_at timestamptz not null default now()
);

create table if not exists public.categories (
  slug text primary key,
  name text not null,
  plural_label text not null,
  description text not null default '',
  long_intro text[] not null default '{}',
  icon text not null default 'calculator',
  compliance_focus text[] not null default '{}',
  faqs jsonb not null default '[]'::jsonb,
  sort integer not null default 0,
  product_count integer not null default 0,
  updated_at timestamptz not null default now()
);

create table if not exists public.software (
  id text primary key,
  slug text not null unique,
  name text not null,
  tagline text not null default '',
  short_description text not null default '',
  description text[] not null default '{}',
  logo text,
  brand_color text,
  website text not null,
  screenshots jsonb not null default '[]'::jsonb,
  category text not null references public.categories (slug) on update cascade,
  deployment text not null default 'cloud' check (deployment in ('cloud', 'desktop', 'hybrid')),

  starting_price numeric(12, 2),
  currency text not null default 'ZAR' check (currency in ('ZAR', 'USD', 'EUR', 'GBP')),
  billing_period text not null default 'month'
    check (billing_period in ('month', 'year', 'user_month', 'user_year', 'employee_month', 'once')),
  price_vat_inclusive boolean not null default false,
  pricing_model text not null default 'published' check (pricing_model in ('published', 'quote')),
  free_trial boolean not null default false,
  free_trial_days integer,
  free_version boolean not null default false,
  demo boolean not null default false,
  pricing_plans jsonb not null default '[]'::jsonb,
  pricing_note text,
  price_checked_at date,

  features text[] not null default '{}',
  top_features jsonb not null default '[]'::jsonb,
  integrations text[] not null default '{}',
  vendor jsonb not null default '{}'::jsonb,
  compliance jsonb not null default '{}'::jsonb,
  bank_feeds text[] not null default '{}',
  best_for_sizes text[] not null default '{}',
  best_for_roles text[] not null default '{}',

  -- Written only by the trigger in 0002. A guard trigger reverts any other write.
  rating_overall numeric(3, 2),
  rating_ease numeric(3, 2),
  rating_value numeric(3, 2),
  rating_service numeric(3, 2),
  rating_functionality numeric(3, 2),
  review_count integer not null default 0,

  alternatives text[] not null default '{}',
  featured boolean not null default false,
  status text not null default 'draft' check (status in ('published', 'draft')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  search tsvector generated always as (
    setweight(to_tsvector('english', coalesce(name, '')), 'A') ||
    setweight(to_tsvector('english', coalesce(tagline, '')), 'B') ||
    setweight(to_tsvector('english', coalesce(short_description, '')), 'C')
  ) stored
);
create index if not exists software_category_idx on public.software (category);
create index if not exists software_status_idx on public.software (status);
create index if not exists software_search_idx on public.software using gin (search);

create table if not exists public.price_history (
  id uuid primary key default gen_random_uuid(),
  software_id text not null references public.software (id) on delete cascade,
  date date not null,
  price numeric(12, 2),
  currency text not null,
  vat_inclusive boolean not null,
  note text,
  created_at timestamptz not null default now()
);
create index if not exists price_history_software_idx on public.price_history (software_id, date desc);

create table if not exists public.reviews (
  id uuid primary key default gen_random_uuid(),
  software_id text not null references public.software (id) on delete cascade,
  rating_overall smallint not null check (rating_overall between 1 and 5),
  rating_ease smallint not null check (rating_ease between 1 and 5),
  rating_value smallint not null check (rating_value between 1 and 5),
  rating_service smallint not null check (rating_service between 1 and 5),
  rating_functionality smallint not null check (rating_functionality between 1 and 5),
  title text not null check (char_length(title) between 5 and 120),
  pros text not null check (char_length(pros) between 20 and 3000),
  cons text not null check (char_length(cons) between 20 and 3000),
  reviewer_first_name text not null,
  reviewer_role text not null,
  company_size text not null check (company_size in ('sole', '2-10', '11-50', '51-200', '201-500', '500+')),
  usage_duration text not null,
  country char(2) not null,
  reviewer_email text not null,
  helpful_count integer not null default 0,
  status text not null default 'hidden' check (status in ('published', 'hidden')),
  created_at timestamptz not null default now(),
  moderated_at timestamptz
);
create index if not exists reviews_software_idx on public.reviews (software_id, status, created_at desc);

-- The public reads reviews through this view, which never exposes the reviewer's email.
create or replace view public.published_reviews as
  select id, software_id, rating_overall, rating_ease, rating_value, rating_service, rating_functionality,
         title, pros, cons, reviewer_first_name, reviewer_role, company_size, usage_duration, country,
         helpful_count, status, created_at
  from public.reviews
  where status = 'published';

create table if not exists public.helpful_votes (
  review_id uuid not null references public.reviews (id) on delete cascade,
  voter_id text not null check (char_length(voter_id) between 16 and 64),
  created_at timestamptz not null default now(),
  primary key (review_id, voter_id)
);

create table if not exists public.articles (
  slug text primary key,
  title text not null,
  excerpt text not null default '',
  topic text not null,
  topic_label text not null,
  author jsonb not null default '{}'::jsonb,
  published_at date not null default current_date,
  updated_at date not null default current_date,
  reading_minutes integer not null default 5,
  cover text,
  body jsonb not null default '[]'::jsonb,
  related_software text[] not null default '{}',
  featured boolean not null default false,
  status text not null default 'draft' check (status in ('published', 'draft')),
  search tsvector generated always as (
    setweight(to_tsvector('english', coalesce(title, '')), 'A') ||
    setweight(to_tsvector('english', coalesce(excerpt, '')), 'B')
  ) stored
);
create index if not exists articles_search_idx on public.articles using gin (search);

create table if not exists public.comparisons (
  slug text primary key,
  a text not null references public.software (slug) on update cascade on delete cascade,
  b text not null references public.software (slug) on update cascade on delete cascade,
  winner text not null,
  verdict text not null,
  pick_other_if text not null,
  updated_at date not null default current_date,
  status text not null default 'draft' check (status in ('published', 'draft')),
  check (a <> b),
  check (winner in (a, b))
);

create table if not exists public.pages (
  slug text primary key,
  title text not null,
  description text not null default '',
  updated_at date not null default current_date,
  body jsonb not null default '[]'::jsonb
);

create table if not exists public.newsletter_subscribers (
  id uuid primary key default gen_random_uuid(),
  email text not null unique check (email = lower(email)),
  interests text[] not null default '{}',
  consent_at timestamptz not null default now(),
  confirmed_at timestamptz,
  unsubscribed_at timestamptz,
  token text not null unique,
  created_at timestamptz not null default now()
);

create table if not exists public.contact_messages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  subject text not null check (subject in ('general', 'correction', 'listing', 'vendor', 'advertising')),
  message text not null check (char_length(message) between 10 and 5000),
  consent boolean not null,
  handled boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists public.site_settings (
  key text primary key,
  value jsonb not null,
  updated_at timestamptz not null default now()
);

create table if not exists public.audit_log (
  id bigserial primary key,
  table_name text not null,
  row_id text,
  action text not null,
  actor uuid,
  changed_at timestamptz not null default now(),
  old_row jsonb,
  new_row jsonb
);
