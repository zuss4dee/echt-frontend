# Landing page contact form

The home page **Contact us** button opens a modal. Submissions are sent to your inbox via [Resend](https://resend.com).

## Environment variables

| Variable | Purpose |
|----------|---------|
| `RESEND_API_KEY` | API key from the Resend dashboard. |
| `CONTACT_INBOX_EMAIL` | Address that receives submissions. |
| `CONTACT_FROM_EMAIL` | Optional. Verified sender (e.g. `Echt <onboarding@resend.dev>` for testing, or your domain after DNS verification). |

If `RESEND_API_KEY` or `CONTACT_INBOX_EMAIL` is missing, the API returns **503** and the UI shows an error.

## Why not Whop?

Whop is great for **support chat** and community URLs (`NEXT_PUBLIC_WHOP_SUPPORT_CHAT_URL`), but there is no standard API to “post a contact form into Whop.” Email keeps questions in one place you already monitor.

## Spam

The form includes a hidden honeypot field (`website`). Bots that fill it get a silent success response without sending mail.
