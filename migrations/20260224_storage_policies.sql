insert into storage.buckets (id, name, public)
values ('villa-photos', 'villa-photos', true)
on conflict (id) do nothing;

drop policy if exists "villa_photos_public_read" on storage.objects;
create policy "villa_photos_public_read"
on storage.objects
for select
to public
using (bucket_id = 'villa-photos');

drop policy if exists "villa_photos_admin_insert" on storage.objects;
create policy "villa_photos_admin_insert"
on storage.objects
for insert
to authenticated
with check (
  bucket_id = 'villa-photos'
  and public.is_admin()
);

drop policy if exists "villa_photos_admin_update" on storage.objects;
create policy "villa_photos_admin_update"
on storage.objects
for update
to authenticated
using (
  bucket_id = 'villa-photos'
  and public.is_admin()
)
with check (
  bucket_id = 'villa-photos'
  and public.is_admin()
);

drop policy if exists "villa_photos_admin_delete" on storage.objects;
create policy "villa_photos_admin_delete"
on storage.objects
for delete
to authenticated
using (
  bucket_id = 'villa-photos'
  and public.is_admin()
);
