#!/usr/bin/env bash
# Wire Supabase Auth to Resend SMTP so signup / password-reset emails deliver.
#
# Prerequisites:
#   - Resend API key + verified domain (e.g. useecht.com)
#   - Supabase personal access token: https://supabase.com/dashboard/account/tokens
#
# Usage (from frontend/):
#   export SUPABASE_ACCESS_TOKEN=sbp_...
#   export SMTP_ADMIN_EMAIL="Echt <hello@useecht.com>"   # optional; default below
#   ./scripts/configure-resend-smtp.sh

set -euo pipefail

PROJECT_REF="${SUPABASE_PROJECT_REF:-rcburaplxgmaseqokfht}"
SMTP_HOST="${SMTP_HOST:-smtp.resend.com}"
SMTP_PORT="${SMTP_PORT:-465}"
SMTP_USER="${SMTP_USER:-resend}"
SMTP_SENDER_NAME="${SMTP_SENDER_NAME:-Echt}"

if [[ -z "${SUPABASE_ACCESS_TOKEN:-}" ]]; then
  echo "Error: set SUPABASE_ACCESS_TOKEN (https://supabase.com/dashboard/account/tokens)" >&2
  exit 1
fi

# Load RESEND_API_KEY from .env.local if present
if [[ -z "${RESEND_API_KEY:-}" && -f .env.local ]]; then
  # shellcheck disable=SC1091
  set -a && source .env.local && set +a
fi

if [[ -z "${RESEND_API_KEY:-}" ]]; then
  echo "Error: set RESEND_API_KEY in .env.local or the environment" >&2
  exit 1
fi

# Default sender — must use a Resend-verified domain
SMTP_ADMIN_EMAIL="${SMTP_ADMIN_EMAIL:-Echt <hello@useecht.com>}"

echo "Configuring Supabase project ${PROJECT_REF} → Resend SMTP (${SMTP_HOST}:${SMTP_PORT})"
echo "Sender: ${SMTP_ADMIN_EMAIL}"

payload=$(cat <<EOF
{
  "external_email_enabled": true,
  "smtp_host": "${SMTP_HOST}",
  "smtp_port": ${SMTP_PORT},
  "smtp_user": "${SMTP_USER}",
  "smtp_pass": "${RESEND_API_KEY}",
  "smtp_admin_email": "${SMTP_ADMIN_EMAIL}",
  "smtp_sender_name": "${SMTP_SENDER_NAME}"
}
EOF
)

http_code=$(curl -sS -o /tmp/supabase-smtp-response.json -w "%{http_code}" \
  -X PATCH "https://api.supabase.com/v1/projects/${PROJECT_REF}/config/auth" \
  -H "Authorization: Bearer ${SUPABASE_ACCESS_TOKEN}" \
  -H "Content-Type: application/json" \
  -d "${payload}")

if [[ "${http_code}" != "200" ]]; then
  echo "Supabase API returned HTTP ${http_code}:" >&2
  cat /tmp/supabase-smtp-response.json >&2
  exit 1
fi

echo "OK — custom SMTP enabled."
echo ""
echo "Next steps:"
echo "  1. Dashboard → Auth → URL Configuration: allow https://useecht.com/auth/callback and http://localhost:3000/auth/callback"
echo "  2. Dashboard → Auth → Rate Limits: raise email rate above 30/hour if needed"
echo "     https://supabase.com/dashboard/project/${PROJECT_REF}/auth/rate-limits"
echo "  3. Sign up again (or use Resend confirmation on the signup page)"
