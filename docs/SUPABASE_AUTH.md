# Supabase Auth (Echt frontend)

Project ref: `rcburaplxgmaseqokfht`  
Dashboard: https://supabase.com/dashboard/project/rcburaplxgmaseqokfht

Signup and password recovery use `@supabase/ssr` with `emailRedirectTo` / `redirectTo` pointing at `/auth/callback` on the **same origin** the user used in the browser (see `lib/supabase/auth-callback.ts`).

## Fix: emails not delivered (most common)

The app already has `RESEND_API_KEY` in `.env.local` for the contact form, but **Supabase Auth does not read that key**. Auth emails are sent only through **Supabase → SMTP settings**.

### Option A — Resend SMTP in Supabase (recommended)

1. Open **Auth → SMTP**: https://supabase.com/dashboard/project/rcburaplxgmaseqokfht/auth/smtp  
2. Enable **Custom SMTP** and set:

   | Field | Value |
   |-------|--------|
   | Host | `smtp.resend.com` |
   | Port | `465` |
   | Username | `resend` |
   | Password | Your Resend API key (`re_…`) |
   | Sender email | `hello@useecht.com` (must be on a verified Resend domain) |
   | Sender name | `Echt` |

3. **Auth → URL Configuration**: add redirect URLs  
   `https://useecht.com/auth/callback`, `https://www.useecht.com/auth/callback`, `http://localhost:3000/auth/callback`  
   `https://useecht.com/auth/recovery-callback`, `https://www.useecht.com/auth/recovery-callback`, `http://localhost:3000/auth/recovery-callback`  
4. **Auth → Rate Limits**: default is **30 emails/hour** after enabling SMTP — raise if you test heavily: https://supabase.com/dashboard/project/rcburaplxgmaseqokfht/auth/rate-limits  
5. Sign up again or use **Resend confirmation** on the signup page.

**CLI script** (same settings via Management API):

```bash
cd frontend
export SUPABASE_ACCESS_TOKEN="sbp_..."   # https://supabase.com/dashboard/account/tokens
./scripts/configure-resend-smtp.sh
```

### Option B — Resend ↔ Supabase integration

https://resend.com/docs/knowledge-base/getting-started-with-resend-and-supabase — connects SMTP automatically.

### Option C — Skip email confirmation (dev / internal only)

**Auth → Providers → Email** → turn **Confirm email** **OFF**. Signup returns a session immediately and goes to onboarding (no mail required).

## Why confirmation emails might not arrive

1. **No custom SMTP** — Supabase’s built-in mailer is for testing only (strict rate limits; often only team addresses). For production, configure **Auth → SMTP** (Resend, SendGrid, AWS SES, etc.).
2. **Confirm email enabled without deliverable mail** — **Auth → Providers → Email → Confirm email** sends a link on signup; if SMTP is not set up, users see “check your email” in the app but nothing is delivered.
3. **Redirect URL not allow-listed** — **Auth → URL Configuration → Redirect URLs** must include every callback you use, e.g. `https://useecht.com/auth/callback`, `https://www.useecht.com/auth/callback`, `http://localhost:3000/auth/callback`.
4. **Site URL mismatch** — **Site URL** should match your primary app origin (production domain). Wrong Site URL can break links in templates.
5. **Duplicate signup (most common “no email” report)** — Re-registering an email that **already has an account** returns HTTP 200 but **does not send another confirmation email** (Supabase obfuscates with empty `identities`). If that account is already confirmed, use **Sign in** instead of signing up again. The app checks `/api/auth/email-status` to show the right message.
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
- **Password recovery** → email links to `/auth/recovery-callback`, then `/reset-password` to call `updateUser({ password })`. Without that step, the link only signs you in and does not change the password.
