import { Leaf, MapPin, Sun } from "lucide-react";

/**
 * Calm, climate-forward hero — listings are intentionally not the headline.
 */
export default function ClimateFirstStrip({ marketLabel, marketNotes, contextLine }) {
  return (
    <section
      className="overflow-hidden rounded-2xl border border-teal-200/70 bg-gradient-to-br from-teal-50/95 via-emerald-50/80 to-stone-50/90 p-[1px] shadow-lg shadow-teal-900/10 ring-1 ring-teal-100/80"
      aria-label="Climate and place overview"
    >
      <div className="rounded-[15px] bg-gradient-to-b from-white/90 to-teal-50/40 px-4 py-4 sm:px-5 sm:py-5">
        <div className="flex flex-wrap items-start justify-between gap-3 border-b border-teal-100/80 pb-3">
          <div className="min-w-0">
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-teal-700/90">Microclimate atlas</p>
            <h2 className="font-display mt-1 text-lg font-semibold tracking-tight text-stone-900 sm:text-xl">
              Understand the place before the floor plan
            </h2>
            {marketLabel && (
              <p className="reed-read-wide mt-2 max-w-2xl text-sm text-stone-700">
                <span className="inline-flex items-center gap-1.5 font-medium text-teal-900">
                  <MapPin className="h-3.5 w-3.5 shrink-0 text-teal-600" aria-hidden />
                  {marketLabel}
                </span>
                {contextLine ? (
                  <>
                    {" "}
                    <span className="text-stone-600">· {contextLine}</span>
                  </>
                ) : null}
              </p>
            )}
          </div>
          <div className="flex max-w-sm gap-2 text-[11px] leading-snug text-stone-600">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-teal-100 text-teal-800 ring-1 ring-teal-200/80">
              <Sun className="h-4 w-4" aria-hidden />
            </span>
            <span>
              Homes here are a <strong className="text-stone-800">supporting layer</strong> — terrain, water, and seasonality come first. Scroll down for listing tools
              and outbound links to major portals.
            </span>
          </div>
        </div>

        {marketNotes ? (
          <div className="reed-read-wide mt-3 rounded-xl border border-emerald-200/60 bg-emerald-50/60 px-3 py-2.5 text-sm text-emerald-950 ring-1 ring-emerald-100/80">
            <span className="font-semibold text-emerald-900">
              <Leaf className="mr-1 inline h-3.5 w-3.5 text-emerald-600" aria-hidden />
              Local lens ·{" "}
            </span>
            {marketNotes}
          </div>
        ) : null}
      </div>
    </section>
  );
}
