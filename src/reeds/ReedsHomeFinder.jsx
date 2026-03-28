import { lazy, Suspense, useCallback, useEffect, useMemo, useRef, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import {
  Activity,
  AlertTriangle,
  Heart,
  HelpCircle,
  Home,
  Keyboard,
  Loader2,
  Map as MapIcon,
  Menu,
  RefreshCw,
  Search,
  Sparkles,
} from "lucide-react";
import { ALL_LOCATIONS, DEFAULT_LOCATION_ID, getLocationById } from "../data/reeds/locations/index.js";
import { SONORA_TRAVEL_PLACES } from "../data/reeds/locations/sonoraFreeZone.js";
import { SONORA_MEXICO } from "../data/reeds/locations/mexico.js";
import { getMicroclimateMeta } from "../data/reeds/locations/microclimateProfiles.js";
import { useReedStore } from "./store/useReedStore.js";
import { searchByCoordinates, searchListings } from "./api/client.js";
import { extractListings } from "./lib/extractListings.js";
import LocationLibrary from "./components/LocationLibrary.jsx";
import ListingCard from "./components/ListingCard.jsx";
import ListingSkeleton from "./components/ListingSkeleton.jsx";
import EmptyResults from "./components/EmptyResults.jsx";
import ExploreListRail from "./components/ExploreListRail.jsx";
import MarketMicroclimatePanel from "./components/MarketMicroclimatePanel.jsx";
import ImmersiveResearchStrip from "./components/ImmersiveResearchStrip.jsx";
import KeyboardShortcutsDialog from "./components/KeyboardShortcutsDialog.jsx";
import { getMicroclimateBundle } from "./data/microclimateBridge.js";
import { computeClimateHubs, SOUTHWEST_US_BOUNDS } from "./data/climateHubs.js";
import { readableApiError } from "./lib/errorMessage.js";
import { buildDemoListingsForLocation } from "./lib/demoListings.js";
import {
  getAutoRefreshIntervalMs,
  getBackgroundPollIntervalMs,
  searchFingerprint,
  shouldAutoRefresh,
  writeIngestionMeta,
} from "./lib/listingFreshness.js";
import { locationSearchFallbacks } from "./lib/searchFallbacks.js";

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

/** localStorage timestamp for throttling API health checks (at most ~daily when tab regains focus) */
const API_HEALTH_LAST_KEY = "reed-api-health-check-ts";
const ONE_DAY_MS = 24 * 60 * 60 * 1000;

/** Zillow proxy page size (OpenWeb Ninja / upstream caps vary — tune via env). */
const ZILLOW_PAGE_LIMIT = String(
  Math.min(
    200,
    Math.max(20, Number.isFinite(Number(import.meta.env.VITE_ZILLOW_PAGE_LIMIT)) ? Number(import.meta.env.VITE_ZILLOW_PAGE_LIMIT) : 100)
  )
);
/** Merge this many consecutive API pages per search (deduped by zpid). */
const ZILLOW_MAX_PAGES = Math.min(
  12,
  Math.max(1, Number.isFinite(Number(import.meta.env.VITE_ZILLOW_MAX_PAGES)) ? Number(import.meta.env.VITE_ZILLOW_MAX_PAGES) : 8)
);

/** Client-side list rail / list view page size (merged API results are sliced; map keeps all pins). */
const LISTINGS_UI_PAGE_SIZE = Math.min(
  200,
  Math.max(
    12,
    Number.isFinite(Number(import.meta.env.VITE_LISTINGS_UI_PAGE_SIZE))
      ? Number(import.meta.env.VITE_LISTINGS_UI_PAGE_SIZE)
      : Number(ZILLOW_PAGE_LIMIT) || 80
  )
);

function stripUndefined(obj) {
  const out = {};
  for (const [k, v] of Object.entries(obj || {})) {
    if (v !== undefined && v !== null && v !== "") out[k] = v;
  }
  return out;
}

function safeLocalStorageGet(key, fallback = null) {
  try {
    if (typeof window === "undefined" || !window.localStorage) return fallback;
    return window.localStorage.getItem(key) ?? fallback;
  } catch {
    return fallback;
  }
}

function safeLocalStorageSet(key, value) {
  try {
    if (typeof window === "undefined" || !window.localStorage) return;
    window.localStorage.setItem(key, value);
  } catch {
    /* private mode / quota / policy */
  }
}

/** @returns {{ kind: "location", params: Record<string, string> } | { kind: "coordinates", params: Record<string, string> } | null} */
function buildSearchRequest(state) {
  const loc = getLocationById(state.locationId);
  if (!loc) return null;
  const p = {
    page: String(state.page || 1),
    home_status: state.homeStatus,
    home_type: state.homeType,
    sort: state.sort,
    limit: ZILLOW_PAGE_LIMIT,
  };
  const toNumber = (value, opts = { allowDecimal: false, min: 0 }) => {
    if (value === "" || value == null) return undefined;
    const cleaned = String(value).trim().replace(/[,$\s]/g, "");
    if (!cleaned) return undefined;
    const raw = opts.allowDecimal ? Number.parseFloat(cleaned) : Number.parseInt(cleaned, 10);
    if (!Number.isFinite(raw)) return undefined;
    if (raw < opts.min) return undefined;
    return opts.allowDecimal ? raw : Math.round(raw);
  };

  const normalizeRange = (minV, maxV, opts) => {
    const min = toNumber(minV, opts);
    const max = toNumber(maxV, opts);
    if (min == null && max == null) return [undefined, undefined];
    if (min != null && max != null && min > max) return [max, min];
    return [min, max];
  };

  const [minPrice, maxPrice] = normalizeRange(state.minPrice, state.maxPrice, { allowDecimal: false, min: 0 });
  const [minBeds, maxBeds] = normalizeRange(state.minBedrooms, state.maxBedrooms, { allowDecimal: false, min: 0 });
  const [minBaths, maxBaths] = normalizeRange(state.minBathrooms, state.maxBathrooms, { allowDecimal: true, min: 0 });
  const [minSqft, maxSqft] = normalizeRange(state.minSqft, state.maxSqft, { allowDecimal: false, min: 0 });

  const addNum = (key, value) => {
    if (value == null) return;
    p[key] = String(value);
  };
  addNum("min_price", minPrice);
  addNum("max_price", maxPrice);
  addNum("min_bedrooms", minBeds);
  addNum("max_bedrooms", maxBeds);
  addNum("min_bathrooms", minBaths);
  addNum("max_bathrooms", maxBaths);
  addNum("min_sqft", minSqft);
  addNum("max_sqft", maxSqft);

  if (loc.searchMode === "coordinates" && loc.coordRadiusMiles) {
    const latitude = loc.lat ?? loc.latitude;
    const longitude = loc.lng ?? loc.longitude ?? loc.long;
    if (!Number.isFinite(Number(latitude)) || !Number.isFinite(Number(longitude))) {
      return {
        kind: "location",
        params: {
          ...p,
          location: loc.searchQuery,
        },
      };
    }
    return {
      kind: "coordinates",
      params: {
        ...p,
        latitude: String(latitude),
        longitude: String(longitude),
        long: String(longitude),
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
  const [view, setView] = useState(() => safeLocalStorageGet("reed-view", "split") || "split");
  const [shortcutsOpen, setShortcutsOpen] = useState(false);
  const [apiOk, setApiOk] = useState(null);
  /** Map-only: filter listing pin colors to a microclimate profile (toggle via hub markers). */
  const [climateMapFilter, setClimateMapFilter] = useState(null);
  /** Defer mounting Leaflet/Google map until the browser is idle — avoids blocking first paint on low-end hardware. */
  const [mapMountReady, setMapMountReady] = useState(false);

  const favoriteZpids = useReedStore((s) => s.favoriteZpids);
  const toggleFavorite = useReedStore((s) => s.toggleFavorite);
  const demoMode = useReedStore((s) => s.demoMode);
  const setDemoMode = useReedStore((s) => s.setDemoMode);

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
    error,
    listingsFetchedAt,
  } = useReedStore();

  const active = useMemo(() => getLocationById(locationId), [locationId]);
  const priceSuffix = homeStatus === "FOR_RENT" ? "/mo" : "";
  const microBundle = useMemo(() => (locationId ? getMicroclimateBundle(locationId) : null), [locationId]);
  const activeMcMeta = useMemo(() => {
    const p = active?.microclimateProfile;
    return p ? getMicroclimateMeta(p) : null;
  }, [active]);

  const climateHubs = useMemo(() => computeClimateHubs(ALL_LOCATIONS), []);
  const mapReferencePoints = useMemo(() => {
    const us = ALL_LOCATIONS.map((l) => ({
      id: l.id,
      label: l.label,
      region: l.region,
      state: l.state,
      country: "US",
      lat: l.lat,
      lng: l.lng,
      isActiveMarket: l.id === locationId,
    }));
    const mx = SONORA_MEXICO.map((l) => ({
      id: l.id,
      label: l.label,
      region: l.region,
      state: l.state,
      country: "MX",
      lat: l.lat,
      lng: l.lng,
      isActiveMarket: false,
    }));
    return [...us, ...mx];
  }, [locationId]);

  const climateMismatchOnMap = Boolean(climateMapFilter && active?.microclimateProfile && climateMapFilter !== active.microclimateProfile);

  const listingsSyncHint = useMemo(() => {
    if (!listingsFetchedAt) return null;
    const d = new Date(listingsFetchedAt);
    const hrs = Math.round(getAutoRefreshIntervalMs() / (60 * 60 * 1000));
    return `Inventory pull ${d.toLocaleString()} · up to ${ZILLOW_MAX_PAGES} API pages merged · auto re-pull ~every ${hrs}h for this exact search (tab open or when you return)`;
  }, [listingsFetchedAt]);

  const listingsPageSlice = useMemo(() => {
    const p = Math.max(1, page);
    const start = (p - 1) * LISTINGS_UI_PAGE_SIZE;
    return listings.slice(start, start + LISTINGS_UI_PAGE_SIZE);
  }, [listings, page]);

  const listUiTotalPages = Math.max(1, Math.ceil(listings.length / LISTINGS_UI_PAGE_SIZE) || 1);
  const canListNext = page < listUiTotalPages;

  useEffect(() => {
    if (page > listUiTotalPages) {
      setPage(listUiTotalPages);
    }
  }, [listUiTotalPages, page, setPage]);

  /** One scannable line: climate + water/rain + air context — pairs with map terrain & microclimate panel */
  const marketContextLine = useMemo(() => {
    const parts = [];
    if (activeMcMeta?.title) parts.push(`${activeMcMeta.emoji} ${activeMcMeta.title}`);
    if (microBundle?.loc?.ra != null) parts.push(`~${microBundle.loc.ra}" rain/yr`);
    if (microBundle?.loc?.nr) parts.push(String(microBundle.loc.nr));
    return parts.length ? parts.join(" · ") : activeMcMeta?.blurb?.slice(0, 140) || "";
  }, [activeMcMeta, microBundle]);

  // Recover stale/removed location ids from persisted storage (valid ids always go through selectLocation).
  useEffect(() => {
    /* eslint-disable react-hooks/set-state-in-effect -- one-shot repair when persisted id no longer exists */
    if (!getLocationById(locationId)) {
      setClimateMapFilter(null);
      setLocationId(DEFAULT_LOCATION_ID);
    }
    /* eslint-enable react-hooks/set-state-in-effect */
  }, [locationId, setLocationId]);

  useEffect(() => {
    safeLocalStorageSet("reed-view", view);
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
    async function ping() {
      try {
        const r = await fetch("/api/health");
        const d = await r.json();
        if (!cancelled) setApiOk(!!(d.ok && d.hasKey));
        safeLocalStorageSet(API_HEALTH_LAST_KEY, String(Date.now()));
      } catch {
        if (!cancelled) setApiOk(false);
      }
    }
    ping();

    function maybePingOnReturn() {
      if (document.visibilityState !== "visible" || cancelled) return;
      const last = parseInt(safeLocalStorageGet(API_HEALTH_LAST_KEY, "0") || "0", 10) || 0;
      if (Date.now() - last < ONE_DAY_MS) return;
      ping();
    }

    document.addEventListener("visibilitychange", maybePingOnReturn);
    return () => {
      cancelled = true;
      document.removeEventListener("visibilitychange", maybePingOnReturn);
    };
  }, []);

  /** After first paint, wait for idle time before loading the heavy map chunk (better on Surface-class devices). */
  useEffect(() => {
    let cancelled = false;
    const go = () => {
      if (!cancelled) setMapMountReady(true);
    };
    const ric = typeof window !== "undefined" ? window.requestIdleCallback : undefined;
    const cic = typeof window !== "undefined" ? window.cancelIdleCallback : undefined;
    const useIdle = typeof ric === "function";
    const id = useIdle ? ric(go, { timeout: 1400 }) : window.setTimeout(go, 600);
    return () => {
      cancelled = true;
      if (useIdle && typeof cic === "function") cic(id);
      else clearTimeout(id);
    };
  }, []);

  useEffect(() => {
    const onKey = (e) => {
      const tag = document.activeElement?.tagName;
      const inField = tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT";
      const blockingModal = document.querySelector('[role="dialog"][aria-modal="true"]');
      if (e.key === "/" && !inField && !blockingModal) {
        e.preventDefault();
        locFilterRef.current?.focus();
        return;
      }
      if (e.key === "?" && !inField) {
        e.preventDefault();
        if (blockingModal && !shortcutsOpen) return;
        setShortcutsOpen((open) => !open);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [shortcutsOpen]);

  const runSearch = useCallback(async () => {
    const snap = useReedStore.getState();
    const req = buildSearchRequest(snap);
    if (!req) {
      useReedStore.setState({ listings: [], rawResponse: null, loading: false, error: null, listingsFetchedAt: null });
      return;
    }
    useReedStore.setState({ loading: true, error: null });
    try {
      const withRelaxedHousingFilters = (params) => {
        const p = { ...params, sort: "DEFAULT" };
        delete p.home_type;
        return stripUndefined(p);
      };

      /** @type {(p: Record<string, string>) => Promise<unknown>} */
      let fetchListings = (p) =>
        req.kind === "coordinates" ? searchByCoordinates(p) : searchListings(p);
      /** Always merge upstream pages 1…N so inventory is stable; UI `page` only slices client-side. */
      let params = { ...stripUndefined(req.params), page: "1" };

      let raw = await fetchListings(params);
      let list = extractListings(raw);

      // Zillow upstream can be inconsistent by endpoint/shape — on empty, retry with relaxed params.
      if (list.length === 0) {
        if (req.kind === "coordinates") {
          const coordRetry = { ...withRelaxedHousingFilters(req.params), page: "1" };
          params = coordRetry;
          fetchListings = (p) => searchByCoordinates(p);
          raw = await fetchListings(coordRetry);
          list = extractListings(raw);

          if (list.length === 0) {
            const loc = getLocationById(snap.locationId);
            if (loc?.searchQuery) {
              const locationRetry = withRelaxedHousingFilters({
                ...coordRetry,
                location: loc.searchQuery,
              });
              delete locationRetry.latitude;
              delete locationRetry.longitude;
              delete locationRetry.long;
              delete locationRetry.lat;
              delete locationRetry.lng;
              delete locationRetry.longtitude;
              delete locationRetry.radius;
              params = { ...stripUndefined(locationRetry), page: "1" };
              fetchListings = (p) => searchListings(p);
              raw = await fetchListings(params);
              list = extractListings(raw);
            }
          }
          if (list.length === 0) {
            const loc = getLocationById(snap.locationId);
            const lat = loc?.lat ?? loc?.latitude;
            const lng = loc?.lng ?? loc?.longitude ?? loc?.long;
            const r0 = Number(loc?.coordRadiusMiles);
            if (
              Number.isFinite(Number(lat)) &&
              Number.isFinite(Number(lng)) &&
              Number.isFinite(r0) &&
              r0 > 0 &&
              r0 < 50
            ) {
              const r1 = Math.min(50, Math.round(r0 * 1.75));
              if (r1 > r0) {
                const wide = stripUndefined({
                  ...withRelaxedHousingFilters(req.params),
                  page: "1",
                  latitude: String(lat),
                  longitude: String(lng),
                  long: String(lng),
                  radius: String(r1),
                });
                params = wide;
                fetchListings = (p) => searchByCoordinates(p);
                raw = await fetchListings(wide);
                list = extractListings(raw);
              }
            }
          }
        } else {
          const locationRetry = { ...withRelaxedHousingFilters(req.params), page: "1" };
          params = locationRetry;
          fetchListings = (p) => searchListings(p);
          raw = await fetchListings(locationRetry);
          list = extractListings(raw);
        }
      }

      if (list.length === 0 && req.kind === "location") {
        const loc = getLocationById(snap.locationId);
        const fallbacks = locationSearchFallbacks(loc);
        const base = withRelaxedHousingFilters(req.params);
        const primaryLoc = String(base.location || "").trim();
        for (const fq of fallbacks) {
          if (fq === primaryLoc) continue;
          const tryParams = stripUndefined({ ...base, location: fq, page: "1" });
          raw = await searchListings(tryParams);
          list = extractListings(raw);
          if (list.length > 0) {
            params = tryParams;
            fetchListings = (p) => searchListings(p);
            break;
          }
        }
      }

      if (list.length > 0) {
        const seen = new Set(
          list.map((l) => String(l.zpid || l.address || "").trim()).filter(Boolean)
        );
        const limitNum = Number(ZILLOW_PAGE_LIMIT) || 100;
        for (let pageNum = 2; pageNum <= ZILLOW_MAX_PAGES; pageNum++) {
          const nextParams = stripUndefined({
            ...params,
            page: String(pageNum),
            limit: ZILLOW_PAGE_LIMIT,
          });
          const rawP = await fetchListings(nextParams);
          const listP = extractListings(rawP);
          if (listP.length === 0) break;
          for (const l of listP) {
            const id = String(l.zpid || l.address || "").trim();
            if (!id || seen.has(id)) continue;
            seen.add(id);
            list.push(l);
          }
          if (listP.length < limitNum) break;
        }
      }

      const now = Date.now();
      const fp = searchFingerprint(snap);
      writeIngestionMeta(now, fp);
      useReedStore.setState({
        rawResponse: raw,
        listings: list,
        loading: false,
        demoMode: false,
        error: null,
        listingsFetchedAt: now,
      });
    } catch (e) {
      console.error(e);
      const userMsg = readableApiError(e, "Search failed");
      useReedStore.setState({ listings: [], loading: false, error: userMsg });
      toast.error(userMsg);
    }
  }, []);

  /** Long-lived tab: re-pull inventory when the same search is older than VITE_LISTINGS_AUTO_REFRESH_HOURS (default 72). */
  useEffect(() => {
    if (demoMode) return undefined;
    const tick = () => {
      const snap = useReedStore.getState();
      if (snap.loading || snap.demoMode) return;
      const fp = searchFingerprint(snap);
      if (shouldAutoRefresh(fp)) runSearch();
    };
    const id = window.setInterval(tick, getBackgroundPollIntervalMs());
    const onVis = () => {
      if (document.visibilityState === "visible") tick();
    };
    document.addEventListener("visibilitychange", onVis);
    return () => {
      window.clearInterval(id);
      document.removeEventListener("visibilitychange", onVis);
    };
  }, [demoMode, runSearch]);

  useEffect(() => {
    if (demoMode) {
      const loc = getLocationById(locationId);
      const list = buildDemoListingsForLocation(loc);
      useReedStore.setState({
        listings: list,
        loading: false,
        error: null,
        rawResponse: { demo: true, locationId },
        listingsFetchedAt: null,
      });
      return;
    }
    runSearch();
  }, [
    demoMode,
    runSearch,
    locationId,
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

  const listRangeLabel = useMemo(() => {
    if (listings.length === 0) return "";
    const start = (Math.max(1, page) - 1) * LISTINGS_UI_PAGE_SIZE + 1;
    const end = Math.min(listings.length, Math.max(1, page) * LISTINGS_UI_PAGE_SIZE);
    return `${start}–${end} of ${listings.length}`;
  }, [listings.length, page]);

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
    <div className="reed-app-shell relative min-h-screen overflow-x-hidden bg-[linear-gradient(155deg,#ede9fe_0%,#ecfdf5_22%,#f5f5f4_52%,#fff7ed_88%,#ffffff_100%)] text-stone-900">
      <a href="#reed-main" className="reed-skip-link">
        Skip to main content
      </a>
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 3400,
          className: "!font-sans !text-stone-800 !shadow-lg",
          style: { borderRadius: 14 },
          success: {
            className: "!font-sans !bg-emerald-50 !text-emerald-950 !border !border-emerald-200/90",
            iconTheme: { primary: "#047857", secondary: "#ecfdf5" },
          },
          error: {
            className: "!font-sans !bg-red-50 !text-red-950 !border !border-red-200/90",
            iconTheme: { primary: "#b91c1c", secondary: "#fef2f2" },
          },
        }}
      />
      <KeyboardShortcutsDialog open={shortcutsOpen} onClose={() => setShortcutsOpen(false)} />

      <header className="sticky top-0 z-50 border-b border-stone-200/90 bg-white/90 shadow-sm backdrop-blur-md">
        <div className="mx-auto flex max-w-[1600px] flex-col gap-2 px-4 py-3">
          <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setSidebar((s) => !s)}
              className="rounded-xl border border-stone-200 bg-white p-2 text-stone-600 shadow-sm hover:bg-stone-50 lg:hidden"
              aria-expanded={sidebar}
              aria-controls="reed-sidebar-nav"
            >
              <Menu className="h-5 w-5" aria-hidden />
            </button>
            <div className="flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600 via-fuchsia-600 to-teal-600 shadow-lg shadow-violet-900/25 ring-2 ring-white/60">
                <Home className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="font-display text-lg font-semibold tracking-tight text-stone-900">Reed&apos;s Home Finder</h1>
                <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-violet-800">
                  Place-first · Southwest US · AZ · CA · NM · CO · UT · NV · TX
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-end gap-2 sm:gap-3">
            <div
              className="hidden items-center gap-1.5 rounded-full border border-stone-200 bg-stone-50/90 px-2.5 py-1 text-[10px] text-stone-500 sm:flex"
              title="Zillow proxy status — rechecked on load and at most once per day when you return to this tab"
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
            <button
              type="button"
              onClick={() => setShortcutsOpen(true)}
              className="flex rounded-xl border border-stone-200 bg-white p-2 text-stone-500 shadow-sm transition hover:border-violet-200 hover:bg-violet-50 hover:text-violet-800"
              aria-label="Open keyboard shortcuts (?)"
            >
              <HelpCircle className="h-4 w-4" />
            </button>
            <span className="hidden items-center gap-1 text-[10px] text-stone-500 lg:flex">
              <Keyboard className="h-3 w-3 shrink-0" aria-hidden />
              <kbd className="rounded border border-stone-200 bg-white px-1 font-sans text-stone-600 shadow-sm">/</kbd> towns ·{" "}
              <kbd className="rounded border border-stone-200 bg-white px-1 font-sans text-stone-600 shadow-sm">?</kbd> help
            </span>
            <div className="flex items-center gap-1 rounded-lg border border-stone-200 bg-stone-50 p-1">
              <button
                type="button"
                onClick={() => setView("map")}
                className={`rounded-md px-2.5 py-1.5 text-xs font-semibold ${view === "map" ? "bg-white text-teal-900 ring-1 ring-teal-200 shadow-sm" : "text-stone-500 hover:bg-stone-100 hover:text-stone-800"}`}
              >
                Map
              </button>
              <button
                type="button"
                onClick={() => setView("split")}
                title="Map + scrollable listings — geography first"
                className={`rounded-md px-2.5 py-1.5 text-xs font-semibold ${view === "split" ? "bg-white text-teal-900 ring-1 ring-teal-200 shadow-sm" : "text-stone-500 hover:bg-stone-100 hover:text-stone-800"}`}
              >
                Explore
              </button>
              <button
                type="button"
                onClick={() => setView("list")}
                className={`rounded-md px-2.5 py-1.5 text-xs font-semibold ${view === "list" ? "bg-white text-teal-900 ring-1 ring-teal-200 shadow-sm" : "text-stone-500 hover:bg-stone-100 hover:text-stone-800"}`}
              >
                List
              </button>
            </div>
            <button
              type="button"
              onClick={() => {
                setDemoMode(false);
                runSearch();
              }}
              className="inline-flex items-center gap-2 rounded-xl border border-stone-200 bg-white px-3 py-2 text-xs font-semibold text-stone-800 shadow-sm hover:bg-stone-50"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin text-teal-600" : ""}`} />
              Refresh
            </button>
          </div>
          </div>
          {demoMode && (
            <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-teal-200/90 bg-gradient-to-r from-teal-50/95 via-cyan-50/80 to-sky-50/70 px-3 py-2.5 text-xs text-teal-950 shadow-md shadow-teal-900/5 ring-1 ring-teal-100/80">
              <span className="flex min-w-0 flex-1 items-start gap-2 font-medium leading-snug">
                <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-teal-600" />
                <span>
                  <strong>Demo mode</strong> — full map + list experience with sample pins (not live MLS). Use{" "}
                  <code className="rounded bg-white/80 px-1 py-0.5 text-[10px]">ZILLOW_API_KEY</code> (direct OpenWeb) or{" "}
                  <code className="rounded bg-white/80 px-1 py-0.5 text-[10px]">RAPIDAPI_KEY</code> (same data via RapidAPI) in{" "}
                  <code className="rounded bg-white/80 px-1 py-0.5 text-[10px]">backend/.env</code>, then Refresh.
                </span>
              </span>
              <button
                type="button"
                onClick={() => {
                  setDemoMode(false);
                  runSearch();
                }}
                className="shrink-0 rounded-lg border border-teal-300 bg-white px-3 py-1.5 text-[11px] font-semibold text-teal-900 shadow-sm hover:bg-teal-50"
              >
                Retry live data
              </button>
            </div>
          )}
          {error && !demoMode && (
            <div className="flex flex-col gap-2 rounded-xl border border-red-200 bg-red-50/90 px-3 py-2 text-xs text-red-900 shadow-sm sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-start gap-2">
                <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-red-600" />
                <span className="leading-snug">{error}</span>
              </div>
              <button
                type="button"
                onClick={() => {
                  setDemoMode(true);
                  toast.success("Loading demo listings for this market…");
                }}
                className="inline-flex shrink-0 items-center justify-center gap-1.5 self-start rounded-lg border border-violet-200 bg-gradient-to-r from-violet-50 to-fuchsia-50 px-3 py-1.5 text-[11px] font-semibold text-violet-900 shadow-sm hover:from-violet-100 hover:to-fuchsia-100 sm:self-center"
              >
                <Sparkles className="h-3.5 w-3.5" />
                Try immersive demo
              </button>
            </div>
          )}
        </div>
      </header>

      <div className="relative z-10 mx-auto flex max-w-[1600px] gap-0 lg:gap-4">
        <aside
          id="reed-sidebar-nav"
          aria-label="Markets and locations"
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
              aria-label="Filter markets by name, state, or microclimate"
              className="w-full bg-transparent text-sm text-stone-800 placeholder:text-stone-400 focus:outline-none"
            />
          </div>
          <LocationLibrary locationId={locationId} onSelect={selectLocation} search={libSearch} />
        </aside>
        {sidebar && (
          <button type="button" className="fixed inset-0 z-30 bg-stone-900/40 backdrop-blur-[1px] lg:hidden" aria-label="Close menu" onClick={() => setSidebar(false)} />
        )}

        <main id="reed-main" tabIndex={-1} className="min-w-0 flex-1 space-y-4 px-4 py-4 outline-none focus-visible:ring-2 focus-visible:ring-teal-400/80 focus-visible:ring-offset-2">
          <ImmersiveResearchStrip marketLabel={active?.label} marketNotes={active?.notes || undefined} contextLine={marketContextLine} />

          <div className="rounded-2xl border border-stone-200/90 bg-white p-4 shadow-lg shadow-stone-200/40 ring-1 ring-stone-100">
            <div className="flex flex-wrap items-end gap-3">
              <div className="min-w-[200px] flex-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-stone-500">Active market</label>
                <p className="mt-1 font-display text-lg text-stone-900">{active?.label ?? "—"}</p>
                <p className="text-xs text-stone-500">{active?.region}</p>
                {active?.notes && (
                  <p className="mt-2 border-l-[3px] border-violet-400 bg-violet-50/80 py-2 pl-3 pr-2 text-[11px] font-medium leading-relaxed text-violet-950">
                    {active.notes}
                  </p>
                )}
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

          {loading && <ListingSkeleton layout={view === "split" ? "rail" : "grid"} count={view === "split" ? 8 : 6} />}

          {!loading && listings.length === 0 && (
            <EmptyResults
              loading={loading}
              onResetFilters={() => {
                setFilters({
                  minPrice: "",
                  maxPrice: "",
                  minBedrooms: "",
                  maxBedrooms: "",
                  minBathrooms: "",
                  maxBathrooms: "",
                  minSqft: "",
                  maxSqft: "",
                  sort: "NEWEST",
                  homeType: "HOUSES",
                  page: 1,
                });
                toast.success("Filters cleared — fetching again…");
              }}
              onTryDemo={() => {
                setDemoMode(true);
                toast.success("Loading sample homes for this market…");
              }}
            />
          )}

          {view === "split" && active && !loading && (
            <div className="grid gap-4 lg:grid-cols-[minmax(0,1.55fr)_minmax(300px,420px)] lg:items-start">
              <div className="min-h-[min(64vh,720px)] lg:sticky lg:top-[4.5rem] lg:self-start">
                <div className="mb-2 space-y-2">
                  <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-stone-500">
                    <MapIcon className="h-3.5 w-3.5 text-teal-600" />
                    <span>
                      <span className="font-medium text-stone-700">Terrain + geography</span> — Zillow pins, climate hubs, town anchors, Sonora travel ·{" "}
                      <span className="font-medium text-teal-800">pulse</span> = active search
                      <span className="ml-1 text-stone-400">
                        · {import.meta.env.VITE_GOOGLE_MAPS_API_KEY ? "Google Maps" : "Leaflet / CARTO"}
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
                {!mapMountReady ? (
                  <div className="flex h-[min(64vh,640px)] items-center justify-center rounded-2xl border border-stone-200 bg-white text-sm text-stone-500 shadow-sm">
                    <Loader2 className="mr-2 h-5 w-5 animate-spin text-teal-600" />
                    Preparing map…
                  </div>
                ) : (
                  <Suspense
                    fallback={
                      <div className="flex h-[min(64vh,640px)] items-center justify-center rounded-2xl border border-stone-200 bg-white text-sm text-stone-500 shadow-sm">
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
                      referencePoints={mapReferencePoints}
                      onSelectReference={(ref) => {
                        if (ref?.country === "US") selectLocation(ref.id);
                      }}
                      onSelect={(l) => {
                        setSelectedListing(l);
                        setDetailOpen(true);
                      }}
                    />
                  </Suspense>
                )}
              </div>
              <div className="lg:sticky lg:top-[4.75rem] lg:self-start">
                <ExploreListRail
                  listings={listingsPageSlice}
                  totalListings={listings.length}
                  page={page}
                  totalPages={listUiTotalPages}
                  setPage={setPage}
                  canGoNext={canListNext}
                  priceSuffix={priceSuffix}
                  favoriteZpids={favoriteZpids}
                  toggleFavorite={toggleFavorite}
                  onOpenListing={(l) => {
                    setSelectedListing(l);
                    setDetailOpen(true);
                  }}
                  activeState={active?.state}
                  marketContextLine={marketContextLine}
                  syncHint={listingsSyncHint}
                  mergedPageCount={ZILLOW_MAX_PAGES}
                />
              </div>
            </div>
          )}

          {view === "map" && active && !loading && (
            <div className="min-h-[460px]">
              <div className="mb-2 space-y-2">
                <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-stone-500">
                  <MapIcon className="h-3.5 w-3.5 text-teal-600" />
                  <span>
                    <span className="font-medium text-stone-700">Zillow</span> listings + hubs + Sonora context ·{" "}
                    <span className="font-medium text-teal-800">pulse</span> = active search
                    <span className="ml-1 text-stone-400">
                      · {import.meta.env.VITE_GOOGLE_MAPS_API_KEY ? "Google Maps" : "Leaflet"}
                    </span>
                  </span>
                </div>
                {climateMismatchOnMap && activeMcMeta && (
                  <div
                    className="rounded-xl border border-amber-200 bg-amber-50/95 px-3 py-2 text-[11px] leading-snug text-amber-950 shadow-sm"
                    role="status"
                  >
                    <span className="font-semibold">Heads up:</span> map filter climate ≠ {active.label}. Pins may hide; results still match market.
                  </div>
                )}
              </div>
              {!mapMountReady ? (
                <div className="flex h-[min(64vh,640px)] items-center justify-center rounded-2xl border border-stone-200 bg-white text-sm text-stone-500 shadow-sm">
                  <Loader2 className="mr-2 h-5 w-5 animate-spin text-teal-600" />
                  Preparing map…
                </div>
              ) : (
                <Suspense
                  fallback={
                    <div className="flex h-[min(64vh,640px)] items-center justify-center rounded-2xl border border-stone-200 bg-white text-sm text-stone-500 shadow-sm">
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
                    referencePoints={mapReferencePoints}
                    onSelectReference={(ref) => {
                      if (ref?.country === "US") selectLocation(ref.id);
                    }}
                    onSelect={(l) => {
                      setSelectedListing(l);
                      setDetailOpen(true);
                    }}
                  />
                </Suspense>
              )}
            </div>
          )}

          {view === "list" && !loading && (
            <div className="space-y-3">
              <div className="rounded-xl border border-stone-200 bg-white p-3 shadow-sm">
                <p className="text-[11px] leading-relaxed text-stone-600">
                  <strong className="text-stone-800">Full-width list</strong> — best for comparing many cards. Use{" "}
                  <strong>Explore</strong> to keep terrain + water context beside results.
                </p>
                {marketContextLine && (
                  <p className="mt-2 text-[11px] text-teal-900/85">
                    <span className="font-semibold">Context: </span>
                    {marketContextLine}
                  </p>
                )}
                {listingsSyncHint && (
                  <p className="mt-2 text-[10px] leading-snug text-violet-900/80">{listingsSyncHint}</p>
                )}
              </div>
              <div className="flex items-center justify-between">
                <p className="text-sm text-stone-600">
                  {listRangeLabel || "0 results"} · list page {page} / {listUiTotalPages} · up to {ZILLOW_MAX_PAGES} API pages merged
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
                    disabled={!canListNext}
                    onClick={() => setPage(page + 1)}
                    className="rounded-lg border border-stone-200 bg-white px-3 py-1 text-xs font-medium text-stone-700 shadow-sm disabled:opacity-40"
                  >
                    Next
                  </button>
                </div>
              </div>
              <div className="grid gap-3 grid-cols-1">
                {listingsPageSlice.map((li) => (
                  <ListingCard
                    key={li.zpid || li.address}
                    listing={li}
                    priceSuffix={priceSuffix}
                    variant="row"
                    marketContextLine={marketContextLine}
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
