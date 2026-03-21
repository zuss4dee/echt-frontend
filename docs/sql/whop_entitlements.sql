-- Run in Supabase SQL Editor (or add as a migration).
-- Stores Whop subscription state keyed by email so the Next.js proxy can gate routes
-- without calling Whop on every request. The webhook uses the service role to upsert rows.

create table if not exists public.whop_entitlements (
  email text primary key,
  whop_user_id text,
  has_access boolean not null default false,
  whop_product_id text,
  membership_status text,
  updated_at timestamptz not null default now()
);

create index if not exists whop_entitlements_whop_user_id_idx on public.whop_entitlements (whop_user_id);

alter table public.whop_entitlements enable row level security;

-- Signed-in users may read their own row (email must match JWT email claim).
create policy "Users can read own whop entitlement"
  on public.whop_entitlements
  for select
  to authenticated
  using (
    lower(email) = lower(coalesce(auth.jwt() ->> 'email', ''))
  );

-- Inserts/updates are performed only with the service role (webhook), which bypasses RLS.

grant usage on schema public to anon, authenticated;
grant select on public.whop_entitlements to authenticated;
