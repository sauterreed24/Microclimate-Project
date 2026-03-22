import { ARIZONA } from "./arizona.js";
import { CALIFORNIA } from "./california.js";
import { NEW_MEXICO } from "./newmexico.js";

/** Only AZ, CA, NM — Zillow-backed US markets */
export const ALL_LOCATIONS = [...ARIZONA, ...CALIFORNIA, ...NEW_MEXICO];

const byId = new Map(ALL_LOCATIONS.map((l) => [l.id, l]));

export function getLocationById(id) {
  return byId.get(id) ?? null;
}

/** Default search center when restoring bad saved IDs */
export const DEFAULT_LOCATION_ID = "phoenix-az";

/** Collapsible region groups for sidebar */
export const REGION_GROUPS = [
  {
    key: "az-phx",
    title: "🌵 Arizona — Greater Phoenix",
    pinned: true,
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
    key: "ca-la",
    title: "🌴 California — Los Angeles & Orange County",
    locations: CALIFORNIA.filter((l) => l.region === "Los Angeles & Orange County"),
  },
  {
    key: "ca-sd",
    title: "🌴 California — San Diego & Imperial",
    locations: CALIFORNIA.filter((l) => l.region === "San Diego & Imperial"),
  },
  {
    key: "ca-ie",
    title: "🌴 California — Inland Empire",
    locations: CALIFORNIA.filter((l) => l.region === "Inland Empire"),
  },
  {
    key: "ca-cc",
    title: "🌴 California — Central Coast",
    locations: CALIFORNIA.filter((l) => l.region === "Central Coast"),
  },
  {
    key: "ca-bay",
    title: "🌴 California — Bay Area & Peninsula",
    locations: CALIFORNIA.filter((l) => l.region === "Bay Area & Peninsula"),
  },
  {
    key: "ca-sac",
    title: "🌴 California — Sacramento Valley",
    locations: CALIFORNIA.filter((l) => l.region === "Sacramento Valley"),
  },
  {
    key: "ca-cv",
    title: "🌴 California — Central Valley",
    locations: CALIFORNIA.filter((l) => l.region === "Central Valley"),
  },
  {
    key: "ca-sierra",
    title: "🌴 California — Sierra & Tahoe",
    locations: CALIFORNIA.filter((l) => l.region === "Sierra & Tahoe"),
  },
  {
    key: "ca-north",
    title: "🌴 California — North State",
    locations: CALIFORNIA.filter((l) => l.region === "North State"),
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
].filter((g) => g.locations.length > 0);
