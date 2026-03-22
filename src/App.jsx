import { useState, useEffect, useCallback, useMemo, useRef, lazy, Suspense } from "react";
import RiskDashboard from "./components/RiskDashboard.jsx";
import MonthClimatePanel from "./components/MonthClimatePanel.jsx";
import AgPropertyGuide from "./components/AgPropertyGuide.jsx";
import TravelActivityCards from "./components/TravelActivityCards.jsx";
import HomesTab from "./components/HomesTab.jsx";
import { arizonaSonoraPackLocations, arizonaSonoraRiskPatch } from "./data/arizonaSonoraPack.js";

const HOMES_MC_IDS = [910, 911, 929];

const ClimateMap = lazy(() => import("./components/ClimateMap.jsx"));
const G={"Sky Island":{t:"Sky Island",d:"Isolated mountain range surrounded by desert, compressing multiple biomes vertically—cactus desert at base, pine forest mid-slope, spruce-fir alpine at summit. Unique species evolved in isolation like oceanic islands made of rock."},"Rain Shadow":{t:"Rain Shadow",d:"Dry area downwind of mountains. Moist air drops rain climbing up, descends wrung-dry—creating arid zones sometimes 30 miles from the wettest places on Earth. Sequim, WA gets 16\" of rain while the Hoh Rainforest 30 mi away gets 140\"."},"Tropical Cloud Forest":{t:"Tropical Cloud Forest",d:"High-elevation tropical forest perpetually shrouded in fog. Extraordinary biodiversity—mosses, orchids, bromeliads cover every surface. Less than 1% of global forest area. Among the rarest ecosystems on Earth."},"Coastal Fog Zone":{t:"Coastal Fog Zone",d:"Narrow coastal strip where cold upwelling meets warm air creating persistent fog. Natural AC keeping temps stable year-round (often <15°F seasonal variation). 'Fog drip' waters trees without rain — 30-45% of moisture in redwood forests comes from fog."},"Temperate Cove Forest":{t:"Temperate Cove Forest",d:"Sheltered Appalachian hollows with extraordinarily deep fertile soil. Protected from wind, enriched by nutrients washing down slopes. Most diverse hardwood forests in North America—40+ tree species per acre in some coves."},"Temperate Rainforest":{t:"Temperate Rainforest",d:"Cool-latitude rainforest, 55–160+ in/yr rain. Trees 300+ ft, 1000+ yrs old. More biomass per acre than any ecosystem including tropical. Fewer species than tropical but individual organisms achieve staggering size."},"Mediterranean Valley":{t:"Mediterranean Valley",d:"Hot dry summers, mild wet winters—the specific combination producing ideal conditions for wine grapes, olives, citrus. Only 5 regions on Earth have true Mediterranean climate."},"Tropical Karst Limestone":{t:"Tropical Karst Limestone",d:"Dissolved limestone creating cenotes, underground rivers, caves. The Yucatán cenote ring traces the rim of the Chicxulub asteroid impact crater—the impact that ended the dinosaurs 66 million years ago."},"AQI":{t:"Air Quality Index",d:"0–500 scale measuring air cleanliness. 0–50 Good, 51–100 Moderate, 101+ unhealthy. Under 20 is pristine wilderness air—remote areas far from industry and traffic."},"Hardiness Zone":{t:"USDA Plant Hardiness Zone",d:"Zones 1 (−60°F) to 13 (65°F+), each spanning 10°F of minimum winter temperature. A plant 'rated Zone 6' survives −10°F to 0°F winters."},"Andisol":{t:"Andisol (Volcanic Soil)",d:"Soil from volcanic ash—fertile, light, well-drained, mineral-rich. Holds water and nutrients despite porosity. Supports the most productive agriculture on Earth."},"Podzol":{t:"Podzol",d:"Acidic nutrient-poor soil of cool wet coniferous forests. Heavy rainfall leaches nutrients, creating distinctive pale ash-colored layer. Supports massive forests through efficient fungal nutrient recycling."},"Cryosol":{t:"Cryosol",d:"Permafrost soil with permanent frozen layer within 2m of surface. Climate change is thawing permafrost globally, releasing stored carbon and destabilizing infrastructure."},"Karst":{t:"Karst Geology",d:"Landscape formed by dissolution of limestone by acidic rainwater over millions of years. Caves, sinkholes, disappearing streams, underground rivers. 25% of world's population gets water from karst aquifers."},"Cenote":{t:"Cenote",d:"Natural limestone sinkhole exposing crystal-clear groundwater. Sacred to Maya as entrances to the underworld. The Yucatán cenote ring traces the Chicxulub asteroid crater rim."},"Orographic Lift":{t:"Orographic Lift",d:"Wind pushes moist air up mountains; it cools, condenses, drops rain windward. Dry air descends leeward—creating rain shadow deserts."},"Chernozem":{t:"Chernozem (Black Earth)",d:"Dark humus-rich soil formed under grasslands over millennia. Up to 15% organic matter. Among the most naturally fertile soils on Earth."},"Loess":{t:"Loess",d:"Wind-deposited silt from ice-age glaciers, creating deep uniform fertile soil 10–200+ ft deep. The Palouse has some of Earth's deepest loess."},"Ogallala Aquifer":{t:"Ogallala Aquifer",d:"174,000 sq mi underground reservoir beneath 8 states. Supplies 30% of US irrigation water. Being pumped 3–100× faster than recharge. Water tables dropped 150+ ft in places."},"Cryptobiotic Crust":{t:"Cryptobiotic Crust",d:"Living soil skin of cyanobacteria binding desert sand. Prevents erosion, fixes nitrogen, retains moisture. A single footprint destroys 50–250 years of growth."},"Soil pH":{t:"Soil pH",d:"0–14 scale. Below 7 acidic, above 7 alkaline. Most vegetables prefer 6.0–6.8. Blueberries need 4.5–5.5. Desert soils typically 7.5–8.5."},"Thermal Belt":{t:"Thermal Belt",d:"Narrow elevation band on mountain slopes where cold air drains downhill past it and warm air rises up to it—creating a zone 5–15°F warmer than both valley floor and summit. First documented by farmers noticing mid-slope orchards never froze."},"Rain Shadow Desert":{t:"Rain Shadow Desert",d:"True desert created entirely by orographic lift. The Lillooet corridor in BC holds Canada's all-time heat record (121.3°F) at 50°N — the latitude of London."},"Carolinian Zone":{t:"Carolinian Zone",d:"Canada's southernmost ecological zone where deciduous trees from the Carolinas survive at extreme northern limit. Less than 1% of Canada but 25% of its endangered species."},"Maritime Subarctic":{t:"Maritime Subarctic",d:"Rare climate where subarctic cold meets oceanic moderation. Supports extraordinary wildlife density — Kodiak bears are Earth's largest land predators."},"Stromatolite":{t:"Stromatolite",d:"Living rocks built by cyanobacteria—the same organisms that created Earth's oxygen atmosphere 2.5 billion years ago. Bacalar Lagoon has rare freshwater examples."},"Boojum Tree":{t:"Boojum Tree (Cirio)",d:"One of Earth's strangest plants—single unbranched stem up to 60 ft tall looking like an inverted carrot. Found almost exclusively in Baja's Valle de los Cirios. Named after Lewis Carroll."},"Pygmy Forest":{t:"Pygmy Forest",d:"Forest where mature trees grow only 2–8 ft tall despite being decades old. Caused by extremely poor hardpan or ultra-acidic soil that stunts growth."},"Fog Drip Ecosystem":{t:"Fog Drip Ecosystem",d:"Ecosystem sustained by fog condensing on leaves and dripping to ground. In Coast Ranges, fog drip provides 30–45% of total moisture to redwood forests."},"Channeled Scabland":{t:"Channeled Scabland",d:"Landscape carved by the largest known floods on Earth — when ice dams broke 15,000 years ago releasing 500 cubic miles of water across eastern Washington in days. Formed coulees, dry falls, and exposed basalt."},"Subtropical Canyon":{t:"Subtropical Canyon",d:"Deep canyon at subtropical latitudes—tropical forest at bottom, pine-oak at rim, 6,000+ ft of vertical ecosystem change."},"Lake-Modified Continental":{t:"Lake-Modified Continental",d:"Near deep lakes, water acts as thermal battery—extending growing season in autumn, protecting from late spring frost. Creates narrow bands perfect for wine grapes."},"Tropical Orographic":{t:"Tropical Orographic",d:"Trade winds push moist air up slopes creating morning sun + afternoon clouds—ideal daily rhythm for coffee, cacao, tropical crops."},"Maritime Oceanic":{t:"Maritime Oceanic",d:"Climate heavily moderated by ocean—cool summers, mild winters, high humidity. Supports temperate rainforests and productive fisheries."},"Subarctic Tundra":{t:"Subarctic Tundra",d:"Treeless zone between boreal forest and ice. Permafrost, months of darkness, -40°F winters. Then 24-hr summer daylight triggers explosive life."},"Lake-Moderated Escarpment":{t:"Lake-Moderated Escarpment",d:"Cliff near large lake where thermal moderation creates uniquely warm microclimate enabling wine and farming at impossible latitudes."},"Prairie Elevation Anomaly":{t:"Prairie Elevation Anomaly",d:"Highland rising from flat prairie, high enough for forest where surroundings are grassland. Often escaped glaciation, preserving ancient species."},"Maritime Valley":{t:"Maritime Valley",d:"Inland valley receiving maritime influence through coastal mountain gaps—mild wet winters, warm dry summers. Valley traps warmth, extends growing season."},"High Desert Transition":{t:"High Desert Transition",d:"Ecotone where two desert ecosystems meet at elevation change. Mixing of species from both creates unique biodiversity found in neither alone."},"Island Maritime":{t:"Island Maritime",d:"Water on all sides moderates temps more than mainland coasts. Rain shadow islands can be surprisingly dry and sunny while maintaining mild temps year-round."},"High Altitude Desert":{t:"High Altitude Desert",d:"Desert at 7,000+ ft. Thin dry air, intense solar radiation, extreme 40°F+ day-night swings. Crystal-clear skies year-round."},"Desert Canyon":{t:"Desert Canyon",d:"Deep gorges through desert rock with complex microclimates. North-facing walls cooler, canyon floors support oases in barren landscape."},"Boreal Lake District":{t:"Boreal Lake District",d:"Thousands of glacial lakes in boreal forest—cold, deep, clean. Some of the largest remaining true wilderness."},"Limestone Savanna":{t:"Limestone Savanna",d:"Open woodland over limestone with karst springs, caves, underground rivers. Crystal-clear swimming holes where water surfaces."},"Island Mediterranean":{t:"Island Mediterranean",d:"Island with Mediterranean climate. Unique endemic species evolved in isolation."},"Arctic Alpine":{t:"Arctic Alpine",d:"Above tree line in arctic regions. Some of the oldest exposed rock on Earth—up to 4 billion years."},"Boreal Maritime":{t:"Boreal Maritime",d:"Boreal forest meets ocean—cold-adapted trees, rocky coastline, fog, granite headlands, productive cold-water fisheries."},"Volcanic Highland Basin":{t:"Volcanic Highland Basin",d:"High-elevation valley in volcanic terrain. Rich soil, moderate temps year-round. 'Eternal spring' conditions supporting civilizations for millennia."},"Coastal Desert":{t:"Coastal Desert",d:"Desert bordering ocean—cold upwelling creates stable dry conditions. Barren hills plunging into rich blue waters teeming with life."},"Temperate Highland Forest":{t:"Temperate Highland Forest",d:"Cool mountain forest at subtropical latitudes—refuge for species needing cooler temps, like Monarch butterfly overwintering grounds."},"Tropical Lowland Rainforest":{t:"Tropical Lowland Rainforest",d:"Dense tropical forest below 3,000 ft. Most species-rich terrestrial ecosystem—100+ tree species per acre."},"Desert Island Marine":{t:"Desert Island Marine",d:"Desert island surrounded by rich marine ecosystems. Cold upwelling feeds ocean life while island remains barren."},"Grass-Stabilized Dune Field":{t:"Grass-Stabilized Dune Field",d:"Sand dunes held by grass roots. If disturbed, dunes reactivate. Nebraska's Sandhills are the largest in the Western Hemisphere."},"Karst Limestone Plateau":{t:"Karst Limestone Plateau",d:"Elevated dissolved limestone—sinkholes, caves, springs producing the purest water anywhere."},"Unglaciated Plateau":{t:"Unglaciated Plateau",d:"Highland never covered by ice-age glaciers, preserving original rugged topography while surroundings were scraped flat."},"Subtropical Swamp Forest":{t:"Subtropical Swamp Forest",d:"Seasonally flooded forested wetland. Bald cypress 'knees' for gas exchange. Among most productive temperate ecosystems."},"Steppe Grassland":{t:"Steppe Grassland",d:"Vast treeless plains with grasses adapted to semi-arid conditions. Millennia of grass built deep rich topsoil."},"Semi-Arid Steppe":{t:"Semi-Arid Steppe",d:"Between desert and grassland, 10–20 in rain/yr. Bunchgrasses and sagebrush."},"Northern Mixed-Grass Prairie":{t:"Northern Mixed-Grass Prairie",d:"Transition between shortgrass and tallgrass prairie. Vast ranching and the darkest night skies on Earth."},"Hot Desert Alluvial":{t:"Hot Desert Alluvial",d:"Gently sloping desert bajada supporting saguaros that can live 200+ years and weigh 6 tons full of water."},"Chihuahuan Desert":{t:"Chihuahuan Desert",d:"Largest North American desert. Higher, cooler, wetter than Sonoran. More grassland, fewer cacti, more diverse reptiles."},"High Desert Steppe":{t:"High Desert Steppe",d:"Semi-arid grassland at 4,000–7,000+ ft with cold snowy winters. Clearest air and darkest skies."},"Tropical Montane Cloud Forest":{t:"Tropical Montane Cloud Forest",d:"Cloud forests at tropical latitudes with persistent fog. Critical water sources capturing moisture directly from clouds."},"Wind Gap Gorge":{t:"Wind Gap Gorge",d:"A narrow gap cut through a mountain range by a river, creating a natural wind tunnel. The Columbia River Gorge funnels Pacific air inland, creating extreme wind differentials and stacking multiple climate zones in 80 miles."},"Steephead Ravine":{t:"Steephead Ravine",d:"Spring-fed ravine cut backward into a plateau, creating a cool, moist microenvironment harboring ice-age relict species in otherwise hot, flat terrain. Florida's Torreya ravines harbor species stranded since the last glacial retreat."},"Klamath-Siskiyou":{t:"Klamath-Siskiyou Biodiversity",d:"One of the world's most botanically diverse temperate regions. Complex geology (5+ rock types converge) creates hundreds of soil microclimates supporting 3,500+ plant species—more than any other temperate region on Earth."},"Lava Tube":{t:"Lava Tube",d:"Underground tunnel formed by flowing lava—outer lava hardens while interior drains away. Some tubes are miles long. Craters of the Moon has 733+ caves. Interior temps stay constant 25–40°F year-round."}};

G["Cold Air Pool"]={t:"Cold Air Pool",d:"Dense cold air flows downhill and pools in basins like invisible water. On clear, calm nights, these pools can be 40-70 degrees F colder than surrounding ridgelines. Peter Sinks, UT holds the US cold record (-69.3F) because it is a limestone bowl with no air drainage."};
G["Frost Hollow"]={t:"Frost Hollow",d:"A depression that traps cold air so persistently it supports vegetation typically found hundreds of miles farther north. Canaan Valley, WV supports balsam fir bogs that belong in central Canada, not 39N latitude."};
G["Adiabatic Heating"]={t:"Adiabatic Heating",d:"When air descends a mountain, pressure compresses it, converting potential energy to heat at roughly 5.5F per 1,000 ft of descent. The Brookings Effect exploits this: wind descending the Siskiyous arrives 30F warmer."};
G["Foliar Uptake"]={t:"Foliar Uptake",d:"Leaves and needles absorbing water directly from fog, bypassing roots. Coast redwoods get 40% of their water this way via microscopic wax channels on needles."};
G["Subnivean Zone"]={t:"Subnivean Zone",d:"The hidden world between ground and snowpack. Once snow reaches about 9 inches, an insulating pocket forms near 32F regardless of surface temperature. Voles and shrews live entire winters here."};
G["Krummholz"]={t:"Krummholz",d:"German for crooked wood. Stunted flag-shaped trees at alpine treeline. Ground beneath a krummholz mat can be 8F warmer than open air 6 feet above, sheltering mosses and flowers."};
G["Rime Ice"]={t:"Rime Ice",d:"Ice formed when supercooled fog freezes instantly on contact. On Mt. Washington it accumulates at 9 inches per hour, building grotesque horizontal sculptures pointing into the wind."};
G["Inverted Treeline"]={t:"Inverted Treeline",d:"In extreme cold sinks, the treeline is inverted: trees grow on warm ridgelines but die on the cold basin floor. The differential can exceed 70F on a single winter night."};
G["Terpene"]={t:"Terpene",d:"Organic compounds released by plants responsible for the smell of pine forests. They also act as cloud condensation nuclei, literally seeding rain. Redwood groves release enough terpenes to increase local precipitation."};
G["Chihuahuan Desert / Madrean Woodland Transition"]={t:"Chihuahuan Desert / Madrean Woodland Transition",d:"A steep, highly mineralized canyon transition zone where Chihuahuan Desert scrub violently climbs into high-altitude oak woodlands, heavily scarred and sculpted by a century of industrial copper mining."};
G["Ponderosa Pine Forest / Alpine Tundra"]={t:"Ponderosa Pine Forest / Alpine Tundra",d:"A high-altitude volcanic plateau sheltering the largest contiguous Ponderosa pine forest on Earth, crowned by jagged, treeless alpine tundra peaks that violently intercept winter storms."};
G["Sonoran Riparian / Foothill Thornscrub"]={t:"Sonoran Riparian / Foothill Thornscrub",d:"A vital, water-carved green corridor bridging the harsh Sonoran Desert floor with the towering Sierra Madre foothills, supporting dense ribbons of cottonwoods and centuries of human agriculture."};
G["Saguaro"]={t:"Saguaro (Carnegiea gigantea)",d:"Iconic columnar cactus of the Sonoran Desert. Arms usually appear after ~75–100 years; plants can exceed 40 ft and live 150–200+ years. Protected in Arizona (Saguaro National Park & state rules). Gila woodpeckers excavate nest holes; elf owls and other species reuse them. A living climate gauge — recruitment of young saguaros tracks winter rains, grazing history, and urban heat."};
G["Okanagan Desert Steppe"]={t:"Okanagan Desert Steppe",d:"Canada's only classified pocket desert — a rain-shadow basin south of the Monashee rain barrier where sagebrush, antelope brush, and ponderosa pine meet irrigated lake shores. Lake Osoyoos stores summer heat, extending the growing season for vineyards and soft fruits."};
G["Okanagan Bench Viticulture"]={t:"Okanagan Bench Viticulture",d:"South-facing glacio-lacustrine benches with gravelly, well-drained soils — ideal for Vitis vinifera. Diurnal temperature swings concentrate sugars while cool nights preserve acidity."};
G["Similkameen Arid Organic Corridor"]={t:"Similkameen Arid Organic Corridor",d:"A wind-scoured valley west of the Okanagan where organic orchards and vineyards thrive on deep alluvium fed by snowmelt — hotter and drier than Kelowna, with fierce spring winds."};
G["Sonoran Metropolitan Drylands"]={t:"Sonoran Metropolitan Drylands",d:"A basin capital on the coastal plain where tropical latitude meets rain-shadow mountains — infernal pre-monsoon heat, then violent summer convection. The economic and cultural engine of central Sonora."};
G["Madrean Mining Highlands"]={t:"Madrean Mining Highlands",d:"Sky-island margins above the Sonoran Desert floor where copper porphyry deposits meet oak-pine woodland — cooler nights, summer lightning, and a legacy of industrial-scale open-pit mining."};
G["Gulf of California Littoral"]={t:"Gulf of California Littoral",d:"Where the Sonoran Desert plunges into the rich, upwelled waters of the Sea of Cortez — sea breezes, humidity spikes in monsoon, and marine biodiversity rivaling tropical reefs."};
const MC = [];
MC.push(...arizonaSonoraPackLocations);

const WL={
1:[{an:"Spirit Bear (Kermode)",ex:"White-furred black bear — not albino, but a recessive gene. White bears catch 30% more salmon because fish can't see them against the sky."},{an:"Pacific Salmon",ex:"Die after spawning, fertilizing the forest. Bears carry carcasses 50+ meters from streams. Salmon-fed trees grow 3x faster."}],
4:[{an:"Polar Bear",ex:"Fur is transparent and hollow — each shaft funnels UV to black skin beneath. Invisible in infrared."},{an:"Beluga Whale",ex:"3,000+ gather at Churchill River Jul–Aug. They use gravel to exfoliate dead skin — essentially spa treatments."}],
20:[{an:"Elegant Trogon",ex:"Tropical Mexican bird crossing into these exact sky island canyons — nowhere else in the US. Birders spend $2,000+ trips to see one."},{an:"Coatimundi",ex:"Bands of 20-30 cross climate zones daily. Nose so flexible it works like a finger, flipping rocks for scorpions."}],
22:[{an:"California Condor",ex:"9.5-foot wingspan. Big Sur's program brought them back from 22 individuals. They soar fog belt thermals for hours without flapping."},{an:"Sea Otter",ex:"Densest fur of any mammal (1M hairs/sq inch). Wrap in kelp to sleep. Kelp forests they protect absorb 20x more CO2 than terrestrial forests."}],
24:[{an:"Olympic Marmot",ex:"Found ONLY on the Olympic Peninsula. Whistles different alarm calls for eagles (look up) vs coyotes (look around)."},{an:"Banana Slug",ex:"10 inches. Slime = anesthetic. Hermaphrodites that sometimes chew off their partner's reproductive organ post-mating. Nature is metal."}],
26:[{an:"Saguaro Cactus",ex:"Lives 200+ years. Arms only after age 75. Fully hydrated 40-ft saguaro: 6 tons. Gila woodpeckers carve apartments; elf owls move in."},{an:"Gila Monster",ex:"Venomous lizard whose venom contains exendin-4, which became the diabetes drug Byetta. The monster literally saves human lives."}],
29:[{an:"Desert Tortoise",ex:"Survives a year without water. Stores half its weight as water in its bladder. If startled into urinating, can die of dehydration."},{an:"Joshua Tree",ex:"Not a tree — giant yucca. Pollinated exclusively by the yucca moth in one of nature's most specific partnerships."}],
34:[{an:"Hellbender Salamander",ex:"2+ feet long, flat as a pancake. Breathes through skin folds. Needs pristine cold water — its presence means the stream is healthy."},{an:"Synchronous Fireflies",ex:"For 2 weeks in June, fireflies flash in perfect unison — one of only 2 species on Earth. Lottery required (100K apply for 1,800 spots)."}],
48:[{an:"Common Loon",ex:"Nearly solid bones (most birds have hollow) let them dive 200+ ft. Haunting call carries 5+ miles across still water."},{an:"Gray Wolf",ex:"BWCA is one of the only lower-48 places with continuous wolf population. Packs claim 50–100 sq mi."}],
49:[{an:"American Alligator",ex:"Digs 'gator holes' — the only water during droughts, creating oases that save fish, turtles, birds. A keystone ecosystem engineer."},{an:"Crawfish",ex:"500+ species in the US, most in Louisiana. Build mud chimney towers. Entire Cajun cuisine built on one crustacean."}],
64:[{an:"Gray Whale",ex:"Mothers bring calves to Baja lagoons and approach boats — they seem to enjoy human contact. Push calves to surface for tourists to pet."},{an:"Whale Shark",ex:"Largest fish on Earth (40+ ft). Harmless filter feeders. La Paz has one of the world's most accessible populations."}],
84:[{an:"Kodiak Bear",ex:"Largest land predator — up to 1,500 lbs. Eat 80-90 lbs salmon/day during runs. Each bear has a learned fishing technique from its mother."},{an:"All 5 Pacific Salmon",ex:"Navigate back to birth stream using Earth's magnetic field and smell. Decomposing bodies fertilize forest — salmon-fed trees grow 3x faster."}],
};

const FL={CA:"🇨🇦",US:"🇺🇸",MX:"🇲🇽"};
const BCM={"Okanagan Desert Steppe":"#c2410c","Okanagan Bench Viticulture":"#7f1d1d","Similkameen Arid Organic Corridor":"#b45309","Sonoran Metropolitan Drylands":"#dc2626","Madrean Mining Highlands":"#57534e","Gulf of California Littoral":"#0369a1","Chihuahuan Desert / Madrean Woodland Transition":"#9a3412","Ponderosa Pine Forest / Alpine Tundra":"#1e3a8a","Sonoran Riparian / Foothill Thornscrub":"#ea580c","Temperate Rainforest":"#0d9488","Rain Shadow":"#eab308","Tropical Cloud Forest":"#059669","Coastal Fog Zone":"#3b82f6","Temperate Cove Forest":"#22c55e","Hot Desert Alluvial":"#ea580c","Lake-Modified Continental":"#6366f1","Tropical Orographic":"#7e22ce","Maritime Oceanic":"#0891b2","Subarctic Tundra":"#64748b","Lake-Moderated Escarpment":"#4338ca","Prairie Elevation Anomaly":"#65a30d","Maritime Valley":"#b91c1c","High Desert Transition":"#b45309","Island Maritime":"#0ea5e9","High Altitude Desert":"#a16207","Desert Canyon":"#dc2626","Tallgrass Prairie":"#a3e635","Boreal Lake District":"#1e40af","Limestone Savanna":"#ca8a04","Island Mediterranean":"#2563eb","Arctic Alpine":"#64748b","Subtropical Canyon":"#9a3412","Mediterranean Valley":"#8b5cf6","Tropical Montane Cloud Forest":"#059669","Tropical Karst Limestone":"#06b6d4","Coastal Desert":"#f59e0b","Temperate Highland Forest":"#f97316","Tropical Lowland Rainforest":"#065f46","Desert Island Marine":"#0284c7","Boreal Maritime":"#475569","Volcanic Highland Basin":"#c026d3","Sky Island":"#2d6a4f","Northern Mixed-Grass Prairie":"#78716c","Grass-Stabilized Dune Field":"#d97706","Karst Limestone Plateau":"#78716c","Unglaciated Plateau":"#4d7c0f","Subtropical Swamp Forest":"#365314","Steppe Grassland":"#84cc16","Rain Shadow Desert":"#d97706","Semi-Arid Steppe":"#a3a355","Carolinian Zone":"#84cc16","Maritime Subarctic":"#0891b2","Thermal Belt":"#a855f7","High Desert Steppe":"#a3a355","Pygmy Forest":"#166534","Chihuahuan Desert":"#92400e","Wind Gap Gorge":"#0d9488","Steephead Ravine":"#22d3ee","Klamath-Siskiyou":"#065f46","Lava Tube":"#71717a","Channeled Scabland":"#78716c","Cold Air Pool":"#bae6fd","Frost Hollow":"#475569","Adiabatic Heating":"#fbbf24","Fog Drip Ecosystem":"#166534"};
const VIBES=["All","Hidden Gems Only","Wilderness Explorer","Wine & Terroir","Adrenaline Seeker","Cultural Immersion","Extreme Explorer","Marine Explorer","Scenic Road Tripper","Off-Grid Pioneer","Gentleman Farmer","Conservation Explorer","Contemplative Wanderer","Biodiversity Seeker","Forager & Homesteader","Stargazer","Tropical Grower","Desert Dweller","Creative Recluse","Island Dweller","Historic Bohemian","Mountain Athlete","Heritage Wanderer","Okanagan Connoisseur","Sonoran Cosmopolitan","Copper & Coast"];
const REGIONS=[{id:"all",l:"All"},{id:"az",l:"🌵 Arizona"},{id:"ca",l:"🌴 California"},{id:"nm",l:"🏔️ New Mexico"},{id:"son",l:"🇲🇽 Sonora"},{id:"us",l:"🇺🇸 US (all)"},{id:"mx",l:"🇲🇽 Mexico (all)"}];
const SECRETS=new Set([929,910,901,928,1124]);
// Vibrant gradient generator per location - uses biome color + coordinates as seed
// Climate Risk & Comfort data per location - compiled from FEMA NRI, USFS Wildfire Risk,
// DarkSky/go-astronomy.com Bortle ratings, and UTCI thermal comfort modeling
// Risk levels: 1=Very Low, 2=Low, 3=Moderate, 4=High, 5=Very High
// Bortle: 1=Darkest (pristine) to 9=Brightest (inner city)
// UTCI comfort months: count of months where 9°C ≤ UTCI ≤ 26°C (no thermal stress)
const RD={
// Pacific NW & Northern CA
1:{bo:3,bN:"Rural Sky",fl:2,fN:"Zone X",wf:3,wfN:"Moderate",dr:2,drN:"Low",hu:1,huN:"Minimal",ut:5,uR:"Fog moderates extremes; cool maritime influence keeps UTCI comfortable May-Oct"},
2:{bo:4,bN:"Suburban",fl:2,fN:"Zone X",wf:2,wfN:"Low",dr:1,drN:"Very Low",hu:1,huN:"Minimal",ut:7,uR:"Marine layer keeps thermal stress low most of year; rarely exceeds moderate heat stress"},
3:{bo:2,bN:"Dark Sky",fl:1,fN:"Zone X",wf:2,wfN:"Low",dr:1,drN:"Very Low",hu:1,huN:"Minimal",ut:4,uR:"Strong winds and cold reduce comfort months; summer fog creates cool stress periods"},
4:{bo:2,bN:"Dark Sky",fl:1,fN:"Zone X",wf:1,wfN:"Very Low",dr:1,drN:"Very Low",hu:1,huN:"Minimal",ut:3,uR:"Subarctic conditions; strong cold stress Oct-Apr; brief comfortable window Jun-Aug"},
// Southwest & Desert
5:{bo:3,bN:"Rural Sky",fl:2,fN:"Zone X",wf:4,wfN:"High",dr:3,drN:"Moderate",hu:1,huN:"Minimal",ut:6,uR:"Mediterranean climate ideal for comfort; fire risk from chaparral and Santa Ana winds"},
6:{bo:4,bN:"Suburban",fl:2,fN:"Zone X",wf:3,wfN:"Moderate",dr:4,drN:"High",hu:1,huN:"Minimal",ut:8,uR:"Year-round mild temps; low humidity maximizes comfort; drought is primary risk"},
7:{bo:3,bN:"Rural Sky",fl:3,fN:"Zone AE",wf:2,wfN:"Low",dr:3,drN:"Moderate",hu:2,huN:"Low",ut:7,uR:"Valley floor heat in summer pushes UTCI into moderate heat stress Jun-Sep"},
8:{bo:4,bN:"Suburban",fl:2,fN:"Zone X",wf:3,wfN:"Moderate",dr:3,drN:"Moderate",hu:1,huN:"Minimal",ut:7,uR:"Elevation moderates desert heat; comfortable spring and fall shoulder seasons"},
9:{bo:2,bN:"Dark Sky",fl:2,fN:"Zone X",wf:3,wfN:"Moderate",dr:4,drN:"High",hu:1,huN:"Minimal",ut:5,uR:"Extreme summer heat stress (UTCI >46°C); comfortable Oct-Apr; pristine dark skies"},
10:{bo:3,bN:"Rural Sky",fl:3,fN:"Zone AE",wf:2,wfN:"Low",dr:4,drN:"High",hu:1,huN:"Minimal",ut:6,uR:"Desert canyon creates thermal inversions; comfortable spring/fall; extreme summer heat"},
// Rocky Mountains
11:{bo:3,bN:"Rural Sky",fl:2,fN:"Zone X",wf:3,wfN:"Moderate",dr:2,drN:"Low",hu:1,huN:"Minimal",ut:4,uR:"High altitude cold stress in winter; short comfortable summer; excellent air quality"},
12:{bo:2,bN:"Dark Sky",fl:2,fN:"Zone X",wf:4,wfN:"High",dr:3,drN:"Moderate",hu:1,huN:"Minimal",ut:4,uR:"Wildfire risk elevated by pine beetle kill; cold winters; dry air reduces felt temperature"},
13:{bo:4,bN:"Suburban",fl:2,fN:"Zone X",wf:3,wfN:"Moderate",dr:2,drN:"Low",hu:1,huN:"Minimal",ut:5,uR:"Urban heat island mitigated by altitude; comfortable Jun-Sep; cold stress Nov-Mar"},
// Great Plains & Midwest
14:{bo:3,bN:"Rural Sky",fl:3,fN:"Zone AE",wf:1,wfN:"Very Low",dr:3,drN:"Moderate",hu:3,huN:"Moderate",ut:5,uR:"Tornado alley exposure; humid summers push heat index up; cold winters"},
15:{bo:4,bN:"Suburban",fl:2,fN:"Zone X",wf:1,wfN:"Very Low",dr:2,drN:"Low",hu:3,huN:"Moderate",ut:5,uR:"Continental extremes; summer humidity creates moderate heat stress; harsh winter wind chill"},
16:{bo:3,bN:"Rural Sky",fl:4,fN:"Zone AE",wf:1,wfN:"Very Low",dr:2,drN:"Low",hu:4,huN:"High",ut:5,uR:"River flooding primary risk; humidity amplifies summer heat stress; cold air pooling in hollows"},
17:{bo:4,bN:"Suburban",fl:3,fN:"Zone AE",wf:1,wfN:"Very Low",dr:2,drN:"Low",hu:3,huN:"Moderate",ut:5,uR:"Prairie wind chill severe in winter; humid heat in summer; tornado risk elevated"},
// Southeast & Gulf
18:{bo:5,bN:"Suburban",fl:4,fN:"Zone AE",wf:1,wfN:"Very Low",dr:1,drN:"Very Low",hu:5,huN:"Very High",ut:6,uR:"High humidity creates moderate-strong heat stress Jun-Sep; mild winters; flood risk from rivers"},
19:{bo:4,bN:"Suburban",fl:3,fN:"Zone AE",wf:2,wfN:"Low",dr:1,drN:"Very Low",hu:4,huN:"High",ut:6,uR:"Appalachian cove forest moderates extremes; humidity is primary discomfort driver"},
20:{bo:5,bN:"Suburban",fl:3,fN:"Zone AE",wf:1,wfN:"Very Low",dr:1,drN:"Very Low",hu:4,huN:"High",ut:6,uR:"Piedmont humidity; comfortable Mar-May and Oct-Nov; summer heat stress moderate"},
21:{bo:4,bN:"Suburban",fl:4,fN:"Zone A",wf:1,wfN:"Very Low",dr:1,drN:"Very Low",hu:5,huN:"Very High",ut:5,uR:"Subtropical; strong heat stress Jun-Sep; high flood risk from Gulf hurricanes and rainfall"},
22:{bo:5,bN:"Suburban",fl:3,fN:"Zone X500",wf:2,wfN:"Low",dr:2,drN:"Low",hu:4,huN:"High",ut:6,uR:"Smoky Mountain moisture; rhododendron canopy creates cool microzones in summer"},
// Northeast & Mid-Atlantic
23:{bo:5,bN:"Suburban",fl:3,fN:"Zone AE",wf:1,wfN:"Very Low",dr:1,drN:"Very Low",hu:3,huN:"Moderate",ut:5,uR:"Coastal storm surge risk; comfortable May-Oct; nor'easter wind chill in winter"},
24:{bo:4,bN:"Suburban",fl:2,fN:"Zone X",wf:1,wfN:"Very Low",dr:1,drN:"Very Low",hu:3,huN:"Moderate",ut:4,uR:"Northern latitude shortens comfort season; beautiful fall; harsh winter cold stress"},
25:{bo:3,bN:"Rural Sky",fl:2,fN:"Zone X",wf:1,wfN:"Very Low",dr:1,drN:"Very Low",hu:3,huN:"Moderate",ut:4,uR:"Remote maritime; fog and wind reduce comfort; pristine air quality year-round"},
26:{bo:4,bN:"Suburban",fl:2,fN:"Zone X",wf:1,wfN:"Very Low",dr:1,drN:"Very Low",hu:3,huN:"Moderate",ut:4,uR:"Frost hollow creates extreme inversions; coldest in region; brief pleasant summer"},
27:{bo:3,bN:"Rural Sky",fl:2,fN:"Zone X",wf:1,wfN:"Very Low",dr:1,drN:"Very Low",hu:3,huN:"Moderate",ut:4,uR:"Gorge wind creates significant wind chill; waterfalls moderate humidity; lush but cool"},
28:{bo:4,bN:"Suburban",fl:2,fN:"Zone X",wf:1,wfN:"Very Low",dr:1,drN:"Very Low",hu:2,huN:"Low",ut:4,uR:"High altitude reduces comfort season; thermal belt effect warms slopes above cold valley floor"},
29:{bo:2,bN:"Dark Sky",fl:2,fN:"Zone X",wf:3,wfN:"Moderate",dr:4,drN:"High",hu:1,huN:"Minimal",ut:6,uR:"Desert canyon; extreme diurnal swing; comfortable spring/fall; blazing summer heat"},
30:{bo:4,bN:"Suburban",fl:3,fN:"Zone AE",wf:2,wfN:"Low",dr:2,drN:"Low",hu:2,huN:"Low",ut:5,uR:"Valley floor cold air pooling; temperature inversions trap smog in winter; pleasant summer"},
31:{bo:3,bN:"Rural Sky",fl:2,fN:"Zone X",wf:4,wfN:"High",dr:3,drN:"Moderate",hu:1,huN:"Minimal",ut:5,uR:"Scabland unique terrain; fire risk from grassland/shrub; cold continental winters"},
// More Pacific NW
32:{bo:3,bN:"Rural Sky",fl:2,fN:"Zone X",wf:3,wfN:"Moderate",dr:1,drN:"Very Low",hu:2,huN:"Low",ut:5,uR:"Olympic rain shadow; moderate marine influence; comfortable May-Sep"},
33:{bo:3,bN:"Rural Sky",fl:2,fN:"Zone X",wf:4,wfN:"High",dr:2,drN:"Low",hu:1,huN:"Minimal",ut:5,uR:"Klamath fire-adapted ecosystem; serpentine soils; warm dry summers; botanical diversity"},
34:{bo:3,bN:"Rural Sky",fl:2,fN:"Zone X",wf:3,wfN:"Moderate",dr:1,drN:"Very Low",hu:2,huN:"Low",ut:4,uR:"Heavy annual rainfall; moss and fern adapted; mild year-round but persistent dampness"},
// Hawaii & tropical
35:{bo:4,bN:"Suburban",fl:3,fN:"Zone AE",wf:2,wfN:"Low",dr:2,drN:"Low",hu:3,huN:"Moderate",ut:10,uR:"Tropical maritime; UTCI comfortable nearly year-round due to trade winds; minimal seasonal variation"},
36:{bo:3,bN:"Rural Sky",fl:2,fN:"Zone X",wf:2,wfN:"Low",dr:2,drN:"Low",hu:3,huN:"Moderate",ut:10,uR:"Elevation creates cooler microclimate above tropical lowlands; trade wind ventilation"},
// More western
37:{bo:2,bN:"Dark Sky",fl:1,fN:"Zone X",wf:3,wfN:"Moderate",dr:2,drN:"Low",hu:1,huN:"Minimal",ut:4,uR:"Dense old-growth canopy; Pacific moisture; cool even in summer; exceptional dark skies"},
38:{bo:3,bN:"Rural Sky",fl:2,fN:"Zone X",wf:3,wfN:"Moderate",dr:2,drN:"Low",hu:1,huN:"Minimal",ut:5,uR:"Volcanic soil heat retention; lava tubes maintain constant 42°F; unique thermal environment"},
39:{bo:4,bN:"Suburban",fl:3,fN:"Zone AE",wf:1,wfN:"Very Low",dr:1,drN:"Very Low",hu:4,huN:"High",ut:6,uR:"Barrier island hurricane exposure; warm Gulf waters; salt spray; subtropical humidity"},
40:{bo:3,bN:"Rural Sky",fl:2,fN:"Zone X",wf:3,wfN:"Moderate",dr:2,drN:"Low",hu:1,huN:"Minimal",ut:5,uR:"Crater lake elevation; heavy snowfall; fire-prone ponderosa; dark sky candidate"},
41:{bo:2,bN:"Dark Sky",fl:2,fN:"Zone X",wf:2,wfN:"Low",dr:3,drN:"Moderate",hu:1,huN:"Minimal",ut:5,uR:"High prairie; extreme continental climate; pristine dark skies (Bortle 2); drought-prone"},
42:{bo:3,bN:"Rural Sky",fl:2,fN:"Zone X",wf:3,wfN:"Moderate",dr:2,drN:"Low",hu:2,huN:"Low",ut:5,uR:"Dune field moisture trapping; fire-adapted coastal prairie; moderate maritime influence"},
43:{bo:3,bN:"Rural Sky",fl:2,fN:"Zone X",wf:2,wfN:"Low",dr:2,drN:"Low",hu:2,huN:"Low",ut:5,uR:"Karst terrain; underground drainage reduces flood risk; limestone moderates temperature"},
44:{bo:4,bN:"Suburban",fl:3,fN:"Zone AE",wf:1,wfN:"Very Low",dr:1,drN:"Very Low",hu:3,huN:"Moderate",ut:5,uR:"Tallgrass prairie; spring flooding risk; humid continental; tornado corridor"},
45:{bo:3,bN:"Rural Sky",fl:2,fN:"Zone X",wf:2,wfN:"Low",dr:2,drN:"Low",hu:2,huN:"Low",ut:4,uR:"Ravine microclimate creates thermal refuge; steephead springs maintain constant temperature"},
46:{bo:4,bN:"Suburban",fl:2,fN:"Zone X",wf:2,wfN:"Low",dr:1,drN:"Very Low",hu:3,huN:"Moderate",ut:5,uR:"Unglaciated plateau; unique soil chemistry; humid but moderate; ancient landscape"},
47:{bo:3,bN:"Rural Sky",fl:2,fN:"Zone X",wf:3,wfN:"Moderate",dr:3,drN:"Moderate",hu:1,huN:"Minimal",ut:6,uR:"Thermal belt phenomenon; warm air rises, cold sinks below; unique inversion comfort zone"},
48:{bo:2,bN:"Dark Sky",fl:1,fN:"Zone X",wf:3,wfN:"Moderate",dr:2,drN:"Low",hu:2,huN:"Low",ut:3,uR:"Boreal maritime; extreme cold stress in winter; brief but sublime summer; spectacular aurora"},
49:{bo:4,bN:"Suburban",fl:4,fN:"Zone VE",wf:1,wfN:"Very Low",dr:1,drN:"Very Low",hu:5,huN:"Very High",ut:6,uR:"Coastal flood zone VE (velocity/wave action); hurricane storm surge; subtropical humidity"},
50:{bo:4,bN:"Suburban",fl:3,fN:"Zone AE",wf:1,wfN:"Very Low",dr:1,drN:"Very Low",hu:4,huN:"High",ut:5,uR:"Limestone karst aquifer; sinkhole risk; humid subtropical; pleasant spring/fall"},
// Canada
51:{bo:3,bN:"Rural Sky",fl:2,fN:"Low",wf:3,wfN:"Moderate",dr:2,drN:"Low",hu:2,huN:"Low",ut:3,uR:"Pacific maritime moderated; heavy rain but mild; short comfort window; pristine air"},
52:{bo:2,bN:"Dark Sky",fl:1,fN:"Very Low",wf:2,wfN:"Low",dr:1,drN:"Very Low",hu:2,huN:"Low",ut:3,uR:"Extreme subarctic; very strong cold stress 7+ months; midnight sun summer comfort"},
53:{bo:3,bN:"Rural Sky",fl:2,fN:"Low",wf:3,wfN:"Moderate",dr:2,drN:"Low",hu:2,huN:"Low",ut:3,uR:"Rocky Mountain alpine; chinook winds create rapid warming; brief summer comfort"},
54:{bo:3,bN:"Rural Sky",fl:2,fN:"Low",wf:3,wfN:"Moderate",dr:2,drN:"Low",hu:2,huN:"Low",ut:3,uR:"Okanagan rain shadow; warmest area in Canada; wildfire risk from pine forests"},
55:{bo:4,bN:"Suburban",fl:2,fN:"Low",wf:1,wfN:"Very Low",dr:1,drN:"Very Low",hu:3,huN:"Moderate",ut:4,uR:"Maritime moderated; fog frequency; comfortable Jul-Sep; mild winter by Canadian standards"},
56:{bo:3,bN:"Rural Sky",fl:2,fN:"Low",wf:2,wfN:"Low",dr:1,drN:"Very Low",hu:2,huN:"Low",ut:3,uR:"Newfoundland maritime subarctic; fierce winds; icebergs moderate nearby water temps"},
57:{bo:3,bN:"Rural Sky",fl:2,fN:"Low",wf:2,wfN:"Low",dr:1,drN:"Very Low",hu:2,huN:"Low",ut:3,uR:"Coastal BC temperate rainforest; mild but very wet; excellent air quality"},
58:{bo:2,bN:"Dark Sky",fl:1,fN:"Very Low",wf:3,wfN:"Moderate",dr:2,drN:"Low",hu:1,huN:"Minimal",ut:2,uR:"Subarctic continental; extreme cold stress (-40°C+); aurora belt; very dark skies"},
// Mexico
59:{bo:4,bN:"Suburban",fl:2,fN:"Low",wf:2,wfN:"Low",dr:3,drN:"Moderate",hu:1,huN:"Minimal",ut:9,uR:"High altitude basin; mild year-round; low humidity ideal for comfort; UV exposure high"},
60:{bo:5,bN:"Suburban",fl:3,fN:"Moderate",wf:1,wfN:"Very Low",dr:2,drN:"Low",hu:3,huN:"Moderate",ut:8,uR:"Tropical orographic; altitude tempers heat; comfortable year-round at elevation"},
61:{bo:3,bN:"Rural Sky",fl:2,fN:"Low",wf:2,wfN:"Low",dr:3,drN:"Moderate",hu:1,huN:"Minimal",ut:9,uR:"Colonial highland; spring-like year-round; UTCI in comfort zone 9+ months; ideal human climate"},
62:{bo:3,bN:"Rural Sky",fl:2,fN:"Low",wf:2,wfN:"Low",dr:4,drN:"High",hu:1,huN:"Minimal",ut:8,uR:"High altitude desert basin; extreme clarity; cold nights; comfortable days most of year"},
63:{bo:5,bN:"Suburban",fl:3,fN:"Moderate",wf:1,wfN:"Very Low",dr:1,drN:"Very Low",hu:4,huN:"High",ut:7,uR:"Caribbean coast; hurricane exposure; tropical humidity; sea breeze provides relief"},
64:{bo:4,bN:"Suburban",fl:2,fN:"Low",wf:2,wfN:"Low",dr:2,drN:"Low",hu:2,huN:"Low",ut:9,uR:"Pacific highland; temperate year-round at elevation; dry season Nov-May very comfortable"},
65:{bo:5,bN:"Suburban",fl:3,fN:"Moderate",wf:1,wfN:"Very Low",dr:1,drN:"Very Low",hu:5,huN:"Very High",ut:5,uR:"Tropical lowland jungle; very strong heat stress in summer; cenotes provide cool refuge"},
66:{bo:3,bN:"Rural Sky",fl:2,fN:"Low",wf:2,wfN:"Low",dr:3,drN:"Moderate",hu:1,huN:"Minimal",ut:8,uR:"Volcanic highland; cool nights from altitude; UV intense; dust minimal; excellent comfort"},
67:{bo:4,bN:"Suburban",fl:4,fN:"High",wf:1,wfN:"Very Low",dr:1,drN:"Very Low",hu:4,huN:"High",ut:6,uR:"Mangrove coast; hurricane zone; tropical storm surge flooding; humidity high year-round"},
68:{bo:3,bN:"Rural Sky",fl:2,fN:"Low",wf:1,wfN:"Very Low",dr:2,drN:"Low",hu:3,huN:"Moderate",ut:7,uR:"Karst limestone; cenote cooling effect; tropical but ventilated by coast; moderate comfort"},
// Climate anomaly locations (70s-80s)
75:{bo:3,bN:"Rural Sky",fl:3,fN:"Zone AE",wf:2,wfN:"Low",dr:2,drN:"Low",hu:3,huN:"Moderate",ut:5,uR:"Cold air pooling creates frost pocket; extreme inversions possible; unique microclimate"},
76:{bo:3,bN:"Rural Sky",fl:2,fN:"Zone X",wf:2,wfN:"Low",dr:1,drN:"Very Low",hu:3,huN:"Moderate",ut:4,uR:"Lake-effect moisture and temperature moderation; lake breeze cooling effect in summer"},
77:{bo:4,bN:"Suburban",fl:3,fN:"Zone AE",wf:1,wfN:"Very Low",dr:1,drN:"Very Low",hu:3,huN:"Moderate",ut:5,uR:"Prairie meets elevation; unusual climate gradient; continental with upland moderation"},
78:{bo:3,bN:"Rural Sky",fl:2,fN:"Zone X",wf:2,wfN:"Low",dr:2,drN:"Low",hu:2,huN:"Low",ut:4,uR:"Leeward rain shadow; dramatically drier than windward side; enhanced solar exposure"},
79:{bo:4,bN:"Suburban",fl:4,fN:"Zone VE",wf:1,wfN:"Very Low",dr:1,drN:"Very Low",hu:5,huN:"Very High",ut:6,uR:"Coastal barrier; full hurricane exposure; tidal flooding; subtropical heat and humidity"},
80:{bo:3,bN:"Rural Sky",fl:2,fN:"Zone X",wf:3,wfN:"Moderate",dr:2,drN:"Low",hu:2,huN:"Low",ut:5,uR:"Wind gap creates natural wind tunnel; enhanced cooling/wind chill; unique thermal regime"},
81:{bo:4,bN:"Suburban",fl:2,fN:"Zone X",wf:2,wfN:"Low",dr:1,drN:"Very Low",hu:3,huN:"Moderate",ut:5,uR:"Thermal belt protects from valley frost; fruit-growing microclimate; moderate year-round"},
82:{bo:2,bN:"Dark Sky",fl:2,fN:"Zone X",wf:3,wfN:"Moderate",dr:4,drN:"High",hu:1,huN:"Minimal",ut:6,uR:"Lava tube constant 42°F underground; surface is high desert; extreme diurnal range"},
83:{bo:4,bN:"Suburban",fl:3,fN:"Zone AE",wf:1,wfN:"Very Low",dr:1,drN:"Very Low",hu:4,huN:"High",ut:5,uR:"Steephead spring maintains 68°F year-round; surrounding forest is humid subtropical"},
84:{bo:1,bN:"Pristine",fl:1,fN:"Zone X",wf:2,wfN:"Low",dr:1,drN:"Very Low",hu:1,huN:"Minimal",ut:2,uR:"One of darkest skies on Earth (Bortle 1); extreme cold; permafrost; aurora zone"},
85:{bo:3,bN:"Rural Sky",fl:3,fN:"Zone AE",wf:2,wfN:"Low",dr:2,drN:"Low",hu:3,huN:"Moderate",ut:5,uR:"Geothermal influence; unique soil warming; extended growing season from underground heat"},
86:{bo:4,bN:"Suburban",fl:2,fN:"Zone X",wf:2,wfN:"Low",dr:1,drN:"Very Low",hu:3,huN:"Moderate",ut:5,uR:"Cove forest shelters from wind; exceptionally fertile soil creates lush microhabitat"},
87:{bo:3,bN:"Rural Sky",fl:2,fN:"Zone X",wf:2,wfN:"Low",dr:2,drN:"Low",hu:2,huN:"Low",ut:5,uR:"Rain shadow effect intensified by channeled topography; dry oasis in wet region"},
88:{bo:2,bN:"Dark Sky",fl:2,fN:"Zone X",wf:2,wfN:"Low",dr:3,drN:"Moderate",hu:1,huN:"Minimal",ut:5,uR:"Volcanic Highland; pristine dark sky; high altitude UV; wide diurnal temperature range"},
// New V11 locations
110:{bo:1,bN:"Pristine",fl:1,fN:"Zone X",wf:1,wfN:"Very Low",dr:5,drN:"Extreme",hu:1,huN:"Minimal",ut:4,uR:"Extreme heat stress Jun-Sep (UTCI >46°C at Furnace Creek); comfortable Nov-Mar; darkest skies in lower 48 (Bortle 1, DarkSky Gold Tier certified)"},
111:{bo:4,bN:"Suburban",fl:5,fN:"Zone VE/AE",wf:1,wfN:"Very Low",dr:1,drN:"Very Low",hu:5,huN:"Very High",ut:5,uR:"FEMA high-risk flood zone; sea level rise primary threat; strong heat stress Jun-Oct from combined heat and humidity; comfortable Dec-Apr dry season"},
112:{bo:2,bN:"Dark Sky",fl:1,fN:"Zone X",wf:1,wfN:"Very Low",dr:4,drN:"High",hu:1,huN:"Minimal",ut:5,uR:"Adjacent to White Sands Missile Range; dark sky park; gypsum reflects moonlight creating unique nightscape; extreme heat in summer, cold winter nights"},
113:{bo:3,bN:"Rural Sky",fl:2,fN:"Zone X",wf:1,wfN:"Very Low",dr:1,drN:"Very Low",hu:3,huN:"Moderate",ut:4,uR:"Lake Superior moderates temperatures within 2mi of shore; ice caves form when lake surface freezes (decreasing frequency due to warming); comfortable Jun-Sep"},
114:{bo:3,bN:"Rural Sky",fl:3,fN:"Zone AE",wf:2,wfN:"Low",dr:1,drN:"Very Low",hu:4,huN:"High",ut:5,uR:"Most visited NP; cove forests create humidity pockets; moderate heat stress in summer valleys; elevation provides relief; excellent spring/fall comfort"},
115:{bo:1,bN:"Pristine",fl:2,fN:"Zone X",wf:4,wfN:"High",dr:2,drN:"Low",hu:2,huN:"Low",ut:3,uR:"Glaciers retreating rapidly (26 remain, est. gone by 2030-2040); wildfire smoke season Aug-Sep degrades air quality; Bortle 1 skies; strong cold stress Oct-May"},
116:{bo:2,bN:"Dark Sky",fl:2,fN:"Zone X",wf:2,wfN:"Low",dr:3,drN:"Moderate",hu:1,huN:"Minimal",ut:4,uR:"Among darkest skies in lower 48 (Bortle 2); NPS dark sky programs; extreme continental climate with 85°F annual temperature swing; comfortable May-Jun and Sep-Oct"},
117:{bo:1,bN:"Pristine",fl:1,fN:"Zone X",wf:2,wfN:"Low",dr:1,drN:"Very Low",hu:2,huN:"Low",ut:2,uR:"Darkest skies in N. America (Bortle 1); extreme cold stress Oct-Apr (-40°F possible); comfortable only Jun-Aug; permafrost thawing creates infrastructure risk"},
70:{bo:3,bN:"Rural Sky",fl:2,fN:"Zone X",wf:3,wfN:"Moderate",dr:2,drN:"Low",hu:2,huN:"Low",ut:5,uR:"Gorge wind chill significant; wind gap funnels Columbia River air; moderate fire risk from surrounding forests"},
71:{bo:3,bN:"Rural Sky",fl:2,fN:"Zone X",wf:4,wfN:"High",dr:2,drN:"Low",hu:1,huN:"Minimal",ut:5,uR:"Fire-adapted serpentine ecosystem; unique botanical diversity; warm dry summers"},
72:{bo:3,bN:"Rural Sky",fl:2,fN:"Zone X",wf:2,wfN:"Low",dr:1,drN:"Very Low",hu:1,huN:"Minimal",ut:4,uR:"Coastal fog dominates; marine layer keeps temps stable; fog drip sustains redwoods"},
73:{bo:2,bN:"Dark Sky",fl:1,fN:"Zone X",wf:2,wfN:"Low",dr:4,drN:"High",hu:1,huN:"Minimal",ut:6,uR:"Exceptional dark skies (near Bortle 2); high desert; comfortable spring/fall; McDonald Observatory nearby"},
74:{bo:4,bN:"Suburban",fl:2,fN:"Zone X",wf:2,wfN:"Low",dr:1,drN:"Very Low",hu:3,huN:"Moderate",ut:5,uR:"Thermal belt protects from valley frost; extended growing season; moderate Appalachian humidity"},
89:{bo:3,bN:"Rural Sky",fl:2,fN:"Zone X",wf:1,wfN:"Very Low",dr:1,drN:"Very Low",hu:2,huN:"Low",ut:3,uR:"Lake Superior moderation; harsh winters with heavy lake-effect snow; brief but pleasant summers"},
90:{bo:3,bN:"Rural Sky",fl:3,fN:"Zone AE",wf:4,wfN:"High",dr:3,drN:"Moderate",hu:1,huN:"Minimal",ut:5,uR:"Rogue Valley fire risk high from surrounding forests; smoke season Aug-Sep; valley inversions trap air"},
91:{bo:4,bN:"Suburban",fl:5,fN:"Zone VE",wf:1,wfN:"Very Low",dr:1,drN:"Very Low",hu:5,huN:"Very High",ut:5,uR:"FEMA Zone VE - velocity wave action zone; direct hurricane landfall risk; barrier island erosion; overwash flooding"},
100:{bo:4,bN:"Suburban",fl:3,fN:"Moderate",wf:1,wfN:"Very Low",dr:1,drN:"Very Low",hu:4,huN:"High",ut:6,uR:"Lagoon microclimate; Caribbean hurricane exposure; cenote-fed freshwater meets coast; tropical humidity"},
101:{bo:2,bN:"Dark Sky",fl:2,fN:"Zone X",wf:1,wfN:"Very Low",dr:2,drN:"Low",hu:1,huN:"Minimal",ut:3,uR:"Record US cold air pooling site (-56°F recorded); extreme inversions; only comfortable Jun-Aug"},
102:{bo:3,bN:"Rural Sky",fl:3,fN:"Zone AE",wf:1,wfN:"Very Low",dr:1,drN:"Very Low",hu:3,huN:"Moderate",ut:4,uR:"Appalachian frost hollow; river flooding risk; cold air pooling; comfortable May-Oct"},
103:{bo:3,bN:"Rural Sky",fl:2,fN:"Zone X",wf:2,wfN:"Low",dr:1,drN:"Very Low",hu:2,huN:"Low",ut:5,uR:"Rain shadow from Olympic Mountains; anomalously dry for Pacific NW; maritime moderated"},
104:{bo:3,bN:"Rural Sky",fl:2,fN:"Zone X",wf:3,wfN:"Moderate",dr:1,drN:"Very Low",hu:1,huN:"Minimal",ut:6,uR:"Banana belt effect from offshore currents; warmest spot on Oregon coast; fire risk from surrounding forests"},
105:{bo:3,bN:"Rural Sky",fl:1,fN:"Zone X",wf:1,wfN:"Very Low",dr:1,drN:"Very Low",hu:3,huN:"Moderate",ut:1,uR:"Extreme wind chill (world record 231 mph wind); summit UTCI comfortable only a few July days; observatory-grade exposure"},
106:{bo:4,bN:"Suburban",fl:3,fN:"Zone AE",wf:2,wfN:"Low",dr:1,drN:"Very Low",hu:4,huN:"High",ut:5,uR:"Subtropical erosion canyon; humid year-round; flash flood risk in canyon; red clay soils"},
107:{bo:1,bN:"Pristine",fl:1,fN:"Very Low",wf:2,wfN:"Low",dr:2,drN:"Low",hu:1,huN:"Minimal",ut:2,uR:"World's smallest desert; subarctic; Bortle 1 pristine skies; extreme cold Oct-Apr; permafrost"},
108:{bo:3,bN:"Rural Sky",fl:2,fN:"Zone X",wf:2,wfN:"Low",dr:1,drN:"Very Low",hu:1,huN:"Minimal",ut:4,uR:"Fog drip critical for redwood survival; marine layer creates constant moisture; mild year-round"},
901:{bo:3,bN:"Rural Sky",fl:3,fN:"Zone AE",wf:4,wfN:"High",dr:3,drN:"Moderate",hu:2,huN:"Low",ut:9,uR:"Monsoon mudslides and retaining-wall failures in canyon; wildfire in Mule Mountains; medical isolation. UTCI comfortable most of year at altitude."},
902:{bo:2,bN:"Dark Sky",fl:2,fN:"Zone X",wf:5,wfN:"Very High",dr:4,drN:"High",hu:1,huN:"Minimal",ut:5,uR:"Megafire and post-fire flood risk; narrow summer comfort window; elite dark skies; UV extreme at altitude."},
903:{bo:4,bN:"Suburban",fl:3,fN:"Zone AE",wf:2,wfN:"Low",dr:5,drN:"Extreme",hu:4,huN:"High",ut:7,uR:"Heat and agricultural drought; riparian corridor; border corridor logistics — travel and water security matter."},
904:{bo:3,bN:"Rural Sky",fl:2,fN:"Zone X",wf:4,wfN:"High",dr:3,drN:"Moderate",hu:2,huN:"Low",ut:6,uR:"Lake Osoyoos moderates shore microclimate; wildfire smoke Aug–Sep; cold-air pooling in draws; excellent air most of year."},
905:{bo:3,bN:"Rural Sky",fl:2,fN:"Zone X",wf:4,wfN:"High",dr:3,drN:"Moderate",hu:2,huN:"Low",ut:6,uR:"Bench sites drain cold air; hail risk during convective storms; irrigation-dependent viticulture concentrates drought exposure."},
906:{bo:3,bN:"Rural Sky",fl:3,fN:"Zone AE",wf:4,wfN:"High",dr:3,drN:"Moderate",hu:2,huN:"Low",ut:6,uR:"Spring wind + dust; Similkameen River flood pulses; organic acreage sensitive to water rights and smoke taint."},
907:{bo:5,bN:"Suburban",fl:3,fN:"Moderate",wf:2,wfN:"Low",dr:5,drN:"Extreme",hu:4,huN:"High",ut:4,uR:"Extreme pre-monsoon heat stress; haboob dust; urban heat island; hurricane remnants rare but Gulf moisture surges."},
908:{bo:3,bN:"Rural Sky",fl:2,fN:"Zone X",wf:4,wfN:"High",dr:3,drN:"Moderate",hu:2,huN:"Low",ut:7,uR:"Elevation tempers Sonoran furnace; summer lightning ignitions; legacy mine tailings and dust on dry days."},
909:{bo:4,bN:"Suburban",fl:4,fN:"Zone AE",wf:1,wfN:"Very Low",dr:2,drN:"Low",hu:5,huN:"Very High",ut:8,uR:"Tropical cyclone moisture + surge risk; humidity amplifies heat index Jul–Sep; sea breeze relief afternoons."},
};
Object.assign(RD, arizonaSonoraRiskPatch);


// UTCI stress categories (°C): <-40 Extreme Cold, -40 to -27 Very Strong Cold, -27 to -13 Strong Cold, 
// -13 to 0 Moderate Cold, 0-9 Slight Cold, 9-26 No Stress, 26-28 Slight Heat, 28-32 Moderate Heat,
// 32-38 Strong Heat, 38-46 Very Strong Heat, >46 Extreme Heat
// Source: Bröde et al. 2012, International Journal of Biometeorology
const UTCI_CAT=["Extreme Cold","Very Strong Cold","Strong Cold","Moderate Cold","Slight Cold","No Stress","Slight Heat","Moderate Heat","Strong Heat","Very Strong Heat","Extreme Heat"];
const RISK_COL={1:"#22c55e",2:"#84cc16",3:"#eab308",4:"#f97316",5:"#ef4444"};
const RISK_LBL={1:"Very Low",2:"Low",3:"Moderate",4:"High",5:"Very High"};
const BORTLE_COL={1:"#1e3a5f",2:"#1e40af",3:"#6366f1",4:"#a78bfa",5:"#c4b5fd",6:"#e2e8f0",7:"#fbbf24",8:"#f97316",9:"#ef4444"};

const GOOGLE_MAPS_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || "";

function formatLatLng(mc){
  const ns=mc.la>=0?"N":"S";
  const ew=mc.ln>=0?"E":"W";
  return `${Math.abs(mc.la).toFixed(2)}°${ns}, ${Math.abs(mc.ln).toFixed(2)}°${ew}`;
}

function locGrad(mc){
  const b=BCM[mc.ty]||"#888";
  const hue=((mc.la*7+mc.ln*3)%360+360)%360;
  const h2=(hue+40)%360;
  const h3=(hue+180)%360;
  const dark=mc.wL<20;
  const wet=mc.ra>60;
  const hot=mc.sH>90;
  if(hot)return`linear-gradient(135deg,#1a0505 0%,${b} 40%,#f59e0b88 70%,#78350f 100%)`;
  if(dark)return`linear-gradient(135deg,#0c1222 0%,${b} 35%,hsl(${h2},45%,25%) 65%,#1e1b4b 100%)`;
  if(wet)return`linear-gradient(135deg,#021a0a 0%,${b} 30%,hsl(${h2},50%,20%) 70%,#064e3b 100%)`;
  return`linear-gradient(135deg,hsl(${hue},35%,12%) 0%,${b} 35%,hsl(${h2},40%,22%) 65%,hsl(${h3},30%,10%) 100%)`;
}

// Landscape scene SVG per biome type
function SceneSVG({mc,h}){
  const ty=mc.ty||"";
  const w=400;
  const desert=ty.includes("Desert")||ty.includes("Adiabatic")||ty.includes("Steppe")||ty.includes("Canyon");
  const alpine=ty.includes("Alpine")||ty.includes("Tundra")||ty.includes("Cold Air");
  const forest=ty.includes("Forest")||ty.includes("Rainforest")||ty.includes("Fog")||ty.includes("Cove");
  const water=ty.includes("Lake")||ty.includes("Marine")||ty.includes("Island")||ty.includes("Swamp")||ty.includes("Shadow");
  const b=BCM[mc.ty]||"#888";
  return(<svg viewBox={`0 0 ${w} ${h||120}`} style={{width:"100%",height:"100%",position:"absolute",inset:0,opacity:.55}} preserveAspectRatio="xMidYMid slice">
    {desert&&<><path d={`M0,${h*0.7} Q100,${h*0.35} 200,${h*0.55} Q300,${h*0.3} 400,${h*0.5} L400,${h} L0,${h}Z`} fill={b} opacity=".3"/><circle cx="320" cy={h*0.2} r="18" fill="#fbbf24" opacity=".25"/><path d={`M0,${h*0.8} Q80,${h*0.65} 160,${h*0.75} Q280,${h*0.6} 400,${h*0.7} L400,${h} L0,${h}Z`} fill={b} opacity=".2"/></>}
    {alpine&&<><path d={`M50,${h*0.3} L120,${h*0.7} L0,${h*0.7}Z`} fill="#94a3b8" opacity=".2"/><path d={`M50,${h*0.3} L80,${h*0.45} L20,${h*0.45}Z`} fill="#e2e8f0" opacity=".15"/><path d={`M200,${h*0.2} L300,${h*0.7} L100,${h*0.7}Z`} fill="#64748b" opacity=".25"/><path d={`M200,${h*0.2} L245,${h*0.4} L155,${h*0.4}Z`} fill="#e2e8f0" opacity=".2"/><path d={`M330,${h*0.35} L400,${h*0.7} L260,${h*0.7}Z`} fill="#475569" opacity=".2"/><path d={`M0,${h*0.7} L400,${h*0.7} L400,${h} L0,${h}Z`} fill={b} opacity=".15"/></>}
    {forest&&<>{[40,100,160,220,280,340].map((x,i)=><ellipse key={i} cx={x+(i%2)*20} cy={h*0.55+i%3*8} rx={30+i%2*15} ry={25+i%3*10} fill={b} opacity={.15+i%3*.05}/>)}<path d={`M0,${h*0.75} Q100,${h*0.65} 200,${h*0.72} Q300,${h*0.63} 400,${h*0.7} L400,${h} L0,${h}Z`} fill={b} opacity=".2"/></>}
    {water&&<><path d={`M0,${h*0.6} Q100,${h*0.5} 200,${h*0.55} Q300,${h*0.45} 400,${h*0.5} L400,${h} L0,${h}Z`} fill={b} opacity=".2"/>{[0,1,2,3].map(i=><path key={i} d={`M${i*110},${h*0.7+i%2*5} Q${i*110+55},${h*0.65+i%2*5} ${i*110+110},${h*0.7+i%2*5}`} fill="none" stroke="#fff" strokeWidth=".5" opacity=".08"/>)}</>}
    {(ty.includes("Prairie")||ty.includes("Grass")||ty.includes("Steppe")||ty.includes("Tallgrass"))&&<><path d={`M0,${h*0.65} Q100,${h*0.58} 200,${h*0.62} Q300,${h*0.55} 400,${h*0.6} L400,${h} L0,${h}Z`} fill={b} opacity=".18"/>{[30,90,150,210,270,330].map((x,i)=><line key={`gr${i}`} x1={x} y1={h*0.6+i%3*3} x2={x+3} y2={h*0.45+i%2*8} stroke={b} strokeWidth=".6" opacity=".12"/>)}<path d={`M0,${h*0.78} Q200,${h*0.72} 400,${h*0.75} L400,${h} L0,${h}Z`} fill={b} opacity=".12"/></>}
    {(ty.includes("Volcanic")||ty.includes("Karst")||ty.includes("Lava")||ty.includes("Limestone"))&&<><path d={`M150,${h*0.25} L220,${h*0.65} L80,${h*0.65}Z`} fill={b} opacity=".2"/><ellipse cx="150" cy={h*0.22} rx="15" ry="5" fill="rgba(255,255,255,.04)"/><path d={`M0,${h*0.65} Q80,${h*0.55} 180,${h*0.6} Q300,${h*0.5} 400,${h*0.58} L400,${h} L0,${h}Z`} fill={b} opacity=".15"/></>}
    {(ty.includes("Maritime")||ty.includes("Valley")||ty.includes("Belt")||ty.includes("Gorge")||ty.includes("Wind")||ty.includes("Ravine")||ty.includes("Hollow")||ty.includes("Scab")||ty.includes("Klamath"))&&!desert&&!alpine&&!forest&&!water&&<><path d={`M0,${h*0.5} Q60,${h*0.35} 120,${h*0.45} Q200,${h*0.3} 280,${h*0.5} Q350,${h*0.35} 400,${h*0.45} L400,${h} L0,${h}Z`} fill={b} opacity=".2"/><path d={`M0,${h*0.7} Q100,${h*0.62} 200,${h*0.68} Q300,${h*0.6} 400,${h*0.65} L400,${h} L0,${h}Z`} fill={b} opacity=".12"/></>}
    {!desert&&!alpine&&!forest&&!water&&!(ty.includes("Prairie")||ty.includes("Grass")||ty.includes("Steppe")||ty.includes("Tallgrass"))&&!(ty.includes("Volcanic")||ty.includes("Karst")||ty.includes("Lava")||ty.includes("Limestone"))&&!(ty.includes("Maritime")||ty.includes("Valley")||ty.includes("Belt")||ty.includes("Gorge")||ty.includes("Wind")||ty.includes("Ravine")||ty.includes("Hollow")||ty.includes("Scab")||ty.includes("Klamath"))&&<><path d={`M0,${h*0.6} Q150,${h*0.4} 300,${h*0.55} L400,${h*0.5} L400,${h} L0,${h}Z`} fill={b} opacity=".2"/><path d={`M0,${h*0.75} Q200,${h*0.65} 400,${h*0.7} L400,${h} L0,${h}Z`} fill={b} opacity=".15"/></>}
  </svg>);
}

function Hero({mc,h,children}){
  return(<div style={{height:h||120,position:"relative",overflow:"hidden",background:locGrad(mc)}}>
    <SceneSVG mc={mc} h={h||120}/>
    <div style={{position:"absolute",inset:0,background:"linear-gradient(180deg,transparent 25%,rgba(62,48,38,.55) 55%,rgba(42,32,26,.88) 100%)"}}/>
    {children}
  </div>);
}

function renderT(t,fn){if(!t||typeof t!=="string")return t;const p=[];let k=0;const re=/(\w[\w\s/()'''-]*)\|(\w[\w\s/()'''-]*)/g;let m;let li=0;while((m=re.exec(t))!==null){if(m.index>li)p.push(<span key={k++}>{t.slice(li,m.index)}</span>);const tm=m[2];p.push(<span key={k++} onClick={e=>{e.stopPropagation();fn(tm)}} style={{color:"var(--mc-accent,#0d9488)",borderBottom:"1px dashed rgba(13,148,136,.45)",cursor:"pointer",fontWeight:600}}>{m[1]}</span>);li=re.lastIndex;}if(li<t.length)p.push(<span key={k++}>{t.slice(li)}</span>);return p.length?p:t;}
function renderParagraphs(text,fn){if(!text||typeof text!=="string")return null;const paras=text.split(/\n\n+/).map((s)=>s.trim()).filter(Boolean);return paras.map((para,i)=><p key={i} className="mc-read" style={{margin:i===0?0:"1.15rem 0 0"}}>{renderT(para,fn)}</p>);}

function GModal({term,onClose}){const e=G[term];if(!e)return null;return(<div onClick={onClose} style={{position:"fixed",inset:0,background:"rgba(15,23,42,.52)",backdropFilter:"blur(18px) saturate(1.2)",zIndex:300,display:"flex",alignItems:"center",justifyContent:"center",padding:20,animation:"fi .15s ease"}}><div onClick={ev=>ev.stopPropagation()} style={{background:"linear-gradient(175deg,#ffffff 0%,#f8fafc 55%,#f1f5f9 100%)",border:"1px solid rgba(13,148,136,.22)",borderRadius:24,padding:"26px 24px",maxWidth:420,width:"100%",maxHeight:"72vh",overflowY:"auto",boxShadow:"0 32px 64px -12px rgba(15,23,42,.35), 0 0 0 1px rgba(255,255,255,.8) inset"}}><div style={{fontSize:8,color:"var(--mc-accent,#0d9488)",letterSpacing:".2em",textTransform:"uppercase",marginBottom:12,fontWeight:700}}>Field guide</div><div style={{fontSize:26,fontFamily:"'Fraunces',Georgia,serif",fontWeight:500,color:"var(--mc-ink,#0f172a)",lineHeight:1.15,marginBottom:16,letterSpacing:"-0.02em"}}>{e.t}</div><p style={{fontSize:15.5,color:"var(--mc-ink-muted)",lineHeight:1.82,margin:0,letterSpacing:"0.01em"}}>{e.d}</p></div></div>);}

function Stat({icon,label,value,color,sub,onClick}){return(<div onClick={onClick} style={{background:"linear-gradient(165deg,rgba(255,255,255,.95) 0%,rgba(248,250,252,.98) 100%)",border:"1px solid var(--mc-border)",borderRadius:14,padding:"11px 13px",cursor:onClick?"pointer":"default",position:"relative",overflow:"hidden",boxShadow:"0 1px 0 rgba(255,255,255,.9) inset, 0 8px 24px -8px rgba(15,23,42,.1)"}}><div style={{position:"absolute",top:0,left:0,right:0,height:3,background:color?`linear-gradient(90deg,${color}66,transparent)`:"none",borderRadius:"14px 14px 0 0"}}/><div style={{fontSize:8.5,color:"var(--mc-ink-muted)",letterSpacing:".08em",textTransform:"uppercase",marginBottom:4,display:"flex",alignItems:"center",gap:5,fontWeight:600}}>{icon&&<span style={{fontSize:11}}>{icon}</span>}{label}</div><div style={{fontSize:18,fontWeight:600,color:color||"var(--mc-ink)",fontFamily:"'Fraunces',Georgia,serif",letterSpacing:"-0.02em"}}>{value}</div>{sub&&<div style={{fontSize:10,color:"var(--mc-ink-muted)",marginTop:3,lineHeight:1.35}}>{sub}</div>}</div>);}

function AdvBar({v}){const c=v>=85?"#ef4444":v>=60?"#f59e0b":v>=40?"#22c55e":"#3b82f6";const l=v>=85?"Extreme":v>=60?"Challenging":v>=40?"Moderate":"Easy";return(<div style={{display:"flex",alignItems:"center",gap:10,width:"100%"}}><div style={{flex:1,height:7,background:"rgba(15,23,42,.07)",borderRadius:6,overflow:"hidden"}}><div style={{width:`${v}%`,height:"100%",background:`linear-gradient(90deg,${c}50,${c})`,borderRadius:6,boxShadow:`0 0 12px ${c}30`}}/></div><span style={{fontSize:11.5,color:c,whiteSpace:"nowrap",fontWeight:700,minWidth:78,textAlign:"right",letterSpacing:"0.02em"}}>{v} · {l}</span></div>);}

function LiveScore({mc}){const rd=RD[mc.id];const utciBonus=rd?(rd.ut*4):0;const riskPenalty=rd?((rd.fl>=4?-8:0)+(rd.wf>=4?-8:0)+(rd.dr>=4?-5:0)+(rd.hu>=4?-5:0)):0;const score=Math.round(((300-Math.abs(mc.sH-75)*3)+(300-Math.abs(mc.wL-20)*2)+(200-mc.ra)+(mc.su*0.6)+(100-mc.aq*2)+(mc.hu<70?50:mc.hu<80?30:10)+utciBonus+riskPenalty)/10);const clamped=Math.max(0,Math.min(100,score));const c=clamped>=70?"#22c55e":clamped>=50?"#eab308":clamped>=30?"#f59e0b":"#ef4444";return(<div style={{position:"relative",width:52,height:52}}><svg viewBox="0 0 52 52" style={{transform:"rotate(-90deg)"}}><circle cx="26" cy="26" r="22" fill="none" stroke="rgba(255,251,245,.12)" strokeWidth="3.5"/><circle cx="26" cy="26" r="22" fill="none" stroke={c} strokeWidth="3.5" strokeLinecap="round" strokeDasharray={`${clamped*1.38} 200`} style={{filter:`drop-shadow(0 0 4px ${c}44)`}}/></svg><div style={{position:"absolute",inset:0,display:"flex",alignItems:"center",justifyContent:"center",flexDirection:"column"}}><span style={{fontSize:14,fontWeight:700,color:c,lineHeight:1}}>{clamped}</span><span style={{fontSize:5.5,color:"rgba(255,251,245,.45)",textTransform:"uppercase",letterSpacing:".05em"}}>Score</span></div></div>);}

function Detail({mc,onClose,isFav,onFav,onTerm,allMC,onNav}){
  const[tab,setTab]=useState("overview");
  const aqC=mc.aq<=12?"#15803d":mc.aq<=20?"#22c55e":mc.aq<=35?"#84cc16":mc.aq<=50?"#eab308":"#ef4444";
  const sims=(mc.si||[]).map(id=>allMC.find(m=>m.id===id)).filter(Boolean);
  const wildlife=mc.wl||(WL[mc.id])||[];
  const hasWL=wildlife.length>0;
  const bc=BCM[mc.ty]||"#888";
  const tabs=[{k:"overview",l:"Overview",ic:"📋"},{k:"climate",l:"Climate",ic:"🌡"},{k:"activities",l:"Explore",ic:"🧭"}];
  if(hasWL)tabs.push({k:"wildlife",l:"Wildlife",ic:"🐾"});
  tabs.push({k:"cities",l:"Where to Live",ic:"🏘️"},{k:"risk",l:"Risk & Comfort",ic:"⚠️"},{k:"soil",l:"Grow & Land",ic:"🌱"},{k:"similar",l:"Similar",ic:"🔗"});
  const secret=SECRETS.has(mc.id);
  const sw=mc.sH-mc.wL;
  const tc=mc.sH>=90?"Hot":mc.sH>=75?"Warm":mc.sH>=60?"Mild":"Cool";
  const wc=mc.ra>=100?"Very Wet":mc.ra>=60?"Wet":mc.ra>=30?"Moderate":mc.ra>=15?"Dry":"Arid";
  return(
    <div className="mc-detail" style={{position:"fixed",inset:0,background:"radial-gradient(ellipse 90% 60% at 50% -15%,rgba(13,148,136,.07),transparent 50%),radial-gradient(ellipse 70% 50% at 100% 0%,rgba(194,65,12,.05),transparent 45%),linear-gradient(188deg,#f8fafc 0%,#f1f5f9 45%,#e8eef5 100%)",zIndex:100,overflowY:"auto",WebkitOverflowScrolling:"touch",animation:"su .28s cubic-bezier(.16,1,.3,1)"}}>
      <Hero mc={mc} h={250}>
        <div style={{position:"absolute",top:0,left:0,right:0,height:3,background:`linear-gradient(90deg,transparent,${bc},transparent)`,opacity:.6}}/>
        <div style={{position:"absolute",top:14,left:14,right:14,display:"flex",justifyContent:"space-between",zIndex:2}}>
          <button onClick={onClose} style={{width:38,height:38,borderRadius:14,background:"rgba(255,254,251,.88)",backdropFilter:"blur(12px)",border:"1px solid rgba(15,23,42,.12)",cursor:"pointer",color:"var(--mc-ink)",fontSize:17,display:"flex",alignItems:"center",justifyContent:"center",boxShadow:"0 4px 16px rgba(15,23,42,.1)"}}>←</button>
          <div style={{display:"flex",gap:6}}>
            {secret&&<span style={{padding:"5px 12px",borderRadius:12,background:"rgba(251,191,36,.18)",backdropFilter:"blur(12px)",border:"1px solid rgba(217,119,6,.28)",fontSize:10,color:"#b45309",fontWeight:600}}>✦ Hidden Gem</span>}
            <button onClick={()=>onFav(mc.id)} style={{width:38,height:38,borderRadius:14,background:"rgba(255,254,251,.88)",backdropFilter:"blur(12px)",border:`1px solid ${isFav?"rgba(245,158,11,.45)":"rgba(15,23,42,.12)"}`,cursor:"pointer",fontSize:17,color:isFav?"#d97706":"var(--mc-ink-muted)",boxShadow:"0 4px 16px rgba(15,23,42,.08)"}}>{isFav?"★":"☆"}</button>
          </div>
        </div>
        <div style={{position:"absolute",bottom:16,left:16,right:16,zIndex:2}}>
          <div style={{display:"flex",alignItems:"flex-end",justifyContent:"space-between"}}>
            <div style={{flex:1}}>
              <span style={{fontSize:40,display:"block",marginBottom:6,filter:"drop-shadow(0 2px 8px rgba(0,0,0,.35))"}}>{mc.em}</span>
              <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:4}}><span style={{width:9,height:9,borderRadius:"50%",background:bc,boxShadow:`0 0 10px ${bc}88`}}/>
                <span onClick={()=>onTerm(mc.ty)} style={{fontSize:10,color:"rgba(255,251,245,.88)",letterSpacing:".06em",textTransform:"uppercase",cursor:"pointer",borderBottom:`1px dotted rgba(255,251,245,.5)`}}>{mc.ty}</span></div>
              <h2 style={{fontSize:27,fontFamily:"'Fraunces',Georgia,serif",fontWeight:400,color:"#fffefb",lineHeight:1.08,margin:"0 0 4px",textShadow:"0 2px 16px rgba(0,0,0,.45)"}}>{mc.n}</h2>
              <div style={{fontSize:12,color:"rgba(255,251,245,.78)"}}>{FL[mc.co]} {mc.r}</div>
            </div>
            <LiveScore mc={mc}/>
          </div>
        </div>
      </Hero>
      <div style={{padding:"0 16px",marginTop:8}}>
        <div style={{display:"flex",gap:5,marginBottom:10,flexWrap:"wrap"}}>
          <span style={{padding:"5px 11px",borderRadius:11,background:"rgba(139,92,246,.08)",border:"1px solid rgba(139,92,246,.2)",color:"#6d28d9",fontSize:11,fontWeight:500}}>✦ {mc.vi}</span>
          <span style={{padding:"5px 11px",borderRadius:11,background:"rgba(255,255,255,.65)",border:"1px solid var(--mc-border)",color:"var(--mc-ink-muted)",fontSize:11}}>📅 {mc.bm}</span>
          <span style={{padding:"5px 11px",borderRadius:11,background:`${bc}14`,border:`1px solid ${bc}35`,color:"var(--mc-ink)",fontSize:11,fontWeight:600}}>{tc} · {wc}</span>
          {(()=>{const rd=RD[mc.id];return rd?<><span style={{padding:"5px 11px",borderRadius:11,background:"rgba(99,102,241,.1)",border:"1px solid rgba(99,102,241,.22)",color:"#4338ca",fontSize:11}}>🌙 Bortle {rd.bo}</span><span style={{padding:"5px 11px",borderRadius:11,background:rd.ut>=8?"rgba(34,197,94,.1)":rd.ut>=5?"rgba(234,179,8,.12)":"rgba(239,68,68,.1)",border:`1px solid ${rd.ut>=8?"rgba(34,197,94,.22)":rd.ut>=5?"rgba(234,179,8,.25)":"rgba(239,68,68,.22)"}`,color:rd.ut>=8?"#166534":rd.ut>=5?"#a16207":"#b91c1c",fontSize:11}}>🌡 {rd.ut}mo comfort</span></>:null})()}
        </div>
        <div style={{background:"linear-gradient(165deg,#ffffff 0%,#f8fafc 100%)",border:"1px solid var(--mc-border)",borderRadius:14,padding:"12px 14px",marginBottom:10,boxShadow:"0 10px 40px -10px rgba(15,23,42,.08)"}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:6}}>
            <span style={{fontSize:8.5,color:"var(--mc-ink-muted)",letterSpacing:".08em",textTransform:"uppercase"}}>Adventure Difficulty</span>
            <span style={{fontSize:9.5,color:"var(--mc-accent,#0d9488)",fontWeight:600}}>⛰ {mc.eN<0?mc.eN.toLocaleString():mc.eN.toLocaleString()}–{mc.eX.toLocaleString()}'</span>
          </div>
          <AdvBar v={mc.ad}/>
        </div>
        <div style={{display:"flex",gap:4,marginBottom:12,overflowX:"auto",paddingBottom:4}}>
          {tabs.map(t=>(<button key={t.k} onClick={()=>setTab(t.k)} style={{padding:"7px 14px",borderRadius:12,background:tab===t.k?`linear-gradient(145deg,${bc}18,${bc}0c)`:"rgba(255,255,255,.55)",border:tab===t.k?`1px solid ${bc}40`:"1px solid var(--mc-border)",color:tab===t.k?"var(--mc-ink)":"var(--mc-ink-muted)",fontSize:11,cursor:"pointer",whiteSpace:"nowrap",fontWeight:tab===t.k?600:400,display:"flex",alignItems:"center",gap:4}}><span style={{fontSize:11}}>{t.ic}</span>{t.l}</button>))}
        </div>
        {tab==="overview"&&(<div style={{marginBottom:24}}>
          {mc.tl&&<div style={{background:"linear-gradient(135deg,rgba(13,148,136,.1),rgba(255,255,255,.92))",border:"1px solid rgba(13,148,136,.22)",borderRadius:16,padding:"16px 18px",marginBottom:14,position:"relative",boxShadow:"0 12px 36px -14px rgba(15,23,42,.08)"}}>
            <div style={{fontSize:8,color:"var(--mc-accent,#0d9488)",letterSpacing:".14em",textTransform:"uppercase",marginBottom:8,fontWeight:700}}>Field tagline</div>
            <p style={{fontSize:17,fontFamily:"'Fraunces',Georgia,serif",fontWeight:400,color:"var(--mc-ink)",lineHeight:1.5,margin:0,fontStyle:"italic",letterSpacing:"-0.01em"}}>{mc.tl}</p>
          </div>}
          <div style={{background:"linear-gradient(165deg,#ffffff 0%,#f8fafc 100%)",border:"1px solid var(--mc-border)",borderRadius:16,padding:16,marginBottom:12,position:"relative",overflow:"hidden",boxShadow:"0 12px 44px -12px rgba(15,23,42,.1)"}}>
            <div style={{position:"absolute",top:0,left:0,width:3,height:"100%",background:`linear-gradient(180deg,${bc},transparent)`,borderRadius:"16px 0 0 16px"}}/>
            {renderParagraphs(mc.bp||"",onTerm)}
          </div>
          {mc.ins&&mc.ins.length>0&&<div style={{background:"linear-gradient(145deg,rgba(99,102,241,.08),rgba(255,254,251,.95))",border:"1px solid rgba(99,102,241,.2)",borderRadius:14,padding:"12px 14px",marginBottom:12}}>
            <div style={{fontSize:8.5,color:"#4338ca",letterSpacing:".08em",textTransform:"uppercase",marginBottom:10,fontWeight:600}}>Analyst notes</div>
            <ul style={{margin:0,paddingLeft:18,color:"var(--mc-ink-muted)",fontSize:13,lineHeight:1.65}}>{mc.ins.map((x,i)=><li key={i} style={{marginBottom:8}}>{typeof x==="string"?renderT(x,onTerm):x}</li>)}</ul>
          </div>}
          {mc.out&&mc.out.length>0&&<div style={{background:"linear-gradient(145deg,rgba(234,179,8,.12),rgba(255,254,251,.95))",border:"1px solid rgba(217,119,6,.22)",borderRadius:14,padding:"12px 14px",marginBottom:12}}>
            <div style={{fontSize:8.5,color:"#b45309",letterSpacing:".08em",textTransform:"uppercase",marginBottom:10,fontWeight:600}}>Climate outlook — scenarios & themes</div>
            <ul style={{margin:0,paddingLeft:18,color:"var(--mc-ink-muted)",fontSize:12.5,lineHeight:1.68}}>{mc.out.map((x,i)=><li key={i} style={{marginBottom:8}}>{typeof x==="string"?renderT(x,onTerm):x}</li>)}</ul>
            <p style={{fontSize:10.5,color:"var(--mc-ink-muted)",lineHeight:1.55,margin:"10px 0 0",fontStyle:"italic"}}>Not a parcel forecast. Summarizes regional climate-science themes (warming, aridification, monsoon variability, fire–water risk). Uncertainty is largest for monsoon timing and local hydrogeology.</p>
          </div>}
          <div style={{background:"linear-gradient(165deg,#ffffff 0%,#f1f5f9 100%)",border:"1px solid var(--mc-border)",borderRadius:14,padding:"12px 14px",marginBottom:12}}>
            <div style={{fontSize:8.5,color:"var(--mc-sage)",letterSpacing:".07em",textTransform:"uppercase",marginBottom:8,fontWeight:600}}>Getting There</div>
            <p style={{fontSize:13,color:"var(--mc-ink-muted)",lineHeight:1.6,margin:"0 0 4px"}}><strong style={{color:"var(--mc-ink)"}}>Airport:</strong> {mc.nr}</p>
            <p style={{fontSize:11.5,color:"var(--mc-ink-muted)",margin:0,opacity:.9}}>{formatLatLng(mc)} · Zone {mc.zo}</p>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:6,marginBottom:8}}>
            <Stat icon="☀️" label="Summer Hi" value={`${mc.sH}°F`} color="#ef4444" sub={`Low ${mc.sL}°`}/>
            <Stat icon="❄️" label="Winter Lo" value={`${mc.wL}°F`} color="#3b82f6" sub={`High ${mc.wH}°`}/>
            <Stat icon="💧" label="Rain" value={`${mc.ra}″`} color="#60a5fa" sub={wc}/>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:6}}>
            <Stat icon="💨" label="Air" value={mc.aq} color={aqC} sub={mc.aL} onClick={()=>onTerm("AQI")}/>
            <Stat icon="☀️" label="Sun" value={`${mc.su}/yr`} color={mc.su>=220?"#fbbf24":"#84cc16"}/>
            <Stat icon="💦" label="Humid" value={`${mc.hu}%`} color={mc.hu>=75?"#3b82f6":"#22c55e"}/>
          </div>
        </div>)}
        {tab==="climate"&&(<div style={{marginBottom:24}}><MonthClimatePanel mc={mc}/>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:6,marginTop:6}}>
            <Stat icon="💦" label="Humidity" value={`${mc.hu}%`} color={mc.hu>=75?"#3b82f6":"#22c55e"} sub={mc.hu>=80?"Tropical":mc.hu>=60?"Comfortable":mc.hu>=40?"Dry":"Arid"}/>
            <Stat icon="☀️" label="Sunny Days" value={`${mc.su}/yr`} color={mc.su>=220?"#fbbf24":"#84cc16"} sub={`${Math.round(mc.su/365*100)}% of year`}/>
            <Stat icon="💨" label="Air Quality" value={`${mc.aq} · ${mc.aL}`} color={aqC} onClick={()=>onTerm("AQI")} sub={mc.aq<=12?"Pristine":mc.aq<=20?"Very clean":mc.aq<=35?"Good":"Moderate"}/>
            <Stat icon="🌡" label="Temp Swing" value={`${sw}°F`} color={sw>=80?"#ef4444":sw>=55?"#f59e0b":"#22c55e"} sub="Summer hi - winter lo"/>
            <Stat icon="🌱" label="Plant Zone" value={mc.zo} color="#22c55e" onClick={()=>onTerm("Hardiness Zone")}/>
            <Stat icon="⛰" label="Elevation" value={`${mc.eN<0?mc.eN:mc.eN.toLocaleString()}'`} sub={`to ${mc.eX.toLocaleString()}'`}/>
          </div></div>)}
        {tab==="activities"&&(<div style={{marginBottom:24}}>
          <TravelActivityCards items={mc.ac||[]} biomeColor={bc} renderT={renderT} onTerm={onTerm} />
        </div>)}
        {tab==="wildlife"&&(<div style={{marginBottom:24}}>
          <div style={{background:"linear-gradient(145deg,rgba(34,197,94,.1),rgba(255,254,251,.95))",border:"1px solid rgba(34,197,94,.2)",borderRadius:14,padding:"10px 14px",marginBottom:14}}><div style={{fontSize:12,color:"#166534",lineHeight:1.5}}>How species exploit this microclimate to survive.</div></div>
          {wildlife.map((w,i)=>(<div key={i} style={{background:"linear-gradient(165deg,#ffffff 0%,#f8fafc 100%)",border:"1px solid var(--mc-border)",borderRadius:16,padding:"14px 16px",marginBottom:10,animation:`ci .25s ease ${i*70}ms both`,position:"relative",overflow:"hidden",boxShadow:"0 10px 40px -10px rgba(15,23,42,.08)"}}>
            <div style={{position:"absolute",top:0,left:0,width:3,height:"100%",background:"linear-gradient(180deg,#22c55e,transparent)"}}/>
            <div style={{fontSize:17,fontFamily:"'Fraunces',Georgia,serif",color:"#15803d",marginBottom:6}}>{w.an}</div>
            <p style={{fontSize:13.5,color:"var(--mc-ink-muted)",lineHeight:1.7,margin:0}}>{renderT(w.ex,onTerm)}</p>
          </div>))}
        </div>)}
        {tab==="cities"&&(<div style={{marginBottom:24}}>
          <div style={{background:"linear-gradient(145deg,rgba(139,92,246,.1),rgba(255,254,251,.95))",border:"1px solid rgba(139,92,246,.2)",borderRadius:14,padding:"10px 14px",marginBottom:14}}><div style={{fontSize:12,color:"#5b21b6",lineHeight:1.5}}>Towns where you could actually settle — with population, real estate, and honest field notes.</div></div>
          {(mc.ct||[]).map((c,i)=>(<div key={i} style={{background:"linear-gradient(165deg,#ffffff 0%,#f8fafc 100%)",border:"1px solid var(--mc-border)",borderRadius:16,padding:"14px 16px",marginBottom:10,animation:`ci .2s ease ${i*50}ms both`,position:"relative",overflow:"hidden",boxShadow:"0 10px 40px -10px rgba(15,23,42,.08)"}}>
            <div style={{position:"absolute",top:0,left:0,width:3,height:"100%",background:"linear-gradient(180deg,#8b5cf6,transparent)"}}/>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"baseline",marginBottom:5}}>
              <div style={{fontSize:17,fontFamily:"'Fraunces',Georgia,serif",color:"var(--mc-ink)"}}>{c.nm}</div>
              <div style={{padding:"2px 8px",borderRadius:8,background:"rgba(139,92,246,.1)",fontSize:10,color:"#6d28d9"}}>{c.pop}</div>
            </div>
            <p style={{fontSize:13.5,color:"var(--mc-ink-muted)",lineHeight:1.65,margin:0}}>{c.no}</p>
          </div>))}
        </div>)}
        {tab==="risk"&&(()=>{const rd=RD[mc.id];if(!rd)return <div style={{padding:30,textAlign:"center",color:"var(--mc-ink-muted)"}}>Risk data not available</div>;
const utciPct=Math.round(rd.ut/12*100);
const riskItems=[
{l:"Flood Risk",v:rd.fl,n:rd.fN,ic:"🌊",desc:"FEMA flood zone designation. Zone AE/VE = high risk (1% annual chance). Zone X = moderate-to-low risk. Based on FEMA FIRM maps and Risk Rating 2.0."},
{l:"Wildfire Risk",v:rd.wf,n:rd.wfN,ic:"🔥",desc:"USDA Forest Service Wildfire Risk to Communities assessment + FEMA National Risk Index. Considers proximity to wildland-urban interface, fuel load, and historical fire frequency."},
{l:"Drought Risk",v:rd.dr,n:rd.drN,ic:"☀️",desc:"US Drought Monitor classification history + precipitation deficit trends. Higher risk indicates more frequent/severe drought periods affecting water supply and agriculture."},
{l:"Hurricane/Storm",v:rd.hu,n:rd.huN,ic:"🌀",desc:"NOAA historical hurricane/severe storm frequency. Coastal zones face storm surge + wind damage. Inland areas: tornado/severe thunderstorm exposure."}
];
return(<div style={{marginBottom:24}}>
<div style={{background:"linear-gradient(145deg,rgba(99,102,241,.1),rgba(255,254,251,.98))",border:"1px solid rgba(99,102,241,.2)",borderRadius:14,padding:"12px 14px",marginBottom:14}}>
<div style={{fontSize:12,color:"#4338ca",lineHeight:1.55}}>Climate risk assessment compiled from FEMA flood maps, USDA Forest Service wildfire data, US Drought Monitor, and NOAA storm records. UTCI thermal comfort modeled from location climate data.</div></div>
<RiskDashboard rd={rd}/>
<div style={{background:"linear-gradient(165deg,#ffffff 0%,#f8fafc 100%)",border:"1px solid var(--mc-border)",borderRadius:16,padding:16,marginBottom:12,boxShadow:"0 12px 40px -10px rgba(15,23,42,.08)"}}>
<div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
<div><div style={{fontSize:8.5,color:"var(--mc-ink-muted)",letterSpacing:".08em",textTransform:"uppercase",marginBottom:4}}>UTCI Thermal Comfort</div>
<div style={{fontSize:22,fontFamily:"'Fraunces',Georgia,serif",color:utciPct>=70?"#22c55e":utciPct>=50?"#eab308":"#ef4444"}}>{rd.ut} of 12 months</div>
<div style={{fontSize:10,color:"var(--mc-ink-muted)",marginTop:2}}>in the "No Thermal Stress" zone (9–26°C UTCI)</div></div>
<div style={{position:"relative",width:56,height:56}}>
<svg viewBox="0 0 56 56" style={{transform:"rotate(-90deg)"}}><circle cx="28" cy="28" r="24" fill="none" stroke="rgba(15,23,42,.1)" strokeWidth="4"/><circle cx="28" cy="28" r="24" fill="none" stroke={utciPct>=70?"#22c55e":utciPct>=50?"#eab308":"#ef4444"} strokeWidth="4" strokeLinecap="round" strokeDasharray={`${utciPct*1.51} 200`}/></svg>
<div style={{position:"absolute",inset:0,display:"flex",alignItems:"center",justifyContent:"center"}}><span style={{fontSize:15,fontWeight:700,color:utciPct>=70?"#22c55e":utciPct>=50?"#eab308":"#ef4444"}}>{utciPct}%</span></div></div></div>
<p style={{fontSize:12.5,color:"var(--mc-ink-muted)",lineHeight:1.65,margin:0,borderTop:"1px solid var(--mc-border)",paddingTop:10}}>{rd.uR}</p></div>
<div style={{background:"linear-gradient(165deg,#ffffff 0%,#f8fafc 100%)",border:"1px solid var(--mc-border)",borderRadius:16,padding:16,marginBottom:12,boxShadow:"0 12px 40px -10px rgba(15,23,42,.08)"}}>
<div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
<div style={{fontSize:8.5,color:"var(--mc-ink-muted)",letterSpacing:".08em",textTransform:"uppercase"}}>Dark Sky Quality</div>
<div style={{display:"flex",alignItems:"center",gap:6}}>
<span style={{fontSize:17,fontFamily:"'Fraunces',Georgia,serif",color:BORTLE_COL[rd.bo]||"var(--mc-ink)"}}>Bortle {rd.bo}</span>
<span style={{padding:"3px 8px",borderRadius:8,background:`${(BORTLE_COL[rd.bo]||"#888")}18`,border:`1px solid ${(BORTLE_COL[rd.bo]||"#888")}35`,fontSize:9.5,color:BORTLE_COL[rd.bo]||"#888"}}>{rd.bN}</span></div></div>
<div style={{display:"flex",gap:2,marginBottom:10}}>{[1,2,3,4,5,6,7,8,9].map(b=><div key={b} style={{flex:1,height:8,borderRadius:4,background:b<=rd.bo?"rgba(15,23,42,.12)":(BORTLE_COL[b]||"#444"),opacity:b<=rd.bo?1:.2,transition:"all .2s"}}/>)}</div>
<div style={{fontSize:11,color:"var(--mc-ink-muted)",lineHeight:1.5}}>{rd.bo<=2?"Exceptional stargazing — Milky Way casts shadows, zodiacal light visible to horizon. Among the darkest skies measured.":rd.bo<=3?"Excellent stargazing — Milky Way clearly structured, many deep-sky objects visible to naked eye.":rd.bo<=4?"Good stargazing — Milky Way visible but light domes apparent on horizon. Binoculars reveal plenty.":rd.bo<=5?"Fair — Milky Way washed out overhead. Planets and bright stars visible. Light pollution noticeable.":"Urban sky — Only brightest stars and planets visible. Significant light pollution."}</div></div>
<div style={{fontSize:9,color:"var(--mc-ink-muted)",letterSpacing:".06em",textTransform:"uppercase",marginBottom:8,opacity:.85}}>Climate Hazard Assessment</div>
{riskItems.map((r,i)=>(<div key={i} style={{background:"linear-gradient(165deg,#ffffff 0%,#f8fafc 100%)",border:"1px solid var(--mc-border)",borderRadius:14,padding:"12px 14px",marginBottom:8,animation:`ci .2s ease ${i*50}ms both`,boxShadow:"0 6px 20px -6px rgba(15,23,42,.07)"}}>
<div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:6}}>
<div style={{display:"flex",alignItems:"center",gap:8}}><span style={{fontSize:16}}>{r.ic}</span><span style={{fontSize:13,color:"var(--mc-ink)",fontWeight:500}}>{r.l}</span></div>
<div style={{display:"flex",alignItems:"center",gap:6}}>
<span style={{fontSize:14,fontWeight:600,color:RISK_COL[r.v]||"#888"}}>{r.n}</span>
<div style={{display:"flex",gap:2}}>{[1,2,3,4,5].map(lv=><div key={lv} style={{width:8,height:8,borderRadius:"50%",background:lv<=r.v?RISK_COL[r.v]:"rgba(15,23,42,.1)"}}/>)}</div></div></div>
<div style={{fontSize:10.5,color:"var(--mc-ink-muted)",lineHeight:1.5}}>{r.desc}</div>
{r.l==="Flood Risk"&&<div style={{fontSize:9.5,color:"#4338ca",marginTop:4}}>FEMA Zone: {rd.fN}</div>}
</div>))}
</div>);})()}

        {tab==="soil"&&(<div style={{marginBottom:24}}>
          <AgPropertyGuide mc={mc} onTerm={onTerm} />
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:6,marginBottom:10}}>
            <Stat icon="🪨" label="Soil" value={mc.so.length>28?mc.so.slice(0,26)+"…":mc.so}/>
            <Stat icon="⚗️" label="pH" value={mc.ph} onClick={()=>onTerm("Soil pH")} color={mc.ph<5.5?"#ef4444":mc.ph<6.5?"#f59e0b":mc.ph<7.5?"#22c55e":"#3b82f6"} sub={mc.ph<5.5?"Very Acidic":mc.ph<6.5?"Acidic":mc.ph<7.5?"Neutral":"Alkaline"}/>
            <Stat icon="💧" label="Drainage" value={mc.dr.length>18?mc.dr.slice(0,16)+"…":mc.dr}/>
            <Stat icon="🍂" label="Organic" value={mc.og}/>
          </div>
          {[["🌱 Native Plants",mc.vg,"34,197,94","#86efac"],["🌾 Crops",mc.gr,"245,158,11","#fcd34d"],["🏡 Land Uses",mc.la2,"139,92,246","#c4b5fd"]].map(([t,items,rgb,col])=>(<div key={t} style={{background:`linear-gradient(145deg,rgba(${rgb},.025),rgba(${rgb},.005))`,border:`1px solid rgba(${rgb},.1)`,borderRadius:14,padding:"12px 14px",marginBottom:8}}><div style={{fontSize:9,color:`rgba(${rgb},.5)`,textTransform:"uppercase",letterSpacing:".06em",marginBottom:8}}>{t}</div><div style={{display:"flex",flexWrap:"wrap",gap:5}}>{items.map((v,i)=><span key={i} style={{padding:"5px 10px",borderRadius:10,background:`rgba(${rgb},.05)`,border:`1px solid rgba(${rgb},.12)`,color:col,fontSize:11.5}}>{renderT(v,onTerm)}</span>)}</div></div>))}</div>)}
        {tab==="similar"&&(<div style={{marginBottom:24}}>
          {sims.length>0?sims.map(s=>{const sc=BCM[s.ty]||"#888";return(<div key={s.id} onClick={()=>{onClose();setTimeout(()=>onNav(s),80)}} style={{display:"flex",alignItems:"center",gap:12,padding:"12px 0",borderBottom:"1px solid var(--mc-border)",cursor:"pointer"}}>
            <div style={{width:50,height:50,borderRadius:12,overflow:"hidden",flexShrink:0,position:"relative",background:locGrad(s),boxShadow:"0 2px 12px rgba(15,23,42,.12)"}}><SceneSVG mc={s} h={50}/></div>
            <div style={{flex:1}}><div style={{fontSize:16,fontFamily:"'Fraunces',Georgia,serif",color:"var(--mc-ink)",marginBottom:2}}>{s.n}</div><div style={{fontSize:10.5,color:"var(--mc-ink-muted)"}}>{FL[s.co]} {s.ty}</div></div><span style={{color:"var(--mc-terracotta)",fontSize:16}}>→</span></div>);}):
          <div style={{textAlign:"center",padding:30,color:"var(--mc-ink-muted)"}}>No similar locations mapped</div>}
        </div>)}
        <div style={{display:"flex",gap:4,flexWrap:"wrap",marginBottom:44,marginTop:8}}>{mc.tg.map((t,i)=><span key={i} style={{padding:"4px 9px",borderRadius:10,background:"rgba(255,255,255,.7)",border:"1px solid var(--mc-border)",color:"var(--mc-ink-muted)",fontSize:10}}>#{t}</span>)}</div>
      </div>
    </div>);}

export default function App(){
  const[search,setSearch]=useState("");const[region,setRegion]=useState("all");const[showR,setShowR]=useState(false);const[favs,setFavs]=useState(new Set());const[sel,setSel]=useState(null);const[nav,setNav]=useState("explore");const[sortKey,setSortKey]=useState(null);const[showS,setShowS]=useState(false);const[vibeF,setVibeF]=useState("All");const[showV,setShowV]=useState(false);const[gTerm,setGTerm]=useState(null);
  const toggleFav=useCallback(id=>setFavs(p=>{const n=new Set(p);n.has(id)?n.delete(id):n.add(id);return n}),[]);
  const sortOpts=[{l:"Adventure ↑",k:"ad",d:"desc"},{l:"Adventure ↓",k:"ad",d:"asc"},{l:"Best Air",k:"aq",d:"asc"},{l:"Wettest",k:"ra",d:"desc"},{l:"Driest",k:"ra",d:"asc"},{l:"Sunniest",k:"su",d:"desc"},{l:"Highest",k:"eX",d:"desc"},{l:"Warmest Winter",k:"wL",d:"desc"},{l:"Coolest Summer",k:"sH",d:"asc"},{l:"Best Comfort",k:"_ut",d:"desc"},{l:"Darkest Sky",k:"_bo",d:"asc"}];
  const filtered=useMemo(()=>{const tg=(m)=>m.tg||[];let l=MC;if(nav==="favorites")l=l.filter(m=>favs.has(m.id));if(region==="az")l=l.filter(m=>tg(m).includes("arizona"));if(region==="ca")l=l.filter(m=>tg(m).includes("california"));if(region==="nm")l=l.filter(m=>tg(m).includes("new-mexico"));if(region==="son")l=l.filter(m=>m.co==="MX"&&tg(m).includes("sonora"));if(region==="us")l=l.filter(m=>m.co==="US");if(region==="mx")l=l.filter(m=>m.co==="MX");if(vibeF==="Hidden Gems Only")l=l.filter(m=>SECRETS.has(m.id));else if(vibeF!=="All")l=l.filter(m=>m.vi===vibeF);if(search){const q=search.toLowerCase();l=l.filter(m=>m.n.toLowerCase().includes(q)||m.r.toLowerCase().includes(q)||m.ty.toLowerCase().includes(q)||tg(m).some(t=>t.includes(q))||m.vi.toLowerCase().includes(q)||(m.bp||"").toLowerCase().includes(q)||(m.tl||"").toLowerCase().includes(q)||(m.ins||[]).some(x=>String(x).toLowerCase().includes(q))||(m.out||[]).some(x=>String(x).toLowerCase().includes(q))||(m.ac||[]).some(x=>String(x).toLowerCase().includes(q))||(m.ct||[]).some(c=>c.nm.toLowerCase().includes(q)||c.no.toLowerCase().includes(q)))}if(sortKey){const gv=(m,k)=>{if(k==="_ut")return(RD[m.id]||{}).ut||0;if(k==="_bo")return(RD[m.id]||{}).bo||9;return m[k]||0;};l=[...l].sort((a,b)=>sortKey.d==="asc"?gv(a,sortKey.k)-gv(b,sortKey.k):gv(b,sortKey.k)-gv(a,sortKey.k));}return l;},[search,region,nav,favs,vibeF,sortKey]);
  const closeAll=()=>{setShowR(false);setShowS(false);setShowV(false)};
  const stats=useMemo(()=>({us:MC.filter(m=>m.co==="US").length,az:MC.filter(m=>(m.tg||[]).includes("arizona")).length,ca:MC.filter(m=>(m.tg||[]).includes("california")).length,nm:MC.filter(m=>(m.tg||[]).includes("new-mexico")).length,son:MC.filter(m=>m.co==="MX"&&(m.tg||[]).includes("sonora")).length,mx:MC.filter(m=>m.co==="MX").length,wl:MC.filter(m=>m.wl||(WL[m.id])).length}),[]);
  const homesMcList=useMemo(()=>HOMES_MC_IDS.map(id=>MC.find(m=>m.id===id)).filter(Boolean),[]);
  return(
    <div className="mc-shell" style={{minHeight:"100vh",color:"var(--mc-ink)",fontFamily:"'Lexend','Source Sans 3',system-ui,sans-serif",maxWidth:520,margin:"0 auto",position:"relative",paddingBottom:86}}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,500;0,9..144,600;0,9..144,700;1,9..144,400&family=Lexend:wght@400;500;600;700&family=Source+Sans+3:ital,wght@0,400;0,500;0,600;0,700;1,400&display=swap');*{box-sizing:border-box;margin:0;padding:0;-webkit-tap-highlight-color:transparent}body{margin:0}input::placeholder{color:rgba(15,23,42,.45)}::-webkit-scrollbar{width:0;height:0}@keyframes ci{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}@keyframes fi{from{opacity:0}to{opacity:1}}@keyframes su{from{opacity:0;transform:translateY(24px)}to{opacity:1;transform:translateY(0)}}@keyframes mcShimmer{0%{opacity:.35}50%{opacity:.55}100%{opacity:.35}}.mc-shell{--mc-accent:#0f766e;--mc-ink:#020617;--mc-ink-muted:rgba(2,6,23,.78);--mc-terracotta:#c2410c;--mc-sage:#0f766e;--mc-border:rgba(2,6,23,.14);--mc-cream:#e2e8f0;--mc-paper:#ffffff;background:radial-gradient(ellipse 100% 85% at 50% -28%,rgba(15,118,110,.14),transparent 52%),radial-gradient(ellipse 75% 55% at 100% 8%,rgba(194,65,12,.08),transparent 48%),radial-gradient(ellipse 55% 45% at 0% 100%,rgba(30,41,59,.06),transparent 42%),linear-gradient(172deg,#f1f5f9 0%,#e2e8f0 42%,#cbd5e1 100%)}.mc-read{letter-spacing:.02em;word-spacing:.04em;line-height:1.72}.mc-detail{--mc-accent:#0f766e;--mc-ink:#020617;--mc-ink-muted:rgba(2,6,23,.78);--mc-terracotta:#c2410c;--mc-sage:#0f766e;--mc-border:rgba(2,6,23,.14)}.mc-card-glow{transition:box-shadow .28s ease,border-color .28s ease,transform .22s ease}.mc-card-glow:hover{box-shadow:0 22px 56px -14px rgba(15,23,42,.22),0 0 0 1px rgba(255,255,255,.85)!important}.mc-card-glow:active{transform:scale(.992)}.mc-nav-btn{position:relative;transition:color .2s ease}.mc-nav-btn--on{color:var(--mc-accent)!important}.mc-nav-btn--on::after{content:"";position:absolute;bottom:-2px;left:50%;transform:translateX(-50%);width:22px;height:3px;border-radius:3px;background:linear-gradient(90deg,transparent,rgba(15,118,110,.95),transparent);box-shadow:0 0 14px rgba(15,118,110,.4)}`}</style>
      <div style={{padding:"16px 18px 0",paddingBottom:10}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:14}}>
          <div>
            <div style={{fontSize:8,color:"var(--mc-sage)",letterSpacing:".22em",textTransform:"uppercase",marginBottom:3,opacity:.95,fontWeight:700}}>Saguaro Atlas · Southwest</div>
            <h1 style={{fontSize:32,fontFamily:"'Fraunces',Georgia,serif",fontWeight:600,lineHeight:1.08,letterSpacing:"-0.02em",background:"linear-gradient(120deg,#020617 0%,#134e4a 38%,#0f766e 72%,#15803d 100%)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>Microclimates</h1>
            <div style={{fontSize:11,color:"var(--mc-ink-muted)",marginTop:6,lineHeight:1.45,fontWeight:500}}><strong style={{color:"var(--mc-ink)"}}>{stats.az}</strong> AZ · <strong style={{color:"var(--mc-ink)"}}>{stats.ca}</strong> CA · <strong style={{color:"var(--mc-ink)"}}>{stats.nm}</strong> NM · <strong style={{color:"var(--mc-ink)"}}>{stats.son}</strong> Sonora · <strong style={{color:"var(--mc-ink)"}}>{stats.wl}</strong> w/ wildlife</div>
          </div>
          <button onClick={()=>{closeAll();setShowR(!showR)}} style={{padding:"6px 12px",borderRadius:12,background:"rgba(255,255,255,.75)",border:"1px solid var(--mc-border)",color:"var(--mc-terracotta)",fontSize:10.5,cursor:"pointer",whiteSpace:"nowrap",marginTop:6,fontWeight:600,boxShadow:"0 2px 12px rgba(15,23,42,.06)"}}>📍 {REGIONS.find(r=>r.id===region)?.l}</button>
        </div>
        {(nav==="explore"||nav==="favorites")&&showR&&<div style={{display:"flex",gap:5,marginBottom:8,animation:"fi .12s ease"}}>{REGIONS.map(r=><button key={r.id} onClick={()=>{setRegion(r.id);setShowR(false)}} style={{padding:"6px 13px",borderRadius:12,background:region===r.id?"rgba(196,162,79,.2)":"rgba(255,255,255,.65)",border:region===r.id?"1px solid rgba(196,162,79,.35)":"1px solid var(--mc-border)",color:region===r.id?"#92400e":"var(--mc-ink-muted)",fontSize:11,cursor:"pointer"}}>{r.l}</button>)}</div>}
        {(nav==="explore"||nav==="favorites")&&<div style={{position:"relative",marginBottom:8}}>
          <span style={{position:"absolute",left:14,top:"50%",transform:"translateY(-50%)",fontSize:13,color:"var(--mc-ink-muted)",pointerEvents:"none",opacity:.55}}>🔍</span>
          <input type="text" value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search towns, climate notes, Sonora travel…" style={{width:"100%",padding:"14px 40px 14px 44px",borderRadius:14,background:"rgba(255,255,255,.96)",border:"1.5px solid var(--mc-border)",color:"var(--mc-ink)",fontSize:16,fontFamily:"'Lexend','Source Sans 3',system-ui,sans-serif",fontWeight:400,letterSpacing:"0.01em",outline:"none",boxShadow:"inset 0 1px 0 rgba(255,255,255,.9), 0 4px 14px -4px rgba(15,23,42,.1)"}} onFocus={e=>{e.target.style.borderColor="rgba(15,118,110,.55)";e.target.style.boxShadow="inset 0 1px 0 rgba(255,255,255,.9), 0 0 0 3px rgba(15,118,110,.2)";closeAll()}} onBlur={e=>{e.target.style.borderColor="rgba(2,6,23,.14)";e.target.style.boxShadow="inset 0 1px 0 rgba(255,255,255,.9), 0 4px 14px -4px rgba(15,23,42,.08)"}}/>
          {search&&<button onClick={()=>setSearch("")} style={{position:"absolute",right:12,top:"50%",transform:"translateY(-50%)",background:"rgba(15,23,42,.06)",border:"none",color:"var(--mc-ink-muted)",cursor:"pointer",fontSize:11,borderRadius:8,width:22,height:22,display:"flex",alignItems:"center",justifyContent:"center"}}>✕</button>}
        </div>}
        {(nav==="explore"||nav==="favorites")&&<div style={{display:"flex",gap:5}}>
          <button onClick={()=>{setShowV(!showV);setShowS(false);setShowR(false)}} style={{flex:1,padding:"7px 10px",borderRadius:11,background:vibeF!=="All"?"rgba(139,92,246,.1)":"rgba(255,255,255,.7)",border:vibeF!=="All"?"1px solid rgba(139,92,246,.25)":"1px solid var(--mc-border)",color:vibeF!=="All"?"#5b21b6":"var(--mc-ink-muted)",fontSize:10.5,cursor:"pointer",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>✦ {vibeF==="All"?"Explorer Vibe":vibeF}</button>
          <button onClick={()=>{setShowS(!showS);setShowV(false);setShowR(false)}} style={{flex:1,padding:"7px 10px",borderRadius:11,background:sortKey?"rgba(196,162,79,.15)":"rgba(255,255,255,.7)",border:sortKey?"1px solid rgba(196,162,79,.3)":"1px solid var(--mc-border)",color:sortKey?"#92400e":"var(--mc-ink-muted)",fontSize:10.5,cursor:"pointer"}}>↕ {sortKey?sortKey.l:"Sort By"}</button>
          {(vibeF!=="All"||sortKey)&&<button onClick={()=>{setVibeF("All");setSortKey(null)}} style={{padding:"7px 10px",borderRadius:11,background:"rgba(239,68,68,.08)",border:"1px solid rgba(239,68,68,.2)",color:"#b91c1c",fontSize:10.5,cursor:"pointer"}}>✕</button>}
        </div>}
        {(nav==="explore"||nav==="favorites")&&showV&&<div style={{display:"flex",flexWrap:"wrap",gap:4,marginTop:6,animation:"fi .12s ease",maxHeight:140,overflowY:"auto",padding:3}}>{VIBES.map(v=><button key={v} onClick={()=>{setVibeF(v);setShowV(false)}} style={{padding:"5px 10px",borderRadius:11,background:vibeF===v?"rgba(139,92,246,.12)":"rgba(255,255,255,.75)",border:vibeF===v?"1px solid rgba(139,92,246,.28)":"1px solid var(--mc-border)",color:vibeF===v?"#5b21b6":"var(--mc-ink-muted)",fontSize:10,cursor:"pointer",whiteSpace:"nowrap"}}>{v}</button>)}</div>}
        {(nav==="explore"||nav==="favorites")&&showS&&<div style={{display:"flex",flexWrap:"wrap",gap:4,marginTop:6,animation:"fi .12s ease",padding:3}}>{sortOpts.map(s=><button key={s.l} onClick={()=>{setSortKey(sortKey?.l===s.l?null:s);setShowS(false)}} style={{padding:"5px 10px",borderRadius:11,background:sortKey?.l===s.l?"rgba(196,162,79,.15)":"rgba(255,255,255,.75)",border:sortKey?.l===s.l?"1px solid rgba(196,162,79,.3)":"1px solid var(--mc-border)",color:sortKey?.l===s.l?"#92400e":"var(--mc-ink-muted)",fontSize:10,cursor:"pointer"}}>{s.l}</button>)}</div>}
      </div>
      <div style={{padding:"2px 18px 8px",display:"flex",justifyContent:"space-between",alignItems:"baseline"}}><span style={{fontSize:11,fontWeight:600,color:"var(--mc-ink-muted)",letterSpacing:"0.02em"}}>{nav==="homes"?"Huachuca corridor listings":`${filtered.length} location${filtered.length!==1?"s":""}${nav==="map"?" on map":""}`}</span><span style={{fontSize:10,color:"var(--mc-accent)",fontWeight:600,letterSpacing:"0.04em",textTransform:"uppercase"}}>{nav==="homes"?"OpenWeb Ninja · Zillow data":"Glossary · tap teal terms"}</span></div>
      {nav==="map"&&(<div style={{padding:"0 18px 12px"}}><div style={{fontSize:14,color:"var(--mc-ink-muted)",marginBottom:12,lineHeight:1.7,letterSpacing:"0.02em",padding:"14px 16px",borderRadius:16,background:"linear-gradient(135deg,rgba(15,118,110,.12) 0%,rgba(255,255,255,.75) 55%)",border:"1.5px solid rgba(15,118,110,.22)"}}><strong style={{color:"var(--mc-ink)"}}>Southwest focus</strong> — map is framed on <strong style={{color:"var(--mc-ink)"}}>Arizona, California, New Mexico</strong>, and <strong style={{color:"var(--mc-ink)"}}>Sonora</strong> so borders read clearly. Use <strong style={{color:"var(--mc-ink)"}}>Satellite</strong> for landforms; roadmap for labels. Pins: climate, housing context, border travel notes. <em style={{fontSize:12.5,opacity:.9}}>Not legal advice — verify FMM, insurance & vehicle permits for Mexico.</em></div><Suspense fallback={<div style={{minHeight:320,borderRadius:18,border:"1px solid var(--mc-border)",background:"linear-gradient(180deg,#f8fafc,#f1f5f9)",display:"flex",alignItems:"center",justifyContent:"center",color:"var(--mc-ink-muted)",fontSize:15,fontWeight:600}}>Loading map…</div>}><ClimateMap apiKey={GOOGLE_MAPS_KEY} locations={filtered} onSelect={setSel} selectedId={sel?.id}/></Suspense></div>)}
      {nav==="homes"&&<HomesTab mcList={homesMcList} rdById={RD} bcm={BCM} onOpenMicroclimate={setSel}/>}
      {(nav==="explore"||nav==="favorites")&&nav!=="map"&&(<div style={{padding:"0 18px",display:"flex",flexDirection:"column",gap:10}}>
        {filtered.length===0&&<div style={{textAlign:"center",padding:"50px 20px",color:"var(--mc-ink-muted)"}}><span style={{fontSize:42,display:"block",marginBottom:10}}>{nav==="favorites"?"☆":"🌍"}</span><div style={{fontSize:16,fontFamily:"'Fraunces',Georgia,serif",color:"var(--mc-ink)"}}>{nav==="favorites"?"No saved locations":"No results"}</div></div>}
        {filtered.map((mc,i)=>{const c=BCM[mc.ty]||"#888";const towns=(mc.ct||[]).slice(0,3).map(c=>c.nm).join(" · ");const hasWL=!!(mc.wl||(WL[mc.id]));return(
          <div key={mc.id} onClick={()=>setSel(mc)} className="mc-card-glow" style={{borderRadius:20,overflow:"hidden",cursor:"pointer",animation:`ci .22s ease ${Math.min(i*25,350)}ms both`,position:"relative",border:`1px solid ${c}40`,boxShadow:`0 8px 32px -6px rgba(15,23,42,.18), 0 0 0 1px rgba(255,255,255,.5), 0 0 48px -14px ${c}28`}}>
            <Hero mc={mc} h={115}>
              <div style={{position:"absolute",top:7,right:7,display:"flex",gap:3,alignItems:"center",zIndex:2}}>
                {SECRETS.has(mc.id)&&<span style={{padding:"3px 8px",borderRadius:8,background:"rgba(251,191,36,.12)",border:"1px solid rgba(251,191,36,.25)",fontSize:8.5,color:"#fbbf24",fontWeight:600}}>✦ GEM</span>}
                {hasWL&&<span style={{padding:"3px 7px",borderRadius:8,background:"rgba(34,197,94,.1)",border:"1px solid rgba(34,197,94,.2)",fontSize:8.5,color:"rgba(134,239,172,.7)"}}>🐾</span>}
                <span style={{padding:"3px 8px",borderRadius:8,background:"rgba(0,0,0,.5)",fontSize:10.5,color:"rgba(255,255,255,.8)",fontWeight:600}}>{mc.ad}🔥</span>
              </div>
              <div style={{position:"absolute",bottom:7,left:9,zIndex:2}}>
                <span style={{fontSize:26,filter:"drop-shadow(0 2px 6px rgba(0,0,0,.6))"}}>{mc.em}</span>
              </div>
              <button onClick={e=>{e.stopPropagation();toggleFav(mc.id)}} style={{position:"absolute",bottom:7,right:9,width:30,height:30,borderRadius:10,background:"rgba(0,0,0,.4)",border:`1px solid ${favs.has(mc.id)?"rgba(245,158,11,.3)":"rgba(255,255,255,.08)"}`,cursor:"pointer",fontSize:15,color:favs.has(mc.id)?"#f59e0b":"rgba(255,255,255,.3)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:2}}>{favs.has(mc.id)?"★":"☆"}</button>
            </Hero>
            <div style={{padding:"11px 14px 12px",background:"linear-gradient(180deg,#ffffff 0%,#f1f5f9 100%)",backdropFilter:"blur(8px)"}}>
              <div style={{display:"flex",alignItems:"center",gap:5,marginBottom:3}}>
                <span style={{width:7,height:7,borderRadius:"50%",background:c,boxShadow:`0 0 8px ${c}66`}}/>
                <span onClick={e=>{e.stopPropagation();setGTerm(mc.ty)}} style={{fontSize:9.5,color:`${c}cc`,letterSpacing:".04em",textTransform:"uppercase",cursor:"pointer",borderBottom:`1px dotted ${c}55`,fontWeight:500}}>{mc.ty}</span>
                <span style={{marginLeft:"auto",fontSize:9.5,color:"var(--mc-ink-muted)"}}>{FL[mc.co]}</span>
              </div>
              <div style={{fontSize:18,fontFamily:"'Fraunces',Georgia,serif",color:"var(--mc-ink)",lineHeight:1.1,marginBottom:3}}>{mc.n}</div>
              <div style={{fontSize:10.5,color:"var(--mc-ink-muted)",marginBottom:mc.tl?4:6}}>{mc.r}</div>
              {mc.tl&&<div style={{fontSize:11,color:"var(--mc-terracotta)",lineHeight:1.4,marginBottom:6,display:"-webkit-box",WebkitLineClamp:2,WebkitBoxOrient:"vertical",overflow:"hidden",opacity:.92}}>{mc.tl}</div>}
              <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:6}}>
                <span style={{padding:"3px 8px",borderRadius:8,background:"rgba(139,92,246,.08)",border:"1px solid rgba(139,92,246,.2)",color:"#5b21b6",fontSize:9.5}}>✦ {mc.vi}</span>
                <span style={{fontSize:9.5,color:"var(--mc-ink-muted)"}}>📅 {mc.bm.split("(")[0].split("&")[0].trim()}</span>
              </div>
              <div style={{display:"flex",gap:4,flexWrap:"wrap",marginBottom:towns?6:0}}>
                {[["🌡",`${mc.sH}°/${mc.wL}°`,c],["💧",`${mc.ra}″`,"#60a5fa"],["💨",mc.aq,mc.aq<=20?"#22c55e":"#eab308"],["☀️",`${mc.su}d`,"#fbbf24"]].map(([ic,v,col],j)=>(<span key={j} style={{padding:"3px 7px",borderRadius:8,background:`${col}0a`,border:`1px solid ${col}18`,fontSize:9.5,color:`${col}88`,display:"flex",alignItems:"center",gap:3}}><span style={{fontSize:9}}>{ic}</span>{v}</span>))}
              </div>
              {(()=>{const rd=RD[mc.id];return rd?<div style={{display:"flex",gap:4,marginBottom:towns?5:0,flexWrap:"wrap"}}>{rd.bo<=3&&<span style={{padding:"2px 6px",borderRadius:7,background:"rgba(99,102,241,.1)",border:"1px solid rgba(99,102,241,.22)",fontSize:8.5,color:"#4338ca"}}>🌙 Bortle {rd.bo}</span>}{rd.fl>=4&&<span style={{padding:"2px 6px",borderRadius:7,background:"rgba(239,68,68,.08)",border:"1px solid rgba(239,68,68,.2)",fontSize:8.5,color:"#b91c1c"}}>🌊 Flood</span>}{rd.wf>=4&&<span style={{padding:"2px 6px",borderRadius:7,background:"rgba(249,115,22,.08)",border:"1px solid rgba(249,115,22,.2)",fontSize:8.5,color:"#c2410c"}}>🔥 Fire</span>}{rd.ut>=8&&<span style={{padding:"2px 6px",borderRadius:7,background:"rgba(34,197,94,.1)",border:"1px solid rgba(34,197,94,.22)",fontSize:8.5,color:"#166534"}}>✓ {rd.ut}mo comfort</span>}</div>:null})()}
              {towns&&<div style={{fontSize:10.5,color:"var(--mc-ink-muted)",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>🏘️ {towns}</div>}
            </div>
          </div>);})}
      </div>)}
      <div style={{position:"fixed",bottom:0,left:"50%",transform:"translateX(-50%)",width:"100%",maxWidth:520,background:"linear-gradient(180deg,rgba(255,255,255,.92),rgba(241,245,249,.96))",backdropFilter:"blur(28px) saturate(1.2)",borderTop:"1px solid rgba(15,23,42,.08)",boxShadow:"0 -16px 48px -8px rgba(15,23,42,.12)",display:"flex",padding:"12px 0 28px",zIndex:50}}>
        {[{id:"explore",ic:"🌍",l:"Explore"},{id:"homes",ic:"🏠",l:"Homes"},{id:"map",ic:"🗺️",l:"Map"},{id:"favorites",ic:"★",l:"Saved"}].map(x=>(<button key={x.id} className={`mc-nav-btn${nav===x.id?" mc-nav-btn--on":""}`} onClick={()=>{setNav(x.id);setSel(null);closeAll()}} style={{flex:1,background:"none",border:"none",cursor:"pointer",display:"flex",flexDirection:"column",alignItems:"center",gap:4,color:nav===x.id?"var(--mc-accent)":"var(--mc-ink-muted)"}}><span style={{fontSize:18,filter:nav===x.id?"drop-shadow(0 0 8px rgba(13,148,136,.35))":"none"}}>{x.ic}</span><span style={{fontSize:9,fontWeight:nav===x.id?700:500,letterSpacing:".06em",textTransform:"uppercase"}}>{x.l}{x.id==="favorites"&&favs.size>0?` (${favs.size})`:""}</span></button>))}
      </div>
      {sel&&<Detail mc={sel} onClose={()=>setSel(null)} isFav={favs.has(sel.id)} onFav={toggleFav} onTerm={setGTerm} allMC={MC} onNav={m=>setSel(m)}/>}
      {gTerm&&G[gTerm]&&<GModal term={gTerm} onClose={()=>setGTerm(null)}/>}
        </div>
  );
}
