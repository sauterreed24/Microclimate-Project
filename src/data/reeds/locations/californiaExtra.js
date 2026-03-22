/**
 * Additional California search centers — merged with california.js (manual wins on id).
 */
export const CALIFORNIA_EXTRA_ROWS = [
  // Greater Los Angeles & OC
  ["west-covina-ca", "West Covina, CA", "West Covina, CA", "Los Angeles & Orange County", 34.0686, -117.939],
  ["norwalk-ca", "Norwalk, CA", "Norwalk, CA", "Los Angeles & Orange County", 33.9022, -118.0817],
  ["inglewood-ca", "Inglewood, CA", "Inglewood, CA", "Los Angeles & Orange County", 33.9617, -118.3531],
  ["hawthorne-ca", "Hawthorne, CA", "Hawthorne, CA", "Los Angeles & Orange County", 33.9164, -118.3526],
  ["downey-ca", "Downey, CA", "Downey, CA", "Los Angeles & Orange County", 33.9401, -118.1332],
  ["el-monte-ca", "El Monte, CA", "El Monte, CA", "Los Angeles & Orange County", 34.0686, -118.0276],
  ["santa-clarita-ca", "Santa Clarita, CA", "Santa Clarita, CA", "Los Angeles & Orange County", 34.3917, -118.5426],
  ["palmdale-ca", "Palmdale, CA", "Palmdale, CA", "Los Angeles & Orange County", 34.5794, -118.1165],
  ["lancaster-ca", "Lancaster, CA", "Lancaster, CA", "Los Angeles & Orange County", 34.6868, -118.1542],
  ["pomona-ca", "Pomona, CA", "Pomona, CA", "Los Angeles & Orange County", 34.0551, -117.7493],
  ["westminster-ca", "Westminster, CA", "Westminster, CA", "Los Angeles & Orange County", 33.7592, -117.9897],
  ["lakewood-ca", "Lakewood, CA", "Lakewood, CA", "Los Angeles & Orange County", 33.8536, -118.134],
  ["buena-park-ca", "Buena Park, CA", "Buena Park, CA", "Los Angeles & Orange County", 33.8675, -117.9981],
  ["alhambra-ca", "Alhambra, CA", "Alhambra, CA", "Los Angeles & Orange County", 34.0953, -118.127],
  ["garden-grove-ca", "Garden Grove, CA", "Garden Grove, CA", "Los Angeles & Orange County", 33.7743, -117.938],
  ["rialto-ca", "Rialto, CA", "Rialto, CA", "Los Angeles & Orange County", 34.1064, -117.3703],
  ["compton-ca", "Compton, CA", "Compton, CA", "Los Angeles & Orange County", 33.8958, -118.2201],
  ["carson-ca", "Carson, CA", "Carson, CA", "Los Angeles & Orange County", 33.8314, -118.282],

  // Bay Area & Peninsula
  ["santa-clara-ca", "Santa Clara, CA", "Santa Clara, CA", "Bay Area & Peninsula", 37.3541, -121.9552],
  ["vallejo-ca", "Vallejo, CA", "Vallejo, CA", "Bay Area & Peninsula", 38.1041, -122.2566],
  ["fairfield-ca", "Fairfield, CA", "Fairfield, CA", "Bay Area & Peninsula", 38.2494, -122.04],
  ["richmond-ca", "Richmond, CA", "Richmond, CA", "Bay Area & Peninsula", 37.9358, -122.3477],
  ["san-mateo-ca", "San Mateo, CA", "San Mateo, CA", "Bay Area & Peninsula", 37.563, -122.3255],
  ["daly-city-ca", "Daly City, CA", "Daly City, CA", "Bay Area & Peninsula", 37.6879, -122.4702],
  ["san-leandro-ca", "San Leandro, CA", "San Leandro, CA", "Bay Area & Peninsula", 37.7249, -122.1561],
  ["alameda-ca", "Alameda, CA", "Alameda, CA", "Bay Area & Peninsula", 37.7652, -122.2416],
  ["petaluma-ca", "Petaluma, CA", "Petaluma, CA", "Bay Area & Peninsula", 38.2324, -122.6367],
  ["san-rafael-ca", "San Rafael, CA", "San Rafael, CA", "Bay Area & Peninsula", 37.9735, -122.5311],

  // San Diego & Imperial
  ["la-mesa-ca", "La Mesa, CA", "La Mesa, CA", "San Diego & Imperial", 32.7678, -117.0231],
  ["el-cajon-ca", "El Cajon, CA", "El Cajon, CA", "San Diego & Imperial", 32.7948, -116.9625],
  ["vista-ca", "Vista, CA", "Vista, CA", "San Diego & Imperial", 33.2001, -117.2425],
  ["san-marcos-ca", "San Marcos, CA", "San Marcos, CA", "San Diego & Imperial", 33.1434, -117.1661],
  ["encinitas-ca", "Encinitas, CA", "Encinitas, CA", "San Diego & Imperial", 33.0369, -117.292],
  ["del-mar-ca", "Del Mar, CA", "Del Mar, CA", "San Diego & Imperial", 32.9595, -117.2653],
  ["la-jolla-ca", "La Jolla, CA", "La Jolla, CA", "San Diego & Imperial", 32.8328, -117.2713],
  ["calexico-ca", "Calexico, CA", "Calexico, CA", "San Diego & Imperial", 32.6789, -115.4989],
  ["brawley-ca", "Brawley, CA", "Brawley, CA", "San Diego & Imperial", 32.9787, -115.5303],

  // Inland Empire
  ["victorville-ca", "Victorville, CA", "Victorville, CA", "Inland Empire", 34.5361, -117.2912],
  ["hesperia-ca", "Hesperia, CA", "Hesperia, CA", "Inland Empire", 34.4264, -117.3009],
  ["apple-valley-ca", "Apple Valley, CA", "Apple Valley, CA", "Inland Empire", 34.5008, -117.1859],
  ["redlands-ca", "Redlands, CA", "Redlands, CA", "Inland Empire", 34.0556, -117.182],
  ["upland-ca", "Upland, CA", "Upland, CA", "Inland Empire", 34.0975, -117.6484],
  ["chino-ca", "Chino, CA", "Chino, CA", "Inland Empire", 34.0128, -117.6884],
  ["chino-hills-ca", "Chino Hills, CA", "Chino Hills, CA", "Inland Empire", 33.9898, -117.7326],
  ["yucaipa-ca", "Yucaipa, CA", "Yucaipa, CA", "Inland Empire", 34.0336, -117.0431],
  ["indio-ca", "Indio, CA", "Indio, CA", "Inland Empire", 33.7206, -116.215],
  ["coachella-ca", "Coachella, CA", "Coachella, CA", "Inland Empire", 33.6803, -116.1739],
  ["cathedral-city-ca", "Cathedral City, CA", "Cathedral City, CA", "Inland Empire", 33.8406, -116.4653],
  ["desert-hot-springs-ca", "Desert Hot Springs, CA", "Desert Hot Springs, CA", "Inland Empire", 33.9611, -116.5017],
  ["joshua-tree-ca", "Joshua Tree, CA", "Joshua Tree, CA", "Inland Empire", 34.1347, -116.313],
  ["twentynine-palms-ca", "Twentynine Palms, CA", "Twentynine Palms, CA", "Inland Empire", 34.1356, -116.0543],

  // Central Coast
  ["camarillo-ca", "Camarillo, CA", "Camarillo, CA", "Central Coast", 34.2164, -119.0376],
  ["lompoc-ca", "Lompoc, CA", "Lompoc, CA", "Central Coast", 34.6392, -120.4579],
  ["morro-bay-ca", "Morro Bay, CA", "Morro Bay, CA", "Central Coast", 35.3658, -120.8499],
  ["pismo-beach-ca", "Pismo Beach, CA", "Pismo Beach, CA", "Central Coast", 35.1428, -120.6413],
  ["gilroy-ca", "Gilroy, CA", "Gilroy, CA", "Central Coast", 37.0058, -121.7569],
  ["watsonville-ca", "Watsonville, CA", "Watsonville, CA", "Central Coast", 36.9102, -121.7569],
  ["santa-cruz-ca", "Santa Cruz, CA", "Santa Cruz, CA", "Central Coast", 36.9741, -122.0308],
  ["carmel-by-the-sea-ca", "Carmel-by-the-Sea, CA", "Carmel-by-the-Sea, CA", "Central Coast", 36.5552, -121.9233],

  // Sacramento Valley
  ["citrus-heights-ca", "Citrus Heights, CA", "Citrus Heights, CA", "Sacramento Valley", 38.7071, -121.281],
  ["vacaville-ca", "Vacaville, CA", "Vacaville, CA", "Sacramento Valley", 38.3566, -121.9877],
  ["chico-ca", "Chico, CA", "Chico, CA", "Sacramento Valley", 39.7285, -121.8375],
  ["yuba-city-ca", "Yuba City, CA", "Yuba City, CA", "Sacramento Valley", 39.1404, -121.6169],

  // Central Valley
  ["turlock-ca", "Turlock, CA", "Turlock, CA", "Central Valley", 37.4947, -120.8466],
  ["manteca-ca", "Manteca, CA", "Manteca, CA", "Central Valley", 37.7974, -121.216],
  ["tracy-ca", "Tracy, CA", "Tracy, CA", "Central Valley", 37.7397, -121.4252],
  ["hanford-ca", "Hanford, CA", "Hanford, CA", "Central Valley", 36.3274, -119.6457],
  ["porterville-ca", "Porterville, CA", "Porterville, CA", "Central Valley", 36.0652, -119.0168],
  ["delano-ca", "Delano, CA", "Delano, CA", "Central Valley", 35.7688, -119.2471],
  ["clovis-ca", "Clovis, CA", "Clovis, CA", "Central Valley", 36.8252, -119.7029],
  ["madera-ca", "Madera, CA", "Madera, CA", "Central Valley", 36.9613, -120.0607],
  ["lodi-ca", "Lodi, CA", "Lodi, CA", "Central Valley", 38.1302, -121.2724],

  // Sierra & Tahoe
  ["mammoth-lakes-ca", "Mammoth Lakes, CA", "Mammoth Lakes, CA", "Sierra & Tahoe", 37.6485, -118.9721],
  ["nevada-city-ca", "Nevada City, CA", "Nevada City, CA", "Sierra & Tahoe", 39.2616, -121.0169],
  ["grass-valley-ca", "Grass Valley, CA", "Grass Valley, CA", "Sierra & Tahoe", 39.2191, -121.0611],

  // North State
  ["ukiah-ca", "Ukiah, CA", "Ukiah, CA", "North State", 39.1502, -123.2078],
  ["fort-bragg-ca", "Fort Bragg, CA", "Fort Bragg, CA", "North State", 39.4457, -123.8053],
  ["crescent-city-ca", "Crescent City, CA", "Crescent City, CA", "North State", 41.7558, -124.2026],
  ["mount-shasta-ca", "Mount Shasta, CA", "Mount Shasta, CA", "North State", 41.314, -122.311],
];
