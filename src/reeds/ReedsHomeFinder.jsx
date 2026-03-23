import { lazy, Suspense, useCallback, useEffect, useMemo, useRef, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { Activity, Heart, Home, Keyboard, Loader2, Map as MapIcon, Menu, RefreshCw, Search } from "lucide-react";
import { ALL_LOCATIONS, DEFAULT_LOCATION_ID, getLocationById } from "../data/reeds/locations/index.js";
import { SONORA_TRAVEL_PLACES } from "../data/reeds/locations/sonoraFreeZone.js";
import { getMicroclimateMeta } from "../data/reeds/locations/microclimateProfiles.js";
import { useReedStore } from "./store/useReedStore.js";
import { searchByCoordinates, searchListings } from "./api/client.js";
import { extractListings } from "./lib/extractListings.js";
import LocationLibrary from "./components/LocationLibrary.jsx";
import ListingCard from "./components/ListingCard.jsx";
import ListingSkeleton from "./components/ListingSkeleton.jsx";
import EmptyResults from "./components/EmptyResults.jsx";
import MarketMicroclimatePanel from "./components/MarketMicroclimatePanel.jsx";
import { getMicroclimateBundle } from "./data/microclimateBridge.js";
import { computeClimateHubs, SOUTHWEST_US_BOUNDS } from "./data/climateHubs.js";

const ListingMap = lazy(() => import("./components/ListingMap.jsx"));
const PropertyModal = lazy(() => import("./components/PropertyModal.jsx"));

const SALE_HOME_TYPES = [
  ["HOUSES", "Houses"],
  ["TOWNHOMES", "Townhomes"],
  ["CONDOS_COOPS", "Condos / co-ops"],
  ["MULTI_FAMILY", "Multi-family"],
  ["LOTSLAND", "Lots / land"],
  ["APARTMENTS", "Apartments"],
  ["MANUFACTURED", "Manufactured"],
];

const RENT_HOME_TYPES = [
  ["HOUSES", "Houses"],
  ["APARTMENTS_CONDOS_COOPS", "Apts / condos / co-ops"],
  ["TOWNHOMES", "Townhomes"],
];

/** @returns {{ kind: "location", params: Record<string, string> } | { kind: "coordinates", params: Record<string, string> } | null} */
function buildSearchRequest(state) {
  const loc = getLocationById(state.locationId);
  if (!loc) return null;
  const p = {
    page: String(state.page || 1),
    home_status: state.homeStatus,
    home_type: state.homeType,
    sort: state.sort,
    limit: "40",
  };
  const num = (v) => (v === "" || v == null ? undefined : String(v));
  const add = (k, v) => {
    const n = num(v);
    if (n !== undefined) p[k] = n;
  };
  add("min_price", state.minPrice);
  add("max_price", state.maxPrice);
  add("min_bedrooms", state.minBedrooms);
  add("max_bedrooms", state.maxBedrooms);
  add("min_bathrooms", state.minBathrooms);
  add("max_bathrooms", state.maxBathrooms);
  add("min_sqft", state.minSqft);
  add("max_sqft", state.maxSqft);

  if (loc.searchMode === "coordinates" && loc.coordRadiusMiles) {
    return {
      kind: "coordinates",
      params: {
        ...p,
        latitude: String(loc.lat),
        longitude: String(loc.lng),
        radius: String(loc.coordRadiusMiles),
      },
    };
  }

  return {
    kind: "location",
    params: {
      ...p,
      location: loc.searchQuery,
    },
  };
}

export default function ReedsHomeFinder() {
  const locFilterRef = useRef(null);
  const [sidebar, setSidebar] = useState(true);
  const [libSearch, setLibSearch] = useState("");
  const [view, setView] = useState(() => (typeof localStorage !== "undefined" ? localStorage.getItem("reed-view") || "split" : "split"));
  const [apiOk, setApiOk] = useState(null);
  /** Map-only: filter listing pin colors to a microclimate profile (toggle via hub markers). */
  const [climateMapFilter, setClimateMapFilter] = useState(null);

  const favoriteZpids = useReedStore((s) => s.favoriteZpids);
  const toggleFavorite = useReedStore((s) => s.toggleFavorite);

  const {
    locationId,
    setLocationId,
    page,
    setPage,
    loading,
    setFilters,
    listings,
    setSelectedListing,
    selectedListing,
    detailOpen,
    setDetailOpen,
    homeStatus,
    homeType,
    sort,
    minPrice,
    maxPrice,
    minBedrooms,
    maxBedrooms,
    minBathrooms,
    maxBathrooms,
    minSqft,
    maxSqft,
  } = useReedStore();

  const active = useMemo(() => getLocationById(locationId), [locationId]);
  const priceSuffix = homeStatus === "FOR_RENT" ? "/mo" : "";
  const microBundle = useMemo(() => (locationId ? getMicroclimateBundle(locationId) : null), [locationId]);
  const activeMcMeta = useMemo(() => {
    const p = active?.microclimateProfile;
    return p ? getMicroclimateMeta(p) : null;
  }, [active]);

  const climateHubs = useMemo(() => computeClimateHubs(ALL_LOCATIONS), []);

  const climateMismatchOnMap = Boolean(climateMapFilter && active?.microclimateProfile && climateMapFilter !== active.microclimateProfile);

  useEffect(() => {
    if (!getLocationById(locationId)) {
      setLocationId(DEFAULT_LOCATION_ID);
    }
  }, [locationId, setLocationId]);

  useEffect(() => {
    localStorage.setItem("reed-view", view);
  }, [view]);

  useEffect(() => {
    const valid =
      homeStatus === "FOR_RENT"
        ? RENT_HOME_TYPES.map(([v]) => v)
        : SALE_HOME_TYPES.map(([v]) => v);
    if (!valid.includes(homeType)) {
      setFilters({ homeType: "HOUSES", page: 1 });
    }
  }, [homeStatus, homeType, setFilters]);

  useEffect(() => {
    if (homeStatus === "FOR_RENT" && sort === "VERIFIED_SOURCE") return;
    if (homeStatus !== "FOR_RENT" && sort === "VERIFIED_SOURCE") {
      setFilters({ sort: "DEFAULT", page: 1 });
    }
  }, [homeStatus, sort, setFilters]);

  useEffect(() => {
    let cancelled = false;
    let interval;
    async function ping() {
      try {
        const r = await fetch("/api/health");
        const d = await r.json();
        if (!cancelled) setApiOk(!!(d.ok && d.hasKey));
      } catch {
        if (!cancelled) setApiOk(false);
      }
    }
    ping();
    interval = setInterval(ping, 45_000);
    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "/" && document.activeElement?.tagName !== "INPUT" && document.activeElement?.tagName !== "TEXTAREA") {
        e.preventDefault();
        locFilterRef.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const runSearch = useCallback(async () => {
    const snap = useReedStore.getState();
    const req = buildSearchRequest(snap);
    if (!req) {
      useReedStore.setState({ listings: [], rawResponse: null, loading: false, error: null });
      return;
    }
    useReedStore.setState({ loading: true, error: null });
    try {
      const raw =
        req.kind === "coordinates" ? await searchByCoordinates(req.params) : await searchListings(req.params);
      const list = extractListings(raw);
      useReedStore.setState({ rawResponse: raw, listings: list, loading: false });
    } catch (e) {
      console.error(e);
      useReedStore.setState({ listings: [], loading: false, error: e.message });
      toast.error(e.response?.data?.error || e.message || "Search failed");
    }
  }, []);

  useEffect(() => {
    runSearch();
  }, [
    runSearch,
    locationId,
    page,
    homeStatus,
    homeType,
    sort,
    minPrice,
    maxPrice,
    minBedrooms,
    maxBedrooms,
    minBathrooms,
    maxBathrooms,
    minSqft,
    maxSqft,
  ]);

  const selectLocation = (id) => {
    setClimateMapFilter(null);
    setLocationId(id);
    if (typeof window !== "undefined" && window.matchMedia("(max-width: 1023px)").matches) {
      setSidebar(false);
    }
  };

  const applyPreset = (patch) => {
    setFilters({ ...patch, page: 1 });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-stone-100 via-stone-50 to-white text-stone-800">
      <Toaster
        position="top-center"
        toastOptions={{ className: "bg-white text-stone-800 border border-stone-200 shadow-lg", duration: 3000 }}
      />

      <header className="sticky top-0 z-50 border-b border-stone-200/90 bg-white/90 shadow-sm backdrop-blur-md">
        <div className="mx-auto flex max-w-[1600px] items-center justify-between gap-4 px-4 py-3">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setSidebar((s) => !s)}
              className="rounded-xl border border-stone-200 bg-white p-2 text-stone-600 shadow-sm hover:bg-stone-50 lg:hidden"
            >
              <Menu className="h-5 w-5" />
            </button>
            <div className="flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-teal-500 to-emerald-700 shadow-md shadow-teal-900/15">
                <Home className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="font-display text-lg font-semibold tracking-tight text-stone-900">Reed&apos;s Home Finder</h1>
                <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-teal-700/90">Arizona · California · New Mexico</p>
              </div>
            </div>
          </div>
          <div className="flex flex-wrap items-center justify-end gap-2 sm:gap-3">
            <div
              className="hidden items-center gap-1.5 rounded-full border border-stone-200 bg-stone-50/90 px-2.5 py-1 text-[10px] text-stone-500 sm:flex"
              title="API proxy"
            >
              <Activity className={`h-3.5 w-3.5 ${apiOk ? "text-emerald-600" : apiOk === false ? "text-red-500" : "text-stone-400"}`} />
              <span>{apiOk == null ? "API…" : apiOk ? "API live" : "API down"}</span>
            </div>
            {favoriteZpids.length > 0 && (
              <span className="flex items-center gap-1 rounded-full border border-rose-200 bg-rose-50 px-2 py-0.5 text-[10px] font-medium text-rose-800">
                <Heart className="h-3 w-3 fill-rose-400 text-rose-500" />
                {favoriteZpids.length} saved
              </span>
            )}
            <span className="hidden items-center gap-1 text-[10px] text-stone-500 md:flex">
              <Keyboard className="h-3 w-3" />
              <kbd className="rounded border border-stone-200 bg-white px-1 font-sans text-stone-600 shadow-sm">/</kbd> filter
            </span>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => setView("split")}
                className={`rounded-lg px-2.5 py-1.5 text-xs font-medium ${view === "split" ? "bg-teal-100 text-teal-900 ring-1 ring-teal-200" : "text-stone-500 hover:bg-stone-100 hover:text-stone-800"}`}
              >
                Split
              </button>
              <button
                type="button"
                onClick={() => setView("list")}
                className={`rounded-lg px-2.5 py-1.5 text-xs font-medium ${view === "list" ? "bg-teal-100 text-teal-900 ring-1 ring-teal-200" : "text-stone-500 hover:bg-stone-100 hover:text-stone-800"}`}
              >
                List
              </button>
              <button
                type="button"
                onClick={() => setView("map")}
                className={`rounded-lg px-2.5 py-1.5 text-xs font-medium ${view === "map" ? "bg-teal-100 text-teal-900 ring-1 ring-teal-200" : "text-stone-500 hover:bg-stone-100 hover:text-stone-800"}`}
              >
                Map
              </button>
            </div>
            <button
              type="button"
              onClick={() => runSearch()}
              className="inline-flex items-center gap-2 rounded-xl border border-stone-200 bg-white px-3 py-2 text-xs font-semibold text-stone-800 shadow-sm hover:bg-stone-50"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin text-teal-600" : ""}`} />
              Refresh
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto flex max-w-[1600px] gap-0 lg:gap-4">
        <aside
          className={`${
            sidebar ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
          } fixed inset-y-0 left-0 z-40 w-[min(100%,320px)] border-r border-stone-200 bg-white p-4 shadow-lg transition-transform lg:static lg:w-80 lg:shrink-0 lg:border-0 lg:bg-transparent lg:shadow-none`}
        >
          <div className="mb-3 flex items-center gap-2 rounded-xl border border-stone-200 bg-white px-3 py-2 shadow-sm">
            <Search className="h-4 w-4 text-stone-400" />
            <input
              ref={locFilterRef}
              value={libSearch}
              onChange={(e) => setLibSearch(e.target.value)}
              placeholder="Filter towns, state, or microclimate…"
              className="w-full bg-transparent text-sm text-stone-800 placeholder:text-stone-400 focus:outline-none"
            />
          </div>
          <LocationLibrary locationId={locationId} onSelect={selectLocation} search={libSearch} />
        </aside>
        {sidebar && (
          <button type="button" className="fixed inset-0 z-30 bg-stone-900/40 backdrop-blur-[1px] lg:hidden" aria-label="Close menu" onClick={() => setSidebar(false)} />
        )}

        <main className="min-w-0 flex-1 space-y-4 px-4 py-4">
          <div className="rounded-2xl border border-stone-200/90 bg-white p-4 shadow-lg shadow-stone-200/40 ring-1 ring-stone-100">
            <div className="flex flex-wrap items-end gap-3">
              <div className="min-w-[200px] flex-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-stone-500">Active market</label>
                <p className="mt-1 font-display text-lg text-stone-900">{active?.label ?? "—"}</p>
                <p className="text-xs text-stone-500">{active?.region}</p>
                {activeMcMeta && (
                  <p className="mt-1.5 max-w-xl text-[11px] leading-snug text-teal-900/85" title={activeMcMeta.blurb}>
                    <span className="mr-1">{activeMcMeta.emoji}</span>
                    <span className="font-semibold">{activeMcMeta.title}</span>
                    <span className="text-stone-600"> — {activeMcMeta.blurb.slice(0, 120)}
                    {activeMcMeta.blurb.length > 120 ? "…" : ""}</span>
                  </p>
                )}
              </div>
              <Field label="Status">
                <select
                  value={homeStatus}
                  onChange={(e) => setFilters({ homeStatus: e.target.value, page: 1 })}
                  className="rounded-lg border border-stone-200 bg-white px-2 py-2 text-xs text-stone-800 shadow-sm"
                >
                  <option value="FOR_SALE">For sale</option>
                  <option value="FOR_RENT">For rent</option>
                  <option value="RECENTLY_SOLD">Recently sold</option>
                </select>
              </Field>
              <Field label="Type">
                <select
                  value={homeType}
                  onChange={(e) => setFilters({ homeType: e.target.value, page: 1 })}
                  className="rounded-lg border border-stone-200 bg-white px-2 py-2 text-xs text-stone-800 shadow-sm"
                >
                  {(homeStatus === "FOR_RENT" ? RENT_HOME_TYPES : SALE_HOME_TYPES).map(([val, lab]) => (
                    <option key={val} value={val}>
                      {lab}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="Sort">
                <select
                  value={sort}
                  onChange={(e) => setFilters({ sort: e.target.value, page: 1 })}
                  className="rounded-lg border border-stone-200 bg-white px-2 py-2 text-xs text-stone-800 shadow-sm"
                >
                  <option value="DEFAULT">Default</option>
                  {homeStatus === "FOR_RENT" && <option value="VERIFIED_SOURCE">Verified source</option>}
                  <option value="NEWEST">Newest</option>
                  <option value="PRICE_LOW_HIGH">Price ↑</option>
                  <option value="PRICE_HIGH_LOW">Price ↓</option>
                  <option value="SQUARE_FEET">Sqft</option>
                  <option value="LOT_SIZE">Lot size</option>
                  <option value="BEDROOMS">Beds</option>
                  <option value="BATHROOMS">Baths</option>
                </select>
              </Field>
            </div>

            <div className="mt-3 flex flex-wrap gap-2">
              <span className="self-center text-[10px] font-bold uppercase tracking-wider text-stone-400">Quick</span>
              {homeStatus === "FOR_SALE" && (
                <>
                  <PresetChip onClick={() => applyPreset({ maxPrice: "400000" })} label="≤ $400k" />
                  <PresetChip onClick={() => applyPreset({ maxPrice: "750000" })} label="≤ $750k" />
                  <PresetChip onClick={() => applyPreset({ minBedrooms: "3" })} label="3+ bd" />
                </>
              )}
              {homeStatus === "FOR_RENT" && (
                <>
                  <PresetChip onClick={() => applyPreset({ maxPrice: "2500" })} label="Rent ≤ $2500" />
                  <PresetChip onClick={() => applyPreset({ minBedrooms: "2" })} label="2+ bd" />
                </>
              )}
              <PresetChip
                onClick={() =>
                  applyPreset({
                    minPrice: "",
                    maxPrice: "",
                    minBedrooms: "",
                    maxBedrooms: "",
                    minBathrooms: "",
                    maxBathrooms: "",
                    minSqft: "",
                    maxSqft: "",
                  })
                }
                label="Clear prices & rooms"
              />
            </div>

            <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <Field label={homeStatus === "FOR_RENT" ? "Min rent/mo" : "Min price"}>
                <input
                  value={minPrice}
                  onChange={(e) => setFilters({ minPrice: e.target.value, page: 1 })}
                  placeholder="0"
                  className="w-full rounded-lg border border-stone-200 bg-white px-2 py-2 text-xs text-stone-800 shadow-sm"
                />
              </Field>
              <Field label={homeStatus === "FOR_RENT" ? "Max rent/mo" : "Max price"}>
                <input
                  value={maxPrice}
                  onChange={(e) => setFilters({ maxPrice: e.target.value, page: 1 })}
                  placeholder="Any"
                  className="w-full rounded-lg border border-stone-200 bg-white px-2 py-2 text-xs text-stone-800 shadow-sm"
                />
              </Field>
              <Field label="Beds (min–max)">
                <div className="flex gap-1">
                  <input
                    value={minBedrooms}
                    onChange={(e) => setFilters({ minBedrooms: e.target.value, page: 1 })}
                    className="w-full rounded-lg border border-stone-200 bg-white px-2 py-2 text-xs shadow-sm"
                    placeholder="min"
                  />
                  <input
                    value={maxBedrooms}
                    onChange={(e) => setFilters({ maxBedrooms: e.target.value, page: 1 })}
                    className="w-full rounded-lg border border-stone-200 bg-white px-2 py-2 text-xs shadow-sm"
                    placeholder="max"
                  />
                </div>
              </Field>
              <Field label="Baths (min–max)">
                <div className="flex gap-1">
                  <input
                    value={minBathrooms}
                    onChange={(e) => setFilters({ minBathrooms: e.target.value, page: 1 })}
                    className="w-full rounded-lg border border-stone-200 bg-white px-2 py-2 text-xs shadow-sm"
                    placeholder="min"
                  />
                  <input
                    value={maxBathrooms}
                    onChange={(e) => setFilters({ maxBathrooms: e.target.value, page: 1 })}
                    className="w-full rounded-lg border border-stone-200 bg-white px-2 py-2 text-xs shadow-sm"
                    placeholder="max"
                  />
                </div>
              </Field>
              <Field label="Sqft (min–max)">
                <div className="flex gap-1">
                  <input
                    value={minSqft}
                    onChange={(e) => setFilters({ minSqft: e.target.value, page: 1 })}
                    className="w-full rounded-lg border border-stone-200 bg-white px-2 py-2 text-xs shadow-sm"
                    placeholder="min"
                  />
                  <input
                    value={maxSqft}
                    onChange={(e) => setFilters({ maxSqft: e.target.value, page: 1 })}
                    className="w-full rounded-lg border border-stone-200 bg-white px-2 py-2 text-xs shadow-sm"
                    placeholder="max"
                  />
                </div>
              </Field>
            </div>
          </div>

          {microBundle && active && <MarketMicroclimatePanel bundle={microBundle} locationLabel={active.label} />}

          {loading && <ListingSkeleton />}

          {!loading && listings.length === 0 && <EmptyResults loading={loading} />}

          <div className={`grid gap-4 ${view === "split" ? "lg:grid-cols-2" : view === "map" ? "grid-cols-1" : "grid-cols-1"}`}>
            {(view === "split" || view === "list") && !loading && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-stone-600">
                    {listings.length} results · page {page}
                  </p>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      disabled={page <= 1}
                      onClick={() => setPage(page - 1)}
                      className="rounded-lg border border-stone-200 bg-white px-3 py-1 text-xs font-medium text-stone-700 shadow-sm disabled:opacity-40"
                    >
                      Prev
                    </button>
                    <button
                      type="button"
                      onClick={() => setPage(page + 1)}
                      className="rounded-lg border border-stone-200 bg-white px-3 py-1 text-xs font-medium text-stone-700 shadow-sm"
                    >
                      Next
                    </button>
                  </div>
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  {listings.map((li) => (
                    <ListingCard
                      key={li.zpid || li.address}
                      listing={li}
                      priceSuffix={priceSuffix}
                      onOpen={(l) => {
                        setSelectedListing(l);
                        setDetailOpen(true);
                      }}
                      isFavorite={(z) => favoriteZpids.includes(z)}
                      onToggleFavorite={toggleFavorite}
                    />
                  ))}
                </div>
              </div>
            )}

            {(view === "split" || view === "map") && active && !loading && (
              <div className="min-h-[400px]">
                <div className="mb-2 space-y-2">
                  <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-stone-500">
                    <MapIcon className="h-3.5 w-3.5 text-teal-600" />
                    <span>
                      <span className="font-medium text-stone-700">Zillow</span> listings (price pins) +{" "}
                      <span className="font-medium text-stone-700">microclimate hubs</span> (tap to match pin colors) +{" "}
                      <span className="font-medium text-violet-800">Sonora</span> travel context ·{" "}
                      <span className="font-medium text-teal-800">pulse</span> = active search anchor
                      <span className="ml-1 text-stone-400">
                        · {import.meta.env.VITE_GOOGLE_MAPS_API_KEY ? "Google Maps engine" : "Leaflet · CARTO / Esri / OSM"}
                      </span>
                    </span>
                  </div>
                  {climateMismatchOnMap && activeMcMeta && (
                    <div
                      className="rounded-xl border border-amber-200 bg-amber-50/95 px-3 py-2 text-[11px] leading-snug text-amber-950 shadow-sm"
                      role="status"
                    >
                      <span className="font-semibold">Heads up:</span> map filter is set to a different climate than{" "}
                      <span className="font-medium">{active.label}</span> ({activeMcMeta.emoji} {activeMcMeta.title}). Listing pins are hidden until you clear the
                      filter or pick a matching hub — results are still for your selected market.
                    </div>
                  )}
                </div>
                <Suspense
                  fallback={
                    <div className="flex h-[min(50vh,420px)] items-center justify-center rounded-2xl border border-stone-200 bg-white text-sm text-stone-500 shadow-sm">
                      <Loader2 className="mr-2 h-5 w-5 animate-spin text-teal-600" />
                      Loading map…
                    </div>
                  }
                >
                  <ListingMap
                    southwestBounds={SOUTHWEST_US_BOUNDS}
                    flyToken={locationId}
                    center={{ lat: active.lat, lng: active.lng }}
                    listings={listings}
                    listingsProfileId={active.microclimateProfile}
                    climateFilter={climateMapFilter}
                    onClimateFilterSelect={setClimateMapFilter}
                    hubs={climateHubs}
                    sonoraPlaces={SONORA_TRAVEL_PLACES}
                    onSelect={(l) => {
                      setSelectedListing(l);
                      setDetailOpen(true);
                    }}
                  />
                </Suspense>
              </div>
            )}
          </div>
        </main>
      </div>

      {detailOpen && selectedListing && (
        <Suspense fallback={null}>
          <PropertyModal
            listing={selectedListing}
            priceSuffix={priceSuffix}
            onClose={() => {
              setDetailOpen(false);
              setSelectedListing(null);
            }}
          />
        </Suspense>
      )}
    </div>
  );
}

function Field({ label, children }) {
  return (
    <label className="block">
      <span className="text-[10px] font-bold uppercase tracking-wider text-stone-500">{label}</span>
      <div className="mt-1">{children}</div>
    </label>
  );
}

function PresetChip({ label, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="rounded-full border border-teal-200 bg-teal-50/80 px-3 py-1 text-[11px] font-medium text-teal-900 transition hover:bg-teal-100"
    >
      {label}
    </button>
  );
}
