import { useEffect, useState, useMemo, useCallback } from "react";
import { fetchHomesListings, fetchHomesMarkets } from "../api/homesApi.js";

function fmtPrice(n) {
  if (n == null || Number.isNaN(n)) return "—";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(n);
}

export default function HomesTab({ mcList, rdById, onOpenMicroclimate, bcm }) {
  const [markets, setMarkets] = useState([]);
  const [mcId, setMcId] = useState(910);
  const [payload, setPayload] = useState(null);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState(null);

  const mc = useMemo(
    () => mcList.find((m) => m.id === mcId) || null,
    [mcList, mcId]
  );
  const rd = mc ? rdById[mc.id] : null;

  useEffect(() => {
    let cancel = false;
    fetchHomesMarkets()
      .then((j) => {
        if (!cancel && j.markets?.length) {
          setMarkets(j.markets);
          setMcId(j.markets[0].mcId);
        }
      })
      .catch(() => {
        if (!cancel) setMarkets([]);
      });
    return () => {
      cancel = true;
    };
  }, []);

  const load = useCallback(async () => {
    setLoading(true);
    setErr(null);
    try {
      const data = await fetchHomesListings(mcId, 1, 8);
      setPayload(data);
    } catch (e) {
      setErr(e.message || String(e));
      setPayload(null);
    } finally {
      setLoading(false);
    }
  }, [mcId]);

  useEffect(() => {
    load();
  }, [load]);

  const bc = mc ? bcm[mc.ty] || "#0f766e" : "#0f766e";

  return (
    <div style={{ padding: "0 18px 100px", display: "flex", flexDirection: "column", gap: 14 }}>
      <div
        style={{
          padding: "14px 16px",
          borderRadius: 16,
          background: "linear-gradient(135deg,rgba(15,118,110,.12),rgba(255,255,255,.85))",
          border: "1.5px solid rgba(15,118,110,.22)",
        }}
      >
        <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--mc-accent)", marginBottom: 6 }}>
          Homes · live listings
        </div>
        <p className="mc-read" style={{ fontSize: 14, margin: 0, color: "var(--mc-ink-muted)" }}>
          Zillow-sourced data via{" "}
          <strong style={{ color: "var(--mc-ink)" }}>OpenWeb Ninja</strong> (RapidAPI). Results cached{" "}
          <strong>15 minutes</strong> server-side to stay on the free tier. Tap a place card to open the full microclimate guide.
        </p>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        <label style={{ fontSize: 11, fontWeight: 600, color: "var(--mc-ink-muted)" }}>Corridor market</label>
        <select
          value={mcId}
          onChange={(e) => setMcId(Number(e.target.value))}
          style={{
            fontSize: 16,
            padding: "12px 14px",
            borderRadius: 12,
            border: "1.5px solid var(--mc-border)",
            background: "rgba(255,255,255,.95)",
            color: "var(--mc-ink)",
            fontFamily: "inherit",
            fontWeight: 500,
          }}
        >
          {(markets.length ? markets : [{ mcId: 910, label: "Sierra Vista" }, { mcId: 911, label: "Hereford" }, { mcId: 929, label: "Huachuca Mountains" }]).map((m) => (
            <option key={m.mcId} value={m.mcId}>
              {m.label}
            </option>
          ))}
        </select>
        {payload?.note && (
          <p style={{ fontSize: 12.5, color: "var(--mc-ink-muted)", margin: 0, lineHeight: 1.55 }}>
            {payload.note}
          </p>
        )}
      </div>

      {mc && (
        <button
          type="button"
          onClick={() => onOpenMicroclimate(mc)}
          style={{
            alignSelf: "flex-start",
            padding: "10px 16px",
            borderRadius: 12,
            border: `1.5px solid ${bc}55`,
            background: `linear-gradient(165deg,${bc}12,#fff)`,
            color: "var(--mc-ink)",
            fontWeight: 600,
            fontSize: 13,
            cursor: "pointer",
          }}
        >
          Open microclimate: {mc.n} →
        </button>
      )}

      {loading && (
        <div style={{ textAlign: "center", padding: 36, color: "var(--mc-ink-muted)", fontWeight: 600 }}>
          Loading listings…
        </div>
      )}

      {err && (
        <div
          style={{
            padding: 16,
            borderRadius: 14,
            background: "rgba(239,68,68,.08)",
            border: "1px solid rgba(239,68,68,.25)",
            color: "#991b1b",
            fontSize: 14,
            lineHeight: 1.55,
          }}
        >
          <strong>Could not load listings.</strong> {err}
          {err.includes("RAPIDAPI_KEY") && (
            <div style={{ marginTop: 10, fontSize: 13 }}>
              Add <code style={{ background: "rgba(0,0,0,.06)", padding: "2px 6px", borderRadius: 6 }}>RAPIDAPI_KEY</code> to{" "}
              <code style={{ background: "rgba(0,0,0,.06)", padding: "2px 6px", borderRadius: 6 }}>.env</code> and run{" "}
              <code style={{ background: "rgba(0,0,0,.06)", padding: "2px 6px", borderRadius: 6 }}>npm run dev:all</code>.
            </div>
          )}
          {err.includes("502") && (
            <div style={{ marginTop: 8, fontSize: 12.5, opacity: 0.9 }}>
              If this persists, set <code>ZILLOW_SEARCH_PATH</code> in <code>.env</code> to match your RapidAPI subscription (see README).
            </div>
          )}
        </div>
      )}

      {!loading && !err && payload?.listings?.length === 0 && (
        <div style={{ textAlign: "center", padding: 24, color: "var(--mc-ink-muted)" }}>No listings returned for this search.</div>
      )}

      {payload?.listings?.map((L) => (
        <article
          key={L.zpid || L.addressLine}
          style={{
            borderRadius: 18,
            overflow: "hidden",
            border: `1px solid ${bc}35`,
            boxShadow: "0 10px 36px -12px rgba(15,23,42,.15)",
            background: "linear-gradient(180deg,#fff 0%,#f8fafc 100%)",
          }}
        >
          <div style={{ display: "flex", height: 140, background: "#e2e8f0" }}>
            {L.photoUrl ? (
              <img
                src={L.photoUrl}
                alt=""
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
                loading="lazy"
              />
            ) : (
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", width: "100%", color: "var(--mc-ink-muted)", fontSize: 13 }}>
                No photo
              </div>
            )}
          </div>
          <div style={{ padding: "12px 14px 14px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 8, marginBottom: 6 }}>
              <span style={{ fontSize: 22, fontFamily: "'Fraunces',Georgia,serif", color: "var(--mc-ink)", fontWeight: 600 }}>{fmtPrice(L.price)}</span>
              {L.homeStatus && (
                <span style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", color: bc }}>
                  {String(L.homeStatus).replace(/_/g, " ")}
                </span>
              )}
            </div>
            <p style={{ fontSize: 14, fontWeight: 600, color: "var(--mc-ink-soft)", margin: "0 0 6px", lineHeight: 1.35 }}>
              {L.addressLine || "Address unavailable"}
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 10, fontSize: 12.5, color: "var(--mc-ink-muted)" }}>
              {[L.bedrooms != null && `${L.bedrooms} bd`, L.bathrooms != null && `${L.bathrooms} ba`, L.livingArea != null && `${Number(L.livingArea).toLocaleString()} sqft`, L.homeType && String(L.homeType).replace(/_/g, " ")].filter(Boolean).join(" · ")}
            </div>

            {mc && (
              <div
                style={{
                  padding: "10px 12px",
                  borderRadius: 12,
                  background: `linear-gradient(145deg,${bc}10,rgba(255,255,255,.9))`,
                  border: `1px solid ${bc}28`,
                }}
              >
                <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: bc, marginBottom: 6 }}>
                  Microclimate insight · {mc.n}
                </div>
                <div style={{ fontSize: 12.5, lineHeight: 1.55, color: "var(--mc-ink-muted)" }}>
                  Summer high ~<strong style={{ color: "var(--mc-ink)" }}>{mc.sH}°F</strong>, winter low ~<strong style={{ color: "var(--mc-ink)" }}>{mc.wL}°F</strong>, rain ~<strong style={{ color: "var(--mc-ink)" }}>{mc.ra}"</strong>/yr ·{" "}
                  {mc.ty}. {rd && (
                    <>
                      {" "}
                      UTCI comfort ~<strong>{rd.ut}</strong>/12 mo · Bortle ~<strong>{rd.bo}</strong>
                    </>
                  )}
                </div>
              </div>
            )}

            {L.zillowUrl && (
              <a
                href={L.zillowUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: "inline-block",
                  marginTop: 10,
                  fontSize: 13,
                  fontWeight: 600,
                  color: "var(--mc-accent)",
                }}
              >
                View on Zillow ↗
              </a>
            )}
          </div>
        </article>
      ))}

      {payload && !loading && !err && (
        <p style={{ fontSize: 11, color: "var(--mc-ink-muted)", textAlign: "center", marginTop: 4 }}>
          {payload.cached ? "Served from cache · " : "Fresh fetch · "}
          Data © Zillow / listing sources. Not financial advice.
        </p>
      )}
    </div>
  );
}
