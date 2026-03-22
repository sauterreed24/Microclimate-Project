/** @typedef {{ id: string, label: string, searchQuery: string, state: string, region: string, country: string, lat: number, lng: number, flag: string, tags: string[], notes: string, isHome?: boolean, homeStar?: boolean, mexicoZone?: boolean, resourceLinks?: { label: string, href: string }[], searchMode?: "location" | "coordinates", coordRadiusMiles?: number, microclimateProfile?: string }} LocationRecord */

/** US / default location */
export function us(p) {
  return {
    id: p.id,
    label: p.label,
    searchQuery: p.q,
    state: p.state,
    region: p.region,
    country: "US",
    lat: p.lat,
    lng: p.lng,
    flag: p.flag || "🏠",
    tags: p.tags || [],
    notes: p.notes || "",
    isHome: p.isHome,
    homeStar: p.homeStar,
    mexicoZone: false,
    searchMode: p.searchMode || "location",
    coordRadiusMiles: p.coordRadiusMiles ?? undefined,
    microclimateProfile: p.microclimateProfile,
  };
}

/**
 * Sonora travel / microclimate pins — NOT for Zillow (no searchQuery).
 * @param {object} p
 * @param {string} [p.feelsLike] — one-line “thermal personality”
 * @param {string[]} [p.climateFactors] — short bullets (heat, monsoon, wind…)
 * @param {string[]} [p.travelBullets] — FMM, insurance, plates, ports
 * @param {string} [p.zoneDisclaimer] — legal / program disclaimer
 */
export function mx(p) {
  return {
    id: p.id,
    label: p.label,
    searchQuery: "",
    state: "Sonora",
    region: p.region,
    country: "MX",
    lat: p.lat,
    lng: p.lng,
    flag: "🇲🇽",
    tags: p.tags || ["sonora-free-zone", "mexico"],
    notes: p.notes || "",
    mexicoZone: true,
    resourceLinks: p.resourceLinks || [
      { label: "Vivanuncios", href: "https://www.vivanuncios.com" },
      { label: "Inmuebles24", href: "https://www.inmuebles24.com" },
    ],
    feelsLike: p.feelsLike,
    climateFactors: p.climateFactors || [],
    travelBullets: p.travelBullets || [],
    zoneDisclaimer: p.zoneDisclaimer || "",
    microclimateProfile: p.microclimateProfile,
  };
}
