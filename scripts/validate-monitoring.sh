#!/usr/bin/env bash
set -euo pipefail

if ! grep -q "initMonitoring" apps/api/src/main.ts; then
  echo "MONITORING_VALIDATION=FAIL (init missing)"
  exit 1
fi

if ! grep -q "captureException" apps/api/src/common/all-exceptions.filter.ts; then
  echo "MONITORING_VALIDATION=FAIL (capture missing)"
  exit 1
fi

if ! grep -q "SENTRY_DSN" apps/api/.env.example; then
  echo "MONITORING_VALIDATION=FAIL (SENTRY_DSN missing)"
  exit 1
fi

echo "MONITORING_VALIDATION=PASS"
