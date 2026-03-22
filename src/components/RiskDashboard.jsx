import {
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

/**
 * Compares flood, wildfire, and drought risk levels (1–5) for planning context.
 * Not financial advice — illustrative hazard profile only.
 */
export default function RiskDashboard({ rd }) {
  if (!rd) return null;

  const data = [
    { subject: "Flood", value: rd.fl, fullMark: 5 },
    { subject: "Wildfire", value: rd.wf, fullMark: 5 },
    { subject: "Drought", value: rd.dr, fullMark: 5 },
  ];

  return (
    <div
      style={{
        background: "linear-gradient(145deg,rgba(99,102,241,.1),rgba(255,254,251,.95))",
        border: "1px solid rgba(99,102,241,.22)",
        borderRadius: 16,
        padding: "12px 8px 8px",
        marginBottom: 14,
        boxShadow: "0 4px 20px rgba(74, 60, 49, 0.06)",
      }}
    >
      <div
        style={{
          fontSize: 9,
          color: "#4338ca",
          letterSpacing: ".08em",
          textTransform: "uppercase",
          textAlign: "center",
          marginBottom: 4,
          fontWeight: 600,
          opacity: 0.85,
        }}
      >
        Hazard profile (1 = lowest — 5 = highest)
      </div>
      <ResponsiveContainer width="100%" height={220}>
        <RadarChart cx="50%" cy="50%" outerRadius="72%" data={data}>
          <PolarGrid stroke="rgba(74,60,49,.12)" />
          <PolarAngleAxis
            dataKey="subject"
            tick={{ fill: "rgba(58,50,43,.75)", fontSize: 11, fontWeight: 500 }}
          />
          <PolarRadiusAxis
            angle={90}
            domain={[0, 5]}
            tickCount={6}
            tick={{ fill: "rgba(58,50,43,.45)", fontSize: 9 }}
          />
          <Radar
            name="Level"
            dataKey="value"
            stroke="#6366f1"
            fill="#818cf8"
            fillOpacity={0.38}
          />
          <Tooltip
            contentStyle={{
              background: "#fffefb",
              border: "1px solid rgba(74,60,49,.14)",
              borderRadius: 10,
              fontSize: 12,
              color: "#3a322b",
              boxShadow: "0 8px 24px rgba(74,60,49,.12)",
            }}
            labelStyle={{ color: "#b4532a", fontWeight: 600 }}
            formatter={(value) => [`${value} / 5`, "Risk"]}
          />
        </RadarChart>
      </ResponsiveContainer>
      <p
        style={{
          fontSize: 10,
          color: "var(--mc-ink-muted, rgba(58,50,43,.72))",
          textAlign: "center",
          margin: "0 8px 8px",
          lineHeight: 1.6,
        }}
      >
        Use for relocation, insurance, and land-use planning context — not investment advice.
      </p>
    </div>
  );
}
