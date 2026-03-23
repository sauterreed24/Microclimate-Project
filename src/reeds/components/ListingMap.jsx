/**
 * Lazy-loaded map surface: Google Maps when VITE_GOOGLE_MAPS_API_KEY is set, else Leaflet.
 * Delegates to ExplorerMap (climate hubs, Sonora layer, Zillow pins by market profile).
 */
import ExplorerMap from "./ExplorerMap.jsx";

export default function ListingMap({
  center,
  listings,
  onSelect,
  southwestBounds,
  listingsProfileId,
  climateFilter,
  onClimateFilterSelect,
  hubs,
  sonoraPlaces,
  referencePoints,
  onSelectReference,
  flyToken,
}) {
  return (
    <ExplorerMap
      southwestBounds={southwestBounds}
      activeCenter={center}
      flyToken={flyToken}
      listings={listings}
      listingsProfileId={listingsProfileId}
      climateFilter={climateFilter}
      onClimateFilterSelect={onClimateFilterSelect}
      hubs={hubs}
      sonoraPlaces={sonoraPlaces}
      referencePoints={referencePoints}
      onSelectReference={onSelectReference}
      onSelectListing={onSelect}
    />
  );
}
