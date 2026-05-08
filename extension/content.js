const PAGE_RESPONSE_TYPE = "ADS_LAB_GRAPHQL_RESPONSE";
const PAGE_RESPONSE_SOURCE = "ads-lab-page";
const BACKGROUND_MESSAGE_TYPE = "ADS_LAB_PROCESS_GRAPHQL_RESPONSE";
const ATTACH_RECORD_MESSAGE = "ADS_LAB_ATTACH_RECORD";
const ATTACH_RECORDS_MESSAGE = "ADS_LAB_ATTACH_RECORDS";
const GET_DESTINATION_URL_MESSAGE = "ADS_LAB_GET_DESTINATION_URL";
const SAVE_AD_RECORDS_MESSAGE = "ADS_LAB_SAVE_AD_RECORDS";
const GET_DEDUP_STATS_MESSAGE = "ADS_LAB_GET_DEDUP_STATS";
const INJECTED_SCRIPT_ID = "ads-lab-fetch-interceptor";

injectFetchInterceptor();

window.addEventListener("message", function handlePageMessage(event) {
  if (event.source !== window || !event.data) {
    return;
  }

  if (
    event.data.source !== PAGE_RESPONSE_SOURCE ||
    event.data.type !== PAGE_RESPONSE_TYPE
  ) {
    return;
  }

  chrome.runtime.sendMessage(
    {
      type: BACKGROUND_MESSAGE_TYPE,
      payload: event.data.payload,
    },
    function handleBackgroundResponse(response) {
      if (chrome.runtime.lastError) {
        console.warn(
          "[ADS LAB] gagal mengirim GraphQL payload ke background:",
          chrome.runtime.lastError.message
        );
        return;
      }

      if (response && response.ok && response.result) {
        window.dispatchEvent(
          new CustomEvent("adslab:lp-url-captured", {
            detail: response.result,
          })
        );
      }
    }
  );
});

chrome.runtime.onMessage.addListener(function handleContentMessage(
  message,
  _sender,
  sendResponse
) {
  if (!message || !message.type) {
    return false;
  }

  if (message.type === GET_DESTINATION_URL_MESSAGE) {
    getDestinationUrlForLibraryId(message.libraryId).then(function respond(url) {
      sendResponse({ destinationUrl: url });
    });
    return true;
  }

  if (message.type === ATTACH_RECORD_MESSAGE) {
    attachDestinationUrlToRecord(message.record).then(function respond(record) {
      sendResponse({ record: record });
    });
    return true;
  }

  if (message.type === ATTACH_RECORDS_MESSAGE) {
    attachDestinationUrlsToRecords(message.records).then(function respond(records) {
      sendResponse({ records: records });
    });
    return true;
  }

  if (message.type === SAVE_AD_RECORDS_MESSAGE) {
    prepareAndSaveRecords(message.records).then(function respond(result) {
      sendResponse(result);
    });
    return true;
  }

  if (message.type === GET_DEDUP_STATS_MESSAGE) {
    getDedupStats().then(function respond(stats) {
      sendResponse({ stats: stats });
    });
    return true;
  }

  return false;
});

function injectFetchInterceptor() {
  if (document.getElementById(INJECTED_SCRIPT_ID)) {
    return;
  }

  const script = document.createElement("script");
  script.id = INJECTED_SCRIPT_ID;
  script.src = chrome.runtime.getURL("injected-fetch.js");
  script.async = false;
  (document.documentElement || document.head).appendChild(script);
}

function getDestinationUrlForLibraryId(libraryId) {
  if (!libraryId) {
    return Promise.resolve(null);
  }

  return chrome.storage.session.get(libraryId).then(function resolveStoredUrl(data) {
    return data[libraryId] || null;
  });
}

async function attachDestinationUrlToRecord(record) {
  if (!record || !record.library_id) {
    return record;
  }

  const destinationUrl = await getDestinationUrlForLibraryId(record.library_id);

  if (!destinationUrl) {
    return record;
  }

  return Object.assign({}, record, {
    destination_url: destinationUrl,
  });
}

function attachDestinationUrlsToRecords(records) {
  const safeRecords = Array.isArray(records) ? records : [];
  return Promise.all(safeRecords.map(attachDestinationUrlToRecord));
}

async function prepareAndSaveRecords(records) {
  const recordsWithDestinationUrl = await attachDestinationUrlsToRecords(records);

  return chrome.runtime.sendMessage({
    type: SAVE_AD_RECORDS_MESSAGE,
    records: recordsWithDestinationUrl,
  });
}

async function getDedupStats() {
  const response = await chrome.runtime.sendMessage({
    type: GET_DEDUP_STATS_MESSAGE,
  });

  return response && response.result ? response.result : response && response.stats ? response.stats : null;
}

window.adsLabPrepareAndSaveRecords = prepareAndSaveRecords;
window.adsLabGetDedupStats = getDedupStats;
