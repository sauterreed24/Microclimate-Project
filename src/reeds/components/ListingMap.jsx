import { useEffect, useMemo } from "react";
import L from "leaflet";
import { MapContainer, TileLayer, CircleMarker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";

/** Carto Voyager — cleaner roads & palette than default OSM */
const TILE_URL = "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png";
const TILE_ATTR =
  '&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> &copy; <a href="https://carto.com/attributions">CARTO</a>';

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
      map.fitBounds(L.latLngBounds(latlngs), { padding: [48, 48], maxZoom: 14 });
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

  const c = center?.lat && center?.lng ? [center.lat, center.lng] : pts[0] ? [pts[0].lat, pts[0].lng] : [33.45, -112.07];

  return (
    <div className="reed-map-frame h-full min-h-[320px] w-full overflow-hidden rounded-2xl border border-stone-200/90 bg-white shadow-md ring-1 ring-stone-100">
      <MapContainer center={c} zoom={11} className="reed-map-canvas h-[min(50vh,440px)] w-full" scrollWheelZoom>
        <TileLayer attribution={TILE_ATTR} url={TILE_URL} subdomains="abcd" maxZoom={20} />
        <FitBounds
          points={[
            ...(center?.lat ? [{ lat: center.lat, lng: center.lng }] : []),
            ...pts.map((p) => ({ lat: p.lat, lng: p.lng })),
          ]}
        />
        {center?.lat && (
          <CircleMarker
            center={[center.lat, center.lng]}
            radius={10}
            pathOptions={{
              color: "#0d9488",
              weight: 3,
              fillColor: "#14b8a6",
              fillOpacity: 0.25,
            }}
          >
            <Popup>
              <span className="text-xs font-medium text-stone-700">Search area</span>
            </Popup>
          </CircleMarker>
        )}
        {pts.map((p) => (
          <CircleMarker
            key={p.id}
            center={[p.lat, p.lng]}
            radius={7}
            pathOptions={{
              color: "#0f766e",
              weight: 2,
              fillColor: "#ffffff",
              fillOpacity: 1,
            }}
            eventHandlers={{
              click: () => {
                const found = listings.find((x) => (x.zpid || x.address) === p.id);
                if (found) onSelect?.(found);
              },
            }}
          >
            <Popup>
              <div className="min-w-[140px] text-xs text-stone-800">
                <div className="font-semibold leading-snug">{p.label}</div>
                {p.price != null && <div className="mt-1 text-teal-700">${p.price.toLocaleString()}</div>}
              </div>
            </Popup>
          </CircleMarker>
        ))}
      </MapContainer>
    </div>
  );
}
