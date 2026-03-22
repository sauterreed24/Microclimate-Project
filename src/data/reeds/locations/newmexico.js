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

export const NEW_MEXICO = mergeByIdPreferFirst(NEW_MEXICO_CORE, NEW_MEXICO_EXTRA);
