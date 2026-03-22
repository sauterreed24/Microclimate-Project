import { useEffect, useMemo } from "react";
import L from "leaflet";
import { MapContainer, TileLayer, Marker, Popup, useMap, LayersControl, ScaleControl } from "react-leaflet";
import "leaflet/dist/leaflet.css";

const CARTO_URL = "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png";
const CARTO_ATTR =
  '&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> &copy; <a href="https://carto.com/attributions">CARTO</a>';
const OSM_URL = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";
const OSM_ATTR = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>';
const ESRI_IMG =
  "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}";
const ESRI_ATTR =
  "Tiles &copy; Esri — Source: Esri, Maxar, Earthstar Geographics, and the GIS User Community";

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

function FitBounds({ points }) {
  const map = useMap();
  useEffect(() => {
    if (!points.length) return;
    try {
      const latlngs = points.map((p) => [p.lat, p.lng]);
      if (latlngs.length === 1) {
        map.setView(latlngs[0], 12);
        return;
      }
      map.fitBounds(L.latLngBounds(latlngs), { padding: [56, 56], maxZoom: 15, animate: true });
    } catch {
      /* ignore */
    }
  }, [map, points]);
  return null;
}

export default function ListingMap({ center, listings, onSelect }) {
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

  const icons = useMemo(() => {
    const map = new Map();
    for (const p of pts) {
      const html = `
        <div class="reed-map-pin">
          <span class="reed-map-pin__dot"></span>
          <span class="reed-map-pin__price">${escapeHtml(priceChip(p.price))}</span>
        </div>`;
      map.set(
        p.id,
        L.divIcon({
          className: "reed-map-pin-wrap",
          html,
          iconSize: [56, 36],
          iconAnchor: [28, 34],
          popupAnchor: [0, -30],
        })
      );
    }
    return map;
  }, [pts]);

  const c = center?.lat && center?.lng ? [center.lat, center.lng] : pts[0] ? [pts[0].lat, pts[0].lng] : [31.55, -110.3];

  return (
    <div className="reed-map-frame group relative h-full min-h-[360px] w-full overflow-hidden rounded-2xl border border-stone-200/90 bg-gradient-to-b from-stone-50 to-white shadow-xl shadow-stone-300/40 ring-1 ring-stone-100">
      <div className="pointer-events-none absolute inset-x-0 top-0 z-[500] h-16 bg-gradient-to-b from-stone-900/10 to-transparent opacity-0 transition group-hover:opacity-100" aria-hidden />
      <MapContainer center={c} zoom={11} className="reed-map-canvas z-0 h-[min(58vh,520px)] w-full" scrollWheelZoom>
        <ScaleControl position="bottomleft" imperial />
        <LayersControl position="topright">
          <LayersControl.BaseLayer checked name="Terrain · CARTO Voyager">
            <TileLayer attribution={CARTO_ATTR} url={CARTO_URL} subdomains="abcd" maxZoom={20} />
          </LayersControl.BaseLayer>
          <LayersControl.BaseLayer name="Satellite · Esri">
            <TileLayer attribution={ESRI_ATTR} url={ESRI_IMG} maxZoom={19} />
          </LayersControl.BaseLayer>
          <LayersControl.BaseLayer name="Streets · OpenStreetMap">
            <TileLayer attribution={OSM_ATTR} url={OSM_URL} maxZoom={19} />
          </LayersControl.BaseLayer>
        </LayersControl>

        <FitBounds
          points={[
            ...(center?.lat ? [{ lat: center.lat, lng: center.lng }] : []),
            ...pts.map((p) => ({ lat: p.lat, lng: p.lng })),
          ]}
        />

        {center?.lat && (
          <Marker
            position={[center.lat, center.lng]}
            icon={L.divIcon({
              className: "reed-map-pin-wrap reed-map-pin-wrap--hub",
              html: `<div class="reed-map-hub"><span class="reed-map-hub__ring"></span><span class="reed-map-hub__core"></span></div>`,
              iconSize: [44, 44],
              iconAnchor: [22, 22],
            })}
          >
            <Popup>
              <div className="min-w-[160px] text-xs">
                <p className="font-semibold text-stone-900">Search center</p>
                <p className="mt-1 text-stone-500">Active market anchor — listings may span nearby towns.</p>
              </div>
            </Popup>
          </Marker>
        )}

        {pts.map((p) => (
          <Marker
            key={p.id}
            position={[p.lat, p.lng]}
            icon={icons.get(p.id)}
            eventHandlers={{
              click: () => {
                const found = listings.find((x) => (x.zpid || x.address) === p.id);
                if (found) onSelect?.(found);
              },
            }}
          >
            <Popup>
              <div className="min-w-[180px] text-xs text-stone-800">
                <div className="font-semibold leading-snug text-stone-900">{p.label}</div>
                {p.price != null && <div className="mt-1.5 text-sm font-bold text-teal-700">${Number(p.price).toLocaleString()}</div>}
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
