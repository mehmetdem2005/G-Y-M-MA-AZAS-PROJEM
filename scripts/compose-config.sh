#!/usr/bin/env bash
set -euo pipefail

OUT_FILE="${1:-/tmp/compose.out}"

if command -v docker >/dev/null 2>&1; then
  docker compose config >"$OUT_FILE"
  echo "Docker compose config generated: $OUT_FILE"
  head -n 20 "$OUT_FILE"
  exit 0
fi

# Fallback: keep CI/dev flow unblocked when docker binary is unavailable.
{
  echo "# docker binary bulunamadı; fallback olarak docker-compose.yml içeriği gösteriliyor"
  sed -n '1,200p' docker-compose.yml
} >"$OUT_FILE"

echo "Fallback compose preview generated: $OUT_FILE"
head -n 20 "$OUT_FILE"
