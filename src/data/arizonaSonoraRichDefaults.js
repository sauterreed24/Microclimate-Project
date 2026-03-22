/**
 * Long-form narratives, analyst bullets, activities, and multi-decade outlook scaffolding
 * for Arizona / Sonora pack locations. Outlook bullets summarize regional climate-science themes
 * (not property-specific forecasts). Monsoon change remains a major uncertainty in CMIP-era models.
 */

const US_CLOSING_INS = [
  "Verify school boundaries, flood-zone FIRMs, and wildfire evacuation routes on a parcel basis — this entry is regional, not a survey.",
  "Never enter running wash water during monsoon; most flash-flood deaths are preventable.",
  "For relocation: pull 10-year utility bills if possible; summer peak kWh and water-tier jumps tell the real story.",
];

const MX_CLOSING_INS = [
  "Cross-border rules, insurance, and vehicle paperwork change — confirm with SAT, Aduana, and your insurer before each trip.",
  "Heat illness is a medical emergency; midday summer exertion without acclimation is high risk.",
];

/** Shared Southwest US themes (2050-era emphasis; scenario-dependent) */
const OUTLOOK_BASE_US = [
  "Southwest-wide: multi-decade warming and aridification pressure on cool-season precipitation is a consistent theme in regional downscaling — expect more person-days above 100°F in valley towns unless urban heat-mitigation scales (shade, evaporative cooling, building codes).",
  "North American monsoon (Jul–Sep): total rain may not collapse in every projection, but timing, intensity, and ‘missed’ seasons are volatile in models — infrastructure must tolerate both deeper drought strings and heavier convective rain rates when storms do arrive.",
  "Wildfire-smoke exposure is increasingly a summer–fall planning variable for outdoor recreation, elders, and asthmatics — sky-island and plateau communities are not immune when fires ignite in Mexico or on neighboring ranges.",
  "Water portfolios: Colorado River shortage tiers, groundwater law reforms, and municipal reuse/expansion will reshape landscaping norms and development caps — ask who holds the water right, not just whether the tap runs today.",
];

const OUTLOOK_BASE_MX = [
  "Sonora shares the same monsoon teleconnections as Arizona; agricultural and urban heat stress are projected to intensify, with coastal humidity adding heat-index risk even when thermometer readings look ‘moderate’.",
  "Tropical cyclone remnants and eastern Pacific moisture surges are a growing tail-risk for Gulf communities — surge + tide + arroyo flooding compound in ways a single statistic rarely captures.",
];

const ZONE = {
  phxMetro: {
    settlement: "municipality in the Salt River Valley",
    p1: "Diurnal solar geometry here is brutal in June: long days, high insolation, and dry air that sheds heat poorly at night inside the urban fabric. The Hohokam engineered survival with gravity-fed canals; modern Phoenix survives on Colorado River imports, groundwater mining (historically), and aggressive air conditioning. Dust outbreaks ahead of Pacific troughs and Gulf moisture intrusions can drop visibility on the Loop 101 in minutes.",
    p2: "Microclimates are real at neighborhood scale: mature flood-irrigated shade vs fresh gravel lots vs glass high-rises can separate evening comfort by a double-digit heat-index spread. Ozone and PM2.5 episodically spike under stagnant highs — pediatric and elderly respiratory sensitivity matters.",
    p3: "Economically, {name} sits inside a logistics, semiconductor-adjacent, and healthcare growth corridor; housing demand cycles with Sun Belt migration and interest rates. Insurance markets are repricing wildfire-smoke years, hail on tile roofs, and burst-pipe freezes during rare Arctic outbreaks.",
    housing: "Listing portals (Zillow, Redfin) show the usual Sun Belt pattern: newer builds on the exurban fringe trade commute minutes for slightly cooler nights and lower price per square foot, while infill and ‘urban heat’ cores trade walkability for summer stress. Always cross-check HOA rental caps, STR rules, and special assessments for stormwater retrofits.",
    micro: "Monsoon lightning photography is world-class; so are haboob walls rolling off the Mogollon Rim. Plan outdoor work before 9 a.m. or after 7 p.m. in July unless you enjoy salt rings on your hat.",
    ins: [
      "Urban heat island: expect measured night lows in dense asphalt districts several °F above irrigated, mature-canopy neighborhoods — it changes sleep quality and AC setpoints.",
      "Hail cores in Mar–Apr and Sep can total cars; comprehensive insurance and covered parking are not vanity.",
      "CAP / SRP / municipal water rate tiers: xeriscape rebates exist but enforcement of outdoor watering rules tightens in shortage years.",
    ],
    ac: [
      "Dawn hike: South Mountain or Camelback (permit/lottery rules) — carry 3L water minimum summer.",
      "Canal paths: measure evening radiant heat off concrete vs mesquite shade corridors.",
      "Desert Botanical Garden or Boyce Thompson Arboretum (day trip east) for plant realism.",
      "Spring training + museums in Mar; avoid midday pavement in Jun–Aug.",
      "Track ADEQ High Pollution Advisory days before strenuous outdoor training blocks.",
      "Monsoon storm chasing: respect flooded intersections; water is opaque and undercut.",
    ],
    outExtra: [
      "Phoenix metro: projected increase in extreme heat events elevates grid stress during peaks — battery + solar adopters may see faster payback but also interconnection queues.",
      "Low-desert turf bans and non-functional grass removal programs will reshape HOA aesthetics over the next two decades.",
    ],
  },
  tucsonCorridor: {
    settlement: "community along the Santa Cruz–Rillito hydrologic shadow of multiple Sky Island|Sky Island ranges",
    p1: "Tucson’s bowl geometry organizes wind and moisture: easterly upslope flow fires the Catalinas in July, while downslope westerlies can desiccate the west side. Saguaros record centuries of drought in their ribs; neighborhoods record it in foundation cracks and exploding water bills.",
    p2: "Defense, optics, and university R&D stabilize parts of the economy; amenity migration and remote work have increased competition for foothill views. Javelina, coyotes, and rattlesnakes are not marketing fiction — they are edge-habitat specialists exploiting irrigation leaks.",
    p3: "{name} participates in Pima County’s mosaic of groundwater basins, effluent recharge projects, and Colorado River deliveries via CAP. Flood hydrology is ‘arroyo sudden’: dry sand one minute, hydraulic bore the next.",
    housing: "Foothill and wash-adjacent parcels trade views for debris-flow risk; demand geological maps and post-fire hydrology changes. Infill near the Loop trades noise for shorter commutes to UMC and UA Health.",
    micro: "Late June ‘gap’ before monsoon is psychologically harsh — schedule elevation escapes to Mt. Lemmon or the Chiricahuas if you can.",
    ins: [
      "Davis-Monthan jet noise is directional; visit the block at 6 a.m. before offering.",
      "Santa Cruz River park projects cool corridors but don’t mistake them for natural perennial flow in all reaches.",
      "Bike commuting is viable Oct–Apr; summer requires e-bike battery heat management and hydration discipline.",
    ],
    ac: [
      "Sabino Canyon tram + shallow wade pools (seasonal).",
      "Mission San Xavier del Bac at golden hour — radiant cooling after sunset.",
      "Tumacácori / Tubac day loop for cultural + riparian contrast.",
      "Kitt Peak / western scopes — check monsoon lightning policy.",
      "Saguaro National Park east vs west for bloom timing differences.",
      "Fourth Avenue street fair — shoulder season only for comfort.",
    ],
    outExtra: [
      "Tucson corridor: monsoon onset variability dominates interannual comfort — a wet Jul–Aug can feel ‘tropical pleasant’ at night; a failed monsoon is Tucson at its most relentless.",
      "Groundwater adjudication and rural residential development on the fringes will continue to collide with riparian preservation goals.",
    ],
  },
  southeastSkyIsland: {
    settlement: "settlement on the bajadas and corridors of the Madrean Sky Island archipelago",
    p1: "The Huachuca and Mule ranges lift moist air just enough to nucleate summer thunderstorms that strip humidity from the outflow, then dust the desert floor. Elevation change of a few hundred feet swaps creosote for oak woodland; a few thousand feet adds pine and occasional spring snow on the highest knobs.",
    p2: "Neotropical migrants and hummingbirds treat these canyons as fuel stops — Ramsey and Ash Canyon are internationally famous among listers. Real estate pressure follows views and cooler nights: you will see Sierra Vista-area and canyon-adjacent listings that emphasize ‘Huachuca views’ and dark skies; verify access roads (Carr Canyon), winter ice on switchbacks, and whether the parcel sits in a chute that moves boulders during gully washers.",
    p3: "{name} is woven into Fort Huachuca’s rotation cycle, border logistics, and birding tourism. Fire ecology is not abstract: lightning-sparked range fires can close trails for years and alter watershed hydrology.",
    housing: "Zillow-style searches often surface ranchettes on well + septic, HOA-minimal parcels, and newer production homes near services. Due-diligence: static water level trends, shared-well agreements, wildfire defensible space, and road maintenance MOUs on private easements.",
    micro: "Pre-monsoon May–June is when grass cures and nerves fray; respect Red Flag days and trail closures.",
    ins: [
      "Military training noise and helicopter traffic are episodic — listen on a weekday before buying ‘quiet canyon’ marketing.",
      "Border-adjacent recreation: stay on public routes; do not cross unmarked fences or ignore closed areas.",
      "Bear and lion encounters are rare but real at canyon mouths; carry awareness, not just a telephoto.",
    ],
    ac: [
      "Ramsey Canyon Preserve — reservations/fees; August hummingbird density peaks.",
      "Carr Canyon road — high-clearance segments; winter ice risk.",
      "San Pedro Riparian National Conservation Area — dawn warbler walks.",
      "Huachuca Peak / Miller Canyon trails — elevation relief on scorcher days.",
      "Fort Huachuca museums — ID rules at gates.",
      "Bisbee overnight for cultural contrast + slightly different rain shadow.",
    ],
    outExtra: [
      "Sky islands: upslope warming pushes ecotones uphill — long-term reshuffling of oak–pine boundaries affects watershed yield and fire behavior; trail maps may lag ecological reality after big burns.",
      "Hummingbird and neo-tropical migrant phenology may shift earlier in warm springs — banding stations and eBird trends are worth watching for tourism seasonality.",
    ],
  },
  santaCruzWine: {
    settlement: "high-grassland town or ranch hamlet on the Sonoita–Patagonia plateau",
    p1: "This is one of Arizona’s windiest habitable benches: pressure gradients between Pacific troughs and interior Mexican heat low can sandblast vineyard shoots in spring. Hail insurance is a line-item, not an afterthought. Soils are thin over volcanic parents; water rights are the hard ceiling on growth.",
    p2: "Wine tourism concentrates weekend traffic on two-lane highways; cattle gates and open range define night driving risk. Patagonia’s birding economy and Sonoita’s tasting rooms create a split personality — artsy-quiet midweek, convivial Saturday.",
    p3: "{name} trades Tucson’s basin heat for cooler nights but not for monsoon immunity: microbursts have shredded shade cloth statewide.",
    housing: "Listings emphasize acreage, horse facilities, and off-grid readiness. Check well driller logs, roof hail history, and whether the driveway drainage crosses a county easement.",
    micro: "Grassland fire runs fast with easterly winds ahead of storms — have a go-bag and livestock plan.",
    ins: [
      "Spring wind events can exceed safe towing speeds for RVs — plan I-10 / Hwy 82 merges carefully.",
      "Frost pockets follow terrain curvature; vineyard blocks are not interchangeable.",
      "Broadband is improving but verify Starlink sightlines and WISP latency if remote-employed.",
    ],
    ac: [
      "Wine loop driving — designate driver; afternoon lightning is sneaky.",
      "Patagonia Lake swim season (Jul–Aug best).",
      "Las Cienegas NCA grassland birding.",
      "Empire Ranch historic grounds — monsoon green-up photography.",
      "Sonoita Creek State Natural Area when open — check alerts.",
      "Overnight in Tucson or Sierra Vista for monsoon lightning contrast.",
    ],
    outExtra: [
      "High-elevation grasslands: increased vapor pressure deficit in warm springs may stress dry-farmed vines — irrigation strategy and cultivar choice are climate-adaptive decisions.",
      "Hail risk may rise with stronger convective available potential energy on some modeled summer afternoons — insurance markets are already reacting in hail belts.",
    ],
  },
  coloradoRiver: {
    settlement: "low-desert municipality tied to the Colorado River irrigation–snowbird economy",
    p1: "This is among the most thermally hostile summer climates in the US for unacclimated outdoor labor: low humidity helps evaporation but also deceives thirst cues. River proximity moderates winter frost for citrus and lettuce; summer is still a furnace.",
    p2: "Dust storms off disturbed desert pavement and ag fields can shut I-8 / I-10 visibility; haboobs show up in insurance databases as multi-car pileups.",
    p3: "{name} lives inside Colorado River Compact politics — municipal conservation, fallowing, and reuse projects are structural, not optional.",
    housing: "Snowbird seasonality means STR competition and HOA rules vary wildly; check whether ‘winter visitors’ dominate your street noise profile. Riverfront premiums buy breeze and psychrometric relief.",
    micro: "November–March is why people forgive July; schedule outdoor life accordingly.",
    ins: [
      "Surface temps on boat docks and sand can exceed air temps by 30°F — footwear matters.",
      "Colorado River water allocation cuts propagate into rates and development caps — read city council agendas.",
      "Sun angle + reflection off water increases UV exposure — skin and eyes.",
    ],
    ac: [
      "River jet-ski / paddle early morning summer.",
      "Imperial / Yuma ag tours during lettuce season (winter).",
      "Cibola NWR / Bill Williams for waterfowl (seasonal).",
      "Quartzsite gem shows — Jan peak, bring dust masks.",
      "Drive mitigation wetlands to see restored riparian microclimates.",
      "Evening walks on irrigated golf corridors — measure dew point comfort.",
    ],
    outExtra: [
      "Low desert: extreme heat days per year are projected to increase faster than global mean — outdoor labor standards and school recess policies are lagging indicators.",
      "Salinization and soil heat stress may shift winter vegetable geographies over decades — local ag employment could become more volatile.",
    ],
  },
  mogollonRim: {
    settlement: "high-plateau or rim-country town in ponderosa–mixed conifer transition",
    p1: "Snowpack, spring wind, and June ignition fronts define the calendar. Monsoon follows with violent lightning and localized debris flows off burn scars. Night skies can be Bortle-class gorgeous; winter roads ice before valley forecasts admit it.",
    p2: "Second-home demand from Phoenix/Tucson creates affordability tension for service workers; short-term rental ordinances are evolving.",
    p3: "{name} depends on forest health — beetle kill, stand density, and prescribed burn windows are not USFS trivia; they’re insurance actuaries.",
    housing: "Chimney inspections, roof snow load, and driveway grade for ice matter. Wood stoves face episodic no-burn days during inversions.",
    micro: "Aspen color peaks can be a one-weekend event — traffic on 260/87 spikes.",
    ins: [
      "Wildfire smoke plans: MERV-13 filters, portable HEPA, and a clean room for kids/asthma.",
      "Sept–Oct hunter orange etiquette on NFS roads.",
      "Septic + leach in shallow bedrock areas — perc tests are non-negotiable.",
    ],
    ac: [
      "Woodland Lake / Show Low rim walks.",
      "Mogollon Rim overlook drives — lightning photography with distance safety.",
      "Payson–Christopher Creek creek hikes — check flow.",
      "Sunrise ski prep at Sunrise Park (seasonal).",
      "Blue Ridge Reservoir paddle — monsoon wind caution.",
      "Fall color loop toward Alpine/Eagar.",
    ],
    outExtra: [
      "High-elevation forests: warming winters may lengthen fire seasons and shift snow-rain transition elevation — water yield timing changes stress downstream users.",
      "Bark beetle and drought synergies remain a structural wildfire finance problem for WUI homeowners.",
    ],
  },
  verdeTransition: {
    settlement: "Verde Valley or transition town between Colorado Plateau heat and Basin-Range dryness",
    p1: "Red rock, juniper, and pinyon anchor the vista; spring winds polish sandstone. Summer afternoons build anvil clouds that can dump inch-per-hour rain in narrow slots — slot canyons are death traps during buildup.",
    p2: "Tourism and retirement dollars compete with service-economy wages; short-term rental pressure is acute in Sedona-adjacent markets.",
    p3: "{name} benefits from elevation ~3,500–5,000 ft sweet spot: hot enough for pool culture, cool enough for sleep in many neighborhoods.",
    housing: "HOAs near golf and creek corridors fight water rates; hillside homes trade views for evacuation complexity during brush fires.",
    micro: "May is ideal; August monsoon is dramatic; January can ice the bridges in shade.",
    ins: [
      "Hardiness zone maps lie by micro-basin — walk the lot at sundown before trusting a listing photo.",
      "Caliche excavation costs can exceed foundation bids in Verde soils.",
      "Dark-sky ordinances help astronomy tourism — check outdoor lighting rules.",
    ],
    ac: [
      "Dead Horse Ranch SP loops — spring birding.",
      "Tuzigoot / Montezuma Castle — cultural + heat management combo.",
      "Verde River FP2 tubing window — call flow.",
      "Jerome walkable hills — park at base if unsure on brakes.",
      "Sedona trailhead dawn starts — red rock thermals by noon.",
      "Page Springs Cellars / Cornville tasting + riparian shade.",
    ],
    outExtra: [
      "Transition zone: increased large-fire risk on wind + cured fuels days may shorten comfortable hiking seasons without early starts.",
      "Wine and tree-fruit bloom frost windows may compress under erratic warm February spells.",
    ],
  },
  plateauNorth: {
    settlement: "Colorado Plateau or Navajo Nation–adjacent service center",
    p1: "Wind, dust, and UV at 5,000+ ft punish skin and paint. Spring is brown; summer monsoon paints chamisa and sunflowers; winter is dry cold with occasional synoptic snow that strands tourists near the Canyon.",
    p2: "Energy transitions (solar, transmission) intersect with tribal sovereignty and grazing leases — politics here is land politics.",
    p3: "{name} is a logistics node for tourism, ranching, and government services; housing can be sparse relative to commute distances.",
    housing: "Manufactured housing and site-built on tribal lease lands follow different finance rules — verify with lenders experienced in trust/lease processes.",
    micro: "Never underestimate June dust on I-40.",
    ins: [
      "Tribal lands: permits, photography, alcohol, and speed limits are strict — research before wandering.",
      "Elk on highways at dawn/dusk — high crash risk.",
      "Radon and alluvial radon pathways vary by canyon proximity — test basements.",
    ],
    ac: [
      "Meteor Crater detour — wind exposure is real.",
      "Wupatki + Sunset Crater loop — elevation breeze.",
      "Antelope Canyon tours — book + flash-flood safety briefing.",
      "Horseshoe Bend dawn — heat + crowd management.",
      "Powell / Page marina evening — lake thermal moderation.",
      "Dinosaur tracks at Moenave (respectful visitation).",
    ],
    outExtra: [
      "Plateau snowpack–rain shifts influence Colorado River yield — Page/Lake Powell elevation stories are climate headlines, not abstractions.",
      "Dust-on-snow albedo feedback in Rockies can shorten ski seasons upstream, indirectly affecting regional tourism circuits.",
    ],
  },
  copperGila: {
    settlement: "Basin-and-range mining or ranch town in the copper–limestone belt",
    p1: "Arroyos that sit bone-dry for years can move cars in minutes. Legacy mining left attractive nuisances — tailings, chat piles, and smelter-era neighborhoods with soil questions.",
    p2: "Copper price cycles echo in municipal budgets; prisons and public-sector jobs often anchor payrolls when mines throttle.",
    p3: "{name} is honest desert: creosote perfume after rain, cholla jumpers on dog paws, and stars that feel close.",
    housing: "Historic downtown bricks vs mobile-home parks vs exurban ranchettes — price dispersion is wide. Always check floodway maps even when ‘it never rains.’",
    micro: "July lightning makes metal peaks a bad selfie platform.",
    ins: [
      "Superior / Globe corridor: watch for slow mine equipment on curves.",
      "Groundwater quality near historic smelters — environmental reports in disclosure packets.",
      "Javelina trash discipline — they open ‘bear-proof’ like interns.",
    ],
    ac: [
      "BHP mine viewpoint roads — public pullouts only.",
      "Boyce Thompson Arboretum day trip.",
      "Salt River Canyon descent — brake cooling stops.",
      "San Carlos recreation permits — check tribe rules.",
      "Copper Corridor murals + coffee stops.",
      "Night sky east of town — Bortle win.",
    ],
    outExtra: [
      "Heavy-rain bursts on burn scars increase debris-flow probability — post-fire flood insurance is a specialty product worth asking about.",
      "Electrification of mining fleets may improve local air quality over decades if power is clean.",
    ],
  },
  pinalSuburb: {
    settlement: "Pinal County or I-10 corridor exurban municipality",
    p1: "Agricultural haze, dust from discing, and I-10 diesel mix on stagnant mornings. Summer highs rival Phoenix with fewer mature shade trees in new plats.",
    p2: "Warehouse and logistics employment is growing; bedroom-community identity dominates many blocks.",
    p3: "{name} is a study in trade-space: cheaper dirt vs longer commutes vs hotter afternoons.",
    housing: "New-build premiums include solar-ready roofs but often minimal tree canopy for a decade — model utility costs with and without shade.",
    micro: "April wind before monsoon is when patio furniture visits the neighbor.",
    ins: [
      "HOA documents in master-planned sections can ban xeriscape aesthetics — read CCRs.",
      "Flood routing from farmland sheet flow can surprise new subdivisions downslope.",
      "Check for electric vehicle charger panel capacity in 1990s homes.",
    ],
    ac: [
      "Picacho Peak sunrise hike — start stupid early in May.",
      "Rooster Cogburn ostrich farm detour — kid thermoregulation care.",
      "Casa Grande ruins NM — winter sweet spot.",
      "Skydive Arizona cool-season bookings.",
      "Eloy canal roads — birding edges.",
      "I-8 run to Tucson for elevation relief dinners.",
    ],
    outExtra: [
      "Exurban heat-island expansion may outpace tree canopy growth — expect higher per-capita cooling energy through 2040 without aggressive shade programs.",
      "Logistics growth increases truck traffic and ultrafine particulates near corridors — choose lots wisely.",
    ],
  },
  sonoraBorder: {
    settlement: "border economy city or town on the Sonoran thornscrub corridor",
    p1: "Truck queues, produce refrigeration, and pedestrian crossings create a 24-hour metabolism distinct from interior towns. Summer humidity spikes when Gulf moisture backs in; dust still blows on the dry side of outflow boundaries.",
    p2: "Binational families experience the port as a time tax — housing location relative to bridges shapes daily life more than zip code aesthetics.",
    p3: "{name} is embedded in maquiladora supply chains, informal retail, and increasingly, medical and dental tourism pricing arbitrage.",
    housing: "Hillside colonias vs historic grids vs new perimeter subdivisions — water pressure and drainage infrastructure vary block to block.",
    micro: "Semana Santa and Christmas bridges are stress tests — patience or alternate hours.",
    ins: [
      "Pedestrian vs vehicle lanes differ by documents — research current port pages.",
      "Aftermarket vehicle mods may complicate southbound inspections.",
      "Cash + card mix changes; ATM fees bite on holiday weekends.",
    ],
    ac: [
      "Morning mercado walks — hydrate like an athlete.",
      "Plaza evening social life — best thermally after sunset in summer.",
      "Scenic ridge drives toward higher elevations for heat relief.",
      "Birding riparian remnants with local guides — ethics first.",
      "Tucson or Hermosillo museum weekends — break the heat routine.",
      "Photography of infrastructure — know what’s sensitive.",
    ],
    outExtra: [
      "Border metros: heat + humidity trends raise occupational health stakes for logistics workers — night-shift scheduling may expand.",
      "Water security on the Sonoran side parallels Arizona’s challenges — agricultural groundwater stress may reshape peri-urban land use.",
    ],
  },
  sonoraCoastLite: {
    settlement: "Gulf of California littoral town or resort cluster",
    p1: "Tropical moisture elevates heat index even when dry-bulb temps look tolerable; seabreeze timing is everything for patio dining. Tidal flats and arroyos kill incautious drivers during surges.",
    p2: "Condo HOAs and foreign-buyer norms dominate Rocky Point–style markets; verify fideicomiso / legal structures with a Mexican real estate attorney for purchases, not a forum thread.",
    p3: "{name} lives off shrimp, sport fish, and winter visitors — economic seasonality is extreme.",
    housing: "Beachfront vs first-row vs escarpment: breeze, salt spray corrosion, and surge risk separate price tiers.",
    micro: "Jellyfish, stingrays, and rip currents are the unglamorous field guide pages.",
    ins: [
      "Hurricane-season insurance and cancellation policies — read the exclusions.",
      "Desal / water delivery costs rise in dry cycles — ask HOAs.",
      "US-plate parking: don’t leave valuables visible at trailheads.",
    ],
    ac: [
      "Tide-pool walks at extreme low tide — go with local charts.",
      "Panga fishing — life jackets non-negotiable.",
      "Malecón sunset — compare humid vs dry heat relief.",
      "Birding esteros at dawn.",
      "Tetakawi-style basalt hikes where permitted — carry 3L.",
      "Hermosillo food run — AC + car wash day.",
    ],
    outExtra: [
      "Eastern Pacific tropical cyclone activity variance is huge decade-to-decade — building codes are catching up slowly; older waterfront stock is vulnerability concentrated.",
      "Sea-surface temperature trends affect fisheries — local restaurant menus are an informal climate dashboard.",
    ],
  },
};

function countyLabel(county, co) {
  if (co !== "US") return "";
  if (county.includes("CDP") || county.includes("Nation")) return county;
  return `${county} County`;
}

export function buildRichBp(name, county, pop, zoneKey, co) {
  const z = ZONE[zoneKey];
  if (!z) return "";
  const cl = countyLabel(county, co);
  const head =
    co === "US"
      ? `${name} is a ${z.settlement} in ${cl}, with a published population near ${pop}. `
      : `${name} is a ${z.settlement} in northern Sonora — approximate metro or municipal population context: ${pop}. `;
  return (
    head +
    z.p1 +
    "\n\n" +
    z.p2.replace(/\{name\}/g, name) +
    "\n\n" +
    z.p3.replace(/\{name\}/g, name) +
    "\n\n" +
    z.housing.replace(/\{name\}/g, name) +
    "\n\n" +
    z.micro
  );
}

export function buildRichIns(zoneKey, name) {
  const z = ZONE[zoneKey];
  if (!z) return [];
  return z.ins.map((s) => s.replace(/\{name\}/g, name));
}

export function buildRichAc(zoneKey, name) {
  const z = ZONE[zoneKey];
  if (!z) return [];
  return z.ac.map((s) => s.replace(/\{name\}/g, name));
}

export function buildRichCt(name, county, pop, co) {
  const cl = countyLabel(county, co);
  if (co !== "US") {
    return [
      { nm: `${name} (core)`, pop, no: "Services cluster; verify neighborhood security and drainage with recent local sources — this guide is not a safety audit." },
      { nm: `${name} periphery`, pop: "varies", no: "Exurban colonias and agricultural fringe lots trade lower price for infrastructure variability; drive after a monsoon storm if possible." },
    ];
  }
  return [
    { nm: `${name} — incorporated services`, pop, no: "Full municipal zoning, police, and trash; compare east/west or north/south exposure for afternoon sun on driveways and patios." },
    { nm: `${name} — fringe / ETJ`, pop: "growing", no: `Unincorporated pockets in ${cl} may rely on county sheriff, voluntary fire districts, and private water companies — map the provider before offer.` },
    { nm: "Field compare: elevation day trip", pop: "n/a", no: `Spend one July afternoon in ${name}, then drive 2,000 ft higher the same day — the humidity and temperature swap educates faster than any blog.` },
  ];
}

export function buildOutlook(zoneKey, co, name) {
  const base = co === "MX" ? [...OUTLOOK_BASE_MX, ...OUTLOOK_BASE_US.slice(0, 2)] : [...OUTLOOK_BASE_US];
  const extra = ZONE[zoneKey]?.outExtra || [];
  return [...base, ...extra.map((s) => s.replace(/\{name\}/g, name))];
}

export function closingIns(co) {
  return co === "MX" ? MX_CLOSING_INS : US_CLOSING_INS;
}
