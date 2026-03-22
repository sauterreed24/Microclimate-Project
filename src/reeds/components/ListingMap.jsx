import { useEffect, useMemo } from "react";
import L from "leaflet";
import { MapContainer, TileLayer, CircleMarker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";

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
      map.fitBounds(L.latLngBounds(latlngs), { padding: [40, 40], maxZoom: 13 });
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
    <div className="h-full min-h-[320px] w-full overflow-hidden rounded-2xl border border-white/10 shadow-inner">
      <MapContainer center={c} zoom={11} className="h-[min(50vh,420px)] w-full" scrollWheelZoom>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <FitBounds
          points={[
            ...(center?.lat ? [{ lat: center.lat, lng: center.lng }] : []),
            ...pts.map((p) => ({ lat: p.lat, lng: p.lng })),
          ]}
        />
        {center?.lat && (
          <CircleMarker center={[center.lat, center.lng]} radius={9} pathOptions={{ color: "#2dd4bf", fillColor: "#14b8a6", fillOpacity: 0.35 }}>
            <Popup>Search center</Popup>
          </CircleMarker>
        )}
        {pts.map((p) => (
          <CircleMarker
            key={p.id}
            center={[p.lat, p.lng]}
            radius={6}
            pathOptions={{ color: "#fbbf24", fillColor: "#f59e0b", fillOpacity: 0.9 }}
            eventHandlers={{
              click: () => {
                const found = listings.find((x) => (x.zpid || x.address) === p.id);
                if (found) onSelect?.(found);
              },
            }}
          >
            <Popup>
              <div className="text-xs">
                <div className="font-semibold">{p.label}</div>
                {p.price != null && <div>${p.price.toLocaleString()}</div>}
              </div>
            </Popup>
          </CircleMarker>
        ))}
      </MapContainer>
    </div>
  );
}
