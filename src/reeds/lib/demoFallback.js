import { readableApiError, readableError } from "./errorMessage.js";

/**
 * True when the app should switch to synthetic listings instead of blocking the UI.
 * Covers missing keys, auth failures, and backend unreachable (map + list still work offline).
 * @param {unknown} e
 */
export function shouldAutoDemoFromError(e) {
  if (e == null || typeof e !== "object") return false;
  const err = /** @type {{ code?: string; status?: number; response?: { status?: number; data?: { code?: string; error?: unknown } }; message?: string }} */ (
    e
  );
  if (err.code === "NO_BACKEND") return true;

  const status = err.status ?? err.response?.status;
  const data = err.response?.data;
  const apiCode = data && typeof data === "object" ? /** @type {{ code?: string }} */ (data).code : undefined;
  if (apiCode === "NO_KEY") return true;
  if (status === 401 || status === 403) return true;
  if (status === 503 && apiCode === "NO_KEY") return true;

  const humanized = readableApiError(e, "");
  const h = humanized.toLowerCase();
  if (h.includes("provider rejected")) return true;
  if (h.includes("invalid api key")) return true;
  if (h.includes("authentication") || h.includes("unauthorized")) return true;
  if (h.includes("cannot reach the api")) return true;
  if (h.includes("missing") && h.includes("key") && h.includes("env")) return true;

  const raw = data && typeof data === "object" && "error" in data ? readableError(/** @type {any} */ (data).error, "") : "";
  const r = raw.toLowerCase();
  if (r && (r.includes("no_api_key") || r.includes("no key"))) return true;

  return false;
}
