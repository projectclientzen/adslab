# TEST_RESULTS — TASK-001

Tanggal: 2026-05-07

## 1. File existence

Command:
```bash
ls -la supabase/migrations/001_create_ads_detail.sql
```

Output:
```text
-rw-r--r--  1 maszen  admin  1044 May  7 15:52 supabase/migrations/001_create_ads_detail.sql
```

## 2. Required field presence check

Command:
```bash
grep -E "library_id|ad_copy|creative_type|cta_button|destination_url|date_active|funnel_type|funnel_override|campaign_stage|stage_confidence|stage_override" supabase/migrations/001_create_ads_detail.sql | wc -l
```

Output:
```text
13
```

Catatan: hasil `13` valid karena beberapa field yang dicek muncul pada baris `CHECK` constraint yang sama dengan definisinya.

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

## 5. Index definition check

Command:
```bash
grep "CREATE INDEX" supabase/migrations/001_create_ads_detail.sql
```

Output:
```text
CREATE INDEX IF NOT EXISTS idx_ads_detail_library_id ON ads_detail(library_id);
CREATE INDEX IF NOT EXISTS idx_ads_detail_advertiser ON ads_detail(advertiser_name);
CREATE INDEX IF NOT EXISTS idx_ads_detail_funnel ON ads_detail(funnel_type);
CREATE INDEX IF NOT EXISTS idx_ads_detail_created ON ads_detail(created_at DESC);
```

## 6. PostgreSQL availability

Command:
```bash
psql --version
```

Output:
```text
psql (PostgreSQL) 14.21 (Homebrew)
```

## 7. Real parser validation with temporary local PostgreSQL

Command:
```bash
env LC_ALL=C LANG=C initdb -D /private/tmp/adslab_pg_task001
```

Output:
```text
The files belonging to this database system will be owned by user "maszen".
This user must also own the server process.

The database cluster will be initialized with locale "C".
The default database encoding has accordingly been set to "SQL_ASCII".
The default text search configuration will be set to "english".

Data page checksums are disabled.

creating directory /private/tmp/adslab_pg_task001 ... ok
creating subdirectories ... ok
selecting dynamic shared memory implementation ... posix
selecting default max_connections ... 100
selecting default shared_buffers ... 128MB
selecting default time zone ... Asia/Jakarta
creating configuration files ... ok
running bootstrap script ... ok
performing post-bootstrap initialization ... ok
syncing data to disk ... initdb: warning: enabling "trust" authentication for local connections
You can change this by editing pg_hba.conf or using the option -A, or
--auth-local and --auth-host, the next time you run initdb.
ok
```

Command:
```bash
mkdir -p /private/tmp/adslab_pg_socket
pg_ctl -D /private/tmp/adslab_pg_task001 -l /private/tmp/adslab_pg_task001.log -o "-k /private/tmp/adslab_pg_socket" start
```

Output:
```text
waiting for server to start.... done
server started
```

Command:
```bash
psql --no-psqlrc -h /private/tmp/adslab_pg_socket -d postgres -v ON_ERROR_STOP=1 -f supabase/migrations/001_create_ads_detail.sql
```

Output:
```text
CREATE EXTENSION
CREATE TABLE
CREATE INDEX
CREATE INDEX
CREATE INDEX
CREATE INDEX
```

Command:
```bash
psql --no-psqlrc -h /private/tmp/adslab_pg_socket -d postgres -c "\d ads_detail"
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
    "idx_ads_detail_library_id" btree (library_id)
Check constraints:
    "ads_detail_campaign_stage_check" CHECK (campaign_stage = ANY (ARRAY['TOFU'::text, 'MOFU'::text, 'BOFU'::text]))
    "ads_detail_creative_type_check" CHECK (creative_type = ANY (ARRAY['image'::text, 'video'::text, 'carousel'::text]))
    "ads_detail_funnel_type_check" CHECK (funnel_type = ANY (ARRAY['LP'::text, 'CTWA'::text, 'Visit Profile'::text, 'Lead Form'::text]))
    "ads_detail_stage_confidence_check" CHECK (stage_confidence >= 0::double precision AND stage_confidence <= 1::double precision)
```

## 8. Idempotency re-run check

Command:
```bash
psql --no-psqlrc -h /private/tmp/adslab_pg_socket -d postgres -v ON_ERROR_STOP=1 -f supabase/migrations/001_create_ads_detail.sql
```

Output:
```text
psql:supabase/migrations/001_create_ads_detail.sql:1: NOTICE:  extension "uuid-ossp" already exists, skipping
CREATE EXTENSION
CREATE TABLE
psql:supabase/migrations/001_create_ads_detail.sql:18: NOTICE:  relation "ads_detail" already exists, skipping
psql:supabase/migrations/001_create_ads_detail.sql:20: NOTICE:  relation "idx_ads_detail_library_id" already exists, skipping
CREATE INDEX
CREATE INDEX
psql:supabase/migrations/001_create_ads_detail.sql:21: NOTICE:  relation "idx_ads_detail_advertiser" already exists, skipping
CREATE INDEX
psql:supabase/migrations/001_create_ads_detail.sql:22: NOTICE:  relation "idx_ads_detail_funnel" already exists, skipping
CREATE INDEX
psql:supabase/migrations/001_create_ads_detail.sql:23: NOTICE:  relation "idx_ads_detail_created" already exists, skipping
```

## 9. Temporary database shutdown

Command:
```bash
pg_ctl -D /private/tmp/adslab_pg_task001 stop
```

Output:
```text
waiting for server to shut down.... done
server stopped
```
