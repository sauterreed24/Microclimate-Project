function stripHtmlish(s) {
  if (!s || typeof s !== "string") return "";
  return s
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function pickDescriptionFromObject(o) {
  if (!o || typeof o !== "object") return "";
  const keys = [
    "description",
    "homeDescription",
    "publicRemarks",
    "richTextDescription",
    "remarks",
    "marketingRemarks",
  ];
  for (const k of keys) {
    const v = o[k];
    if (typeof v === "string" && v.replace(/<[^>]*>/g, "").trim().length > 24) {
      return stripHtmlish(v);
    }
  }
  return "";
}

/**
 * Pull human-readable fields from messy nested API JSON.
 * Handles wrappers like `{ status: "OK", data: { ...property } }` and minimal `{ status, parameters }`.
 */
export function summarizePropertyDetail(raw) {
  if (!raw || typeof raw !== "object") return null;

  const pick = (o) => {
    if (!o || typeof o !== "object") return {};
    const keys = ["yearBuilt", "bedrooms", "bathrooms", "livingArea", "lotSize", "lotAreaSquareFeet", "homeType"];
    const out = {};
    for (const k of keys) {
      if (o[k] != null && typeof o[k] !== "object") out[k] = o[k];
    }
    return out;
  };

  /** Unwrap common API envelopes so we still read facts when top-level is sparse. */
  const layers = [];
  layers.push(raw);
  if (raw.data && typeof raw.data === "object" && !Array.isArray(raw.data)) layers.push(raw.data);
  if (raw.property && typeof raw.property === "object") layers.push(raw.property);
  if (raw.data?.property && typeof raw.data.property === "object") layers.push(raw.data.property);
  if (raw.data?.listing && typeof raw.data.listing === "object") layers.push(raw.data.listing);
  if (raw.listing && typeof raw.listing === "object") layers.push(raw.listing);

  let merged = {};
  for (const layer of layers) {
    merged = { ...merged, ...pick(layer) };
  }

  let rf = null;
  for (const layer of layers) {
    const candidate = layer.resoFacts || layer.data?.resoFacts;
    if (candidate && typeof candidate === "object") {
      rf = candidate;
      break;
    }
  }
  if (!rf) rf = raw.resoFacts || raw.data?.resoFacts || raw.property?.resoFacts;

  const a = { ...merged, ...pick(rf || {}) };
  if (rf && typeof rf === "object") {
    if (rf.yearBuilt != null) a.yearBuilt = rf.yearBuilt;
    if (rf.bedrooms != null) a.bedrooms = rf.bedrooms;
    if (rf.bathrooms != null) a.bathrooms = rf.bathrooms;
    if (rf.livingArea != null) a.livingArea = rf.livingArea;
    if (rf.lotSize != null) a.lotSize = rf.lotSize;
    if (rf.homeType != null) a.homeType = rf.homeType;
  }

  let longDescription = "";
  for (const layer of layers) {
    longDescription = pickDescriptionFromObject(layer);
    if (longDescription) break;
  }
  if (!longDescription && rf && typeof rf === "object") {
    longDescription = pickDescriptionFromObject(rf);
    if (!longDescription) {
      const ar = rf.atPublicRemarks ?? rf.attributionInfo?.listingAgentRemarks;
      if (typeof ar === "string" && ar.replace(/<[^>]*>/g, "").trim().length > 24) {
        longDescription = stripHtmlish(ar);
      }
    }
  }
  if (longDescription) a.description = longDescription;

  delete a.resoFacts;

  const entries = Object.entries(a).filter(([, v]) => v != null && v !== "");
  return entries.length ? Object.fromEntries(entries) : null;
}

/**
 * When property-details returns only `{ status, parameters }`, surface key facts from the search listing.
 * @param {Record<string, unknown> | null} listing
 */
export function summarizeFromListing(listing) {
  if (!listing || typeof listing !== "object") return null;
  const out = {};
  if (listing.beds != null) out.bedrooms = listing.beds;
  if (listing.baths != null) out.bathrooms = listing.baths;
  if (listing.livingArea != null) out.livingArea = listing.livingArea;
  if (listing.lotAreaValue != null || listing.lotAreaUnit) {
    const u = listing.lotAreaUnit ? String(listing.lotAreaUnit) : "";
    out.lotSize =
      listing.lotAreaValue != null ? `${listing.lotAreaValue}${u ? ` ${u}` : ""}`.trim() : u || null;
  }
  if (listing.homeTypeLabel) out.homeType = listing.homeTypeLabel;
  if (listing.daysOnMarket != null) out.daysOnMarket = listing.daysOnMarket;
  if (listing.description && String(listing.description).trim().length > 24) {
    out.description = stripHtmlish(String(listing.description));
  }
  const entries = Object.entries(out).filter(([, v]) => v != null && v !== "");
  return entries.length ? Object.fromEntries(entries) : null;
}
