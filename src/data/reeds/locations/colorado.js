import { us } from "./helpers.js";

const C = (id, label, q, region, lat, lng, tags) =>
  us({ id, label, q, state: "CO", region, lat, lng, flag: "🏔️", tags: tags || [], notes: "" });

export const COLORADO = [
  ...[
    ["denver-co", "Denver, CO", "Denver, CO", "Front Range", 39.7392, -104.9903, ["capital", "metro"]],
    ["aurora-co", "Aurora, CO", "Aurora, CO", "Front Range", 39.7294, -104.8319, []],
    ["lakewood-co", "Lakewood, CO", "Lakewood, CO", "Front Range", 39.7047, -105.0814, []],
    ["arvada-co", "Arvada, CO", "Arvada, CO", "Front Range", 39.8028, -105.0875, []],
    ["westminster-co", "Westminster, CO", "Westminster, CO", "Front Range", 39.8367, -105.0372, []],
    ["thornton-co", "Thornton, CO", "Thornton, CO", "Front Range", 39.868, -104.9719, []],
    ["broomfield-co", "Broomfield, CO", "Broomfield, CO", "Front Range", 39.9205, -105.0867, []],
    ["commerce-city-co", "Commerce City, CO", "Commerce City, CO", "Front Range", 39.8083, -104.9339, []],
    ["brighton-co", "Brighton, CO", "Brighton, CO", "Front Range", 39.9853, -104.8205, []],
    ["longmont-co", "Longmont, CO", "Longmont, CO", "Front Range", 40.1672, -105.1019, []],
    ["boulder-co", "Boulder, CO", "Boulder, CO", "Front Range", 40.015, -105.2705, ["flatirons"]],
    ["louisville-co", "Louisville, CO", "Louisville, CO", "Front Range", 39.9778, -105.1319, []],
    ["lafayette-co", "Lafayette, CO", "Lafayette, CO", "Front Range", 39.9936, -105.0897, []],
    ["erie-co", "Erie, CO", "Erie, CO", "Front Range", 40.0503, -105.0499, []],
    ["fort-collins-co", "Fort Collins, CO", "Fort Collins, CO", "Front Range", 40.5853, -105.0844, ["csu"]],
    ["loveland-co", "Loveland, CO", "Loveland, CO", "Front Range", 40.3978, -105.0749, []],
    ["greeley-co", "Greeley, CO", "Greeley, CO", "Front Range", 40.4233, -104.7091, []],
    ["windsor-co", "Windsor, CO", "Windsor, CO", "Front Range", 40.4775, -104.9014, []],
    ["evans-co", "Evans, CO", "Evans, CO", "Front Range", 40.3764, -104.6922, []],
  ].map(([id, label, q, rg, la, ln, tg]) => C(id, label, q, rg, la, ln, tg)),

  ...[
    ["colorado-springs-co", "Colorado Springs, CO", "Colorado Springs, CO", "Colorado Springs Area", 38.8339, -104.8214, ["pikes-peak"]],
    ["manitou-springs-co", "Manitou Springs, CO", "Manitou Springs, CO", "Colorado Springs Area", 38.8597, -104.9172, []],
    ["fountain-co", "Fountain, CO", "Fountain, CO", "Colorado Springs Area", 38.6822, -104.7008, []],
    ["pueblo-co", "Pueblo, CO", "Pueblo, CO", "Colorado Springs Area", 38.2544, -104.6091, []],
    ["pueblo-west-co", "Pueblo West, CO", "Pueblo West, CO", "Colorado Springs Area", 38.3, -104.64, []],
    ["canon-city-co", "Cañon City, CO", "Canon City, CO", "Colorado Springs Area", 38.4414, -105.2208, ["royal-gorge"]],
    ["florence-co", "Florence, CO", "Florence, CO", "Colorado Springs Area", 38.3903, -105.1196, []],
  ].map(([id, label, q, rg, la, ln, tg]) => C(id, label, q, rg, la, ln, tg)),

  ...[
    ["durango-co", "Durango, CO", "Durango, CO", "Southwest / San Juans", 37.2753, -107.8801, ["mountain"]],
    ["bayfield-co", "Bayfield, CO", "Bayfield, CO", "Southwest / San Juans", 37.2181, -107.5995, []],
    ["ignacio-co", "Ignacio, CO", "Ignacio, CO", "Southwest / San Juans", 37.1194, -107.6332, []],
    ["pagosa-springs-co", "Pagosa Springs, CO", "Pagosa Springs, CO", "Southwest / San Juans", 37.2694, -107.0759, ["hotsprings"]],
    ["alamosa-co", "Alamosa, CO", "Alamosa, CO", "Southwest / San Juans", 37.4694, -105.87, ["valley"]],
    ["monte-vista-co", "Monte Vista, CO", "Monte Vista, CO", "Southwest / San Juans", 37.5792, -106.1481, []],
    ["del-norte-co", "Del Norte, CO", "Del Norte, CO", "Southwest / San Juans", 37.6789, -106.3534, []],
    ["la-jara-co", "La Jara, CO", "La Jara, CO", "Southwest / San Juans", 37.275, -105.9427, []],
    ["cortez-co", "Cortez, CO", "Cortez, CO", "Southwest / San Juans", 37.3489, -108.5859, ["mesa-verde"]],
    ["dolores-co", "Dolores, CO", "Dolores, CO", "Southwest / San Juans", 37.4739, -108.4992, []],
    ["mancos-co", "Mancos, CO", "Mancos, CO", "Southwest / San Juans", 37.345, -108.3892, []],
    ["telluride-co", "Telluride, CO", "Telluride, CO", "Southwest / San Juans", 37.9375, -107.8123, ["ski"]],
    ["montrose-co", "Montrose, CO", "Montrose, CO", "Southwest / San Juans", 38.4783, -107.8762, []],
    ["delta-co", "Delta, CO", "Delta, CO", "Southwest / San Juans", 38.7422, -108.0689, []],
    ["grand-junction-co", "Grand Junction, CO", "Grand Junction, CO", "Southwest / San Juans", 39.0639, -108.5506, ["wine"]],
    ["fruita-co", "Fruita, CO", "Fruita, CO", "Southwest / San Juans", 39.1589, -108.7289, []],
  ].map(([id, label, q, rg, la, ln, tg]) => C(id, label, q, rg, la, ln, tg)),

  ...[
    ["salida-co", "Salida, CO", "Salida, CO", "Mountain Towns", 38.5347, -105.9989, ["arkansas-river"]],
    ["buena-vista-co", "Buena Vista, CO", "Buena Vista, CO", "Mountain Towns", 38.8418, -106.1316, []],
    ["leadville-co", "Leadville, CO", "Leadville, CO", "Mountain Towns", 39.2508, -106.2925, ["high-altitude"]],
    ["fairplay-co", "Fairplay, CO", "Fairplay, CO", "Mountain Towns", 39.2247, -106.0028, []],
    ["glenwood-springs-co", "Glenwood Springs, CO", "Glenwood Springs, CO", "Mountain Towns", 39.5505, -107.3248, ["hotsprings"]],
    ["carbondale-co", "Carbondale, CO", "Carbondale, CO", "Mountain Towns", 39.4022, -107.2112, []],
    ["basalt-co", "Basalt, CO", "Basalt, CO", "Mountain Towns", 39.3689, -107.0328, []],
    ["aspen-co", "Aspen, CO", "Aspen, CO", "Mountain Towns", 39.1911, -106.8175, ["ski", "reference"]],
    ["steamboat-springs-co", "Steamboat Springs, CO", "Steamboat Springs, CO", "Mountain Towns", 40.485, -106.8317, ["ski"]],
    ["craig-co", "Craig, CO", "Craig, CO", "Mountain Towns", 40.5152, -107.5465, []],
    ["meeker-co", "Meeker, CO", "Meeker, CO", "Mountain Towns", 40.0375, -107.9131, []],
    ["rifle-co", "Rifle, CO", "Rifle, CO", "Mountain Towns", 39.5347, -107.7831, []],
  ].map(([id, label, q, rg, la, ln, tg]) => C(id, label, q, rg, la, ln, tg)),
];
