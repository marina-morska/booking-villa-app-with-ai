-- Cleanup stale user-owned data where profile row is missing
-- (can happen after manual profile deletion outside normal auth delete flow)
delete from public.reviews r
where not exists (
  select 1 from public.profiles p where p.id = r.user_id
);

delete from public.bookings b
where not exists (
  select 1 from public.profiles p where p.id = b.user_id
);

delete from public.contact_messages m
where m.user_id is not null
  and not exists (
    select 1 from public.profiles p where p.id = m.user_id
  );

-- If a profile row is deleted manually, cascade delete user-owned content too
create or replace function public.handle_profile_delete_cleanup()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  delete from public.reviews where user_id = old.id;
  delete from public.bookings where user_id = old.id;
  delete from public.contact_messages where user_id = old.id;
  delete from public.user_roles where user_id = old.id;
  return old;
end;
$$;

drop trigger if exists on_profile_deleted_cleanup on public.profiles;
create trigger on_profile_deleted_cleanup
  after delete on public.profiles
  for each row execute function public.handle_profile_delete_cleanup();
