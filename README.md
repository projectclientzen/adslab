# adslab

ADS LAB adalah workspace operasional untuk:

- mengumpulkan iklan kompetitor dari Meta Ads Library lewat Chrome extension
- menyimpan snapshot performa campaign ke Supabase lewat Netlify Functions
- menampilkan dashboard kontrol dan ad intelligence lewat static SPA di `prototype_ui/`

## Folder utama

- `extension/`: collector Meta Ads Library, auto-scroll, dedup save, dan funnel classifier
- `prototype_ui/`: control room dashboard, scoring engine, alert engine, dan helper Supabase
- `netlify/functions/`: fetch snapshot Meta Ads API, scheduler, dan Telegram alert pipeline
- `supabase/migrations/`: schema `ads_detail`, `campaign_snapshots`, `fetch_status`, dan `alert_log`

## Deploy checklist

`netlify.toml` sudah mengarah ke `prototype_ui` dan `netlify/functions`. Environment variable tetap harus diisi manual di Netlify UI:

- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `META_ACCESS_TOKEN_NGAJIGAES`
- `META_ACCESS_TOKEN_LABBAIKA`
- `META_ACCESS_TOKEN_ALAIKA`
- `META_ACCOUNT_ID_NGAJIGAES`
- `META_ACCOUNT_ID_LABBAIKA`
- `META_ACCOUNT_ID_ALAIKA`
- `TELEGRAM_BOT_TOKEN`
- `TELEGRAM_CHAT_ID`

Untuk GitHub Actions keepalive, siapkan repository secrets berikut:

- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`
- `TELEGRAM_BOT_TOKEN`
- `TELEGRAM_CHAT_ID`
