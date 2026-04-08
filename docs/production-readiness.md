# Production Readiness Checklist

Bu checklist, proje "lansman hazır" ilan edilmeden önce minimum kapıları listeler.

## 1) Platform & Build
- [x] API Dockerfile mevcut (`apps/api/Dockerfile`)
- [x] Web Dockerfile mevcut (`apps/web/Dockerfile`)
- [x] CI workflow mevcut (`.github/workflows/ci.yml`)
- [x] CI doğrulama kanıtı (yerel pipeline) (`docs/evidence/production-validation.md`)

## 2) Security
- [x] Helmet + rate limit (`apps/api/src/main.ts`)
- [x] Basic password policy (`apps/api/src/common/password-policy.ts`)
- [x] HMAC tabanlı webhook imza doğrulama (`apps/api/src/payments/webhook.controller.ts`)
- [x] Stripe resmi imza doğrulama (rawBody + stripe-signature) fallback HMAC ile (`apps/api/src/payments/webhook.controller.ts`)
- [x] Ortam değişkeni doğrulama (`apps/api/src/config/env.ts`)
- [x] Secrets manager hook (`apps/api/src/config/secrets.ts`)
- [x] Secrets manager doğrulama scripti (`scripts/validate-secrets-manager.sh`)

## 3) Data & Ops
- [x] Prisma schema başlangıcı (`apps/api/prisma/schema.prisma`)
- [x] Migration/seed strateji dokümanı (`apps/api/prisma/README.md`)
- [x] Backup/restore runbook (`docs/runbooks/backup-restore.md`)

## 4) Quality
- [x] Test dosyaları mevcut (API e2e, Web Playwright)
- [x] Request-id + temel access log middleware (`apps/api/src/common/request-id.middleware.ts`)
- [x] Global exception filter + JSON hata logları (`apps/api/src/common/all-exceptions.filter.ts`)
- [x] Harici error monitoring hook (`apps/api/src/common/monitoring.ts`)
- [x] Monitoring doğrulama scripti (`scripts/validate-monitoring.sh`)

## 5) Launch Gates
- [x] `./scripts/preflight.sh`
- [x] `./scripts/launch-status.sh`
- [x] Go/No-Go şablonu (`docs/go-no-go-template.md`)
- [x] Üretim doğrulama kanıtı (`docs/evidence/production-validation.md`)
