/**
 * Turn API / axios error payloads into a plain string (never pass objects to toast or JSX).
 * Backend often returns `{ error: { message: "..." } }` — that object must not reach React children.
 */

/**
 * @param {unknown} value
 * @param {string} [fallback]
 * @returns {string}
 */
export function readableError(value, fallback = "Something went wrong") {
  if (value == null) return fallback;
  if (value instanceof Error) return value.message?.trim() || fallback;
  if (typeof value === "string") {
    const s = value.trim();
    return s || fallback;
  }
  if (typeof value === "number" || typeof value === "boolean") return String(value);
  if (typeof value === "object") {
    const o = /** @type {Record<string, unknown>} */ (value);
    if (o.message != null && (typeof o.message === "string" || typeof o.message === "number")) {
      return String(o.message);
    }
    if (o.error != null && typeof o.error === "string") return o.error;
    try {
      return JSON.stringify(o);
    } catch {
      return fallback;
    }
  }
  return String(value);
}

/**
 * Axios-shaped errors from search / detail calls.
 * @param {unknown} e
 * @param {string} [fallback]
 */
/**
 * Map terse upstream Zillow/OpenWeb Ninja messages to actionable copy.
 * @param {string} msg
 */
export function humanizeZillowProviderMessage(msg) {
  const s = String(msg || "").trim();
  if (!s) return s;
  const lower = s.toLowerCase();
  if (
    lower.includes("authentication") ||
    lower.includes("unauthorized") ||
    lower.includes("invalid api key") ||
    (lower.includes("api key") && (lower.includes("invalid") || lower.includes("missing")))
  ) {
    return "Listing provider rejected the request — use a valid ZILLOW_API_KEY (OpenWeb direct) or RAPIDAPI_KEY / OPENWEB_NINJA_KEY (RapidAPI) in backend/.env, save, restart npm run dev, and check quota/billing. No third-party API legally mirrors 100% of Zillow’s feed.";
  }
  if (lower.includes("rate limit") || lower.includes("too many requests")) {
    return "Too many requests to the Zillow provider — wait a minute and tap Refresh, or reduce how often you change markets.";
  }
  if (lower.includes("credit") || lower.includes("quota") || lower.includes("subscription")) {
    return "Zillow provider quota or subscription issue — check your OpenWeb Ninja plan and billing.";
  }
  return s;
}

export function readableApiError(e, fallback = "Request failed") {
  if (e == null) return fallback;
  if (typeof e === "object" && e !== null && "response" in e) {
    const res = /** @type {{ response?: { data?: { error?: unknown } } } }} */ (e);
    const body = res.response?.data?.error;
    if (body != null) {
      const raw = readableError(body, fallback);
      return humanizeZillowProviderMessage(raw) || raw;
    }
  }
  const base = readableError(e, fallback);
  return humanizeZillowProviderMessage(base) || base;
}
