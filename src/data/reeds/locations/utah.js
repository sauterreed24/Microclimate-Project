import { us } from "./helpers.js";

const U = (id, label, q, region, lat, lng, tags) =>
  us({ id, label, q, state: "UT", region, lat, lng, flag: "⛰️", tags: tags || [], notes: "" });

export const UTAH = [
  U("st-george-ut", "St. George, UT", "St. George, UT", "Utah", 37.0965, -113.5684, ["red-rock"]),
  U("washington-ut", "Washington, UT", "Washington, UT", "Utah", 37.1306, -113.5084, []),
  U("hurricane-ut", "Hurricane, UT", "Hurricane, UT", "Utah", 37.1753, -113.2899, []),
  U("la-verkin-ut", "La Verkin, UT", "La Verkin, UT", "Utah", 37.2011, -113.2697, []),
  U("springdale-ut", "Springdale, UT", "Springdale, UT", "Utah", 37.1889, -113.0044, ["zion"]),
  U("kanab-ut", "Kanab, UT", "Kanab, UT", "Utah", 37.0475, -112.5263, ["gateway"]),
  U("cedar-city-ut", "Cedar City, UT", "Cedar City, UT", "Utah", 37.6774, -113.0619, []),
  U("parowan-ut", "Parowan, UT", "Parowan, UT", "Utah", 37.8422, -112.833, []),
  U("richfield-ut", "Richfield, UT", "Richfield, UT", "Utah", 38.7725, -112.0841, []),
  U("moab-ut", "Moab, UT", "Moab, UT", "Utah", 38.5733, -109.5498, ["arches"]),
  U("monticello-ut", "Monticello, UT", "Monticello, UT", "Utah", 37.8714, -109.3429, []),
  U("blanding-ut", "Blanding, UT", "Blanding, UT", "Utah", 37.6243, -109.4799, []),
  U("price-ut", "Price, UT", "Price, UT", "Utah", 39.5994, -110.8107, []),
  U("provo-ut", "Provo, UT", "Provo, UT", "Utah", 40.2338, -111.6585, ["byu"]),
  U("orem-ut", "Orem, UT", "Orem, UT", "Utah", 40.2969, -111.6946, []),
  U("salt-lake-city-ut", "Salt Lake City, UT", "Salt Lake City, UT", "Utah", 40.7608, -111.891, ["capital"]),
  U("ogden-ut", "Ogden, UT", "Ogden, UT", "Utah", 41.223, -111.9738, []),
];
