import { Heart } from "lucide-react";

export default function ListingCard({ listing, priceSuffix = "", onOpen, isFavorite, onToggleFavorite }) {
  const zpid = listing.zpid;
  const fav = isFavorite?.(zpid);

  return (
    <div className="group relative overflow-hidden rounded-2xl border border-white/10 bg-zinc-900/80 text-left shadow-lg transition hover:border-teal-500/40 hover:shadow-teal-900/20">
      <button type="button" onClick={() => onOpen(listing)} className="block w-full text-left">
        {listing.image && (
          <div className="relative aspect-[16/10] overflow-hidden">
            <img src={listing.image} alt="" className="h-full w-full object-cover transition group-hover:scale-[1.02]" loading="lazy" />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-60" />
          </div>
        )}
        <div className="space-y-1 p-3">
          <p className="font-display text-lg font-semibold text-teal-200">
            {listing.price != null ? `$${listing.price.toLocaleString()}${priceSuffix}` : "—"}
          </p>
          <p className="text-sm text-white">{listing.address}</p>
          <p className="text-xs text-zinc-500">
            {listing.city}
            {listing.state ? `, ${listing.state}` : ""}
          </p>
          <p className="text-xs text-zinc-400">
            {listing.beds != null ? `${listing.beds} bd` : ""}
            {listing.baths != null ? ` · ${listing.baths} ba` : ""}
            {listing.livingArea != null ? ` · ${listing.livingArea.toLocaleString()} sqft` : ""}
          </p>
        </div>
      </button>
      {zpid && (
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onToggleFavorite?.(zpid);
          }}
          className="absolute right-2 top-2 z-10 rounded-full bg-black/50 p-2 text-zinc-300 backdrop-blur transition hover:bg-black/70 hover:text-rose-300"
          aria-label={fav ? "Remove favorite" : "Save favorite"}
        >
          <Heart className={`h-4 w-4 ${fav ? "fill-rose-400 text-rose-400" : ""}`} />
        </button>
      )}
    </div>
  );
}
