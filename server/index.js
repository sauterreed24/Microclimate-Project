import dotenv from "dotenv";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import express from "express";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");
dotenv.config({ path: join(root, ".env") });
dotenv.config({ path: join(root, ".env.local") }); // overrides (same pattern as Vite)
import cors from "cors";
import { HOMES_MARKETS } from "./homesMarkets.js";
import { searchListings } from "./zillowClient.js";

const PORT = Number(process.env.PORT || 3001);
const app = express();

app.use(
  cors({
    origin: [/localhost:\d+/, /127\.0\.0\.1:\d+/],
  })
);
app.use(express.json());

app.get("/api/health", (_req, res) => {
  res.json({ ok: true, hasKey: !!(process.env.RAPIDAPI_KEY || process.env.OPENWEB_NINJA_KEY) });
});

/** Markets configured for Homes tab */
app.get("/api/homes/markets", (_req, res) => {
  res.json({ markets: HOMES_MARKETS });
});

/**
 * Query: mcId (required), page, limit
 * Returns listings merged with microclimate snapshot from request body optional —
 * we only send mcId; client merges with full MC + RD.
 */
app.get("/api/homes/listings", async (req, res) => {
  const mcId = Number(req.query.mcId);
  const page = Number(req.query.page) || 1;
  const limit = Math.min(Number(req.query.limit) || 8, 15);

  const market = HOMES_MARKETS.find((m) => m.mcId === mcId);
  if (!market) {
    return res.status(400).json({ error: "Unknown mcId for homes market" });
  }

  try {
    const result = await searchListings({
      location: market.searchQuery,
      page,
      limit,
    });
    res.json({
      mcId: market.mcId,
      label: market.label,
      searchQuery: market.searchQuery,
      note: market.note,
      ...result,
    });
  } catch (e) {
    if (e.code === "NO_API_KEY") {
      return res.status(503).json({
        error: e.message,
        code: e.code,
      });
    }
    console.error("[homes/listings]", e);
    res.status(502).json({
      error: e.message || "Upstream error",
      code: e.code || "UPSTREAM",
      detail: e.body || undefined,
    });
  }
});

app.listen(PORT, () => {
  console.log(`[microclimate-api] http://localhost:${PORT}`);
});
