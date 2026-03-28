/**
 * @param {{ count?: number, layout?: "grid" | "rail" }} props
 */
export default function ListingSkeleton({ count = 6, layout = "grid" }) {
  const label = "Loading listings from the search API";

  if (layout === "rail") {
    return (
      <div role="status" aria-live="polite" aria-busy="true" aria-label={label} className="space-y-2.5">
        {Array.from({ length: Math.min(count, 10) }).map((_, i) => (
          <div
            key={i}
            className="flex gap-3 rounded-xl border border-stone-200/80 bg-white p-2.5 shadow-sm ring-1 ring-stone-100/60"
          >
            <div className="reed-skeleton-pulse h-[4.5rem] w-[4.5rem] shrink-0 rounded-lg bg-stone-200/90" />
            <div className="min-w-0 flex-1 space-y-2 py-1">
              <div className="reed-skeleton-pulse h-4 w-24 rounded-md bg-stone-200/90" />
              <div className="reed-skeleton-pulse h-3 w-full rounded-md bg-stone-100" />
              <div className="reed-skeleton-pulse h-3 w-2/3 rounded-md bg-stone-100" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div
      role="status"
      aria-live="polite"
      aria-busy="true"
      aria-label={label}
      className="grid gap-3 sm:grid-cols-2"
    >
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="overflow-hidden rounded-2xl border border-stone-200/80 bg-white shadow-sm ring-1 ring-stone-100/60"
        >
          <div className="reed-skeleton-pulse aspect-[16/10] bg-gradient-to-br from-stone-100 to-stone-200/80" />
          <div className="space-y-2 p-3">
            <div className="reed-skeleton-pulse h-5 w-28 rounded-md bg-stone-200/90" />
            <div className="reed-skeleton-pulse h-4 w-full rounded-md bg-stone-100" />
            <div className="reed-skeleton-pulse h-3 w-2/3 rounded-md bg-stone-100" />
          </div>
        </div>
      ))}
    </div>
  );
}
