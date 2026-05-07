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

const funnelColors = {
  LP: "#d8b35d",
  CTWA: "#84dba9",
  "Visit Profile": "#ffb347",
  "Lead Form": "#f56f6f",
};

const pageSections = document.querySelectorAll(".page-section");
const navLinks = document.querySelectorAll(".nav-link");

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
      renderDashboard();
      renderSwitchers();
    });
  });

  rangeSwitcher.querySelectorAll("button").forEach((button) => {
    button.addEventListener("click", () => {
      state.range = button.dataset.range;
      renderDashboard();
      renderSwitchers();
    });
  });

  funnelFilter.querySelectorAll("button").forEach((button) => {
    button.addEventListener("click", () => {
      state.funnel = button.dataset.funnel;
      renderIntelligence();
      renderSwitchers();
    });
  });
}

function renderDashboard() {
  const brand = dashboardData[state.brand];

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
            <span class="status-text ${campaign.health}">${campaign.healthLabel}</span>
            <button class="campaign-toggle">Detail</button>
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

  document.querySelectorAll(".campaign-toggle").forEach((button) => {
    button.addEventListener("click", () => {
      button.closest(".campaign-group").classList.toggle("open");
    });
  });
}

function renderIntelligence() {
  const cards =
    state.funnel === "All"
      ? intelligenceCards
      : intelligenceCards.filter((card) => card.funnel === state.funnel);

  document.getElementById("intelligence-summary").innerHTML = [
    {
      label: "Ads in current view",
      value: cards.length,
      note: "Card view dengan quick signal per creative",
    },
    {
      label: "Top funnel type",
      value: getTopFunnel(cards),
      note: "Pola funnel paling sering muncul di hasil filter",
    },
    {
      label: "Most common CTA",
      value: getTopCTA(cards),
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

  document.getElementById("intelligence-cards").innerHTML = cards
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
    });
  });
}

function init() {
  renderOverview();
  renderSwitchers();
  renderDashboard();
  renderIntelligence();
  renderAnalysis();
  bindNavigation();
}

init();
