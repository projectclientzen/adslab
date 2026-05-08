const DEDUP_STATS_STORAGE_KEY = "adsLabDedupStats";

renderDedupStats();

chrome.storage.onChanged.addListener(function handleStorageChange(changes, areaName) {
  if (areaName !== "session" || !changes[DEDUP_STATS_STORAGE_KEY]) {
    return;
  }

  updateUi(changes[DEDUP_STATS_STORAGE_KEY].newValue);
});

function renderDedupStats() {
  chrome.storage.session.get(DEDUP_STATS_STORAGE_KEY).then(function handleStats(data) {
    updateUi(data[DEDUP_STATS_STORAGE_KEY] || null);
  });
}

function updateUi(stats) {
  const counterElement = document.getElementById("dedup-counter");
  const metaElement = document.getElementById("dedup-meta");
  const insertedCount = stats ? stats.insertedCount || 0 : 0;
  const duplicateCount = stats ? stats.duplicateCount || 0 : 0;

  counterElement.textContent = insertedCount + " baru / " + duplicateCount + " duplikat";

  if (stats && stats.lastRunAt) {
    metaElement.textContent =
      "Processed " +
      (stats.processedCount || 0) +
      " record. Last run " +
      new Date(stats.lastRunAt).toLocaleString("id-ID");
    return;
  }

  metaElement.textContent = "Belum ada run scraping.";
}
