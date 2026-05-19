(function () {
  const supabaseLibrary = window.supabase;
  const supabaseUrl = window.SUPABASE_URL;
  const supabaseAnonKey = window.SUPABASE_ANON_KEY;
  const hasSupabaseConfig = Boolean(supabaseUrl && supabaseAnonKey);

  const mockSnapshotRows = [
    {
      brand: "ngajigaes",
      campaign_id: "mock-campaign-001",
      campaign_name: "Mock Snapshot Campaign",
      level: "campaign",
      date_start: "2026-05-01",
      date_stop: "2026-05-08",
      spend: 126000000,
      reach: 490000,
      impressions: 730000,
      clicks: 20440,
      ctr: 0.028,
      cpm: 61000,
      frequency: 2.6,
      purchases: 367,
      purchase_value: 403200000,
      leads: 0,
      roas: 3.2,
      cpl: null,
      cpp: 41000,
      status: "mock-fallback",
      fetched_at: new Date().toISOString(),
    },
  ];

  const mockAdsRows = [
    {
      id: "mock-ad-001",
      library_id: "mock-library-001",
      advertiser_name: "labbaikatravel.com",
      funnel_type: "LP",
      ad_copy: "Mock fallback ad copy untuk menjaga prototype tetap hidup.",
      creative_type: "video",
      cta_button: "Learn More",
      destination_url: "https://example.com/mock-lp",
      date_active: "2026-05-08T00:00:00.000Z",
    },
    {
      id: "mock-ad-002",
      library_id: "mock-library-002",
      advertiser_name: "alaika-journey.com",
      funnel_type: "CTWA",
      ad_copy: "Mock fallback WhatsApp intent ad.",
      creative_type: "image",
      cta_button: "Send WhatsApp Message",
      destination_url: "https://wa.me/620000000000",
      date_active: "2026-05-07T00:00:00.000Z",
    },
  ];

  function logFallbackWarning(reason) {
    console.warn(
      "[ADS LAB] Supabase fallback aktif:",
      reason,
      "Pastikan window.SUPABASE_URL dan window.SUPABASE_ANON_KEY tersedia."
    );
  }

  function getMockSnapshot(brand) {
    return mockSnapshotRows.filter(function (row) {
      return !brand || row.brand === brand;
    });
  }

  function getMockAds(filters) {
    const safeFilters = filters || {};

    return mockAdsRows.filter(function (row) {
      if (safeFilters.funnelType && row.funnel_type !== safeFilters.funnelType) {
        return false;
      }

      if (
        safeFilters.advertiserName &&
        row.advertiser_name !== safeFilters.advertiserName
      ) {
        return false;
      }

      return true;
    });
  }

  async function fetchLatestSnapshot(brand, dateRange) {
    if (!window.supabase) {
      logFallbackWarning("client tidak tersedia untuk fetchLatestSnapshot");
      return getMockSnapshot(brand);
    }

    let query = window.supabase
      .from("campaign_snapshots")
      .select("*")
      .order("fetched_at", { ascending: false });

    if (brand) {
      query = query.eq("brand", brand);
    }

    if (dateRange && dateRange.start) {
      query = query.gte("date_start", dateRange.start);
    }

    if (dateRange && dateRange.end) {
      query = query.lte("date_stop", dateRange.end);
    }

    const result = await query;

    if (result.error) {
      console.warn("[ADS LAB] fetchLatestSnapshot fallback:", result.error.message);
      return getMockSnapshot(brand);
    }

    return result.data || [];
  }

  async function fetchAdsIntelligence(filters) {
    const safeFilters = filters || {};

    if (!window.supabase) {
      logFallbackWarning("client tidak tersedia untuk fetchAdsIntelligence");
      return getMockAds(safeFilters);
    }

    let query = window.supabase
      .from("ads_detail")
      .select("*")
      .order("created_at", { ascending: false });

    if (safeFilters.funnelType) {
      query = query.eq("funnel_type", safeFilters.funnelType);
    }

    if (safeFilters.advertiserName) {
      query = query.eq("advertiser_name", safeFilters.advertiserName);
    }

    if (safeFilters.limit) {
      query = query.limit(safeFilters.limit);
    }

    const result = await query;

    if (result.error) {
      console.warn("[ADS LAB] fetchAdsIntelligence fallback:", result.error.message);
      return getMockAds(safeFilters);
    }

    return result.data || [];
  }

  async function saveKpiTarget(campaignId, kpiType, value) {
    if (!campaignId || !kpiType) {
      throw new Error("campaignId dan kpiType wajib diisi");
    }

    const brand = window.ACTIVE_BRAND || window.DEFAULT_BRAND || "ngajigaes";
    const payload = {
      brand: brand,
      campaign_id: campaignId,
      kpi_type: kpiType,
      target_value: value,
    };

    if (!window.supabase) {
      logFallbackWarning("client tidak tersedia untuk saveKpiTarget");
      return {
        data: [Object.assign({ id: "mock-kpi-target", source: "fallback" }, payload)],
        error: null,
        mock: true,
      };
    }

    const result = await window.supabase
      .from("campaign_kpi_targets")
      .upsert(payload, { onConflict: "campaign_id,kpi_type" })
      .select();

    if (result.error) {
      console.warn("[ADS LAB] saveKpiTarget fallback:", result.error.message);
      return {
        data: [Object.assign({ id: "mock-kpi-target", source: "fallback" }, payload)],
        error: result.error,
        mock: true,
      };
    }

    return result;
  }

  function buildReferenceKey(prefix, value) {
    return value ? prefix + ":" + value : null;
  }

  async function fetchFunnelLabels(adReferences) {
    const safeReferences = Array.isArray(adReferences) ? adReferences : [];

    if (!window.supabase) {
      logFallbackWarning("client tidak tersedia untuk fetchFunnelLabels");
      return {};
    }

    const libraryIds = Array.from(
      new Set(
        safeReferences
          .map(function mapReference(reference) {
            return reference?.libraryId || null;
          })
          .filter(Boolean)
      )
    );
    const destinationUrls = Array.from(
      new Set(
        safeReferences
          .map(function mapReference(reference) {
            return reference?.destinationUrl || null;
          })
          .filter(Boolean)
      )
    );

    if (!libraryIds.length && !destinationUrls.length) {
      return {};
    }

    const labelMap = {};

    if (libraryIds.length) {
      const libraryResult = await window.supabase
        .from("ads_detail")
        .select("library_id,destination_url,funnel_type")
        .in("library_id", libraryIds);

      if (libraryResult.error) {
        console.warn("[ADS LAB] fetchFunnelLabels fallback:", libraryResult.error.message);
      } else {
        reduceFunnelRowsIntoMap(labelMap, libraryResult.data || []);
      }
    }

    if (destinationUrls.length) {
      const destinationResult = await window.supabase
        .from("ads_detail")
        .select("library_id,destination_url,funnel_type")
        .in("destination_url", destinationUrls);

      if (destinationResult.error) {
        console.warn("[ADS LAB] fetchFunnelLabels fallback:", destinationResult.error.message);
      } else {
        reduceFunnelRowsIntoMap(labelMap, destinationResult.data || []);
      }
    }

    return labelMap;
  }

  function reduceFunnelRowsIntoMap(accumulator, rows) {
    return rows.reduce(function reduceLabels(map, row) {
      if (row.library_id) {
        map[buildReferenceKey("library", row.library_id)] = row.funnel_type || "-";
      }

      if (row.destination_url) {
        map[buildReferenceKey("destination", row.destination_url)] = row.funnel_type || "-";
      }

      return map;
    }, accumulator);
  }

  window.supabaseLibrary = supabaseLibrary || null;
  window.fetchLatestSnapshot = fetchLatestSnapshot;
  window.fetchAdsIntelligence = fetchAdsIntelligence;
  window.saveKpiTarget = saveKpiTarget;
  window.fetchFunnelLabels = fetchFunnelLabels;
  window.adsLabSupabaseHelpers = {
    fetchLatestSnapshot: fetchLatestSnapshot,
    fetchAdsIntelligence: fetchAdsIntelligence,
    saveKpiTarget: saveKpiTarget,
    fetchFunnelLabels: fetchFunnelLabels,
  };

  if (!supabaseLibrary || typeof supabaseLibrary.createClient !== "function") {
    window.supabase = null;
    logFallbackWarning("Supabase CDN belum termuat");
    return;
  }

  if (!hasSupabaseConfig) {
    window.supabase = null;
    logFallbackWarning("SUPABASE_URL atau SUPABASE_ANON_KEY belum di-set");
    return;
  }

  window.supabase = supabaseLibrary.createClient(supabaseUrl, supabaseAnonKey);
})();
