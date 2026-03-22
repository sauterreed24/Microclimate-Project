import { us } from "./helpers.js";
import { buildArizonaBulkLocations } from "./arizonaBulk.js";

function inferManualArizonaProfile(region, id) {
  if (region.includes("Huachuca")) return "sky-island-madrean";
  if (region.includes("Greater Phoenix")) return "hot-desert-basin";
  if (region.includes("Tucson")) return "sonoran-sun-corridor";
  if (region.includes("Southeast Arizona")) return "sky-island-madrean";
  if (region.includes("West Arizona")) return "colorado-river-low-desert";
  if (region.includes("Northwest")) return "colorado-plateau-high";
  if (region.includes("Central / High")) {
    if (/flagstaff|show-low|pinetop|springerville|eagar|snowflake|taylor|williams|winslow/i.test(id)) return "mogollon-pine-country";
    if (/sedona|cottonwood|camp-verde|clarkdale|jerome|prescott|chino-valley|dewey|mayer|cordes|pine-az|strawberry/i.test(id))
      return "verde-mogollon-transition";
    return "mogollon-pine-country";
  }
  return "hot-desert-basin";
}

const A = (id, label, q, region, lat, lng, tags, notes, profile) =>
  us({
    id,
    label,
    q,
    state: "AZ",
    region,
    lat,
    lng,
    flag: "🌵",
    tags: tags || [],
    notes: notes || "",
    microclimateProfile: profile ?? inferManualArizonaProfile(region, id),
  });

/** Manual chips + curated coverage — merged with pack bulk municipalities (deduped by id). */
const ARIZONA_MANUAL = [
  // Greater Phoenix
  ...[
    ["phoenix-az", "Phoenix, AZ", "Phoenix, AZ", "Greater Phoenix Metro", 33.4484, -112.074, ["core", "metro"]],
    ["scottsdale-az", "Scottsdale, AZ", "Scottsdale, AZ", "Greater Phoenix Metro", 33.4942, -111.9261, ["luxury", "golf"]],
    ["tempe-az", "Tempe, AZ", "Tempe, AZ", "Greater Phoenix Metro", 33.4255, -111.94, ["asu", "urban"]],
    ["mesa-az", "Mesa, AZ", "Mesa, AZ", "Greater Phoenix Metro", 33.4152, -111.8315, ["suburban"]],
    ["chandler-az", "Chandler, AZ", "Chandler, AZ", "Greater Phoenix Metro", 33.3062, -111.8413, ["tech"]],
    ["gilbert-az", "Gilbert, AZ", "Gilbert, AZ", "Greater Phoenix Metro", 33.3528, -111.789, ["family"]],
    ["glendale-az", "Glendale, AZ", "Glendale, AZ", "Greater Phoenix Metro", 33.5387, -112.186, ["sports"]],
    ["peoria-az", "Peoria, AZ", "Peoria, AZ", "Greater Phoenix Metro", 33.5806, -112.2374, ["suburban"]],
    ["surprise-az", "Surprise, AZ", "Surprise, AZ", "Greater Phoenix Metro", 33.6292, -112.3679, ["retire"]],
    ["goodyear-az", "Goodyear, AZ", "Goodyear, AZ", "Greater Phoenix Metro", 33.4353, -112.3582, ["growth"]],
    ["avondale-az", "Avondale, AZ", "Avondale, AZ", "Greater Phoenix Metro", 33.4356, -112.3496, []],
    ["buckeye-az", "Buckeye, AZ", "Buckeye, AZ", "Greater Phoenix Metro", 33.3703, -112.5838, ["exurban"]],
    ["tolleson-az", "Tolleson, AZ", "Tolleson, AZ", "Greater Phoenix Metro", 33.4501, -112.2593, []],
    ["el-mirage-az", "El Mirage, AZ", "El Mirage, AZ", "Greater Phoenix Metro", 33.6131, -112.3246, []],
    ["litchfield-park-az", "Litchfield Park, AZ", "Litchfield Park, AZ", "Greater Phoenix Metro", 33.4934, -112.3579, []],
    ["queen-creek-az", "Queen Creek, AZ", "Queen Creek, AZ", "Greater Phoenix Metro", 33.2487, -111.6343, ["family"]],
    ["san-tan-valley-az", "San Tan Valley, AZ", "San Tan Valley, AZ", "Greater Phoenix Metro", 33.1911, -111.528, ["exurban"]],
    ["maricopa-az", "Maricopa, AZ", "Maricopa, AZ", "Greater Phoenix Metro", 33.0581, -112.0476, []],
    ["fountain-hills-az", "Fountain Hills, AZ", "Fountain Hills, AZ", "Greater Phoenix Metro", 33.6117, -111.7174, ["views"]],
    ["cave-creek-az", "Cave Creek, AZ", "Cave Creek, AZ", "Greater Phoenix Metro", 33.8333, -111.9507, ["ranch"]],
    ["carefree-az", "Carefree, AZ", "Carefree, AZ", "Greater Phoenix Metro", 33.8223, -111.9186, ["desert"]],
    ["paradise-valley-az", "Paradise Valley, AZ", "Paradise Valley, AZ", "Greater Phoenix Metro", 33.5312, -111.9426, ["estate"]],
    ["anthem-az", "Anthem, AZ", "Anthem, AZ", "Greater Phoenix Metro", 33.8673, -112.1468, ["master-planned"]],
    ["new-river-az", "New River, AZ", "New River, AZ", "Greater Phoenix Metro", 33.9159, -112.1359, ["rural"]],
    ["rio-verde-az", "Rio Verde, AZ", "Rio Verde, AZ", "Greater Phoenix Metro", 33.7225, -111.6757, ["golf"]],
    ["gold-canyon-az", "Gold Canyon, AZ", "Gold Canyon, AZ", "Greater Phoenix Metro", 33.3715, -111.4369, ["golf"]],
  ].map(([id, label, q, rg, la, ln, tg]) => A(id, label, q, rg, la, ln, tg, "")),

  // Tucson & South
  ...[
    ["tucson-az", "Tucson, AZ", "Tucson, AZ", "Tucson Metro & South", 32.2226, -110.9747, ["metro", "university"]],
    ["sahuarita-az", "Sahuarita, AZ", "Sahuarita, AZ", "Tucson Metro & South", 31.9576, -110.9557, []],
    ["green-valley-az", "Green Valley, AZ", "Green Valley, AZ", "Tucson Metro & South", 31.8549, -110.9952, ["retire"]],
    ["marana-az", "Marana, AZ", "Marana, AZ", "Tucson Metro & South", 32.4367, -111.2254, []],
    ["oro-valley-az", "Oro Valley, AZ", "Oro Valley, AZ", "Tucson Metro & South", 32.3909, -110.9665, []],
    ["vail-az", "Vail, AZ", "Vail, AZ", "Tucson Metro & South", 32.0219, -110.6972, []],
    ["benson-az", "Benson, AZ", "Benson, AZ", "Tucson Metro & South", 31.9679, -110.2948, []],
    ["douglas-az", "Douglas, AZ", "Douglas, AZ", "Tucson Metro & South", 31.3445, -109.5455, ["border"]],
    ["nogales-az", "Nogales, AZ", "Nogales, AZ", "Tucson Metro & South", 31.3404, -110.9341, ["border"]],
    ["rio-rico-az", "Rio Rico, AZ", "Rio Rico, AZ", "Tucson Metro & South", 31.4715, -110.9925, []],
    ["tubac-az", "Tubac, AZ", "Tubac, AZ", "Tucson Metro & South", 31.6116, -111.0456, ["arts"]],
    ["patagonia-az", "Patagonia, AZ", "Patagonia, AZ", "Tucson Metro & South", 31.5395, -110.7561, ["sky-islands"]],
    ["sonoita-az", "Sonoita, AZ", "Sonoita, AZ", "Tucson Metro & South", 31.6796, -110.6551, ["wine"]],
    ["elgin-az", "Elgin, AZ", "Elgin, AZ", "Tucson Metro & South", 31.6322, -110.5833, ["wine"]],
    ["willcox-az", "Willcox, AZ", "Willcox, AZ", "Tucson Metro & South", 32.2529, -109.8328, ["ag"]],
  ].map(([id, label, q, rg, la, ln, tg]) => A(id, label, q, rg, la, ln, tg, "")),

  // Huachuca Mountains & upper San Pedro — full MLS / Zillow coverage (multiple search centers)
  us({
    id: "huachuca-san-pedro-corridor-wide-az",
    label: "Huachuca & San Pedro — full corridor (radius)",
    q: "Sierra Vista, AZ",
    state: "AZ",
    region: "Huachuca & San Pedro corridor",
    lat: 31.42,
    lng: -110.05,
    flag: "🌵",
    tags: ["wide", "corridor", "all-towns"],
    notes:
      "~45 mi radius from the SR-92 / San Pedro centroid — one pass for Sierra Vista, Hereford, Ramsey bench, Bisbee, Tombstone, Douglas-side listings. Microclimate card uses Sierra Vista as the narrative hub.",
    searchMode: "coordinates",
    coordRadiusMiles: 45,
    microclimateProfile: "sky-island-madrean",
  }),
  ...[
    ["sierra-vista-az", "Sierra Vista, AZ", "Sierra Vista, AZ", "Huachuca & San Pedro corridor", 31.5545, -110.3037, ["hub", "fort-huachuca"]],
    ["hereford-az", "Hereford, AZ", "Hereford, AZ", "Huachuca & San Pedro corridor", 31.321, -110.139, ["san-pedro", "ramsey-near"]],
    [
      "ramsey-canyon-hereford-az",
      "Ramsey Canyon / Hereford bench",
      "Hereford, AZ",
      "Huachuca & San Pedro corridor",
      31.454,
      -110.305,
      ["ramsey", "tnc-preserve"],
    ],
    ["huachuca-city-az", "Huachuca City, AZ", "Huachuca City, AZ", "Huachuca & San Pedro corridor", 31.626, -110.334, ["bajada"]],
    ["whetstone-az", "Whetstone, AZ", "Whetstone, AZ", "Huachuca & San Pedro corridor", 31.714, -110.347, ["growth"]],
    ["palominas-az", "Palominas, AZ", "Palominas, AZ", "Huachuca & San Pedro corridor", 31.378, -110.118, ["rural"]],
    ["huachuca-foothills-az", "Huachuca foothills & canyons (SV MLS)", "Sierra Vista, AZ", "Huachuca & San Pedro corridor", 31.454, -110.305, ["coronado-nf", "listings-sv"]],
    ["fort-huachuca-area-az", "Fort Huachuca area (housing spillover)", "Sierra Vista, AZ", "Huachuca & San Pedro corridor", 31.558, -110.35, ["military"]],
    ["bisbee-az", "Bisbee, AZ", "Bisbee, AZ", "Huachuca & San Pedro corridor", 31.4489, -109.9284, ["historic", "mule-mountains"]],
    ["tombstone-az", "Tombstone, AZ", "Tombstone, AZ", "Huachuca & San Pedro corridor", 31.7129, -110.0656, ["historic"]],
    ["st-david-az", "St. David, AZ", "St. David, AZ", "Huachuca & San Pedro corridor", 31.897, -110.216, ["san-pedro"]],
    ["mccneal-az", "McNeal, AZ", "McNeal, AZ", "Huachuca & San Pedro corridor", 31.528, -109.751, ["rural"]],
    ["pearce-az", "Pearce, AZ", "Pearce, AZ", "Huachuca & San Pedro corridor", 31.9249, -109.7304, ["sun-sites"]],
    ["pirtleville-az", "Pirtleville, AZ", "Pirtleville, AZ", "Huachuca & San Pedro corridor", 31.357, -109.565, ["douglas-area"]],
  ].map(([id, label, q, rg, la, ln, tg]) => A(id, label, q, rg, la, ln, tg, "")),

  // Southeast / Sky Islands (Graham / Greenlee / Pinal mining belt, etc.)
  ...[
    ["safford-az", "Safford, AZ", "Safford, AZ", "Southeast Arizona — Sky Islands", 32.8339, -109.7076, []],
    ["thatcher-az", "Thatcher, AZ", "Thatcher, AZ", "Southeast Arizona — Sky Islands", 32.8339, -109.7597, []],
    ["clifton-az", "Clifton, AZ", "Clifton, AZ", "Southeast Arizona — Sky Islands", 33.051, -109.2961, ["mining"]],
    ["morenci-az", "Morenci, AZ", "Morenci, AZ", "Southeast Arizona — Sky Islands", 33.051, -109.327, ["mining"]],
    ["globe-az", "Globe, AZ", "Globe, AZ", "Southeast Arizona — Sky Islands", 33.3942, -110.7865, ["mining"]],
    ["miami-az", "Miami, AZ", "Miami, AZ", "Southeast Arizona — Sky Islands", 33.3992, -110.8707, []],
    ["superior-az", "Superior, AZ", "Superior, AZ", "Southeast Arizona — Sky Islands", 33.2939, -111.0962, []],
    ["florence-az", "Florence, AZ", "Florence, AZ", "Southeast Arizona — Sky Islands", 33.0314, -111.3845, []],
    ["coolidge-az", "Coolidge, AZ", "Coolidge, AZ", "Southeast Arizona — Sky Islands", 32.9778, -111.5172, []],
    ["casa-grande-az", "Casa Grande, AZ", "Casa Grande, AZ", "Southeast Arizona — Sky Islands", 32.8795, -111.7573, []],
  ].map(([id, label, q, rg, la, ln, tg]) => A(id, label, q, rg, la, ln, tg, "")),

  // Central / High Country
  ...[
    ["prescott-az", "Prescott, AZ", "Prescott, AZ", "Central / High Country", 34.54, -112.4685, ["pines"]],
    ["prescott-valley-az", "Prescott Valley, AZ", "Prescott Valley, AZ", "Central / High Country", 34.61, -112.3157, []],
    ["chino-valley-az", "Chino Valley, AZ", "Chino Valley, AZ", "Central / High Country", 34.7575, -112.4538, []],
    ["dewey-humboldt-az", "Dewey-Humboldt, AZ", "Dewey-Humboldt, AZ", "Central / High Country", 34.53, -112.2422, []],
    ["mayer-az", "Mayer, AZ", "Mayer, AZ", "Central / High Country", 34.3978, -112.2362, []],
    ["cordes-lakes-az", "Cordes Lakes, AZ", "Cordes Lakes, AZ", "Central / High Country", 34.3088, -112.1034, []],
    ["sedona-az", "Sedona, AZ", "Sedona, AZ", "Central / High Country", 34.8697, -111.761, ["red-rocks"]],
    ["cottonwood-az", "Cottonwood, AZ", "Cottonwood, AZ", "Central / High Country", 34.7392, -112.0098, []],
    ["camp-verde-az", "Camp Verde, AZ", "Camp Verde, AZ", "Central / High Country", 34.5636, -111.8543, []],
    ["clarkdale-az", "Clarkdale, AZ", "Clarkdale, AZ", "Central / High Country", 34.7711, -112.0579, []],
    ["jerome-az", "Jerome, AZ", "Jerome, AZ", "Central / High Country", 34.7499, -112.1138, ["historic"]],
    ["payson-az", "Payson, AZ", "Payson, AZ", "Central / High Country", 34.2308, -111.3251, ["pines"]],
    ["star-valley-az", "Star Valley, AZ", "Star Valley, AZ", "Central / High Country", 34.2931, -111.2585, []],
    ["pine-az", "Pine, AZ", "Pine, AZ", "Central / High Country", 34.3844, -111.4551, []],
    ["strawberry-az", "Strawberry, AZ", "Strawberry, AZ", "Central / High Country", 34.4078, -111.5, []],
    ["flagstaff-az", "Flagstaff, AZ", "Flagstaff, AZ", "Central / High Country", 35.1983, -111.6513, ["mountain", "snow"]],
    ["williams-az", "Williams, AZ", "Williams, AZ", "Central / High Country", 35.2492, -112.191, ["route-66"]],
    ["winslow-az", "Winslow, AZ", "Winslow, AZ", "Central / High Country", 35.0242, -110.6974, ["route-66"]],
    ["show-low-az", "Show Low, AZ", "Show Low, AZ", "Central / High Country", 34.2542, -110.0293, ["white-mountains"]],
    ["pinetop-lakeside-az", "Pinetop-Lakeside, AZ", "Pinetop-Lakeside, AZ", "Central / High Country", 34.1435, -109.9593, ["pines"]],
    ["snowflake-az", "Snowflake, AZ", "Snowflake, AZ", "Central / High Country", 34.1034, -110.0784, []],
    ["taylor-az", "Taylor, AZ", "Taylor, AZ", "Central / High Country", 34.4652, -110.0912, []],
    ["springerville-az", "Springerville, AZ", "Springerville, AZ", "Central / High Country", 34.1334, -109.2855, []],
    ["eagar-az", "Eagar, AZ", "Eagar, AZ", "Central / High Country", 34.1112, -109.2914, []],
  ].map(([id, label, q, rg, la, ln, tg]) => A(id, label, q, rg, la, ln, tg, "")),

  // West / Colorado River
  ...[
    ["yuma-az", "Yuma, AZ", "Yuma, AZ", "West Arizona / Colorado River", 32.6927, -114.6277, ["desert", "winter"]],
    ["somerton-az", "Somerton, AZ", "Somerton, AZ", "West Arizona / Colorado River", 32.5964, -114.7097, []],
    ["san-luis-az", "San Luis, AZ", "San Luis, AZ", "West Arizona / Colorado River", 32.4931, -114.7822, ["border"]],
    ["parker-az", "Parker, AZ", "Parker, AZ", "West Arizona / Colorado River", 34.15, -114.2891, ["river"]],
    ["lake-havasu-city-az", "Lake Havasu City, AZ", "Lake Havasu City, AZ", "West Arizona / Colorado River", 34.4839, -114.3225, ["lake"]],
    ["bullhead-city-az", "Bullhead City, AZ", "Bullhead City, AZ", "West Arizona / Colorado River", 35.1478, -114.5683, ["river"]],
    ["kingman-az", "Kingman, AZ", "Kingman, AZ", "West Arizona / Colorado River", 35.1894, -114.053, ["route-66"]],
    ["wickenburg-az", "Wickenburg, AZ", "Wickenburg, AZ", "West Arizona / Colorado River", 33.9686, -112.7294, ["western"]],
    ["quartzsite-az", "Quartzsite, AZ", "Quartzsite, AZ", "West Arizona / Colorado River", 33.6639, -114.2298, ["snowbirds"]],
    ["salome-az", "Salome, AZ", "Salome, AZ", "West Arizona / Colorado River", 33.7811, -113.6148, []],
  ].map(([id, label, q, rg, la, ln, tg]) => A(id, label, q, rg, la, ln, tg, "")),

  // Northwest / Grand Canyon
  ...[
    ["page-az", "Page, AZ", "Page, AZ", "Northwest / Grand Canyon", 36.9147, -111.4558, ["lake-powell"]],
    ["colorado-city-az", "Colorado City, AZ", "Colorado City, AZ", "Northwest / Grand Canyon", 36.9903, -112.9758, []],
    ["fredonia-az", "Fredonia, AZ", "Fredonia, AZ", "Northwest / Grand Canyon", 36.9737, -112.5269, ["north-rim"]],
  ].map(([id, label, q, rg, la, ln, tg]) => A(id, label, q, rg, la, ln, tg, "")),
];

function mergeByIdPreferManual(manual, bulk) {
  const m = new Map();
  for (const loc of bulk) m.set(loc.id, loc);
  for (const loc of manual) m.set(loc.id, loc);
  return [...m.values()].sort((a, b) => a.label.localeCompare(b.label));
}

/** @type {import('./helpers.js').LocationRecord[]} */
export const ARIZONA = mergeByIdPreferManual(ARIZONA_MANUAL, buildArizonaBulkLocations());
