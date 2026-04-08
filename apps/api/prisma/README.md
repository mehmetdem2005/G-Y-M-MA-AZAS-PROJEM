# Prisma Migration & Seed Strategy

## Migration Policy
1. Her şema değişikliği için yeni migration üretilir:
   - `npx prisma migrate dev --name <change_name>`
2. PR içinde migration SQL dosyaları versiyonlanır.
3. Production deploy'da yalnızca `prisma migrate deploy` çalıştırılır.

## Seed Policy
- Seed script, yalnızca idempotent örnek veriler üretmelidir.
- Seed komutu:
  - `npx prisma db seed`

## Rollback Notu
- Prisma migrate geri alma için manuel SQL planı gerekir.
- Her kritik migration için eşlenik rollback SQL dosyası tutulmalıdır.
