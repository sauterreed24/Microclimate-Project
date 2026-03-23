/**
 * Reed's Home Finder — OpenWeb Ninja proxy (key server-side only)
 */
import path from "node:path";
import { fileURLToPath } from "node:url";
import express from "express";
import cors from "cors";
import axios from "axios";
import dotenv from "dotenv";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, ".env") });

const PORT = Number(process.env.PORT || 3001);
const BASE = (process.env.ZILLOW_API_BASE || "https://api.openwebninja.com/realtime-zillow-data").replace(/\/$/, "");

const app = express();
app.use(
  cors({
    origin: [/localhost:\d+/, /127\.0\.0\.1:\d+/],
  })
);
app.use(express.json({ limit: "2mb" }));

function zillowHeaders() {
  const key = process.env.ZILLOW_API_KEY;
  if (!key) {
    const e = new Error("Missing ZILLOW_API_KEY in backend/.env");
    e.code = "NO_KEY";
    throw e;
  }
  return { "x-api-key": key };
}

async function forwardGet(subPath, req, res) {
  try {
    const url = `${BASE}${subPath}`;
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
      headers: zillowHeaders(),
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
  res.json({ ok: true, hasKey: !!process.env.ZILLOW_API_KEY, base: BASE });
});

app.get("/api/zillow/search", (req, res) => forwardGet("/search", req, res));
app.get("/api/zillow/search-coordinates", (req, res) => forwardGet("/search-coordinates", req, res));
app.get("/api/zillow/search-polygon", (req, res) => forwardGet("/search-polygon", req, res));
app.get("/api/zillow/property-details", (req, res) => forwardGet("/property-details", req, res));
app.get("/api/zillow/property-details-address", (req, res) => forwardGet("/property-details-address", req, res));
app.get("/api/zillow/zestimate", (req, res) => forwardGet("/zestimate", req, res));

app.listen(PORT, () => {
  console.log(`[reed-home-finder-api] http://localhost:${PORT}`);
});
