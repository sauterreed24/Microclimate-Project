import axios from "axios";
import { readableError } from "../lib/errorMessage.js";

const api = axios.create({
  baseURL: "",
  timeout: 60_000,
});

/** Axios throws on network failure (e.g. API not running) — normalize message */
function wrapAxiosError(err) {
  const code = err.code || err.cause?.code;
  if (code === "ECONNREFUSED" || code === "ETIMEDOUT" || err.message === "Network Error") {
    const e = new Error(
      "Cannot reach the API on port 3001. Stop all dev terminals and run: npm run dev (starts Vite + backend together)."
    );
    e.code = "NO_BACKEND";
    return e;
  }
  return err;
}

export async function health() {
  try {
    const { data } = await api.get("/api/health");
    return data;
  } catch (e) {
    throw wrapAxiosError(e);
  }
}

export async function searchListings(params) {
  try {
    const res = await api.get("/api/zillow/search", {
      params,
      validateStatus: () => true,
    });
    if (res.status >= 400) {
      const msg =
        typeof res.data === "object" && res.data?.error
          ? res.data.error
          : `Request failed (${res.status})`;
      const err = new Error(msg);
      err.response = res;
      err.status = res.status;
      throw err;
    }
    return res.data;
  } catch (e) {
    if (e.response && e.message) throw e;
    throw wrapAxiosError(e);
  }
}

export async function searchByCoordinates(params) {
  try {
    const res = await api.get("/api/zillow/search-coordinates", {
      params,
      validateStatus: () => true,
    });
    if (res.status >= 400) {
      const msg =
        typeof res.data === "object" && res.data?.error
          ? res.data.error
          : `Request failed (${res.status})`;
      const err = new Error(msg);
      err.response = res;
      err.status = res.status;
      throw err;
    }
    return res.data;
  } catch (e) {
    if (e.response && e.message) throw e;
    throw wrapAxiosError(e);
  }
}

export async function getPropertyDetails(params) {
  const res = await api.get("/api/zillow/property-details", { params, validateStatus: () => true });
  if (res.status >= 400) {
    const raw = res.data?.error;
    throw new Error(raw != null ? readableError(raw, res.statusText || "Request failed") : res.statusText || "Request failed");
  }
  return res.data;
}

export async function getZestimate(params) {
  const res = await api.get("/api/zillow/zestimate", { params, validateStatus: () => true });
  if (res.status >= 400) {
    const raw = res.data?.error;
    throw new Error(raw != null ? readableError(raw, res.statusText || "Request failed") : res.statusText || "Request failed");
  }
  return res.data;
}
