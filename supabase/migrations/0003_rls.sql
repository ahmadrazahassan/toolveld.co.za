-- Row level security on every table. The public reads published rows only and may insert
-- reviews, newsletter sign ups (through the RPC) and contact messages. Only the admin writes the rest.

create or replace function public.is_admin() returns boolean
language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.admins where user_id = auth.uid());
$$;

alter table public.admins enable row level security;
alter table public.categories enable row level security;
alter table public.software enable row level security;
alter table public.price_history enable row level security;
alter table public.reviews enable row level security;
alter table public.helpful_votes enable row level security;
alter table public.articles enable row level security;
alter table public.comparisons enable row level security;
alter table public.pages enable row level security;
alter table public.newsletter_subscribers enable row level security;
alter table public.contact_messages enable row level security;
alter table public.site_settings enable row level security;
alter table public.audit_log enable row level security;

-- admins
create policy admins_self_read on public.admins for select to authenticated using (user_id = auth.uid());

-- categories
create policy categories_read on public.categories for select using (true);
create policy categories_admin on public.categories for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- software
create policy software_read on public.software for select using (status = 'published' or public.is_admin());
create policy software_admin on public.software for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- price history
create policy price_history_read on public.price_history for select using (true);
create policy price_history_admin on public.price_history for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- reviews: public may only submit hidden reviews; reading goes through published_reviews
create policy reviews_insert on public.reviews for insert to anon, authenticated
  with check (status = 'hidden' and helpful_count = 0 and moderated_at is null);
create policy reviews_admin on public.reviews for all to authenticated using (public.is_admin()) with check (public.is_admin());
grant select on public.published_reviews to anon, authenticated;

-- helpful votes: insert only, the primary key stops a second vote from the same browser
create policy helpful_votes_insert on public.helpful_votes for insert to anon, authenticated with check (true);
create policy helpful_votes_admin on public.helpful_votes for select to authenticated using (public.is_admin());

-- articles, comparisons, pages
create policy articles_read on public.articles for select using (status = 'published' or public.is_admin());
create policy articles_admin on public.articles for all to authenticated using (public.is_admin()) with check (public.is_admin());
create policy comparisons_read on public.comparisons for select using (status = 'published' or public.is_admin());
create policy comparisons_admin on public.comparisons for all to authenticated using (public.is_admin()) with check (public.is_admin());
create policy pages_read on public.pages for select using (true);
create policy pages_admin on public.pages for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- newsletter: no direct public access; the RPCs in 0002 handle sign up, confirm and unsubscribe
create policy newsletter_admin on public.newsletter_subscribers for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- contact messages
create policy contact_insert on public.contact_messages for insert to anon, authenticated with check (handled = false and consent = true);
create policy contact_admin on public.contact_messages for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- settings and audit
create policy settings_read on public.site_settings for select using (true);
create policy settings_admin on public.site_settings for all to authenticated using (public.is_admin()) with check (public.is_admin());
create policy audit_admin_read on public.audit_log for select to authenticated using (public.is_admin());

-- Storage buckets for logos, screenshots and article images. Public read, admin write.
insert into storage.buckets (id, name, public)
values ('logos', 'logos', true), ('screenshots', 'screenshots', true), ('article-images', 'article-images', true)
on conflict (id) do nothing;

create policy storage_public_read on storage.objects for select
  using (bucket_id in ('logos', 'screenshots', 'article-images'));
create policy storage_admin_insert on storage.objects for insert to authenticated
  with check (bucket_id in ('logos', 'screenshots', 'article-images') and public.is_admin());
create policy storage_admin_update on storage.objects for update to authenticated
  using (bucket_id in ('logos', 'screenshots', 'article-images') and public.is_admin());
create policy storage_admin_delete on storage.objects for delete to authenticated
  using (bucket_id in ('logos', 'screenshots', 'article-images') and public.is_admin());
