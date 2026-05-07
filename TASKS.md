# ADS LAB — Task List v1.0

Urutan build mengikuti rekomendasi PRD v2.2 section 11.
Setiap task dirancang untuk dapat dikerjakan Codex secara mandiri tanpa ambiguitas.
TASK-001 adalah titik masuk yang paling kecil dan paling aman.

---

## Urutan Build

```
Foundation (TASK-001 s/d 004)
  → Phase 2A: Fix Extension (TASK-005 s/d 007)
  → Phase 3A: Dashboard Ads MVP (TASK-008 s/d 013)
  → Phase 2B: New Data Fields + Funnel (TASK-014 s/d 015)
  → Phase 3B: Alert + Suggest Engine (TASK-016 s/d 019)
  → Phase 2C: Integration (TASK-020)
  → Infrastructure (TASK-021 s/d 022)
```

---

## TASK-001 — Database Schema: Buat Migration File `ads_detail`

**Status**: TODO | **Priority**: P0 | **Phase**: Foundation

### Objective
Buat SQL migration file untuk tabel `ads_detail` sesuai spesifikasi PRD v2.2 section 3.5. Tabel ini adalah fondasi penyimpanan semua data iklan kompetitor hasil scraping Chrome Extension.

### Files Likely to Change
- `supabase/migrations/001_create_ads_detail.sql` ← file baru

### Implementation Notes
- Gunakan `CREATE TABLE IF NOT EXISTS` untuk idempotency
- Semua 14 field dari PRD 3.5 harus ada dengan tipe yang tepat:
  - `id UUID PRIMARY KEY DEFAULT uuid_generate_v4()`
  - `library_id TEXT UNIQUE NOT NULL` ← UNIQUE constraint untuk deduplication
  - `advertiser_name TEXT`
  - `ad_copy TEXT`
  - `creative_type TEXT CHECK (creative_type IN ('image', 'video', 'carousel'))`
  - `cta_button TEXT`
  - `destination_url TEXT`
  - `date_active TIMESTAMPTZ`
  - `funnel_type TEXT CHECK (funnel_type IN ('LP', 'CTWA', 'Visit Profile', 'Lead Form'))`
  - `funnel_override TEXT`
  - `campaign_stage TEXT CHECK (campaign_stage IN ('TOFU', 'MOFU', 'BOFU'))`
  - `stage_confidence FLOAT CHECK (stage_confidence >= 0 AND stage_confidence <= 1)`
  - `stage_override TEXT`
  - `created_at TIMESTAMPTZ DEFAULT NOW()`
- Tambahkan index untuk query patterns yang sering dipakai:
  - `CREATE INDEX idx_ads_detail_library_id ON ads_detail(library_id);`
  - `CREATE INDEX idx_ads_detail_advertiser ON ads_detail(advertiser_name);`
  - `CREATE INDEX idx_ads_detail_funnel ON ads_detail(funnel_type);`
  - `CREATE INDEX idx_ads_detail_created ON ads_detail(created_at DESC);`
- Aktifkan `uuid-ossp` extension di awal file: `CREATE EXTENSION IF NOT EXISTS "uuid-ossp";`
- Jangan tambahkan RLS di migration ini (beda task)

### Definition of Done
- [ ] File `supabase/migrations/001_create_ads_detail.sql` ada di repo
- [ ] Semua 14 field dari PRD 3.5 terdefinisi dengan tipe yang benar
- [ ] UNIQUE constraint pada `library_id`
- [ ] 4 indexes terdefinisi
- [ ] CHECK constraints pada `creative_type`, `funnel_type`, `campaign_stage`, `stage_confidence`
- [ ] File bisa di-parse tanpa error syntax

### Test / Check Command
```bash
# Cek file ada
ls supabase/migrations/001_create_ads_detail.sql

# Cek semua field dari PRD ada
grep -E "library_id|ad_copy|creative_type|cta_button|destination_url|date_active|funnel_type|funnel_override|campaign_stage|stage_confidence|stage_override" \
  supabase/migrations/001_create_ads_detail.sql | wc -l
# Expected output: 11 (atau lebih jika ada baris yang mengandung kata yang sama)

# Cek UNIQUE constraint ada
grep "UNIQUE" supabase/migrations/001_create_ads_detail.sql
# Expected: ada minimal 1 baris

# Validasi syntax SQL (jika ada psql terinstall)
psql --no-psqlrc -c "\i supabase/migrations/001_create_ads_detail.sql" 2>&1 | grep -i error
# Expected: tidak ada output (kosong = no errors)
```

---

## TASK-002 — Database Schema: Buat Migration File `campaign_snapshots`

**Status**: TODO | **Priority**: P0 | **Phase**: Foundation

### Objective
Buat SQL migration file untuk tabel `campaign_snapshots` — menyimpan snapshot performa harian dari Meta Ads API per brand. Tabel ini digunakan untuk Dashboard Ads dan fallback saat API down.

### Files Likely to Change
- `supabase/migrations/002_create_campaign_snapshots.sql` ← file baru

### Implementation Notes
- Schema tabel:
  - `id UUID PRIMARY KEY DEFAULT uuid_generate_v4()`
  - `brand TEXT NOT NULL CHECK (brand IN ('ngajigaes', 'labbaika', 'alaika'))`
  - `campaign_id TEXT NOT NULL` ← Meta campaign ID
  - `campaign_name TEXT NOT NULL`
  - `adset_id TEXT`
  - `adset_name TEXT`
  - `ad_id TEXT`
  - `ad_name TEXT`
  - `level TEXT NOT NULL CHECK (level IN ('campaign', 'adset', 'ad'))`
  - `date_start DATE NOT NULL`
  - `date_stop DATE NOT NULL`
  - `spend NUMERIC(12,2)`
  - `reach INTEGER`
  - `impressions INTEGER`
  - `clicks INTEGER`
  - `ctr NUMERIC(6,4)`
  - `cpm NUMERIC(10,2)`
  - `frequency NUMERIC(6,4)`
  - `purchases INTEGER`
  - `purchase_value NUMERIC(12,2)`
  - `leads INTEGER`
  - `roas NUMERIC(8,4)`
  - `cpl NUMERIC(10,2)`
  - `cpp NUMERIC(10,2)`
  - `status TEXT`
  - `fetched_at TIMESTAMPTZ DEFAULT NOW()`
- Tabel `campaign_kpi_targets` terpisah:
  - `id UUID PRIMARY KEY DEFAULT uuid_generate_v4()`
  - `brand TEXT NOT NULL`
  - `campaign_id TEXT NOT NULL`
  - `kpi_type TEXT NOT NULL` ← 'roas', 'cpl', 'cpp', 'reach', 'spend'
  - `target_value NUMERIC(12,4) NOT NULL`
  - `set_by TEXT`
  - `created_at TIMESTAMPTZ DEFAULT NOW()`
  - `UNIQUE(campaign_id, kpi_type)`
- Index: `(brand, date_start DESC)`, `(campaign_id, level)`, `(fetched_at DESC)`

### Definition of Done
- [ ] File `supabase/migrations/002_create_campaign_snapshots.sql` ada di repo
- [ ] Tabel `campaign_snapshots` dengan semua field terdefinisi
- [ ] Tabel `campaign_kpi_targets` terdefinisi
- [ ] CHECK constraints pada `brand` dan `level`
- [ ] Indexes terdefinisi

### Test / Check Command
```bash
ls supabase/migrations/002_create_campaign_snapshots.sql

grep -E "campaign_snapshots|campaign_kpi_targets" \
  supabase/migrations/002_create_campaign_snapshots.sql | wc -l
# Expected: ≥ 2 (satu untuk setiap CREATE TABLE)

grep "CHECK" supabase/migrations/002_create_campaign_snapshots.sql | wc -l
# Expected: ≥ 2
```

---

## TASK-003 — Buat Folder Structure Project

**Status**: TODO | **Priority**: P0 | **Phase**: Foundation

### Objective
Buat struktur folder final untuk seluruh project sesuai komponen PRD: Extension, Dashboard/Web App, Supabase, dan Config. Setiap folder memiliki README singkat agar Codex tahu apa isinya.

### Files Likely to Change
- `extension/.gitkeep` ← placeholder Chrome Extension
- `extension/README.md`
- `supabase/.gitkeep`
- `supabase/migrations/.gitkeep`
- `netlify.toml` ← Netlify config dasar
- `.env.example` ← template environment variables (NO actual secrets)
- `prototype_ui/` ← sudah ada, tidak diubah

### Implementation Notes
- Folder `extension/` untuk semua kode Chrome Extension (manifest.json, background.js, dll)
- Folder `supabase/migrations/` untuk file SQL migration
- File `.env.example` berisi placeholder, bukan nilai real:
  ```
  SUPABASE_URL=https://your-project.supabase.co
  SUPABASE_ANON_KEY=your-anon-key-here
  META_ACCESS_TOKEN_NGAJIGAES=your-token-here
  META_ACCESS_TOKEN_LABBAIKA=your-token-here
  META_ACCESS_TOKEN_ALAIKA=your-token-here
  TELEGRAM_BOT_TOKEN=your-bot-token-here
  TELEGRAM_CHAT_ID=your-chat-id-here
  ```
- File `netlify.toml` minimal:
  ```toml
  [build]
    publish = "prototype_ui"
  
  [[redirects]]
    from = "/*"
    to = "/index.html"
    status = 200
  ```
- JANGAN commit `.env` (sudah ada di .gitignore)

### Definition of Done
- [ ] Folder `extension/` ada
- [ ] Folder `supabase/migrations/` ada
- [ ] `.env.example` ada dengan 7 environment variable placeholder
- [ ] `netlify.toml` ada dengan `publish = "prototype_ui"`
- [ ] `.gitignore` mengandung `.env`

### Test / Check Command
```bash
# Cek folder structure
ls -la extension/ supabase/migrations/

# Cek .env.example punya semua vars
grep -c "=" .env.example
# Expected: 7

# Cek .gitignore ada .env
grep "^\.env$" .gitignore
# Expected: .env

# Cek netlify.toml
cat netlify.toml | grep "prototype_ui"
# Expected: ada baris yang mengandung "prototype_ui"
```

---

## TASK-004 — Buat Supabase Client Module

**Status**: TODO | **Priority**: P0 | **Phase**: Foundation

### Objective
Buat modul JavaScript reusable `supabaseClient.js` yang dapat digunakan oleh Web App dan (versi terpisah) oleh Chrome Extension untuk berkomunikasi dengan Supabase.

### Files Likely to Change
- `prototype_ui/supabaseClient.js` ← file baru
- `prototype_ui/index.html` ← tambah `<script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2">` di head

### Implementation Notes
- Gunakan Supabase CDN build (tidak perlu npm): `https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2`
- Config dibaca dari `window.SUPABASE_URL` dan `window.SUPABASE_ANON_KEY` — bukan hardcode
- Export `supabase` object sebagai global window variable: `window.supabase = supabase.createClient(...)`
- Sertakan config check: jika URL/key tidak ada, log warning jelas di console
- Contoh fungsi helper yang harus ada:
  - `fetchLatestSnapshot(brand, dateRange)` — ambil data terbaru dari `campaign_snapshots`
  - `fetchAdsIntelligence(filters)` — ambil dari `ads_detail` dengan filter funnel_type
  - `saveKpiTarget(campaignId, kpiType, value)` — insert/upsert ke `campaign_kpi_targets`
- File ini boleh return mock data jika `window.SUPABASE_URL` belum di-set (graceful degradation agar prototype tetap berjalan)

### Definition of Done
- [ ] File `prototype_ui/supabaseClient.js` ada
- [ ] Client inisialisasi menggunakan `window.SUPABASE_URL` dan `window.SUPABASE_ANON_KEY`
- [ ] Ada 3 fungsi helper: `fetchLatestSnapshot`, `fetchAdsIntelligence`, `saveKpiTarget`
- [ ] Jika env vars tidak ada, fungsi return mock data dan log warning
- [ ] Tidak ada hardcoded credentials di file

### Test / Check Command
```bash
# Cek tidak ada hardcoded credentials
grep -E "eyJ|https://[a-z].*\.supabase\.co" prototype_ui/supabaseClient.js
# Expected: 0 output (kosong)

# Cek 3 fungsi ada
grep -E "fetchLatestSnapshot|fetchAdsIntelligence|saveKpiTarget" prototype_ui/supabaseClient.js | wc -l
# Expected: ≥ 3

# Cek fallback mock ada
grep "mock\|fallback\|SUPABASE_URL" prototype_ui/supabaseClient.js | wc -l
# Expected: ≥ 3
```

---

## TASK-005 — Extension Phase 2A: GraphQL Intercept untuk LP URL

**Status**: TODO | **Priority**: P1 | **Phase**: 2A

### Objective
Implementasi `webRequest` listener di Chrome Extension untuk intercept GraphQL response dari Meta Ads Library, extract `destination_url` (LP URL) dari response JSON — menggantikan DOM parsing yang hanya berhasil ~30%.

### Files Likely to Change
- `extension/background.js` ← file baru atau modifikasi jika sudah ada
- `extension/manifest.json` ← tambah permission `webRequest` dan `https://www.facebook.com/*`

### Implementation Notes
- Gunakan `chrome.webRequest.onBeforeRequest` atau `chrome.declarativeNetRequest` (Manifest V3)
- Target URL pattern: `https://www.facebook.com/api/graphql/` dengan method POST
- Response body di-capture menggunakan `chrome.debugger` API (karena webRequest tidak expose response body di MV3)
- Alternatif: Gunakan `chrome.webRequest` + content script yang intercept `fetch` — inject script ke halaman Meta untuk override `window.fetch` dan capture response sebelum dikirim ke extension via `window.postMessage`
- Extract dari response JSON: field `destination_urls` atau `link_url` tergantung GraphQL query type
- Simpan mapping `library_id → destination_url` di `chrome.storage.session` untuk diakses content script
- JANGAN store full response (bisa sangat besar) — extract hanya field yang dibutuhkan

### Definition of Done
- [ ] `manifest.json` punya permission yang tepat untuk intercept network
- [ ] Background script berhasil capture LP URL dari GraphQL response
- [ ] LP URL tersimpan di `chrome.storage.session` ter-index by `library_id`
- [ ] Content script dapat membaca LP URL dari storage dan attach ke record iklan
- [ ] Test: manual scrape 10 iklan → 9+ harus punya LP URL ter-capture (≥90% sebagai awal, target 95%)

### Test / Check Command
```bash
# Load extension di Chrome → buka Meta Ads Library → buka DevTools Extension
# Di background service worker console:
chrome.storage.session.get(null, (data) => console.log(Object.keys(data).length))
# Expected: jumlah keys = jumlah iklan yang di-scrape

# Cek manifest permissions
grep -E "webRequest|debugger|declarativeNetRequest" extension/manifest.json
# Expected: ada salah satu dari permission tersebut
```

---

## TASK-006 — Extension Phase 2A: Deduplication sebelum Insert

**Status**: TODO | **Priority**: P1 | **Phase**: 2A

### Objective
Sebelum menyimpan iklan ke Supabase, cek apakah `library_id` sudah ada di database. Jika sudah ada, skip insert. Jika belum ada, proceed dengan insert.

### Files Likely to Change
- `extension/content.js` ← modifikasi fungsi insert/save
- `extension/background.js` ← jika insert dilakukan di background

### Implementation Notes
- Gunakan Supabase `upsert` dengan `onConflict: 'library_id'` dan `ignoreDuplicates: true`
  ```javascript
  const { error } = await supabase
    .from('ads_detail')
    .upsert(adRecord, { onConflict: 'library_id', ignoreDuplicates: true });
  ```
- Alternatif: Batch check sebelum insert — `SELECT library_id FROM ads_detail WHERE library_id IN (batch)`
- Prefer upsert approach karena atomic dan tidak butuh 2 round trips
- Log setiap skip ke extension popup counter: "X iklan baru, Y sudah ada (skip)"
- JANGAN update record yang sudah ada (jangan update `ad_copy` atau field lain) — hanya skip

### Definition of Done
- [ ] Insert menggunakan `upsert` dengan `ignoreDuplicates: true` atau equivalent
- [ ] Extension popup menampilkan counter "X baru / Y duplikat"
- [ ] Scrape domain yang sama 2 kali berturut-turut → jumlah records di DB tidak bertambah di run kedua

### Test / Check Command
```bash
# Setelah scrape 2x domain yang sama:
# Di Supabase SQL Editor:
# SELECT library_id, COUNT(*) FROM ads_detail GROUP BY library_id HAVING COUNT(*) > 1;
# Expected: 0 rows

# Cek kode menggunakan upsert atau check sebelum insert
grep -E "upsert|ignoreDuplicates|ON CONFLICT" extension/content.js extension/background.js
# Expected: ada minimal 1 match
```

---

## TASK-007 — Extension Phase 2A: IntersectionObserver Auto-scroll

**Status**: TODO | **Priority**: P1 | **Phase**: 2A

### Objective
Ganti mekanisme auto-scroll yang timer-based dengan IntersectionObserver yang mendeteksi kapan elemen "sentinel" (elemen terakhir di list iklan) masuk viewport, lalu trigger scroll + scrape otomatis.

### Files Likely to Change
- `extension/content.js` ← refactor fungsi auto-scroll

### Implementation Notes
- Hapus `setInterval`/`setTimeout` yang trigger scroll berdasarkan waktu
- Implementasi:
  ```javascript
  const sentinel = document.createElement('div');
  document.querySelector('[data-ads-container]').appendChild(sentinel);
  
  const observer = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting) {
      scrapeNewAds(); // scrape ads yang baru muncul
      window.scrollBy(0, 800);
    }
  }, { threshold: 0.1 });
  
  observer.observe(sentinel);
  ```
- Hentikan observer saat tidak ada ads baru yang muncul setelah 3 scroll berturut-turut (end of list detection)
- Tambahkan progress indicator di extension popup: "Scrolling... X/estimasi iklan"
- Gunakan selector yang tepat untuk container iklan Meta Ads Library (perlu inspect DOM aktual)

### Definition of Done
- [ ] Tidak ada `setInterval` atau `setTimeout` di fungsi scroll (kecuali untuk end-of-list delay)
- [ ] IntersectionObserver ter-implementasi dan berfungsi
- [ ] Observer berhenti otomatis saat end of list
- [ ] Test pada halaman dengan 300+ iklan — extension tidak berhenti di tengah

### Test / Check Command
```bash
# Cek tidak ada timer-based scroll
grep -E "setInterval|setTimeout" extension/content.js
# Expected: 0 match (atau hanya untuk end-of-list logic, bukan scroll trigger)

# Cek IntersectionObserver ada
grep "IntersectionObserver" extension/content.js
# Expected: ada match
```

---

## TASK-008 — Dashboard Phase 3A: Meta Ads API Client Module

**Status**: TODO | **Priority**: P1 | **Phase**: 3A

### Objective
Buat modul `metaAdsClient.js` yang menghandle authenticated fetch ke Meta Ads API untuk setiap brand. Module ini dijalankan sebagai Netlify Function (atau GitHub Actions scheduled job) — bukan dari browser.

### Files Likely to Change
- `netlify/functions/meta-fetch.js` ← file baru (Netlify Function)
- `netlify.toml` ← tambah `[functions]` section

### Implementation Notes
- Gunakan Meta Marketing API v20.0
- Endpoint: `https://graph.facebook.com/v20.0/act_{ACCOUNT_ID}/insights`
- Parameter yang diperlukan:
  ```javascript
  {
    fields: 'campaign_name,adset_name,ad_name,spend,reach,impressions,clicks,ctr,cpm,frequency,actions,action_values',
    level: 'ad', // ambil data paling granular, aggregate di atas
    date_preset: 'last_30d',
    access_token: process.env[`META_ACCESS_TOKEN_${brand.toUpperCase()}`]
  }
  ```
- Fetch per brand secara terpisah (token berbeda per brand sesuai addendum 7.2)
- Setelah fetch berhasil, simpan ke Supabase `campaign_snapshots` dengan `fetched_at = NOW()`
- Handle error: jika satu brand gagal, lanjutkan fetch brand lain (jangan stop semua)
- Return summary: `{ brand, success: true/false, count: X, error: null/message }`
- Tidak boleh menyimpan response mentah — transform dulu ke schema `campaign_snapshots`

### Definition of Done
- [ ] File `netlify/functions/meta-fetch.js` ada
- [ ] Fetch menggunakan token per brand dari env vars (tidak hardcode)
- [ ] Data ter-transform ke schema `campaign_snapshots` sebelum di-upsert ke Supabase
- [ ] Error satu brand tidak menghentikan fetch brand lain
- [ ] Return nilai `fetched_at` yang bisa dipakai untuk freshness indicator

### Test / Check Command
```bash
# Cek tidak ada hardcoded tokens
grep -E "EAA|access_token.*=.*[A-Za-z0-9]{20}" netlify/functions/meta-fetch.js
# Expected: 0 output

# Test dengan Netlify CLI (jika terinstall)
netlify functions:invoke meta-fetch --no-identity 2>&1 | head -20

# Cek struktur response di code
grep -E "success|fetched_at|error" netlify/functions/meta-fetch.js | wc -l
# Expected: ≥ 3
```

---

## TASK-009 — Dashboard Phase 3A: Scheduled Fetch Job

**Status**: TODO | **Priority**: P1 | **Phase**: 3A

### Objective
Setup cron job yang memanggil `meta-fetch` function setiap 4 jam secara otomatis via Netlify Scheduled Functions (atau GitHub Actions). Ini menggantikan real-time fetch per request.

### Files Likely to Change
- `netlify/functions/meta-fetch-scheduled.js` ← wrapper dengan schedule config
- `netlify.toml` ← tambah schedule config

### Implementation Notes
- Netlify Scheduled Functions syntax:
  ```javascript
  export const config = { schedule: "0 */4 * * *" }; // setiap 4 jam
  export default async function handler() {
    // panggil logika dari meta-fetch.js
  }
  ```
- Alternatif: GitHub Actions workflow dengan `schedule: cron: '0 */4 * * *'` yang hit Netlify webhook
- Setelah fetch, update tabel `fetch_status` di Supabase:
  - `brand`, `last_fetched_at`, `status` (success/error), `error_message`
  - Tabel ini digunakan Dashboard UI untuk menampilkan freshness indicator
- Buat tabel sederhana `fetch_status` (3 baris — satu per brand)

### Definition of Done
- [ ] Scheduled function terkonfigurasi dengan interval 4 jam
- [ ] Tabel `fetch_status` di-update setiap run
- [ ] Log setiap execution (berhasil/gagal) dengan timestamp

### Test / Check Command
```bash
# Cek schedule config ada
grep "schedule\|cron" netlify/functions/meta-fetch-scheduled.js netlify.toml
# Expected: ada match dengan pola cron

# Verify tabel fetch_status di migration files
grep "fetch_status" supabase/migrations/*.sql
# Expected: ada definisi tabel
```

---

## TASK-010 — Dashboard Phase 3A: Hubungkan SPA ke Data Real

**Status**: TODO | **Priority**: P1 | **Phase**: 3A

### Objective
Modifikasi `prototype_ui/app.js` untuk membaca data dari Supabase (via `supabaseClient.js`) menggantikan mock data hardcoded. Prototype tetap berfungsi dengan mock jika Supabase belum dikonfigurasi.

### Files Likely to Change
- `prototype_ui/app.js` ← refactor `renderDashboard()` dan `renderIntelligence()`
- `prototype_ui/index.html` ← tambah script tag supabaseClient.js

### Implementation Notes
- Tambahkan flag `USE_REAL_DATA = !!window.SUPABASE_URL` di awal app.js
- Jika `USE_REAL_DATA = false`, gunakan data mock yang sudah ada (tidak ubah perilaku prototype)
- Jika `USE_REAL_DATA = true`:
  - `renderDashboard()` memanggil `fetchLatestSnapshot(state.brand, state.range)` dari supabaseClient.js
  - Data di-transform dari schema DB ke format yang diexpect oleh render function
  - Loading state: tampilkan skeleton/spinner saat fetch berlangsung
- Fungsi render TIDAK perlu direfactor besar-besaran — hanya sumber data yang berubah
- Freshness indicator: baca `fetch_status` dari Supabase → tampilkan "Last updated X menit lalu" di topbar

### Definition of Done
- [ ] `app.js` memiliki flag `USE_REAL_DATA`
- [ ] Ketika `USE_REAL_DATA = false`, prototype berjalan persis seperti sebelumnya
- [ ] Ketika `USE_REAL_DATA = true`, data di-fetch dari Supabase
- [ ] Loading state ter-implementasi
- [ ] Freshness timestamp tampil di topbar

### Test / Check Command
```bash
# Buka prototype_ui/index.html di browser → semua section masih render dengan benar
# Open console → tidak ada uncaught errors

# Cek flag ada
grep "USE_REAL_DATA" prototype_ui/app.js
# Expected: ada definisi dan penggunaannya

# Cek loading state
grep -E "loading|skeleton|spinner" prototype_ui/app.js prototype_ui/styles.css | wc -l
# Expected: ≥ 2
```

---

## TASK-011 — Dashboard Phase 3A: Fallback + Stale Data Banner

**Status**: TODO | **Priority**: P1 | **Phase**: 3A

### Objective
Implementasi logika fallback di Dashboard SPA: jika fetch dari Supabase gagal atau data lebih lama dari threshold, tampilkan banner warning dengan timestamp terakhir data valid.

### Files Likely to Change
- `prototype_ui/app.js` ← tambah `checkFreshness()` dan banner logic
- `prototype_ui/styles.css` ← styling banner (kuning/merah) — sudah ada `.fallback-banner` partial

### Implementation Notes
- Threshold freshness:
  - `< 4 jam` → normal, tidak ada banner
  - `4–6 jam` → banner kuning: "Data dari X jam lalu — sedang refresh"
  - `> 6 jam` → banner merah: "Data mungkin tidak akurat — cek Ads Manager"
- Banner ditampilkan di bawah topbar, tidak mengganggu layout utama
- Jika `fetchLatestSnapshot()` throw error (network/Supabase down):
  - Coba baca dari `localStorage` key `adslab_snapshot_{brand}`
  - Jika ada, gunakan data tersebut + tampilkan banner dengan timestamp dari localStorage
  - Jika tidak ada, tampilkan error state yang jelas (bukan blank/broken UI)
- Simpan snapshot terakhir ke `localStorage` setiap kali fetch berhasil

### Definition of Done
- [ ] Banner kuning muncul saat data 4–6 jam
- [ ] Banner merah muncul saat data > 6 jam atau fetch error
- [ ] Fallback ke localStorage jika Supabase tidak tersedia
- [ ] Timestamp terakhir fetch tampil di banner
- [ ] Tidak ada blank/broken UI dalam kondisi apapun

### Test / Check Command
```bash
# Simulasi di browser: DevTools → Application → Local Storage → set timestamp lama
# Refresh → verify banner muncul

# Cek localStorage logic ada
grep "localStorage" prototype_ui/app.js | wc -l
# Expected: ≥ 2 (satu untuk write, satu untuk read)

# Cek threshold logic
grep -E "4.*jam|6.*jam|hours.*4|hours.*6" prototype_ui/app.js
# Expected: ada kondisi threshold
```

---

## TASK-012 — Dashboard Phase 3A: KPI Target Config (Admin)

**Status**: TODO | **Priority**: P1 | **Phase**: 3A

### Objective
Implementasi fitur Admin untuk set dan edit target KPI per campaign. Perubahan disimpan ke Supabase `campaign_kpi_targets`. Status indicator (hijau/kuning/merah) dihitung dinamis berdasarkan target yang di-set.

### Files Likely to Change
- `prototype_ui/app.js` ← tambah `renderKpiConfig()`, `saveKpiTarget()`, status calculation
- `prototype_ui/index.html` ← tambah modal/inline edit untuk KPI config
- `prototype_ui/styles.css` ← styling edit mode, inline input

### Implementation Notes
- Role sistem sederhana: `window.IS_ADMIN = true/false` — di-set dari URL param `?admin=1` untuk MVP (auth proper di Phase 4)
- Jika `IS_ADMIN = true`: tampilkan edit icon di setiap campaign row; klik → inline input muncul
- Jika `IS_ADMIN = false`: hanya tampil nilai target, tidak ada edit control
- Status calculation per campaign:
  ```javascript
  function getStatus(actual, target, metric) {
    const ratio = metric === 'cpl' || metric === 'cpp'
      ? target / actual  // lower is better
      : actual / target; // higher is better (roas, reach)
    if (ratio >= 1.0) return 'good';
    if (ratio >= 0.9) return 'caution';
    return 'risk';
  }
  ```
- Default targets dari mock data tetap digunakan jika belum ada data di Supabase

### Definition of Done
- [ ] `?admin=1` URL param menampilkan edit controls di campaign table
- [ ] Edit + save berhasil upsert ke `campaign_kpi_targets`
- [ ] Status indicator (hijau/kuning/merah) dihitung dari actual vs target
- [ ] Tanpa `?admin=1`, tidak ada edit control yang tampil

### Test / Check Command
```bash
# Buka prototype_ui/index.html?admin=1 di browser
# → edit icon harus tampil di campaign rows
# Buka tanpa ?admin=1 → tidak ada edit icon

grep "IS_ADMIN\|admin=1\|admin.*param" prototype_ui/app.js | wc -l
# Expected: ≥ 3

grep "getStatus\|ratio\|good.*caution\|caution.*risk" prototype_ui/app.js | wc -l
# Expected: ≥ 3
```

---

## TASK-013 — Dashboard Phase 3A: Alert Engine — 7 Tipe Alert

**Status**: TODO | **Priority**: P1 | **Phase**: 3A

### Objective
Implementasi rule-based alert engine yang mengevaluasi data performa dan menghasilkan alert dengan diagnosis + suggest action untuk 7 kondisi dari PRD 2.6.

### Files Likely to Change
- `prototype_ui/alertEngine.js` ← file baru (pure function, tidak ada side effects)
- `prototype_ui/app.js` ← integrasikan `runAlertEngine()` ke `renderDashboard()`

### Implementation Notes
- Buat sebagai pure function module: input = data campaign, output = array of alert objects
- Schema alert object:
  ```javascript
  {
    level: 'warning' | 'danger' | 'success',
    type: 'budget_warning' | 'cpl_anomaly' | 'roas_drop' | 'no_delivery' | 'ad_fatigue' | 'failed_test' | 'winning_ad',
    title: 'string',
    diagnosis: 'string',
    action: 'string',
    campaign_id: 'string',
    triggered_at: Date
  }
  ```
- 7 kondisi dari PRD 2.6:
  1. Budget Warning: `remaining_budget / total_budget < 0.20`
  2. CPL Anomaly: `current_cpl > baseline_cpl * (1 + threshold)`
  3. ROAS Drop: `current_roas < target_roas` selama 2 hari berturut-turut
  4. No Delivery: `reach === 0` untuk ad aktif dalam X jam
  5. Ad Fatigue: `frequency > 3.0` dalam 7 hari
  6. Failed Test: `spend > threshold && (leads === 0 || purchases === 0)`
  7. Winning Ad: scoring system detect top performer (dari TASK-016)
- Engine pure function — tidak boleh ada `fetch`, `console.log`, atau DOM manipulation
- Diagnosis dan suggest action berdasarkan tabel addendum 7.1 PRD

### Definition of Done
- [ ] File `alertEngine.js` ada sebagai pure function module
- [ ] Semua 7 kondisi ter-implementasi dengan kondisi trigger yang tepat
- [ ] Setiap alert object memiliki `title`, `diagnosis`, dan `action` yang tidak kosong
- [ ] Engine ter-integrasi di `renderDashboard()` — hasilnya tampil di alert list

### Test / Check Command
```bash
# Cek 7 tipe alert terdefinisi
grep -E "budget_warning|cpl_anomaly|roas_drop|no_delivery|ad_fatigue|failed_test|winning_ad" \
  prototype_ui/alertEngine.js | wc -l
# Expected: ≥ 7

# Cek engine adalah pure function (tidak ada fetch/DOM)
grep -E "fetch\|document\.|window\." prototype_ui/alertEngine.js
# Expected: 0 output

# Test manual di browser console:
# const alerts = runAlertEngine(dashboardData.ngajigaes)
# alerts.forEach(a => console.log(a.type, a.diagnosis))
```

---

## TASK-014 — Extension Phase 2B: Capture Field Baru

**Status**: TODO | **Priority**: P2 | **Phase**: 2B

### Objective
Extend data capture di Chrome Extension untuk menyimpan field baru: `ad_copy`, `creative_type`, `cta_button`, dan `date_active` ke tabel `ads_detail`.

### Files Likely to Change
- `extension/content.js` ← tambah selector dan extract logic untuk field baru

### Implementation Notes
- `creative_type`: deteksi dari DOM — ada elemen `<video>` → 'video'; ada multiple gambar → 'carousel'; default → 'image'
- `cta_button`: extract text dari elemen CTA button Meta (biasanya class yang mengandung "cta" atau role="button" di area iklan)
- `ad_copy`: extract text dari body iklan — biasanya div dengan role="text" atau class ad-body
- `date_active`: dari GraphQL intercept (TASK-005) atau DOM element yang menampilkan "Active since X"
- Handle gracefully jika field tidak ditemukan (null, jangan error)
- Semua field di-sanitize: strip HTML tags, trim whitespace, truncate jika > 2000 chars

### Definition of Done
- [ ] Content script extract `creative_type`, `cta_button`, `ad_copy`, `date_active`
- [ ] Null handling: field tidak ditemukan → `null` (bukan string kosong atau error)
- [ ] Sanitasi: no HTML tags, trimmed, max length enforced
- [ ] Spot-check: 10 iklan manual → semua 4 field ter-capture atau null dengan alasan jelas

### Test / Check Command
```bash
grep -E "creative_type|cta_button|ad_copy|date_active" extension/content.js | wc -l
# Expected: ≥ 4 (satu untuk setiap field)

# Setelah scrape:
# SELECT ad_copy, creative_type, cta_button FROM ads_detail WHERE created_at > NOW() - INTERVAL '1 hour' LIMIT 5;
# Minimal 80% baris harus punya ad_copy atau creative_type terisi
```

---

## TASK-015 — Extension Phase 2B: Funnel Classifier

**Status**: TODO | **Priority**: P2 | **Phase**: 2B

### Objective
Implementasi logika klasifikasi funnel type (LP / CTWA / Visit Profile / Lead Form) berdasarkan tabel PRD 3.3 menggunakan kombinasi CTA text + URL pattern matching.

### Files Likely to Change
- `extension/funnelClassifier.js` ← file baru (pure function)
- `extension/content.js` ← integrasikan classifier

### Implementation Notes
- Berdasarkan PRD 3.3:
  ```javascript
  function classifyFunnel(ctaText, destinationUrl) {
    const url = destinationUrl || '';
    const cta = (ctaText || '').toLowerCase();
    
    if (/wa\.me|m\.me|api\.whatsapp\.com/.test(url) || cta.includes('send message')) {
      return 'CTWA';
    }
    if (/facebook\.com\/lead_gen|leadgen/.test(url) || cta.includes('sign up')) {
      return 'Lead Form';
    }
    if (!url || /facebook\.com|instagram\.com/.test(url) || cta.includes('view profile')) {
      return 'Visit Profile';
    }
    return 'LP'; // default: ada external URL
  }
  ```
- Pure function — no side effects, no fetch
- Handle case sensitivity, trim whitespace pada input
- Return confidence score sederhana: 1.0 untuk exact match, 0.8 untuk partial match

### Definition of Done
- [ ] File `funnelClassifier.js` ada sebagai pure function
- [ ] Semua 4 tipe funnel dapat dideteksi
- [ ] Urutan prioritas: CTWA → Lead Form → Visit Profile → LP (fallback)
- [ ] Accuracy ≥ 90% diverifikasi manual pada 20 test cases

### Test / Check Command
```bash
# Unit test manual di Node.js:
node -e "
const { classifyFunnel } = require('./extension/funnelClassifier.js');
console.assert(classifyFunnel('Send Message', 'wa.me/628xxx') === 'CTWA', 'CTWA test failed');
console.assert(classifyFunnel('Sign Up', 'facebook.com/lead_gen/xyz') === 'Lead Form', 'Lead Form test failed');
console.assert(classifyFunnel('View Profile', '') === 'Visit Profile', 'Visit Profile test failed');
console.assert(classifyFunnel('Learn More', 'labbaikatravel.com/umroh') === 'LP', 'LP test failed');
console.log('All tests passed');
"
```

---

## TASK-016 — Alert Phase 3B: Winning Ad Scoring System

**Status**: TODO | **Priority**: P1 | **Phase**: 3B

### Objective
Implementasi scoring system yang menilai setiap ad berdasarkan bobot KPI per brand (PRD 2.6) dan menghasilkan top 3 winning ads per brand.

### Files Likely to Change
- `prototype_ui/scoringEngine.js` ← file baru (pure function)
- `prototype_ui/alertEngine.js` ← integrasikan winning ad result

### Implementation Notes
- Bobot dari PRD 2.6:
  ```javascript
  const WEIGHTS = {
    ngajigaes: { roas: 0.40, cpp: 0.30, ctr: 0.30 },
    labbaika:  { cpl: 0.40, ctr: 0.30, reach_efficiency: 0.30 },
    alaika:    { cpl: 0.40, ctr: 0.30, reach_efficiency: 0.30 }
  };
  ```
- Normalize setiap metric ke 0-1 scale sebelum multiply dengan bobot
- `reach_efficiency = reach / spend` (reach per rupiah)
- Untuk CPL dan CPP: nilai lebih rendah lebih baik → normalize dengan `min / value`
- Untuk ROAS, CTR, reach_efficiency: nilai lebih tinggi lebih baik → normalize dengan `value / max`
- Output: array top 3 ads diurutkan dari skor tertinggi, dengan skor 0-100

### Definition of Done
- [ ] File `scoringEngine.js` ada sebagai pure function
- [ ] Bobot per brand sesuai PRD 2.6
- [ ] Normalisasi metrik benar (lower-is-better vs higher-is-better)
- [ ] Output top 3 per brand dengan skor 0-100

### Test / Check Command
```bash
# Cek bobot sesuai PRD
grep -E "0\.40|0\.30" prototype_ui/scoringEngine.js | wc -l
# Expected: ≥ 6 (3 brand × 2 bobot)

# Node.js test:
node -e "
const { scoreAds } = require('./prototype_ui/scoringEngine.js');
const mockAds = [/* 5 mock ads */];
const result = scoreAds('ngajigaes', mockAds);
console.assert(result.length === 3, 'Should return top 3');
console.assert(result[0].score > result[1].score, 'Should be sorted descending');
console.log('Scoring test passed, top score:', result[0].score);
"
```

---

## TASK-017 — Alert Phase 3B: Telegram Bot Integration

**Status**: TODO | **Priority**: P1 | **Phase**: 3B

### Objective
Setup Telegram Bot dan implementasi fungsi `sendTelegramAlert()` yang mengirim notifikasi setiap kali alert engine mendeteksi kondisi trigger.

### Files Likely to Change
- `netlify/functions/send-alert.js` ← file baru (Netlify Function)
- `netlify/functions/meta-fetch-scheduled.js` ← panggil send-alert setelah deteksi anomaly

### Implementation Notes
- Bot token dari `process.env.TELEGRAM_BOT_TOKEN`
- Chat ID dari `process.env.TELEGRAM_CHAT_ID`
- Format pesan (sesuai PRD 7.1):
  ```
  🚨 [ROAS DROP] Ngajigaes.id
  
  Kondisi: ROAS 2.7x selama 2 hari berturut-turut
  Diagnosis: CTR turun + frequency naik ke 3.1
  Aksi: Refresh hook utama, rotasi creative, tahan spend adset terlemah
  
  Campaign: Warm Audience Bundle
  Waktu: 07 Mei 2026 14:32 WIB
  ```
- Gunakan Telegram Bot API sendMessage: `https://api.telegram.org/bot{TOKEN}/sendMessage`
- Rate limit: Telegram membatasi 30 messages/second — tidak masalah untuk skala ini
- Jangan kirim duplikat: simpan alert yang sudah dikirim ke Supabase tabel `alert_log` dengan `sent_at`

### Definition of Done
- [ ] Function `send-alert.js` ada
- [ ] Format pesan mengikuti template 3-bagian: kondisi, diagnosis, aksi
- [ ] Tidak ada duplikat notifikasi (cek `alert_log` sebelum kirim)
- [ ] Tidak ada credentials hardcoded

### Test / Check Command
```bash
# Cek tidak ada hardcoded token
grep "bot[0-9]" netlify/functions/send-alert.js
# Expected: 0 output

# Test kirim pesan (butuh env vars):
TELEGRAM_BOT_TOKEN=xxx TELEGRAM_CHAT_ID=xxx \
  netlify functions:invoke send-alert \
  --payload '{"type":"budget_warning","brand":"ngajigaes","diagnosis":"test"}'
# Expected: pesan masuk ke Telegram
```

---

## TASK-018 — Phase 2C: Sync Funnel Labels ke Dashboard Ads

**Status**: TODO | **Priority**: P2 | **Phase**: 2C

### Objective
Baca `funnel_type` dari tabel `ads_detail` (hasil classify Extension) dan tampilkan sebagai label di Ad-level breakdown Dashboard Ads, sehingga tim dapat melihat funnel type per ad dalam satu view.

### Files Likely to Change
- `prototype_ui/app.js` ← modifikasi render ad row untuk include funnel label
- `prototype_ui/supabaseClient.js` ← tambah `fetchFunnelLabels(adIds)` helper

### Implementation Notes
- Di `renderDashboard()`, setelah render campaign breakdown, fetch funnel labels dari `ads_detail` untuk ad IDs yang tampil
- Join `campaign_snapshots.ad_id` dengan `ads_detail.library_id` (atau field yang equivalent)
- Tampilkan sebagai badge kecil di samping nama ad: `LP`, `CTWA`, `Visit Profile`, `Lead Form`
- Gunakan CSS classes yang sudah ada: `.tag.gold` (LP), `.tag.mint` (CTWA), dll
- Jika funnel label tidak ada di `ads_detail`, tampilkan `-`

### Definition of Done
- [ ] Ad row di breakdown menampilkan funnel label badge
- [ ] Label di-fetch dari `ads_detail` (bukan mock)
- [ ] Graceful: jika tidak ada data, tampilkan `-` tanpa error

### Test / Check Command
```bash
grep "funnel.*label\|fetchFunnelLabels\|funnel_type.*badge" prototype_ui/app.js prototype_ui/supabaseClient.js | wc -l
# Expected: ≥ 2

# Buka Dashboard Ads → expand campaign → ad row harus punya funnel label badge
```

---

## TASK-019 — Infrastructure: Supabase Anti-Pause Cron Job

**Status**: TODO | **Priority**: P1 | **Phase**: Infrastructure

### Objective
Buat GitHub Actions workflow yang ping Supabase setiap 3 hari untuk mencegah auto-pause pada free tier.

### Files Likely to Change
- `.github/workflows/supabase-keepalive.yml` ← file baru

### Implementation Notes
- Gunakan `on: schedule: cron: '0 9 */3 * *'` (jam 9 pagi setiap 3 hari)
- Ping: HTTP GET ke `${SUPABASE_URL}/rest/v1/ads_detail?select=id&limit=1` dengan header `apikey: ${SUPABASE_ANON_KEY}`
- Response 200 = berhasil; selain itu = kirim notifikasi Telegram
- Credentials dari GitHub repository secrets (bukan hardcode)

### Definition of Done
- [ ] File `.github/workflows/supabase-keepalive.yml` ada
- [ ] Schedule setiap 3 hari
- [ ] Menggunakan GitHub Secrets untuk credentials
- [ ] Notifikasi jika ping gagal

### Test / Check Command
```bash
# Cek schedule ada
grep "schedule\|cron" .github/workflows/supabase-keepalive.yml
# Expected: ada cron expression

# Cek tidak ada hardcoded credentials
grep -E "eyJ|https://[a-z].*\.supabase\.co" .github/workflows/supabase-keepalive.yml
# Expected: 0 output (hanya ${{ secrets.xxx }})

# Manual trigger di GitHub Actions → Actions tab → supabase-keepalive → Run workflow
```

---

## TASK-020 — Infrastructure: Netlify Deploy Config

**Status**: TODO | **Priority**: P1 | **Phase**: Infrastructure

### Objective
Finalisasi `netlify.toml` dan setup environment variables di Netlify dashboard agar deploy berjalan otomatis dan aman.

### Files Likely to Change
- `netlify.toml` ← update dari TASK-003
- `netlify/functions/` ← pastikan semua functions terdaftar

### Implementation Notes
- `netlify.toml` final:
  ```toml
  [build]
    publish = "prototype_ui"
    functions = "netlify/functions"
  
  [build.environment]
    NODE_VERSION = "20"
  
  [[redirects]]
    from = "/*"
    to = "/index.html"
    status = 200
  ```
- Environment variables yang harus di-set di Netlify UI (bukan di file):
  - `SUPABASE_URL`, `SUPABASE_ANON_KEY`
  - `META_ACCESS_TOKEN_NGAJIGAES`, `META_ACCESS_TOKEN_LABBAIKA`, `META_ACCESS_TOKEN_ALAIKA`
  - `TELEGRAM_BOT_TOKEN`, `TELEGRAM_CHAT_ID`
- Tidak ada secret di `netlify.toml` atau file repo

### Definition of Done
- [ ] `netlify.toml` ada dengan `publish = "prototype_ui"` dan `functions = "netlify/functions"`
- [ ] Tidak ada secret di `netlify.toml`
- [ ] Checklist di README tentang env vars yang harus di-set manual di Netlify

### Test / Check Command
```bash
grep -E "SUPABASE_KEY|ACCESS_TOKEN|BOT_TOKEN" netlify.toml
# Expected: 0 output

cat netlify.toml | grep "prototype_ui"
# Expected: ada baris publish atau reference

# Deploy test:
# git push origin main → pantau Netlify dashboard → deploy berhasil dalam < 3 menit
```

---

## Summary Table

| Task | Phase | Priority | Estimated Effort | Dependency |
|---|---|---|---|---|
| TASK-001 | Foundation | P0 | 30 menit | — |
| TASK-002 | Foundation | P0 | 30 menit | — |
| TASK-003 | Foundation | P0 | 20 menit | — |
| TASK-004 | Foundation | P0 | 1 jam | TASK-001, 002 |
| TASK-005 | Phase 2A | P1 | 3 jam | TASK-003 |
| TASK-006 | Phase 2A | P1 | 1 jam | TASK-001, 005 |
| TASK-007 | Phase 2A | P1 | 2 jam | TASK-005 |
| TASK-008 | Phase 3A | P1 | 4 jam | TASK-003 |
| TASK-009 | Phase 3A | P1 | 2 jam | TASK-008 |
| TASK-010 | Phase 3A | P1 | 3 jam | TASK-004, 009 |
| TASK-011 | Phase 3A | P1 | 2 jam | TASK-010 |
| TASK-012 | Phase 3A | P1 | 3 jam | TASK-010 |
| TASK-013 | Phase 3A | P1 | 3 jam | TASK-010 |
| TASK-014 | Phase 2B | P2 | 2 jam | TASK-005 |
| TASK-015 | Phase 2B | P2 | 2 jam | TASK-014 |
| TASK-016 | Phase 3B | P1 | 2 jam | TASK-013 |
| TASK-017 | Phase 3B | P1 | 2 jam | TASK-013 |
| TASK-018 | Phase 2C | P2 | 2 jam | TASK-010, 015 |
| TASK-019 | Infra | P1 | 1 jam | TASK-001 |
| TASK-020 | Infra | P1 | 30 menit | TASK-003 |

**TASK-001 adalah titik masuk yang direkomendasikan untuk Codex**: pure SQL file, tidak ada external dependency, tidak bisa merusak apapun yang sudah ada, hasilnya langsung berguna untuk semua task berikutnya.
