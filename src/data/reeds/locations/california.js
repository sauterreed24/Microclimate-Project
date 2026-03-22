import { us } from "./helpers.js";
import { CALIFORNIA_EXTRA_ROWS } from "./californiaExtra.js";

const CA_REGION_PROFILE = {
  "Los Angeles & Orange County": "coastal-marine-cal",
  "San Diego & Imperial": "coastal-marine-cal",
  "Inland Empire": "inland-empire-foothill",
  "Central Coast": "coastal-marine-cal",
  "Bay Area & Peninsula": "bay-inland-mediterranean",
  "Sacramento Valley": "sacramento-thermal-valley",
  "Central Valley": "central-valley-thermal",
  "Sierra & Tahoe": "sierra-alpine-cal",
  "North State": "north-state-mixed",
};

function inferCaliforniaProfile(region, id) {
  if (id === "el-centro-ca" || id === "brawley-ca" || id === "calexico-ca") return "inland-empire-foothill";
  if (region === "Inland Empire") return "inland-empire-foothill";
  return CA_REGION_PROFILE[region] || "coastal-marine-cal";
}

const C = (id, label, q, region, lat, lng, tags, profile) =>
  us({
    id,
    label,
    q,
    state: "CA",
    region,
    lat,
    lng,
    flag: "🌴",
    tags: tags || [],
    notes: "",
    microclimateProfile: profile ?? inferCaliforniaProfile(region, id),
  });

function mergeByIdPreferFirst(primary, secondary) {
  const m = new Map();
  for (const loc of secondary) m.set(loc.id, loc);
  for (const loc of primary) m.set(loc.id, loc);
  return [...m.values()].sort((a, b) => a.label.localeCompare(b.label));
}

/** Core + extra cities — deduped by id (core wins). */
const CALIFORNIA_CORE = [
  // Greater Los Angeles & OC
  ...[
    ["los-angeles-ca", "Los Angeles, CA", "Los Angeles, CA", "Los Angeles & Orange County", 34.0522, -118.2437, ["metro"]],
    ["long-beach-ca", "Long Beach, CA", "Long Beach, CA", "Los Angeles & Orange County", 33.7701, -118.1937, []],
    ["glendale-ca", "Glendale, CA", "Glendale, CA", "Los Angeles & Orange County", 34.1425, -118.2551, []],
    ["pasadena-ca", "Pasadena, CA", "Pasadena, CA", "Los Angeles & Orange County", 34.1478, -118.1445, []],
    ["santa-monica-ca", "Santa Monica, CA", "Santa Monica, CA", "Los Angeles & Orange County", 34.0195, -118.4912, ["beach"]],
    ["torrance-ca", "Torrance, CA", "Torrance, CA", "Los Angeles & Orange County", 33.8358, -118.3406, []],
    ["burbank-ca", "Burbank, CA", "Burbank, CA", "Los Angeles & Orange County", 34.1808, -118.309, []],
    ["irvine-ca", "Irvine, CA", "Irvine, CA", "Los Angeles & Orange County", 33.6846, -117.8265, ["planned"]],
    ["anaheim-ca", "Anaheim, CA", "Anaheim, CA", "Los Angeles & Orange County", 33.8366, -117.9143, []],
    ["santa-ana-ca", "Santa Ana, CA", "Santa Ana, CA", "Los Angeles & Orange County", 33.7455, -117.8677, []],
    ["huntington-beach-ca", "Huntington Beach, CA", "Huntington Beach, CA", "Los Angeles & Orange County", 33.6595, -117.9988, ["beach"]],
    ["fullerton-ca", "Fullerton, CA", "Fullerton, CA", "Los Angeles & Orange County", 33.8704, -117.9242, []],
    ["orange-ca", "Orange, CA", "Orange, CA", "Los Angeles & Orange County", 33.7879, -117.8531, []],
    ["costa-mesa-ca", "Costa Mesa, CA", "Costa Mesa, CA", "Los Angeles & Orange County", 33.6411, -117.9187, []],
    ["thousand-oaks-ca", "Thousand Oaks, CA", "Thousand Oaks, CA", "Los Angeles & Orange County", 34.1706, -118.8376, []],
    ["simi-valley-ca", "Simi Valley, CA", "Simi Valley, CA", "Los Angeles & Orange County", 34.2694, -118.7812, []],
  ].map(([id, label, q, rg, la, ln, tg]) => C(id, label, q, rg, la, ln, tg)),

  // San Diego & Imperial
  ...[
    ["san-diego-ca", "San Diego, CA", "San Diego, CA", "San Diego & Imperial", 32.7157, -117.1611, ["metro", "coast"]],
    ["chula-vista-ca", "Chula Vista, CA", "Chula Vista, CA", "San Diego & Imperial", 32.6401, -117.0842, []],
    ["oceanside-ca", "Oceanside, CA", "Oceanside, CA", "San Diego & Imperial", 33.1959, -117.3795, ["beach"]],
    ["escondido-ca", "Escondido, CA", "Escondido, CA", "San Diego & Imperial", 33.1192, -117.0864, []],
    ["carlsbad-ca", "Carlsbad, CA", "Carlsbad, CA", "San Diego & Imperial", 33.1581, -117.3506, []],
    ["el-centro-ca", "El Centro, CA", "El Centro, CA", "San Diego & Imperial", 32.792, -115.5631, ["desert", "imperial"]],
  ].map(([id, label, q, rg, la, ln, tg]) => C(id, label, q, rg, la, ln, tg)),

  // Inland Empire
  ...[
    ["riverside-ca", "Riverside, CA", "Riverside, CA", "Inland Empire", 33.9533, -117.3962, []],
    ["san-bernardino-ca", "San Bernardino, CA", "San Bernardino, CA", "Inland Empire", 34.1083, -117.2898, []],
    ["fontana-ca", "Fontana, CA", "Fontana, CA", "Inland Empire", 34.0922, -117.435, []],
    ["moreno-valley-ca", "Moreno Valley, CA", "Moreno Valley, CA", "Inland Empire", 33.9425, -117.2297, []],
    ["rancho-cucamonga-ca", "Rancho Cucamonga, CA", "Rancho Cucamonga, CA", "Inland Empire", 34.1064, -117.5931, []],
    ["ontario-ca", "Ontario, CA", "Ontario, CA", "Inland Empire", 34.0633, -117.6509, []],
    ["corona-ca", "Corona, CA", "Corona, CA", "Inland Empire", 33.8753, -117.5664, []],
    ["murrieta-ca", "Murrieta, CA", "Murrieta, CA", "Inland Empire", 33.5539, -117.2139, []],
    ["temecula-ca", "Temecula, CA", "Temecula, CA", "Inland Empire", 33.4936, -117.1484, ["wine"]],
    ["palm-springs-ca", "Palm Springs, CA", "Palm Springs, CA", "Inland Empire", 33.8303, -116.5453, ["desert"]],
  ].map(([id, label, q, rg, la, ln, tg]) => C(id, label, q, rg, la, ln, tg)),

  // Central Coast
  ...[
    ["ventura-ca", "Ventura, CA", "Ventura, CA", "Central Coast", 34.2746, -119.229, ["beach"]],
    ["oxnard-ca", "Oxnard, CA", "Oxnard, CA", "Central Coast", 34.1975, -119.1771, []],
    ["santa-barbara-ca", "Santa Barbara, CA", "Santa Barbara, CA", "Central Coast", 34.4208, -119.6982, ["coast"]],
    ["san-luis-obispo-ca", "San Luis Obispo, CA", "San Luis Obispo, CA", "Central Coast", 35.2828, -120.6596, []],
    ["paso-robles-ca", "Paso Robles, CA", "Paso Robles, CA", "Central Coast", 35.6268, -120.691, ["wine"]],
    ["salinas-ca", "Salinas, CA", "Salinas, CA", "Central Coast", 36.6777, -121.6555, ["ag"]],
    ["monterey-ca", "Monterey, CA", "Monterey, CA", "Central Coast", 36.6002, -121.8947, []],
  ].map(([id, label, q, rg, la, ln, tg]) => C(id, label, q, rg, la, ln, tg)),

  // Bay Area & Peninsula
  ...[
    ["san-francisco-ca", "San Francisco, CA", "San Francisco, CA", "Bay Area & Peninsula", 37.7749, -122.4194, ["metro"]],
    ["san-jose-ca", "San Jose, CA", "San Jose, CA", "Bay Area & Peninsula", 37.3382, -121.8863, ["tech"]],
    ["oakland-ca", "Oakland, CA", "Oakland, CA", "Bay Area & Peninsula", 37.8044, -122.2712, []],
    ["fremont-ca", "Fremont, CA", "Fremont, CA", "Bay Area & Peninsula", 37.5485, -121.9886, []],
    ["hayward-ca", "Hayward, CA", "Hayward, CA", "Bay Area & Peninsula", 37.6688, -122.0808, []],
    ["sunnyvale-ca", "Sunnyvale, CA", "Sunnyvale, CA", "Bay Area & Peninsula", 37.3688, -122.0363, []],
    ["santa-rosa-ca", "Santa Rosa, CA", "Santa Rosa, CA", "Bay Area & Peninsula", 38.4404, -122.7144, ["wine"]],
    ["concord-ca", "Concord, CA", "Concord, CA", "Bay Area & Peninsula", 37.978, -122.0311, []],
    ["berkeley-ca", "Berkeley, CA", "Berkeley, CA", "Bay Area & Peninsula", 37.8715, -122.273, []],
    ["palo-alto-ca", "Palo Alto, CA", "Palo Alto, CA", "Bay Area & Peninsula", 37.4419, -122.143, []],
    ["redwood-city-ca", "Redwood City, CA", "Redwood City, CA", "Bay Area & Peninsula", 37.4852, -122.2364, []],
    ["walnut-creek-ca", "Walnut Creek, CA", "Walnut Creek, CA", "Bay Area & Peninsula", 37.9101, -122.0652, []],
    ["napa-ca", "Napa, CA", "Napa, CA", "Bay Area & Peninsula", 38.2975, -122.2869, ["wine"]],
  ].map(([id, label, q, rg, la, ln, tg]) => C(id, label, q, rg, la, ln, tg)),

  // Sacramento Valley
  ...[
    ["sacramento-ca", "Sacramento, CA", "Sacramento, CA", "Sacramento Valley", 38.5816, -121.4944, ["capital"]],
    ["roseville-ca", "Roseville, CA", "Roseville, CA", "Sacramento Valley", 38.7521, -121.288, []],
    ["elk-grove-ca", "Elk Grove, CA", "Elk Grove, CA", "Sacramento Valley", 38.4088, -121.3716, []],
    ["davis-ca", "Davis, CA", "Davis, CA", "Sacramento Valley", 38.5449, -121.7405, ["uc"]],
    ["folsom-ca", "Folsom, CA", "Folsom, CA", "Sacramento Valley", 38.6779, -121.1761, []],
  ].map(([id, label, q, rg, la, ln, tg]) => C(id, label, q, rg, la, ln, tg)),

  // Central Valley
  ...[
    ["fresno-ca", "Fresno, CA", "Fresno, CA", "Central Valley", 36.7378, -119.7877, []],
    ["bakersfield-ca", "Bakersfield, CA", "Bakersfield, CA", "Central Valley", 35.3733, -119.0187, ["oil"]],
    ["stockton-ca", "Stockton, CA", "Stockton, CA", "Central Valley", 37.9577, -121.2908, []],
    ["modesto-ca", "Modesto, CA", "Modesto, CA", "Central Valley", 37.6391, -120.9969, []],
    ["visalia-ca", "Visalia, CA", "Visalia, CA", "Central Valley", 36.3302, -119.2921, []],
    ["merced-ca", "Merced, CA", "Merced, CA", "Central Valley", 37.3022, -120.483, ["uc"]],
  ].map(([id, label, q, rg, la, ln, tg]) => C(id, label, q, rg, la, ln, tg)),

  // Sierra / Tahoe
  ...[
    ["south-lake-tahoe-ca", "South Lake Tahoe, CA", "South Lake Tahoe, CA", "Sierra & Tahoe", 38.9399, -119.9772, ["ski"]],
    ["truckee-ca", "Truckee, CA", "Truckee, CA", "Sierra & Tahoe", 39.3279, -120.1833, ["ski"]],
    ["yosemite-valley-ca", "Yosemite Valley, CA", "Yosemite Valley, CA", "Sierra & Tahoe", 37.7456, -119.5936, ["park"]],
  ].map(([id, label, q, rg, la, ln, tg]) => C(id, label, q, rg, la, ln, tg)),

  // Far North & Shasta
  ...[
    ["redding-ca", "Redding, CA", "Redding, CA", "North State", 40.5865, -122.3917, []],
    ["eureka-ca", "Eureka, CA", "Eureka, CA", "North State", 40.8021, -124.1637, ["coast"]],
  ].map(([id, label, q, rg, la, ln, tg]) => C(id, label, q, rg, la, ln, tg)),
];

const CALIFORNIA_EXTRA = CALIFORNIA_EXTRA_ROWS.map(([id, label, q, rg, la, ln]) => C(id, label, q, rg, la, ln, []));

export const CALIFORNIA = mergeByIdPreferFirst(CALIFORNIA_CORE, CALIFORNIA_EXTRA);
