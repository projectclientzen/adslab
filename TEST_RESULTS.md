# TEST_RESULTS — TASK-001 (Revisi Claude)

Tanggal: 2026-05-07

## 1. File existence

Command:
```bash
ls -la supabase/migrations/001_create_ads_detail.sql
```

Output:
```text
-rw-r--r--  1 maszen  admin  964 May  7 16:19 supabase/migrations/001_create_ads_detail.sql
```

## 2. Required field presence check

Command:
```bash
grep -E "library_id|ad_copy|creative_type|cta_button|destination_url|date_active|funnel_type|funnel_override|campaign_stage|stage_confidence|stage_override" supabase/migrations/001_create_ads_detail.sql | wc -l
```

Output:
```text
      12
```

Catatan: hasil `12` valid karena beberapa field yang dicek muncul pada baris `CHECK` constraint yang sama dengan definisinya.

## 3. UNIQUE constraint check

Command:
```bash
grep "UNIQUE" supabase/migrations/001_create_ads_detail.sql
```

Output:
```text
    library_id TEXT UNIQUE NOT NULL,
```

## 4. CHECK constraints check

Command:
```bash
grep "CHECK" supabase/migrations/001_create_ads_detail.sql
```

Output:
```text
    creative_type TEXT CHECK (creative_type IN ('image', 'video', 'carousel')),
    funnel_type TEXT CHECK (funnel_type IN ('LP', 'CTWA', 'Visit Profile', 'Lead Form')),
    campaign_stage TEXT CHECK (campaign_stage IN ('TOFU', 'MOFU', 'BOFU')),
    stage_confidence FLOAT CHECK (stage_confidence >= 0 AND stage_confidence <= 1),
```

## 5. Explicit index definition check

Command:
```bash
grep "CREATE INDEX" supabase/migrations/001_create_ads_detail.sql
```

Output:
```text
CREATE INDEX IF NOT EXISTS idx_ads_detail_advertiser ON ads_detail(advertiser_name);
CREATE INDEX IF NOT EXISTS idx_ads_detail_funnel ON ads_detail(funnel_type);
CREATE INDEX IF NOT EXISTS idx_ads_detail_created ON ads_detail(created_at DESC);
```

Catatan: index eksplisit untuk `library_id` memang dihapus sesuai review Claude karena `library_id TEXT UNIQUE NOT NULL` sudah otomatis membuat btree index sendiri di PostgreSQL.

## 6. PostgreSQL availability

Command:
```bash
psql --version
```

Output:
```text
psql (PostgreSQL) 14.21 (Homebrew)
```

## 7. Real parser validation on clean temporary database

Command:
```bash
psql --no-psqlrc -h /private/tmp/adslab_pg_socket_rev -d postgres -c "CREATE DATABASE task001_revision_1600;"
```

Output:
```text
CREATE DATABASE
```

Command:
```bash
psql --no-psqlrc -h /private/tmp/adslab_pg_socket_rev -d postgres -c "SELECT datname FROM pg_database WHERE datname = 'task001_revision_1600';"
```

Output:
```text
        datname        
-----------------------
 task001_revision_1600
(1 row)
```

Command:
```bash
psql --no-psqlrc -h /private/tmp/adslab_pg_socket_rev -d task001_revision_1600 -v ON_ERROR_STOP=1 -f supabase/migrations/001_create_ads_detail.sql
```

Output:
```text
CREATE EXTENSION
CREATE TABLE
CREATE INDEX
CREATE INDEX
CREATE INDEX
```

Command:
```bash
psql --no-psqlrc -h /private/tmp/adslab_pg_socket_rev -d task001_revision_1600 -c "\d ads_detail"
```

Output:
```text
                                Table "public.ads_detail"
      Column      |           Type           | Collation | Nullable |      Default
------------------+--------------------------+-----------+----------+--------------------
 id               | uuid                     |           | not null | uuid_generate_v4()
 library_id       | text                     |           | not null |
 advertiser_name  | text                     |           |          |
 ad_copy          | text                     |           |          |
 creative_type    | text                     |           |          |
 cta_button       | text                     |           |          |
 destination_url  | text                     |           |          |
 date_active      | timestamp with time zone |           |          |
 funnel_type      | text                     |           |          |
 funnel_override  | text                     |           |          |
 campaign_stage   | text                     |           |          |
 stage_confidence | double precision         |           |          |
 stage_override   | text                     |           |          |
 created_at       | timestamp with time zone |           |          | now()
Indexes:
    "ads_detail_pkey" PRIMARY KEY, btree (id)
    "ads_detail_library_id_key" UNIQUE CONSTRAINT, btree (library_id)
    "idx_ads_detail_advertiser" btree (advertiser_name)
    "idx_ads_detail_created" btree (created_at DESC)
    "idx_ads_detail_funnel" btree (funnel_type)
Check constraints:
    "ads_detail_campaign_stage_check" CHECK (campaign_stage = ANY (ARRAY['TOFU'::text, 'MOFU'::text, 'BOFU'::text]))
    "ads_detail_creative_type_check" CHECK (creative_type = ANY (ARRAY['image'::text, 'video'::text, 'carousel'::text]))
    "ads_detail_funnel_type_check" CHECK (funnel_type = ANY (ARRAY['LP'::text, 'CTWA'::text, 'Visit Profile'::text, 'Lead Form'::text]))
    "ads_detail_stage_confidence_check" CHECK (stage_confidence >= 0::double precision AND stage_confidence <= 1::double precision)
```

## 8. Idempotency re-run check

Command:
```bash
psql --no-psqlrc -h /private/tmp/adslab_pg_socket_rev -d task001_revision_1600 -v ON_ERROR_STOP=1 -f supabase/migrations/001_create_ads_detail.sql
```

Output:
```text
psql:supabase/migrations/001_create_ads_detail.sql:1: NOTICE:  extension "uuid-ossp" already exists, skipping
CREATE EXTENSION
psql:supabase/migrations/001_create_ads_detail.sql:18: NOTICE:  relation "ads_detail" already exists, skipping
CREATE TABLE
CREATE INDEX
psql:supabase/migrations/001_create_ads_detail.sql:20: NOTICE:  relation "idx_ads_detail_advertiser" already exists, skipping
CREATE INDEX
psql:supabase/migrations/001_create_ads_detail.sql:21: NOTICE:  relation "idx_ads_detail_funnel" already exists, skipping
CREATE INDEX
psql:supabase/migrations/001_create_ads_detail.sql:22: NOTICE:  relation "idx_ads_detail_created" already exists, skipping
```

## 9. Verification note

Catatan:
```text
Verifikasi revisi dijalankan pada database bersih `task001_revision_1600` di cluster PostgreSQL lokal sementara yang sudah aktif pada socket `/private/tmp/adslab_pg_socket_rev`. Pendekatan ini dipakai karena bootstrap cluster baru dari sandbox tidak konsisten, tetapi eksekusi migration dan inspeksi schema tetap berhasil pada database kosong.
```

# TEST_RESULTS — TASK-002

Tanggal: 2026-05-08

## 1. File existence

Command:
```bash
ls -la supabase/migrations/002_create_campaign_snapshots.sql
```

Output:
```text
-rw-r--r--  1 maszen  admin  1628 May  8 11:41 supabase/migrations/002_create_campaign_snapshots.sql
```

## 2. Table definition presence check

Command:
```bash
grep -E "campaign_snapshots|campaign_kpi_targets" supabase/migrations/002_create_campaign_snapshots.sql | wc -l
```

Output:
```text
       8
```

Catatan: hasil `8` valid karena nama tabel muncul pada `CREATE TABLE` dan beberapa `CREATE INDEX`.

## 3. CHECK constraint presence check

Command:
```bash
grep "CHECK" supabase/migrations/002_create_campaign_snapshots.sql | wc -l
```

Output:
```text
       4
```

Catatan: hasil `4` mencakup `brand` pada dua tabel, `level` pada `campaign_snapshots`, dan `kpi_type` pada `campaign_kpi_targets`.

## 4. Explicit index definition check

Command:
```bash
grep "CREATE INDEX" supabase/migrations/002_create_campaign_snapshots.sql | wc -l
```

Output:
```text
       3
```

## 5. PostgreSQL availability

Command:
```bash
psql --version
```

Output:
```text
psql (PostgreSQL) 14.21 (Homebrew)
```

## 6. Create clean validation database

Command:
```bash
psql --no-psqlrc -h /private/tmp/adslab_pg_socket_rev -d postgres -c "CREATE DATABASE task002_validation_1142;"
```

Output:
```text
CREATE DATABASE
```

## 7. Real parser validation on clean temporary database

Command:
```bash
psql --no-psqlrc -h /private/tmp/adslab_pg_socket_rev -d task002_validation_1142 -v ON_ERROR_STOP=1 -f supabase/migrations/002_create_campaign_snapshots.sql
```

Output:
```text
CREATE EXTENSION
CREATE TABLE
CREATE TABLE
CREATE INDEX
CREATE INDEX
CREATE INDEX
```

## 8. Created table existence check

Command:
```bash
psql --no-psqlrc -h /private/tmp/adslab_pg_socket_rev -d task002_validation_1142 -c "SELECT tablename FROM pg_tables WHERE schemaname = 'public' AND tablename IN ('campaign_snapshots', 'campaign_kpi_targets') ORDER BY tablename;"
```

Output:
```text
      tablename       
----------------------
 campaign_kpi_targets
 campaign_snapshots
(2 rows)
```

## 9. Schema inspection: `campaign_snapshots`

Command:
```bash
psql --no-psqlrc -h /private/tmp/adslab_pg_socket_rev -d task002_validation_1142 -c "\d campaign_snapshots"
```

Output:
```text
                           Table "public.campaign_snapshots"
     Column     |           Type           | Collation | Nullable |      Default
----------------+--------------------------+-----------+----------+--------------------
 id             | uuid                     |           | not null | uuid_generate_v4()
 brand          | text                     |           | not null |
 campaign_id    | text                     |           | not null |
 campaign_name  | text                     |           | not null |
 adset_id       | text                     |           |          |
 adset_name     | text                     |           |          |
 ad_id          | text                     |           |          |
 ad_name        | text                     |           |          |
 level          | text                     |           | not null |
 date_start     | date                     |           | not null |
 date_stop      | date                     |           | not null |
 spend          | numeric(12,2)            |           |          |
 reach          | integer                  |           |          |
 impressions    | integer                  |           |          |
 clicks         | integer                  |           |          |
 ctr            | numeric(6,4)             |           |          |
 cpm            | numeric(10,2)            |           |          |
 frequency      | numeric(6,4)             |           |          |
 purchases      | integer                  |           |          |
 purchase_value | numeric(12,2)            |           |          |
 leads          | integer                  |           |          |
 roas           | numeric(8,4)             |           |          |
 cpl            | numeric(10,2)            |           |          |
 cpp            | numeric(10,2)            |           |          |
 status         | text                     |           |          |
 fetched_at     | timestamp with time zone |           |          | now()
Indexes:
    "campaign_snapshots_pkey" PRIMARY KEY, btree (id)
    "idx_campaign_snapshots_brand_date" btree (brand, date_start DESC)
    "idx_campaign_snapshots_campaign_level" btree (campaign_id, level)
    "idx_campaign_snapshots_fetched_at" btree (fetched_at DESC)
Check constraints:
    "campaign_snapshots_brand_check" CHECK (brand = ANY (ARRAY['ngajigaes'::text, 'labbaika'::text, 'alaika'::text]))
    "campaign_snapshots_level_check" CHECK (level = ANY (ARRAY['campaign'::text, 'adset'::text, 'ad'::text]))
```

## 10. Schema inspection: `campaign_kpi_targets`

Command:
```bash
psql --no-psqlrc -h /private/tmp/adslab_pg_socket_rev -d task002_validation_1142 -c "\d campaign_kpi_targets"
```

Output:
```text
                         Table "public.campaign_kpi_targets"
    Column    |           Type           | Collation | Nullable |      Default
--------------+--------------------------+-----------+----------+--------------------
 id           | uuid                     |           | not null | uuid_generate_v4()
 brand        | text                     |           | not null |
 campaign_id  | text                     |           | not null |
 kpi_type     | text                     |           | not null |
 target_value | numeric(12,4)            |           | not null |
 set_by       | text                     |           |          |
 created_at   | timestamp with time zone |           |          | now()
Indexes:
    "campaign_kpi_targets_pkey" PRIMARY KEY, btree (id)
    "campaign_kpi_targets_campaign_id_kpi_type_key" UNIQUE CONSTRAINT, btree (campaign_id, kpi_type)
Check constraints:
    "campaign_kpi_targets_brand_check" CHECK (brand = ANY (ARRAY['ngajigaes'::text, 'labbaika'::text, 'alaika'::text]))
    "campaign_kpi_targets_kpi_type_check" CHECK (kpi_type = ANY (ARRAY['roas'::text, 'cpl'::text, 'cpp'::text, 'reach'::text, 'spend'::text]))
```

## 11. Idempotency re-run check

Command:
```bash
psql --no-psqlrc -h /private/tmp/adslab_pg_socket_rev -d task002_validation_1142 -v ON_ERROR_STOP=1 -f supabase/migrations/002_create_campaign_snapshots.sql
```

Output:
```text
psql:supabase/migrations/002_create_campaign_snapshots.sql:1: NOTICE:  extension "uuid-ossp" already exists, skipping
CREATE EXTENSION
psql:supabase/migrations/002_create_campaign_snapshots.sql:30: NOTICE:  relation "campaign_snapshots" already exists, skipping
CREATE TABLE
psql:supabase/migrations/002_create_campaign_snapshots.sql:41: NOTICE:  relation "campaign_kpi_targets" already exists, skipping
CREATE TABLE
psql:supabase/migrations/002_create_campaign_snapshots.sql:44: NOTICE:  relation "idx_campaign_snapshots_brand_date" already exists, skipping
CREATE INDEX
psql:supabase/migrations/002_create_campaign_snapshots.sql:47: NOTICE:  relation "idx_campaign_snapshots_campaign_level" already exists, skipping
CREATE INDEX
psql:supabase/migrations/002_create_campaign_snapshots.sql:50: NOTICE:  relation "idx_campaign_snapshots_fetched_at" already exists, skipping
CREATE INDEX
```

## 12. Verification note

Catatan:
```text
Verifikasi TASK-002 dijalankan pada database bersih `task002_validation_1142` di cluster PostgreSQL lokal sementara pada socket `/private/tmp/adslab_pg_socket_rev`. Selain check command dari task, migration juga divalidasi lewat eksekusi nyata dan inspeksi schema hasilnya.
```
