#!/usr/bin/env bash
set -euo pipefail

./scripts/compose-config.sh /tmp/compose.out >/tmp/compose-validate.log
./scripts/preflight.sh >/tmp/preflight-validate.log
pnpm lint >/tmp/lint-validate.log
pnpm test >/tmp/test-validate.log

echo "CI_LOCAL_VALIDATION=PASS"
