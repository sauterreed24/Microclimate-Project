/**
 * Resilience data proxies — EIA (keyed), Open-Meteo (free, no key).
 * @param {import('express').Express} app
 */
import axios from "axios";

const OPEN_METEO = "https://api.open-meteo.com/v1";
const EIA_BASE = "https://api.eia.gov/v2";

/**
 * @param {string} state Two-letter uppercase
 * @param {string} apiKey
 */
export async function fetchEiaResidentialRetailPrice(state, apiKey) {
  const st = String(state || "")
    .trim()
    .toUpperCase()
    .slice(0, 2);
  if (!st || st.length !== 2) {
    const e = new Error("Invalid state");
    e.code = "BAD_STATE";
    throw e;
  }
  const url = `${EIA_BASE}/electricity/retail-sales/data/`;
  const { data } = await axios.get(url, {
    params: {
      api_key: apiKey,
      frequency: "annual",
      "data[0]": "price",
      "facets[stateid][]": st,
      "facets[sectorid][]": "RES",
      "sort[0][column]": "period",
      "sort[0][direction]": "desc",
      length: 3,
      offset: 0,
    },
    timeout: 25_000,
    validateStatus: () => true,
  });
  if (data?.error) {
    const err = new Error(typeof data.error === "string" ? data.error : JSON.stringify(data.error));
    err.code = "EIA_ERROR";
    throw err;
  }
  const rows = data?.response?.data;
  if (!Array.isArray(rows) || rows.length === 0) {
    return { state: st, latest: null, unit: "cents per kWh", source: "EIA Open Data", series: "annual residential retail" };
  }
  const latest = rows[0];
  const price = latest?.price ?? latest?.value;
  const period = latest?.period ?? latest?.year;
  return {
    state: st,
    latest: price != null ? Number(price) : null,
    period: period != null ? String(period) : null,
    unit: "cents per kWh",
    source: "EIA Open Data",
    series: "annual residential retail sales price",
    rows: rows.slice(0, 3),
  };
}

/**
 * @param {number} lat
 * @param {number} lng
 */
export async function fetchOpenMeteoBundle(lat, lng) {
  const la = Number(lat);
  const ln = Number(lng);
  if (!Number.isFinite(la) || !Number.isFinite(ln)) {
    const e = new Error("Invalid coordinates");
    e.code = "BAD_COORDS";
    throw e;
  }

  const [elevRes, curRes] = await Promise.all([
    axios.get(`${OPEN_METEO}/elevation`, {
      params: { latitude: la, longitude: ln },
      timeout: 15_000,
      validateStatus: () => true,
    }),
    axios.get(`${OPEN_METEO}/forecast`, {
      params: {
        latitude: la,
        longitude: ln,
        current: "temperature_2m,relative_humidity_2m,wind_speed_10m",
        temperature_unit: "fahrenheit",
        wind_speed_unit: "mph",
      },
      timeout: 15_000,
      validateStatus: () => true,
    }),
  ]);

  const elevationM = Array.isArray(elevRes.data?.elevation) ? elevRes.data.elevation[0] : null;
  const cur = curRes.data?.current;
  const temp = cur?.temperature_2m;
  const rh = cur?.relative_humidity_2m;
  const wind = cur?.wind_speed_10m;

  return {
    latitude: la,
    longitude: ln,
    elevationMeters: elevationM != null ? Number(elevationM) : null,
    elevationFeet:
      elevationM != null ? Math.round(Number(elevationM) * 3.28084) : null,
    current: {
      temperatureF: temp != null ? Number(temp) : null,
      relativeHumidityPct: rh != null ? Number(rh) : null,
      windMph: wind != null ? Number(wind) : null,
      time: cur?.time || null,
    },
    source: "Open-Meteo",
    attribution: "https://open-meteo.com",
  };
}

/**
 * @param {import('express').Express} app
 */
export function registerResilienceRoutes(app) {
  app.get("/api/resilience/open-meteo", async (req, res) => {
    try {
      const lat = Number(req.query.lat ?? req.query.latitude);
      const lng = Number(req.query.lng ?? req.query.longitude ?? req.query.long);
      const bundle = await fetchOpenMeteoBundle(lat, lng);
      res.json(bundle);
    } catch (e) {
      const code = e?.code === "BAD_COORDS" ? 400 : 502;
      res.status(code).json({
        error: e?.message || "Open-Meteo request failed",
        code: e?.code || "OPEN_METEO",
      });
    }
  });

  app.get("/api/resilience/eia-retail", async (req, res) => {
    const apiKey = process.env.EIA_API_KEY?.trim();
    if (!apiKey) {
      return res.status(503).json({
        error: "EIA_API_KEY not set in backend/.env — register at https://www.eia.gov/opendata/",
        code: "NO_EIA_KEY",
      });
    }
    try {
      const state = String(req.query.state || "AZ").trim();
      const out = await fetchEiaResidentialRetailPrice(state, apiKey);
      res.json(out);
    } catch (e) {
      console.error("[resilience/eia]", e?.message || e);
      res.status(502).json({
        error: e?.message || "EIA request failed",
        code: e?.code || "EIA_UPSTREAM",
      });
    }
  });
}
