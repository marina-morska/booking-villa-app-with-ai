create index if not exists idx_bookings_user_created_at_desc
  on public.bookings (user_id, created_at desc);

create index if not exists idx_reviews_user_created_at_desc
  on public.reviews (user_id, created_at desc);

create index if not exists idx_reviews_created_at_desc
  on public.reviews (created_at desc);

create index if not exists idx_contact_messages_user_created_at_desc
  on public.contact_messages (user_id, created_at desc);

drop policy if exists "reviews_select_public" on public.reviews;
create policy "reviews_select_own_or_admin" on public.reviews
for select using (user_id = auth.uid() or public.is_admin());

create or replace function public.get_public_reviews(limit_count int default 100)
returns table (
  id uuid,
  user_id uuid,
  rating int,
  title text,
  content text,
  created_at timestamptz,
  display_name text
)
language sql
stable
security definer
set search_path = public
as $$
  select
    r.id,
    r.user_id,
    r.rating,
    r.title,
    r.content,
    r.created_at,
    coalesce(p.display_name, 'User') as display_name
  from public.reviews r
  left join public.profiles p on p.id = r.user_id
  order by r.created_at desc
  limit greatest(1, least(coalesce(limit_count, 100), 200));
$$;

grant execute on function public.get_public_reviews(int) to anon, authenticated;
