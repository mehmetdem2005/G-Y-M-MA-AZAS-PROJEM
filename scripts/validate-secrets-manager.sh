#!/usr/bin/env bash
set -euo pipefail

if [[ -n "${AWS_SECRETS_MANAGER_ID:-}" && -n "${AWS_REGION:-}" && -n "${AWS_ACCESS_KEY_ID:-}" ]]; then
  if ! command -v aws >/dev/null 2>&1; then
    echo "SECRETS_VALIDATION=FAIL (aws cli not installed)"
    exit 1
  fi

  aws secretsmanager get-secret-value \
    --secret-id "$AWS_SECRETS_MANAGER_ID" \
    --region "$AWS_REGION" >/tmp/secrets-manager.raw.json

  echo "SECRETS_VALIDATION=PASS (aws fetch)"
  exit 0
fi

if [[ -f scripts/evidence/secrets.sample.json ]]; then
  for key in JWT_SECRET JWT_REFRESH_SECRET WEBHOOK_SIGNATURE_SECRET; do
    if ! grep -q "\"$key\"" scripts/evidence/secrets.sample.json; then
      echo "SECRETS_VALIDATION=FAIL (missing $key in sample)"
      exit 1
    fi
  done
  echo "SECRETS_VALIDATION=PASS (sample validation)"
  exit 0
fi

echo "SECRETS_VALIDATION=FAIL (no aws credentials and no sample file)"
exit 1
