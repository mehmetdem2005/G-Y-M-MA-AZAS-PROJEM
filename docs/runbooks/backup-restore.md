# Backup / Restore Runbook

## PostgreSQL Backup
- Günlük tam yedek:
  - `pg_dump -Fc "$DATABASE_URL" > backup_$(date +%F).dump`
- Yedekler şifreli object storage alanına yüklenir.

## PostgreSQL Restore
- Boş bir veritabanına geri yükleme:
  - `pg_restore -d "$DATABASE_URL" backup_YYYY-MM-DD.dump`

## Redis Backup
- `save`/`bgsave` politikası ile RDB snapshot.
- Kritik ortamda AOF etkinleştirme önerilir.

## Doğrulama
1. Restore sonrası temel tablo sayımları kontrol edilir.
2. API health + kritik endpoint smoke testleri çalıştırılır.
3. Incident kayıtlarına restore süresi yazılır.
