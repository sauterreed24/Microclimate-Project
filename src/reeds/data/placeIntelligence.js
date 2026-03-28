/**
 * Educational + regional copy — not live MLS data.
 * Synthesizes common gaps in big portals vs. what place-first buyers need.
 */

/** What major apps often under-serve vs. what users ask for (weather + RE). */
export const COMPETITOR_LANDSCAPE = {
  realEstate: [
    "Automated valuations can diverge from sale price — triangulate with recent comps, not a single AVM.",
    "Big portals rarely fuse elevation, solar exposure, and drainage with the listing — you have to read terrain separately.",
    "Collaboration (shared shortlists with notes) and full fee transparency remain uneven across Zillow-class apps.",
    "Stale or duplicated listings happen — verify status on the broker site or MLS feed when stakes are high.",
  ],
  weatherClimate: [
    "Users increasingly expect wildfire smoke, AQI, and hyperlocal wind in the same mental model as temperature.",
    "Radar + fire-perimeter overlays are becoming table stakes where climate risk touches daily life.",
    "Historical normals are not enough — seasonal timing of heat, monsoon, and freeze risk matters for housing comfort.",
  ],
  ourAngle: [
    "We weight terrain, water, sky quality, and seasonal rhythm alongside beds and baths — place before pixels.",
    "When live inventory isn’t wired in, we still show how to search professionally and what to verify on the ground.",
  ],
};

export const PRICING_TRENDS_GUIDE = {
  title: "Reading price trends (no API required)",
  body: [
    "Median sale price tracks the “typical” closed deal; average is pulled up by luxury sales. Use medians for most towns.",
    "Inventory months = homes for sale ÷ monthly sales rate — higher often means cooler bidding; very low means expect competition.",
    "Seasonality: spring listings surge in many markets; desert markets also show snowbird-driven winter demand.",
    "National indices (Case-Shiller, FHFA) lag; local MLS stats and county records are sharper for offer timing.",
  ],
  links: [
    { label: "FRED economic data", href: "https://fred.stlouisfed.org/" },
    { label: "FHFA House Price Index", href: "https://www.fhfa.gov/DataTools/Downloads/Pages/House-Price-Index-Datasets.aspx" },
  ],
};

export const HOMEBUYING_PLAYBOOK = [
  {
    title: "Verify before you fall in love",
    items: [
      "Cross-check address on the assessor / county GIS for lot lines, flood zones, and overlays.",
      "If something feels too cheap, search the address + “scam” and insist on a showing with a licensed agent.",
    ],
  },
  {
    title: "Terrain & climate on the ground",
    items: [
      "Drive the approach at rush hour — noise, dust, and inversion bowls aren’t in listing photos.",
      "Ask where roof/AC drainage goes in monsoon storms; walk the lot after rain if you can.",
      "North vs south slope and canyon placement change afternoon sun and fire exposure more than sqft.",
    ],
  },
  {
    title: "Offer strategy (high level)",
    items: [
      "Pre-approval letter in hand; understand earnest money and contingency timelines for your state.",
      "In hot markets, appraisal gaps and inspection waivers are common tradeoffs — only with professional advice.",
    ],
  },
];

/**
 * @param {{ label: string, state?: string, region?: string, searchQuery?: string, microclimateProfile?: string } | null} loc
 * @returns {{ zillow: string, redfin: string, realtor: string, maps: string }}
 */
export function buildExternalSearchUrls(loc) {
  const q = String(loc?.searchQuery || loc?.label || "Southwest US").trim();
  const enc = encodeURIComponent(q);
  const plus = encodeURIComponent(q.replace(/,/g, "").trim());
  return {
    zillow: `https://www.zillow.com/homes/${enc}_rb/`,
    redfin: `https://www.redfin.com/search?search_q=${plus}`,
    realtor: `https://www.realtor.com/realestateandhomes-search/${enc}`,
    maps: `https://www.google.com/maps/search/?api=1&query=${enc}`,
  };
}

/** Region- and biome-aware narratives; extend over time. */
const DIVES = {
  "nm-rio-grande-arid": `Southern New Mexico’s Rio Grande corridor blends high-desert sun with sudden summer convection. Buyers prize thermal mass (adobe, ICF) and roof/yard drainage for monsoon bursts. East mesa vs west mesa can mean different wind exposure and commute patterns — visit both sides of town at the same time of day.`,
  "sonoran-sun-corridor": `Sonoran markets reward understanding “pre-monsoon” heat vs monsoon humidity. Pools and evaporative cooling trade off differently than coastal AC. Check HOA rules on xeriscaping, shade trees, and whether short-term rentals fit your plan.`,
  "hot-desert-basin": `Basin floors accumulate heat and sometimes smog; ridges catch breeze but fire exposure can rise. Price discovery is seasonal — snowbirds and second-home demand can compress winter inventory.`,
  "sky-island-madrean": `Sky-island towns mix mountain night chill with intense high-UV days. Water source (well vs municipal), wildfire evacuation routes, and road winterization matter as much as square footage.`,
  default: `Use the microclimate panel numbers as a compass, then ground-truth with drives at different times of day. Pair portal alerts with a local agent who knows which blocks carry hidden flood, noise, or HOA constraints.`,
};

/**
 * @param {{ region?: string, microclimateProfile?: string, notes?: string } | null | undefined} loc
 */
export function getRegionalHomebuyingNarrative(loc) {
  if (!loc) return DIVES.default;
  const mp = loc.microclimateProfile && DIVES[loc.microclimateProfile];
  if (mp) return mp;
  if (loc.notes && String(loc.notes).length > 80) {
    return `${loc.notes} For offers and inventory, use the outbound links below — we don’t replace MLS, we contextualize place.`;
  }
  return DIVES.default;
}
