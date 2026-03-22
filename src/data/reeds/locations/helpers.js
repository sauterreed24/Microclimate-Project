/** @typedef {{ id: string, label: string, searchQuery: string, state: string, region: string, country: string, lat: number, lng: number, flag: string, tags: string[], notes: string, isHome?: boolean, homeStar?: boolean, mexicoZone?: boolean, resourceLinks?: { label: string, href: string }[] }} LocationRecord */

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
  };
}

/** Sonora Free Zone — no Zillow coverage */
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
  };
}
