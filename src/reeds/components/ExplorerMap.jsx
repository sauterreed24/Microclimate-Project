/**
 * Unified map: Google Maps JS when VITE_GOOGLE_MAPS_API_KEY is set, else Leaflet.
 * Layers: climate-profile hubs (click = filter), Sonora travel pins, Zillow listing pins (color = active market profile).
 */
import { useEffect, useMemo, useRef } from "react";
import L from "leaflet";
import { MapContainer, TileLayer, Marker, Popup, useMap, LayersControl, ScaleControl } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { APIProvider, Map, Marker as GMarker, useMap as useGMap } from "@vis.gl/react-google-maps";
import { getMicroclimateMeta, getProfileMapStyle } from "../../data/reeds/locations/microclimateProfiles.js";

const CARTO_URL = "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png";
const CARTO_ATTR =
  '&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> &copy; <a href="https://carto.com/attributions">CARTO</a>';
const OSM_URL = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";
const OSM_ATTR = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>';
const ESRI_IMG =
  "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}";
const ESRI_ATTR =
  "Tiles &copy; Esri — Source: Esri, Maxar, Earthstar Geographics, and the GIS User Community";

const GOOGLE_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || "";
const GOOGLE_MAP_ID = import.meta.env.VITE_GOOGLE_MAP_MAP_ID || "";

function escapeHtml(s) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function priceChip(price) {
  if (price == null || Number.isNaN(Number(price))) return "—";
  const n = Number(price);
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(n % 1_000_000 === 0 ? 0 : 1)}M`;
  if (n >= 1000) return `$${Math.round(n / 1000)}k`;
  return `$${n.toLocaleString()}`;
}

function svgDataUrl(svg) {
  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
}

function pinSvg(fill, stroke, label) {
  const t = escapeHtml(label).slice(0, 6);
  return svgDataUrl(`
<svg xmlns="http://www.w3.org/2000/svg" width="52" height="40" viewBox="0 0 52 40">
  <defs><filter id="s"><feDropShadow dx="0" dy="2" stdDeviation="2" flood-opacity="0.35"/></filter></defs>
  <path filter="url(#s)" fill="${fill}" stroke="${stroke}" stroke-width="2" d="M26 2 L48 14 L26 36 L4 14 Z"/>
  <text x="26" y="17" text-anchor="middle" fill="#fff" font-size="10" font-weight="700" font-family="system-ui,sans-serif">${t}</text>
</svg>`);
}

function hubSvg(profile, _emoji, dim, selected) {
  const st = getProfileMapStyle(profile);
  const op = dim ? 0.45 : 1;
  const ring = selected ? st.stroke : "transparent";
  return svgDataUrl(`
<svg xmlns="http://www.w3.org/2000/svg" width="44" height="44" viewBox="0 0 44 44">
  <circle cx="22" cy="22" r="20" fill="${st.fill}" stroke="${ring}" stroke-width="3" opacity="${op}" style="filter:drop-shadow(0 3px 8px ${st.glow})"/>
  <circle cx="22" cy="22" r="6" fill="white" opacity="0.95"/>
</svg>`);
}

function sonoraSvg() {
  return svgDataUrl(`
<svg xmlns="http://www.w3.org/2000/svg" width="40" height="44" viewBox="0 0 40 44">
  <polygon points="20,2 38,12 38,28 20,40 2,28 2,12" fill="#6d28d9" stroke="#fbbf24" stroke-width="2" style="filter:drop-shadow(0 4px 10px rgba(109,40,217,0.45))"/>
  <text x="20" y="24" text-anchor="middle" font-size="14">🇲🇽</text>
</svg>`);
}

/* ——— Leaflet internals ——— */
function LeafFitSouthwest({ bounds, maxZoom = 6.35 }) {
  const map = useMap();
  const done = useRef(false);
  useEffect(() => {
    if (done.current || !bounds?.length) return;
    try {
      map.fitBounds(bounds, { padding: [32, 32], maxZoom, animate: false });
      done.current = true;
    } catch {
      /* ignore */
    }
  }, [map, bounds, maxZoom]);
  return null;
}

function LeafFlyToActive({ center, flyToken }) {
  const map = useMap();
  const prev = useRef(null);
  useEffect(() => {
    if (!center?.lat || !center?.lng || flyToken == null) return;
    if (prev.current === flyToken) return;
    prev.current = flyToken;
    try {
      map.flyTo([center.lat, center.lng], 10, { duration: 0.7 });
    } catch {
      /* ignore */
    }
  }, [map, center?.lat, center?.lng, flyToken]);
  return null;
}

function hubLeafIcon(profile, climateFilter) {
  const meta = getMicroclimateMeta(profile);
  const dim = climateFilter && climateFilter !== profile;
  const selected = climateFilter === profile;
  return L.icon({
    iconUrl: hubSvg(profile, meta.emoji, dim, selected),
    iconSize: [44, 44],
    iconAnchor: [22, 22],
    popupAnchor: [0, -12],
  });
}

function listingLeafIcon(id, price, profileId) {
  const st = getProfileMapStyle(profileId || "hot-desert-basin");
  const html = `
    <div class="reed-x-pin" style="--xf:${st.fill};--xs:${st.stroke};--xg:${st.glow}">
      <span class="reed-x-pin__diamond"></span>
      <span class="reed-x-pin__lbl">${escapeHtml(priceChip(price))}</span>
    </div>`;
  return L.divIcon({
    className: "reed-x-pin-wrap",
    html,
    iconSize: [56, 38],
    iconAnchor: [28, 34],
    popupAnchor: [0, -28],
  });
}

function LeafletExplorer({
  southwestBounds,
  activeCenter,
  flyToken,
  listings,
  listingsProfileId,
  climateFilter,
  onClimateFilterSelect,
  hubs,
  sonoraPlaces,
  onSelectListing,
}) {
  const centerDefault = useMemo(() => {
    const b = southwestBounds;
    if (!b?.length) return [34.2, -114];
    return [(b[0][0] + b[1][0]) / 2, (b[0][1] + b[1][1]) / 2];
  }, [southwestBounds]);

  const pts = useMemo(() => {
    return (listings || [])
      .map((l) => ({
        id: l.zpid || l.address,
        lat: l.latitude,
        lng: l.longitude,
        label: l.address,
        price: l.price,
      }))
      .filter((p) => p.lat != null && p.lng != null);
  }, [listings]);

  const showListings = !climateFilter || (listingsProfileId && listingsProfileId === climateFilter);

  const listingIcons = useMemo(() => {
    const m = new Map();
    const pid = listingsProfileId || "hot-desert-basin";
    for (const p of pts) m.set(p.id, listingLeafIcon(p.id, p.price, pid));
    return m;
  }, [pts, listingsProfileId]);

  return (
    <div className="reed-explorer-leaflet relative h-full min-h-[300px] w-full overflow-hidden rounded-2xl ring-1 ring-white/25">
      <div className="pointer-events-none absolute inset-0 z-[400] rounded-2xl shadow-[inset_0_0_100px_rgba(15,23,42,0.1)]" aria-hidden />
      <MapContainer
        center={centerDefault}
        zoom={5}
        className="reed-explorer-canvas z-0 h-[min(68vh,600px)] w-full md:h-[min(78vh,calc(100vh-5.5rem))]"
        scrollWheelZoom
        maxBounds={[
          [22, -129],
          [44, -99],
        ]}
        maxBoundsViscosity={0.82}
      >
        <ScaleControl position="bottomleft" imperial />
        <LayersControl position="topright">
          <LayersControl.BaseLayer checked name="Terrain · CARTO">
            <TileLayer attribution={CARTO_ATTR} url={CARTO_URL} subdomains="abcd" maxZoom={20} />
          </LayersControl.BaseLayer>
          <LayersControl.BaseLayer name="Satellite · Esri">
            <TileLayer attribution={ESRI_ATTR} url={ESRI_IMG} maxZoom={19} />
          </LayersControl.BaseLayer>
          <LayersControl.BaseLayer name="Streets · OSM">
            <TileLayer attribution={OSM_ATTR} url={OSM_URL} maxZoom={19} />
          </LayersControl.BaseLayer>
        </LayersControl>

        <LeafFitSouthwest bounds={southwestBounds} />
        <LeafFlyToActive center={activeCenter} flyToken={flyToken} />

        {hubs.map((h) => {
          const meta = getMicroclimateMeta(h.profile);
          return (
            <Marker
              key={h.profile}
              position={[h.lat, h.lng]}
              icon={hubLeafIcon(h.profile, climateFilter)}
              eventHandlers={{
                click: () => onClimateFilterSelect?.(climateFilter === h.profile ? null : h.profile),
              }}
            >
              <Popup className="reed-map-popup" maxWidth={280}>
                <div className="text-[13px] leading-snug text-slate-800">
                  <p className="font-display text-base font-semibold text-slate-900">
                    <span className="mr-1">{meta.emoji}</span>
                    {meta.title}
                  </p>
                  <p className="mt-2 text-xs text-slate-600">{meta.blurb}</p>
                  <p className="mt-2 text-[10px] font-semibold uppercase tracking-wide text-slate-400">{h.count} US markets</p>
                  <button
                    type="button"
                    className="mt-3 w-full rounded-xl bg-gradient-to-r from-teal-600 to-cyan-600 px-3 py-2 text-xs font-semibold text-white shadow-md"
                    onClick={() => onClimateFilterSelect?.(climateFilter === h.profile ? null : h.profile)}
                  >
                    {climateFilter === h.profile ? "Show all climates" : "Match Zillow pins to this"}
                  </button>
                </div>
              </Popup>
            </Marker>
          );
        })}

        {(sonoraPlaces || []).map((pl) => (
          <Marker key={pl.id} position={[pl.lat, pl.lng]} icon={L.icon({ iconUrl: sonoraSvg(), iconSize: [40, 44], iconAnchor: [20, 44], popupAnchor: [0, -36] })}>
            <Popup maxWidth={300}>
              <SonoraPopup pl={pl} />
            </Popup>
          </Marker>
        ))}

        {activeCenter?.lat != null && (
          <Marker
            position={[activeCenter.lat, activeCenter.lng]}
            icon={L.divIcon({
              className: "reed-zillow-hub-wrap",
              html: `<div class="reed-zillow-hub"><span class="reed-zillow-hub__ring"></span><span class="reed-zillow-hub__core"></span></div>`,
              iconSize: [48, 48],
              iconAnchor: [24, 24],
            })}
          >
            <Popup>
              <div className="text-xs">
                <p className="font-semibold text-slate-900">Zillow search anchor</p>
                <p className="mt-1 text-slate-500">Pins use this market&apos;s climate color.</p>
              </div>
            </Popup>
          </Marker>
        )}

        {showListings &&
          pts.map((p) => (
            <Marker
              key={p.id}
              position={[p.lat, p.lng]}
              icon={listingIcons.get(p.id)}
              eventHandlers={{
                click: () => {
                  const found = listings.find((x) => (x.zpid || x.address) === p.id);
                  if (found) onSelectListing?.(found);
                },
              }}
            >
              <Popup>
                <div className="min-w-[180px] text-xs">
                  <div className="font-semibold text-slate-900">{p.label}</div>
                  {p.price != null && (
                    <div className="mt-1 font-bold text-teal-700">${Number(p.price).toLocaleString()}</div>
                  )}
                </div>
              </Popup>
            </Marker>
          ))}
      </MapContainer>
    </div>
  );
}

function SonoraPopup({ pl }) {
  return (
    <div className="text-[13px] text-slate-800">
      <p className="flex items-center gap-2 font-display text-base font-semibold text-slate-900">
        <span>{pl.flag}</span>
        {pl.label}
      </p>
      <p className="text-[11px] text-violet-700">{pl.region}</p>
      {pl.feelsLike && (
        <p className="mt-2 rounded-lg bg-violet-50 px-2 py-1.5 text-xs text-slate-700">
          <span className="font-semibold text-violet-800">Feels like: </span>
          {pl.feelsLike}
        </p>
      )}
      {pl.climateFactors?.length > 0 && (
        <ul className="mt-2 list-inside list-disc text-xs text-slate-600">
          {pl.climateFactors.map((t) => (
            <li key={t}>{t}</li>
          ))}
        </ul>
      )}
      {pl.travelBullets?.length > 0 && (
        <>
          <p className="mt-2 text-[10px] font-bold uppercase text-amber-800">Travel</p>
          <ul className="list-inside list-disc text-xs text-slate-600">
            {pl.travelBullets.map((t) => (
              <li key={t}>{t}</li>
            ))}
          </ul>
        </>
      )}
      {pl.zoneDisclaimer && <p className="mt-2 text-[10px] text-amber-900/85">{pl.zoneDisclaimer}</p>}
      <p className="mt-2 text-[10px] text-slate-500">Travel & climate only — no Zillow coverage in Mexico.</p>
    </div>
  );
}

/* ——— Google Maps internals ——— */
function GFitSouthwest({ bounds }) {
  const map = useGMap();
  useEffect(() => {
    const g = globalThis.google;
    if (!map || !bounds?.length || !g?.maps) return;
    const b = new g.maps.LatLngBounds(
      { lat: bounds[0][0], lng: bounds[0][1] },
      { lat: bounds[1][0], lng: bounds[1][1] }
    );
    map.fitBounds(b, 32);
  }, [map, bounds]);
  return null;
}

function GFlyToActive({ center, flyToken }) {
  const map = useGMap();
  const prev = useRef(null);
  useEffect(() => {
    const g = globalThis.google;
    if (!map || !g?.maps || !center?.lat || !center?.lng || flyToken == null) return;
    if (prev.current === flyToken) return;
    prev.current = flyToken;
    map.panTo({ lat: center.lat, lng: center.lng });
    map.setZoom(10);
  }, [map, center?.lat, center?.lng, flyToken]);
  return null;
}

function GoogleExplorer({
  southwestBounds,
  activeCenter,
  flyToken,
  listings,
  listingsProfileId,
  climateFilter,
  onClimateFilterSelect,
  hubs,
  sonoraPlaces,
  onSelectListing,
}) {
  const pts = useMemo(() => {
    return (listings || [])
      .map((l) => ({
        id: l.zpid || l.address,
        lat: l.latitude,
        lng: l.longitude,
        label: l.address,
        price: l.price,
      }))
      .filter((p) => p.lat != null && p.lng != null);
  }, [listings]);

  const showListings = !climateFilter || (listingsProfileId && listingsProfileId === climateFilter);
  const pid = listingsProfileId || "hot-desert-basin";

  const defaultBounds = useMemo(() => {
    const b = southwestBounds;
    return { north: b[1][0], south: b[0][0], west: b[0][1], east: b[1][1] };
  }, [southwestBounds]);

  const mapOpts = useMemo(() => {
    const o = {
      mapTypeControl: true,
      streetViewControl: false,
      fullscreenControl: true,
      gestureHandling: "greedy",
    };
    if (GOOGLE_MAP_ID) o.mapId = GOOGLE_MAP_ID;
    return o;
  }, []);

  return (
    <APIProvider apiKey={GOOGLE_KEY} libraries={["marker"]}>
      <div className="reed-explorer-google relative h-full min-h-[300px] w-full overflow-hidden rounded-2xl ring-1 ring-white/25">
        <Map
          className="reed-explorer-canvas h-[min(68vh,600px)] w-full md:h-[min(78vh,calc(100vh-5.5rem))]"
          defaultBounds={defaultBounds}
          {...mapOpts}
        >
          <GFitSouthwest bounds={southwestBounds} />
          <GFlyToActive center={activeCenter} flyToken={flyToken} />

          {hubs.map((h) => {
            const meta = getMicroclimateMeta(h.profile);
            const dim = climateFilter && climateFilter !== h.profile;
            const selected = climateFilter === h.profile;
            return (
              <GMarker
                key={h.profile}
                position={{ lat: h.lat, lng: h.lng }}
                onClick={() => onClimateFilterSelect?.(climateFilter === h.profile ? null : h.profile)}
                icon={{
                  url: hubSvg(h.profile, meta.emoji, dim, selected),
                  scaledSize: { width: 44, height: 44 },
                  anchor: { x: 22, y: 22 },
                }}
                title={meta.title}
              />
            );
          })}

          {(sonoraPlaces || []).map((pl) => (
            <GMarker
              key={pl.id}
              position={{ lat: pl.lat, lng: pl.lng }}
              icon={{
                url: sonoraSvg(),
                scaledSize: { width: 40, height: 44 },
                anchor: { x: 20, y: 44 },
              }}
              title={pl.label}
            />
          ))}

          {activeCenter?.lat != null && (
            <GMarker
              position={{ lat: activeCenter.lat, lng: activeCenter.lng }}
              icon={{
                url: pinSvg("#14b8a6", "#0f766e", "Z"),
                scaledSize: { width: 52, height: 40 },
                anchor: { x: 26, y: 40 },
              }}
            />
          )}

          {showListings &&
            pts.map((p) => {
              const st = getProfileMapStyle(pid);
              return (
                <GMarker
                  key={p.id}
                  position={{ lat: p.lat, lng: p.lng }}
                  onClick={() => {
                    const found = listings.find((x) => (x.zpid || x.address) === p.id);
                    if (found) onSelectListing?.(found);
                  }}
                  icon={{
                    url: pinSvg(st.fill, st.stroke, priceChip(p.price)),
                    scaledSize: { width: 52, height: 40 },
                    anchor: { x: 26, y: 40 },
                  }}
                />
              );
            })}
        </Map>
      </div>
    </APIProvider>
  );
}

export default function ExplorerMap(props) {
  if (GOOGLE_KEY) {
    return <GoogleExplorer {...props} />;
  }
  return <LeafletExplorer {...props} />;
}
