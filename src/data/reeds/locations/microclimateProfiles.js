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

/** Map / UI: distinct hues so pins read at a glance vs monochrome basemaps */
export const MICROCLIMATE_PROFILE_STYLE = {
  "hot-desert-basin": { fill: "#f59e0b", stroke: "#b45309", glow: "rgba(245, 158, 11, 0.45)" },
  "sonoran-sun-corridor": { fill: "#10b981", stroke: "#047857", glow: "rgba(16, 185, 129, 0.4)" },
  "sky-island-madrean": { fill: "#6366f1", stroke: "#4338ca", glow: "rgba(99, 102, 241, 0.45)" },
  "pinal-thermal-basin": { fill: "#eab308", stroke: "#a16207", glow: "rgba(234, 179, 8, 0.4)" },
  "colorado-river-low-desert": { fill: "#06b6d4", stroke: "#0e7490", glow: "rgba(6, 182, 212, 0.45)" },
  "verde-mogollon-transition": { fill: "#22c55e", stroke: "#15803d", glow: "rgba(34, 197, 94, 0.4)" },
  "mogollon-pine-country": { fill: "#15803d", stroke: "#14532d", glow: "rgba(21, 128, 61, 0.45)" },
  "colorado-plateau-high": { fill: "#d97706", stroke: "#92400e", glow: "rgba(217, 119, 6, 0.4)" },
  "coastal-marine-cal": { fill: "#38bdf8", stroke: "#0369a1", glow: "rgba(56, 189, 248, 0.45)" },
  "bay-inland-mediterranean": { fill: "#818cf8", stroke: "#4f46e5", glow: "rgba(129, 140, 248, 0.4)" },
  "sacramento-thermal-valley": { fill: "#fbbf24", stroke: "#d97706", glow: "rgba(251, 191, 36, 0.4)" },
  "central-valley-thermal": { fill: "#f97316", stroke: "#c2410c", glow: "rgba(249, 115, 22, 0.45)" },
  "inland-empire-foothill": { fill: "#ef4444", stroke: "#b91c1c", glow: "rgba(239, 68, 68, 0.4)" },
  "sierra-alpine-cal": { fill: "#e2e8f0", stroke: "#64748b", glow: "rgba(148, 163, 184, 0.5)" },
  "north-state-mixed": { fill: "#14b8a6", stroke: "#0f766e", glow: "rgba(20, 184, 166, 0.4)" },
  "nm-rio-grande-arid": { fill: "#c084fc", stroke: "#7e22ce", glow: "rgba(192, 132, 252, 0.45)" },
  "nm-chihuahuan-basin": { fill: "#f472b6", stroke: "#be185d", glow: "rgba(244, 114, 182, 0.4)" },
  "nm-high-plains": { fill: "#a78bfa", stroke: "#5b21b6", glow: "rgba(167, 139, 250, 0.4)" },
  "nm-northwest-plateau": { fill: "#94a3b8", stroke: "#475569", glow: "rgba(148, 163, 184, 0.45)" },
};

export function getProfileMapStyle(profileId) {
  return (
    MICROCLIMATE_PROFILE_STYLE[profileId] ?? {
      fill: "#64748b",
      stroke: "#334155",
      glow: "rgba(100, 116, 139, 0.4)",
    }
  );
}

export function getMicroclimateMeta(profileId) {
  return MICROCLIMATE_PROFILE_META[profileId] ?? {
    emoji: "📍",
    title: profileId || "Other",
    blurb: "Regional search center.",
  };
}
