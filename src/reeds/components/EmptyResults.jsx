import { Compass, SlidersHorizontal } from "lucide-react";

export default function EmptyResults({ loading }) {
  if (loading) return null;
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-stone-300 bg-white px-6 py-14 text-center shadow-sm">
      <Compass className="mb-4 h-11 w-11 text-teal-200" />
      <h3 className="font-display text-lg font-semibold text-stone-800">No listings match</h3>
      <p className="mt-2 max-w-md text-sm leading-relaxed text-stone-500">
        Try widening price or room filters, switch sort to <strong className="text-stone-700">Newest</strong>, or pick a larger market
        (e.g. Phoenix, Phoenix metro, or Tucson).
      </p>
      <p className="mt-4 flex items-center justify-center gap-2 text-xs text-stone-400">
        <SlidersHorizontal className="h-3.5 w-3.5" />
        Hearts save favorites on this device.
      </p>
    </div>
  );
}
