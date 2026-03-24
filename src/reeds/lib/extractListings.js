/**
 * Normalize OpenWeb Ninja / Zillow-shaped JSON into a flat listing array.
 */
function walkForArrays(obj, depth = 0) {
  if (!obj || depth > 8) return [];
  // Do not return primitive arrays (numbers/strings) — parent would spread them into mixed `nested`.
  if (Array.isArray(obj)) {
    if (obj.length > 0 && typeof obj[0] === "object" && obj[0] !== null) return obj;
    return [];
  }
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
    if (x == null) continue;
    if (typeof x === "object" && !Array.isArray(x)) {
      const nested = x.value ?? x.amount ?? x.count;
      if (nested != null && typeof nested !== "object" && !Number.isNaN(Number(nested))) return Number(nested);
      continue;
    }
    if (Array.isArray(x)) continue;
    if (!Number.isNaN(Number(x))) return Number(x);
  }
  return null;
}

function pickStr(...xs) {
  for (const x of xs) {
    if (x != null && String(x).trim()) return String(x);
  }
  return "";
}

/** Flatten API fields that may be strings or nested objects (e.g. `{ name: "Tucson" }`). */
function scalarStr(v, depth = 0) {
  if (v == null || depth > 6) return "";
  if (typeof v === "string" || typeof v === "number" || typeof v === "boolean") return String(v).trim();
  if (typeof v === "bigint") return v.toString();
  if (Array.isArray(v)) return v.map((x) => scalarStr(x, depth + 1)).filter(Boolean).join(", ");
  if (typeof v === "object") {
    const o = v;
    const cityState = [scalarStr(o.city, depth + 1), scalarStr(o.state ?? o.stateCode, depth + 1)].filter(Boolean).join(", ");
    return pickStr(
      scalarStr(o.name, depth + 1),
      scalarStr(o.text, depth + 1),
      scalarStr(o.longName, depth + 1),
      scalarStr(o.label, depth + 1),
      typeof o.streetAddress === "string" ? o.streetAddress : scalarStr(o.streetAddress, depth + 1),
      o.line1,
      o.full,
      o.formatted,
      cityState,
      o.zipcode,
      o.postalCode
    );
  }
  return "";
}

/** Only treat as listing arrays — avoids strings / primitives (walkForArrays can spread string chars into nested). */
function isListingObjectArray(arr) {
  return (
    Array.isArray(arr) &&
    arr.length > 0 &&
    typeof arr[0] === "object" &&
    arr[0] !== null &&
    !Array.isArray(arr[0])
  );
}

export function extractListings(raw) {
  if (!raw) return [];
  if (Array.isArray(raw)) return raw.map(normalizeListing).filter(Boolean);
  const candidates = [
    raw.listings,
    raw.results,
    raw.properties,
    raw.props,
    raw.homes,
    raw.searchResults,
    raw.searchResults?.results,
    raw.searchResults?.listings,
    raw.searchResults?.properties,
    Array.isArray(raw.data) ? raw.data : null,
    raw.data?.listings,
    raw.data?.results,
    raw.data?.properties,
    raw.data?.props,
    raw.data?.items,
    raw.data?.homes,
    raw.data?.searchResults,
    raw.data?.searchResults?.results,
    raw.data?.mapResults,
  ].filter(Boolean);
  for (const c of candidates) {
    if (Array.isArray(c)) return c.map(normalizeListing).filter(Boolean);
  }
  const nested = walkForArrays(raw).filter(isListingObjectArray);
  const best = nested.sort((a, b) => b.length - a.length)[0];
  if (best && Array.isArray(best) && typeof best.map === "function") {
    return best.map(normalizeListing).filter(Boolean);
  }
  return [];
}

export function normalizeListing(p) {
  if (!p || typeof p !== "object") return null;
  const price = pickNum(p.price, p.unformattedPrice, p.listing?.price);
  const zpid = pickStr(
    p.zpid,
    p.zillowId,
    typeof p.id === "number" || typeof p.id === "string" ? p.id : null,
    p.listing?.zpid
  );
  const lat = pickNum(p.latitude, p.lat, p.coordinates?.latitude);
  const lng = pickNum(p.longitude, p.lng, p.long, p.coordinates?.longitude);
  const beds = pickNum(p.bedrooms, p.beds, p.bed);
  const baths = pickNum(p.bathrooms, p.baths, p.bath);
  const sqft = pickNum(p.livingArea, p.area, p.sqft, p.squareFootage);
  const img =
    pickStr(p.imgSrc, p.image, p.photo, p.images?.[0], p.photos?.[0]) || null;
  const nestedAddr = p.address && typeof p.address === "object" && !Array.isArray(p.address) ? p.address : null;
  const addr =
    scalarStr(p.address) ||
    pickStr(p.streetAddress, nestedAddr?.streetAddress, p.title) ||
    (nestedAddr ? pickStr(nestedAddr.line1, nestedAddr.street) : "");
  const city = scalarStr(p.city) || (nestedAddr ? scalarStr(nestedAddr.city) : "") || "";
  const state = scalarStr(p.state) || (nestedAddr ? scalarStr(nestedAddr.state ?? nestedAddr.stateCode) : "") || "";
  const url = pickStr(p.detailUrl, p.url, p.hdpUrl);
  const lotAreaValue = pickNum(p.lotAreaValue, p.lotSize, p.lotArea);
  const lotAreaUnit = pickStr(p.lotAreaUnit, p.lotSizeUnit) || "";
  const homeTypeLabel = pickStr(p.homeType, p.propertyType, p.listing?.homeType);
  const description = pickStr(
    p.description,
    p.publicRemarks,
    p.marketingRemarks,
    p.remark,
    p.listing?.description,
    p.listing?.publicRemarks
  );
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
    lotAreaValue,
    lotAreaUnit,
    homeTypeLabel,
    description: description || undefined,
    zestimate: zestimate ?? undefined,
    brokerageName: brokerageName || undefined,
    listingStatus: listingStatus || undefined,
    hoaMonthly: hoaMonthly ?? undefined,
    photoCount: photoCount ?? undefined,
    raw: p,
  };
}

/**
 * Normalize one history row from various Zillow / OpenWeb Ninja shapes.
 * @param {Record<string, unknown>} h
 * @returns {{ t: string | number; v: number } | null}
 */
function parseHistoryPoint(h) {
  if (!h || typeof h !== "object") return null;
  const t =
    h.date ??
    h.time ??
    h.x ??
    h.timestamp ??
    h.label ??
    (h.timeStamp != null ? String(h.timeStamp) : null);
  const v = pickNum(h.value, h.price, h.y, h.amount, h.zestimate, h.amountUsd);
  if (v == null) return null;
  return { t: t ?? "", v };
}

function historyPointsFromArray(arr) {
  if (!Array.isArray(arr) || !arr.length) return [];
  return arr.map((h) => parseHistoryPoint(/** @type {Record<string, unknown>} */ (h))).filter(Boolean);
}

/** Collect object-arrays from JSON (for discovering nested price history). */
function walkObjectArrays(obj, depth = 0) {
  if (!obj || depth > 10) return [];
  if (Array.isArray(obj)) {
    if (obj.length > 0 && typeof obj[0] === "object" && obj[0] !== null && !Array.isArray(obj[0])) {
      return [obj];
    }
    return [];
  }
  if (typeof obj !== "object") return [];
  const out = [];
  for (const v of Object.values(obj)) {
    if (Array.isArray(v) && v.length && typeof v[0] === "object" && v[0] !== null && !Array.isArray(v[0])) {
      out.push(v);
    } else if (v && typeof v === "object") {
      out.push(...walkObjectArrays(v, depth + 1));
    }
  }
  return out;
}

function looksLikeHistoryArray(arr) {
  if (!Array.isArray(arr) || arr.length < 1) return false;
  let ok = 0;
  for (const h of arr) {
    if (parseHistoryPoint(/** @type {Record<string, unknown>} */ (h))) ok++;
  }
  return ok >= Math.min(2, arr.length) || (arr.length === 1 && ok === 1);
}

function dedupeSort(points) {
  const seen = new Set();
  const out = [];
  for (const p of points) {
    const key = `${p.t}::${p.v}`;
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(p);
  }
  return out.sort((a, b) => String(a.t).localeCompare(String(b.t)));
}

/**
 * Extract time series for Zestimate chart. Upstream payloads vary widely
 * (`zestimateHistory`, `priceHistory`, nested `data`, `chart.points`, etc.).
 */
export function extractZestimateSeries(raw) {
  if (!raw || typeof raw !== "object") return [];

  const directCandidates = [
    raw.zestimateHistory,
    raw.history,
    raw.priceHistory,
    raw.taxHistory,
    raw.data?.zestimateHistory,
    raw.data?.history,
    raw.data?.priceHistory,
    raw.data?.taxHistory,
    raw.chart?.points,
    raw.data?.chart?.points,
    raw.zestimate?.priceHistory,
    raw.zestimate?.history,
    raw.data?.zestimate?.priceHistory,
    raw.data?.zestimate?.history,
    raw.property?.priceHistory,
    raw.data?.property?.priceHistory,
    raw.listing?.priceHistory,
    raw.data?.listing?.priceHistory,
  ];

  for (const hist of directCandidates) {
    const pts = historyPointsFromArray(hist);
    if (pts.length) return dedupeSort(pts);
  }

  const discovered = walkObjectArrays(raw).filter(looksLikeHistoryArray);
  discovered.sort((a, b) => b.length - a.length);
  const best = discovered[0];
  if (best) {
    const pts = historyPointsFromArray(best);
    if (pts.length) return dedupeSort(pts);
  }

  return [];
}

/**
 * Current Zestimate / valuation when history array is missing (common for some listings).
 * @param {unknown} raw
 * @returns {number | null}
 */
export function extractCurrentZestimate(raw) {
  if (!raw || typeof raw !== "object") return null;
  const o = /** @type {Record<string, unknown>} */ (raw);

  const tryPick = (x) => {
    if (x == null) return null;
    if (typeof x === "number" && Number.isFinite(x)) return x;
    if (typeof x === "object" && !Array.isArray(x)) {
      return pickNum(
        /** @type {Record<string, unknown>} */ (x).amount,
        /** @type {Record<string, unknown>} */ (x).value,
        /** @type {Record<string, unknown>} */ (x).price
      );
    }
    return null;
  };

  const candidates = [
    pickNum(o.zestimate, o.amount, o.price),
    tryPick(o.zestimate),
    tryPick(o.data?.zestimate),
    pickNum(o.data?.zestimate, o.data?.amount),
    tryPick(o.data?.property?.zestimate),
    pickNum(o.zestimate?.amount, o.zestimate?.value),
  ];

  for (const n of candidates) {
    if (n != null && Number.isFinite(n) && n > 0) return n;
  }
  return null;
}
