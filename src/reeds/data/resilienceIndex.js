/**
 * Localized resilience index — cross-references atlas fields with lookup URLs.
 * We surface structure + education; live metrics come from linked federal/state tools.
 */

/** @type {Record<string, string>} Two-letter state → EIA.gov state slug */
export const EIA_STATE_SLUG = {
  AZ: "arizona",
  CA: "california",
  NM: "newmexico",
  CO: "colorado",
  UT: "utah",
  NV: "nevada",
  TX: "texas",
};

export const RESILIENCE_DIMENSIONS = [
  {
    id: "elevation-weather",
    title: "Elevation & weather resilience",
    summary:
      "Higher elevation usually cools summer nights and can reduce some heat-stress days, but it also means UV, wind exposure, and winter access tradeoffs. Combine terrain with flood/wildfire layers, not just temperature.",
  },
  {
    id: "energy-grid",
    title: "Energy grid & electricity costs",
    summary:
      "Retail rates and fuel mix vary by state and utility. Track state-level trends and your specific utility’s time-of-use or demand charges — they matter for heat pumps, EVs, and backup power planning.",
  },
  {
    id: "broadband",
    title: "Broadband & connectivity",
    summary:
      "Fixed and mobile coverage varies by street. FCC’s map is the authoritative starting point; verify with neighbors and ISPs before you buy rural or canyon-adjacent lots.",
  },
  {
    id: "water",
    title: "Clean water & supply security",
    summary:
      "Municipal systems vs wells vs haulage — ask about aquifer trends, adjudication, and drought contingency. Federal and state water science portals explain basins better than listing copy.",
  },
  {
    id: "long-horizon",
    title: "Long-horizon resilience (climate & economy)",
    summary:
      "Stress shows up first as energy prices, insurance availability, and labor/supply chains — not headlines. A durable home plan layers efficiency, water discipline, diversified local economy exposure, and realistic insurance — without predicting specific conflicts.",
  },
];

/**
 * Build authoritative lookup URLs for a US location.
 * @param {{ lat?: number, lng?: number, state?: string, label?: string } | null} loc
 */
export function buildResilienceLookupUrls(loc) {
  const lat = loc?.lat;
  const lng = loc?.lng;
  const st = String(loc?.state || "").toUpperCase();
  const slug = EIA_STATE_SLUG[st] || "arizona";

  const q = encodeURIComponent(String(loc?.label || `${lat},${lng}` || "United States"));

  return {
    /** FCC National Broadband Map — search by address */
    fccBroadband: "https://broadbandmap.fcc.gov/home",
    /** EIA state energy profile (retail power overview) */
    eiaState: `https://www.eia.gov/state/${slug}`,
    /** NOAA climate normals & context */
    noaaNormals: "https://www.ncei.noaa.gov/access/us-climate-normals/",
    /** USGS water resources mission (drill to state offices from here) */
    usgsWater: "https://www.usgs.gov/mission-areas/water-resources",
    /** FEMA flood hazard (NFHL) portal */
    femaFlood: "https://msc.fema.gov/portal/home",
    /** EPA drinking water programs (consumer entry) */
    epaWater: "https://www.epa.gov/dwreginfo",
    /** DSIRE — incentives for solar/storage (varies by state) */
    dsire: "https://www.dsireusa.org/",
    /** BLS area economic snapshot (MSA search) */
    blsGeo: `https://www.bls.gov/data/#geo`,
    /** FRED — macro context (rates, inflation) */
    fred: "https://fred.stlouisfed.org/",
    /** Google Maps pin for field verification of lat/lng */
    mapsPin:
      Number.isFinite(lat) && Number.isFinite(lng)
        ? `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`
        : `https://www.google.com/maps/search/?api=1&query=${q}`,
  };
}

/**
 * Cross-reference microclimate pack fields into plain-language bullets.
 * @param {{ loc?: Record<string, unknown>, rd?: Record<string, unknown> } | null} bundle
 */
export function crossRefMicroclimateToResilience(bundle) {
  if (!bundle?.loc) {
    return {
      bullets: [
        "This pin isn’t mapped to the detailed Arizona atlas pack yet — elevation, USDA, and risk cross-checks appear automatically for pack-linked towns.",
        "Until then, use the FCC, EIA, FEMA, and USGS links below for street-level broadband, state power costs, flood zones, and regional water science.",
      ],
      tags: ["atlas-pending"],
    };
  }
  const { loc, rd } = bundle;
  const bullets = [];
  const tags = [];

  if (loc.eN != null && loc.eX != null) {
    bullets.push(
      `Elevation band ~${Number(loc.eN).toLocaleString()}–${Number(loc.eX).toLocaleString()} ft — compare with flood maps (often valley-bottom) and wildfire slope exposure (ridges).`
    );
    tags.push("elevation");
  }
  if (loc.ra != null) {
    bullets.push(`~${loc.ra}" precip/yr — water security and landscaping costs scale with rainfall and municipal supply.`);
    tags.push("precipitation");
  }
  if (loc.zo) {
    bullets.push(`USDA ${loc.zo} — growing season length and frost risk for trees, gardens, and erosion control plantings.`);
    tags.push("usda-zone");
  }
  if (loc.hu != null) {
    bullets.push(`Humidity index ${loc.hu} — comfort with evaporative cooling vs refrigerated AC; mold/mildew risk in poorly ventilated envelopes.`);
    tags.push("humidity");
  }
  if (loc.aL || loc.aq != null) {
    bullets.push(`Air quality context: ${loc.aL || "see regional air"} — pair with AQI apps and wildfire smoke seasons.`);
    tags.push("air");
  }
  if (rd?.wfN || rd?.wf != null) {
    bullets.push(`Flood / wash exposure (${rd.wfN || "see risk score"}) — check FEMA layers and stormwater paths on site visits.`);
    tags.push("flood");
  }
  if (rd?.uR) {
    bullets.push(`Comfort / heat stress: ${rd.uR}`);
    tags.push("heat-stress");
  }

  if (bullets.length === 0) {
    bullets.push("Atlas risk fields will populate for Arizona pack-mapped towns; expand mappings for more states over time.");
  }

  return { bullets, tags };
}

export const LONG_HORIZON_PLAYBOOK = {
  title: "Permanent home — long view",
  paragraphs: [
    "Geopolitical shocks (conflict, sanctions, shipping) historically show up in households through energy prices, interest rates, and supply chains — not as a single headline. Planning for a permanent home means assuming volatility in utility rates, insurance, and repair materials.",
    "Climate resilience stacks: roof/insulation, orientation, native plantings, water harvesting where allowed, and understanding your evacuation routes for fire or flood — not a single app score.",
    "Economic resilience stacks: diversified regional employers, remote-work viability (broadband), and proximity to healthcare and logistics — use BLS + local census for trends, not vibes.",
  ],
};
