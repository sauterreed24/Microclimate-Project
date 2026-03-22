/**
 * Normalize OpenWeb Ninja / Zillow-shaped JSON into a flat listing array.
 */
function walkForArrays(obj, depth = 0) {
  if (!obj || depth > 8) return [];
  if (Array.isArray(obj)) return obj;
  if (typeof obj !== "object") return [];
  const out = [];
  for (const v of Object.values(obj)) {
    if (Array.isArray(v) && v.length && typeof v[0] === "object") out.push(v);
    else if (v && typeof v === "object") out.push(...walkForArrays(v, depth + 1));
  }
  return out;
}

function pickNum(...xs) {
  for (const x of xs) {
    if (x != null && !Number.isNaN(Number(x))) return Number(x);
  }
  return null;
}

function pickStr(...xs) {
  for (const x of xs) {
    if (x != null && String(x).trim()) return String(x);
  }
  return "";
}

export function extractListings(raw) {
  if (!raw) return [];
  if (Array.isArray(raw)) return raw.map(normalizeListing).filter(Boolean);
  const candidates = [
    raw.listings,
    raw.results,
    raw.properties,
    raw.props,
    raw.data?.listings,
    raw.data?.results,
    raw.data?.properties,
  ].filter(Boolean);
  for (const c of candidates) {
    if (Array.isArray(c)) return c.map(normalizeListing).filter(Boolean);
  }
  const nested = walkForArrays(raw);
  const best = nested.sort((a, b) => b.length - a.length)[0];
  if (best?.length) return best.map(normalizeListing).filter(Boolean);
  return [];
}

export function normalizeListing(p) {
  if (!p || typeof p !== "object") return null;
  const price = pickNum(p.price, p.unformattedPrice, p.listing?.price);
  const zpid = pickStr(p.zpid, p.zillowId, p.id, p.listing?.zpid);
  const lat = pickNum(p.latitude, p.lat, p.coordinates?.latitude);
  const lng = pickNum(p.longitude, p.lng, p.long, p.coordinates?.longitude);
  const beds = pickNum(p.bedrooms, p.beds, p.bed);
  const baths = pickNum(p.bathrooms, p.baths, p.bath);
  const sqft = pickNum(p.livingArea, p.area, p.sqft, p.squareFootage);
  const img =
    pickStr(p.imgSrc, p.image, p.photo, p.images?.[0], p.photos?.[0]) || null;
  const addr = pickStr(p.address, p.streetAddress, p.title);
  const city = pickStr(p.city);
  const state = pickStr(p.state);
  const url = pickStr(p.detailUrl, p.url, p.hdpUrl);
  return {
    zpid,
    address: addr,
    city,
    state,
    price,
    beds,
    baths,
    livingArea: sqft,
    latitude: lat,
    longitude: lng,
    image: img,
    url,
    daysOnMarket: pickNum(p.daysOnZillow, p.daysOnMarket),
    raw: p,
  };
}

export function extractZestimateSeries(raw) {
  if (!raw) return [];
  const hist =
    raw.zestimateHistory ||
    raw.history ||
    raw.data?.zestimateHistory ||
    raw.chart?.points ||
    [];
  if (Array.isArray(hist)) {
    return hist
      .map((h) => ({
        t: h.date || h.time || h.x,
        v: pickNum(h.value, h.price, h.y),
      }))
      .filter((x) => x.v != null);
  }
  return [];
}
