

**ADS LAB**

Meta Ad Intelligence Platform

*Product Requirements Document v2.2*

|**Field**|**Value**|
| :- | :- |
|Versi|2\.2.0|
|Tanggal|Mei 2026|
|Status|Planning — In Development (Updated v2.2)|
|Platform|Web App + Chrome Extension + Dashboard Ads|
|Live URL|adslabku.netlify.app|
|Dibuat Oleh|Zen — Internal Use|



# **1. Overview**
ADS LAB adalah platform intelijen iklan yang terdiri dari tiga komponen utama: Chrome Extension sebagai data collector dari Meta Ads Library, Dashboard Ads sebagai performance monitor untuk iklan aktif milik sendiri (3 brand), dan Web App sebagai dashboard analisis kompetitor. Platform ini dirancang khusus untuk kebutuhan media buyer yang mengelola multiple brands di niche keagamaan Islam dan travel umroh.

|**Komponen**|**Fungsi Utama**|
| :- | :- |
|Chrome Extension|Scrape & classify iklan dari Meta Ads Library kompetitor|
|Dashboard Ads|Monitor performa iklan aktif — Ngajigaes.id, Labbaika, Alaika Habibi|
|Web App (ADS LAB)|Analisis kompetitor: domain, LP, funnel type, TOFU/MOFU/BOFU|


# **2. Dashboard Ads — Performance Monitor**
Dashboard untuk memantau performa iklan aktif dari 3 brand dalam satu platform. Setiap brand memiliki dashboard terpisah yang dapat diakses via brand switcher.

## **2.1 Global Features**
- Brand Switcher: Ngajigaes.id / Labbaika / Alaika Habibi — dashboard berubah sesuai brand yang dipilih
- Date Range Picker: 7 hari / 30 hari / custom range
- Role-based access: Admin (edit KPI config) vs Tim (read-only)

## **2.2 KPI Per Brand**

|**Brand**|**Primary KPI**|**Data Source**|
| :- | :- | :- |
|Ngajigaes.id|ROAS + Cost per Purchase + Profit Rate (Conv. Value - Spend)|Meta Pixel + Purchase Event (otomatis)|
|Labbaika|CPL + Reach|Meta Ads API|
|Alaika Habibi|CPL + Reach|Meta Ads API|

## **2.3 Per-Brand Dashboard Layout**
**Hero Cards (bagian atas)**

- Ngajigaes.id: ROAS | Cost per Purchase | Profit Rate | Total Spend
- Labbaika & Alaika: CPL | Total Leads | Reach | Total Spend

**Secondary Metrics**

- CPM | CTR | Frequency | Reach
- Breakdown per Campaign dan Adset

## **2.4 Breakdown Campaign / Adset / Ad**

|**Level**|**Tampilan**|**Detail**|
| :- | :- | :- |
|Campaign|Tabel list dengan summary card di atas|Name | Status | Spend | Result | CPL/ROAS | Reach | Status vs Target|
|Adset|Expand dari Campaign (klik baris)|Adset name + metric detail|
|Ad|Expand dari Adset (klik baris)|Thumbnail creative + Metric + Label Funnel (LP/CTWA/Visit Profile/Lead Form)|

- Default sorting: Manual / custom (drag atau priority number)
- Filter toggle: Active / Paused / Archived
- Status indicator per baris: Hijau / Kuning / Merah vs target KPI

## **2.5 KPI Config per Campaign**
- Setiap campaign dapat memiliki target KPI sendiri (bukan global per brand)
- Role: Admin set & edit target — Tim hanya lihat
- Campaign selesai: otomatis masuk Archive (tidak tampil di main dashboard, bisa diakses di halaman Archive)

|**Contoh**|**Target**|**Actual**|**Status**|
| :- | :- | :- | :- |
|ROAS Ngajigaes Campaign Ramadan|3x|2\.8x|Merah|
|Cost per Purchase|Rp 45.000|Rp 41.000|Hijau|
|CPL Labbaika Campaign Umroh|Rp 80.000|Rp 75.000|Hijau|

## **2.6 Alert & Anomaly — Real-Time**
Semua alert dikirim real-time via: Web App Notification + Telegram Bot.

|**Tipe Alert**|**Kondisi Trigger**|**Note**|
| :- | :- | :- |
|Budget Warning|Sisa budget < 20%|Early warning — bukan tunggu habis|
|CPL Anomaly|CPL naik > threshold % dari baseline|Threshold custom per brand|
|ROAS Drop|ROAS di bawah target KPI Config|Berdasarkan target yang di-set admin|
|No Delivery|Iklan aktif tapi Reach = 0 dalam X jam|X jam = configurable|
|Ad Fatigue|Frequency > 3x dalam 7 hari|Fixed threshold|
|Failed Test Alert|Spend > threshold + engagement & conv. rate LOW/AVERAGE|Threshold custom per brand — top 3 worst ads di-highlight|
|Winning Ad Suggest|Scoring system detect top performer|Top 3 scorer di-suggest untuk scale / referensi konten|

**Winning Ad Scoring System**

|**Brand**|**Metric**|**Bobot**|
| :- | :- | :- |
|Ngajigaes.id|ROAS|40%|
|Ngajigaes.id|Cost per Purchase|30%|
|Ngajigaes.id|CTR|30%|
|Labbaika & Alaika|CPL|40%|
|Labbaika & Alaika|CTR|30%|
|Labbaika & Alaika|Reach Efficiency|30%|

- Bobot dapat di-adjust oleh Admin di settings
- Top 3 scorer = Winning Ads — di-suggest untuk scale atau jadi referensi konten baru


# **3. Chrome Extension — ADS LAB Collector v2.0**
Update dari versi existing (v5.1) dengan penambahan field data baru, funnel classifier, TOFU/MOFU/BOFU classifier, dan perbaikan pada LP detection rate.

## **3.1 Status Existing vs Target v2.0**

|**Fitur**|**Status v1.x**|**Target v2.0**|
| :- | :- | :- |
|LP Detection Rate|~30% (DOM only)|~95% (GraphQL intercept)|
|Auto-scroll|Timer-based, sering stop awal|IntersectionObserver — lebih reliable|
|Deduplication|Belum ada — double count|Check Library ID sebelum insert|
|Ad Copy / Teks Iklan|Tidak di-capture|Capture & simpan ke DB|
|Creative Type|Tidak di-capture|Image / Video / Carousel|
|CTA Button|Tidak di-capture|Capture teks CTA|
|Tanggal Tayang|Tidak di-capture|Capture date active|
|Funnel Classifier|Tidak ada|Auto-classify LP/CTWA/Visit Profile/Lead Form|
|Campaign Stage|Tidak ada|TOFU/MOFU/BOFU via AI classifier|
|Manual Override|Tidak ada|User bisa koreksi label hasil auto-classify|

## **3.2 Roadmap Pengembangan**
**Phase 2A — Fix Foundation (Prioritas Tinggi)**

- GraphQL Intercept: Intercept network request Meta untuk capture LP URL dari API response, bukan DOM. Target: LP detection rate dari ~30% ke ~95%
- Deduplication: Check Library ID yang sudah ada di database sebelum insert — hindari double count
- Better Scroll Detection: Ganti timer-based dengan IntersectionObserver untuk deteksi konten baru yang lebih reliable

**Phase 2B — New Data Fields (Paralel planning, eksekusi setelah 2A)**

- Ad Copy / teks iklan
- Creative Type: image / video / carousel
- CTA Button text
- Tanggal tayang (date active)
- Funnel Classifier: LP / CTWA / Visit Profile / Lead Form (auto + manual override)
- Campaign Stage: TOFU / MOFU / BOFU (AI classifier + manual override)

**Phase 2C — Integration**

- Funnel label + TOFU/MOFU/BOFU tag tersinkron ke Dashboard Ads
- Ad level breakdown di Dashboard Ads menampilkan label hasil classify dari extension

## **3.3 Funnel Classifier Logic**

|**Funnel Type**|**Signal Deteksi**|**CTA Pattern**|**URL Pattern**|
| :- | :- | :- | :- |
|CTWA|CTA Send Message + WA/FB link|Send Message|wa.me / m.me / api.whatsapp.com|
|Landing Page|CTA + external domain|Learn More / Shop Now|External domain (bukan WA/FB/IG)|
|Visit Profile|CTA View Profile / no external link|View Profile|facebook.com / instagram.com atau kosong|
|Lead Form|CTA Sign Up + Meta form|Sign Up|facebook.com/lead\_gen|

## **3.4 TOFU/MOFU/BOFU Classifier Logic**
Classification menggunakan kombinasi pattern matching (CTA + URL) dan AI classifier (Claude Haiku / GPT-4o mini) untuk analisis teks copy iklan.

|**Stage**|**Definisi**|**Copy Signal**|**CTA Pattern**|**Funnel Type**|
| :- | :- | :- | :- | :- |
|TOFU|Awareness — belum kenal produk|Tahukah kamu / Tips / Fakta / Kenalan dulu|Learn More / Watch More / See More|Visit Profile / Content Engagement|
|MOFU|Consideration — sedang mempertimbangkan|Kenapa pilih kami / Keunggulan / Dibanding yang lain|Send Message / Contact Us|CTWA / DM|
|BOFU|Conversion — siap beli/daftar|Daftar sekarang / Promo / Terbatas / DP mulai dari|Shop Now / Sign Up / Book Now|LP / Lead Form|

- Auto-classify menggunakan AI (Claude Haiku) dengan confidence score 0-1
- User dapat melakukan manual override jika hasil classify tidak tepat
- Override tersimpan sebagai stage\_override di database

## **3.5 Updated Database Schema**
**Tabel Baru: ads\_detail**

|**Field**|**Type**|**Deskripsi**|
| :- | :- | :- |
|id|uuid (PK)|Primary key auto-generated|
|library\_id|text (unique)|Library ID unik dari Meta|
|advertiser\_name|text|Nama brand / page iklan|
|ad\_copy|text|Teks copy iklan|
|creative\_type|text|image / video / carousel|
|cta\_button|text|Teks CTA button|
|destination\_url|text|URL tujuan iklan|
|date\_active|timestamptz|Tanggal iklan mulai tayang|
|funnel\_type|text|LP / CTWA / Visit Profile / Lead Form (auto)|
|funnel\_override|text|Koreksi manual funnel type oleh user|
|campaign\_stage|text|TOFU / MOFU / BOFU (AI classify)|
|stage\_confidence|float|Confidence score AI (0-1)|
|stage\_override|text|Koreksi manual stage oleh user|
|created\_at|timestamptz|Timestamp data masuk|


# **4. Web App — ADS LAB Dashboard**
Dashboard kompetitor yang menampilkan data hasil scraping dari Extension. Update dari versi existing dengan penambahan fitur analisis funnel dan campaign stage.

## **4.1 Halaman Existing (Tetap)**
- Home: Stats cards, Trending Keywords, Recent Extractions, Search bar
- Top Domains: Tabel domain diurutkan by Total Ads
- Search: Search by domain atau LP URL
- Domain Detail: List semua LP per domain
- Watchlist: Monitor domain/keyword tertentu

## **4.2 Halaman Baru (Phase 2B)**
**Ad Intelligence View**

- Filter by funnel type: LP / CTWA / Visit Profile / Lead Form
- Filter by campaign stage: TOFU / MOFU / BOFU
- Tampil: Thumbnail creative + Copy + CTA + Funnel Label + Stage Badge
- Sort by: Date active / Volume iklan
- Manual override label langsung dari card view

**Competitor Analysis**

- Compare volume iklan per domain (bar chart)
- Distribution funnel type per domain (pie/donut chart)
- TOFU/MOFU/BOFU ratio per brand kompetitor


# **5. Integrasi Dashboard Ads + ADS LAB**
Titik integrasi antara Dashboard Ads (performance milik sendiri) dan ADS LAB (kompetitor research).

|**Data Point**|**Source**|**Destination**|**Fungsi**|
| :- | :- | :- | :- |
|Funnel Label (LP/CTWA/dll)|ADS LAB Extension|Dashboard Ads — Ad Level|Tag otomatis di breakdown ad level|
|TOFU/MOFU/BOFU|ADS LAB Extension|Dashboard Ads — Ad Level|Konteks campaign stage per ad|
|Winning Ad Creative|Dashboard Ads Scoring|ADS LAB Reference|Referensi konten untuk riset angle baru|

- 1 Supabase instance untuk keduanya — efisiensi maintenance dan tidak perlu sync antar DB
- Dashboard Ads membaca tabel ads\_detail dari ADS LAB untuk tagging di ad level breakdown


# **6. Tech Stack**

|**Layer**|**Teknologi**|**Keterangan**|
| :- | :- | :- |
|Extension|Vanilla JS + Manifest V3|No framework, lightweight, Chrome native|
|Web App|HTML/CSS/JS Single Page App|Zero build step, static deploy|
|Dashboard Ads|React / Next.js (rekomendasi)|Component-based untuk chart & state management|
|Database|Supabase (PostgreSQL)|Free tier 500MB, REST API built-in, RLS|
|AI Classifier|Claude Haiku / GPT-4o mini|TOFU/MOFU/BOFU classification — cost < $1 per ribuan ads|
|Hosting|Netlify|Static hosting, auto-deploy, CDN global|
|Alert Channel|Telegram Bot + Web Push|Real-time notification untuk anomaly & budget alert|
|Auth|Supabase Auth (future)|Phase 4 — multi-user support|


# **7. Addendum v2.1 — Updates dari Stress Test**
Tiga tambahan kritis berdasarkan review arsitektur pada Mei 2026.

## **7.1 Rule-Based Suggest Engine**
Fitur suggest & analisa dibangun dengan pendekatan rule-based terlebih dahulu. Upgrade ke AI-powered dilakukan setelah data historis cukup (estimasi 60-90 hari setelah launch). Setiap alert dilengkapi diagnosis dan suggest aksi spesifik.

|**Trigger Kondisi**|**Diagnosis Otomatis**|**Suggest Aksi**|
| :- | :- | :- |
|CPL naik > 20% dalam 3 hari|Cek Frequency > 2.5 → kemungkinan fatigue|Refresh creative / Perluas audience|
|CPL naik > 20% dalam 3 hari|Cek CPM naik tapi CTR flat|Perluas audience atau ubah targeting|
|CPL naik > 20% dalam 3 hari|Cek CTR turun|Ganti hook atau copy iklan|
|ROAS drop < target 2 hari berturut|Cek apakah winning ad masih aktif|Scale winning ad / pause underperformer|
|ROAS drop < target 2 hari berturut|Cek distribusi budget antar adset|Konsolidasi budget ke top adset|
|Frequency > 3x dalam 7 hari|Audience fatigue terdeteksi|Pause adset, rotate creative baru, expand lookalike|
|Budget < 20% sisa|Budget hampir habis — estimasi X jam habis|Ajukan top-up segera ke admin|
|Reach stagnan, spend jalan (Labbaika/Alaika)|Delivery inefficient — kemungkinan audience overlap|Cek overlap antar adset, broadening audience|

- Semua suggest dikirim bersamaan dengan alert via Telegram + Web Notification
- Format notif: [Kondisi] + [Diagnosis] + [Suggest Aksi] dalam 1 pesan
- Upgrade ke AI-powered suggest dilakukan di Phase 5 setelah data historis terkumpul

## **7.2 Meta API Fallback Strategy**
Dashboard Ads tidak boleh bergantung sepenuhnya pada koneksi real-time ke Meta API. Strategi fallback wajib diimplementasi sejak Phase 3A.

|**Kondisi**|**Behavior Dashboard**|**Indikator ke User**|
| :- | :- | :- |
|API normal|Fetch data setiap 1-4 jam (schedule, bukan real-time)|Last updated: X menit lalu|
|API timeout / error|Tampilkan cached data dari Supabase|Banner kuning: Menampilkan data terakhir — [timestamp]|
|API down > 6 jam|Dashboard tetap bisa diakses dengan data stale|Banner merah: Data mungkin tidak akurat — cek Ads Manager|
|API access dicabut|Fallback ke manual input mode|Alert ke admin: API access perlu direview|

- JANGAN real-time fetch per request — gunakan scheduled job setiap 1-4 jam
- Simpan snapshot data harian di Supabase sebagai historical fallback
- Pisahkan token per brand — kalau 1 token kena restrict, 2 brand lain tetap jalan

## **7.3 Supabase Free Tier — Anti-Pause & Monitoring**
Supabase free tier akan auto-pause project setelah 1 minggu tidak ada traffic. Ini critical karena bisa membuat seluruh platform mati tanpa warning.

|**Risk**|**Solusi**|**Implementasi**|
| :- | :- | :- |
|Project di-pause karena inactive|Cron job ping setiap 3 hari|Gunakan GitHub Actions atau Netlify scheduled function|
|Storage mendekati 500MB|Monitor storage usage bulanan|Alert manual kalau storage > 400MB — siapkan upgrade $25/bulan|
|Rate limit pada free tier|Batch query — jangan N+1 query|Gunakan join dan aggregate query di Supabase|
|Downtime Supabase|Cached response di browser localStorage|Simpan snapshot terakhir di client-side|

- Budget plan: Upgrade Supabase ke Pro ($25/bulan) ketika platform sudah digunakan harian
- Netlify / Vercel: Tetap di Netlify untuk sekarang — pindah hanya kalau butuh SSR atau Edge Functions

## **7.4 Keputusan Scope — TOFU/MOFU/BOFU**
Fitur TOFU/MOFU/BOFU classifier di-skip dari Phase 2B. Alasan: akurasi AI classifier untuk niche keagamaan Islam sangat kontekstual dan tidak bisa diandalkan dari teks iklan saja. Fitur ini dapat dipertimbangkan kembali di Phase 5 setelah ada data historis yang cukup untuk fine-tuning.


# **8. Phase 6 — Creative Automation & Ads Ops System**
Sistem otomasi end-to-end untuk manajemen creative dan operasional iklan. Ketika performa drop terdeteksi, sistem secara otomatis mengambil creative baru dari Google Drive, membaca copy dari Google Sheets, membuat ad draft baru, dan mengatur status campaign — tanpa intervensi manual untuk proses rutin.

## **8.1 Overview Arsitektur**

|**Layer**|**Fungsi**|**Teknologi**|
| :- | :- | :- |
|Trigger Engine|Deteksi performa drop 1 minggu berturut-turut|Rule-based dari Dashboard Ads (Phase 3B)|
|Creative Ops|Pull creative dari Google Drive, track status uploaded/pending|Google Drive API + Supabase|
|Copy Management|Baca ad copy & variasi dari Google Sheets|Google Sheets API|
|AI Copy Generator|Generate variasi copy berdasarkan winning ads|Claude API / GPT-4o mini|
|Meta Automation|Pause/activate/scale/create ads via API|Meta Marketing API|
|Queue System|Handle bulk create dengan rate limit Meta|Background job / cron|
|Notification|Laporan aksi otomatis ke admin|Telegram Bot + Web Dashboard|

## **8.2 Trigger Conditions**
Sistem automation aktif berdasarkan kondisi berikut yang terdeteksi oleh Alert Engine (Phase 3B):

|**Trigger**|**Kondisi**|**Aksi Otomatis**|
| :- | :- | :- |
|Performa Drop|CPL naik > 20% atau ROAS turun > 20% selama 7 hari berturut-turut|Pause underperformer → Create ad baru dari creative pool|
|Ad Fatigue|Frequency > 3x dalam 7 hari|Pause adset → Rotate creative baru dari GD|
|Failed Test|Spend > threshold, result = 0|Pause ad → Flag di dashboard|
|Winning Ad Detected|Scoring system detect top performer|Scale budget sesuai rules yang di-set admin|
|Budget Habis|Sisa budget < 20%|Notif admin — tidak auto top-up (manual approval)|

## **8.3 Google Drive Integration — Creative Pool**
- Folder struktur di GD wajib distandarisasi per brand:

|**Folder**|**Isi**|**Status Tag**|
| :- | :- | :- |
|/ADS\_LAB/Ngajigaes/pending|Creative baru belum pernah diupload ke Meta|pending|
|/ADS\_LAB/Ngajigaes/uploaded|Creative yang sudah pernah diupload|uploaded|
|/ADS\_LAB/Ngajigaes/archive|Creative retired / tidak dipakai lagi|archived|
|/ADS\_LAB/Labbaika/pending|Creative baru Labbaika|pending|
|/ADS\_LAB/Alaika/pending|Creative baru Alaika Habibi|pending|

- Sistem auto-move file dari /pending ke /uploaded setelah berhasil diupload ke Meta
- Metadata file di GD di-update: tanggal upload, ad\_id Meta, status
- Support format: JPG, PNG (image ads) dan MP4 (video ads)
- Video ads: butuh polling status 'ready' dari Meta sebelum bisa di-attach ke ad

## **8.4 Google Sheets Integration — Copy Management**
Tim creative mengisi Google Sheets sebagai source of truth untuk ad copy. Sistem membaca sheet dan create ad draft otomatis.

|**Kolom Sheet**|**Deskripsi**|**Contoh**|
| :- | :- | :- |
|brand|Nama brand|ngajigaes / labbaika / alaika|
|primary\_text|Copy utama iklan|Mau belajar ngaji tapi sibuk kerja?|
|headline|Headline iklan|Mulai dari 15 menit sehari|
|cta|CTA button|Learn More / Send Message / Sign Up|
|destination\_url|URL tujuan atau WA link|wa.me/628xxx atau URL LP|
|funnel\_stage|Label funnel|TOFU / MOFU / BOFU|
|status|Status publish|pending / published / rejected|
|ad\_id|Meta Ad ID setelah publish|Auto-fill oleh sistem|
|notes|Catatan dari copywriter|Opsional|

- Sistem baca baris dengan status = 'pending' → create ad draft di Meta
- Setelah berhasil create, kolom status di-update ke 'published' dan ad\_id di-fill otomatis
- Baris dengan status 'rejected' (dari Meta policy) di-flag dan notif ke tim

## **8.5 Meta Automation Actions**

|**Aksi**|**Meta API Endpoint**|**Trigger**|
| :- | :- | :- |
|Pause campaign/adset/ad|POST /{id} status=PAUSED|Trigger: performa drop / fatigue|
|Activate campaign/adset/ad|POST /{id} status=ACTIVE|Manual approval atau auto setelah review|
|Scale budget|POST /{id} daily\_budget={new\_amount}|Trigger: winning ad detected|
|Upload image creative|POST /act\_{id}/adimages|Creative baru dari GD folder /pending|
|Upload video creative|POST /act\_{id}/advideos + polling status|Creative baru dari GD folder /pending|
|Create ad draft|POST /act\_{id}/ads|Setelah creative uploaded + copy dari Sheets|
|Generate copy variasi|Claude/GPT API → POST /act\_{id}/ads|Trigger: fatigue + tidak ada creative di /pending|

## **8.6 AI Copy Variation Generator**
Aktif sebagai fallback ketika folder /pending di Google Drive kosong dan performa sedang drop. Sistem mengambil winning copy dari database dan generate variasi baru.

- Input: Top 3 winning ad copy dari DB (berdasarkan scoring system Phase 3B)
- Process: Kirim ke Claude API dengan prompt yang sudah di-template per brand
- Output: 3-5 variasi copy → masuk ke Sheets sebagai baris baru dengan status 'pending'
- Admin review variasi di Sheets sebelum di-publish (default: tidak auto-publish AI copy)
- Setting bisa diubah ke auto-publish kalau admin percaya dengan kualitas output

## **8.7 Queue System & Rate Limit Handling**
- Meta API rate limit: max 200 calls per hour per ad account
- Bulk create ads harus di-queue — tidak bisa sekaligus
- Queue processing: maksimal 10 ads per batch, jeda 5 menit antar batch
- Status queue tampil di dashboard: 'Processing X/Y ads'
- Kalau queue gagal: retry otomatis 3x, setelah itu notif admin

## **8.8 Safety Guards — Pencegahan Error**

|**Guard**|**Kondisi**|**Behavior**|
| :- | :- | :- |
|Pending Review Mode|Default untuk semua creative baru|Create ad dengan status PAUSED — admin activate manual|
|Auto-publish Mode|Hanya untuk creative yang sudah pernah approved|Langsung ACTIVE setelah create|
|Budget Scale Limit|Scale maksimal 2x dari budget awal per aksi|Tidak bisa scale > 2x sekaligus — butuh approval admin|
|Pause Protection|Campaign dengan status 'protected' tidak bisa di-pause otomatis|Admin set flag 'protected' untuk campaign strategis|
|Dry Run Mode|Mode testing — semua aksi di-simulate tanpa eksekusi ke Meta|Log semua yang akan dilakukan tanpa POST ke API|

## **8.9 Notification & Logging**
- Setiap aksi otomatis dikirim ke Telegram: '[ADS LAB] 3 ads di-pause, 2 creative baru di-upload, 1 ad draft created'
- Log lengkap semua aksi tersimpan di Supabase tabel: automation\_logs
- Dashboard menampilkan activity feed: timeline aksi otomatis per brand
- Weekly summary report: berapa ads di-create, di-pause, di-scale, dan performanya

## **8.10 Build Order Phase 6**

|**Step**|**Fitur**|**Dependency**|
| :- | :- | :- |
|6\.1|Pause / Activate / Scale via Meta API|Phase 3A (Dashboard Ads + API setup)|
|6\.2|Google Drive integration — upload creative + track status|GD API credentials|
|6\.3|Google Sheets integration — baca copy + update status|Sheets API credentials|
|6\.4|Queue system + rate limit handling|Step 6.1 selesai|
|6\.5|Safety guards + Dry Run mode|Step 6.1-6.4 selesai|
|6\.6|AI copy variation generator|Phase 3B (winning ad scoring) + Claude API|


# **9. Roadmap Keseluruhan (Updated v2.2)**

|**Phase**|**Nama**|**Prioritas**|**Status**|
| :- | :- | :- | :- |
|Phase 1|Foundation — Extension dasar + Web App + Supabase|Done|DONE|
|Phase 2A|Fix Foundation — GraphQL intercept, dedup, IntersectionObserver|Tinggi|Next|
|Phase 2B|New Data Fields — Copy, CTA, Creative Type, Funnel Classifier|Tinggi|Planning|
|Phase 2C|Integration — Dashboard Ads + ADS LAB sync via Supabase|Sedang|Planning|
|Phase 3A|Dashboard Ads MVP — Brand switcher, KPI cards, Breakdown, API fallback|Tinggi|Planning|
|Phase 3B|Alert + Rule-based Suggest Engine — Telegram + Web push|Tinggi|Planning|
|Phase 4|Scale — Auth multi-user, Scheduled extraction, Mobile view|Rendah|Future|
|Phase 5|AI Upgrade — Suggest engine berbasis AI, TOFU/MOFU/BOFU classifier|Rendah|Future|
|Phase 6|Creative Automation & Ads Ops — GD, Sheets, Auto-create, Scale, Pause|Tinggi|Future|


# **10. Known Issues & Limitations (dari v1.x)**

|**Issue**|**Severity**|**Solusi di v2.x**|
| :- | :- | :- |
|LP Detection Rate Rendah (~30%)|High|GraphQL intercept di Phase 2A|
|Domain tersimpan dengan tanda kutip|Medium|Fixed di v5 — domain quote-stripping|
|Auto-scroll tidak optimal untuk 300+ iklan|Medium|IntersectionObserver di Phase 2A|
|Double count iklan lintas sesi|Low|Deduplication by Library ID di Phase 2A|
|Watchlist tidak auto-extract|Low|Scheduled extraction di Phase 4|
|Tidak ada pagination di Domain Detail (60+ LP)|Low|Pagination di Phase 3 Features|
|Tidak ada fallback kalau Meta API down|High|Cached data strategy di Phase 3A — Addendum 7.2|
|Supabase free tier bisa auto-pause|High|Anti-pause cron job — Addendum 7.3|


# **11. Immediate Actions & Build Order**
## **Immediate Actions (Sebelum Build)**
- Setup Meta Business App — request permission ads\_read + read\_insights + ads\_management (untuk Phase 6)
- Generate long-lived Access Token per brand — 3 token terpisah (Ngajigaes, Labbaika, Alaika)
- Setup Google Drive API credentials + standarisasi folder structure per brand
- Setup Google Sheets API credentials + buat template sheet copy management
- Setup cron job anti-pause Supabase via GitHub Actions
- Estimasi waktu setup semua API: 5-10 hari — jalankan paralel dengan planning Phase 2A

## **Build Order Rekomendasi**
- 1. Phase 2A — Fix Extension foundation (GraphQL intercept, dedup, scroll)
- 2. Phase 3A — Dashboard Ads MVP + API fallback strategy
- 3. Phase 2B — New data fields Extension (copy, CTA, creative type, funnel classifier)
- 4. Phase 3B — Alert + Rule-based suggest engine (Telegram + Web)
- 5. Phase 2C — Full integrasi Dashboard Ads + ADS LAB
- 6. Phase 6.1 — Pause/activate/scale otomatis via Meta API
- 7. Phase 6.2-6.3 — Google Drive + Sheets integration
- 8. Phase 6.4-6.6 — Queue system, safety guards, AI copy generator
- 9. Phase 4+ — Scale, auth, mobile view

## **Metric Sukses 90 Hari**
- Ngajigaes.id: Omset mencapai Rp 200 juta — driven by faster decision loop dari alert + suggest engine
- Labbaika: Peningkatan reach dan jumlah jamaah terdaftar dari iklan
- Alaika Habibi: Peningkatan reach dan jumlah jamaah terdaftar dari iklan
- Platform: Dashboard digunakan harian oleh tim tanpa perlu buka Ads Manager untuk monitoring rutin
- Phase 6 milestone: Minimal 1 siklus creative rotation berjalan otomatis tanpa intervensi manual

*ADS LAB PRD v2.2 — Internal Use — Mei 2026 — Updated: Phase 6 Creative Automation*
