/**
 * Tracks when listings were last fetched so we can auto-refresh after a quiet period
 * (long-lived tabs, returning after days) without hammering the API on every navigation.
 */

const STORAGE_KEY = "reed-listings-ingestion-v2";

function hoursFromEnv() {
  const n = Number(import.meta.env.VITE_LISTINGS_AUTO_REFRESH_HOURS);
  if (Number.isFinite(n) && n >= 6 && n <= 336) return n;
  return 72;
}

/** How long before the same search fingerprint is considered stale (default 72h). */
export function getAutoRefreshIntervalMs() {
  return hoursFromEnv() * 60 * 60 * 1000;
}

/** How often to check staleness while the tab is open (default 30 min). */
export function getBackgroundPollIntervalMs() {
  const n = Number(import.meta.env.VITE_LISTINGS_STALE_CHECK_MINUTES);
  const mins = Number.isFinite(n) && n >= 5 && n <= 180 ? n : 30;
  return mins * 60 * 1000;
}

/**
 * @param {Record<string, unknown>} state zustand snapshot (location + filters; omit loading).
 */
export function searchFingerprint(state) {
  return [
    state.locationId,
    state.homeStatus,
    state.homeType,
    state.sort,
    state.minPrice,
    state.maxPrice,
    state.minBedrooms,
    state.maxBedrooms,
    state.minBathrooms,
    state.maxBathrooms,
    state.minSqft,
    state.maxSqft,
  ].join("|");
}

export function readIngestionMeta() {
  try {
    if (typeof window === "undefined" || !window.localStorage) return null;
    const s = window.localStorage.getItem(STORAGE_KEY);
    if (!s) return null;
    const o = JSON.parse(s);
    if (!o || typeof o.at !== "number" || typeof o.fp !== "string") return null;
    return { at: o.at, fp: o.fp };
  } catch {
    return null;
  }
}

export function writeIngestionMeta(at, fp) {
  try {
    if (typeof window === "undefined" || !window.localStorage) return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ at, fp }));
  } catch {
    /* quota / private mode */
  }
}

/** True if we already loaded this exact search and it is older than the refresh interval. */
export function shouldAutoRefresh(fp) {
  const m = readIngestionMeta();
  if (!m) return false;
  if (m.fp !== fp) return false;
  return Date.now() - m.at >= getAutoRefreshIntervalMs();
}
