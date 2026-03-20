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
        background: "linear-gradient(145deg,rgba(99,102,241,.06),rgba(99,102,241,.02))",
        border: "1px solid rgba(99,102,241,.15)",
        borderRadius: 16,
        padding: "12px 8px 8px",
        marginBottom: 14,
      }}
    >
      <div
        style={{
          fontSize: 9,
          color: "rgba(165,180,252,.55)",
          letterSpacing: ".08em",
          textTransform: "uppercase",
          textAlign: "center",
          marginBottom: 4,
        }}
      >
        Hazard profile (1 = lowest — 5 = highest)
      </div>
      <ResponsiveContainer width="100%" height={220}>
        <RadarChart cx="50%" cy="50%" outerRadius="72%" data={data}>
          <PolarGrid stroke="rgba(255,255,255,.08)" />
          <PolarAngleAxis
            dataKey="subject"
            tick={{ fill: "rgba(255,255,255,.5)", fontSize: 11 }}
          />
          <PolarRadiusAxis
            angle={90}
            domain={[0, 5]}
            tickCount={6}
            tick={{ fill: "rgba(255,255,255,.28)", fontSize: 9 }}
          />
          <Radar
            name="Level"
            dataKey="value"
            stroke="#818cf8"
            fill="#6366f1"
            fillOpacity={0.45}
          />
          <Tooltip
            contentStyle={{
              background: "#111",
              border: "1px solid rgba(255,255,255,.1)",
              borderRadius: 10,
              fontSize: 12,
            }}
            labelStyle={{ color: "#e8d5a0" }}
            formatter={(value) => [`${value} / 5`, "Risk"]}
          />
        </RadarChart>
      </ResponsiveContainer>
      <p
        style={{
          fontSize: 10,
          color: "rgba(255,255,255,.32)",
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
