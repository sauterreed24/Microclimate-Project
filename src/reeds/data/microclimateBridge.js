/**
 * Maps Reed location chips → Saguaro Atlas / arizonaSonoraPack microclimate cards (same source as the legacy app).
 */
import { arizonaSonoraPackLocations, arizonaSonoraRiskPatch } from "../../data/arizonaSonoraPack.js";

const locById = new Map(arizonaSonoraPackLocations.map((l) => [l.id, l]));

/** Reed `locationId` → microclimate numeric `id` from the pack */
const REED_TO_MC = {
  "huachuca-san-pedro-corridor-wide-az": 910,
  "sierra-vista-az": 910,
  "hereford-az": 911,
  "ramsey-canyon-hereford-az": 911,
  "huachuca-city-az": 915,
  "whetstone-az": 910,
  "palominas-az": 911,
  "huachuca-foothills-az": 929,
  "fort-huachuca-area-az": 910,
  "bisbee-az": 901,
  "tombstone-az": 916,
  "st-david-az": 910,
  "mccneal-az": 910,
  "pearce-az": 910,
  "pirtleville-az": 918,
};

/**
 * @returns {{ loc: object, rd: object } | null}
 */
export function getMicroclimateBundle(reedLocationId) {
  const mcId = REED_TO_MC[reedLocationId];
  if (!mcId) return null;
  const loc = locById.get(mcId);
  if (!loc) return null;
  const rd = arizonaSonoraRiskPatch[mcId] || {};
  return { loc, rd, mcId };
}
