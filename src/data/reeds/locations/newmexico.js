import { us } from "./helpers.js";
import { NEW_MEXICO_EXTRA_ROWS } from "./newmexicoExtra.js";

function inferNewMexicoProfile(region, id) {
  if (region === "Albuquerque Metro") return "nm-rio-grande-arid";
  if (region === "Santa Fe / North") {
    if (/taos|angel-fire|cimarron|raton|mora|chama/i.test(id)) return "nm-northwest-plateau";
    return "nm-rio-grande-arid";
  }
  if (region === "South New Mexico") {
    if (/silver-city|bayard|ruidoso|cloudcroft|magdalena/i.test(id)) return "sky-island-madrean";
    return "nm-chihuahuan-basin";
  }
  if (region === "East / High Plains") return "nm-high-plains";
  if (region === "Northwest NM") return "nm-northwest-plateau";
  return "nm-rio-grande-arid";
}

const N = (id, label, q, region, lat, lng, tags, notes, profile) =>
  us({
    id,
    label,
    q,
    state: "NM",
    region,
    lat,
    lng,
    flag: "🏜️",
    tags: tags || [],
    notes: notes || "",
    microclimateProfile: profile ?? inferNewMexicoProfile(region, id),
  });

function mergeByIdPreferFirst(primary, secondary) {
  const m = new Map();
  for (const loc of secondary) m.set(loc.id, loc);
  for (const loc of primary) m.set(loc.id, loc);
  return [...m.values()].sort((a, b) => a.label.localeCompare(b.label));
}

const NEW_MEXICO_CORE = [
  ...[
    ["albuquerque-nm", "Albuquerque, NM", "Albuquerque, NM", "Albuquerque Metro", 35.0844, -106.6504, ["metro"]],
    ["rio-rancho-nm", "Rio Rancho, NM", "Rio Rancho, NM", "Albuquerque Metro", 35.2328, -106.663, []],
    ["bernalillo-nm", "Bernalillo, NM", "Bernalillo, NM", "Albuquerque Metro", 35.3001, -106.5514, []],
    ["corrales-nm", "Corrales, NM", "Corrales, NM", "Albuquerque Metro", 35.2378, -106.6061, []],
    ["los-lunas-nm", "Los Lunas, NM", "Los Lunas, NM", "Albuquerque Metro", 34.8061, -106.7354, []],
    ["belen-nm", "Belen, NM", "Belen, NM", "Albuquerque Metro", 34.6628, -106.7764, []],
    ["bosque-farms-nm", "Bosque Farms, NM", "Bosque Farms, NM", "Albuquerque Metro", 34.8548, -106.7053, []],
    ["placitas-nm", "Placitas, NM", "Placitas, NM", "Albuquerque Metro", 35.3392, -106.4114, []],
    ["edgewood-nm", "Edgewood, NM", "Edgewood, NM", "Albuquerque Metro", 35.0614, -106.1914, []],
    ["tijeras-nm", "Tijeras, NM", "Tijeras, NM", "Albuquerque Metro", 35.0887, -106.3775, []],
    ["cedar-crest-nm", "Cedar Crest, NM", "Cedar Crest, NM", "Albuquerque Metro", 35.1075, -106.3725, []],
    ["moriarty-nm", "Moriarty, NM", "Moriarty, NM", "Albuquerque Metro", 34.9901, -106.0492, []],
  ].map(([id, label, q, rg, la, ln, tg]) => N(id, label, q, rg, la, ln, tg, "")),

  ...[
    ["santa-fe-nm", "Santa Fe, NM", "Santa Fe, NM", "Santa Fe / North", 35.687, -105.9378, ["capital", "arts"]],
    ["espanola-nm", "Espanola, NM", "Espanola, NM", "Santa Fe / North", 36.0056, -106.0644, []],
    ["los-alamos-nm", "Los Alamos, NM", "Los Alamos, NM", "Santa Fe / North", 35.8801, -106.3031, []],
    ["pojoaque-nm", "Pojoaque, NM", "Pojoaque, NM", "Santa Fe / North", 35.8928, -106.0101, []],
    ["taos-nm", "Taos, NM", "Taos, NM", "Santa Fe / North", 36.4072, -105.5731, ["ski", "arts"]],
    ["angel-fire-nm", "Angel Fire, NM", "Angel Fire, NM", "Santa Fe / North", 36.3931, -105.285, ["ski"]],
    ["raton-nm", "Raton, NM", "Raton, NM", "Santa Fe / North", 36.9034, -104.4392, []],
    ["cimarron-nm", "Cimarron, NM", "Cimarron, NM", "Santa Fe / North", 36.5109, -104.9158, []],
    ["mora-nm", "Mora, NM", "Mora, NM", "Santa Fe / North", 35.9742, -105.3756, []],
    ["pecos-nm", "Pecos, NM", "Pecos, NM", "Santa Fe / North", 35.5748, -105.6756, []],
    ["glorieta-nm", "Glorieta, NM", "Glorieta, NM", "Santa Fe / North", 35.5801, -105.7614, []],
  ].map(([id, label, q, rg, la, ln, tg]) => N(id, label, q, rg, la, ln, tg, "")),

  ...[
    ["las-cruces-nm", "Las Cruces, NM", "Las Cruces, NM", "South New Mexico", 32.3199, -106.7637, ["mesilla-valley"]],
    ["mesilla-nm", "Mesilla, NM", "Mesilla, NM", "South New Mexico", 32.2698, -106.8008, ["historic"]],
    ["sunland-park-nm", "Sunland Park, NM", "Sunland Park, NM", "South New Mexico", 31.7965, -106.5799, ["border"]],
    ["anthony-nm", "Anthony, NM", "Anthony, NM", "South New Mexico", 32.0035, -106.6058, []],
    ["deming-nm", "Deming, NM", "Deming, NM", "South New Mexico", 32.2687, -107.7586, []],
    ["silver-city-nm", "Silver City, NM", "Silver City, NM", "South New Mexico", 32.7701, -108.2803, ["mining"]],
    ["bayard-nm", "Bayard, NM", "Bayard, NM", "South New Mexico", 32.7617, -108.1312, []],
    ["truth-or-consequences-nm", "Truth or Consequences, NM", "Truth or Consequences, NM", "South New Mexico", 33.1284, -107.2528, ["hotsprings"]],
    ["elephant-butte-nm", "Elephant Butte, NM", "Elephant Butte, NM", "South New Mexico", 33.1907, -107.2239, ["lake"]],
    ["alamogordo-nm", "Alamogordo, NM", "Alamogordo, NM", "South New Mexico", 32.8995, -105.9603, ["white-sands"]],
    ["ruidoso-nm", "Ruidoso, NM", "Ruidoso, NM", "South New Mexico", 33.3673, -105.6586, ["mountain"]],
    ["ruidoso-downs-nm", "Ruidoso Downs, NM", "Ruidoso Downs, NM", "South New Mexico", 33.334, -105.6048, []],
    ["cloudcroft-nm", "Cloudcroft, NM", "Cloudcroft, NM", "South New Mexico", 32.9574, -105.7429, ["pines"]],
    ["tularosa-nm", "Tularosa, NM", "Tularosa, NM", "South New Mexico", 33.0738, -106.0186, []],
    ["carrizozo-nm", "Carrizozo, NM", "Carrizozo, NM", "South New Mexico", 33.6415, -105.8772, []],
    ["corona-nm", "Corona, NM", "Corona, NM", "South New Mexico", 34.2503, -105.5967, []],
    ["roswell-nm", "Roswell, NM", "Roswell, NM", "South New Mexico", 33.3943, -104.523, ["ufo"]],
    ["artesia-nm", "Artesia, NM", "Artesia, NM", "South New Mexico", 32.8425, -104.403, []],
    ["carlsbad-nm", "Carlsbad, NM", "Carlsbad, NM", "South New Mexico", 32.4207, -104.2288, ["caverns"]],
    ["hobbs-nm", "Hobbs, NM", "Hobbs, NM", "South New Mexico", 32.7026, -103.136, ["oil"]],
    ["lovington-nm", "Lovington, NM", "Lovington, NM", "South New Mexico", 32.944, -103.3485, []],
  ].map(([id, label, q, rg, la, ln, tg]) => N(id, label, q, rg, la, ln, tg, "")),

  ...[
    ["clovis-nm", "Clovis, NM", "Clovis, NM", "East / High Plains", 34.4048, -103.2052, []],
    ["portales-nm", "Portales, NM", "Portales, NM", "East / High Plains", 34.1862, -103.3344, []],
    ["tucumcari-nm", "Tucumcari, NM", "Tucumcari, NM", "East / High Plains", 35.1717, -103.7252, ["route-66"]],
    ["santa-rosa-nm", "Santa Rosa, NM", "Santa Rosa, NM", "East / High Plains", 34.9387, -104.6825, ["route-66"]],
    ["las-vegas-nm", "Las Vegas, NM", "Las Vegas, NM", "East / High Plains", 35.5939, -105.2239, ["historic"]],
    ["springer-nm", "Springer, NM", "Springer, NM", "East / High Plains", 36.3611, -104.595, []],
  ].map(([id, label, q, rg, la, ln, tg]) => N(id, label, q, rg, la, ln, tg, "")),

  ...[
    ["farmington-nm", "Farmington, NM", "Farmington, NM", "Northwest NM", 36.7281, -108.2187, ["four-corners"]],
    ["aztec-nm", "Aztec, NM", "Aztec, NM", "Northwest NM", 36.8222, -107.9929, []],
    ["bloomfield-nm", "Bloomfield, NM", "Bloomfield, NM", "Northwest NM", 36.7111, -107.9844, []],
    ["gallup-nm", "Gallup, NM", "Gallup, NM", "Northwest NM", 35.5281, -108.7426, ["route-66"]],
    ["grants-nm", "Grants, NM", "Grants, NM", "Northwest NM", 35.0913, -107.8549, []],
    ["zuni-nm", "Zuni, NM", "Zuni, NM", "Northwest NM", 35.0695, -108.8516, ["pueblo"]],
    ["cuba-nm", "Cuba, NM", "Cuba, NM", "Northwest NM", 36.0181, -106.9584, []],
    ["tierra-amarilla-nm", "Tierra Amarilla, NM", "Tierra Amarilla, NM", "Northwest NM", 36.7003, -106.5484, []],
  ].map(([id, label, q, rg, la, ln, tg]) => N(id, label, q, rg, la, ln, tg, "")),
];

const NEW_MEXICO_EXTRA = NEW_MEXICO_EXTRA_ROWS.map(([id, label, q, rg, la, ln]) => N(id, label, q, rg, la, ln, [], ""));

/** Buyer-research lenses: climate mechanics, water, and terrain — not legal advice. */
const NM_LENS = {
  abqCore:
    "High-desert metro near 5,000′: huge day/night temperature swings, sparse winter snow, Jul–Sep monsoon slots. Roof drainage, swamp coolers vs refrigerated air, and east-mesa wind exposure matter as much as square footage.",
  rioRancho:
    "West of the Sandías: often windier and drier than the valley floor; watch dust, caliche, and longer drives to care hubs. Great dark-sky pockets if you avoid sodium glare corridors.",
  valleyBosque:
    "Closer to the Río Grande cottonwood belt: slightly milder nights and higher humidity than mesa sites — but groundwater, septic vs sewer, and floodplain maps deserve a hard look.",
  eastMountain:
    "Cibola/Sandía east slope: cooler summers, heavier winter snow risk, and fire-evacuation awareness. Narrow roads and steep driveways affect insurance and everyday winter life.",
  santaFe:
    "7000′+ capital climate: crisp nights even in summer, real winter, and strong UV. Adobe maintenance, flat roofs, and passive-solar orientation are shopping categories here.",
  losAlamos:
    "Cool mesa-top town: short growing season, heavy snow some years, premium on efficient heat. Commute switchbacks and lab-related housing demand can move inventory fast.",
  taosSangre:
    "High valley + mountain shadowing: deep snow possible, big recreation demand. Short-term rental rules, well permits, and acequia proximity are common diligence items.",
  lasCruces:
    "Mesilla Valley sun: hotter than Albuquerque on average, milder winters, big pecan/wind/dust days. Border-adjacent parcels: check flood history along the Río Grande.",
  silverMadrean:
    "Sky-island edge: cooler summers than the low deserts, summer storms, and varied geology. Mining heritage can mean legacy waste — review environmental disclosures.",
  permian:
    "Basin oil/gas economy: employment-linked housing cycles. Water tables and truck traffic on rural roads can dominate quality-of-life tradeoffs.",
  highPlains:
    "Eastern NM High Plains: hail, wind, blizzards, and wide-open exposure. Metal roofs and rural water (well depth, quality) are core shopping questions.",
  fourCorners:
    "High-desert plateau: cold winters, hot dry Junes, localized Jul–Aug storms. Navajo Nation adjacency and tribal lands add jurisdictional homework for some commutes.",
  default:
    "New Mexico deed research: acequias, tribal/allotted land, mineral rights, and domestic well rules vary sharply by county — pair climate homework with a local title pro.",
};

/** Per-market notes (ids) — merged onto locations for sidebar + research strip. */
const NM_MARKET_NOTES = {
  "albuquerque-nm": NM_LENS.abqCore,
  "rio-rancho-nm": NM_LENS.rioRancho,
  "bernalillo-nm": NM_LENS.valleyBosque,
  "corrales-nm": "Village orchards + horse country on the west bank: higher property expectations, irrigation ditches, and floodplain nuance. Quieter nights than the core city but still ABQ-wind days.",
  "los-lunas-nm": "Valencia County growth corridor: more sun, lower elevation heat than ABQ core, and commuter distance tradeoffs. Check Volcano Cliffs area wind and rural water on ranchettes.",
  "belen-nm": "Historic rail town south of ABQ: affordable land, strong sun, and I-25 access. Rural fringe parcels: domestic wells and septic dominate total cost of ownership.",
  "bosque-farms-nm": NM_LENS.valleyBosque,
  "placitas-nm": "Foothill community between Sandía spine and plains: fire-wise landscaping is not optional; views and night skies reward the maintenance.",
  "edgewood-nm": "East plains gateway: wind, hail, and longer drives to ABQ services. Good dark-sky potential; verify well depth and propane vs natural gas.",
  "tijeras-nm": NM_LENS.eastMountain,
  "cedar-crest-nm": NM_LENS.eastMountain,
  "moriarty-nm": "High-plains crossroads: aviation culture, wind, and wide-open exposure. Cheaper acreage; water and winter road treatment are the usual gating factors.",
  "santa-fe-nm": NM_LENS.santaFe,
  "espanola-nm": "Río Grande trough: hotter summer days than Santa Fe, cold inversions in winter, strong Hispano farming heritage. Affordable pockets — diligence on flood paths and legacy industrial sites.",
  "los-alamos-nm": NM_LENS.losAlamos,
  "pojoaque-nm": "Corridor between SF and Española: commuter convenience, casino-adjacent services, and mixed elevation microclimates in a short drive.",
  "taos-nm": NM_LENS.taosSangre,
  "angel-fire-nm": "Ski/second-home economy at 8,000′+: real snow, short rental seasons, and HOAs that may restrict STRs — read covenants before falling in love.",
  "raton-nm": "Raton Pass gateway: mountain-plains blend, wind, and a smaller inventory pool. Great for I-25 logistics to Colorado; verify heating costs on older stock.",
  "cimarron-nm": "Sangre de Cristo foothill ranch country: summer afternoon storms, elk migration corridors, and rural fire response times.",
  "mora-nm": "Mountain valley agriculture: colder nights, shorter season, acequia culture. Beautiful isolation — broadband and winter access are practical filters.",
  "pecos-nm": "Gateway to the Pecos Wilderness: recreation demand, weekend traffic, and wildfire evacuation awareness on forest-edge lots.",
  "glorieta-nm": "I-25 mountain pass pocket: cooler than Santa Fe floor, wind channels, and mixed full-time vs weekend housing.",
  "las-cruces-nm": NM_LENS.lasCruces,
  "mesilla-nm": "Historic plaza town wrapped by LC growth: walkable core, higher charm premium, still Mesilla Valley sun and wind.",
  "sunland-park-nm": "Borderplex edge: verify school districts, cross-border commute patterns, and dust on windy spring days.",
  "anthony-nm": "Tri-city farm/desert blend: affordable entry, strong sun, and I-10 / border logistics.",
  "deming-nm": "Bootheel connector town: relentless summer sun, mild winters, and big-sky country. Water rights homework on any acreage.",
  "silver-city-nm": NM_LENS.silverMadrean,
  "bayard-nm": "Copper-mining district neighbor to Silver City: quieter inventory, similar sky-island storms, legacy mining disclosure awareness.",
  "truth-or-consequences-nm": "Río Grande hot-springs town: mild winters, summer heat, and a mix of retirees and remote workers. Check well quality outside city water.",
  "elephant-butte-nm": "Reservoir recreation housing: boating seasonality, short-term rental competition, and summer monsoon arroyo flash risk near washes.",
  "alamogordo-nm": "Tularosa Basin: hot dry summers, mild winters, White Sands dust on windy days. Military flyover noise is part of daily life near Holloman.",
  "ruidoso-nm": "Mountain resort town: monsoon green-up, pine beetle history in surrounding forest, STR regulation churn — read current ordinances.",
  "ruidoso-downs-nm": "Adjacent to Ruidoso racing economy: slightly lower elevation, still pines, and shared fire/evacuation planning with upstream forest health.",
  "cloudcroft-nm": "High-elevation pines: coolest summers in southern NM, real snow, and tourist-weekend traffic swings.",
  "tularosa-nm": "Basin town between Sacramento Mountains and White Sands: wind, dust, and big temperature spreads.",
  "carrizozo-nm": "Valley of Fires edge: sparse services, dark skies, and rural fire/EMS timelines — paradise with logistics homework.",
  "corona-nm": "Remote ranch country east of mountains: wide-open grazing aesthetic, wind, and deep well costs.",
  "roswell-nm": "Pecos River irrigation pockets vs surrounding scrub: summer heat, mild winters, stable small-city services. UFO tourism is real seasonal noise downtown.",
  "artesia-nm": NM_LENS.permian,
  "carlsbad-nm": "Caverns + Permian crossroads: recreation draw, oil cycles, and summer heat. Check sinkhole/ karst awareness on some rural parcels.",
  "hobbs-nm": NM_LENS.permian,
  "lovington-nm": NM_LENS.permian,
  "clovis-nm": "High Plains dairy/ag hub: wind, hail, and winter storms. Cannon AFB drives rental demand cycles.",
  "portales-nm": "University town + ag: similar Plains weather to Clovis with a younger rental skew.",
  "tucumcari-nm": "Route 66 mesa town: big sky, wind, and aquifer stress stories — verify city vs rural water on older homes.",
  "santa-rosa-nm": "Blue Hole + I-40 crossroads: summer road-trip economy, hot dry Junes, localized storm runoff in arroyos.",
  "las-vegas-nm": "Northeast plains at elevation: four-season mountain-plains mix, historic plaza housing stock, and cold winter spells.",
  "springer-nm": `High-plains ranch gateway: wind, sparse inventory, dark nights — ${NM_LENS.default}`,
  "farmington-nm": NM_LENS.fourCorners,
  "aztec-nm": "San Juan River recreation + energy-economy town: cold winter inversions possible, big summer UV. Oil/gas proximity on some rural roads.",
  "bloomfield-nm": "Retail/services node near Aztec/Farmington: commuter convenience, same plateau climate notes.",
  "gallup-nm": "High-desert trade town on I-40: wind, red-rock dust, and strong Navajo Nation commercial ties — respect jurisdictional boundaries on searches.",
  "grants-nm": "Malpais lava-country gateway: summer storms, mining legacy soils in places, and dark-sky pockets off US-40.",
  "zuni-nm": "Pueblo-adjacent community: honor tribal sovereignty on nearby land; climate similar to Gallup–Grants corridor.",
  "cuba-nm": "Sandstone-country gateway to San Pedros: cooler nights than ABQ, summer storm buildup, and tourist traffic to Chaco corridor.",
  "tierra-amarilla-nm": "Northern ranch county seat: cold winters, hay economy, and smaller inventory — verify heating fuel and road maintenance on snow days.",
  "socorro-nm": "Bosque del Apache + NM Tech town: milder winters than ABQ myth suggests, strong spring winds, Jul–Aug monsoon slots. Great birding economy; check rural ditch water rights.",
  "magdalena-nm": "West-central sky-island toe: quiet ranching + astronomy culture, summer afternoon storms, and long drives to tertiary care.",
  "hatch-nm": "Chile capital floodplain: verify FEMA maps — irrigated fields mean humidity and mosquitoes near the river; blazing sun just blocks away.",
  "lordsburg-nm": "I-10 bootheel crossroads: hottest NM summers, mild winters, and border-adjacent logistics. Water is always the story on acreage.",
  "jal-nm": NM_LENS.permian,
  "kirtland-nm": "Four Corners bedroom community: plateau winters, UV, and Farmington commute patterns — check methane/coal-bed methane disclosures on some tracts.",
  "shiprock-nm": "Sacred peak landmark region: respect Navajo Nation boundaries; dust, wind, and summer storm cells on the plateau.",
  "chama-nm": "Rocky Mountain transition: cold winters, summer greenery, vacation-home competition. Well and septic norms differ from Rio Grande cities.",
  "eunice-nm": NM_LENS.permian,
};

function attachNmNotes(loc) {
  const idNote = NM_MARKET_NOTES[loc.id];
  if (idNote) return { ...loc, notes: idNote };
  if (loc.region === "Albuquerque Metro") return { ...loc, notes: NM_LENS.abqCore };
  if (loc.region === "Santa Fe / North") return { ...loc, notes: NM_LENS.santaFe };
  if (loc.region === "South New Mexico") return { ...loc, notes: NM_LENS.lasCruces };
  if (loc.region === "East / High Plains") return { ...loc, notes: NM_LENS.highPlains };
  if (loc.region === "Northwest NM") return { ...loc, notes: NM_LENS.fourCorners };
  return { ...loc, notes: NM_LENS.default };
}

export const NEW_MEXICO = mergeByIdPreferFirst(NEW_MEXICO_CORE, NEW_MEXICO_EXTRA).map(attachNmNotes);
