import { ARIZONA_BULK_MUNICIPALITY_ROWS } from "../../arizonaSonoraPack.js";
import { us } from "./helpers.js";
import { slugifyCityState } from "./slug.js";

/** Maps OpenWeb / pack zone keys → Reed region label + microclimate profile */
const ZONE = {
  phxMetro: { region: "Greater Phoenix Metro", profile: "hot-desert-basin" },
  tucsonCorridor: { region: "Tucson Metro & South", profile: "sonoran-sun-corridor" },
  southeastSkyIsland: { region: "Southeast Arizona — Sky Islands", profile: "sky-island-madrean" },
  copperGila: { region: "Southeast Arizona — Sky Islands", profile: "sky-island-madrean" },
  pinalSuburb: { region: "Southeast Arizona — Sky Islands", profile: "pinal-thermal-basin" },
  coloradoRiver: { region: "West Arizona / Colorado River", profile: "colorado-river-low-desert" },
  verdeTransition: { region: "Central / High Country", profile: "verde-mogollon-transition" },
  mogollonRim: { region: "Central / High Country", profile: "mogollon-pine-country" },
  plateauNorth: { region: "Central / High Country", profile: "colorado-plateau-high" },
};

/**
 * Arizona incorporated municipalities from the Saguaro Atlas pack bulk list
 * (deduped later against manual chips — manual wins).
 */
/** Pack “plateau” rows that read cleaner under Grand Canyon / Navajo country in the Reed UI */
const PLATEAU_NW_NAMES = new Set(["Page", "Fredonia", "Colorado City", "Tusayan"]);

export function buildArizonaBulkLocations() {
  const out = [];
  for (const row of ARIZONA_BULK_MUNICIPALITY_ROWS) {
    const [name, _county, la, ln, _pop, zKey] = row;
    let meta = ZONE[zKey] || {
      region: "Southeast Arizona — Sky Islands",
      profile: "sonoran-sun-corridor",
    };
    if (PLATEAU_NW_NAMES.has(name)) {
      meta = { region: "Northwest / Grand Canyon", profile: "colorado-plateau-high" };
    }
    const id = slugifyCityState(name, "az");
    const label = `${name}, AZ`;
    out.push(
      us({
        id,
        label,
        q: label,
        state: "AZ",
        region: meta.region,
        lat: la,
        lng: ln,
        flag: "🌵",
        tags: ["bulk-muni", zKey],
        notes: "",
        microclimateProfile: meta.profile,
      })
    );
  }
  return out;
}
