create or replace function public.is_admin()
returns boolean
language sql
stable
set search_path = public
as $$
  select exists (
    select 1
    from public.user_roles ur
    where ur.user_id = auth.uid()
      and ur.role = 'admin'
  );
$$;

drop policy if exists "contact_messages_insert_any" on public.contact_messages;
create policy "contact_messages_insert_safe" on public.contact_messages
for insert with check (user_id is null or user_id = auth.uid());
