import { MICROCLIMATE_PROFILE_ORDER } from "../../data/reeds/locations/microclimateProfiles.js";

/**
 * One representative hub per US microclimate profile (centroid of all markets in that profile).
 */
export function computeClimateHubs(usLocations) {
  const by = new Map();
  for (const k of MICROCLIMATE_PROFILE_ORDER) by.set(k, []);
  for (const loc of usLocations) {
    const prof = loc.microclimateProfile || "hot-desert-basin";
    if (!by.has(prof)) by.set(prof, []);
    by.get(prof).push(loc);
  }
  const hubs = [];
  for (const profile of MICROCLIMATE_PROFILE_ORDER) {
    const pts = by.get(profile) || [];
    if (pts.length === 0) continue;
    const lat = pts.reduce((s, p) => s + p.lat, 0) / pts.length;
    const lng = pts.reduce((s, p) => s + p.lng, 0) / pts.length;
    hubs.push({ profile, lat, lng, count: pts.length });
  }
  return hubs;
}

/** Bounding box for AZ + CA + NM — map opens framed on the three-state focus */
export const SOUTHWEST_US_BOUNDS = [
  [31.0, -124.6],
  [42.2, -103.8],
];
