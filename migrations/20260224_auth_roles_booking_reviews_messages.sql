-- Roles
do $$
begin
  if not exists (select 1 from pg_type where typname = 'roles') then
    create type public.roles as enum ('admin', 'user');
  end if;
end
$$;

do $$
begin
  if not exists (select 1 from pg_type where typname = 'booking_status') then
    create type public.booking_status as enum ('awaiting_confirmation', 'confirmed', 'rejected', 'cancelled');
  end if;
end
$$;

-- Profiles
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- User roles
create table if not exists public.user_roles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  role public.roles not null default 'user',
  created_at timestamptz not null default now()
);

-- Bookings (one user can have many bookings)
create table if not exists public.bookings (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  check_in date not null,
  check_out date not null,
  guests int not null check (guests > 0),
  status public.booking_status not null default 'awaiting_confirmation',
  admin_note text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint bookings_date_check check (check_out > check_in)
);

-- Reviews (one user can have many reviews)
create table if not exists public.reviews (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  rating int not null check (rating between 1 and 5),
  title text not null,
  content text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Contact messages (guest or logged user)
create table if not exists public.contact_messages (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  full_name text not null,
  email text not null,
  phone text,
  subject text not null,
  message text not null,
  admin_reply text,
  replied_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Gallery photos managed by admin
create table if not exists public.photos (
  id uuid primary key default gen_random_uuid(),
  title text,
  storage_path text not null unique,
  created_at timestamptz not null default now()
);

create index if not exists idx_bookings_user_id on public.bookings(user_id);
create index if not exists idx_reviews_user_id on public.reviews(user_id);
create index if not exists idx_contact_messages_user_id on public.contact_messages(user_id);

-- Role helper
create or replace function public.is_admin()
returns boolean
language sql
stable
as $$
  select exists (
    select 1
    from public.user_roles ur
    where ur.user_id = auth.uid()
      and ur.role = 'admin'
  );
$$;

-- Trigger: create profile + default role on signup
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles(id, display_name)
  values (new.id, coalesce(new.raw_user_meta_data->>'display_name', split_part(new.email, '@', 1)))
  on conflict (id) do nothing;

  insert into public.user_roles(user_id, role)
  values (new.id, 'user')
  on conflict (user_id) do nothing;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- RLS
alter table public.profiles enable row level security;
alter table public.user_roles enable row level security;
alter table public.bookings enable row level security;
alter table public.reviews enable row level security;
alter table public.contact_messages enable row level security;
alter table public.photos enable row level security;

-- Profiles policies
create policy "profiles_select_own_or_admin" on public.profiles
for select using (id = auth.uid() or public.is_admin());

create policy "profiles_update_own_or_admin" on public.profiles
for update using (id = auth.uid() or public.is_admin())
with check (id = auth.uid() or public.is_admin());

-- User roles policies
create policy "user_roles_select_own_or_admin" on public.user_roles
for select using (user_id = auth.uid() or public.is_admin());

create policy "user_roles_admin_manage" on public.user_roles
for all using (public.is_admin()) with check (public.is_admin());

-- Bookings policies
create policy "bookings_select_own_or_admin" on public.bookings
for select using (user_id = auth.uid() or public.is_admin());

create policy "bookings_insert_own" on public.bookings
for insert with check (user_id = auth.uid());

create policy "bookings_update_own_or_admin" on public.bookings
for update using (user_id = auth.uid() or public.is_admin())
with check (user_id = auth.uid() or public.is_admin());

create policy "bookings_delete_admin" on public.bookings
for delete using (public.is_admin());

-- Reviews policies
create policy "reviews_select_public" on public.reviews
for select using (true);

create policy "reviews_insert_own" on public.reviews
for insert with check (user_id = auth.uid());

create policy "reviews_update_own_or_admin" on public.reviews
for update using (user_id = auth.uid() or public.is_admin())
with check (user_id = auth.uid() or public.is_admin());

create policy "reviews_delete_own_or_admin" on public.reviews
for delete using (user_id = auth.uid() or public.is_admin());

-- Contact messages policies
create policy "contact_messages_select_own_or_admin" on public.contact_messages
for select using (user_id = auth.uid() or public.is_admin());

create policy "contact_messages_insert_any" on public.contact_messages
for insert with check (true);

create policy "contact_messages_update_admin" on public.contact_messages
for update using (public.is_admin()) with check (public.is_admin());

create policy "contact_messages_delete_admin" on public.contact_messages
for delete using (public.is_admin());

-- Photos policies
create policy "photos_select_public" on public.photos
for select using (true);

create policy "photos_admin_manage" on public.photos
for all using (public.is_admin()) with check (public.is_admin());
