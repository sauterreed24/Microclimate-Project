export default function ListingSkeleton({ count = 6 }) {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="overflow-hidden rounded-2xl border border-stone-200/80 bg-white shadow-sm">
          <div className="aspect-[16/10] animate-pulse bg-gradient-to-br from-stone-100 to-stone-200/80" />
          <div className="space-y-2 p-3">
            <div className="h-5 w-28 animate-pulse rounded-md bg-stone-200" />
            <div className="h-4 w-full animate-pulse rounded-md bg-stone-100" />
            <div className="h-3 w-2/3 animate-pulse rounded-md bg-stone-100" />
          </div>
        </div>
      ))}
    </div>
  );
}
