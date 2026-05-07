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
