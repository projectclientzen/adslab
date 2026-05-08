## 2026-05-07 — TASK-001

- Scope yang dikerjakan hanya `TASK-001`.
- Referensi PRD yang tersedia di repo adalah `ADS_LAB_PRD_v2 2.md` section `3.5 Updated Database Schema` karena file `PRD.md` tidak ada.
- Menambahkan file migration [supabase/migrations/001_create_ads_detail.sql](/Volumes/Daily Project/adslab/supabase/migrations/001_create_ads_detail.sql) dengan:
  - `CREATE EXTENSION IF NOT EXISTS "uuid-ossp";`
  - tabel `ads_detail` dengan 14 field sesuai PRD
  - `UNIQUE` constraint pada `library_id`
  - 3 index eksplisit untuk `advertiser_name`, `funnel_type`, dan `created_at DESC`
  - 1 index btree otomatis pada `library_id` dari `UNIQUE` constraint, tanpa index duplikat tambahan
  - `CHECK` constraints untuk `creative_type`, `funnel_type`, `campaign_stage`, dan `stage_confidence`
- Tidak ada task lain yang dikerjakan atau file fungsional lain yang diubah.
- Validasi dilakukan dengan grep checks dan eksekusi migration ke PostgreSQL lokal sementara; detail output disimpan di `TEST_RESULTS.md`.
- Revisi setelah review Claude:
  - menghapus `CREATE INDEX IF NOT EXISTS idx_ads_detail_library_id ON ads_detail(library_id);`
  - mempertahankan `library_id TEXT UNIQUE NOT NULL` agar deduplication dan auto-generated btree index tetap ada

## 2026-05-08 — TASK-002

- Scope yang dikerjakan hanya `TASK-002`.
- Referensi schema utama berasal dari `TASKS.md` untuk definisi `campaign_snapshots` dan `campaign_kpi_targets`, dengan konteks dashboard ads di `ADS_LAB_PRD_v2 2.md`.
- Menambahkan file migration [supabase/migrations/002_create_campaign_snapshots.sql](/Volumes/Daily Project/adslab/supabase/migrations/002_create_campaign_snapshots.sql) dengan:
  - `CREATE EXTENSION IF NOT EXISTS "uuid-ossp";`
  - tabel `campaign_snapshots` lengkap sesuai field task
  - tabel `campaign_kpi_targets` terpisah dengan `UNIQUE(campaign_id, kpi_type)`
  - `CHECK` constraints untuk `brand` pada kedua tabel dan `level` pada `campaign_snapshots`
  - 3 index eksplisit untuk `(brand, date_start DESC)`, `(campaign_id, level)`, dan `(fetched_at DESC)`
- Tidak ada file fungsional lain yang diubah di luar migration baru dan log verifikasi task ini.
- Validasi dilakukan dengan command check dari task dan eksekusi migration ke PostgreSQL lokal sementara; detail output disimpan di `TEST_RESULTS.md`.
- Catatan implementasi:
  - `campaign_kpi_targets.brand` juga diberi `CHECK` constraint agar konsisten dengan brand dashboard yang didukung
  - `campaign_kpi_targets.kpi_type` diberi `CHECK` constraint sesuai daftar KPI pada task untuk menjaga integritas data target
