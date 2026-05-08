"use strict";

const META_API_VERSION = "v20.0";
const BRANDS = ["ngajigaes", "labbaika", "alaika"];
const META_FIELDS = [
  "campaign_id",
  "campaign_name",
  "adset_id",
  "adset_name",
  "ad_id",
  "ad_name",
  "spend",
  "reach",
  "impressions",
  "clicks",
  "ctr",
  "cpm",
  "frequency",
  "actions",
  "action_values",
  "date_start",
  "date_stop",
].join(",");
const UPSERT_CONFLICT_COLUMNS = [
  "brand",
  "campaign_id",
  "adset_id",
  "ad_id",
  "level",
  "date_start",
  "date_stop",
].join(",");

exports.handler = async function handler(event) {
  const targetBrands = resolveTargetBrands(event);
  const fetchedAt = new Date().toISOString();
  const results = [];

  for (const brand of targetBrands) {
    try {
      const rawRows = await fetchInsightsForBrand(brand);
      const transformedRows = transformInsightsRows(brand, rawRows, fetchedAt);
      const syncedCount = await upsertSnapshotsForBrand(brand, transformedRows);

      results.push({
        brand: brand,
        success: true,
        count: syncedCount,
        fetched_at: fetchedAt,
        error: null,
      });
    } catch (error) {
      results.push({
        brand: brand,
        success: false,
        count: 0,
        fetched_at: fetchedAt,
        error: error.message,
      });
    }
  }

  return {
    statusCode: 200,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      fetched_at: fetchedAt,
      results: results,
      success_count: results.filter(function onlySuccess(result) {
        return result.success;
      }).length,
      failure_count: results.filter(function onlyFailure(result) {
        return !result.success;
      }).length,
    }),
  };
};

function resolveTargetBrands(event) {
  const requestedBrand =
    (event && event.queryStringParameters && event.queryStringParameters.brand) ||
    parseBodyBrand(event && event.body);

  if (!requestedBrand) {
    return BRANDS;
  }

  const normalizedBrand = String(requestedBrand).trim().toLowerCase();

  if (!BRANDS.includes(normalizedBrand)) {
    throw new Error("Brand tidak valid: " + normalizedBrand);
  }

  return [normalizedBrand];
}

function parseBodyBrand(rawBody) {
  if (!rawBody) {
    return null;
  }

  try {
    const parsedBody = JSON.parse(rawBody);
    return parsedBody.brand || null;
  } catch (error) {
    return null;
  }
}

async function fetchInsightsForBrand(brand) {
  const tokenEnvKey = "META_ACCESS_TOKEN_" + brand.toUpperCase();
  const accountIdEnvKey = "META_ACCOUNT_ID_" + brand.toUpperCase();
  const accessToken = process.env[tokenEnvKey];
  const accountId = process.env[accountIdEnvKey];

  if (!accessToken) {
    throw new Error("Missing env var " + tokenEnvKey);
  }

  if (!accountId) {
    throw new Error("Missing env var " + accountIdEnvKey);
  }

  const params = new URLSearchParams({
    fields: META_FIELDS,
    level: "ad",
    date_preset: "last_30d",
    access_token: accessToken,
  });
  const endpoint =
    "https://graph.facebook.com/" +
    META_API_VERSION +
    "/act_" +
    encodeURIComponent(accountId) +
    "/insights?" +
    params.toString();
  const response = await fetch(endpoint);

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error("Meta API gagal untuk " + brand + ": " + response.status + " " + errorText);
  }

  const json = await response.json();
  return Array.isArray(json.data) ? json.data : [];
}

function transformInsightsRows(brand, rows, fetchedAt) {
  return rows.map(function transformRow(row) {
    const spend = toNumber(row.spend);
    const purchases = sumActionValues(row.actions, [
      "purchase",
      "omni_purchase",
      "offsite_conversion.fb_pixel_purchase",
    ]);
    const purchaseValue = sumActionValues(row.action_values, [
      "purchase",
      "omni_purchase",
      "offsite_conversion.fb_pixel_purchase",
    ]);
    const leads = sumActionValues(row.actions, [
      "lead",
      "onsite_conversion.lead_grouped",
      "offsite_conversion.fb_pixel_lead",
    ]);

    return {
      brand: brand,
      campaign_id: nullIfEmpty(row.campaign_id),
      campaign_name: nullIfEmpty(row.campaign_name) || "Unknown Campaign",
      adset_id: nullIfEmpty(row.adset_id),
      adset_name: nullIfEmpty(row.adset_name),
      ad_id: nullIfEmpty(row.ad_id),
      ad_name: nullIfEmpty(row.ad_name),
      level: "ad",
      date_start: row.date_start,
      date_stop: row.date_stop,
      spend: spend,
      reach: toInteger(row.reach),
      impressions: toInteger(row.impressions),
      clicks: toInteger(row.clicks),
      ctr: toNumber(row.ctr),
      cpm: toNumber(row.cpm),
      frequency: toNumber(row.frequency),
      purchases: purchases,
      purchase_value: purchaseValue,
      leads: leads,
      roas: spend > 0 && purchaseValue !== null ? roundNumber(purchaseValue / spend, 4) : null,
      cpl: spend > 0 && leads > 0 ? roundNumber(spend / leads, 2) : null,
      cpp: spend > 0 && purchases > 0 ? roundNumber(spend / purchases, 2) : null,
      status: null,
      fetched_at: fetchedAt,
    };
  });
}

async function upsertSnapshotsForBrand(brand, rows) {
  if (!rows.length) {
    return 0;
  }

  const supabase = getSupabaseConfig();
  const upsertResponse = await fetch(
    supabase.url +
      "/rest/v1/campaign_snapshots?on_conflict=" +
      encodeURIComponent(UPSERT_CONFLICT_COLUMNS),
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apikey: supabase.key,
        Authorization: "Bearer " + supabase.key,
        Prefer: "resolution=merge-duplicates,return=representation",
      },
      body: JSON.stringify(rows),
    }
  );

  if (upsertResponse.ok) {
    const upsertedRows = await upsertResponse.json();
    return Array.isArray(upsertedRows) ? upsertedRows.length : rows.length;
  }

  const upsertErrorText = await upsertResponse.text();

  if (/constraint|on_conflict|unique/i.test(upsertErrorText)) {
    return replaceSnapshotsForBrand(supabase, brand, rows);
  }

  throw new Error(
    "Supabase upsert gagal untuk " + brand + ": " + upsertResponse.status + " " + upsertErrorText
  );
}

async function replaceSnapshotsForBrand(supabase, brand, rows) {
  const deleteResponse = await fetch(
    supabase.url +
      "/rest/v1/campaign_snapshots?brand=eq." +
      encodeURIComponent(brand),
    {
      method: "DELETE",
      headers: {
        apikey: supabase.key,
        Authorization: "Bearer " + supabase.key,
        Prefer: "return=minimal",
      },
    }
  );

  if (!deleteResponse.ok) {
    const deleteErrorText = await deleteResponse.text();
    throw new Error(
      "Supabase delete fallback gagal untuk " +
        brand +
        ": " +
        deleteResponse.status +
        " " +
        deleteErrorText
    );
  }

  const insertResponse = await fetch(supabase.url + "/rest/v1/campaign_snapshots", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      apikey: supabase.key,
      Authorization: "Bearer " + supabase.key,
      Prefer: "return=representation",
    },
    body: JSON.stringify(rows),
  });

  if (!insertResponse.ok) {
    const insertErrorText = await insertResponse.text();
    throw new Error(
      "Supabase insert fallback gagal untuk " +
        brand +
        ": " +
        insertResponse.status +
        " " +
        insertErrorText
    );
  }

  const insertedRows = await insertResponse.json();
  return Array.isArray(insertedRows) ? insertedRows.length : rows.length;
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

function sumActionValues(items, allowedActionTypes) {
  if (!Array.isArray(items)) {
    return null;
  }

  let total = 0;
  let found = false;

  items.forEach(function collectActionValue(item) {
    if (!item || !allowedActionTypes.includes(item.action_type)) {
      return;
    }

    const numericValue = toNumber(item.value);

    if (numericValue === null) {
      return;
    }

    found = true;
    total += numericValue;
  });

  return found ? total : null;
}

function toNumber(value) {
  if (value === null || value === undefined || value === "") {
    return null;
  }

  const numericValue = Number(value);
  return Number.isFinite(numericValue) ? numericValue : null;
}

function toInteger(value) {
  const numericValue = toNumber(value);
  return numericValue === null ? null : Math.round(numericValue);
}

function roundNumber(value, digits) {
  if (!Number.isFinite(value)) {
    return null;
  }

  const multiplier = Math.pow(10, digits);
  return Math.round(value * multiplier) / multiplier;
}

function nullIfEmpty(value) {
  if (value === null || value === undefined) {
    return null;
  }

  const normalizedValue = String(value).trim();
  return normalizedValue ? normalizedValue : null;
}
