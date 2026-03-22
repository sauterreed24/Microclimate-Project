import { Compass, SlidersHorizontal } from "lucide-react";

export default function EmptyResults({ loading }) {
  if (loading) return null;
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-white/15 bg-zinc-900/40 px-6 py-16 text-center">
      <Compass className="mb-4 h-12 w-12 text-teal-500/50" />
      <h3 className="font-display text-lg font-semibold text-zinc-200">No listings match (yet)</h3>
      <p className="mt-2 max-w-md text-sm leading-relaxed text-zinc-500">
        Try raising the max price, dropping bedroom minimums, switching sort to <strong className="text-zinc-400">Newest</strong>, or
        choosing a broader city chip. The API can also return sparse results for very small markets.
      </p>
      <p className="mt-4 flex items-center justify-center gap-2 text-xs text-zinc-600">
        <SlidersHorizontal className="h-3.5 w-3.5" />
        Tip: save favorites with the heart — they persist on this device.
      </p>
    </div>
  );
}
