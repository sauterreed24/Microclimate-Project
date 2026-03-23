import { Globe2, MapPinned, Waves } from "lucide-react";

/**
 * Honest scope: Zillow US listings by market search; Sonora = travel context only (no Zillow MX).
 */
export default function CoverageMexicoBanner({ activeState }) {
  return (
    <div className="space-y-2 rounded-xl border border-teal-100/90 bg-gradient-to-br from-teal-50/90 via-white to-sky-50/80 p-3 shadow-sm ring-1 ring-teal-100/60">
      <div className="flex flex-wrap items-center gap-2 text-[11px] font-semibold uppercase tracking-wide text-teal-900/90">
        <span className="inline-flex items-center gap-1 rounded-full bg-white/90 px-2 py-0.5 ring-1 ring-teal-200/80">
          <MapPinned className="h-3.5 w-3.5 text-teal-600" />
          AZ · CA · NM coverage
        </span>
        {activeState && (
          <span className="text-stone-500 normal-case">
            Active: <span className="font-medium text-stone-700">{activeState}</span>
          </span>
        )}
      </div>
      <p className="text-[11px] leading-relaxed text-stone-600">
        Listings come from <strong className="text-stone-800">Zillow (US only)</strong> per market search — browse every town in the library, paginate, and refine filters. There is{" "}
        <strong className="text-stone-800">no single API call</strong> for “every home in three states at once”; we maximize reach by market + radius + fallbacks.
      </p>
      <div className="flex flex-wrap gap-2 border-t border-teal-100/80 pt-2">
        <span className="inline-flex items-center gap-1 rounded-lg bg-violet-50 px-2 py-1 text-[10px] font-medium text-violet-900 ring-1 ring-violet-200/80">
          <Globe2 className="h-3 w-3 shrink-0" />
          Sonora (MX): travel & climate pins — not Zillow listings
        </span>
        <span className="inline-flex items-center gap-1 rounded-lg bg-sky-50 px-2 py-1 text-[10px] font-medium text-sky-900 ring-1 ring-sky-200/80">
          <Waves className="h-3 w-3 shrink-0" />
          Water / monsoon / elevation: microclimate panel + terrain map
        </span>
      </div>
    </div>
  );
}
