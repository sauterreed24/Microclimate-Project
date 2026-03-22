/**
 * Cross-state microclimate “territory” profiles — browse places by similar climate mechanics
 * before (or alongside) picking a specific Zillow search center.
 */
export const MICROCLIMATE_PROFILE_ORDER = [
  "hot-desert-basin",
  "sonoran-sun-corridor",
  "sky-island-madrean",
  "pinal-thermal-basin",
  "colorado-river-low-desert",
  "verde-mogollon-transition",
  "mogollon-pine-country",
  "colorado-plateau-high",
  "coastal-marine-cal",
  "bay-inland-mediterranean",
  "sacramento-thermal-valley",
  "central-valley-thermal",
  "inland-empire-foothill",
  "sierra-alpine-cal",
  "north-state-mixed",
  "nm-rio-grande-arid",
  "nm-chihuahuan-basin",
  "nm-high-plains",
  "nm-northwest-plateau",
];

/** @type {Record<string, { title: string; blurb: string; emoji: string }>} */
export const MICROCLIMATE_PROFILE_META = {
  "hot-desert-basin": {
    emoji: "☀️",
    title: "Hot desert basin & UHI",
    blurb:
      "Intense solar gain, mild winters, urban heat islands on alluvial floors — Salt River Valley, lower Imperial, similar thermal deserts.",
  },
  "sonoran-sun-corridor": {
    emoji: "🌵",
    title: "Sonoran sun corridor",
    blurb:
      "Santa Cruz–Rillito–upper San Pedro style mosaics: saguaros, monsoon convection, five-mountain sky islands nearby.",
  },
  "sky-island-madrean": {
    emoji: "🏔️",
    title: "Sky islands & Madrean foothills",
    blurb:
      "Sharp elevation rainfall gradients, oak–pine transitions, lightning-country summers, dark-sky pockets.",
  },
  "pinal-thermal-basin": {
    emoji: "🌡️",
    title: "Pinal & basin thermal desert",
    blurb:
      "Lower-elevation Sonoran floor between metros — ag, dust, and fast-growing exurban heat.",
  },
  "colorado-river-low-desert": {
    emoji: "🌊",
    title: "Colorado River low desert",
    blurb:
      "River AC corridors, lake effect breezes, extreme summer dry heat — Yuma to Laughlin-adjacent psychology.",
  },
  "verde-mogollon-transition": {
    emoji: "🌲",
    title: "Verde–Mogollon transition",
    blurb:
      "Pinyon–juniper and riparian cottonwood corridors — cooler nights than Phoenix, fire & flood aware.",
  },
  "mogollon-pine-country": {
    emoji: "🌲",
    title: "Mogollon pine & White Mountains",
    blurb:
      "Four-season mountain towns, snow loads, wildfire smoke seasons — not Phoenix thermal physics.",
  },
  "colorado-plateau-high": {
    emoji: "🏜️",
    title: "Colorado Plateau high steppe",
    blurb:
      "Sparse juniper–pinyon, Route 66 winds, cold snaps — gateway to canyon country.",
  },
  "coastal-marine-cal": {
    emoji: "🌫️",
    title: "California coastal marine",
    blurb:
      "June gloom, onshore flow, mild thermal range — marine layer vs inland heat just east.",
  },
  "bay-inland-mediterranean": {
    emoji: "🌁",
    title: "Bay & Peninsula mediterranean",
    blurb:
      "Fog–sun alternation, bay moderation, Diablo winds — microclimates block-by-block.",
  },
  "sacramento-thermal-valley": {
    emoji: "🌾",
    title: "Sacramento Valley thermal",
    blurb:
      "Hot dry summers, tule fog winters, Delta breeze battles — Central Valley north pocket.",
  },
  "central-valley-thermal": {
    emoji: "🍇",
    title: "San Joaquin thermal belt",
    blurb:
      "Agricultural haze, extreme summer heat islands, cool winter tule — irrigation shapes humidity.",
  },
  "inland-empire-foothill": {
    emoji: "⛰️",
    title: "Inland Empire & transverse foothills",
    blurb:
      "Santa Ana seasons, chaparral fire ecology, desert gateway — Palm Springs to Riverside heat.",
  },
  "sierra-alpine-cal": {
    emoji: "❄️",
    title: "Sierra & alpine",
    blurb:
      "Snow water, avalanche terrain, smoke from western fires — elevation is everything.",
  },
  "north-state-mixed": {
    emoji: "🌲",
    title: "North State mixed",
    blurb:
      "Coast redwood vs interior heat — Klamath fog vs Shasta rain shadow.",
  },
  "nm-rio-grande-arid": {
    emoji: "🎈",
    title: "Middle Rio Grande arid mile-high",
    blurb:
      "Bosque cottonwood cooling, Sandia shadow, spring dust — balloon & monsoon drama.",
  },
  "nm-chihuahuan-basin": {
    emoji: "🌶️",
    title: "Chihuahuan basin & border ranges",
    blurb:
      "Organ uplift, pecan humidity, White Sands gypsum glare — NM south thermal personality.",
  },
  "nm-high-plains": {
    emoji: "🌾",
    title: "High Plains & Llano Estacado edge",
    blurb:
      "Wind, hail, continental cold snaps — fewer saguaros, more spring supercells.",
  },
  "nm-northwest-plateau": {
    emoji: "🏜️",
    title: "NW NM plateau & Four Corners",
    blurb:
      "Sage, sandstone, coal & oil country — cold desert nights, sparse monsoon.",
  },
};

export function getMicroclimateMeta(profileId) {
  return MICROCLIMATE_PROFILE_META[profileId] ?? {
    emoji: "📍",
    title: profileId || "Other",
    blurb: "Regional search center.",
  };
}
