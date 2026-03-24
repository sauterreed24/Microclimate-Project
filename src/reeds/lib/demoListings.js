/**
 * Placeholder listings for UI exploration when live Zillow/OpenWeb providers fail.
 * Not real MLS data — clearly labeled in the app.
 */

/** @param {{ id: string; label: string; lat: number; lng: number; state?: string; searchQuery?: string } | null} loc */
export function buildDemoListingsForLocation(loc) {
  if (!loc || typeof loc.lat !== "number" || typeof loc.lng !== "number") return [];

  const cityPart = String(loc.label || "").split(",")[0]?.trim() || "Town";
  const state = loc.state || "AZ";
  const seeds = [
    { street: "Ponderosa Loop", price: 389000, beds: 3, baths: 2, sqft: 1680, dom: 6 },
    { street: "Mogollon Rim Rd", price: 512000, beds: 4, baths: 3, sqft: 2140, dom: 14 },
    { street: "Aspen Hollow", price: 299000, beds: 2, baths: 2, sqft: 1210, dom: 22 },
    { street: "White Mountain Blvd", price: 445000, beds: 3, baths: 2.5, sqft: 1980, dom: 9 },
    { street: "Cedar Ridge Dr", price: 625000, beds: 4, baths: 3, sqft: 2450, dom: 3 },
    { street: "Wildcat Way", price: 335000, beds: 3, baths: 2, sqft: 1540, dom: 18 },
  ];

  return seeds.map((s, i) => {
    const lat = loc.lat + (i - 2.5) * 0.018;
    const lng = loc.lng + ((i % 3) - 1) * 0.022;
    const zpid = `demo-${loc.id}-${i}`;
    const imgSeed = encodeURIComponent(`${loc.id}-${i}`);
    return {
      zpid,
      address: `${120 + i * 44} ${s.street}`,
      city: cityPart,
      state,
      price: s.price + i * 7000,
      beds: s.beds,
      baths: s.baths,
      livingArea: s.sqft,
      latitude: lat,
      longitude: lng,
      image: `https://picsum.photos/seed/${imgSeed}/960/640`,
      url: `https://www.zillow.com/homes/${encodeURIComponent(loc.searchQuery || `${cityPart}_${state}`)}_rb/`,
      daysOnMarket: s.dom + i,
      lotAreaValue: 0.35 + i * 0.08,
      lotAreaUnit: "Acres",
      homeTypeLabel: "SingleFamily",
      raw: { _demo: true },
    };
  });
}

export function isDemoListing(listing) {
  const id = listing?.zpid != null ? String(listing.zpid) : "";
  return id.startsWith("demo-") || listing?.raw?._demo === true;
}
