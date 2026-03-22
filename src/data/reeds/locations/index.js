import { HOME_BASE } from "./home.js";
import { ARIZONA } from "./arizona.js";
import { NEW_MEXICO } from "./newmexico.js";
import { NEVADA } from "./nevada.js";
import { COLORADO } from "./colorado.js";
import { UTAH } from "./utah.js";
import { WEST_TEXAS } from "./texas.js";
import { SONORA_MEXICO } from "./mexico.js";

/** @type {import('./helpers.js').LocationRecord[]} */
export const ALL_LOCATIONS = [
  ...HOME_BASE,
  ...ARIZONA,
  ...NEW_MEXICO,
  ...NEVADA,
  ...COLORADO,
  ...UTAH,
  ...WEST_TEXAS,
  ...SONORA_MEXICO,
];

const byId = new Map(ALL_LOCATIONS.map((l) => [l.id, l]));

export function getLocationById(id) {
  return byId.get(id) ?? null;
}

/** Collapsible region groups for sidebar */
export const REGION_GROUPS = [
  {
    key: "home-base",
    title: "📍 Home Base",
    pinned: true,
    locations: HOME_BASE,
  },
  {
    key: "az-phx",
    title: "🌵 Arizona — Greater Phoenix",
    locations: ARIZONA.filter((l) => l.region === "Greater Phoenix Metro"),
  },
  {
    key: "az-tucson",
    title: "🌵 Arizona — Tucson & South",
    locations: ARIZONA.filter((l) => l.region === "Tucson Metro & South"),
  },
  {
    key: "az-se",
    title: "🌵 Arizona — Southeast / Sky Islands",
    locations: ARIZONA.filter((l) => l.region === "Southeast Arizona — Sky Islands"),
  },
  {
    key: "az-central",
    title: "🌵 Arizona — Central / High Country",
    locations: ARIZONA.filter((l) => l.region === "Central / High Country"),
  },
  {
    key: "az-west",
    title: "🌵 Arizona — West / Colorado River",
    locations: ARIZONA.filter((l) => l.region === "West Arizona / Colorado River"),
  },
  {
    key: "az-nw",
    title: "🌵 Arizona — Northwest / Grand Canyon",
    locations: ARIZONA.filter((l) => l.region === "Northwest / Grand Canyon"),
  },
  {
    key: "nm-abq",
    title: "🏜️ New Mexico — Albuquerque Metro",
    locations: NEW_MEXICO.filter((l) => l.region === "Albuquerque Metro"),
  },
  {
    key: "nm-sf",
    title: "🏜️ New Mexico — Santa Fe / North",
    locations: NEW_MEXICO.filter((l) => l.region === "Santa Fe / North"),
  },
  {
    key: "nm-south",
    title: "🏜️ New Mexico — South",
    locations: NEW_MEXICO.filter((l) => l.region === "South New Mexico"),
  },
  {
    key: "nm-east",
    title: "🏜️ New Mexico — East / High Plains",
    locations: NEW_MEXICO.filter((l) => l.region === "East / High Plains"),
  },
  {
    key: "nm-nw",
    title: "🏜️ New Mexico — Northwest",
    locations: NEW_MEXICO.filter((l) => l.region === "Northwest NM"),
  },
  {
    key: "nv",
    title: "🎰 Nevada",
    locations: NEVADA,
  },
  {
    key: "co-front",
    title: "🏔️ Colorado — Front Range",
    locations: COLORADO.filter((l) => l.region === "Front Range"),
  },
  {
    key: "co-cos",
    title: "🏔️ Colorado — Colorado Springs Area",
    locations: COLORADO.filter((l) => l.region === "Colorado Springs Area"),
  },
  {
    key: "co-sw",
    title: "🏔️ Colorado — Southwest / San Juans",
    locations: COLORADO.filter((l) => l.region === "Southwest / San Juans"),
  },
  {
    key: "co-mt",
    title: "🏔️ Colorado — Mountain Towns",
    locations: COLORADO.filter((l) => l.region === "Mountain Towns"),
  },
  {
    key: "ut",
    title: "⛰️ Utah",
    locations: UTAH,
  },
  {
    key: "tx-west",
    title: "🤠 West Texas",
    locations: WEST_TEXAS,
  },
  {
    key: "mx-sonora",
    title: "🇲🇽 Sonora — Free Zone (no Zillow)",
    locations: SONORA_MEXICO,
  },
].filter((g) => g.locations.length > 0);
