import { us } from "./helpers.js";

const V = (id, label, q, region, lat, lng, tags) =>
  us({ id, label, q, state: "NV", region, lat, lng, flag: "🎰", tags: tags || [], notes: "" });

export const NEVADA = [
  V("las-vegas-nv", "Las Vegas, NV", "Las Vegas, NV", "Nevada", 36.1699, -115.1398, ["metro"]),
  V("henderson-nv", "Henderson, NV", "Henderson, NV", "Nevada", 36.0395, -114.9817, []),
  V("north-las-vegas-nv", "North Las Vegas, NV", "North Las Vegas, NV", "Nevada", 36.1989, -115.1175, []),
  V("boulder-city-nv", "Boulder City, NV", "Boulder City, NV", "Nevada", 35.9786, -114.8325, ["hoover"]),
  V("mesquite-nv", "Mesquite, NV", "Mesquite, NV", "Nevada", 36.8055, -114.0672, ["golf"]),
  V("pahrump-nv", "Pahrump, NV", "Pahrump, NV", "Nevada", 36.2083, -115.9839, []),
  V("laughlin-nv", "Laughlin, NV", "Laughlin, NV", "Nevada", 35.1677, -114.5683, ["river"]),
  V("reno-nv", "Reno, NV", "Reno, NV", "Nevada", 39.5296, -119.8138, ["truckee"]),
  V("sparks-nv", "Sparks, NV", "Sparks, NV", "Nevada", 39.5349, -119.7527, []),
  V("carson-city-nv", "Carson City, NV", "Carson City, NV", "Nevada", 39.1638, -119.7674, ["capital"]),
  V("fernley-nv", "Fernley, NV", "Fernley, NV", "Nevada", 39.608, -119.2518, []),
  V("fallon-nv", "Fallon, NV", "Fallon, NV", "Nevada", 39.4749, -118.777, []),
  V("elko-nv", "Elko, NV", "Elko, NV", "Nevada", 40.8324, -115.7631, []),
  V("winnemucca-nv", "Winnemucca, NV", "Winnemucca, NV", "Nevada", 40.973, -117.7357, []),
  V("battle-mountain-nv", "Battle Mountain, NV", "Battle Mountain, NV", "Nevada", 40.6413, -116.9329, []),
  V("ely-nv", "Ely, NV", "Ely, NV", "Nevada", 39.2474, -114.8889, []),
  V("tonopah-nv", "Tonopah, NV", "Tonopah, NV", "Nevada", 38.0672, -117.2304, []),
];
