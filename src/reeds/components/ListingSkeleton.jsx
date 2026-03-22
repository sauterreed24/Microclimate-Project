export default function ListingSkeleton({ count = 6 }) {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="overflow-hidden rounded-2xl border border-white/5 bg-zinc-900/40"
          style={{ animationDelay: `${i * 60}ms` }}
        >
          <div className="aspect-[16/10] animate-pulse bg-zinc-800/80" />
          <div className="space-y-2 p-3">
            <div className="h-5 w-28 animate-pulse rounded bg-zinc-800" />
            <div className="h-4 w-full animate-pulse rounded bg-zinc-800/70" />
            <div className="h-3 w-2/3 animate-pulse rounded bg-zinc-800/50" />
          </div>
        </div>
      ))}
    </div>
  );
}
