# ADS LAB PRD v2.2 - Frontend Analysis

## Ringkasan Produk

ADS LAB bukan satu produk tunggal, tetapi ekosistem dengan tiga lapisan:

1. Chrome Extension untuk scraping dan klasifikasi iklan Meta Ads Library.
2. Dashboard Ads untuk monitoring performa iklan internal milik 3 brand.
3. Web App untuk riset kompetitor, domain, funnel, dan referensi creative.

Implikasi untuk front end:

- UI perlu membedakan jelas mode monitoring internal vs intelligence kompetitor.
- Data dan keputusan harus terasa actionable, bukan sekadar reporting.
- Status, alert, dan target KPI lebih penting daripada visualisasi yang dekoratif.

## Temuan Penting Dari PRD

1. KPI tiap brand berbeda, jadi layout dashboard harus adaptif.
Ngajigaes fokus ke ROAS, Cost per Purchase, dan Profit Rate.
Labbaika dan Alaika fokus ke CPL, Leads, Reach, dan Spend.

2. Alert adalah fitur inti, bukan fitur tambahan.
Setiap alert harus menyampaikan kondisi, diagnosis, dan suggest action.

3. Breakdown campaign sampai ad level wajib menjadi first-class view.
Pengguna perlu melihat hubungan campaign > adset > ad, plus funnel label di level ad.

4. Dashboard harus tetap berguna saat Meta API bermasalah.
Fallback cached data dan status freshness perlu terlihat di UI.

5. Fitur TOFU/MOFU/BOFU berubah scope.
PRD awal memasukkan stage classifier, tetapi addendum menahan fitur ini sampai Phase 5.
UI sebaiknya tidak memperlakukan fitur ini sebagai bagian MVP.

## Keputusan Scope Frontend MVP

Prototype yang dibangun di repo ini memprioritaskan:

- Overview atau command center
- Dashboard Ads per brand
- Ad Intelligence card view
- Competitor Analysis per domain

Tidak dimasukkan dalam prototype ini:

- UI Chrome Extension
- Auth multi-user
- Integrasi real API atau Supabase
- Workflow automation Phase 6

## Arah Desain

Visual diarahkan menjadi control room yang terasa operasional:

- Panel gelap dengan aksen emas dan hijau
- Hierarki tajam untuk KPI, alert, dan status
- Layout editorial agar tidak terasa seperti template admin biasa
- Static SPA tanpa build step agar sesuai dengan arahan web app di PRD
