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
export function readableApiError(e, fallback = "Request failed") {
  if (e == null) return fallback;
  if (typeof e === "object" && e !== null && "response" in e) {
    const res = /** @type {{ response?: { data?: { error?: unknown } } } }} */ (e);
    const body = res.response?.data?.error;
    if (body != null) return readableError(body, fallback);
  }
  return readableError(e, fallback);
}
