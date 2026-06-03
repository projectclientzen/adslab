"use strict";

const metaFetch = require("./meta-fetch.js");
const sendAlert = require("./send-alert.js");
const { runAlertEngine } = require("../../prototype_ui/alertEngine.js");

const BRANDS = ["ngajigaes", "labbaika", "alaika"];
const SCHEDULE_EXPRESSION = "0 */4 * * *";

exports.handler = async function handler(event, context) {
  const startedAt = new Date().toISOString();

  console.log(
    "[meta-fetch-scheduled] started",
    JSON.stringify({
      started_at: startedAt,
      schedule: SCHEDULE_EXPRESSION,
    })
  );

  try {
    const metaFetchResponse = await metaFetch.handler(
      {
        body: null,
        headers: (event && event.headers) || {},
        queryStringParameters: {},
      },
      context
    );
    const payload = parseMetaFetchPayload(metaFetchResponse);
    const statusRows = buildFetchStatusRows(payload.results, payload.fetched_at || startedAt);

    await upsertFetchStatusRows(statusRows);
    const alertDispatch = await dispatchScheduledAlerts(payload, statusRows);

    console.log(
      "[meta-fetch-scheduled] completed",
      JSON.stringify({
        started_at: startedAt,
        fetched_at: payload.fetched_at || startedAt,
        success_count: payload.success_count || 0,
        failure_count: payload.failure_count || 0,
        alerts_sent: alertDispatch.sent_count || 0,
        results: payload.results || [],
      })
    );

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        success: true,
        started_at: startedAt,
        schedule: SCHEDULE_EXPRESSION,
        fetched_at: payload.fetched_at || startedAt,
        results: payload.results || [],
        success_count: payload.success_count || 0,
        failure_count: payload.failure_count || 0,
        alerts_sent: alertDispatch.sent_count || 0,
      }),
    };
  } catch (error) {
    const failedAt = new Date().toISOString();
    const statusRows = BRANDS.map(function mapBrand(brand) {
      return {
        brand: brand,
        last_fetched_at: failedAt,
        status: "error",
        error_message: truncateError(error.message),
        updated_at: failedAt,
      };
    });

    try {
      await upsertFetchStatusRows(statusRows);
    } catch (statusError) {
      console.error(
        "[meta-fetch-scheduled] failed to persist fetch_status",
        JSON.stringify({
          started_at: startedAt,
          failed_at: failedAt,
          error: statusError.message,
        })
      );
    }

    console.error(
      "[meta-fetch-scheduled] failed",
      JSON.stringify({
        started_at: startedAt,
        failed_at: failedAt,
        schedule: SCHEDULE_EXPRESSION,
        error: error.message,
      })
    );

    return {
      statusCode: 500,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        success: false,
        started_at: startedAt,
        failed_at: failedAt,
        schedule: SCHEDULE_EXPRESSION,
        error: error.message,
      }),
    };
  }
};

function parseMetaFetchPayload(response) {
  if (!response || typeof response.body !== "string") {
    throw new Error("meta-fetch response body tidak valid");
  }

  const parsedBody = JSON.parse(response.body);

  return {
    fetched_at: parsedBody.fetched_at || null,
    results: Array.isArray(parsedBody.results) ? parsedBody.results : [],
    success_count: parsedBody.success_count || 0,
    failure_count: parsedBody.failure_count || 0,
  };
}

function buildFetchStatusRows(results, fallbackTimestamp) {
  return BRANDS.map(function mapBrand(brand) {
    const brandResult = results.find(function findResult(result) {
      return result && result.brand === brand;
    });
    const fetchedAt =
      (brandResult && brandResult.fetched_at) || fallbackTimestamp || new Date().toISOString();

    return {
      brand: brand,
      last_fetched_at: fetchedAt,
      status: brandResult && brandResult.success ? "success" : "error",
      error_message:
        brandResult && !brandResult.success ? truncateError(brandResult.error) : null,
      updated_at: fetchedAt,
    };
  });
}

async function upsertFetchStatusRows(rows) {
  if (!Array.isArray(rows) || !rows.length) {
    return;
  }

  const supabase = getSupabaseConfig();
  const response = await fetch(supabase.url + "/rest/v1/fetch_status?on_conflict=brand", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      apikey: supabase.key,
      Authorization: "Bearer " + supabase.key,
      Prefer: "resolution=merge-duplicates,return=representation",
    },
    body: JSON.stringify(rows),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error("Supabase fetch_status upsert gagal: " + response.status + " " + errorText);
  }
}

async function dispatchScheduledAlerts(payload, statusRows) {
  const alerts = [];

  for (const brandResult of payload.results || []) {
    if (!brandResult?.success) {
      alerts.push({
        brand: brandResult.brand,
        type: "scheduled_fetch_failed",
        title: "Scheduled fetch gagal",
        diagnosis: brandResult.error || "Meta fetch tidak mengembalikan hasil sukses.",
        action: "Periksa token Meta, account ID, dan response function meta-fetch.",
        campaign_id: null,
        triggered_at: payload.fetched_at || new Date().toISOString(),
        level: "danger",
      });
      continue;
    }

    const rows = await fetchLatestRowsForBrand(brandResult.brand);
    const alertResults = runAlertEngine({
      brandKey: brandResult.brand,
      triggeredAt: payload.fetched_at || new Date().toISOString(),
      campaigns: buildCampaignSummaries(rows),
      ads: buildAdSummaries(rows),
    });

    alerts.push.apply(
      alerts,
      alertResults.map(function mapAlert(alert) {
        return Object.assign({}, alert, {
          brand: brandResult.brand,
        });
      })
    );
  }

  const fetchErrors = statusRows.filter(function filterErrors(row) {
    return row && row.status === "error";
  });

  fetchErrors.forEach(function pushStatusAlert(row) {
    const alreadyCovered = alerts.some(function findAlert(alert) {
      return alert.brand === row.brand && alert.type === "scheduled_fetch_failed";
    });

    if (alreadyCovered) {
      return;
    }

    alerts.push({
      brand: row.brand,
      type: "fetch_status_error",
      title: "Fetch status masuk state error",
      diagnosis: row.error_message || "Scheduled fetch terakhir gagal dan status brand menjadi error.",
      action: "Cek log Netlify function dan pastikan snapshot berikutnya kembali sukses.",
      campaign_id: null,
      triggered_at: row.updated_at,
      level: "danger",
    });
  });

  if (!alerts.length) {
    return { sent_count: 0, alerts: [] };
  }

  const response = await sendAlert.handler({
    body: JSON.stringify({
      alerts: alerts,
    }),
  });
  const parsed = JSON.parse(response.body);

  return {
    sent_count: Array.isArray(parsed.results)
      ? parsed.results.filter(function filterSent(result) {
          return result.sent;
        }).length
      : 0,
    alerts: parsed.results || [],
  };
}

async function fetchLatestRowsForBrand(brand) {
  const supabase = getSupabaseConfig();
  const response = await fetch(
    supabase.url +
      "/rest/v1/campaign_snapshots?brand=eq." +
      encodeURIComponent(brand) +
      "&select=campaign_id,campaign_name,ad_id,ad_name,level,spend,reach,impressions,clicks,ctr,frequency,purchases,purchase_value,leads,roas,cpl,cpp,status,fetched_at&order=fetched_at.desc&limit=200",
    {
      headers: {
        apikey: supabase.key,
        Authorization: "Bearer " + supabase.key,
      },
    }
  );

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error("Gagal membaca snapshot terbaru untuk alert: " + response.status + " " + errorText);
  }

  const rows = await response.json();

  if (!Array.isArray(rows) || !rows.length) {
    return [];
  }

  const latestFetchedAt = rows[0].fetched_at;
  return rows.filter(function filterLatest(row) {
    return row && row.fetched_at === latestFetchedAt;
  });
}

function buildCampaignSummaries(rows) {
  const grouped = new Map();

  rows.forEach(function assignRow(row) {
    const campaignId = row.campaign_id || "unknown-campaign";

    if (!grouped.has(campaignId)) {
      grouped.set(campaignId, {
        campaign_id: campaignId,
        campaign_name: row.campaign_name || "Unknown Campaign",
        spend: 0,
        reach: 0,
        impressions: 0,
        clicks: 0,
        purchases: 0,
        purchase_value: 0,
        leads: 0,
        statuses: [],
      });
    }

    const item = grouped.get(campaignId);
    item.spend += toFiniteNumber(row.spend);
    item.reach += toFiniteNumber(row.reach);
    item.impressions += toFiniteNumber(row.impressions);
    item.clicks += toFiniteNumber(row.clicks);
    item.purchases += toFiniteNumber(row.purchases);
    item.purchase_value += toFiniteNumber(row.purchase_value);
    item.leads += toFiniteNumber(row.leads);
    if (row.status) {
      item.statuses.push(row.status);
    }
  });

  return Array.from(grouped.values()).map(function mapCampaign(campaign) {
    return {
      campaign_id: campaign.campaign_id,
      campaign_name: campaign.campaign_name,
      spend: campaign.spend,
      reach: campaign.reach,
      impressions: campaign.impressions,
      clicks: campaign.clicks,
      purchases: campaign.purchases,
      purchase_value: campaign.purchase_value,
      leads: campaign.leads,
      ctr: campaign.impressions > 0 ? campaign.clicks / campaign.impressions : 0,
      frequency: campaign.reach > 0 ? campaign.impressions / campaign.reach : 0,
      roas: campaign.spend > 0 ? campaign.purchase_value / campaign.spend : 0,
      cpl: campaign.spend > 0 && campaign.leads > 0 ? campaign.spend / campaign.leads : 0,
      cpp: campaign.spend > 0 && campaign.purchases > 0 ? campaign.spend / campaign.purchases : 0,
      status: campaign.statuses[0] || null,
    };
  });
}

function buildAdSummaries(rows) {
  return rows
    .filter(function filterAd(row) {
      return row && (row.level === "ad" || row.ad_id || row.ad_name);
    })
    .map(function mapAd(row) {
      return {
        ad_id: row.ad_id || null,
        ad_name: row.ad_name || "Ad tanpa nama",
        campaign_id: row.campaign_id || "unknown-campaign",
        campaign_name: row.campaign_name || "Unknown Campaign",
        spend: toFiniteNumber(row.spend),
        reach: toFiniteNumber(row.reach),
        impressions: toFiniteNumber(row.impressions),
        clicks: toFiniteNumber(row.clicks),
        purchases: toFiniteNumber(row.purchases),
        purchase_value: toFiniteNumber(row.purchase_value),
        leads: toFiniteNumber(row.leads),
        roas: toFiniteNumber(row.roas),
        cpl: toFiniteNumber(row.cpl),
        cpp: toFiniteNumber(row.cpp),
        ctr: toFiniteNumber(row.ctr),
      };
    });
}

function getSupabaseConfig() {
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;

  if (!supabaseUrl) {
    throw new Error("Missing env var SUPABASE_URL");
  }

  if (!supabaseKey) {
    throw new Error("Missing env var SUPABASE_ANON_KEY or SUPABASE_SERVICE_ROLE_KEY");
  }

  return {
    url: supabaseUrl.replace(/\/$/, ""),
    key: supabaseKey,
  };
}

function truncateError(message) {
  if (!message) {
    return null;
  }

  const normalizedMessage = String(message);
  return normalizedMessage.length > 1000 ? normalizedMessage.slice(0, 1000) : normalizedMessage;
}

function toFiniteNumber(value) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}
