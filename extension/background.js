const GRAPHQL_URL_FILTER = { urls: ["*://www.facebook.com/api/graphql/*"] };
const GRAPHQL_MESSAGE_TYPE = "ADS_LAB_PROCESS_GRAPHQL_RESPONSE";
const observedGraphqlRequests = new Map();

chrome.webRequest.onBeforeRequest.addListener(
  function handleGraphqlRequest(details) {
    if (details.method !== "POST" || details.tabId < 0) {
      return;
    }

    observedGraphqlRequests.set(details.tabId, {
      requestId: details.requestId,
      observedAt: Date.now(),
      url: details.url,
    });
  },
  GRAPHQL_URL_FILTER,
  ["requestBody"]
);

chrome.runtime.onMessage.addListener(function handleRuntimeMessage(
  message,
  sender,
  sendResponse
) {
  if (!message || message.type !== GRAPHQL_MESSAGE_TYPE) {
    return false;
  }

  processGraphqlPayload(message.payload, sender)
    .then(function onSuccess(result) {
      sendResponse({ ok: true, result: result });
    })
    .catch(function onError(error) {
      console.warn("[ADS LAB] gagal memproses GraphQL response:", error);
      sendResponse({ ok: false, error: error.message });
    });

  return true;
});

async function processGraphqlPayload(payload, sender) {
  const parsedJson = parseJsonSafely(payload && payload.body);
  const libraryUrlMappings = extractLibraryUrlMappings(parsedJson);
  const storedCount = await persistLibraryUrlMappings(libraryUrlMappings);
  const tabId = sender && sender.tab ? sender.tab.id : -1;
  const observedByWebRequest = tabId >= 0 ? observedGraphqlRequests.has(tabId) : false;

  if (tabId >= 0) {
    observedGraphqlRequests.delete(tabId);
  }

  return {
    observedByWebRequest: observedByWebRequest,
    storedCount: storedCount,
    libraryIds: Array.from(libraryUrlMappings.keys()),
  };
}

function parseJsonSafely(rawBody) {
  if (typeof rawBody !== "string" || !rawBody.trim()) {
    return null;
  }

  const sanitizedBody = rawBody.replace(/^for\s*\(;;\);\s*/, "").replace(/^while\s*\(1\);\s*/, "");

  try {
    return JSON.parse(sanitizedBody);
  } catch (error) {
    console.warn("[ADS LAB] response GraphQL bukan JSON valid:", error.message);
    return null;
  }
}

function extractLibraryUrlMappings(payload) {
  const mappings = new Map();
  walkGraphqlTree(payload, mappings, null);
  return mappings;
}

function walkGraphqlTree(node, mappings, inheritedLibraryId) {
  if (!node) {
    return;
  }

  if (Array.isArray(node)) {
    node.forEach(function walkArrayItem(item) {
      walkGraphqlTree(item, mappings, inheritedLibraryId);
    });
    return;
  }

  if (typeof node !== "object") {
    return;
  }

  const currentLibraryId = findLibraryId(node) || inheritedLibraryId;
  const destinationUrls = findDestinationUrls(node);

  if (currentLibraryId && destinationUrls.length > 0) {
    mappings.set(String(currentLibraryId), destinationUrls[0]);
  }

  Object.keys(node).forEach(function walkChild(key) {
    walkGraphqlTree(node[key], mappings, currentLibraryId);
  });
}

function findLibraryId(node) {
  const candidateKeys = [
    "library_id",
    "ad_archive_id",
    "archive_id",
    "adLibraryId",
    "ad_archiveID",
  ];

  for (const key of candidateKeys) {
    const candidateValue = node[key];
    if (typeof candidateValue === "string" && candidateValue.trim()) {
      return candidateValue.trim();
    }

    if (typeof candidateValue === "number") {
      return String(candidateValue);
    }
  }

  return null;
}

function findDestinationUrls(node) {
  const candidateKeys = ["destination_url", "destination_urls", "link_url", "link_urls"];
  const urls = [];

  candidateKeys.forEach(function extractFromKey(key) {
    if (key in node) {
      urls.push.apply(urls, extractUrls(node[key]));
    }
  });

  return Array.from(new Set(urls));
}

function extractUrls(candidate) {
  if (!candidate) {
    return [];
  }

  if (typeof candidate === "string") {
    const normalized = normalizeUrl(candidate);
    return normalized ? [normalized] : [];
  }

  if (Array.isArray(candidate)) {
    return candidate.flatMap(extractUrls);
  }

  if (typeof candidate === "object") {
    const nestedKeys = ["url", "href", "uri", "link"];
    let urls = [];

    nestedKeys.forEach(function extractNested(key) {
      if (key in candidate) {
        urls = urls.concat(extractUrls(candidate[key]));
      }
    });

    return urls;
  }

  return [];
}

function normalizeUrl(urlCandidate) {
  const trimmedUrl = urlCandidate.trim();

  if (!trimmedUrl) {
    return null;
  }

  if (
    trimmedUrl.startsWith("http://") ||
    trimmedUrl.startsWith("https://") ||
    trimmedUrl.startsWith("wa.me/") ||
    trimmedUrl.startsWith("m.me/") ||
    trimmedUrl.startsWith("api.whatsapp.com/")
  ) {
    return trimmedUrl;
  }

  if (trimmedUrl.startsWith("//")) {
    return "https:" + trimmedUrl;
  }

  return null;
}

async function persistLibraryUrlMappings(mappings) {
  if (!mappings || mappings.size === 0) {
    return 0;
  }

  const storagePayload = {};

  mappings.forEach(function assignStorageValue(destinationUrl, libraryId) {
    storagePayload[libraryId] = destinationUrl;
  });

  await chrome.storage.session.set(storagePayload);
  return Object.keys(storagePayload).length;
}
