/**
 * Reed's Home Finder — OpenWeb Ninja proxy (key server-side only)
 */
import path from "node:path";
import { fileURLToPath } from "node:url";
import express from "express";
import cors from "cors";
import axios from "axios";
import dotenv from "dotenv";
import { registerResilienceRoutes } from "./resilienceApi.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, ".env") });

const PORT = Number(process.env.PORT || 3001);

const app = express();
app.use(
  cors({
    origin: [/localhost:\d+/, /127\.0\.0\.1:\d+/],
  })
);
app.use(express.json({ limit: "2mb" }));

/**
 * OpenWeb Ninja exposes the same Zillow-shaped routes via:
 * - Direct API: `ZILLOW_API_KEY` + `x-api-key` (api.openwebninja.com/…)
 * - RapidAPI: `RAPIDAPI_KEY` + `X-RapidAPI-*` (real-time-zillow-data.p.rapidapi.com)
 */
function getUpstream() {
  const directKey = process.env.ZILLOW_API_KEY?.trim();
  const rapidKey = (process.env.RAPIDAPI_KEY || process.env.OPENWEB_NINJA_KEY || "").trim();

  if (directKey) {
    const base = (process.env.ZILLOW_API_BASE || "https://api.openwebninja.com/realtime-zillow-data").replace(/\/$/, "");
    return {
      provider: "openweb-direct",
      base,
      headers: { "x-api-key": directKey },
    };
  }

  if (rapidKey) {
    const host = (process.env.ZILLOW_RAPIDAPI_HOST || "real-time-zillow-data.p.rapidapi.com").replace(/\/$/, "");
    return {
      provider: "rapidapi",
      base: `https://${host}`,
      headers: {
        "X-RapidAPI-Key": rapidKey,
        "X-RapidAPI-Host": host,
      },
    };
  }

  const e = new Error("Missing ZILLOW_API_KEY or RAPIDAPI_KEY (or OPENWEB_NINJA_KEY) in backend/.env");
  e.code = "NO_KEY";
  throw e;
}

async function forwardGet(subPath, req, res) {
  try {
    const upstream = getUpstream();
    const url = `${upstream.base}${subPath}`;
    const params = { ...req.query };
    // Upstream variants may expect lat/lon keys; normalize coordinates for compatibility.
    if (subPath === "/search-coordinates") {
      const latitude = params.latitude ?? params.lat;
      const longitude = params.longitude ?? params.long ?? params.lng ?? params.lon;
      if (latitude != null) {
        params.latitude = latitude;
        params.lat = latitude;
      }
      if (longitude != null) {
        params.longitude = longitude;
        params.long = longitude;
        params.lng = longitude;
        params.longtitude = longitude;
      }
    }
    const r = await axios.get(url, {
      params,
      headers: upstream.headers,
      timeout: 60_000,
      validateStatus: () => true,
    });
    res.status(r.status).json(r.data);
  } catch (e) {
    if (e.code === "NO_KEY") {
      return res.status(503).json({ error: e.message, code: "NO_KEY" });
    }
    const status = e.response?.status || 502;
    const payload = e.response?.data ?? { error: e.message || "Upstream error" };
    console.error(`[zillow] ${subPath}`, e.message);
    res.status(status).json(typeof payload === "object" && payload !== null ? payload : { error: String(payload) });
  }
}

app.get("/api/health", (_req, res) => {
  try {
    const u = getUpstream();
    res.json({
      ok: true,
      hasKey: true,
      provider: u.provider,
      base: u.base,
      hasEiaKey: !!process.env.EIA_API_KEY?.trim(),
    });
  } catch {
    res.json({
      ok: true,
      hasKey: false,
      provider: null,
      base: null,
      hasEiaKey: !!process.env.EIA_API_KEY?.trim(),
    });
  }
});

registerResilienceRoutes(app);

app.get("/api/zillow/search", (req, res) => forwardGet("/search", req, res));
app.get("/api/zillow/search-coordinates", (req, res) => forwardGet("/search-coordinates", req, res));
app.get("/api/zillow/search-polygon", (req, res) => forwardGet("/search-polygon", req, res));
app.get("/api/zillow/property-details", (req, res) => forwardGet("/property-details", req, res));
app.get("/api/zillow/property-details-address", (req, res) => forwardGet("/property-details-address", req, res));
app.get("/api/zillow/zestimate", (req, res) => forwardGet("/zestimate", req, res));

const server = app.listen(PORT, () => {
  console.log(`[reed-home-finder-api] http://localhost:${PORT}`);
});

server.on("error", (err) => {
  if (err && err.code === "EADDRINUSE") {
    console.error(`[reed-home-finder-api] Port ${PORT} is already in use — stop the other API (or set PORT in backend/.env).`);
    process.exit(1);
  }
  console.error("[reed-home-finder-api] server error:", err);
  process.exit(1);
});
