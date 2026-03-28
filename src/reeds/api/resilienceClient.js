import axios from "axios";

/**
 * @param {unknown} err
 */
export function isAbortError(err) {
  return axios.isCancel(err) || err?.code === "ERR_CANCELED" || err?.name === "CanceledError";
}

/**
 * @param {number} lat
 * @param {number} lng
 * @param {{ signal?: AbortSignal }} [options]
 */
export async function fetchOpenMeteoResilience(lat, lng, options = {}) {
  const { signal } = options;
  const res = await axios.get("/api/resilience/open-meteo", {
    params: { lat, lng },
    validateStatus: () => true,
    timeout: 20_000,
    signal,
  });
  if (res.status >= 400) {
    const msg = res.data?.error || `Open-Meteo proxy failed (${res.status})`;
    throw new Error(msg);
  }
  return res.data;
}

/**
 * @param {string} state Two-letter state
 * @param {{ signal?: AbortSignal }} [options]
 */
export async function fetchEiaRetail(state, options = {}) {
  const { signal } = options;
  const res = await axios.get("/api/resilience/eia-retail", {
    params: { state },
    validateStatus: () => true,
    timeout: 25_000,
    signal,
  });
  if (res.status === 503 && res.data?.code === "NO_EIA_KEY") {
    return { skipped: true, reason: "no_eia_key" };
  }
  if (res.status >= 400) {
    const msg = res.data?.error || `EIA proxy failed (${res.status})`;
    throw new Error(msg);
  }
  return res.data;
}
