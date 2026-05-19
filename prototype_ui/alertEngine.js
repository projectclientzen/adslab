const ALERT_ENGINE_TYPES = Object.freeze([
  "budget_warning",
  "cpl_anomaly",
  "roas_drop",
  "no_delivery",
  "ad_fatigue",
  "failed_test",
  "winning_ad",
]);

const ALERT_ENGINE_DEFAULTS = Object.freeze({
  budgetWarningRatio: 0.2,
  cplAnomalyThreshold: 0.2,
  noDeliveryHours: 6,
  fatigueThreshold: 3,
  failedTestSpend: {
    ngajigaes: 3000000,
    labbaika: 2500000,
    alaika: 2500000,
    default: 2500000,
  },
});
const SCORE_ADS_FUNCTION =
  typeof window !== "undefined" && typeof window.scoreAds === "function"
    ? window.scoreAds
    : typeof require === "function"
      ? require("./scoringEngine.js").scoreAds
      : null;

function toFiniteNumber(value) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

function parseDisplayNumber(value) {
  if (typeof value === "number") {
    return toFiniteNumber(value);
  }

  if (typeof value !== "string") {
    return 0;
  }

  const normalized = value.toLowerCase().replace(/\s+/g, "");
  const match = normalized.match(/-?\d+(?:[.,]\d+)?/);

  if (!match) {
    return 0;
  }

  let parsed = Number.parseFloat(match[0].replace(",", "."));
  if (!Number.isFinite(parsed)) {
    return 0;
  }

  if (normalized.includes("jt")) {
    parsed *= 1000000;
  } else if (normalized.includes("rb") || /(^|[^\w])\d+(?:[.,]\d+)?k(?!pi)/.test(normalized)) {
    parsed *= 1000;
  }

  return parsed;
}

function toFiniteArray(values) {
  if (Array.isArray(values)) {
    return values.map(toFiniteNumber).filter(function filterFinite(value) {
      return value > 0;
    });
  }

  if (typeof values === "string" && values.trim()) {
    try {
      const parsed = JSON.parse(values);
      if (Array.isArray(parsed)) {
        return toFiniteArray(parsed);
      }
    } catch (error) {
      return values
        .split(",")
        .map(function mapValue(value) {
          return toFiniteNumber(value.trim());
        })
        .filter(function filterFinite(value) {
          return value > 0;
        });
    }
  }

  return [];
}

function clampRatio(value) {
  if (!Number.isFinite(value)) {
    return 0;
  }

  return Math.max(0, Math.min(1, value));
}

function normalizeSettings(settings) {
  const safeSettings = settings || {};
  const failedTestSpend = Object.assign({}, ALERT_ENGINE_DEFAULTS.failedTestSpend, safeSettings.failedTestSpend || {});

  return {
    budgetWarningRatio: safeSettings.budgetWarningRatio || ALERT_ENGINE_DEFAULTS.budgetWarningRatio,
    cplAnomalyThreshold: safeSettings.cplAnomalyThreshold || ALERT_ENGINE_DEFAULTS.cplAnomalyThreshold,
    noDeliveryHours: safeSettings.noDeliveryHours || ALERT_ENGINE_DEFAULTS.noDeliveryHours,
    fatigueThreshold: safeSettings.fatigueThreshold || ALERT_ENGINE_DEFAULTS.fatigueThreshold,
    failedTestSpend: failedTestSpend,
  };
}

function inferBrandKey(input) {
  const explicitBrand = String(input?.brandKey || "").toLowerCase();
  if (explicitBrand) {
    return explicitBrand;
  }

  const label = String(input?.label || "").toLowerCase();
  if (label.includes("labbaika")) {
    return "labbaika";
  }

  if (label.includes("alaika")) {
    return "alaika";
  }

  return "ngajigaes";
}

function inferDefaultTarget(input, brandKey) {
  const defaultMetric = brandKey === "ngajigaes" ? "roas" : "cpl";
  const kpis = Array.isArray(input?.kpis) ? input.kpis : [];
  const preferredKpi = kpis.find(function findKpi(item) {
    return /target|goal/i.test(String(item?.chip || ""));
  });
  const targetValue = parseDisplayNumber(preferredKpi?.chip || "");

  return {
    targetMetric: defaultMetric,
    targetValue: targetValue,
  };
}

function normalizeCampaign(campaign, defaults) {
  const safeCampaign = campaign || {};
  const safeDefaults = defaults || {};
  const resultValue = parseDisplayNumber(safeCampaign.result);
  const efficiencyValue = parseDisplayNumber(safeCampaign.efficiency);
  const efficiencyText = String(safeCampaign.efficiency || "").toLowerCase();
  const brandKey = safeDefaults.brandKey || "ngajigaes";
  const targetMetric = safeCampaign.target_metric || safeDefaults.targetMetric || (brandKey === "ngajigaes" ? "roas" : "cpl");
  const targetValue = toFiniteNumber(safeCampaign.target_value || safeDefaults.targetValue);

  return {
    campaign_id: safeCampaign.campaign_id || "unknown-campaign",
    campaign_name: safeCampaign.campaign_name || safeCampaign.name || "Unknown Campaign",
    is_active: safeCampaign.is_active !== false,
    spend: toFiniteNumber(safeCampaign.spend) || parseDisplayNumber(safeCampaign.spend),
    reach: toFiniteNumber(safeCampaign.reach) || parseDisplayNumber(safeCampaign.reach),
    impressions: toFiniteNumber(safeCampaign.impressions),
    clicks: toFiniteNumber(safeCampaign.clicks),
    ctr: toFiniteNumber(safeCampaign.ctr) || (efficiencyText.includes("ctr") ? parseDisplayNumber(safeCampaign.efficiency) : 0),
    frequency:
      toFiniteNumber(safeCampaign.frequency) || (efficiencyText.includes("freq") ? parseDisplayNumber(safeCampaign.efficiency) : 0),
    leads: toFiniteNumber(safeCampaign.leads) || (brandKey === "ngajigaes" ? 0 : resultValue),
    purchases: toFiniteNumber(safeCampaign.purchases) || (brandKey === "ngajigaes" ? resultValue : 0),
    roas: toFiniteNumber(safeCampaign.roas) || (efficiencyText.includes("roas") ? efficiencyValue : 0),
    cpl: toFiniteNumber(safeCampaign.cpl) || (efficiencyText.includes("cpl") ? efficiencyValue : 0),
    cpp: toFiniteNumber(safeCampaign.cpp) || (efficiencyText.includes("cpp") ? efficiencyValue : 0),
    total_budget: toFiniteNumber(safeCampaign.total_budget),
    remaining_budget: toFiniteNumber(safeCampaign.remaining_budget),
    baseline_cpl: toFiniteNumber(safeCampaign.baseline_cpl),
    target_metric: targetMetric,
    target_value: targetValue,
    target_roas: toFiniteNumber(safeCampaign.target_roas) || (targetMetric === "roas" ? targetValue : 0),
    hours_without_delivery: toFiniteNumber(
      safeCampaign.hours_without_delivery || safeCampaign.active_hours || safeCampaign.hours_active
    ),
    consecutive_days_below_target: toFiniteNumber(
      safeCampaign.consecutive_days_below_target || safeCampaign.roas_days_below_target
    ),
    roas_history: toFiniteArray(safeCampaign.roas_history),
  };
}

function normalizeAlertEngineInput(input) {
  const safeInput = input || {};
  const brandKey = inferBrandKey(safeInput);
  const defaultTarget = inferDefaultTarget(safeInput, brandKey);

  return {
    brandKey: brandKey,
    triggeredAt: safeInput.triggeredAt || new Date().toISOString(),
    settings: normalizeSettings(safeInput.settings),
    ads: Array.isArray(safeInput.ads)
      ? safeInput.ads.map(function mapAd(ad) {
          return {
            ad_id: ad?.ad_id || null,
            ad_name: ad?.ad_name || "Ad tanpa nama",
            campaign_id: ad?.campaign_id || "unknown-campaign",
            campaign_name: ad?.campaign_name || "Unknown Campaign",
            spend: toFiniteNumber(ad?.spend),
            reach: toFiniteNumber(ad?.reach),
            impressions: toFiniteNumber(ad?.impressions),
            clicks: toFiniteNumber(ad?.clicks),
            purchases: toFiniteNumber(ad?.purchases),
            purchase_value: toFiniteNumber(ad?.purchase_value || ad?.purchaseValue),
            leads: toFiniteNumber(ad?.leads),
            roas: toFiniteNumber(ad?.roas),
            cpl: toFiniteNumber(ad?.cpl),
            cpp: toFiniteNumber(ad?.cpp),
            ctr: toFiniteNumber(ad?.ctr),
          };
        })
      : [],
    campaigns: Array.isArray(safeInput.campaigns)
      ? safeInput.campaigns.map(function mapCampaign(campaign) {
          return normalizeCampaign(campaign, {
            brandKey: brandKey,
            targetMetric: defaultTarget.targetMetric,
            targetValue: defaultTarget.targetValue,
          });
        })
      : [],
  };
}

function createAlert(level, type, title, diagnosis, action, campaignId, triggeredAt) {
  return {
    level: level,
    type: type,
    title: title,
    diagnosis: diagnosis,
    action: action,
    campaign_id: campaignId,
    triggered_at: new Date(triggeredAt),
  };
}

function buildBudgetWarningAlert(context, campaign) {
  if (campaign.total_budget <= 0 || campaign.remaining_budget <= 0) {
    return null;
  }

  const remainingRatio = campaign.remaining_budget / campaign.total_budget;
  if (remainingRatio >= context.settings.budgetWarningRatio) {
    return null;
  }

  return createAlert(
    "warning",
    "budget_warning",
    "Budget warning",
    "Budget hampir habis dan pace spend perlu diawasi sebelum delivery berhenti mendadak.",
    "Ajukan top-up segera ke admin atau konsolidasikan budget ke campaign paling efisien.",
    campaign.campaign_id,
    context.triggeredAt
  );
}

function buildCplAnomalyAlert(context, campaign) {
  if (campaign.cpl <= 0) {
    return null;
  }

  const baselineCpl = campaign.baseline_cpl > 0 ? campaign.baseline_cpl : 0;
  const thresholdLimit = baselineCpl * (1 + context.settings.cplAnomalyThreshold);

  if (baselineCpl <= 0 || campaign.cpl <= thresholdLimit) {
    return null;
  }

  return createAlert(
    "warning",
    "cpl_anomaly",
    "CPL anomaly",
    "CPL naik di atas baseline dan biasanya berkaitan dengan fatigue, CPM naik, atau CTR turun.",
    "Cek frequency, CPM, dan CTR; lalu refresh creative atau perluas audience sesuai diagnosis PRD.",
    campaign.campaign_id,
    context.triggeredAt
  );
}

function buildRoasDropAlert(context, campaign) {
  const targetRoas = campaign.target_roas > 0 ? campaign.target_roas : 0;
  const lastTwoRoas = campaign.roas_history.slice(-2);
  const historyBelowTarget = lastTwoRoas.length >= 2 && lastTwoRoas.every(function everyRoas(value) {
    return value < targetRoas;
  });
  const sustainedDrop =
    campaign.roas < targetRoas &&
    (historyBelowTarget || campaign.consecutive_days_below_target >= 2);

  if (!sustainedDrop || targetRoas <= 0) {
    return null;
  }

  return createAlert(
    "danger",
    "roas_drop",
    "ROAS drop",
    "ROAS berada di bawah target KPI config selama dua hari berturut dan perlu tindakan cepat.",
    "Cek winning ad yang masih aktif, lalu konsolidasikan budget ke adset terbaik dan pause underperformer.",
    campaign.campaign_id,
    context.triggeredAt
  );
}

function buildNoDeliveryAlert(context, campaign) {
  if (!campaign.is_active || campaign.reach > 0) {
    return null;
  }

  if (campaign.hours_without_delivery < context.settings.noDeliveryHours) {
    return null;
  }

  return createAlert(
    "danger",
    "no_delivery",
    "No delivery",
    "Campaign aktif tetapi reach masih nol setelah melewati window delivery yang diharapkan.",
    "Cek overlap audience, perluas targeting, dan review status adset agar delivery pulih.",
    campaign.campaign_id,
    context.triggeredAt
  );
}

function buildAdFatigueAlert(context, campaign) {
  if (campaign.frequency <= context.settings.fatigueThreshold) {
    return null;
  }

  return createAlert(
    "warning",
    "ad_fatigue",
    "Ad fatigue",
    "Frequency sudah melewati ambang aman dan mengindikasikan audience mulai jenuh.",
    "Pause adset yang lelah, rotate creative baru, dan expand audience atau lookalike.",
    campaign.campaign_id,
    context.triggeredAt
  );
}

function buildFailedTestAlert(context, campaign) {
  const spendThreshold =
    context.settings.failedTestSpend[context.brandKey] || context.settings.failedTestSpend.default;
  const hasNoResult = context.brandKey === "ngajigaes" ? campaign.purchases === 0 : campaign.leads === 0;

  if (campaign.spend <= spendThreshold || !hasNoResult) {
    return null;
  }

  return createAlert(
    "danger",
    "failed_test",
    "Failed test",
    "Spend sudah melewati threshold tetapi hasil inti masih nol, sehingga campaign ini termasuk test yang gagal.",
    "Flag campaign ini untuk review, tahan spend tambahan, dan pindahkan budget ke eksperimen yang lebih sehat.",
    campaign.campaign_id,
    context.triggeredAt
  );
}

function getMetricRange(campaigns, key) {
  return campaigns.reduce(
    function reduceRange(range, campaign) {
      const value = toFiniteNumber(campaign[key]);
      return {
        min: Math.min(range.min, value),
        max: Math.max(range.max, value),
      };
    },
    { min: Number.POSITIVE_INFINITY, max: Number.NEGATIVE_INFINITY }
  );
}

function normalizeScore(value, range, invert) {
  if (!Number.isFinite(value) || !Number.isFinite(range.min) || !Number.isFinite(range.max)) {
    return 0;
  }

  if (range.max === range.min) {
    return 1;
  }

  const baseScore = (value - range.min) / (range.max - range.min);
  return clampRatio(invert ? 1 - baseScore : baseScore);
}

function calculateWinningScore(context, campaign, ranges) {
  if (context.brandKey === "ngajigaes") {
    return (
      normalizeScore(campaign.roas, ranges.roas, false) * 0.4 +
      normalizeScore(campaign.cpp, ranges.cpp, true) * 0.3 +
      normalizeScore(campaign.ctr, ranges.ctr, false) * 0.3
    );
  }

  const reachEfficiency = campaign.reach > 0 ? campaign.leads / campaign.reach : 0;
  return (
    normalizeScore(campaign.cpl, ranges.cpl, true) * 0.4 +
    normalizeScore(campaign.ctr, ranges.ctr, false) * 0.3 +
    normalizeScore(reachEfficiency, ranges.reachEfficiency, false) * 0.3
  );
}

function buildWinningAdAlert(context) {
  if (typeof SCORE_ADS_FUNCTION !== "function") {
    return null;
  }

  const rankedAds = SCORE_ADS_FUNCTION(context.brandKey, context.ads || []);
  const winner = rankedAds[0];

  if (!winner) {
    return null;
  }

  return createAlert(
    "success",
    "winning_ad",
    "Winning ad suggest",
    `${winner.ad_name} memimpin skor ${winner.score}/100 dari ${rankedAds.length} winning ad teratas untuk ${context.brandKey}.`,
    "Scale bertahap ad pemenang ini, replikasi hook-nya ke creative baru, dan pakai dua runner-up sebagai benchmark rotasi.",
    winner.campaign_id,
    context.triggeredAt
  );
}

function runAlertEngine(input) {
  const context = normalizeAlertEngineInput(input);
  const alerts = [];

  context.campaigns.forEach(function evaluateCampaign(campaign) {
    const budgetWarning = buildBudgetWarningAlert(context, campaign);
    const cplAnomaly = buildCplAnomalyAlert(context, campaign);
    const roasDrop = buildRoasDropAlert(context, campaign);
    const noDelivery = buildNoDeliveryAlert(context, campaign);
    const adFatigue = buildAdFatigueAlert(context, campaign);
    const failedTest = buildFailedTestAlert(context, campaign);

    [budgetWarning, cplAnomaly, roasDrop, noDelivery, adFatigue, failedTest].forEach(function pushAlert(alert) {
      if (alert) {
        alerts.push(alert);
      }
    });
  });

  const winningAd = buildWinningAdAlert(context);
  if (winningAd) {
    alerts.push(winningAd);
  }

  return alerts;
}

if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    ALERT_ENGINE_TYPES: ALERT_ENGINE_TYPES,
    ALERT_ENGINE_DEFAULTS: ALERT_ENGINE_DEFAULTS,
    runAlertEngine: runAlertEngine,
  };
}
