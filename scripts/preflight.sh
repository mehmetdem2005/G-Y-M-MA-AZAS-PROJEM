#!/usr/bin/env bash
set -euo pipefail

required_files=(
  "apps/api/prisma/schema.prisma"
  "apps/api/src/main.ts"
  "apps/api/src/config/env.ts"
  "apps/api/src/config/secrets.ts"
  "apps/api/src/common/request-id.middleware.ts"
  "apps/api/src/common/all-exceptions.filter.ts"
  "apps/api/src/common/monitoring.ts"
  "apps/api/Dockerfile"
  "apps/web/Dockerfile"
  "apps/admin/middleware.ts"
  ".github/workflows/ci.yml"
  "docker-compose.yml"
  "apps/api/prisma/README.md"
  "docs/runbooks/backup-restore.md"
  "docs/go-no-go-template.md"
  "docs/evidence/production-validation.md"
  "scripts/validate-ci-local.sh"
  "scripts/validate-secrets-manager.sh"
  "scripts/validate-monitoring.sh"
)

for file in "${required_files[@]}"; do
  if [[ ! -f "$file" ]]; then
    echo "[FAIL] Missing required file: $file"
    exit 1
  fi
  echo "[OK] $file"
done

for key in JWT_SECRET WEBHOOK_SIGNATURE_SECRET SENTRY_DSN AWS_SECRETS_MANAGER_ID; do
  if ! grep -q "$key" apps/api/.env.example; then
    echo "[FAIL] apps/api/.env.example is missing $key"
    exit 1
  fi
done

echo "[OK] apps/api/.env.example includes required secrets"

echo "Preflight checks completed successfully."
