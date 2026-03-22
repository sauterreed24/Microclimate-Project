import { us } from "./helpers.js";

export const HOME_BASE = [
  us({
    id: "greenwood-in-home",
    label: "Greenwood, IN 46143",
    q: "Greenwood, IN 46143",
    state: "IN",
    region: "Home Base",
    lat: 39.6137,
    lng: -86.1067,
    flag: "⭐",
    tags: ["home", "pinned", "indiana"],
    notes: "Primary home base — pinned at top.",
    isHome: true,
    homeStar: true,
  }),
  us({
    id: "indianapolis-in-metro",
    label: "Indianapolis, IN",
    q: "Indianapolis, IN",
    state: "IN",
    region: "Home Base",
    lat: 39.7684,
    lng: -86.1581,
    flag: "🏙️",
    tags: ["metro", "indiana", "reference"],
    notes: "Indy metro reference for comps and travel radius.",
  }),
];
