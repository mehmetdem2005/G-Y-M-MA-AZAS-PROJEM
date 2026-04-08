# Moda E-Ticaret Monorepo (Plan Uygulaması)

Bu repo, plan dokümanındaki çekirdek iş kalemlerini uygulanabilir bir iskelet halinde sunar.

## Uygulanan modüller
- **API (`apps/api`)**: Prisma şema, auth servisi, sepet servisi, ödeme webhook, sağlık endpoint'i ve admin metrik/audit endpoint'leri.
- **Web (`apps/web`)**: Public layout, ürün kartı, KVKK onay bileşeni, provider ve layout bileşenleri, sepet ve ürün detay placeholder sayfaları.
- **Admin (`apps/admin`)**: Middleware (RBAC), dashboard, ürün sayfası, audit log sayfası ve örnek admin API route'ları.
- **CI**: `.github/workflows/ci.yml`.

## Altyapı
- `docker-compose.yml` ile PostgreSQL + Redis yerel geliştirme ortamı.
- Docker kurulu değilse bile `pnpm compose:config` ile fallback compose çıktısı alınabilir.
- `apps/api/Dockerfile` ve `apps/web/Dockerfile` ile CI build adımları için image tanımları sağlandı.
- `tsconfig.base.json` ve uygulama bazlı `tsconfig.json` dosyaları.

## Hızlı Başlangıç
1. `docker compose up -d`
2. `cp apps/api/.env.example apps/api/.env`
3. API/Web/Admin bağımlılıklarını uygulama bazında kurun.
4. İlgili komutları çalıştırın:
   - `pnpm --filter api dev`
   - `pnpm --filter web dev`
   - `pnpm --filter admin dev`

## Yardımcı Komutlar
- Compose doğrulama/önizleme: `pnpm compose:config`
- Preflight (lansman öncesi temel kapı): `pnpm preflight`
- Launch durumu: `pnpm launch:status`
- Prod doğrulama (yerel): `pnpm validate:prod`
- Web ana sayfa screenshot (Playwright): `pnpm --filter web screenshot:home`
- API sağlık kontrolü: `GET /health`
- API admin metrikleri: `GET /admin/metrics`
- API audit kayıtları: `GET /admin/audit`

## Güvenlik Notu
- Webhook doğrulaması önce Stripe resmi imzası (`stripe-signature` + rawBody) ile yapılır, fallback olarak HMAC (`x-webhook-signature`) kullanılabilir.
- API açılışında `validateEnv()` çalışır; eksik kritik env varsa süreç fail-fast kapanır.
- `AWS_SECRETS_MANAGER_ID` verilirse API açılışında Secrets Manager'dan environment yüklemeyi dener.
- Tüm isteklerde `x-request-id` üretilir/aktarılır ve JSON access log yazılır.
- Global exception filter tüm hataları yapılandırılmış JSON formatta loglar.
- `SENTRY_DSN` verilirse opsiyonel Sentry hook devreye girer.

## Lansman Hazırlık Dokümanları
- `docs/production-readiness.md`
- `docs/evidence/production-validation.md`
- `apps/api/prisma/README.md` (migration/seed)
- `docs/runbooks/backup-restore.md`
- `docs/go-no-go-template.md`

> Durum: Scaffold kapsamı için production-ready / lansman-hazır kapıları yerel doğrulama bazında tamamlandı.
