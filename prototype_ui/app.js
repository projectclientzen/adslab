const overviewStats = [
  {
    label: "Active domains tracked",
    value: "24",
    note: "Kompetitor dengan volume stabil 30 hari terakhir",
  },
  {
    label: "Live alerts today",
    value: "6",
    note: "ROAS drop, fatigue, dan budget warning",
  },
  {
    label: "Winning ads referenced",
    value: "19",
    note: "Digunakan untuk ide hook dan angle baru",
  },
  {
    label: "Cached uptime readiness",
    value: "98%",
    note: "Mencerminkan pentingnya fallback saat API delay",
  },
];

const productReadings = [
  {
    title: "Dashboard Ads adalah layar keputusan, bukan laporan pasif.",
    body: "Sebagian besar UI harus mengarah ke aksi: pause, scale, cek fatigue, atau bandingkan terhadap target KPI per campaign.",
  },
  {
    title: "Brand-specific KPI wajib terlihat jelas sejak fold pertama.",
    body: "Ngajigaes berfokus pada ROAS dan Cost per Purchase, sedangkan Labbaika dan Alaika butuh CPL dan Reach. Satu layout tidak boleh menyamarkan perbedaan ini.",
  },
  {
    title: "Alert harus menjelaskan kenapa, bukan hanya apa yang salah.",
    body: "PRD menekankan diagnosis otomatis dan suggest action. Karena itu feed alert didesain seperti ruang triase, bukan daftar notifikasi generik.",
  },
  {
    title: "Stage classifier belum matang untuk Phase 2B.",
    body: "UI menandai fitur TOFU/MOFU/BOFU sebagai hold agar ekspektasi produk tetap realistis terhadap keputusan scope di addendum v2.1.",
  },
];

const recentFeed = [
  {
    title: "labbaikatravel.com menambah 14 creative baru",
    meta: "Last active 2 jam lalu",
    detail: "Dominan funnel LP dengan CTA Learn More dan angle promo keberangkatan awal tahun.",
  },
  {
    title: "ngajidigital.id mulai geser ke format video pendek",
    meta: "Last active 5 jam lalu",
    detail: "CTR tertinggi datang dari hook edukasi 15 detik dengan visual founder-led.",
  },
  {
    title: "alaika-journey.com menaikkan volume CTWA",
    meta: "Last active 18 jam lalu",
    detail: "Pola ini berpotensi jadi sinyal push untuk tim closing atau lead qualifier.",
  },
];

const watchlist = [
  {
    type: "High Volume",
    name: "labbaikatravel.com",
    summary: "Volume iklan naik 21% minggu ini dan funnel masih dominan ke LP berorientasi paket utama.",
  },
  {
    type: "Creative Shift",
    name: "ngajidigital.id",
    summary: "Sedang bereksperimen dengan video testimoni singkat dan CTA rendah friksi.",
  },
  {
    type: "Offer Pressure",
    name: "alaika-journey.com",
    summary: "Muncul pola urgency baru dengan copy keberangkatan terbatas dan jendela booking pendek.",
  },
];

const dashboardData = {
  ngajigaes: {
    label: "Ngajigaes.id",
    range: "30 hari",
    kpis: [
      { label: "ROAS", value: "3.2x", trend: "+0.4 vs target", chip: "Target 3.0x" },
      { label: "Cost / Purchase", value: "Rp 41k", trend: "Turun 8%", chip: "Goal Rp 45k" },
      { label: "Profit Rate", value: "28%", trend: "+4.3 pts", chip: "Value - Spend" },
      { label: "Total Spend", value: "Rp 126jt", trend: "82% budget used", chip: "Healthy pace" },
    ],
    secondary: [
      { label: "CPM", value: "Rp 61k", note: "Stabil 7 hari" },
      { label: "CTR", value: "2.8%", note: "Above median" },
      { label: "Frequency", value: "2.6", note: "Pantau creative fatigue" },
      { label: "Reach", value: "490k", note: "Coverage kuat di prospecting" },
    ],
    alerts: [
      {
        level: "warning",
        title: "Budget warning / Ramadan Retargeting",
        diagnosis: "Sisa budget 17% dengan pace harian lebih cepat 11% dari baseline.",
        action: "Ajukan top-up atau konsolidasikan budget ke adset ROAS tertinggi.",
      },
      {
        level: "danger",
        title: "ROAS drop / Warm Audience Bundle",
        diagnosis: "ROAS 2.7x selama 2 hari berturut, dipicu CTR turun dan frequency naik ke 3.1.",
        action: "Refresh hook utama, rotasi creative testimoni, lalu tahan spend pada adset terlemah.",
      },
      {
        level: "success",
        title: "Winning ad suggest / Founder Reel 15 detik",
        diagnosis: "Skor tertinggi berasal dari kombinasi ROAS kuat, CTR 3.4%, dan CPP rendah.",
        action: "Scale 20% bertahap dan jadikan referensi template konten minggu depan.",
      },
    ],
    fallback: "API fallback: fetch terjadwal tiap 4 jam, cached snapshot aktif. Banner kuning akan tampil otomatis bila timestamp sudah stale.",
    campaigns: [
      {
        name: "Ramadan Conversion Burst",
        status: "Active",
        spend: "Rp 48jt",
        result: "367 purchases",
        efficiency: "ROAS 3.4x",
        reach: "154k",
        health: "good",
        healthLabel: "Hijau / above target",
        adsets: [
          {
            name: "Lookalike Buyer 3%",
            status: "Active",
            spend: "Rp 18jt",
            result: "142 purchases",
            efficiency: "CPP Rp 38k",
            reach: "61k",
            ads: [
              {
                name: "Founder Reel 15 detik",
                status: "LP",
                spend: "Rp 8.4jt",
                result: "74 purchases",
                efficiency: "CTR 3.4%",
                reach: "24k",
              },
              {
                name: "Carousel Testimoni Alumni",
                status: "LP",
                spend: "Rp 5.7jt",
                result: "41 purchases",
                efficiency: "CTR 2.9%",
                reach: "18k",
              },
            ],
          },
          {
            name: "Warm IG Engagers",
            status: "Watch",
            spend: "Rp 11jt",
            result: "79 purchases",
            efficiency: "CPP Rp 44k",
            reach: "33k",
            ads: [
              {
                name: "Promo DP mulai 99rb",
                status: "CTWA",
                spend: "Rp 6.4jt",
                result: "46 purchases",
                efficiency: "Freq 3.1",
                reach: "12k",
              },
            ],
          },
        ],
      },
      {
        name: "Always On Prospecting",
        status: "Active",
        spend: "Rp 31jt",
        result: "211 purchases",
        efficiency: "ROAS 3.0x",
        reach: "208k",
        health: "caution",
        healthLabel: "Kuning / close to target",
        adsets: [
          {
            name: "Video View Retargeting",
            status: "Active",
            spend: "Rp 9.6jt",
            result: "64 purchases",
            efficiency: "CPP Rp 47k",
            reach: "41k",
            ads: [
              {
                name: "Kenapa ngaji 15 menit itu realistis",
                status: "Visit Profile",
                spend: "Rp 3.8jt",
                result: "12 assists",
                efficiency: "CTR 2.1%",
                reach: "18k",
              },
            ],
          },
        ],
      },
    ],
  },
  labbaika: {
    label: "Labbaika",
    range: "30 hari",
    kpis: [
      { label: "CPL", value: "Rp 75k", trend: "-6% vs target", chip: "Target Rp 80k" },
      { label: "Total Leads", value: "1,842", trend: "+148 this week", chip: "Consistent flow" },
      { label: "Reach", value: "1.4jt", trend: "+12%", chip: "Broad acquisition" },
      { label: "Total Spend", value: "Rp 138jt", trend: "69% budget used", chip: "Scaling room" },
    ],
    secondary: [
      { label: "CPM", value: "Rp 49k", note: "Efficient for travel niche" },
      { label: "CTR", value: "2.2%", note: "Stable" },
      { label: "Frequency", value: "2.1", note: "Masih aman" },
      { label: "Reach", value: "1.4jt", note: "Coverage paling besar" },
    ],
    alerts: [
      {
        level: "warning",
        title: "CPL anomaly / Paket Umroh Plus Turki",
        diagnosis: "CPL naik 19% saat CPM ikut naik, tapi CTR masih flat.",
        action: "Perluas audience atau uji angle targeting yang lebih broad.",
      },
      {
        level: "success",
        title: "Winning ad suggest / Video itinerary 30 detik",
        diagnosis: "Reach efficiency dan CTR menempatkan ad ini di top scorer pekan ini.",
        action: "Scale bertahap dan adaptasi visual itinerary ke 2 creative baru.",
      },
    ],
    fallback: "API fallback: cached data aktif bila Meta timeout, dengan banner timestamp terakhir di atas dashboard.",
    campaigns: [
      {
        name: "Umroh Plus Turki 2026",
        status: "Active",
        spend: "Rp 54jt",
        result: "683 leads",
        efficiency: "CPL Rp 79k",
        reach: "512k",
        health: "caution",
        healthLabel: "Kuning / monitor CPM",
        adsets: [
          {
            name: "Broad 28-45",
            status: "Active",
            spend: "Rp 21jt",
            result: "248 leads",
            efficiency: "CTR 2.5%",
            reach: "220k",
            ads: [
              {
                name: "Video itinerary / 9 hari",
                status: "LP",
                spend: "Rp 7.3jt",
                result: "91 leads",
                efficiency: "Reach strong",
                reach: "83k",
              },
            ],
          },
        ],
      },
    ],
  },
  alaika: {
    label: "Alaika Habibi",
    range: "30 hari",
    kpis: [
      { label: "CPL", value: "Rp 72k", trend: "-4% vs target", chip: "Target Rp 75k" },
      { label: "Total Leads", value: "1,214", trend: "+86 this week", chip: "Stable" },
      { label: "Reach", value: "1.1jt", trend: "+9%", chip: "Mid funnel strength" },
      { label: "Total Spend", value: "Rp 96jt", trend: "62% budget used", chip: "Healthy reserve" },
    ],
    secondary: [
      { label: "CPM", value: "Rp 47k", note: "Lean delivery" },
      { label: "CTR", value: "2.4%", note: "Creative masih segar" },
      { label: "Frequency", value: "1.9", note: "Aman" },
      { label: "Reach", value: "1.1jt", note: "Konsisten" },
    ],
    alerts: [
      {
        level: "danger",
        title: "No delivery / Weekend lead form",
        diagnosis: "Ad aktif tetapi reach = 0 selama 6 jam terakhir.",
        action: "Cek overlap audience, status approval creative, dan limitasi penjadwalan.",
      },
      {
        level: "success",
        title: "Winning ad suggest / Couple story static",
        diagnosis: "CPL dan CTR sama-sama di atas median 14 hari.",
        action: "Naikkan budget 15% dan siapkan turunan copy untuk remarketing.",
      },
    ],
    fallback: "API fallback: token per brand dipisah agar gangguan pada satu akun tidak mematikan brand lain.",
    campaigns: [
      {
        name: "Lead Form / Couple Journey",
        status: "Active",
        spend: "Rp 26jt",
        result: "351 leads",
        efficiency: "CPL Rp 74k",
        reach: "309k",
        health: "good",
        healthLabel: "Hijau / efficient",
        adsets: [
          {
            name: "Warm Audience Stack",
            status: "Active",
            spend: "Rp 13jt",
            result: "201 leads",
            efficiency: "CTR 2.8%",
            reach: "121k",
            ads: [
              {
                name: "Couple story static / form",
                status: "Lead Form",
                spend: "Rp 5.6jt",
                result: "97 leads",
                efficiency: "CPL Rp 58k",
                reach: "44k",
              },
            ],
          },
        ],
      },
    ],
  },
};

const intelligenceCards = [
  {
    domain: "labbaikatravel.com",
    advertiser: "Labbaika competitor set",
    funnel: "LP",
    type: "Video",
    cta: "Learn More",
    active: "Aktif sejak 3 Mei 2026",
    copy: "Tawarkan itinerary padat namun nyaman dengan hook keberangkatan aman bersama pembimbing.",
    note: "Volume tinggi pada angle itinerary dan paket keluarga.",
  },
  {
    domain: "umrohceria.id",
    advertiser: "Umroh Ceria",
    funnel: "CTWA",
    type: "Image",
    cta: "Send Message",
    active: "Aktif sejak 1 Mei 2026",
    copy: "Copy fokus pada tanya harga cepat dan konsultasi WhatsApp tanpa komitmen.",
    note: "Indicative untuk push lead cepat ke tim closing.",
  },
  {
    domain: "ngajidigital.id",
    advertiser: "Ngaji Digital",
    funnel: "Visit Profile",
    type: "Reel",
    cta: "View Profile",
    active: "Aktif sejak 5 Mei 2026",
    copy: "Konten edukasi ringan dengan CTA rendah friksi untuk memancing view profile dan trust.",
    note: "Bagus sebagai inspirasi top funnel tanpa hard sell.",
  },
  {
    domain: "alaika-journey.com",
    advertiser: "Alaika competitor set",
    funnel: "Lead Form",
    type: "Carousel",
    cta: "Sign Up",
    active: "Aktif sejak 28 April 2026",
    copy: "Offer dengan urgency kursi terbatas dan penekanan proses pendaftaran yang sederhana.",
    note: "Sinyal kuat untuk momen conversion push.",
  },
  {
    domain: "safarumroh.co",
    advertiser: "Safar Umroh",
    funnel: "LP",
    type: "Image",
    cta: "Shop Now",
    active: "Aktif sejak 22 April 2026",
    copy: "Landing page menonjolkan tabel paket dan bonus city tour sebagai pembeda utama.",
    note: "Visual statis tetapi copy pricing sangat jelas.",
  },
  {
    domain: "muslimtrip.asia",
    advertiser: "Muslim Trip",
    funnel: "CTWA",
    type: "Video",
    cta: "Send Message",
    active: "Aktif sejak 6 Mei 2026",
    copy: "Gunakan video suasana perjalanan dan CTA langsung ke WhatsApp untuk konsultasi paket.",
    note: "Pattern cocok untuk high intent warm audience.",
  },
];

const competitorDomains = [
  {
    domain: "labbaikatravel.com",
    ads: 132,
    mix: { LP: 54, CTWA: 22, "Visit Profile": 14, "Lead Form": 10 },
    action: "Jadikan angle itinerary dan trust signal keluarga sebagai bahan benchmark creative baru.",
  },
  {
    domain: "ngajidigital.id",
    ads: 98,
    mix: { LP: 30, CTWA: 18, "Visit Profile": 38, "Lead Form": 14 },
    action: "Pantau dominasi Visit Profile sebagai top funnel education play yang bisa mengurangi resistance awal.",
  },
  {
    domain: "alaika-journey.com",
    ads: 84,
    mix: { LP: 22, CTWA: 19, "Visit Profile": 17, "Lead Form": 42 },
    action: "Lead Form makin dominan, artinya ada penekanan kuat ke capture lead instan.",
  },
];

const state = {
  section: "overview",
  brand: "ngajigaes",
  range: "30 hari",
  funnel: "All",
  selectedDomain: competitorDomains[0].domain,
};

const USE_REAL_DATA = Boolean(window.SUPABASE_URL);
const DEFAULT_STATUS_TEXT = "Supabase fallback ready";
const SNAPSHOT_CACHE_PREFIX = "adslab_snapshot_";
const FRESH_WARNING_HOURS = 4;
const FRESH_DANGER_HOURS = 6;
const ADMIN_URL_PARAM = new URLSearchParams(window.location.search).get("admin");
const IS_ADMIN = ADMIN_URL_PARAM === "1";
const runtimeState = {
  dashboardRequestId: 0,
  intelligenceRequestId: 0,
  dashboardBanner: null,
  kpiTargetsByCampaign: {},
  editingCampaignId: null,
  draftTargetValue: "",
  savingCampaignId: null,
};
const brandTargets = {
  ngajigaes: { roas: 3, cpp: 45000 },
  labbaika: { cpl: 80000 },
  alaika: { cpl: 75000 },
};
const brandMetricConfig = {
  ngajigaes: { metric: "roas", label: "ROAS", formatter: formatMultiplier },
  labbaika: { metric: "cpl", label: "CPL", formatter: formatCurrency },
  alaika: { metric: "cpl", label: "CPL", formatter: formatCurrency },
};

window.IS_ADMIN = IS_ADMIN;

const funnelColors = {
  LP: "#d8b35d",
  CTWA: "#84dba9",
  "Visit Profile": "#ffb347",
  "Lead Form": "#f56f6f",
};

const pageSections = document.querySelectorAll(".page-section");
const navLinks = document.querySelectorAll(".nav-link");
const topbarElement = document.querySelector(".topbar");
const topbarStatusPill = document.getElementById("topbar-status-pill");
const topbarStatus = document.getElementById("topbar-status");
const topbarFreshness = document.getElementById("topbar-freshness");
const staleBanner = createStaleBanner();

function createStaleBanner() {
  const element = document.createElement("div");
  element.className = "fallback-banner topbar-banner hidden";
  element.setAttribute("hidden", "hidden");
  topbarElement.insertAdjacentElement("afterend", element);
  return element;
}

function setTopbarState(options) {
  const mode = options?.mode || "default";
  const label = options?.label || DEFAULT_STATUS_TEXT;
  const freshnessText = options?.freshnessText || "";

  topbarStatusPill.classList.remove("loading", "warning", "neutral");
  if (mode === "loading" || mode === "warning" || mode === "neutral") {
    topbarStatusPill.classList.add(mode);
  }

  topbarStatus.textContent = label;

  if (freshnessText) {
    topbarFreshness.hidden = false;
    topbarFreshness.textContent = freshnessText;
    return;
  }

  topbarFreshness.hidden = true;
  topbarFreshness.textContent = "";
}

function setStaleBanner(options) {
  runtimeState.dashboardBanner = options || null;
  renderStaleBanner();
}

function renderStaleBanner() {
  const banner = runtimeState.dashboardBanner;

  staleBanner.classList.remove("warning", "danger", "hidden");

  if (!banner || state.section !== "dashboard") {
    staleBanner.hidden = true;
    staleBanner.classList.add("hidden");
    staleBanner.textContent = "";
    return;
  }

  staleBanner.hidden = false;
  staleBanner.classList.add(banner.level === "danger" ? "danger" : "warning");
  staleBanner.textContent = banner.message;
}

function getDateRangeForState() {
  const now = new Date();
  const end = new Date(now);
  const start = new Date(now);
  const days = state.range === "7 hari" ? 7 : 30;

  start.setDate(start.getDate() - (days - 1));

  return {
    start: start.toISOString().slice(0, 10),
    end: end.toISOString().slice(0, 10),
  };
}

async function fetchFreshnessStatus(brand) {
  if (!USE_REAL_DATA || !window.supabase) {
    return null;
  }

  const result = await window.supabase
    .from("fetch_status")
    .select("*")
    .eq("brand", brand)
    .maybeSingle();

  if (result.error) {
    console.warn("[ADS LAB] fetch_status fallback:", result.error.message);
    return null;
  }

  return result.data || null;
}

function isSupabaseClientReady() {
  return Boolean(window.supabase);
}

function getLatestFetchedAt(rows) {
  return rows.reduce((latest, row) => {
    const current = row?.fetched_at ? new Date(row.fetched_at).getTime() : 0;
    return current > latest ? current : latest;
  }, 0);
}

function selectLatestSnapshotRows(rows) {
  if (!Array.isArray(rows) || !rows.length) {
    return [];
  }

  const latestTimestamp = getLatestFetchedAt(rows);

  if (!latestTimestamp) {
    return rows.slice();
  }

  return rows.filter((row) => {
    return row?.fetched_at && new Date(row.fetched_at).getTime() === latestTimestamp;
  });
}

function sumMetric(rows, key) {
  return rows.reduce((total, row) => total + toFiniteNumber(row[key]), 0);
}

function toFiniteNumber(value) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

function roundValue(value, precision) {
  if (!Number.isFinite(value)) {
    return 0;
  }

  const factor = 10 ** precision;
  return Math.round(value * factor) / factor;
}

function formatCurrency(value) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(Math.round(toFiniteNumber(value)));
}

function formatCompactNumber(value) {
  return new Intl.NumberFormat("id-ID", {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(toFiniteNumber(value));
}

function formatCount(value, suffix) {
  return `${new Intl.NumberFormat("id-ID").format(Math.round(toFiniteNumber(value)))} ${suffix}`;
}

function formatPercent(value, digits) {
  return `${roundValue(toFiniteNumber(value) * 100, digits).toFixed(digits)}%`;
}

function formatMultiplier(value) {
  return `${roundValue(value, 1).toFixed(1)}x`;
}

function formatRelativeTime(timestamp) {
  if (!timestamp) {
    return "belum tersedia";
  }

  const diffMs = Date.now() - new Date(timestamp).getTime();

  if (!Number.isFinite(diffMs)) {
    return "belum tersedia";
  }

  const totalMinutes = Math.max(0, Math.round(diffMs / 60000));

  if (totalMinutes < 60) {
    return `${totalMinutes} menit lalu`;
  }

  const totalHours = Math.round(totalMinutes / 60);
  if (totalHours < 24) {
    return `${totalHours} jam lalu`;
  }

  const totalDays = Math.round(totalHours / 24);
  return `${totalDays} hari lalu`;
}

function formatDateTime(timestamp) {
  if (!timestamp) {
    return "timestamp belum tersedia";
  }

  return new Intl.DateTimeFormat("id-ID", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(timestamp));
}

function getSnapshotCacheKey(brand) {
  return `${SNAPSHOT_CACHE_PREFIX}${brand}`;
}

function canUseLocalStorage() {
  try {
    return typeof window.localStorage !== "undefined";
  } catch (error) {
    return false;
  }
}

function saveSnapshotToCache(brand, rows, freshnessStatus) {
  if (!canUseLocalStorage() || !Array.isArray(rows) || !rows.length) {
    return;
  }

  const fetchedAt = freshnessStatus?.last_fetched_at || rows[0]?.fetched_at || new Date().toISOString();
  const payload = {
    brand: brand,
    rows: rows,
    fetched_at: fetchedAt,
    cached_at: new Date().toISOString(),
    freshness_status: freshnessStatus || null,
  };

  try {
    window.localStorage.setItem(getSnapshotCacheKey(brand), JSON.stringify(payload));
  } catch (error) {
    console.warn("[ADS LAB] localStorage write skipped:", error.message);
  }
}

function readSnapshotFromCache(brand) {
  if (!canUseLocalStorage()) {
    return null;
  }

  try {
    const rawValue = window.localStorage.getItem(getSnapshotCacheKey(brand));

    if (!rawValue) {
      return null;
    }

    const parsedValue = JSON.parse(rawValue);
    return Array.isArray(parsedValue?.rows) ? parsedValue : null;
  } catch (error) {
    console.warn("[ADS LAB] localStorage read skipped:", error.message);
    return null;
  }
}

function detectHelperMockRows(rows) {
  return Array.isArray(rows) && rows.some((row) => row?.status === "mock-fallback");
}

function getAgeInHours(timestamp) {
  if (!timestamp) {
    return Number.POSITIVE_INFINITY;
  }

  const diffMs = Date.now() - new Date(timestamp).getTime();
  return Number.isFinite(diffMs) ? diffMs / 3600000 : Number.POSITIVE_INFINITY;
}

function checkFreshness(timestamp, options) {
  const safeOptions = options || {};
  const ageHours = getAgeInHours(timestamp);
  const exactTime = formatDateTime(timestamp);

  if (safeOptions.forceDanger) {
    return {
      level: "danger",
      message: `Data mungkin tidak akurat — cek Ads Manager. Last valid snapshot ${formatRelativeTime(timestamp)} • ${exactTime}.`,
    };
  }

  // < 4 jam normal, 4-6 jam warning, > 6 jam danger
  if (ageHours < FRESH_WARNING_HOURS) {
    return null;
  }

  if (ageHours <= FRESH_DANGER_HOURS) {
    return {
      level: "warning",
      message: `Data dari ${formatRelativeTime(timestamp)} — sedang refresh. Last valid snapshot ${exactTime}.`,
    };
  }

  return {
    level: "danger",
    message: `Data mungkin tidak akurat — cek Ads Manager. Last valid snapshot ${formatRelativeTime(timestamp)} • ${exactTime}.`,
  };
}

function getBrandMetricConfig(brandKey) {
  return brandMetricConfig[brandKey] || { metric: "roas", label: "ROAS", formatter: formatMultiplier };
}

async function fetchKpiTargetsForBrand(brand) {
  if (!USE_REAL_DATA || !window.supabase) {
    return {};
  }

  const result = await window.supabase
    .from("campaign_kpi_targets")
    .select("*")
    .eq("brand", brand);

  if (result.error) {
    console.warn("[ADS LAB] campaign_kpi_targets fallback:", result.error.message);
    return {};
  }

  return (result.data || []).reduce((accumulator, row) => {
    if (!row?.campaign_id || !row?.kpi_type) {
      return accumulator;
    }

    accumulator[row.campaign_id] = {
      kpiType: row.kpi_type,
      targetValue: toFiniteNumber(row.target_value),
      source: "supabase",
    };
    return accumulator;
  }, {});
}

function getDefaultTargetConfig(brandKey) {
  const metricConfig = getBrandMetricConfig(brandKey);
  const defaultTargetValue = brandTargets[brandKey]?.[metricConfig.metric] || 0;

  return {
    kpiType: metricConfig.metric,
    targetValue: defaultTargetValue,
    source: "default",
  };
}

function getCampaignTargetConfig(brandKey, campaignId) {
  return runtimeState.kpiTargetsByCampaign[campaignId] || getDefaultTargetConfig(brandKey);
}

function getStatus(actual, target, metric) {
  const actualValue = toFiniteNumber(actual);
  const targetValue = toFiniteNumber(target);

  if (actualValue <= 0 || targetValue <= 0) {
    return "caution";
  }

  const ratio = metric === "cpl" || metric === "cpp" ? targetValue / actualValue : actualValue / targetValue;

  if (ratio >= 1.0) {
    return "good";
  }

  if (ratio >= 0.9) {
    return "caution";
  }

  return "risk";
}

function formatTargetValue(metric, value) {
  if (metric === "cpl" || metric === "cpp") {
    return formatCurrency(value);
  }

  if (metric === "reach") {
    return formatCompactNumber(value);
  }

  return formatMultiplier(value);
}

function getTargetSourceLabel(source) {
  return source === "supabase" ? "Admin target" : "Default target";
}

async function saveCampaignTargetValue(campaignId, kpiType, value) {
  const numericValue = Number(value);

  if (!campaignId || !kpiType || !Number.isFinite(numericValue) || numericValue <= 0) {
    throw new Error("Target KPI harus berupa angka lebih besar dari 0");
  }

  runtimeState.savingCampaignId = campaignId;

  try {
    const result = await window.saveKpiTarget(campaignId, kpiType, numericValue);

    if (result?.error && !result?.mock) {
      throw new Error(result.error.message || "Save KPI target gagal");
    }

    runtimeState.kpiTargetsByCampaign[campaignId] = {
      kpiType: kpiType,
      targetValue: numericValue,
      source: result?.mock ? "default" : "supabase",
    };
    runtimeState.editingCampaignId = null;
    runtimeState.draftTargetValue = "";
  } finally {
    runtimeState.savingCampaignId = null;
  }
}

function getMetricSummary(brandKey, rows) {
  const spend = sumMetric(rows, "spend");
  const reach = sumMetric(rows, "reach");
  const impressions = sumMetric(rows, "impressions");
  const clicks = sumMetric(rows, "clicks");
  const purchases = sumMetric(rows, "purchases");
  const purchaseValue = sumMetric(rows, "purchase_value");
  const leads = sumMetric(rows, "leads");
  const ctr = impressions > 0 ? clicks / impressions : 0;
  const cpm = impressions > 0 ? (spend / impressions) * 1000 : 0;
  const frequency = reach > 0 ? impressions / reach : 0;
  const roas = spend > 0 ? purchaseValue / spend : 0;
  const cpl = leads > 0 ? spend / leads : 0;
  const cpp = purchases > 0 ? spend / purchases : 0;
  const target = brandTargets[brandKey] || {};

  return {
    spend,
    reach,
    impressions,
    clicks,
    purchases,
    purchaseValue,
    leads,
    ctr,
    cpm,
    frequency,
    roas,
    cpl,
    cpp,
    target,
  };
}

function buildDashboardViewModel(brandKey, rows, freshnessStatus) {
  const template = dashboardData[brandKey];
  const latestRows = selectLatestSnapshotRows(rows);
  const metrics = getMetricSummary(brandKey, latestRows);
  const fetchedAt =
    freshnessStatus?.last_fetched_at ||
    latestRows[0]?.fetched_at ||
    rows[0]?.fetched_at ||
    null;
  const hasRows = latestRows.length > 0;

  return {
    label: template.label,
    range: state.range,
    kpis: buildDashboardKpis(brandKey, metrics),
    secondary: buildSecondaryMetrics(metrics),
    alerts: buildDashboardAlerts(brandKey, metrics, hasRows),
    fallback: hasRows
      ? `Scheduled snapshot aktif. Last updated ${formatRelativeTime(fetchedAt)} (${formatDateTime(fetchedAt)}).`
      : "Belum ada snapshot Supabase untuk brand ini pada range terpilih.",
    campaigns: buildCampaignGroups(brandKey, latestRows),
  };
}

function buildDashboardErrorViewModel(brandKey, errorMessage) {
  const template = dashboardData[brandKey];

  return {
    label: template.label,
    range: state.range,
    kpis: [
      { label: "Snapshot Status", value: "Error", trend: "Fetch real gagal", chip: "Needs review" },
      { label: "Last Attempt", value: "Gagal", trend: "Belum ada cache lokal", chip: "Supabase down" },
      { label: "Fallback Source", value: "None", trend: "Gunakan cache browser jika tersedia", chip: "No cached row" },
      { label: "Operator Action", value: "Cek logs", trend: "Lihat meta-fetch / fetch_status", chip: "Manual review" },
    ],
    secondary: [
      { label: "CPM", value: "-", note: "Menunggu snapshot valid" },
      { label: "CTR", value: "-", note: "Menunggu snapshot valid" },
      { label: "Frequency", value: "-", note: "Menunggu snapshot valid" },
      { label: "Reach", value: "-", note: errorMessage || "Snapshot gagal dimuat" },
    ],
    alerts: [
      {
        level: "danger",
        title: "Snapshot real tidak tersedia",
        diagnosis: errorMessage || "Supabase atau helper snapshot gagal merespons.",
        action: "Periksa network, cek scheduled fetch, lalu refresh setelah sumber data pulih.",
      },
    ],
    fallback: "Data real gagal dimuat dan cache lokal belum tersedia.",
    campaigns: [],
  };
}

function buildDashboardKpis(brandKey, metrics) {
  if (brandKey === "ngajigaes") {
    const profitRate =
      metrics.purchaseValue > 0 ? (metrics.purchaseValue - metrics.spend) / metrics.purchaseValue : 0;

    return [
      {
        label: "ROAS",
        value: formatMultiplier(metrics.roas),
        trend: `${metrics.roas >= metrics.target.roas ? "Di atas" : "Di bawah"} target ${formatMultiplier(metrics.target.roas)}`,
        chip: `Target ${formatMultiplier(metrics.target.roas)}`,
      },
      {
        label: "Cost / Purchase",
        value: formatCurrency(metrics.cpp),
        trend: `${metrics.purchases > 0 ? `${formatCount(metrics.purchases, "purchase")}` : "Belum ada purchase"}`,
        chip: `Goal ${formatCurrency(metrics.target.cpp)}`,
      },
      {
        label: "Profit Rate",
        value: formatPercent(profitRate, 1),
        trend: `${formatCurrency(metrics.purchaseValue - metrics.spend)} margin kotor`,
        chip: "Value - Spend",
      },
      {
        label: "Total Spend",
        value: formatCurrency(metrics.spend),
        trend: `${formatCompactNumber(metrics.impressions)} impressions`,
        chip: "Snapshot current range",
      },
    ];
  }

  const targetCpl = metrics.target.cpl || 0;

  return [
    {
      label: "CPL",
      value: formatCurrency(metrics.cpl),
      trend: `${metrics.cpl <= targetCpl ? "Lebih efisien" : "Di atas"} target ${formatCurrency(targetCpl)}`,
      chip: `Target ${formatCurrency(targetCpl)}`,
    },
    {
      label: "Total Leads",
      value: new Intl.NumberFormat("id-ID").format(Math.round(metrics.leads)),
      trend: `${formatCompactNumber(metrics.clicks)} clicks terukur`,
      chip: "Current scheduled snapshot",
    },
    {
      label: "Reach",
      value: formatCompactNumber(metrics.reach),
      trend: `${formatCompactNumber(metrics.impressions)} impressions`,
      chip: "Audience delivered",
    },
    {
      label: "Total Spend",
      value: formatCurrency(metrics.spend),
      trend: `${formatPercent(metrics.ctr, 1)} CTR rata-rata`,
      chip: "Snapshot current range",
    },
  ];
}

function buildSecondaryMetrics(metrics) {
  return [
    { label: "CPM", value: formatCurrency(metrics.cpm), note: "Biaya per 1.000 impressions" },
    { label: "CTR", value: formatPercent(metrics.ctr, 1), note: "Derived dari clicks/impressions" },
    { label: "Frequency", value: roundValue(metrics.frequency, 1).toFixed(1), note: "Impressions per reach" },
    { label: "Reach", value: formatCompactNumber(metrics.reach), note: "Jangkauan total pada snapshot terbaru" },
  ];
}

function buildDashboardAlerts(brandKey, metrics, hasRows) {
  if (!hasRows) {
    return [
      {
        level: "warning",
        title: "Snapshot belum tersedia",
        diagnosis: "Supabase belum punya snapshot untuk brand atau range yang sedang dipilih.",
        action: "Tunggu scheduled fetch berikutnya atau cek konfigurasi `meta-fetch` dan `fetch_status`.",
      },
    ];
  }

  const alerts = [];

  if (brandKey === "ngajigaes") {
    alerts.push(
      metrics.roas >= metrics.target.roas
        ? {
            level: "success",
            title: "ROAS on track",
            diagnosis: `ROAS ${formatMultiplier(metrics.roas)} sudah memenuhi target utama brand ini.`,
            action: "Pertahankan creative winner dan scale bertahap pada campaign dengan CPP terendah.",
          }
        : {
            level: "danger",
            title: "ROAS di bawah target",
            diagnosis: `ROAS turun ke ${formatMultiplier(metrics.roas)} dan belum menyentuh target ${formatMultiplier(metrics.target.roas)}.`,
            action: "Audit kombinasi audience + creative, lalu kurangi spend pada adset paling mahal.",
          }
    );
  } else {
    alerts.push(
      metrics.cpl <= metrics.target.cpl
        ? {
            level: "success",
            title: "Lead acquisition efisien",
            diagnosis: `CPL ${formatCurrency(metrics.cpl)} masih sesuai target ${formatCurrency(metrics.target.cpl)}.`,
            action: "Pertahankan adset paling stabil dan siapkan creative turunan untuk jaga volume leads.",
          }
        : {
            level: "warning",
            title: "CPL perlu diawasi",
            diagnosis: `CPL ${formatCurrency(metrics.cpl)} sudah melewati target ${formatCurrency(metrics.target.cpl)}.`,
            action: "Review audience overlap, periksa CPM, dan siapkan angle yang lebih broad.",
          }
    );
  }

  alerts.push(
    metrics.frequency >= 2.8
      ? {
          level: "warning",
          title: "Frequency mulai tinggi",
          diagnosis: `Frequency ${roundValue(metrics.frequency, 1).toFixed(1)} mengindikasikan fatigue perlu dipantau.`,
          action: "Segarkan hook utama dan siapkan rotasi creative untuk audience warm.",
        }
      : {
          level: "success",
          title: "Frequency masih sehat",
          diagnosis: `Frequency ${roundValue(metrics.frequency, 1).toFixed(1)} masih memberi ruang delivery yang aman.`,
          action: "Lanjutkan pengujian creative tanpa perlu throttle spend agresif.",
        }
  );

  return alerts;
}

function buildCampaignGroups(brandKey, rows) {
  const campaigns = new Map();

  rows.forEach((row) => {
    const campaignId = row.campaign_id || "unknown-campaign";
    const campaignName = row.campaign_name || "Unknown Campaign";
    const adsetKey = row.adset_id || row.adset_name || "unknown-adset";

    if (!campaigns.has(campaignId)) {
      campaigns.set(campaignId, {
        id: campaignId,
        name: campaignName,
        rows: [],
        adsets: new Map(),
      });
    }

    const campaign = campaigns.get(campaignId);
    campaign.rows.push(row);

    if (!campaign.adsets.has(adsetKey)) {
      campaign.adsets.set(adsetKey, {
        name: row.adset_name || "Adset tanpa nama",
        status: normalizeStatus(row.status),
        rows: [],
        ads: [],
      });
    }

    const adset = campaign.adsets.get(adsetKey);
    adset.rows.push(row);
    adset.ads.push({
      name: row.ad_name || "Ad tanpa nama",
      status: normalizeAdLabel(row),
      spend: formatCurrency(row.spend),
      result: formatPrimaryResult(brandKey, row),
      efficiency: formatRowEfficiency(brandKey, row),
      reach: formatCompactNumber(row.reach),
    });
  });

  return Array.from(campaigns.values())
    .map((campaign) => {
      const metrics = getMetricSummary(brandKey, campaign.rows);
      const targetConfig = getCampaignTargetConfig(brandKey, campaign.id);
      const tone = getHealthTone(brandKey, metrics, targetConfig);
      return {
        id: campaign.id,
        name: campaign.name,
        status: "Active",
        spend: formatCurrency(metrics.spend),
        result: formatAggregateResult(brandKey, metrics),
        efficiency: formatAggregateEfficiency(brandKey, metrics),
        reach: formatCompactNumber(metrics.reach),
        health: tone,
        healthLabel: getHealthLabel(tone),
        targetLabel: `${getBrandMetricConfig(brandKey).label} target ${formatTargetValue(targetConfig.kpiType, targetConfig.targetValue)}`,
        targetMeta: getTargetSourceLabel(targetConfig.source),
        metricType: targetConfig.kpiType,
        targetValue: targetConfig.targetValue,
        actualMetricValue: getMetricActualValue(metrics, targetConfig.kpiType),
        adsets: Array.from(campaign.adsets.values()).map((adset) => {
          const adsetMetrics = getMetricSummary(brandKey, adset.rows);
          return {
            name: adset.name,
            status: adset.status,
            spend: formatCurrency(adsetMetrics.spend),
            result: formatAggregateResult(brandKey, adsetMetrics),
            efficiency: formatAggregateEfficiency(brandKey, adsetMetrics),
            reach: formatCompactNumber(adsetMetrics.reach),
            ads: adset.ads,
          };
        }),
      };
    })
    .sort((left, right) => {
      return toFiniteNumber(right.spend?.replace(/[^\d]/g, "")) - toFiniteNumber(left.spend?.replace(/[^\d]/g, ""));
    });
}

function normalizeStatus(status) {
  if (!status) {
    return "Active";
  }

  return String(status)
    .replace(/_/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

function normalizeAdLabel(row) {
  return row.status ? normalizeStatus(row.status) : row.level ? normalizeStatus(row.level) : "Ad";
}

function formatPrimaryResult(brandKey, row) {
  if (brandKey === "ngajigaes") {
    return formatCount(row.purchases, "purchase");
  }

  return formatCount(row.leads, "lead");
}

function formatAggregateResult(brandKey, metrics) {
  if (brandKey === "ngajigaes") {
    return formatCount(metrics.purchases, "purchase");
  }

  return formatCount(metrics.leads, "lead");
}

function formatRowEfficiency(brandKey, row) {
  if (brandKey === "ngajigaes") {
    return `CPP ${formatCurrency(row.cpp)}`;
  }

  return `CPL ${formatCurrency(row.cpl)}`;
}

function formatAggregateEfficiency(brandKey, metrics) {
  if (brandKey === "ngajigaes") {
    return `ROAS ${formatMultiplier(metrics.roas)}`;
  }

  return `CPL ${formatCurrency(metrics.cpl)}`;
}

function getMetricActualValue(metrics, metric) {
  if (metric === "roas") {
    return metrics.roas;
  }

  if (metric === "cpl") {
    return metrics.cpl;
  }

  if (metric === "cpp") {
    return metrics.cpp;
  }

  if (metric === "reach") {
    return metrics.reach;
  }

  return metrics.roas;
}

function getHealthTone(brandKey, metrics, targetConfig) {
  const safeTargetConfig = targetConfig || getDefaultTargetConfig(brandKey);
  return getStatus(getMetricActualValue(metrics, safeTargetConfig.kpiType), safeTargetConfig.targetValue, safeTargetConfig.kpiType);
}

function getHealthLabel(tone) {
  if (tone === "good") {
    return "Hijau / on track";
  }

  if (tone === "caution") {
    return "Kuning / monitor";
  }

  return "Merah / perlu aksi";
}

function getBaseIntelligenceCards() {
  return state.funnel === "All"
    ? intelligenceCards
    : intelligenceCards.filter((card) => card.funnel === state.funnel);
}

function buildIntelligenceCards(rows) {
  return rows.map((row) => {
    const destinationDomain = extractDomain(row.destination_url);

    return {
      domain: destinationDomain || row.advertiser_name || "unknown-domain",
      advertiser: row.advertiser_name || "Advertiser tidak tersedia",
      funnel: row.funnel_type || "Unknown",
      type: normalizeCreativeType(row.creative_type),
      cta: row.cta_button || "CTA tidak tersedia",
      active: `Aktif ${formatRelativeTime(row.date_active)}`,
      copy: row.ad_copy || "Copy iklan tidak tersedia pada snapshot ini.",
      note: destinationDomain
        ? `Destination mengarah ke ${destinationDomain}.`
        : "Destination URL belum tersimpan pada row ini.",
    };
  });
}

function extractDomain(url) {
  if (!url) {
    return "";
  }

  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch (error) {
    return "";
  }
}

function normalizeCreativeType(type) {
  if (!type) {
    return "Unknown";
  }

  return String(type)
    .split(/[\s_-]+/)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function renderDashboardLoading() {
  const loadingCard = `
    <div class="loading-card loading-skeleton">
      <span class="loading-line short"></span>
      <span class="loading-line"></span>
      <span class="loading-line medium"></span>
    </div>
  `;
  const compactLoadingCard = `
    <div class="loading-card compact loading-skeleton">
      <span class="loading-line short"></span>
      <span class="loading-line"></span>
    </div>
  `;

  document.getElementById("kpi-grid").innerHTML = Array.from({ length: 4 }).map(() => loadingCard).join("");
  document.getElementById("secondary-grid").innerHTML = Array.from({ length: 4 }).map(() => compactLoadingCard).join("");
  document.getElementById("alert-list").innerHTML = Array.from({ length: 2 }).map(() => loadingCard).join("");
  document.getElementById("campaign-table").innerHTML = `
    <div class="loading-shell">
      ${Array.from({ length: 2 }).map(() => loadingCard).join("")}
    </div>
  `;
  document.getElementById("fallback-banner").textContent = "Loading scheduled snapshot dari Supabase...";
}

function renderIntelligenceLoading() {
  const loadingCard = `
    <div class="loading-card loading-skeleton">
      <span class="loading-line short"></span>
      <span class="loading-line"></span>
      <span class="loading-line"></span>
      <span class="loading-line medium"></span>
    </div>
  `;

  document.getElementById("intelligence-summary").innerHTML = `
    <div class="loading-shell columns-2">
      ${Array.from({ length: 4 }).map(() => loadingCard).join("")}
    </div>
  `;
  document.getElementById("intelligence-cards").innerHTML = Array.from({ length: 4 }).map(() => loadingCard).join("");
}

function renderKpiConfig(campaign) {
  const isEditing = IS_ADMIN && runtimeState.editingCampaignId === campaign.id;
  const isSaving = runtimeState.savingCampaignId === campaign.id;
  const metricLabel = campaign.metricType.toUpperCase();

  if (!IS_ADMIN) {
    return `
      <div class="kpi-config-display">
        <span class="metric-chip">${campaign.targetLabel}</span>
        <span class="kpi-config-note">${campaign.targetMeta}</span>
      </div>
    `;
  }

  if (isEditing) {
    const currentValue =
      runtimeState.draftTargetValue || String(roundValue(toFiniteNumber(campaign.targetValue || 0), 2));
    return `
      <div class="kpi-config-editor">
        <label class="kpi-config-label" for="kpi-target-${campaign.id}">${metricLabel} target</label>
        <input
          class="kpi-config-input"
          id="kpi-target-${campaign.id}"
          type="number"
          step="0.01"
          min="0"
          value="${currentValue}"
        />
        <div class="kpi-config-actions">
          <button class="campaign-toggle kpi-save-button" data-save-kpi="${campaign.id}" data-kpi-type="${campaign.metricType}" ${isSaving ? "disabled" : ""}>
            ${isSaving ? "Saving..." : "Save"}
          </button>
          <button class="campaign-toggle kpi-cancel-button" data-cancel-kpi="${campaign.id}" ${isSaving ? "disabled" : ""}>
            Cancel
          </button>
        </div>
      </div>
    `;
  }

  return `
    <div class="kpi-config-display">
      <span class="metric-chip">${campaign.targetLabel}</span>
      <span class="kpi-config-note">${campaign.targetMeta}</span>
      <button class="campaign-toggle kpi-edit-button" data-edit-kpi="${campaign.id}" aria-label="Edit KPI target">
        Edit target
      </button>
    </div>
  `;
}

function bindKpiConfigActions() {
  document.querySelectorAll("[data-edit-kpi]").forEach((button) => {
    button.addEventListener("click", () => {
      const campaignId = button.dataset.editKpi;
      const currentTarget = runtimeState.kpiTargetsByCampaign[campaignId]?.targetValue;

      runtimeState.editingCampaignId = campaignId;
      runtimeState.draftTargetValue =
        currentTarget !== undefined ? String(currentTarget) : "";
      void renderDashboard();
    });
  });

  document.querySelectorAll("[data-cancel-kpi]").forEach((button) => {
    button.addEventListener("click", () => {
      runtimeState.editingCampaignId = null;
      runtimeState.draftTargetValue = "";
      void renderDashboard();
    });
  });

  document.querySelectorAll("[data-save-kpi]").forEach((button) => {
    button.addEventListener("click", async () => {
      const campaignId = button.dataset.saveKpi;
      const metricType = button.dataset.kpiType || getBrandMetricConfig(state.brand).metric;
      const input = document.getElementById(`kpi-target-${campaignId}`);

      runtimeState.draftTargetValue = input ? input.value : "";

      try {
        await saveCampaignTargetValue(campaignId, metricType, runtimeState.draftTargetValue);
        void renderDashboard();
      } catch (error) {
        console.warn("[ADS LAB] saveCampaignTargetValue fallback:", error.message);
        setTopbarState({
          mode: "warning",
          label: "KPI target save gagal",
          freshnessText: error.message,
        });
      }
    });
  });
}

function renderOverview() {
  document.getElementById("hero-metrics").innerHTML = overviewStats
    .map(
      (item) => `
        <div class="metric-card">
          <p class="card-label">${item.label}</p>
          <strong>${item.value}</strong>
          <span>${item.note}</span>
        </div>
      `,
    )
    .join("");

  document.getElementById("reading-list").innerHTML = productReadings
    .map(
      (item) => `
        <div class="reading-item">
          <strong>${item.title}</strong>
          <p>${item.body}</p>
        </div>
      `,
    )
    .join("");

  document.getElementById("recent-feed").innerHTML = recentFeed
    .map(
      (item) => `
        <div class="feed-item">
          <div class="feed-meta">
            <strong>${item.title}</strong>
            <span>${item.meta}</span>
          </div>
          <div class="feed-copy">${item.detail}</div>
        </div>
      `,
    )
    .join("");

  document.getElementById("watchlist-grid").innerHTML = watchlist
    .map(
      (item) => `
        <div class="watch-card">
          <span class="watch-pill">${item.type}</span>
          <strong>${item.name}</strong>
          <span>${item.summary}</span>
        </div>
      `,
    )
    .join("");
}

function renderSwitchers() {
  const brandSwitcher = document.getElementById("brand-switcher");
  const rangeSwitcher = document.getElementById("range-switcher");
  const funnelFilter = document.getElementById("funnel-filter");

  brandSwitcher.innerHTML = Object.entries(dashboardData)
    .map(
      ([key, brand]) => `
        <button class="${state.brand === key ? "active" : ""}" data-brand="${key}">
          ${brand.label}
        </button>
      `,
    )
    .join("");

  rangeSwitcher.innerHTML = ["7 hari", "30 hari", "Custom"]
    .map(
      (item) => `
        <button class="${state.range === item ? "active" : ""}" data-range="${item}">
          ${item}
        </button>
      `,
    )
    .join("");

  funnelFilter.innerHTML = ["All", "LP", "CTWA", "Visit Profile", "Lead Form"]
    .map(
      (item) => `
        <button class="${state.funnel === item ? "active" : ""}" data-funnel="${item}">
          ${item}
        </button>
      `,
    )
    .join("");

  brandSwitcher.querySelectorAll("button").forEach((button) => {
    button.addEventListener("click", () => {
      state.brand = button.dataset.brand;
      window.ACTIVE_BRAND = state.brand;
      void renderDashboard();
      renderSwitchers();
    });
  });

  rangeSwitcher.querySelectorAll("button").forEach((button) => {
    button.addEventListener("click", () => {
      state.range = button.dataset.range;
      void renderDashboard();
      renderSwitchers();
    });
  });

  funnelFilter.querySelectorAll("button").forEach((button) => {
    button.addEventListener("click", () => {
      state.funnel = button.dataset.funnel;
      void renderIntelligence();
      renderSwitchers();
    });
  });
}

function applyDashboardViewModel(brand) {
  if (!brand.campaigns.length) {
    document.getElementById("campaign-table").innerHTML = `
      <div class="fallback-banner">
        Belum ada data campaign untuk snapshot terbaru. Scheduled fetch berikutnya akan mengisi area ini.
      </div>
    `;
  }

  document.getElementById("kpi-grid").innerHTML = brand.kpis
    .map(
      (item) => `
        <div class="kpi-card">
          <div class="kpi-top">
            <p class="card-label">${item.label}</p>
            <span class="metric-chip">${item.chip}</span>
          </div>
          <strong>${item.value}</strong>
          <span>${item.trend}</span>
        </div>
      `,
    )
    .join("");

  document.getElementById("secondary-grid").innerHTML = brand.secondary
    .map(
      (item) => `
        <div class="secondary-card">
          <small>${item.label}</small>
          <strong>${item.value}</strong>
          <span>${item.note}</span>
        </div>
      `,
    )
    .join("");

  document.getElementById("fallback-banner").textContent = brand.fallback;

  document.getElementById("alert-list").innerHTML = brand.alerts
    .map(
      (item) => `
        <div class="alert-item ${item.level}">
          <strong>${item.title}</strong>
          <div class="alert-meta">${item.diagnosis}</div>
          <div class="feed-copy">${item.action}</div>
        </div>
      `,
    )
    .join("");

  if (brand.campaigns.length) {
    document.getElementById("campaign-table").innerHTML = brand.campaigns
      .map(
        (campaign, index) => `
          <div class="campaign-group ${index === 0 ? "open" : ""}">
            <div class="campaign-head">
              <div class="campaign-title">
                <strong>${campaign.name}</strong>
                <span>${brand.label} • ${campaign.status}</span>
              </div>
              <span>${campaign.spend}</span>
              <span>${campaign.result}</span>
              <span>${campaign.efficiency}</span>
              <span>${campaign.reach}</span>
              <div class="campaign-health-cell">
                <span class="status-text ${campaign.health}">${campaign.healthLabel}</span>
                ${renderKpiConfig(campaign)}
              </div>
              <button class="campaign-toggle" data-toggle-details="true">Detail</button>
            </div>
            <div class="campaign-body">
              ${campaign.adsets
                .map(
                  (adset) => `
                    <div class="adset-row">
                      <div>
                        <strong>${adset.name}</strong>
                        <span>Adset • ${adset.status}</span>
                      </div>
                      <span>${adset.spend}</span>
                      <span>${adset.result}</span>
                      <span>${adset.efficiency}</span>
                      <span>${adset.reach}</span>
                      <span></span>
                    </div>
                    ${adset.ads
                      .map(
                        (ad) => `
                          <div class="ad-row">
                            <div>
                              <strong>${ad.name}</strong>
                              <span>Ad • ${ad.status}</span>
                            </div>
                            <span>${ad.spend}</span>
                            <span>${ad.result}</span>
                            <span>${ad.efficiency}</span>
                            <span>${ad.reach}</span>
                            <span></span>
                          </div>
                        `,
                      )
                      .join("")}
                  `,
                )
                .join("")}
            </div>
          </div>
        `,
      )
      .join("");
  }

  document.querySelectorAll("[data-toggle-details='true']").forEach((button) => {
    button.addEventListener("click", () => {
      button.closest(".campaign-group").classList.toggle("open");
    });
  });

  bindKpiConfigActions();
}

async function renderDashboard() {
  const requestId = ++runtimeState.dashboardRequestId;

  window.ACTIVE_BRAND = state.brand;
  setStaleBanner(null);

  if (USE_REAL_DATA) {
    renderDashboardLoading();
    setTopbarState({
      mode: "loading",
      label: "Loading scheduled snapshot",
      freshnessText: "Mengambil data terbaru dari Supabase...",
    });
  } else {
    setTopbarState({ mode: "default", label: DEFAULT_STATUS_TEXT, freshnessText: "" });
  }

  try {
    if (!USE_REAL_DATA || typeof window.fetchLatestSnapshot !== "function") {
      applyDashboardViewModel(dashboardData[state.brand]);
      setStaleBanner(null);
      return;
    }

    if (!isSupabaseClientReady()) {
      applyDashboardViewModel(dashboardData[state.brand]);
      setStaleBanner(null);
      setTopbarState({
        mode: "neutral",
        label: "Using prototype mock data",
        freshnessText: "Supabase client belum siap, jadi dashboard memakai baseline mock.",
      });
      return;
    }

    const snapshotRows = await window.fetchLatestSnapshot(state.brand, getDateRangeForState());

    if (detectHelperMockRows(snapshotRows)) {
      throw new Error("Helper Supabase mengembalikan mock fallback saat mode data real aktif");
    }

    const freshnessStatus = await fetchFreshnessStatus(state.brand);
    runtimeState.kpiTargetsByCampaign = Object.assign(
      {},
      runtimeState.kpiTargetsByCampaign,
      await fetchKpiTargetsForBrand(state.brand),
    );

    if (requestId !== runtimeState.dashboardRequestId) {
      return;
    }

    applyDashboardViewModel(buildDashboardViewModel(state.brand, snapshotRows, freshnessStatus));

    if (!snapshotRows.length) {
      setStaleBanner({
        level: "warning",
        message: "Snapshot Supabase belum tersedia untuk range ini. Dashboard tetap hidup, tetapi belum ada data valid untuk dianalisis.",
      });
      setTopbarState({
        mode: "warning",
        label: "Snapshot belum tersedia",
        freshnessText: "Supabase terhubung, tetapi brand ini belum punya data pada range yang dipilih.",
      });
      return;
    }

    const freshnessTimestamp = freshnessStatus?.last_fetched_at || snapshotRows[0]?.fetched_at || null;
    const fetchFailed = freshnessStatus?.status === "error";
    const freshnessBanner = checkFreshness(freshnessTimestamp, { forceDanger: fetchFailed });

    saveSnapshotToCache(state.brand, snapshotRows, freshnessStatus);
    setStaleBanner(freshnessBanner);

    setTopbarState({
      mode: fetchFailed ? "warning" : "default",
      label: fetchFailed ? "Scheduled fetch needs review" : "Scheduled snapshot live",
      freshnessText: freshnessTimestamp
        ? `Last updated ${formatRelativeTime(freshnessTimestamp)} • ${formatDateTime(freshnessTimestamp)}`
        : "Last updated timestamp belum tersedia.",
    });
  } catch (error) {
    console.warn("[ADS LAB] renderDashboard fallback:", error.message);

    if (requestId !== runtimeState.dashboardRequestId) {
      return;
    }

    const cachedSnapshot = readSnapshotFromCache(state.brand);

    if (cachedSnapshot?.rows?.length) {
      const cachedTimestamp =
        cachedSnapshot.fetched_at || cachedSnapshot.cached_at || cachedSnapshot.rows[0]?.fetched_at || null;

      applyDashboardViewModel(
        buildDashboardViewModel(state.brand, cachedSnapshot.rows, cachedSnapshot.freshness_status || {
          last_fetched_at: cachedTimestamp,
          status: "error",
        }),
      );
      setStaleBanner(checkFreshness(cachedTimestamp, { forceDanger: true }));
      setTopbarState({
        mode: "warning",
        label: "Using cached local snapshot",
        freshnessText: `Snapshot real gagal dimuat. Cache lokal terakhir: ${formatDateTime(cachedTimestamp)}.`,
      });
      return;
    }

    applyDashboardViewModel(buildDashboardErrorViewModel(state.brand, error.message));
    setStaleBanner({
      level: "danger",
      message: "Data mungkin tidak akurat — cek Ads Manager. Snapshot real gagal dimuat dan cache lokal belum tersedia.",
    });
    setTopbarState({
      mode: "warning",
      label: "No valid cached snapshot",
      freshnessText: "Supabase gagal dimuat dan browser belum punya snapshot lokal untuk brand ini.",
    });
  }
}

function applyIntelligenceCards(cards) {
  const safeCards = cards || [];

  document.getElementById("intelligence-summary").innerHTML = [
    {
      label: "Ads in current view",
      value: safeCards.length,
      note: "Card view dengan quick signal per creative",
    },
    {
      label: "Top funnel type",
      value: getTopFunnel(safeCards),
      note: "Pola funnel paling sering muncul di hasil filter",
    },
    {
      label: "Most common CTA",
      value: getTopCTA(safeCards),
      note: "CTA dominan untuk referensi call-to-action baru",
    },
    {
      label: "Stage classifier",
      value: "On Hold",
      note: "Ditunda ke Phase 5 sesuai addendum",
    },
  ]
    .map(
      (item) => `
        <div class="intelligence-stat">
          <small>${item.label}</small>
          <strong>${item.value}</strong>
          <span>${item.note}</span>
        </div>
      `,
    )
    .join("");

  if (!safeCards.length) {
    document.getElementById("intelligence-cards").innerHTML = `
      <article class="intel-card">
        <div class="intel-meta">
          <span class="badge neutral">No rows</span>
          <span>Supabase belum mengembalikan ads_detail</span>
        </div>
        <h4>Belum ada data competitor intelligence</h4>
        <p>Pastikan pipeline extension dan sinkronisasi Supabase sudah mengisi tabel ads_detail.</p>
        <p class="feed-copy">UI tetap hidup, tetapi insight card akan kosong sampai data masuk.</p>
      </article>
    `;
    return;
  }

  document.getElementById("intelligence-cards").innerHTML = safeCards
    .map(
      (card) => `
        <article class="intel-card">
          <div class="intel-meta">
            <span class="badge neutral">${card.domain}</span>
            <span>${card.active}</span>
          </div>
          <h4>${card.advertiser}</h4>
          <p>${card.copy}</p>
          <div class="intel-tags">
            <span class="tag gold">${card.funnel}</span>
            <span class="tag mint">${card.type}</span>
            <span class="tag">${card.cta}</span>
          </div>
          <p class="feed-copy">${card.note}</p>
        </article>
      `,
    )
    .join("");
}

async function renderIntelligence() {
  const requestId = ++runtimeState.intelligenceRequestId;

  if (USE_REAL_DATA && isSupabaseClientReady()) {
    renderIntelligenceLoading();
  }

  try {
    if (!USE_REAL_DATA || typeof window.fetchAdsIntelligence !== "function") {
      applyIntelligenceCards(getBaseIntelligenceCards());
      return;
    }

    if (!isSupabaseClientReady()) {
      applyIntelligenceCards(getBaseIntelligenceCards());
      return;
    }

    const rows = await window.fetchAdsIntelligence({
      funnelType: state.funnel === "All" ? undefined : state.funnel,
      limit: 24,
    });

    if (requestId !== runtimeState.intelligenceRequestId) {
      return;
    }

    applyIntelligenceCards(buildIntelligenceCards(rows));
  } catch (error) {
    console.warn("[ADS LAB] renderIntelligence fallback:", error.message);

    if (requestId !== runtimeState.intelligenceRequestId) {
      return;
    }

    applyIntelligenceCards(getBaseIntelligenceCards());
  }
}

function renderAnalysis() {
  const maxAds = Math.max(...competitorDomains.map((item) => item.ads));

  document.getElementById("domain-bars").innerHTML = competitorDomains
    .map(
      (item) => `
        <button class="reading-item filter-chip ${state.selectedDomain === item.domain ? "active" : ""}" data-domain="${item.domain}">
          <div class="bar-row">
            <strong>${item.domain}</strong>
            <span>${item.ads} ads</span>
          </div>
          <div class="bar-track">
            <div class="bar-fill" style="width: ${(item.ads / maxAds) * 100}%"></div>
          </div>
        </button>
      `,
    )
    .join("");

  document.querySelectorAll(".filter-chip[data-domain]").forEach((button) => {
    button.addEventListener("click", () => {
      state.selectedDomain = button.dataset.domain;
      renderAnalysis();
    });
  });

  const selected =
    competitorDomains.find((item) => item.domain === state.selectedDomain) || competitorDomains[0];
  const total = Object.values(selected.mix).reduce((sum, current) => sum + current, 0);

  let currentStart = 0;
  const slices = Object.entries(selected.mix)
    .map(([key, value]) => {
      const start = currentStart;
      const percent = Math.round((value / total) * 100);
      currentStart += percent;
      return `${funnelColors[key]} ${start}% ${currentStart}%`;
    })
    .join(", ");

  const donutChart = document.getElementById("donut-chart");
  donutChart.style.background = `conic-gradient(${slices})`;
  donutChart.dataset.domain = selected.domain;

  document.getElementById("donut-legend").innerHTML = Object.entries(selected.mix)
    .map(
      ([key, value]) => `
        <div class="legend-item">
          <div class="legend-key">
            <span class="legend-swatch" style="background:${funnelColors[key]}"></span>
            <strong>${key}</strong>
          </div>
          <span>${Math.round((value / total) * 100)}% share</span>
        </div>
      `,
    )
    .join("");

  document.getElementById("strategy-grid").innerHTML = competitorDomains
    .map(
      (item) => `
        <div class="strategy-card">
          <p class="card-label">${item.domain}</p>
          <strong>${item.ads} ads terdeteksi</strong>
          <p>${item.action}</p>
        </div>
      `,
    )
    .join("");
}

function getTopFunnel(cards) {
  const counts = cards.reduce((acc, card) => {
    acc[card.funnel] = (acc[card.funnel] || 0) + 1;
    return acc;
  }, {});

  return Object.entries(counts).sort((a, b) => b[1] - a[1])[0]?.[0] || "-";
}

function getTopCTA(cards) {
  const counts = cards.reduce((acc, card) => {
    acc[card.cta] = (acc[card.cta] || 0) + 1;
    return acc;
  }, {});

  return Object.entries(counts).sort((a, b) => b[1] - a[1])[0]?.[0] || "-";
}

function bindNavigation() {
  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      state.section = link.dataset.section;
      navLinks.forEach((item) => item.classList.toggle("active", item === link));
      pageSections.forEach((section) =>
        section.classList.toggle("active", section.id === state.section),
      );
      renderStaleBanner();
    });
  });
}

async function init() {
  renderOverview();
  renderSwitchers();
  renderAnalysis();
  bindNavigation();
  window.ACTIVE_BRAND = state.brand;

  await Promise.all([renderDashboard(), renderIntelligence()]);
}

void init();
