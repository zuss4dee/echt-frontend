# Supabase Auth (Echt frontend)

Signup and password recovery use `@supabase/ssr` with `emailRedirectTo` / `redirectTo` pointing at `/auth/callback` on the **same origin** the user used in the browser (see `lib/supabase/auth-callback.ts`).

## Why confirmation emails might not arrive

1. **No custom SMTP** — Supabase’s built-in mailer is for testing only (strict rate limits; often only team addresses). For production, configure **Project Settings → Auth → SMTP** (Resend, SendGrid, AWS SES, etc.).
2. **Confirm email enabled without deliverable mail** — **Auth → Providers → Email → Confirm email** sends a link on signup; if SMTP is not set up, users see “check your email” in the app but nothing is delivered.
3. **Redirect URL not allow-listed** — **Auth → URL Configuration → Redirect URLs** must include every callback you use, e.g. `https://useecht.com/auth/callback`, `https://www.useecht.com/auth/callback`, `http://localhost:3000/auth/callback`.
4. **Site URL mismatch** — **Site URL** should match your primary app origin (production domain). Wrong Site URL can break links in templates.
5. **Duplicate signup** — Re-registering an existing email returns success with **no new email** (empty `identities`). The UI treats this as “account already exists”.
6. **Spam / rate limits** — Check spam; built-in SMTP is capped (~4 emails/hour per project).

## Recommended dashboard settings

| Area | Setting |
|------|---------|
| **Auth → Providers → Email** | Enable Email provider; toggle **Confirm email** per your policy (on = must confirm before `signInWithPassword`; off = immediate session on signup). |
| **Auth → URL Configuration** | **Site URL**: production app URL. **Redirect URLs**: `*/auth/callback` for each host (prod + localhost). |
| **Auth → SMTP** | Custom SMTP for production (required for reliable delivery). |
| **Auth → Email Templates** | Customize “Confirm signup” / “Reset password” if needed; keep `{{ .ConfirmationURL }}` intact. |

## Local development

- **Confirm email OFF** — Fastest path: disable confirmation in the dashboard; signup returns a session and the app redirects to onboarding.
- **Confirm email ON** — Use SMTP or add your address as a team member and stay within built-in rate limits; allow-list `http://localhost:3000/auth/callback`.

Env vars: copy `frontend/.env.example` → `.env.local` (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`).

## App behavior (code)

- **Session after signup** → redirect via `getPostAuthPath` (onboarding or analyze).
- **No session** → “check email” UI with optional **Resend confirmation** (`auth.resend({ type: 'signup', ... })`).
- **Login before confirm** → Supabase error “Email not confirmed”; login form offers resend.
