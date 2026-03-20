import { useMemo } from "react";
import { APIProvider, Map, Marker } from "@vis.gl/react-google-maps";

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
          border: "1px solid rgba(255,255,255,.08)",
          background: "rgba(255,255,255,.02)",
          padding: 24,
          textAlign: "center",
          color: "rgba(255,255,255,.45)",
          fontSize: 13,
          lineHeight: 1.6,
        }}
      >
        <div style={{ fontSize: 28, marginBottom: 10 }}>🗺️</div>
        <p
          style={{
            margin: "0 0 8px",
            color: "#e8d5a0",
            fontFamily: "'Instrument Serif',serif",
            fontSize: 17,
          }}
        >
          Add your Google Maps API key
        </p>
        <p style={{ margin: 0, fontSize: 12, color: "rgba(255,255,255,.35)" }}>
          Create <code style={{ color: "#c4a24f" }}>.env.local</code> in the project root with:
        </p>
        <code
          style={{
            display: "block",
            marginTop: 10,
            padding: "10px 12px",
            borderRadius: 10,
            background: "rgba(0,0,0,.35)",
            border: "1px solid rgba(255,255,255,.06)",
            color: "#86efac",
            fontSize: 11,
            wordBreak: "break-all",
          }}
        >
          VITE_GOOGLE_MAPS_API_KEY=your_key_here
        </code>
        <p style={{ margin: "14px 0 0", fontSize: 11, color: "rgba(255,255,255,.28)" }}>
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
          border: "1px solid rgba(255,255,255,.08)",
        }}
      >
        <Map
          defaultCenter={center}
          defaultZoom={zoom}
          gestureHandling="greedy"
          disableDefaultUI={false}
          mapTypeControl={false}
          style={{ width: "100%", height: "100%" }}
        >
          {locations.map((mc) => (
            <Marker
              key={mc.id}
              position={{ lat: mc.la, lng: mc.ln }}
              title={mc.n}
              onClick={() => onSelect(mc)}
              opacity={selectedId === mc.id ? 1 : 0.85}
            />
          ))}
        </Map>
      </div>
    </APIProvider>
  );
}
