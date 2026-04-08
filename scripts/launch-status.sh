#!/usr/bin/env bash
set -euo pipefail

if ./scripts/preflight.sh >/tmp/preflight.out 2>&1 && ./scripts/validate-ci-local.sh >/tmp/validate-ci.out 2>&1 && ./scripts/validate-monitoring.sh >/tmp/validate-monitoring.out 2>&1 && ./scripts/validate-secrets-manager.sh >/tmp/validate-secrets.out 2>&1; then
  echo "LAUNCH_READINESS=PRODUCTION_READY"
  echo "Detaylar: /tmp/preflight.out, /tmp/validate-ci.out, /tmp/validate-monitoring.out, /tmp/validate-secrets.out"
else
  echo "LAUNCH_READINESS=NOT_READY"
  cat /tmp/preflight.out /tmp/validate-ci.out /tmp/validate-monitoring.out /tmp/validate-secrets.out 2>/dev/null || true
  exit 1
fi
