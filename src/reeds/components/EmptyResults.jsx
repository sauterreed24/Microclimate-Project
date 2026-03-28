import { Compass, RotateCcw, SlidersHorizontal, Sparkles } from "lucide-react";

export default function EmptyResults({ loading, onResetFilters, onTryDemo }) {
  if (loading) return null;
  return (
    <div
      className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-violet-200/90 bg-gradient-to-b from-white via-violet-50/20 to-white px-6 py-14 text-center shadow-md shadow-violet-950/5 ring-1 ring-stone-100/80"
      role="status"
    >
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-100 to-teal-100 ring-1 ring-violet-200/60">
        <Compass className="h-7 w-7 text-violet-600" aria-hidden />
      </div>
      <h3 className="font-display text-lg font-semibold text-stone-900">No listings match this search</h3>
      <p className="reed-read mx-auto mt-2 max-w-md text-sm text-stone-600">
        Widen price or room ranges, set sort to <strong className="text-stone-800">Newest</strong>, or pick a larger market (metro or county). Third-party feeds rarely mirror every MLS town the way the Zillow site does, so sparse towns sometimes need a wider radius or a nearby hub.
      </p>
      <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
        {onResetFilters && (
          <button
            type="button"
            onClick={onResetFilters}
            className="inline-flex items-center gap-2 rounded-xl border border-teal-200 bg-teal-50 px-4 py-2.5 text-sm font-semibold text-teal-900 shadow-sm transition hover:bg-teal-100/80"
          >
            <RotateCcw className="h-4 w-4 shrink-0" aria-hidden />
            Reset filters
          </button>
        )}
        {onTryDemo && (
          <button
            type="button"
            onClick={onTryDemo}
            className="inline-flex items-center gap-2 rounded-xl border border-violet-200 bg-gradient-to-r from-violet-50 to-fuchsia-50 px-4 py-2.5 text-sm font-semibold text-violet-900 shadow-sm transition hover:from-violet-100 hover:to-fuchsia-100"
          >
            <Sparkles className="h-4 w-4 shrink-0" aria-hidden />
            Try demo listings
          </button>
        )}
      </div>
      <p className="mt-6 flex items-center justify-center gap-2 text-xs text-stone-500">
        <SlidersHorizontal className="h-3.5 w-3.5 shrink-0 text-stone-400" aria-hidden />
        Hearts save favorites on this device only.
      </p>
    </div>
  );
}
