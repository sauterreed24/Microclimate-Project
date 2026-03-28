import { LayoutList } from "lucide-react";
import CoverageMexicoBanner from "./CoverageMexicoBanner.jsx";
import SonoraVisitStrip from "./SonoraVisitStrip.jsx";
import ListingCard from "./ListingCard.jsx";
import ScrollFadeEdges from "./ScrollFadeEdges.jsx";

/**
 * Map-first companion: dense, scannable list with geography/water context — keeps eyes near terrain + pins.
 */
export default function ExploreListRail({
  /** One client page of results; map uses the full merged set from the parent. */
  listings,
  /** Total homes in merged result (all pins on map). Defaults to `listings.length` if omitted. */
  totalListings = null,
  page,
  /** Total client-side pages. Defaults to 1 if omitted. */
  totalPages = null,
  setPage,
  canGoNext = true,
  priceSuffix,
  favoriteZpids,
  toggleFavorite,
  onOpenListing,
  activeState,
  marketContextLine,
  /** Human-readable freshness line from parent (timestamp + auto-refresh policy). */
  syncHint = null,
  mergedPageCount = 8,
}) {
  const total = totalListings != null ? totalListings : listings.length;
  const pages = totalPages != null ? totalPages : 1;
  return (
    <div className="flex min-h-[min(72vh,780px)] flex-col gap-3 rounded-2xl border border-stone-200/95 bg-gradient-to-b from-white to-stone-50/50 p-3 shadow-lg shadow-stone-200/30 ring-1 ring-stone-100 lg:max-h-[min(85vh,calc(100vh-8rem))]">
      <div className="flex items-center gap-2 border-b border-stone-100 pb-2">
        <LayoutList className="h-4 w-4 text-teal-600" />
        <div>
          <h2 className="font-display text-sm font-semibold text-stone-900">Listings (this search)</h2>
          <p className="text-[10px] text-stone-500">Scroll while the map stays in view — tap a row for full detail.</p>
        </div>
      </div>

      <CoverageMexicoBanner activeState={activeState} />
      <SonoraVisitStrip />

      {marketContextLine && (
        <p className="rounded-lg border border-sky-100 bg-sky-50/80 px-2.5 py-2 text-[11px] leading-snug text-sky-950 ring-1 ring-sky-100/80">
          <span className="font-semibold text-sky-900">Place & water context: </span>
          {marketContextLine}
        </p>
      )}

      {syncHint && (
        <p className="rounded-lg border border-violet-200/90 bg-violet-50/90 px-2.5 py-2 text-[10px] leading-snug text-violet-950 ring-1 ring-violet-100/80">
          {syncHint}
        </p>
      )}

      <div className="flex shrink-0 items-center justify-between gap-2 rounded-lg bg-stone-100/80 px-2 py-1.5">
        <p className="text-[11px] font-medium text-stone-600">
          {listings.length} shown · {total} total · list {page}/{pages} · up to {mergedPageCount} upstream pages merged
        </p>
        <div className="flex gap-1">
          <button
            type="button"
            disabled={page <= 1}
            onClick={() => setPage(page - 1)}
            className="rounded-md border border-stone-200 bg-white px-2.5 py-1 text-[11px] font-semibold text-stone-700 shadow-sm disabled:opacity-40"
          >
            Prev
          </button>
          <button
            type="button"
            disabled={!canGoNext}
            onClick={() => setPage(page + 1)}
            className="rounded-md border border-stone-200 bg-white px-2.5 py-1 text-[11px] font-semibold text-stone-700 shadow-sm disabled:opacity-40"
          >
            Next
          </button>
        </div>
      </div>

      <ScrollFadeEdges>
        <div className="reed-explore-rail-scroll min-h-0 flex-1 space-y-2.5 overflow-y-auto overflow-x-hidden pr-1 pb-1 pt-0.5">
          {listings.map((li) => (
            <ListingCard
              key={li.zpid || li.address}
              listing={li}
              priceSuffix={priceSuffix}
              variant="split"
              onOpen={onOpenListing}
              isFavorite={(z) => favoriteZpids.includes(z)}
              onToggleFavorite={toggleFavorite}
            />
          ))}
        </div>
      </ScrollFadeEdges>
    </div>
  );
}
