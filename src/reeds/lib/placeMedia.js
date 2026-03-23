/**
 * Location imagery using official APIs only (no scraping).
 * - Google Maps Embed Street View (needs Maps Embed API + same key as JS maps)
 * - Wikimedia Commons geosearch + imageinfo (CC-licensed community photos)
 */

const GOOGLE_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || "";

/**
 * @param {number} lat
 * @param {number} lng
 * @param {{ heading?: number; pitch?: number; fov?: number }} [opts]
 */
export function streetViewEmbedUrl(lat, lng, opts = {}) {
  if (!GOOGLE_KEY || !Number.isFinite(lat) || !Number.isFinite(lng)) return null;
  const heading = opts.heading ?? 35;
  const pitch = opts.pitch ?? 5;
  const fov = opts.fov ?? 85;
  const q = new URLSearchParams({
    key: GOOGLE_KEY,
    location: `${lat},${lng}`,
    heading: String(heading),
    pitch: String(pitch),
    fov: String(fov),
  });
  return `https://www.google.com/maps/embed/v1/streetview?${q.toString()}`;
}

/** Opens Google Maps in the browser; user can drag Pegman for Street View. */
export function googleMapsStreetViewIntentUrl(lat, lng) {
  if (!Number.isFinite(lat) || !Number.isFinite(lng)) return null;
  return `https://www.google.com/maps/@${lat},${lng},3a,75y,90t/data=!3m6!1e1!3m4!1s!2e0!7i16384!8i8192`;
}

/**
 * @returns {Promise<{ thumbUrl: string; title: string; pageUrl: string } | null>}
 */
export async function fetchWikimediaPhotoNear(lat, lng) {
  if (!Number.isFinite(lat) || !Number.isFinite(lng)) return null;
  try {
    const geo = new URLSearchParams({
      action: "query",
      list: "geosearch",
      gscoord: `${lat}|${lng}`,
      gsradius: "12000",
      gslimit: "8",
      format: "json",
      origin: "*",
    });
    const r1 = await fetch(`https://commons.wikimedia.org/w/api.php?${geo}`);
    const d1 = await r1.json();
    const items = d1?.query?.geosearch || [];
    const fileHit = items.find((x) => typeof x?.title === "string" && x.title.startsWith("File:"));
    const title = fileHit?.title || items[0]?.title;
    if (!title) return null;

    const ii = new URLSearchParams({
      action: "query",
      titles: title,
      prop: "imageinfo",
      iiprop: "url|thumburl|extmetadata",
      iiurlwidth: "960",
      format: "json",
      origin: "*",
    });
    const r2 = await fetch(`https://commons.wikimedia.org/w/api.php?${ii}`);
    const d2 = await r2.json();
    const pages = d2?.query?.pages;
    const page = pages && Object.values(pages)[0];
    const info = page?.imageinfo?.[0];
    const thumbUrl = info?.thumburl || info?.url;
    if (!thumbUrl) return null;
    const pageUrl = `https://commons.wikimedia.org/wiki/${encodeURIComponent(title)}`;
    return { thumbUrl, title, pageUrl };
  } catch {
    return null;
  }
}
