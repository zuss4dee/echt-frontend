# Where user / profile data lives

## Two places (kept in sync)

1. **`auth.users`** — Supabase Auth holds sign-in identity and **`raw_user_meta_data`** (same keys as `user.user_metadata` in the app: `full_name`, `phone`, `company_name`, `role_in_company`, `monthly_references`, `onboarding_complete`).

2. **`public.profiles`** — A table you can open in **Table Editor** with one row per user (`id` = `auth.users.id`). The app **upserts** this row whenever:
   - onboarding is completed on `/onboarding`, or  
   - profile fields are saved from the Analyze profile drawer.

Run [`docs/sql/profiles.sql`](sql/profiles.sql) in the SQL Editor if the table is missing or to align RLS. If you already created `profiles` manually, add any missing columns from that file before relying on sync.

## Viewing users in the dashboard

- **Authentication → Users**: one row per account; metadata is in the user’s JSON.
- **Table Editor → `profiles`**: columns for email, phone, company, role, etc., easy to scan and export.

## Older accounts (before `profiles` sync)

Users who finished onboarding before this feature only have metadata in Auth until they **save the profile again** from Analyze or you run a one-off SQL backfill from `auth.users`.

## Multiple test accounts

Each email is a separate **`auth.users`** row and a separate **`profiles`** row (same `id`).
