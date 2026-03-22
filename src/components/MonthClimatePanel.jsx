import { genM, MONTH_NAMES } from "../utils/climateModel.js";

/**
 * Editorial month-by-month climate: easy to scan highs, lows, feels-like, rain.
 */
export default function MonthClimatePanel({ mc }) {
  const d = genM(mc.sH, mc.sL, mc.wH, mc.wL, mc.ra, mc.hu);
  const avgAnnualTemp = Math.round(d.reduce((s, x) => s + (x.hi + x.lo) / 2, 0) / 12);
  const wettest = d.reduce((a, x) => (x.rain > a.rain ? x : a), d[0]);
  const hottest = d.reduce((a, x) => (x.hi > a.hi ? x : a), d[0]);
  const coldest = d.reduce((a, x) => (x.lo < a.lo ? x : a), d[0]);

  return (
    <div style={{ marginBottom: 16 }}>
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          alignItems: "baseline",
          justifyContent: "space-between",
          gap: 8,
          marginBottom: 10,
        }}
      >
        <div>
          <div
            style={{
              fontSize: 9,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color: "var(--mc-accent, #0d9488)",
              fontWeight: 600,
              marginBottom: 4,
            }}
          >
            Twelve-month picture
          </div>
          <h3
            style={{
              margin: 0,
              fontFamily: "'Fraunces', Georgia, serif",
              fontWeight: 400,
              fontSize: 22,
              color: "var(--mc-ink)",
            }}
          >
            Temperatures & rain
          </h3>
        </div>
        <div
          style={{
            fontSize: 12,
            color: "var(--mc-ink-muted)",
            lineHeight: 1.45,
            maxWidth: 200,
            textAlign: "right",
          }}
        >
          <span style={{ color: "var(--mc-sage)", fontWeight: 600 }}>{avgAnnualTemp}°F</span> mean of monthly
          midpoints · peak{" "}
          <span style={{ fontWeight: 600 }}>{hottest.m}</span> {hottest.hi}° · coolest night{" "}
          <span style={{ fontWeight: 600 }}>{coldest.m}</span> {coldest.lo}°
        </div>
      </div>
      <p
        style={{
          fontSize: 14.5,
          color: "var(--mc-ink-muted)",
          lineHeight: 1.68,
          margin: "0 0 14px",
          letterSpacing: "0.01em",
        }}
      >
        Each card is <strong style={{ color: "var(--mc-ink)" }}>typical high</strong> and{" "}
        <strong style={{ color: "var(--mc-ink)" }}>typical low</strong> for that month, plus a humidity-informed
        “feels” hint and share of annual rainfall.
      </p>
      <div className="mc-month-grid">
        {d.map((row, i) => {
          const mid = Math.round((row.hi + row.lo) / 2);
          return (
            <div
              key={row.m}
              style={{
                borderRadius: 14,
                padding: "10px 10px 8px",
                background: "linear-gradient(168deg, #ffffff 0%, #f8fafc 100%)",
                border: "1px solid var(--mc-border)",
                boxShadow: "0 8px 28px -8px rgba(15, 23, 42, 0.07)",
              }}
            >
              <div
                style={{
                  fontSize: 10,
                  fontWeight: 700,
                  letterSpacing: "0.06em",
                  color: "var(--mc-accent, #0d9488)",
                  marginBottom: 6,
                }}
              >
                {MONTH_NAMES[i]}
              </div>
              <div style={{ display: "flex", alignItems: "flex-end", gap: 10 }}>
                <div>
                  <div
                    style={{
                      fontFamily: "'Fraunces', Georgia, serif",
                      fontSize: 26,
                      lineHeight: 1,
                      color: "#c45c3e",
                    }}
                  >
                    {row.hi}°
                  </div>
                  <div style={{ fontSize: 9, color: "var(--mc-ink-muted)", marginTop: 2 }}>day high</div>
                </div>
                <div
                  style={{
                    width: 1,
                    alignSelf: "stretch",
                    background: "rgba(74,60,49,.12)",
                    marginBottom: 4,
                  }}
                />
                <div>
                  <div
                    style={{
                      fontFamily: "'Fraunces', Georgia, serif",
                      fontSize: 22,
                      lineHeight: 1,
                      color: "#3d7a8c",
                    }}
                  >
                    {row.lo}°
                  </div>
                  <div style={{ fontSize: 9, color: "var(--mc-ink-muted)", marginTop: 2 }}>night low</div>
                </div>
              </div>
              <div
                style={{
                  marginTop: 8,
                  paddingTop: 8,
                  borderTop: "1px solid rgba(74,60,49,.08)",
                  fontSize: 11,
                  color: "var(--mc-ink-muted)",
                  lineHeight: 1.4,
                }}
              >
                <span style={{ color: "var(--mc-ink)" }}>Midpoint ~{mid}°</span>
                <span style={{ opacity: 0.5 }}> · </span>
                Feels ~{row.felt}°
                <span style={{ opacity: 0.5 }}> · </span>
                <span style={{ color: "#3d6b8c" }}>{row.rain}″ rain</span>
              </div>
            </div>
          );
        })}
      </div>
      <div
        style={{
          marginTop: 14,
          padding: "12px 14px",
          borderRadius: 12,
          background: "rgba(93, 122, 95, 0.08)",
          border: "1px solid rgba(93, 122, 95, 0.2)",
        }}
      >
        <div style={{ fontSize: 10, fontWeight: 600, color: "var(--mc-sage)", marginBottom: 6 }}>
          Wettest month · {wettest.m} ({wettest.rain}″ this slice)
        </div>
        <div style={{ display: "flex", alignItems: "flex-end", gap: 3, height: 44 }}>
          {d.map((row, i) => {
            const h = Math.max(6, (row.rain / (wettest.rain || 1)) * 38);
            return (
              <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center" }}>
                <div
                  title={`${MONTH_NAMES[i]}: ${row.rain}″`}
                  style={{
                    width: "100%",
                    maxWidth: 22,
                    height: h,
                    borderRadius: 6,
                    background: `linear-gradient(180deg, #6b9bd1 0%, #3d6b8c 100%)`,
                    opacity: 0.75 + (row.rain / (wettest.rain || 1)) * 0.25,
                  }}
                />
                <span style={{ fontSize: 8, color: "var(--mc-ink-muted)", marginTop: 4 }}>{row.m}</span>
              </div>
            );
          })}
        </div>
        <div style={{ fontSize: 10, color: "var(--mc-ink-muted)", marginTop: 8 }}>
          {mc.ra}″ approximate annual total · bars are relative within this location.
        </div>
      </div>
    </div>
  );
}
