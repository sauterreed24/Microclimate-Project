import { Heart, Home } from "lucide-react";
import { asText } from "../lib/formatDisplayValue.js";

function formatLot(listing) {
  const v = listing.lotAreaValue;
  if (v == null || !Number.isFinite(Number(v))) return null;
  const u = String(listing.lotAreaUnit || "").toLowerCase();
  const n = Number(v);
  if (u.includes("acre")) return `${n} ac`;
  if (u.includes("sqft") || u === "sqft") return `${Math.round(n).toLocaleString()} lot sf`;
  return `${n.toLocaleString()} ${listing.lotAreaUnit || ""}`.trim();
}

export default function ListingCard({
  listing,
  priceSuffix = "",
  onOpen,
  isFavorite,
  onToggleFavorite,
  variant = "card",
  /** Shown on full-width list rows — geography/water line from active market */
  marketContextLine = "",
}) {
  const zpid = listing.zpid;
  const fav = isFavorite?.(zpid);
  const lot = formatLot(listing);
  const typeShort = listing.homeTypeLabel ? String(listing.homeTypeLabel).replace(/_/g, " ") : "";

  if (variant === "split") {
    return (
      <div className="group relative overflow-hidden rounded-xl border border-stone-200/90 bg-white shadow-sm ring-1 ring-stone-100/80 transition hover:border-teal-300/90 hover:shadow-md">
        <button type="button" onClick={() => onOpen(listing)} className="flex w-full gap-3 p-2.5 text-left">
          <div className="relative h-[4.5rem] w-[4.5rem] shrink-0 overflow-hidden rounded-lg bg-stone-100">
            {listing.image ? (
              <img src={listing.image} alt="" className="h-full w-full object-cover transition group-hover:scale-[1.03]" loading="lazy" />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-teal-100 to-stone-100">
                <Home className="h-6 w-6 text-teal-700/50" />
              </div>
            )}
          </div>
          <div className="min-w-0 flex-1 space-y-1">
            <p className="font-display text-base font-bold leading-tight text-teal-800">
              {listing.price != null
                ? `$${Number.isFinite(Number(listing.price)) ? Number(listing.price).toLocaleString() : asText(listing.price)}${priceSuffix}`
                : "—"}
            </p>
            <p className="line-clamp-2 text-[12px] font-medium leading-snug text-stone-900">{asText(listing.address, "Address")}</p>
            <p className="text-[10px] text-stone-500">
              {[asText(listing.city), asText(listing.state)].filter(Boolean).join(", ") || "—"}
            </p>
            <div className="flex flex-wrap gap-1.5 pt-0.5">
              {listing.beds != null && (
                <span className="rounded-md bg-stone-100 px-1.5 py-0.5 text-[10px] font-semibold text-stone-700">{asText(listing.beds)} bd</span>
              )}
              {listing.baths != null && (
                <span className="rounded-md bg-stone-100 px-1.5 py-0.5 text-[10px] font-semibold text-stone-700">{asText(listing.baths)} ba</span>
              )}
              {listing.livingArea != null && (
                <span className="rounded-md bg-stone-100 px-1.5 py-0.5 text-[10px] font-semibold text-stone-700">
                  {Number.isFinite(Number(listing.livingArea)) ? Number(listing.livingArea).toLocaleString() : asText(listing.livingArea)} sf
                </span>
              )}
              {lot && (
                <span className="rounded-md bg-sky-50 px-1.5 py-0.5 text-[10px] font-semibold text-sky-900 ring-1 ring-sky-100">{lot}</span>
              )}
              {typeShort && (
                <span className="rounded-md bg-teal-50 px-1.5 py-0.5 text-[10px] font-medium text-teal-900 line-clamp-1 max-w-[8rem]">{typeShort}</span>
              )}
            </div>
            {listing.daysOnMarket != null && (
              <p className="text-[10px] text-stone-400">
                {Number.isFinite(Number(listing.daysOnMarket)) ? `${Number(listing.daysOnMarket)}d on Zillow` : asText(listing.daysOnMarket)}
              </p>
            )}
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
            className="absolute right-2 top-2 z-10 rounded-full border border-white/90 bg-white/95 p-1.5 text-stone-400 shadow-sm transition hover:bg-white hover:text-rose-500"
            aria-label={fav ? "Remove favorite" : "Save favorite"}
          >
            <Heart className={`h-3.5 w-3.5 ${fav ? "fill-rose-500 text-rose-500" : ""}`} />
          </button>
        )}
      </div>
    );
  }

  return (
    <div
      className={`group relative overflow-hidden rounded-2xl border border-stone-200/90 bg-white text-left shadow-sm ring-1 ring-stone-100 transition hover:border-teal-300/80 hover:shadow-md ${
        variant === "row" ? "md:flex md:items-stretch" : ""
      }`}
    >
      <button type="button" onClick={() => onOpen(listing)} className="block w-full text-left">
        {listing.image && (
          <div className={`relative overflow-hidden bg-stone-100 ${variant === "row" ? "aspect-[16/8] md:aspect-auto md:h-full md:w-64 md:shrink-0" : "aspect-[16/10]"}`}>
            <img src={listing.image} alt="" className="h-full w-full object-cover transition group-hover:scale-[1.02]" loading="lazy" />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-stone-900/35 to-transparent" />
          </div>
        )}
        <div className={`space-y-1 p-3.5 ${variant === "row" ? "md:p-4" : ""}`}>
          <p className="font-display text-lg font-semibold text-teal-800">
            {listing.price != null
              ? `$${Number.isFinite(Number(listing.price)) ? Number(listing.price).toLocaleString() : asText(listing.price)}${priceSuffix}`
              : "—"}
          </p>
          <p className="text-sm font-medium text-stone-900">{asText(listing.address, "Address on Zillow")}</p>
          <p className="text-xs text-stone-500">{[asText(listing.city), asText(listing.state)].filter(Boolean).join(", ") || "—"}</p>
          <p className="text-xs text-stone-600">
            {listing.beds != null ? `${asText(listing.beds)} bd` : ""}
            {listing.baths != null ? ` · ${asText(listing.baths)} ba` : ""}
            {listing.livingArea != null
              ? ` · ${
                  Number.isFinite(Number(listing.livingArea))
                    ? Number(listing.livingArea).toLocaleString()
                    : asText(listing.livingArea)
                } sqft`
              : ""}
            {lot ? ` · ${lot}` : ""}
          </p>
          {typeShort && <p className="text-[11px] text-stone-500">{typeShort}</p>}
          {listing.daysOnMarket != null && (
            <p className="text-xs text-stone-500">
              {Number.isFinite(Number(listing.daysOnMarket)) ? `${Number(listing.daysOnMarket)} days on Zillow` : asText(listing.daysOnMarket)}
            </p>
          )}
          {marketContextLine && variant === "row" && (
            <p className="text-[11px] leading-snug text-teal-900/85">{marketContextLine}</p>
          )}
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
