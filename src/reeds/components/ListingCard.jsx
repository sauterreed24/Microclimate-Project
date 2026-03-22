import { Heart } from "lucide-react";

export default function ListingCard({ listing, priceSuffix = "", onOpen, isFavorite, onToggleFavorite }) {
  const zpid = listing.zpid;
  const fav = isFavorite?.(zpid);

  return (
    <div className="group relative overflow-hidden rounded-2xl border border-stone-200/90 bg-white text-left shadow-sm ring-1 ring-stone-100 transition hover:border-teal-300/80 hover:shadow-md">
      <button type="button" onClick={() => onOpen(listing)} className="block w-full text-left">
        {listing.image && (
          <div className="relative aspect-[16/10] overflow-hidden bg-stone-100">
            <img src={listing.image} alt="" className="h-full w-full object-cover transition group-hover:scale-[1.02]" loading="lazy" />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-stone-900/35 to-transparent" />
          </div>
        )}
        <div className="space-y-1 p-3.5">
          <p className="font-display text-lg font-semibold text-teal-800">
            {listing.price != null ? `$${listing.price.toLocaleString()}${priceSuffix}` : "—"}
          </p>
          <p className="text-sm font-medium text-stone-900">{listing.address}</p>
          <p className="text-xs text-stone-500">
            {listing.city}
            {listing.state ? `, ${listing.state}` : ""}
          </p>
          <p className="text-xs text-stone-600">
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
          className="absolute right-2 top-2 z-10 rounded-full border border-white/80 bg-white/90 p-2 text-stone-400 shadow-sm backdrop-blur transition hover:bg-white hover:text-rose-500"
          aria-label={fav ? "Remove favorite" : "Save favorite"}
        >
          <Heart className={`h-4 w-4 ${fav ? "fill-rose-500 text-rose-500" : ""}`} />
        </button>
      )}
    </div>
  );
}
