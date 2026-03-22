-- Run in Supabase SQL Editor. Mirrors onboarding fields from auth user_metadata for Table Editor visibility.

create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text,
  full_name text,
  phone text,
  company_name text,
  role_in_company text,
  monthly_references text,
  onboarding_complete boolean default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists profiles_email_lower_idx on public.profiles (lower(email));

alter table public.profiles enable row level security;

create policy "Users can read own profile"
  on public.profiles for select
  to authenticated
  using (auth.uid() = id);

create policy "Users can insert own profile"
  on public.profiles for insert
  to authenticated
  with check (auth.uid() = id);

create policy "Users can update own profile"
  on public.profiles for update
  to authenticated
  using (auth.uid() = id)
  with check (auth.uid() = id);

grant usage on schema public to anon, authenticated;
grant select, insert, update on public.profiles to authenticated;

comment on table public.profiles is 'Denormalized copy of onboarding fields for admin reporting; kept in sync from the app.';
