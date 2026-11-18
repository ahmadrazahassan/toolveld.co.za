-- Triggers: ratings from published reviews only, category counts, price history,
-- audit log, helpful votes and newsletter RPCs.

-- updated_at
create or replace function public.touch_updated_at() returns trigger language plpgsql as $$
begin
  new.updated_at := now();
  return new;
end $$;

drop trigger if exists software_touch on public.software;
create trigger software_touch before update on public.software
  for each row execute function public.touch_updated_at();

drop trigger if exists categories_touch on public.categories;
create trigger categories_touch before update on public.categories
  for each row execute function public.touch_updated_at();

------------------------------------------------------------------------------------------
-- Aggregate ratings. Application code can never write these columns: the guard below
-- reverts them unless the write comes from recompute_software_ratings().
------------------------------------------------------------------------------------------
create or replace function public.guard_rating_columns() returns trigger language plpgsql as $$
begin
  if coalesce(current_setting('toolveld.rating_write', true), '') = 'on' then
    return new;
  end if;
  if tg_op = 'INSERT' then
    new.rating_overall := null;
    new.rating_ease := null;
    new.rating_value := null;
    new.rating_service := null;
    new.rating_functionality := null;
    new.review_count := 0;
  else
    new.rating_overall := old.rating_overall;
    new.rating_ease := old.rating_ease;
    new.rating_value := old.rating_value;
    new.rating_service := old.rating_service;
    new.rating_functionality := old.rating_functionality;
    new.review_count := old.review_count;
  end if;
  return new;
end $$;

drop trigger if exists software_guard_ratings on public.software;
create trigger software_guard_ratings before insert or update on public.software
  for each row execute function public.guard_rating_columns();

create or replace function public.recompute_software_ratings(p_software_id text) returns void
language plpgsql security definer set search_path = public as $$
begin
  perform set_config('toolveld.rating_write', 'on', true);
  update public.software s set
    rating_overall = agg.o,
    rating_ease = agg.e,
    rating_value = agg.v,
    rating_service = agg.s,
    rating_functionality = agg.f,
    review_count = agg.n
  from (
    select
      round(avg(rating_overall)::numeric, 2) as o,
      round(avg(rating_ease)::numeric, 2) as e,
      round(avg(rating_value)::numeric, 2) as v,
      round(avg(rating_service)::numeric, 2) as s,
      round(avg(rating_functionality)::numeric, 2) as f,
      count(*)::int as n
    from public.reviews
    where software_id = p_software_id and status = 'published'
  ) agg
  where s.id = p_software_id;
  perform set_config('toolveld.rating_write', 'off', true);
end $$;

create or replace function public.reviews_after_change() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  if tg_op in ('UPDATE', 'DELETE') then
    perform public.recompute_software_ratings(old.software_id);
  end if;
  if tg_op in ('INSERT', 'UPDATE') then
    perform public.recompute_software_ratings(new.software_id);
  end if;
  return null;
end $$;

drop trigger if exists reviews_recompute on public.reviews;
create trigger reviews_recompute after insert or update or delete on public.reviews
  for each row execute function public.reviews_after_change();

-- Moderation timestamp
create or replace function public.reviews_moderated_at() returns trigger language plpgsql as $$
begin
  if new.status is distinct from old.status then
    new.moderated_at := now();
  end if;
  return new;
end $$;

drop trigger if exists reviews_moderation on public.reviews;
create trigger reviews_moderation before update on public.reviews
  for each row execute function public.reviews_moderated_at();

------------------------------------------------------------------------------------------
-- Category product counts
------------------------------------------------------------------------------------------
create or replace function public.recount_categories() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  update public.categories c set product_count = (
    select count(*) from public.software s where s.category = c.slug and s.status = 'published'
  );
  return null;
end $$;

drop trigger if exists software_recount on public.software;
create trigger software_recount after insert or update of category, status or delete on public.software
  for each statement execute function public.recount_categories();

------------------------------------------------------------------------------------------
-- Price history: recorded whenever a price changes or is checked again.
------------------------------------------------------------------------------------------
create or replace function public.record_price_history() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  if new.price_checked_at is not null and (
    tg_op = 'INSERT'
    or new.starting_price is distinct from old.starting_price
    or new.currency is distinct from old.currency
    or new.price_vat_inclusive is distinct from old.price_vat_inclusive
    or new.price_checked_at is distinct from old.price_checked_at
  ) then
    insert into public.price_history (software_id, date, price, currency, vat_inclusive, note)
    values (
      new.id,
      new.price_checked_at,
      new.starting_price,
      new.currency,
      new.price_vat_inclusive,
      case
        when tg_op = 'INSERT' then 'First check on our register'
        when new.starting_price is distinct from old.starting_price then 'Price changed'
        else 'Checked again, no change'
      end
    );
  end if;
  return null;
end $$;

drop trigger if exists software_price_history on public.software;
create trigger software_price_history after insert or update on public.software
  for each row execute function public.record_price_history();

------------------------------------------------------------------------------------------
-- Audit log of admin writes
------------------------------------------------------------------------------------------
create or replace function public.audit_write() returns trigger
language plpgsql security definer set search_path = public as $$
declare
  rid text;
begin
  if auth.uid() is null then
    return null; -- public inserts (reviews, messages) and system writes are not admin writes
  end if;
  rid := coalesce(
    (case when tg_op = 'DELETE' then to_jsonb(old) else to_jsonb(new) end) ->> 'id',
    (case when tg_op = 'DELETE' then to_jsonb(old) else to_jsonb(new) end) ->> 'slug',
    (case when tg_op = 'DELETE' then to_jsonb(old) else to_jsonb(new) end) ->> 'key'
  );
  insert into public.audit_log (table_name, row_id, action, actor, old_row, new_row)
  values (
    tg_table_name,
    rid,
    tg_op,
    auth.uid(),
    case when tg_op in ('UPDATE', 'DELETE') then to_jsonb(old) end,
    case when tg_op in ('INSERT', 'UPDATE') then to_jsonb(new) end
  );
  return null;
end $$;

do $$
declare t text;
begin
  foreach t in array array['software', 'categories', 'articles', 'comparisons', 'pages', 'reviews', 'contact_messages', 'site_settings']
  loop
    execute format('drop trigger if exists %I_audit on public.%I', t, t);
    execute format('create trigger %I_audit after insert or update or delete on public.%I for each row execute function public.audit_write()', t, t);
  end loop;
end $$;

------------------------------------------------------------------------------------------
-- Helpful votes: one per browser, counted here.
------------------------------------------------------------------------------------------
create or replace function public.count_helpful_vote() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  update public.reviews set helpful_count = helpful_count + 1 where id = new.review_id;
  return null;
end $$;

drop trigger if exists helpful_votes_count on public.helpful_votes;
create trigger helpful_votes_count after insert on public.helpful_votes
  for each row execute function public.count_helpful_vote();

------------------------------------------------------------------------------------------
-- Newsletter: double opt in and one click unsubscribe, callable by the anon role.
------------------------------------------------------------------------------------------
create or replace function public.newsletter_subscribe(p_email text, p_interests text[], p_token text) returns void
language plpgsql security definer set search_path = public as $$
begin
  insert into public.newsletter_subscribers (email, interests, token, consent_at)
  values (lower(trim(p_email)), coalesce(p_interests, '{}'), p_token, now())
  on conflict (email) do update set
    interests = excluded.interests,
    token = excluded.token,
    consent_at = now(),
    confirmed_at = case when public.newsletter_subscribers.unsubscribed_at is null then public.newsletter_subscribers.confirmed_at end,
    unsubscribed_at = null;
end $$;

create or replace function public.newsletter_confirm(p_token text) returns boolean
language plpgsql security definer set search_path = public as $$
declare n int;
begin
  update public.newsletter_subscribers set confirmed_at = coalesce(confirmed_at, now())
  where token = p_token and unsubscribed_at is null;
  get diagnostics n = row_count;
  return n > 0;
end $$;

create or replace function public.newsletter_unsubscribe(p_token text) returns boolean
language plpgsql security definer set search_path = public as $$
declare n int;
begin
  update public.newsletter_subscribers set unsubscribed_at = now()
  where token = p_token and unsubscribed_at is null;
  get diagnostics n = row_count;
  return n > 0;
end $$;

revoke all on function public.newsletter_subscribe(text, text[], text) from public;
revoke all on function public.newsletter_confirm(text) from public;
revoke all on function public.newsletter_unsubscribe(text) from public;
grant execute on function public.newsletter_subscribe(text, text[], text) to anon, authenticated;
grant execute on function public.newsletter_confirm(text) to anon, authenticated;
grant execute on function public.newsletter_unsubscribe(text) to anon, authenticated;
revoke all on function public.recompute_software_ratings(text) from public, anon, authenticated;
