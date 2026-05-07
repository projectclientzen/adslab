# ADS LAB — Acceptance Criteria v1.0

Dokumen ini mendefinisikan kriteria penerimaan terukur per phase berdasarkan PRD v2.2.
Setiap item harus dapat diverifikasi secara objektif sebelum phase dinyatakan selesai.

---

## Tech Stack Decision (MVP)

| Layer | Pilihan | Alasan |
|---|---|---|
| Web App + Dashboard Ads | Vanilla HTML/CSS/JS SPA | Prototype existing sudah berjalan, zero build step sesuai PRD, MVP lebih cepat |
| Chrome Extension | Vanilla JS + Manifest V3 | Sesuai PRD, lightweight, no framework overhead |
| Database | Supabase (PostgreSQL) | Sesuai PRD, free tier OK untuk MVP, REST API built-in |
| AI Classifier | Claude Haiku API | Sesuai PRD, cost < $1 per ribuan ads |
| Hosting | Netlify | Sesuai PRD, auto-deploy, CDN global |
| Alert Channel | Telegram Bot + Web Push | Sesuai PRD, real-time delivery |
| Auth | Tidak ada di MVP — Supabase Auth di Phase 4 | PRD menunda ke Phase 4 |

**Catatan**: React/Next.js TIDAK dipakai untuk MVP. Prototype existing (prototype_ui/) adalah baseline frontend yang akan dihubungkan ke real data. Migrasi ke React dipertimbangkan di Phase 4+ jika kompleksitas state meningkat signifikan.

---

## Phase 2A — Fix Extension Foundation

### AC-2A-01: LP Detection Rate
- **Kondisi**: Extension scrape halaman Meta Ads Library, LP URL di-capture dari GraphQL network response (bukan DOM parsing)
- **Metrik**: Detection rate ≥ 95% dari total iklan yang memiliki destination URL
- **Cara uji**: Manual spot-check 20 iklan random di Meta Ads Library — bandingkan URL yang ter-capture di Supabase vs URL aktual saat klik iklan

### AC-2A-02: Deduplication by Library ID
- **Kondisi**: Iklan dengan `library_id` yang sama tidak boleh tersimpan lebih dari satu kali di tabel `ads_detail`
- **Metrik**: 0 duplikat setelah 3 sesi scraping berturut-turut pada domain yang sama
- **Cara uji**: `SELECT library_id, COUNT(*) FROM ads_detail GROUP BY library_id HAVING COUNT(*) > 1;` — hasilnya harus 0 baris

### AC-2A-03: Auto-scroll Reliability
- **Kondisi**: Extension auto-scroll tidak berhenti di tengah halaman, mendeteksi konten baru via IntersectionObserver
- **Metrik**: Extension berhasil memproses semua iklan pada halaman dengan ≥ 300 iklan tanpa berhenti prematur
- **Cara uji**: Test pada domain kompetitor volume tinggi (labbaikatravel.com) — bandingkan jumlah ads di-capture vs jumlah yang terlihat di Meta Ads Library

---

## Phase 2B — New Data Fields + Funnel Classifier

### AC-2B-01: Data Capture Completeness
- **Kondisi**: Setiap iklan yang di-scrape setelah Phase 2B menyimpan `ad_copy`, `creative_type`, `cta_button`, dan `date_active`
- **Metrik**: Field-field ini null hanya untuk iklan yang genuinely tidak memiliki data tersebut (bukan karena gagal capture)
- **Cara uji**: `SELECT COUNT(*) FROM ads_detail WHERE ad_copy IS NULL AND created_at > NOW() - INTERVAL '1 day';` — hasilnya < 5% dari total ads baru

### AC-2B-02: Funnel Classifier Accuracy
- **Kondisi**: Sistem auto-classify `funnel_type` (LP / CTWA / Visit Profile / Lead Form) berdasarkan kombinasi CTA text + destination URL pattern
- **Metrik**: Accuracy ≥ 90% diverifikasi manual pada 50 iklan random dari berbagai advertiser
- **Cara uji**: Export 50 iklan → manual label → bandingkan vs `funnel_type` di DB → hitung `correct / 50 * 100`

### AC-2B-03: Manual Override Berfungsi
- **Kondisi**: User dapat mengubah `funnel_type` dari Web App card view, perubahan tersimpan ke field `funnel_override`
- **Metrik**: Override tersimpan ke Supabase dalam < 2 detik, UI terupdate tanpa full page reload
- **Cara uji**: Klik override di card → pilih label berbeda → query `SELECT funnel_override FROM ads_detail WHERE id = '{id}';` → konfirmasi nilai baru tersimpan

---

## Phase 3A — Dashboard Ads MVP

### AC-3A-01: Brand Switcher Responsif
- **Kondisi**: Klik brand Ngajigaes / Labbaika / Alaika — semua KPI cards, alerts, campaign breakdown terupdate dengan data brand yang dipilih
- **Metrik**: UI render < 500ms setelah klik, tidak ada data dari brand lain yang ikut tampil
- **Cara uji**: Switch brand 3x berturut-turut, verifikasi nilai KPI berubah sesuai brand dan total spend konsisten

### AC-3A-02: KPI Akurasi vs Meta Ads Manager
- **Kondisi**: Nilai KPI di dashboard (ROAS, CPL, Reach, Spend) sesuai dengan data aktual dari Meta Ads API untuk periode yang sama
- **Metrik**: Selisih ≤ 1% untuk semua KPI dibandingkan Ads Manager untuk range 30 hari
- **Cara uji**: Screenshot Ads Manager 30 hari → bandingkan nilai per brand dengan Dashboard Ads → hitung deviasi

### AC-3A-03: Campaign Breakdown Expandable
- **Kondisi**: User dapat expand Campaign → Adset → Ad, setiap level menampilkan metric yang relevan
- **Metrik**: Expand/collapse berfungsi di semua level, `SUM(adset.spend) = campaign.spend` (toleransi rounding ±1%)
- **Cara uji**: Expand semua campaign untuk Ngajigaes → sum spend semua adset → bandingkan dengan spend campaign

### AC-3A-04: KPI Config per Campaign (Admin)
- **Kondisi**: Admin dapat set dan edit target KPI per campaign; Tim hanya read-only
- **Metrik**: Perubahan target tersimpan ke Supabase dan tereflek di status indicator (hijau/kuning/merah) tanpa reload
- **Cara uji**: Set ROAS target 3.5x untuk campaign yang actual-nya 3.2x → verify badge berubah ke kuning; coba edit sebagai Tim → verify UI tidak menampilkan edit button

### AC-3A-05: API Fallback + Stale Banner
- **Kondisi**: Jika Meta API error atau timeout, dashboard menampilkan data cached dari Supabase disertai banner warning
- **Metrik**: Dashboard tetap accessible dalam < 2 detik saat API error; banner kuning muncul dengan timestamp terakhir fetch
- **Cara uji**: Block Meta API endpoint di browser (DevTools → Network → Block request URL) → refresh dashboard → verify banner muncul + data lama tetap tampil

### AC-3A-06: Semua 7 Tipe Alert Berfungsi
- **Kondisi**: Alert engine mendeteksi dan menampilkan semua 7 kondisi dari PRD 2.6 (Budget Warning, CPL Anomaly, ROAS Drop, No Delivery, Ad Fatigue, Failed Test, Winning Ad Suggest)
- **Metrik**: Setiap tipe alert ter-trigger pada kondisi yang benar; format output = [Kondisi] + [Diagnosis] + [Suggest Aksi]
- **Cara uji**: Gunakan data mock yang menyimulasikan setiap kondisi → verify alert muncul di UI dengan konten yang tepat

---

## Phase 3B — Alert Engine + Suggest

### AC-3B-01: Telegram Notification Latency
- **Kondisi**: Alert dikirim ke Telegram dalam format tiga bagian: kondisi, diagnosis, suggest aksi
- **Metrik**: Notifikasi diterima dalam ≤ 5 menit dari saat kondisi terdeteksi oleh alert engine
- **Cara uji**: Trigger kondisi budget < 20% dengan data test → catat waktu trigger vs waktu pesan diterima di Telegram

### AC-3B-02: Winning Ad Scoring Konsisten
- **Kondisi**: Scoring system menghasilkan top 3 ads per brand berdasarkan bobot KPI dari PRD 2.6
- **Metrik**: Hasil top 3 konsisten dengan manual ranking dari data aktual (tidak boleh ada ads dengan performa lebih rendah masuk top 3)
- **Cara uji**: Export data 14 hari → manual rank top 5 ads per brand → bandingkan urutan 1-3 dengan scoring system output → harus cocok

### AC-3B-03: Rule-Based Suggest — 8 Kondisi Lengkap
- **Kondisi**: Setiap alert dari addendum 7.1 dilengkapi diagnosis otomatis dan suggest aksi spesifik
- **Metrik**: 100% alert memiliki field `diagnosis` dan `suggest_action` yang tidak kosong; format sesuai tabel addendum 7.1
- **Cara uji**: Trigger semua 8 kondisi dari addendum 7.1 satu per satu → verify output JSON/UI memiliki semua field terisi

---

## Infrastructure

### AC-INF-01: Supabase Anti-Pause Cron
- **Kondisi**: Cron job ping Supabase setiap 3 hari via GitHub Actions agar project tidak auto-pause
- **Metrik**: 100% workflow runs berhasil (tidak ada failed run lebih dari 1 minggu)
- **Cara uji**: Review GitHub Actions tab → `supabase-keepalive.yml` → semua recent runs = green

### AC-INF-02: Netlify Auto-Deploy
- **Kondisi**: Push ke branch `main` otomatis men-trigger deploy ke adslabku.netlify.app
- **Metrik**: Deploy selesai dalam < 3 menit setelah push; 0 downtime antara deploy
- **Cara uji**: Push satu commit kecil → pantau Netlify dashboard → verify deploy berhasil dan perubahan live

### AC-INF-03: Environment Variables Aman
- **Kondisi**: Tidak ada secret (API keys, Supabase credentials) yang ter-commit ke repository
- **Metrik**: 0 file di repo yang mengandung `SUPABASE_KEY`, `META_ACCESS_TOKEN`, atau `TELEGRAM_BOT_TOKEN` sebagai plain text
- **Cara uji**: `grep -r "SUPABASE_KEY\|META_ACCESS_TOKEN\|TELEGRAM_BOT_TOKEN" . --include="*.js" --include="*.html"` → hasilnya 0 match (kecuali file .env.example dengan placeholder)
