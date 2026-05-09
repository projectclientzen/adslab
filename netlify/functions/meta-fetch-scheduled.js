"use strict";

const metaFetch = require("./meta-fetch.js");

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

    console.log(
      "[meta-fetch-scheduled] completed",
      JSON.stringify({
        started_at: startedAt,
        fetched_at: payload.fetched_at || startedAt,
        success_count: payload.success_count || 0,
        failure_count: payload.failure_count || 0,
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
