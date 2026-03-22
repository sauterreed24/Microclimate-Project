const LABELS = [
  "Out on the land",
  "Food & gather",
  "Slow travel",
  "Light & season",
  "Water & sky",
  "Culture & craft",
  "Wild neighbors",
  "Night & stars",
  "Local rhythm",
  "Hidden corners",
];

/**
 * Magazine-style activity blocks from string array (no data loss — full text preserved).
 */
export default function TravelActivityCards({ items, biomeColor, renderT, onTerm }) {
  if (!items?.length) {
    return (
      <p style={{ color: "var(--mc-ink-muted)", fontSize: 13 }}>
        We’re expanding field notes for this place — check similar locations meanwhile.
      </p>
    );
  }

  return (
    <div>
      <div
        style={{
          borderRadius: 16,
          padding: "16px 18px",
          background: "linear-gradient(125deg, rgba(13,148,136,.12) 0%, rgba(255,255,255,.5) 48%, transparent 72%)",
          border: "1px solid rgba(13, 148, 136, 0.22)",
          marginBottom: 18,
        }}
      >
        <div
          style={{
            fontSize: 9,
            letterSpacing: "0.16em",
            textTransform: "uppercase",
            fontWeight: 700,
            marginBottom: 6,
            color: "var(--mc-accent, #0d9488)",
          }}
        >
          Field itinerary
        </div>
        <h3
          style={{
            margin: 0,
            fontFamily: "'Fraunces', Georgia, serif",
            fontWeight: 500,
            fontSize: 26,
            lineHeight: 1.12,
            letterSpacing: "-0.02em",
            color: "var(--mc-ink)",
          }}
        >
          How to spend your days here
        </h3>
        <p style={{ margin: "12px 0 0", fontSize: 15, lineHeight: 1.72, color: "var(--mc-ink-muted)", letterSpacing: "0.01em" }}>
          Think of this as a <strong style={{ color: "var(--mc-ink)" }}>travel-forward workbook</strong> — not a checklist to
          finish in one trip. Each card keeps the full original note (nothing trimmed) while borrowing the rhythm of a glossy
          destination guide: a gentle section label, room to breathe, and typography that rewards slow reading. Cross-reference
          the <strong style={{ color: "var(--mc-ink)" }}>Climate</strong> tab before you lock dates — wind, river levels, smoke,
          and snow closure patterns can rewrite the same itinerary overnight. If you&apos;re also evaluating land or a second
          home, pair these outings with <strong style={{ color: "var(--mc-ink)" }}>Grow &amp; Land</strong> for water, frost, and
          stewardship context. Arrive curious, leave no trace, respect closures and Indigenous access protocols, and tip guides
          generously when someone shares their backyard with you.
        </p>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        {items.map((text, i) => {
          const label = LABELS[i % LABELS.length];
          const raw = String(text);
          const parts = raw.split(/\s[—–]\s|—|–/).map((s) => s.trim());
          const hasHead = parts.length >= 2;
          const title = hasHead ? parts[0] : "";
          const prose = hasHead ? parts.slice(1).join(" — ") : raw;

          return (
            <article
              key={i}
              style={{
                borderRadius: 18,
                overflow: "hidden",
                background: "linear-gradient(180deg,#ffffff,#f8fafc)",
                border: "1px solid var(--mc-border)",
                boxShadow: "0 12px 40px -12px rgba(15, 23, 42, 0.1)",
                animation: `mcCardIn 0.35s ease ${Math.min(i * 45, 400)}ms both`,
              }}
            >
              <div
                style={{
                  padding: "12px 16px 10px",
                  background: `linear-gradient(90deg, ${biomeColor}18, transparent)`,
                  borderBottom: "1px solid rgba(74,60,49,.06)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: 8,
                }}
              >
                <span
                  style={{
                    fontSize: 9,
                    fontWeight: 700,
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    color: biomeColor,
                  }}
                >
                  {label}
                </span>
                <span
                  style={{
                    fontFamily: "'Fraunces', Georgia, serif",
                    fontSize: 18,
                    color: "rgba(15,23,42,.22)",
                    lineHeight: 1,
                  }}
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
              </div>
              <div style={{ padding: "14px 16px 16px" }}>
                {hasHead && (
                  <h4
                    style={{
                      margin: "0 0 8px",
                      fontFamily: "'Fraunces', Georgia, serif",
                      fontWeight: 400,
                      fontSize: 17,
                      lineHeight: 1.35,
                      color: "var(--mc-ink)",
                    }}
                  >
                    {renderT(title, onTerm)}
                  </h4>
                )}
                <p style={{ margin: 0, fontSize: 13.5, lineHeight: 1.68, color: "var(--mc-ink-muted)" }}>
                  {renderT(prose, onTerm)}
                </p>
                <div
                  style={{
                    marginTop: 12,
                    paddingTop: 10,
                    borderTop: "1px dashed rgba(15,23,42,.1)",
                    fontSize: 11.5,
                    fontStyle: "italic",
                    color: "var(--mc-accent, #0d9488)",
                    lineHeight: 1.5,
                  }}
                >
                  Insider frame: pair this block with the monthly temperature cards — wind, UV, and monsoon pulses change the
                  same trail week to week.
                </div>
              </div>
            </article>
          );
        })}
      </div>
      <style>{`
        @keyframes mcCardIn {
          from { opacity: 0; transform: translateY(14px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
