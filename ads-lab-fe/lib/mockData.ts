import type {
  Brand, Campaign, Alert, ApiStatusInfo, WinningAd,
  NgajigaesMetrics, CPLMetrics, CompetitorAd, DomainSummary,
  AutomationLog, CreativeAsset, CopyRow, QueueStatus,
} from './types';
import { calcKpiStatus } from './utils';

// ─── Brands ───────────────────────────────────────────────────────────────────
export const BRANDS: Brand[] = [
  { id: 'ngajigaes', name: 'Ngajigaes.id', kpiType: 'roas', color: '#6366F1' },
  { id: 'labbaika',  name: 'Labbaika',      kpiType: 'cpl',  color: '#10B981' },
  { id: 'alaika',    name: 'Alaika Habibi', kpiType: 'cpl',  color: '#F59E0B' },
];

// ─── Dashboard Metrics ────────────────────────────────────────────────────────
export const NGAJIGAES_METRICS: NgajigaesMetrics = {
  roas: 2.8, roasTarget: 3.0,
  costPerPurchase: 41_000, costPerPurchaseTarget: 45_000,
  profitRate: 18.4,
  totalSpend: 12_500_000,
  convValue: 35_000_000,
  totalPurchases: 304,
  cpm: 28_500, ctr: 2.14, frequency: 2.7, reach: 438_200,
};

export const LABBAIKA_METRICS: CPLMetrics = {
  cpl: 75_000, cplTarget: 80_000,
  totalLeads: 167, reach: 312_400, totalSpend: 12_525_000,
  cpm: 40_100, ctr: 1.88, frequency: 2.1,
};

export const ALAIKA_METRICS: CPLMetrics = {
  cpl: 95_000, cplTarget: 80_000,
  totalLeads: 89, reach: 178_300, totalSpend: 8_455_000,
  cpm: 47_400, ctr: 1.34, frequency: 2.9,
};

// ─── Trend Data (7-day sparklines) ────────────────────────────────────────────
export const TRENDS = {
  ngajigaes: {
    roas:    [2.4, 2.6, 2.5, 2.7, 2.9, 2.7, 2.8],
    cpp:     [46_000, 44_500, 45_200, 43_800, 42_000, 41_500, 41_000],
    spend:   [1_400_000, 1_550_000, 1_800_000, 1_700_000, 1_950_000, 2_100_000, 2_000_000],
    reach:   [52_000, 58_000, 61_000, 59_000, 65_000, 70_000, 73_000],
  },
  labbaika: {
    cpl:     [82_000, 80_500, 79_000, 77_500, 76_000, 75_800, 75_000],
    leads:   [18, 21, 24, 22, 26, 28, 28],
    spend:   [1_480_000, 1_690_000, 1_900_000, 1_705_000, 1_976_000, 2_114_000, 2_160_000],
    reach:   [38_000, 41_000, 44_000, 43_500, 46_000, 49_000, 51_000],
  },
  alaika: {
    cpl:     [88_000, 91_000, 93_500, 94_000, 96_000, 95_500, 95_000],
    leads:   [11, 13, 12, 13, 14, 13, 13],
    spend:   [968_000, 1_100_000, 1_150_000, 1_200_000, 1_280_000, 1_390_000, 1_367_000],
    reach:   [22_000, 24_500, 25_000, 25_800, 26_500, 27_000, 27_200],
  },
};

// ─── Campaigns ────────────────────────────────────────────────────────────────
const makeCampaign = (
  id: string, name: string, spend: number, result: number, targetRoas: number,
  actualRoas: number, reach: number, priority: number,
): Campaign => ({
  id, name, status: 'ACTIVE', spend, result,
  kpi: { metric: 'ROAS', target: targetRoas, actual: actualRoas, unit: 'roas' },
  kpiStatus: calcKpiStatus(actualRoas, targetRoas),
  reach, priority, isProtected: priority === 1,
  adsets: [
    {
      id: `${id}-as1`, name: `${name} — Broad`, status: 'ACTIVE',
      spend: spend * 0.6, result: Math.round(result * 0.65),
      cpm: 27_000, ctr: 2.3, frequency: 2.4, reach: Math.round(reach * 0.6),
      kpiStatus: calcKpiStatus(actualRoas * 1.1, targetRoas),
      ads: [
        {
          id: `${id}-as1-ad1`, name: 'Hook — Sibuk Kerja',
          status: 'ACTIVE', thumbnailUrl: 'https://picsum.photos/seed/ad1/120/120',
          spend: spend * 0.35, result: Math.round(result * 0.4),
          cpm: 25_000, ctr: 2.6, frequency: 2.1, reach: Math.round(reach * 0.38),
          funnelType: 'LP', score: 87, isWinning: true,
          creativeType: 'video', dateActive: '2026-04-15',
        },
        {
          id: `${id}-as1-ad2`, name: 'Hook — Tips Ngaji Sibuk',
          status: 'ACTIVE', thumbnailUrl: 'https://picsum.photos/seed/ad2/120/120',
          spend: spend * 0.25, result: Math.round(result * 0.25),
          cpm: 30_000, ctr: 1.9, frequency: 2.8, reach: Math.round(reach * 0.22),
          funnelType: 'LP', score: 62, isWinning: false,
          creativeType: 'image', dateActive: '2026-04-20',
        },
      ],
    },
    {
      id: `${id}-as2`, name: `${name} — Retargeting`, status: 'ACTIVE',
      spend: spend * 0.4, result: Math.round(result * 0.35),
      cpm: 31_000, ctr: 1.8, frequency: 3.2, reach: Math.round(reach * 0.4),
      kpiStatus: calcKpiStatus(actualRoas * 0.85, targetRoas),
      ads: [
        {
          id: `${id}-as2-ad1`, name: 'Retarget — Daftar Sekarang',
          status: 'ACTIVE', thumbnailUrl: 'https://picsum.photos/seed/ad3/120/120',
          spend: spend * 0.4, result: Math.round(result * 0.35),
          cpm: 31_000, ctr: 1.8, frequency: 3.2, reach: Math.round(reach * 0.4),
          funnelType: 'LP', score: 54, isWinning: false,
          creativeType: 'video', dateActive: '2026-04-22',
        },
      ],
    },
  ],
});

export const NGAJIGAES_CAMPAIGNS: Campaign[] = [
  makeCampaign('ng-1', 'Campaign Ramadan 2026', 7_500_000, 183, 3.0, 2.8, 260_000, 1),
  makeCampaign('ng-2', 'Campaign Evergreen — Pemula', 3_200_000, 78,  3.0, 3.4, 124_000, 2),
  makeCampaign('ng-3', 'Campaign Testing Hook Q2',   1_800_000, 43,  3.0, 2.1, 54_200,  3),
];

const makeCPLCampaign = (
  id: string, name: string, spend: number, leads: number,
  targetCpl: number, reach: number, priority: number,
): Campaign => {
  const actualCpl = Math.round(spend / leads);
  return {
    id, name, status: 'ACTIVE', spend, result: leads,
    kpi: { metric: 'CPL', target: targetCpl, actual: actualCpl, unit: 'idr' },
    kpiStatus: calcKpiStatus(actualCpl, targetCpl, true),
    reach, priority, isProtected: false,
    adsets: [
      {
        id: `${id}-as1`, name: `${name} — CTWA`, status: 'ACTIVE',
        spend: spend * 0.7, result: Math.round(leads * 0.7),
        cpm: 38_000, ctr: 1.9, frequency: 2.0, reach: Math.round(reach * 0.65),
        kpiStatus: calcKpiStatus(actualCpl * 0.9, targetCpl, true),
        ads: [
          {
            id: `${id}-as1-ad1`, name: 'CTWA — Harga Terbaik',
            status: 'ACTIVE', thumbnailUrl: 'https://picsum.photos/seed/lb1/120/120',
            spend: spend * 0.7, result: Math.round(leads * 0.7),
            cpm: 38_000, ctr: 1.9, frequency: 2.0, reach: Math.round(reach * 0.65),
            funnelType: 'CTWA', score: 76, isWinning: true,
            creativeType: 'image', dateActive: '2026-04-10',
          },
        ],
      },
    ],
  };
};

export const LABBAIKA_CAMPAIGNS: Campaign[] = [
  makeCPLCampaign('lb-1', 'Campaign Umroh Reguler', 8_000_000, 107, 80_000, 198_000, 1),
  makeCPLCampaign('lb-2', 'Campaign Umroh Plus',    4_525_000,  60, 80_000, 114_400, 2),
];

export const ALAIKA_CAMPAIGNS: Campaign[] = [
  makeCPLCampaign('ak-1', 'Campaign Umroh Keluarga', 5_200_000, 55, 80_000, 112_000, 1),
  makeCPLCampaign('ak-2', 'Campaign Umroh Mandiri',  3_255_000, 34, 80_000,  66_300, 2),
];

// ─── Alerts ───────────────────────────────────────────────────────────────────
export const MOCK_ALERTS: Alert[] = [
  {
    id: 'a1', type: 'roas_drop', brand: 'ngajigaes', severity: 'critical',
    condition: 'ROAS turun di bawah target (2.8x vs target 3.0x) selama 2 hari berturut',
    diagnosis: 'Winning ad "Hook — Sibuk Kerja" frequency sudah 2.1x — belum fatigue, tapi budget adset retargeting tidak optimal',
    suggestAction: 'Konsolidasi budget ke adset Broad. Scale winning ad "Hook — Sibuk Kerja" 20%.',
    timestamp: new Date(Date.now() - 25 * 60_000).toISOString(), isRead: false,
  },
  {
    id: 'a2', type: 'ad_fatigue', brand: 'ngajigaes', severity: 'warning',
    condition: 'Adset "Campaign Ramadan — Retargeting": Frequency 3.2x dalam 7 hari',
    diagnosis: 'Audience fatigue terdeteksi di adset retargeting',
    suggestAction: 'Pause adset. Rotate creative baru atau expand lookalike 3-5%.',
    timestamp: new Date(Date.now() - 2 * 3600_000).toISOString(), isRead: false,
  },
  {
    id: 'a3', type: 'winning_ad', brand: 'labbaika', severity: 'info',
    condition: 'Winning ad terdeteksi: "CTWA — Harga Terbaik" score 76/100',
    diagnosis: 'Top performer dengan CPL Rp 68.000 (target Rp 80.000)',
    suggestAction: 'Scale budget adset CTWA 30%. Gunakan sebagai referensi brief creative baru.',
    timestamp: new Date(Date.now() - 4 * 3600_000).toISOString(), isRead: true,
  },
  {
    id: 'a4', type: 'cpl_anomaly', brand: 'alaika', severity: 'critical',
    condition: 'CPL Alaika naik 18.75% dalam 3 hari (Rp 80rb → Rp 95rb)',
    diagnosis: 'CPM naik Rp 8.000 tapi CTR relatif flat (1.34%) — kemungkinan audience overlap antar adset',
    suggestAction: 'Cek overlap antar adset. Broadening audience atau perluas targeting.',
    timestamp: new Date(Date.now() - 1 * 3600_000).toISOString(), isRead: false,
  },
];

// ─── API Status ───────────────────────────────────────────────────────────────
export const API_STATUS: ApiStatusInfo[] = [
  { brandId: 'ngajigaes', status: 'normal',     lastUpdated: new Date(Date.now() - 43 * 60_000).toISOString() },
  { brandId: 'labbaika',  status: 'stale',       lastUpdated: new Date(Date.now() - 7 * 3600_000).toISOString() },
  { brandId: 'alaika',    status: 'normal',      lastUpdated: new Date(Date.now() - 1 * 3600_000).toISOString() },
];

// ─── Winning Ads ──────────────────────────────────────────────────────────────
export const WINNING_ADS: Record<string, WinningAd[]> = {
  ngajigaes: [
    { adId: 'ng-1-as1-ad1', adName: 'Hook — Sibuk Kerja', campaignName: 'Campaign Ramadan 2026',
      score: 87, rank: 1, thumbnailUrl: 'https://picsum.photos/seed/w1/80/80',
      funnelType: 'LP', metrics: { roas: 3.6, costPerPurchase: 32_000, ctr: 2.6 } },
    { adId: 'ng-2-as1-ad1', adName: 'Evergreen — Pemula v3', campaignName: 'Campaign Evergreen',
      score: 79, rank: 2, thumbnailUrl: 'https://picsum.photos/seed/w2/80/80',
      funnelType: 'LP', metrics: { roas: 3.4, costPerPurchase: 35_000, ctr: 2.3 } },
    { adId: 'ng-1-as1-ad3', adName: 'Testimoni — 3 Bulan Progress',
      campaignName: 'Campaign Ramadan 2026',
      score: 71, rank: 3, thumbnailUrl: 'https://picsum.photos/seed/w3/80/80',
      funnelType: 'LP', metrics: { roas: 3.1, costPerPurchase: 38_000, ctr: 2.1 } },
  ],
  labbaika: [
    { adId: 'lb-1-as1-ad1', adName: 'CTWA — Harga Terbaik', campaignName: 'Campaign Umroh Reguler',
      score: 76, rank: 1, thumbnailUrl: 'https://picsum.photos/seed/w4/80/80',
      funnelType: 'CTWA', metrics: { cpl: 68_000, ctr: 2.1, reachEfficiency: 1.4 } },
  ],
  alaika: [
    { adId: 'ak-1-as1-ad1', adName: 'CTWA — Umroh Keluarga', campaignName: 'Campaign Umroh Keluarga',
      score: 64, rank: 1, thumbnailUrl: 'https://picsum.photos/seed/w5/80/80',
      funnelType: 'CTWA', metrics: { cpl: 88_000, ctr: 1.5, reachEfficiency: 1.0 } },
  ],
};

// ─── Competitor Ads (Web App) ─────────────────────────────────────────────────
export const COMPETITOR_ADS: CompetitorAd[] = [
  {
    id: 'c1', libraryId: 'META_LIB_001', advertiserName: 'TravelUmroh Pro',
    adCopy: 'Umroh impianmu bisa terwujud! Paket mulai Rp 25jt all-in, DP ringan, berangkat 2026.',
    creativeType: 'image', ctaButton: 'Learn More',
    destinationUrl: 'https://travelumrohpro.com/paket', dateActive: '2026-04-01',
    funnelType: 'LP', funnelOverride: null,
    thumbnailUrl: 'https://picsum.photos/seed/c1/200/200', domain: 'travelumrohpro.com',
  },
  {
    id: 'c2', libraryId: 'META_LIB_002', advertiserName: 'BiroUmrohMandiri',
    adCopy: 'Mau umroh tapi bingung mulai dari mana? Chat kami sekarang, konsultasi GRATIS!',
    creativeType: 'video', ctaButton: 'Send Message',
    destinationUrl: 'https://wa.me/6281234567890', dateActive: '2026-04-10',
    funnelType: 'CTWA', funnelOverride: null,
    thumbnailUrl: 'https://picsum.photos/seed/c2/200/200', domain: 'biroumrohmandiri.com',
  },
  {
    id: 'c3', libraryId: 'META_LIB_003', advertiserName: 'NgujiBareng Academy',
    adCopy: 'Tahukah kamu belajar ngaji 15 menit sehari bisa buat kamu khatam Al-Quran dalam 6 bulan?',
    creativeType: 'video', ctaButton: 'Watch More',
    destinationUrl: '', dateActive: '2026-04-15',
    funnelType: 'Visit Profile', funnelOverride: null,
    thumbnailUrl: 'https://picsum.photos/seed/c3/200/200', domain: 'ngujibareng.id',
  },
  {
    id: 'c4', libraryId: 'META_LIB_004', advertiserName: 'TravelUmroh Pro',
    adCopy: 'PROMO TERBATAS! Daftar umroh sebelum 31 Mei, gratis asuransi perjalanan. Seat tersisa 8!',
    creativeType: 'image', ctaButton: 'Sign Up',
    destinationUrl: 'https://travelumrohpro.com/daftar', dateActive: '2026-04-20',
    funnelType: 'Lead Form', funnelOverride: null,
    thumbnailUrl: 'https://picsum.photos/seed/c4/200/200', domain: 'travelumrohpro.com',
  },
  {
    id: 'c5', libraryId: 'META_LIB_005', advertiserName: 'QuranPath ID',
    adCopy: 'Kenapa memilih metode kami? 10.000+ alumni, metode terstandarisasi, bisa mulai dari 0.',
    creativeType: 'carousel', ctaButton: 'Send Message',
    destinationUrl: 'https://wa.me/6289876543210', dateActive: '2026-04-25',
    funnelType: 'CTWA', funnelOverride: null,
    thumbnailUrl: 'https://picsum.photos/seed/c5/200/200', domain: 'quranpath.id',
  },
];

export const DOMAIN_SUMMARIES: DomainSummary[] = [
  {
    domain: 'travelumrohpro.com', totalAds: 47, activeAds: 12, lastSeen: '2026-05-07',
    funnelDistribution: { 'LP': 20, 'CTWA': 15, 'Lead Form': 10, 'Visit Profile': 2 },
  },
  {
    domain: 'biroumrohmandiri.com', totalAds: 31, activeAds: 8, lastSeen: '2026-05-06',
    funnelDistribution: { 'LP': 8, 'CTWA': 18, 'Lead Form': 4, 'Visit Profile': 1 },
  },
  {
    domain: 'quranpath.id', totalAds: 28, activeAds: 11, lastSeen: '2026-05-07',
    funnelDistribution: { 'LP': 12, 'CTWA': 10, 'Lead Form': 5, 'Visit Profile': 1 },
  },
  {
    domain: 'ngujibareng.id', totalAds: 19, activeAds: 6, lastSeen: '2026-05-05',
    funnelDistribution: { 'LP': 6, 'CTWA': 4, 'Lead Form': 2, 'Visit Profile': 7 },
  },
];

// ─── Phase 6 — Automation ─────────────────────────────────────────────────────
export const AUTOMATION_LOGS: AutomationLog[] = [
  {
    id: 'log1', brand: 'ngajigaes', actionType: 'pause', status: 'done',
    targetName: 'Campaign Ramadan — Retargeting',
    description: 'Adset di-pause otomatis: Frequency 3.2x > threshold 3x dalam 7 hari',
    timestamp: new Date(Date.now() - 2 * 3600_000).toISOString(),
  },
  {
    id: 'log2', brand: 'ngajigaes', actionType: 'upload_creative', status: 'done',
    targetName: 'hook-ramadan-v3.mp4',
    description: 'Creative baru di-upload dari GDrive /pending ke Meta Ad Account',
    timestamp: new Date(Date.now() - 1.5 * 3600_000).toISOString(),
    meta: { adId: 'META_AD_XYZ' },
  },
  {
    id: 'log3', brand: 'ngajigaes', actionType: 'create_ad_draft', status: 'done',
    targetName: 'Ad Draft: Hook Ramadan v3 — Broad',
    description: 'Draft ad dibuat dengan creative baru. Status: PAUSED (pending review)',
    timestamp: new Date(Date.now() - 1 * 3600_000).toISOString(),
    meta: { adId: 'META_DRAFT_123' },
  },
  {
    id: 'log4', brand: 'alaika', actionType: 'generate_copy', status: 'done',
    targetName: 'AI Copy Variation × 3',
    description: '3 variasi copy digenerate dari winning ad. Menunggu review admin di Google Sheets.',
    timestamp: new Date(Date.now() - 45 * 60_000).toISOString(),
  },
  {
    id: 'log5', brand: 'labbaika', actionType: 'scale_budget', status: 'queued',
    targetName: 'Adset CTWA — Harga Terbaik',
    description: 'Scale budget 30% dijadwalkan (Rp 4jt → Rp 5.2jt). Menunggu giliran queue.',
    timestamp: new Date(Date.now() - 15 * 60_000).toISOString(),
  },
];

export const CREATIVE_ASSETS: CreativeAsset[] = [
  { id: 'ca1', brand: 'ngajigaes', fileName: 'hook-ramadan-v3.mp4', fileType: 'video',
    status: 'uploaded', driveUrl: '#', adId: 'META_AD_XYZ', uploadedAt: '2026-05-07T08:30:00Z' },
  { id: 'ca2', brand: 'ngajigaes', fileName: 'testimonial-3bulan.jpg', fileType: 'image',
    status: 'pending', driveUrl: '#' },
  { id: 'ca3', brand: 'ngajigaes', fileName: 'hook-tips-ngaji-v2.mp4', fileType: 'video',
    status: 'pending', driveUrl: '#' },
  { id: 'ca4', brand: 'labbaika',  fileName: 'umroh-keluarga-banner.jpg', fileType: 'image',
    status: 'pending', driveUrl: '#' },
  { id: 'ca5', brand: 'alaika',    fileName: 'ctwa-promo-mei.jpg', fileType: 'image',
    status: 'archived', driveUrl: '#', adId: 'META_OLD_AD', uploadedAt: '2026-04-10T10:00:00Z' },
];

export const COPY_ROWS: CopyRow[] = [
  { id: 'cr1', brand: 'ngajigaes', primaryText: 'Mau ngaji tapi sibuk kerja? Coba 15 menit sehari dulu.',
    headline: 'Mulai Ngaji Hari Ini', cta: 'Learn More',
    destinationUrl: 'https://ngajigaes.id/mulai', funnelStage: 'TOFU', status: 'published', adId: 'META_AD_XYZ' },
  { id: 'cr2', brand: 'ngajigaes', primaryText: 'Kenapa 10.000+ orang pilih Ngajigaes? Metode terstruktur, mulai dari 0.',
    headline: 'Metode Terbukti, Hasil Nyata', cta: 'Learn More',
    destinationUrl: 'https://ngajigaes.id/tentang', funnelStage: 'MOFU', status: 'pending' },
  { id: 'cr3', brand: 'ngajigaes', primaryText: 'Promo Hari Ini: Daftar sekarang, hemat Rp 150rb. Tersisa 20 slot!',
    headline: 'Daftar Sekarang, Hemat Rp 150rb', cta: 'Shop Now',
    destinationUrl: 'https://ngajigaes.id/daftar', funnelStage: 'BOFU', status: 'pending' },
  { id: 'cr4', brand: 'alaika', primaryText: 'Umroh bareng keluarga, pengalaman seumur hidup. Konsultasi gratis!',
    headline: 'Umroh Keluarga 2026', cta: 'Send Message',
    destinationUrl: 'https://wa.me/6281111111111', funnelStage: 'MOFU', status: 'rejected' },
];

export const QUEUE_STATUS: QueueStatus[] = [
  { brand: 'ngajigaes', total: 3, processed: 3, failed: 0, isProcessing: false },
  { brand: 'labbaika',  total: 1, processed: 0, failed: 0, isProcessing: true },
  { brand: 'alaika',    total: 0, processed: 0, failed: 0, isProcessing: false },
];
