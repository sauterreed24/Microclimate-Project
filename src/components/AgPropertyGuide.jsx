/**
 * Landowner / homesteader oriented ag summary — synthesizes MC fields (not site-specific advice).
 */
export default function AgPropertyGuide({ mc, onTerm }) {
  const frost = mc.wL;
  const heat = mc.sH;
  const zone = mc.zo || "—";
  const rain = mc.ra;
  const sun = mc.su;

  let season = "";
  if (frost <= 32 && heat >= 85) season = "Long warm season with real winter chill — good for tree fruit, vines, and cool-season overlap if you manage water.";
  else if (frost <= 15) season = "Hard winter lows — prioritize cold-hardy stock, season extension (hoops, thermal mass), and windbreaks.";
  else if (heat >= 100) season = "Intense summer heat — prioritize heat-tolerant cultivars, shade cloth, drip timing, and soil organic matter to buffer roots.";
  else season = "Moderate thermal envelope — many row-crop and orchard options if water and soil drainage match your plan.";

  const water =
    rain < 10
      ? "Precipitation is scarce; plan irrigation as primary. Check water rights, well yields, and municipal tiers before scaling plantings."
      : rain < 20
        ? "Semi-arid moisture — dryland possible for natives; cultivated crops usually need supplemental irrigation."
        : "More generous moisture — still map drainage, fungal pressure in humid months, and hail risk for soft fruit.";

  const sunNote =
    sun >= 280
      ? "Very high solar receipts — excellent for photovoltaics and sun-loving crops; watch transpiration and UV on workers."
      : sun >= 220
        ? "Strong sun typical of intermountain / continental sites — plan row orientation and afternoon shade for tender greens."
        : "Lower bright-sun fraction — may suit shade-tolerant crops and reduces evaporative demand somewhat.";

  const chips = [...(mc.gr || []), ...(mc.la2 || [])].slice(0, 8);

  return (
    <div style={{ marginBottom: 8 }}>
      <div
        style={{
          fontSize: 9,
          letterSpacing: "0.14em",
          textTransform: "uppercase",
          color: "var(--mc-sage)",
          fontWeight: 600,
          marginBottom: 4,
        }}
      >
        For your land & table
      </div>
      <h3
        style={{
          margin: "0 0 12px",
          fontFamily: "'Instrument Serif', serif",
          fontWeight: 400,
          fontSize: 22,
          color: "var(--mc-ink)",
        }}
      >
        Growing & stewardship
      </h3>
      <div
        style={{
          borderRadius: 16,
          padding: "14px 16px",
          background: "linear-gradient(145deg, rgba(93,122,95,.1) 0%, rgba(250,248,244,.9) 100%)",
          border: "1px solid rgba(93, 122, 95, 0.22)",
          marginBottom: 12,
        }}
      >
        <p style={{ fontSize: 13, lineHeight: 1.7, color: "var(--mc-ink-muted)", margin: "0 0 10px" }}>
          {season}
        </p>
        <p style={{ fontSize: 13, lineHeight: 1.7, color: "var(--mc-ink-muted)", margin: "0 0 10px" }}>{water}</p>
        <p style={{ fontSize: 13, lineHeight: 1.7, color: "var(--mc-ink-muted)", margin: 0 }}>{sunNote}</p>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 12 }}>
        {[
          { k: "Frost floor (winter low ~)", v: `${frost}°F`, hint: "Microclimates in draws vs ridges can swing 10°F+" },
          { k: "Summer ceiling (high ~)", v: `${heat}°F`, hint: "Irrigation + mulch change root-zone reality" },
          { k: "USDA zone", v: zone, hint: "Tap for glossary", term: "Hardiness Zone" },
          { k: "Rain (in/yr ~)", v: `${rain}″`, hint: "Seasonality matters — see monthly cards" },
        ].map((x) => (
          <div
            key={x.k}
            onClick={x.term ? () => onTerm(x.term) : undefined}
            style={{
              borderRadius: 12,
              padding: "10px 12px",
              background: "#fffefb",
              border: "1px solid var(--mc-border)",
              cursor: x.term ? "pointer" : "default",
            }}
          >
            <div style={{ fontSize: 9, textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--mc-ink-muted)" }}>
              {x.k}
            </div>
            <div style={{ fontFamily: "'Instrument Serif', serif", fontSize: 20, color: "var(--mc-ink)", marginTop: 2 }}>{x.v}</div>
            <div style={{ fontSize: 10, color: "var(--mc-terracotta)", marginTop: 4 }}>{x.hint}</div>
          </div>
        ))}
      </div>
      <div
        style={{
          borderRadius: 14,
          padding: "12px 14px",
          background: "rgba(196, 162, 79, 0.12)",
          border: "1px solid rgba(196, 162, 79, 0.25)",
          marginBottom: 12,
        }}
      >
        <div style={{ fontSize: 10, fontWeight: 600, color: "var(--mc-terracotta)", marginBottom: 8 }}>
          Ideas already tied to this biome
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
          {chips.map((c, i) => (
            <span
              key={i}
              style={{
                padding: "5px 10px",
                borderRadius: 999,
                background: "rgba(255,255,255,.7)",
                border: "1px solid rgba(196, 162, 79, 0.3)",
                fontSize: 11,
                color: "var(--mc-ink)",
              }}
            >
              {c}
            </span>
          ))}
        </div>
      </div>
      <p style={{ fontSize: 11, lineHeight: 1.6, color: "var(--mc-ink-muted)", fontStyle: "italic", margin: 0 }}>
        Always soil-test, water-test, and verify easements. Native plants ({(mc.vg || []).length} listed under Grow & Land) often outperform
        exotic lawns on water and fire-wise landscaping.
      </p>
    </div>
  );
}
