import { Compass, HeartHandshake, MapPin, Sun } from "lucide-react";
import { getAutoRefreshIntervalMs } from "../lib/listingFreshness.js";

/**
 * “4D” research framing: place, seasonal time, climate depth, decision path.
 * Not literal 4D graphics — intentional spatial + temporal + context + action narrative.
 */
export default function ImmersiveResearchStrip({ marketLabel, marketNotes, contextLine }) {
  const refreshDays = Math.max(1, Math.round(getAutoRefreshIntervalMs() / (24 * 60 * 60 * 1000)));
  const pillars = [
    {
      icon: MapPin,
      hue: "from-fuchsia-600 to-violet-700",
      ring: "ring-fuchsia-200/90",
      title: "Place",
      body: "Terrain-forward map: listings, climate hubs, and town anchors in one canvas so you read distance to ridges, valleys, and exposure.",
    },
    {
      icon: Sun,
      hue: "from-amber-500 to-orange-600",
      ring: "ring-amber-200/90",
      title: "Time",
      body: "Microclimate panel carries seasonal rhythm — monsoon windows, thermal bands, and comfort months — so a home isn’t judged on a single afternoon.",
    },
    {
      icon: Compass,
      hue: "from-teal-500 to-cyan-600",
      ring: "ring-teal-200/90",
      title: "Depth",
      body: "Water, fire-sky risk, air, and soil cues stack next to beds and baths. We’re optimizing for living in a place, not just square footage.",
    },
    {
      icon: HeartHandshake,
      hue: "from-rose-500 to-pink-600",
      ring: "ring-rose-200/90",
      title: "Decide",
      body: "Street View + Commons imagery, Zestimate curves when available, then hand off to Zillow or an agent for contracts — research here, close with a pro.",
    },
  ];

  return (
    <section
      className="overflow-hidden rounded-2xl border border-violet-200/80 bg-gradient-to-br from-violet-950 via-fuchsia-950/95 to-slate-950 p-[1px] shadow-xl shadow-violet-950/25"
      aria-label="Immersive research overview"
    >
      <div className="rounded-[15px] bg-gradient-to-b from-slate-950/40 to-slate-950/95 px-4 py-4 sm:px-5 sm:py-5">
        <div className="flex flex-wrap items-end justify-between gap-3 border-b border-white/10 pb-4">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-fuchsia-200/90">4D research lane</p>
            <h2 className="font-display mt-1 text-lg font-semibold tracking-tight text-white sm:text-xl">
              Immersive discovery — not a flat grid of thumbnails
            </h2>
            {marketLabel && (
              <p className="mt-1 max-w-2xl text-xs leading-relaxed text-violet-100/85">
                Active market: <span className="font-semibold text-white">{marketLabel}</span>
                {contextLine ? (
                  <>
                    {" "}
                    · <span className="text-teal-200/95">{contextLine}</span>
                  </>
                ) : null}
              </p>
            )}
          </div>
          <p className="max-w-xs text-[10px] leading-snug text-violet-200/70">
            Listing copy refreshes when you open a home (detail API). Search inventory re-pulls on filter changes, manual refresh, and automatically after ~{refreshDays}{" "}
            {refreshDays === 1 ? "day" : "days"} for the same search (tab open or when you come back).
          </p>
        </div>

        {marketNotes ? (
          <div className="mt-4 rounded-xl border border-teal-400/25 bg-teal-500/10 px-3 py-2.5 text-[11px] leading-relaxed text-teal-50 ring-1 ring-teal-400/20">
            <span className="font-bold text-teal-200">Local lens · </span>
            {marketNotes}
          </div>
        ) : null}

        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {pillars.map(({ icon, hue, ring, title, body }) => {
            const Glyph = icon;
            return (
              <div
                key={title}
                className={`rounded-xl border border-white/10 bg-white/[0.06] p-3 ring-1 ${ring} backdrop-blur-sm transition hover:bg-white/[0.09]`}
              >
                <div
                  className={`mb-2 inline-flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br ${hue} shadow-lg shadow-black/30`}
                >
                  <Glyph className="h-4 w-4 text-white" aria-hidden />
                </div>
                <p className="text-xs font-bold uppercase tracking-wider text-white">{title}</p>
                <p className="mt-1.5 text-[11px] leading-snug text-violet-100/88">{body}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
