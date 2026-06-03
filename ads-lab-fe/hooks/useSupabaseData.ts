'use client';
import { useState, useEffect, useCallback } from 'react';
import { isSupabaseAvailable } from '@/lib/supabase';
import {
  fetchSnapshots, fetchFetchStatus, fetchAdsDetail,
  fetchKpiTargets, fetchRecentAlerts,
} from '@/lib/queries';
import {
  toBrandMetrics, toCampaignHierarchy, toApiStatus,
  toCompetitorAds, toAlerts, toTrends,
  type LiveTrends,
} from '@/lib/transforms';
import {
  NGAJIGAES_METRICS, LABBAIKA_METRICS, ALAIKA_METRICS,
  NGAJIGAES_CAMPAIGNS, LABBAIKA_CAMPAIGNS, ALAIKA_CAMPAIGNS,
  API_STATUS, MOCK_ALERTS, COMPETITOR_ADS, TRENDS,
} from '@/lib/mockData';
import type {
  BrandId, DateRange, Campaign, ApiStatusInfo, Alert,
  NgajigaesMetrics, CPLMetrics, CompetitorAd,
} from '@/lib/types';

// ─── Dashboard data hook ───────────────────────────────────────────────────────

export interface DashboardData {
  metrics:    NgajigaesMetrics | CPLMetrics;
  campaigns:  Campaign[];
  apiStatus:  ApiStatusInfo;
  alerts:     Alert[];
  trends:     LiveTrends | null;
  isLoading:  boolean;
  isLive:     boolean;
  refetch:    () => void;
}

export function useDashboardData(brand: BrandId, dateRange: DateRange): DashboardData {
  const [isLoading, setIsLoading] = useState(false);
  const [liveMetrics, setLiveMetrics]   = useState<NgajigaesMetrics | CPLMetrics | null>(null);
  const [liveCampaigns, setLiveCampaigns] = useState<Campaign[] | null>(null);
  const [liveApiStatus, setLiveApiStatus] = useState<ApiStatusInfo | null>(null);
  const [liveAlerts, setLiveAlerts]     = useState<Alert[] | null>(null);
  const [liveTrends, setLiveTrends]     = useState<LiveTrends | null>(null);

  const load = useCallback(async () => {
    if (!isSupabaseAvailable) return;
    setIsLoading(true);
    try {
      const [snapshots, fetchStatuses, kpiTargets, alertRows] = await Promise.all([
        fetchSnapshots(brand, dateRange),
        fetchFetchStatus(),
        fetchKpiTargets(brand),
        fetchRecentAlerts(brand, 10),
      ]);

      if (snapshots.length > 0) {
        setLiveMetrics(toBrandMetrics(brand, snapshots));
        setLiveCampaigns(toCampaignHierarchy(brand, snapshots, kpiTargets));
        setLiveTrends(toTrends(brand, snapshots));
      }

      const brandStatus = fetchStatuses.find(s => s.brand === brand);
      if (brandStatus) setLiveApiStatus(toApiStatus(brandStatus));

      if (alertRows.length > 0) setLiveAlerts(toAlerts(alertRows));
    } catch (e) {
      console.error('[useDashboardData]', e);
    } finally {
      setIsLoading(false);
    }
  }, [brand, dateRange]);

  useEffect(() => { void load(); }, [load]);

  const mockMetrics =
    brand === 'ngajigaes' ? NGAJIGAES_METRICS
    : brand === 'labbaika' ? LABBAIKA_METRICS
    : ALAIKA_METRICS;

  const mockCampaigns =
    brand === 'ngajigaes' ? NGAJIGAES_CAMPAIGNS
    : brand === 'labbaika' ? LABBAIKA_CAMPAIGNS
    : ALAIKA_CAMPAIGNS;

  const mockStatus = API_STATUS.find(s => s.brandId === brand)!;
  const ngTrends = TRENDS.ngajigaes;
  const cplTrends = brand === 'labbaika' ? TRENDS.labbaika : TRENDS.alaika;
  const isNg = brand === 'ngajigaes';

  const isLive = isSupabaseAvailable && (liveMetrics !== null || liveCampaigns !== null);

  return {
    metrics:   liveMetrics   ?? mockMetrics,
    campaigns: liveCampaigns ?? mockCampaigns,
    apiStatus: liveApiStatus ?? mockStatus,
    alerts:    liveAlerts    ?? MOCK_ALERTS.filter(a => a.brand === brand),
    trends:    liveTrends    ?? {
      primary: isNg ? ngTrends.roas : cplTrends.cpl,
      spend:   isNg ? ngTrends.spend : cplTrends.spend,
      reach:   isNg ? ngTrends.reach : cplTrends.reach,
      result:  isNg ? ngTrends.roas.map(v => Math.round(v * 100)) : cplTrends.leads,
    },
    isLoading,
    isLive,
    refetch: load,
  };
}

// ─── Competitor ads hook ───────────────────────────────────────────────────────

export interface CompetitorAdsData {
  ads:       CompetitorAd[];
  isLoading: boolean;
  isLive:    boolean;
  refetch:   () => void;
}

export function useCompetitorAds(funnelFilter?: string): CompetitorAdsData {
  const [isLoading, setIsLoading] = useState(false);
  const [liveAds, setLiveAds]     = useState<CompetitorAd[] | null>(null);

  const load = useCallback(async () => {
    if (!isSupabaseAvailable) return;
    setIsLoading(true);
    try {
      const rows = await fetchAdsDetail(funnelFilter);
      if (rows.length > 0) setLiveAds(toCompetitorAds(rows));
    } catch (e) {
      console.error('[useCompetitorAds]', e);
    } finally {
      setIsLoading(false);
    }
  }, [funnelFilter]);

  useEffect(() => { void load(); }, [load]);

  const isLive = isSupabaseAvailable && liveAds !== null;

  return {
    ads:       liveAds ?? COMPETITOR_ADS,
    isLoading,
    isLive,
    refetch:   load,
  };
}

// ─── All fetch statuses hook (for header badge) ───────────────────────────────

export function useAllFetchStatuses(): ApiStatusInfo[] {
  const [statuses, setStatuses] = useState<ApiStatusInfo[]>([]);

  useEffect(() => {
    if (!isSupabaseAvailable) return;
    fetchFetchStatus().then(rows => {
      if (rows.length > 0) setStatuses(rows.map(toApiStatus));
    });
  }, []);

  return statuses.length > 0 ? statuses : API_STATUS;
}
