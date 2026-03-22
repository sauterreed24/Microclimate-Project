import { useMemo } from "react";
import { APIProvider, Map, Marker } from "@vis.gl/react-google-maps";

/** Warm, low-contrast map skin — pairs with editorial cream UI */
const WARM_EDITORIAL_MAP_STYLE = [
  { elementType: "geometry", stylers: [{ color: "#f5f1ea" }] },
  { elementType: "labels.text.fill", stylers: [{ color: "#5c524a" }] },
  { elementType: "labels.text.stroke", stylers: [{ color: "#faf6ef" }, { weight: 3 }] },
  { featureType: "administrative", elementType: "geometry.stroke", stylers: [{ color: "#d4c9bc" }] },
  { featureType: "landscape.natural", elementType: "geometry", stylers: [{ color: "#e4ddd2" }] },
  { featureType: "poi", elementType: "geometry", stylers: [{ color: "#ebe5da" }] },
  { featureType: "poi.park", elementType: "geometry.fill", stylers: [{ color: "#c5d4bf" }] },
  { featureType: "road", elementType: "geometry", stylers: [{ color: "#ffffff" }] },
  { featureType: "road.highway", elementType: "geometry", stylers: [{ color: "#efe8dc" }] },
  { featureType: "road.highway", elementType: "geometry.stroke", stylers: [{ color: "#e0d5c8" }] },
  { featureType: "transit.line", elementType: "geometry", stylers: [{ color: "#d4c9bc" }] },
  { featureType: "water", elementType: "geometry", stylers: [{ color: "#9eb8c8" }] },
];

/**
 * Interactive map of microclimate locations. Loads the Maps JS API once via APIProvider.
 * API key: VITE_GOOGLE_MAPS_API_KEY in .env.local (never commit).
 */
export default function ClimateMap({ apiKey, locations, onSelect, selectedId }) {
  const center = useMemo(() => {
    if (!locations?.length) return { lat: 42, lng: -98 };
    const la = locations.reduce((s, m) => s + m.la, 0) / locations.length;
    const ln = locations.reduce((s, m) => s + m.ln, 0) / locations.length;
    return { lat: la, lng: ln };
  }, [locations]);

  if (!apiKey) {
    return (
      <div
        style={{
          borderRadius: 18,
          border: "1px solid var(--mc-border, rgba(74,60,49,.14))",
          background: "linear-gradient(145deg, #fffefb, #faf6ef)",
          padding: 24,
          textAlign: "center",
          color: "var(--mc-ink-muted, rgba(58,50,43,.7))",
          fontSize: 13,
          lineHeight: 1.6,
          boxShadow: "0 8px 28px rgba(74,60,49,.08)",
        }}
      >
        <div style={{ fontSize: 28, marginBottom: 10 }}>🗺️</div>
        <p
          style={{
            margin: "0 0 8px",
            color: "var(--mc-ink, #3a322b)",
            fontFamily: "'Instrument Serif',serif",
            fontSize: 17,
          }}
        >
          Add your Google Maps API key
        </p>
        <p style={{ margin: 0, fontSize: 12, color: "var(--mc-ink-muted)" }}>
          Create <code style={{ color: "var(--mc-terracotta, #b4532a)" }}>.env.local</code> in the project root with:
        </p>
        <code
          style={{
            display: "block",
            marginTop: 10,
            padding: "10px 12px",
            borderRadius: 10,
            background: "rgba(255,255,255,.85)",
            border: "1px solid var(--mc-border, rgba(74,60,49,.14))",
            color: "#166534",
            fontSize: 11,
            wordBreak: "break-all",
          }}
        >
          VITE_GOOGLE_MAPS_API_KEY=your_key_here
        </code>
        <p style={{ margin: "14px 0 0", fontSize: 11, color: "var(--mc-ink-muted)" }}>
          Restart <code>npm run dev</code> after saving. Restrict the key in Google Cloud (see README).
        </p>
      </div>
    );
  }

  const zoom = locations.length <= 3 ? 5 : locations.length <= 12 ? 4 : 3;

  return (
    <APIProvider apiKey={apiKey}>
      <div
        style={{
          width: "100%",
          height: "calc(100vh - 200px)",
          minHeight: 320,
          borderRadius: 18,
          overflow: "hidden",
          border: "1px solid var(--mc-border, rgba(74,60,49,.14))",
          boxShadow: "0 12px 40px rgba(74,60,49,.12)",
        }}
      >
        <Map
          defaultCenter={center}
          defaultZoom={zoom}
          gestureHandling="greedy"
          disableDefaultUI={false}
          mapTypeControl={false}
          styles={WARM_EDITORIAL_MAP_STYLE}
          style={{ width: "100%", height: "100%" }}
        >
          {locations.map((mc) => (
            <Marker
              key={mc.id}
              position={{ lat: mc.la, lng: mc.ln }}
              title={mc.n}
              onClick={() => onSelect(mc)}
              opacity={selectedId === mc.id ? 1 : 0.88}
            />
          ))}
        </Map>
      </div>
    </APIProvider>
  );
}
