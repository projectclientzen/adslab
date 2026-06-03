"use strict";

const ALERT_LOG_TABLE = "alert_log";

exports.handler = async function handler(event) {
  const body = parseBody(event && event.body);
  const alertPayloads = Array.isArray(body.alerts) ? body.alerts : [body];
  const normalizedAlerts = alertPayloads
    .map(normalizeAlertPayload)
    .filter(function filterAlert(alert) {
      return alert && alert.type && alert.brand;
    });

  if (!normalizedAlerts.length) {
    return jsonResponse(400, {
      success: false,
      error: "Payload alert tidak valid",
    });
  }

  const results = [];

  for (const alert of normalizedAlerts) {
    const result = await sendSingleAlert(alert);
    results.push(result);
  }

  return jsonResponse(200, {
    success: results.some(function hasSent(result) {
      return result.sent;
    }),
    dry_run: results.every(function isDryRun(result) {
      return result.dry_run;
    }),
    results: results,
  });
};

async function sendSingleAlert(alert) {
  const message = formatTelegramMessage(alert);
  const alertKey = buildAlertKey(alert);
  const config = getOptionalConfig();

  if (config.supabaseUrl && config.supabaseKey) {
    const existingLog = await findAlertLog(config, alertKey);
    if (existingLog) {
      return {
        alert_key: alertKey,
        sent: false,
        duplicate: true,
        dry_run: Boolean(existingLog.dry_run),
      };
    }
  }

  const canSendTelegram = Boolean(config.telegramBotToken && config.telegramChatId);
  let telegramResponse = null;

  if (canSendTelegram) {
    telegramResponse = await postTelegramMessage(config, message);
  }

  if (config.supabaseUrl && config.supabaseKey) {
    await insertAlertLog(config, {
      alert_key: alertKey,
      brand: alert.brand,
      type: alert.type,
      campaign_id: alert.campaign_id || null,
      message_text: message,
      payload_json: alert,
      dry_run: !canSendTelegram,
      sent_at: new Date().toISOString(),
      telegram_message_id: telegramResponse?.result?.message_id || null,
    });
  }

  return {
    alert_key: alertKey,
    sent: canSendTelegram,
    duplicate: false,
    dry_run: !canSendTelegram,
    message_preview: message,
  };
}

function parseBody(rawBody) {
  if (!rawBody) {
    return {};
  }

  try {
    return JSON.parse(rawBody);
  } catch (error) {
    return {};
  }
}

function normalizeAlertPayload(payload) {
  if (!payload || typeof payload !== "object") {
    return null;
  }

  return {
    brand: String(payload.brand || payload.brandKey || "unknown").trim().toLowerCase(),
    type: String(payload.type || "unknown_alert").trim(),
    title: String(payload.title || payload.type || "ADS LAB Alert").trim(),
    diagnosis: String(payload.diagnosis || payload.condition || "Diagnosis belum tersedia").trim(),
    action: String(payload.action || "Tinjau campaign terkait di dashboard.").trim(),
    campaign_id: payload.campaign_id || payload.campaignId || null,
    triggered_at: payload.triggered_at || payload.triggeredAt || new Date().toISOString(),
    level: payload.level || "warning",
  };
}

function formatTelegramMessage(alert) {
  return [
    "🚨 [" + normalizeAlertLabel(alert.type) + "] " + normalizeBrandLabel(alert.brand),
    "",
    "Kondisi: " + alert.title,
    "Diagnosis: " + alert.diagnosis,
    "Aksi: " + alert.action,
    "",
    "Campaign: " + (alert.campaign_id || "-"),
    "Waktu: " + formatTelegramTime(alert.triggered_at),
  ].join("\n");
}

function normalizeAlertLabel(value) {
  return String(value || "ALERT")
    .replace(/_/g, " ")
    .toUpperCase();
}

function normalizeBrandLabel(value) {
  const normalized = String(value || "ADS LAB").toLowerCase();

  if (normalized === "ngajigaes") {
    return "Ngajigaes.id";
  }

  if (normalized === "labbaika") {
    return "Labbaika";
  }

  if (normalized === "alaika") {
    return "Alaika";
  }

  return "ADS LAB";
}

function formatTelegramTime(value) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return String(value);
  }

  return new Intl.DateTimeFormat("id-ID", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Asia/Jakarta",
  }).format(date);
}

function buildAlertKey(alert) {
  return [
    alert.brand,
    alert.type,
    alert.campaign_id || "-",
    String(alert.triggered_at).slice(0, 13),
  ].join("|");
}

function getOptionalConfig() {
  return {
    supabaseUrl: process.env.SUPABASE_URL ? process.env.SUPABASE_URL.replace(/\/$/, "") : null,
    supabaseKey: process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || null,
    telegramBotToken: process.env.TELEGRAM_BOT_TOKEN || null,
    telegramChatId: process.env.TELEGRAM_CHAT_ID || null,
  };
}

async function findAlertLog(config, alertKey) {
  const response = await fetch(
    config.supabaseUrl +
      "/rest/v1/" +
      ALERT_LOG_TABLE +
      "?select=alert_key,dry_run&alert_key=eq." +
      encodeURIComponent(alertKey) +
      "&limit=1",
    {
      headers: {
        apikey: config.supabaseKey,
        Authorization: "Bearer " + config.supabaseKey,
      },
    }
  );

  if (!response.ok) {
    return null;
  }

  const rows = await response.json();
  return Array.isArray(rows) && rows.length ? rows[0] : null;
}

async function insertAlertLog(config, payload) {
  const response = await fetch(config.supabaseUrl + "/rest/v1/" + ALERT_LOG_TABLE, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      apikey: config.supabaseKey,
      Authorization: "Bearer " + config.supabaseKey,
      Prefer: "return=representation",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error("Supabase alert_log insert gagal: " + response.status + " " + errorText);
  }
}

async function postTelegramMessage(config, text) {
  const response = await fetch(
    "https://api.telegram.org/bot" + config.telegramBotToken + "/sendMessage",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        chat_id: config.telegramChatId,
        text: text,
      }),
    }
  );

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error("Telegram sendMessage gagal: " + response.status + " " + errorText);
  }

  return response.json();
}

function jsonResponse(statusCode, body) {
  return {
    statusCode: statusCode,
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  };
}
