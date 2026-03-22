import { useMemo } from "react";
import { APIProvider, Map, Marker } from "@vis.gl/react-google-maps";

/**
 * Minimal style overrides on top of Google's default roadmap:
 * keeps full terrain, roads, POIs, and water as Google intended — only
 * strengthens country & first‑subdivision (e.g. state/province) outlines.
 * (Does not replace the base map; other features stay on the stock style.)
 */
const BOUNDARY_EMPHASIS = [
  {
    featureType: "administrative.country",
    elementType: "geometry.stroke",
    stylers: [{ color: "#0f172a" }, { weight: 2.6 }],
  },
  {
    featureType: "administrative.province",
    elementType: "geometry.stroke",
    stylers: [{ color: "#1e293b" }, { weight: 1.55 }],
  },
];

/** Soft frame: AZ + NM + SE CA + Sonora — keeps navigation in the study area */
const SOUTHWEST_BOUNDS = {
  north: 37.4,
  south: 24.2,
  east: -103.0,
  west: -118.8,
};

const DEFAULT_SW_CENTER = { lat: 31.85, lng: -110.9 };

/**
 * Interactive map — native Google detail + Map / Satellite toggle.
 * API key: VITE_GOOGLE_MAPS_API_KEY in .env.local (never commit).
 */
export default function ClimateMap({ apiKey, locations, onSelect, selectedId }) {
  const center = useMemo(() => {
    if (!locations?.length) return DEFAULT_SW_CENTER;
    const la = locations.reduce((s, m) => s + m.la, 0) / locations.length;
    const ln = locations.reduce((s, m) => s + m.ln, 0) / locations.length;
    const c = { lat: la, lng: ln };
    if (c.lat < SOUTHWEST_BOUNDS.south) c.lat = SOUTHWEST_BOUNDS.south;
    if (c.lat > SOUTHWEST_BOUNDS.north) c.lat = SOUTHWEST_BOUNDS.north;
    if (c.ln < SOUTHWEST_BOUNDS.west) c.ln = SOUTHWEST_BOUNDS.west;
    if (c.ln > SOUTHWEST_BOUNDS.east) c.ln = SOUTHWEST_BOUNDS.east;
    return c;
  }, [locations]);

  if (!apiKey) {
    return (
      <div className="mc-map-frame">
        <div
          className="mc-map-frame__inner"
          style={{
            padding: 28,
            textAlign: "center",
            background: "linear-gradient(160deg, #f8fafc 0%, #f1f5f9 100%)",
            minHeight: 280,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div style={{ fontSize: 32, marginBottom: 12 }}>🗺️</div>
          <p
            style={{
              margin: "0 0 8px",
              color: "var(--mc-ink)",
              fontFamily: "var(--mc-font-display, 'Fraunces', Georgia, serif)",
              fontSize: 20,
              fontWeight: 500,
            }}
          >
            Add your Google Maps API key
          </p>
          <p style={{ margin: 0, fontSize: 13, color: "var(--mc-ink-muted)", lineHeight: 1.6, maxWidth: 320 }}>
            Create <code style={{ color: "var(--mc-accent)", fontWeight: 600 }}>.env.local</code> with:
          </p>
          <code
            style={{
              display: "block",
              marginTop: 12,
              padding: "12px 14px",
              borderRadius: 12,
              background: "rgba(255,255,255,.9)",
              border: "1px solid var(--mc-border)",
              color: "#0f766e",
              fontSize: 11,
              wordBreak: "break-all",
              fontFamily: "ui-monospace, monospace",
            }}
          >
            VITE_GOOGLE_MAPS_API_KEY=your_key_here
          </code>
          <p style={{ margin: "14px 0 0", fontSize: 11, color: "var(--mc-ink-muted)" }}>
            Restart <code>npm run dev</code> after saving.
          </p>
        </div>
      </div>
    );
  }

  const zoom =
    locations.length <= 2 ? 7 : locations.length <= 8 ? 6 : locations.length <= 35 ? 5 : 4;

  return (
    <APIProvider apiKey={apiKey}>
      <div className="mc-map-frame">
        <p
          style={{
            margin: "0 0 10px 2px",
            fontSize: 11,
            letterSpacing: "0.06em",
            textTransform: "uppercase",
            fontWeight: 600,
            color: "var(--mc-ink-muted)",
          }}
        >
          Arizona · California · New Mexico · Sonora
        </p>
        <div className="mc-map-frame__inner mc-map-frame__map">
          <Map
            defaultCenter={center}
            defaultZoom={zoom}
            gestureHandling="greedy"
            disableDefaultUI={false}
            mapTypeControl
            mapTypeControlOptions={{
              position: 3,
              style: 1,
            }}
            fullscreenControl
            zoomControl
            streetViewControl={false}
            restriction={{
              latLngBounds: SOUTHWEST_BOUNDS,
              strictBounds: false,
            }}
            styles={BOUNDARY_EMPHASIS}
            style={{ width: "100%", height: "100%" }}
          >
            {locations.map((mc) => (
              <Marker
                key={mc.id}
                position={{ lat: mc.la, lng: mc.ln }}
                title={mc.n}
                onClick={() => onSelect(mc)}
                opacity={selectedId === mc.id ? 1 : 0.92}
              />
            ))}
          </Map>
        </div>
      </div>
    </APIProvider>
  );
}
