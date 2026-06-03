const SCORING_WEIGHTS = Object.freeze({
  ngajigaes: Object.freeze({ roas: 0.4, cpp: 0.3, ctr: 0.3 }),
  labbaika: Object.freeze({ cpl: 0.4, ctr: 0.3, reach_efficiency: 0.3 }),
  alaika: Object.freeze({ cpl: 0.4, ctr: 0.3, reach_efficiency: 0.3 }),
});

function toFiniteNumber(value) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

function clampScore(value) {
  if (!Number.isFinite(value)) {
    return 0;
  }

  return Math.max(0, Math.min(1, value));
}

function getWeightsForBrand(brandKey) {
  return SCORING_WEIGHTS[brandKey] || SCORING_WEIGHTS.ngajigaes;
}

function normalizeAds(ads) {
  return Array.isArray(ads)
    ? ads
        .filter(function filterAd(ad) {
          return ad && (ad.ad_id || ad.ad_name || ad.campaign_id);
        })
        .map(function mapAd(ad) {
          const spend = toFiniteNumber(ad.spend);
          const reach = toFiniteNumber(ad.reach);
          const impressions = toFiniteNumber(ad.impressions);
          const clicks = toFiniteNumber(ad.clicks);
          const purchases = toFiniteNumber(ad.purchases);
          const purchaseValue = toFiniteNumber(ad.purchase_value || ad.purchaseValue);
          const leads = toFiniteNumber(ad.leads);
          const ctr = toFiniteNumber(ad.ctr) || (impressions > 0 ? clicks / impressions : 0);
          const roas = toFiniteNumber(ad.roas) || (spend > 0 ? purchaseValue / spend : 0);
          const cpl = toFiniteNumber(ad.cpl) || (spend > 0 && leads > 0 ? spend / leads : 0);
          const cpp = toFiniteNumber(ad.cpp) || (spend > 0 && purchases > 0 ? spend / purchases : 0);
          const reachEfficiency = spend > 0 ? reach / spend : 0;

          return {
            ad_id: ad.ad_id || null,
            ad_name: ad.ad_name || "Ad tanpa nama",
            campaign_id: ad.campaign_id || "unknown-campaign",
            campaign_name: ad.campaign_name || "Unknown Campaign",
            spend: spend,
            reach: reach,
            impressions: impressions,
            clicks: clicks,
            purchases: purchases,
            purchase_value: purchaseValue,
            leads: leads,
            ctr: ctr,
            roas: roas,
            cpl: cpl,
            cpp: cpp,
            reach_efficiency: reachEfficiency,
          };
        })
    : [];
}

function getMetricBounds(ads, key) {
  return ads.reduce(
    function reduceBounds(bounds, ad) {
      const value = toFiniteNumber(ad[key]);

      if (value <= 0) {
        return bounds;
      }

      return {
        min: Math.min(bounds.min, value),
        max: Math.max(bounds.max, value),
      };
    },
    { min: Number.POSITIVE_INFINITY, max: Number.NEGATIVE_INFINITY }
  );
}

function normalizeHigherIsBetter(value, bounds) {
  if (!Number.isFinite(value) || value <= 0 || !Number.isFinite(bounds.max) || bounds.max <= 0) {
    return 0;
  }

  return clampScore(value / bounds.max);
}

function normalizeLowerIsBetter(value, bounds) {
  if (!Number.isFinite(value) || value <= 0 || !Number.isFinite(bounds.min) || bounds.min <= 0) {
    return 0;
  }

  return clampScore(bounds.min / value);
}

function scoreAds(brandKey, ads) {
  const normalizedAds = normalizeAds(ads);
  const weights = getWeightsForBrand(brandKey);

  if (!normalizedAds.length) {
    return [];
  }

  const bounds = {
    roas: getMetricBounds(normalizedAds, "roas"),
    cpp: getMetricBounds(normalizedAds, "cpp"),
    ctr: getMetricBounds(normalizedAds, "ctr"),
    cpl: getMetricBounds(normalizedAds, "cpl"),
    reach_efficiency: getMetricBounds(normalizedAds, "reach_efficiency"),
  };

  return normalizedAds
    .map(function mapScoredAd(ad) {
      let rawScore = 0;

      if (brandKey === "ngajigaes") {
        rawScore =
          normalizeHigherIsBetter(ad.roas, bounds.roas) * weights.roas +
          normalizeLowerIsBetter(ad.cpp, bounds.cpp) * weights.cpp +
          normalizeHigherIsBetter(ad.ctr, bounds.ctr) * weights.ctr;
      } else {
        rawScore =
          normalizeLowerIsBetter(ad.cpl, bounds.cpl) * weights.cpl +
          normalizeHigherIsBetter(ad.ctr, bounds.ctr) * weights.ctr +
          normalizeHigherIsBetter(ad.reach_efficiency, bounds.reach_efficiency) *
            weights.reach_efficiency;
      }

      return Object.assign({}, ad, {
        score: Math.round(clampScore(rawScore) * 10000) / 100,
      });
    })
    .sort(function sortAds(left, right) {
      return right.score - left.score;
    })
    .slice(0, 3);
}

const exportedScoringEngine = {
  SCORING_WEIGHTS: SCORING_WEIGHTS,
  scoreAds: scoreAds,
};

if (typeof window !== "undefined") {
  window.scoreAds = scoreAds;
  window.adsLabScoringEngine = exportedScoringEngine;
}

if (typeof module !== "undefined" && module.exports) {
  module.exports = exportedScoringEngine;
}
