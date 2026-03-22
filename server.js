import express from "express";
import cors from "cors";
import fetch from "node-fetch";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5175;

// Initial mapping from a few microclimate IDs (update IDs to match the data file)
const MICROCLIMATE_BBOX = {
  "hereford": { minLat: 31.35, maxLat: 31.5, minLng: -110.3, maxLng: -110.1 },
  "sierra-vista": { minLat: 31.45, maxLat: 31.6, minLng: -110.35, maxLng: -110.15 },
  "huachuca-mountains": { minLat: 31.35, maxLat: 31.6, minLng: -110.45, maxLng: -110.2 },
  // add more microclimate IDs over time
};

app.get("/api/listings", async (req, res) => {
  try {
    const microclimateId = req.query.microclimateId;
    const bbox = MICROCLIMATE_BBOX[microclimateId];

    if (!bbox) {
      return res.status(400).json({ error: "Unknown microclimateId" });
    }

    const { minPrice, maxPrice, beds } = req.query;

    const apiKey = process.env.OPENWEB_NINJA_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: "Missing OPENWEB_NINJA_KEY" });
    }

    const url = new URL("https://api.openwebninja.com/v1/real-estate/zillow");
    url.searchParams.set("min_lat", bbox.minLat);
    url.searchParams.set("max_lat", bbox.maxLat);
    url.searchParams.set("min_lng", bbox.minLng);
    url.searchParams.set("max_lng", bbox.maxLng);
    url.searchParams.set("status", "for_sale");
    url.searchParams.set("limit", "25"); // low to stay under free-tier limits

    if (minPrice) url.searchParams.set("min_price", minPrice);
    if (maxPrice) url.searchParams.set("max_price", maxPrice);
    if (beds) url.searchParams.set("min_beds", beds);

    const resp = await fetch(url.toString(), {
      headers: { "x-api-key": apiKey },
    });

    if (!resp.ok) {
      const text = await resp.text();
      return res.status(502).json({ error: "Upstream error", detail: text });
    }

    const data = await resp.json();

    const enriched = (data.properties || []).map((p) => {
      const sqft = p.livingArea || p.squareFootage || null;
      const lotSqft = p.lotSizeSqFt || p.lotSize || null;

      const pricePerSqft =
        p.price && sqft ? Math.round(p.price / sqft) : null;
      const pricePerAcre =
        p.price && lotSqft
          ? Math.round(p.price / (lotSqft / 43560))
          : null;

      const dealIndex = pricePerSqft ? 100000 / pricePerSqft : null;

      return {
        id: p.zpid || p.id,
        address: p.address,
        city: p.city,
        state: p.state,
        latitude: p.latitude,
        longitude: p.longitude,
        price: p.price,
        beds: p.bedrooms,
        baths: p.bathrooms,
        livingArea: sqft,
        lotSizeSqFt: lotSqft,
        daysOnMarket: p.daysOnZillow || p.daysOnMarket,
        url: p.detailUrl || p.url,
        pricePerSqft,
        pricePerAcre,
        dealIndex,
        microclimateId,
      };
    });

    res.json({ microclimateId, listings: enriched });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

app.listen(PORT, () => {
  console.log(`Microclimate backend running at http://localhost:${PORT}`);
});
