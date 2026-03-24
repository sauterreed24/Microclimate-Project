import fetch from "node-fetch";

/** In-memory cache: key -> { at, data } */
const cache = new Map();
const TTL_MS = (() => {
  const n = Number(process.env.ZILLOW_SEARCH_CACHE_TTL_MS);
  if (Number.isFinite(n) && n >= 30_000 && n <= 3_600_000) return n;
  return 5 * 60 * 1000; // default 5 min
})();

function getApiKey() {
  const k = process.env.RAPIDAPI_KEY || process.env.OPENWEB_NINJA_KEY;
  if (!k) return null;
  return k.trim();
}

function getHost() {
  return (
    process.env.ZILLOW_API_HOST || "real-time-zillow-data.p.rapidapi.com"
  );
}

/**
 * OpenWeb Ninja on RapidAPI — path can vary by subscription revision.
 * Override with ZILLOW_SEARCH_PATH (e.g. /search, /search/location).
 */
function getSearchPath() {
  return process.env.ZILLOW_SEARCH_PATH || "/search";
}

function extractListings(json) {
  if (!json || typeof json !== "object") return [];
  if (Array.isArray(json)) return json;
  const candidates = [
    json.results,
    json.listings,
    json.props,
    json.properties,
    json.data?.results,
    json.data?.listings,
    json.data?.props,
  ];
  for (const c of candidates) {
    if (Array.isArray(c) && c.length) return c;
  }
  return [];
}

export function normalizeListing(raw) {
  if (!raw || typeof raw !== "object") return null;
  const addr = raw.address || {};
  const street =
    raw.streetAddress || addr.streetAddress || raw.addressStreet || "";
  const city = raw.city || addr.city || "";
  const state = raw.state || addr.state || "";
  const zip = raw.zipcode || addr.zipcode || "";
  const line = [street, city, state, zip].filter(Boolean).join(", ");
  let photo =
    raw.imgSrc ||
    raw.imageUrl ||
    raw.coverImage ||
    null;
  if (!photo && Array.isArray(raw.responsivePhotos) && raw.responsivePhotos[0]) {
    const p = raw.responsivePhotos[0];
    photo = p.url || p?.mixedSources?.jpeg?.[0]?.url || null;
  }
  const zpid = raw.zpid ?? raw.id ?? null;
  const zillowUrl =
    raw.hdpUrl ||
    (zpid ? `https://www.zillow.com/homedetails/${zpid}_zpid/` : null);

  const zRaw = raw.zestimate;
  const zestimate =
    typeof zRaw === "number"
      ? zRaw
      : zRaw && typeof zRaw === "object"
        ? zRaw.value ?? zRaw.amount ?? null
        : null;

  return {
    zpid,
    price: raw.price ?? raw.unformattedPrice ?? null,
    currency: "USD",
    bedrooms: raw.bedrooms ?? null,
    bathrooms: raw.bathrooms ?? null,
    livingArea: raw.livingArea ?? raw.livingAreaValue ?? null,
    homeType: raw.homeType ?? null,
    homeStatus: raw.homeStatus ?? null,
    addressLine: line || null,
    city: city || null,
    state: state || null,
    zipcode: zip || null,
    latitude: raw.latitude ?? null,
    longitude: raw.longitude ?? null,
    photoUrl: photo,
    zillowUrl,
    listingSource: raw.listingDataSource ?? null,
    brokerageName: raw.attributionInfo?.brokerName ?? raw.brokerageName ?? null,
    zestimate: zestimate != null && Number.isFinite(Number(zestimate)) ? Number(zestimate) : null,
    photoCount: raw.photoCount ?? raw.imgCount ?? null,
  };
}

/**
 * @param {{ location: string, page?: number, limit?: number }} opts
 */
export async function searchListings(opts) {
  const key = getApiKey();
  if (!key) {
    const err = new Error("Missing RAPIDAPI_KEY (or OPENWEB_NINJA_KEY) in .env");
    err.code = "NO_API_KEY";
    throw err;
  }

  const location = opts.location;
  const page = opts.page ?? 1;
  const limit = Math.min(Math.max(opts.limit ?? 8, 1), 40);

  const cacheKey = `${location}|p${page}|n${limit}`;
  const hit = cache.get(cacheKey);
  if (hit && Date.now() - hit.at < TTL_MS) {
    return { listings: hit.data, cached: true, cachedAt: hit.at };
  }

  const host = getHost();
  const path = getSearchPath();
  const url = new URL(`https://${host}${path.startsWith("/") ? path : `/${path}`}`);
  url.searchParams.set("location", location);
  url.searchParams.set("page", String(page));
  // Common alternate param names — harmless if ignored
  url.searchParams.set("limit", String(limit));
  url.searchParams.set("status", "for_sale");

  const res = await fetch(url.toString(), {
    method: "GET",
    headers: {
      "X-RapidAPI-Key": key,
      "X-RapidAPI-Host": host,
      Accept: "application/json",
    },
  });

  const text = await res.text();
  let json;
  try {
    json = JSON.parse(text);
  } catch {
    const err = new Error(`Zillow API non-JSON (${res.status}): ${text.slice(0, 200)}`);
    err.code = "BAD_RESPONSE";
    throw err;
  }

  if (!res.ok) {
    const err = new Error(json?.message || `Zillow API ${res.status}`);
    err.code = "API_ERROR";
    err.status = res.status;
    err.body = json;
    throw err;
  }

  const rawList = extractListings(json);
  const listings = rawList
    .map(normalizeListing)
    .filter(Boolean)
    .slice(0, limit);

  cache.set(cacheKey, { at: Date.now(), data: listings });
  return { listings, cached: false, cachedAt: Date.now() };
}
