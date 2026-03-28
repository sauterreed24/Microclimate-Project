import { useEffect, useRef, useState } from "react";
import { X, ExternalLink, Loader2, MapPin, Camera, Sparkles } from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { getPropertyDetails, getZestimate } from "../api/client.js";
import { extractCurrentZestimate, extractZestimateSeries } from "../lib/extractListings.js";
import { asText } from "../lib/formatDisplayValue.js";
import { readableError } from "../lib/errorMessage.js";
import { summarizeFromListing, summarizePropertyDetail } from "../lib/summarizeProperty.js";
import { fetchWikimediaPhotoNear, googleMapsStreetViewIntentUrl, streetViewEmbedUrl } from "../lib/placeMedia.js";
import { isDemoListing } from "../lib/demoListings.js";

export default function PropertyModal({ listing, onClose, priceSuffix = "" }) {
  const headerCloseRef = useRef(null);
  const [detail, setDetail] = useState(null);
  const [zest, setZest] = useState(null);
  const [zestErr, setZestErr] = useState(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);
  const [wikiPhoto, setWikiPhoto] = useState(null);
  const [wikiLoading, setWikiLoading] = useState(false);
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  useEffect(() => {
    if (!listing) return undefined;
    const t = window.setTimeout(() => headerCloseRef.current?.focus(), 60);
    return () => window.clearTimeout(t);
  }, [listing?.zpid, listing?.address]);

  useEffect(() => {
    let cancel = false;
    async function run() {
      if (!listing?.zpid) {
        setLoading(false);
        return;
      }
      if (isDemoListing(listing)) {
        setDetail(null);
        setZest(null);
        setZestErr(null);
        setErr(null);
        setLoading(false);
        return;
      }
      setLoading(true);
      setErr(null);
      setZestErr(null);
      try {
        const [d, z] = await Promise.all([
          getPropertyDetails({ zpid: listing.zpid }).catch(() => null),
          getZestimate({ zpid: listing.zpid }).catch((e) => {
            if (!cancel) setZestErr(readableError(e, "Valuation unavailable"));
            return null;
          }),
        ]);
        if (!cancel) {
          setDetail(d);
          setZest(z);
        }
      } catch (e) {
        if (!cancel) setErr(readableError(e, "Failed to load"));
      } finally {
        if (!cancel) setLoading(false);
      }
    }
    run();
    return () => {
      cancel = true;
    };
  }, [listing?.zpid]);

  useEffect(() => {
    let cancel = false;
    if (!listing) return undefined;
    const la = Number(listing.latitude ?? listing.lat);
    const ln = Number(listing.longitude ?? listing.lng);
    if (!Number.isFinite(la) || !Number.isFinite(ln)) {
      setWikiPhoto(null);
      setWikiLoading(false);
      return undefined;
    }
    setWikiLoading(true);
    setWikiPhoto(null);
    fetchWikimediaPhotoNear(la, ln).then((w) => {
      if (!cancel) {
        setWikiPhoto(w);
        setWikiLoading(false);
      }
    });
    return () => {
      cancel = true;
    };
  }, [listing?.zpid, listing?.latitude, listing?.longitude, listing?.lat, listing?.lng]);

  if (!listing) return null;

  const lat = listing.latitude ?? listing.lat;
  const lng = listing.longitude ?? listing.lng;
  const mapsQuery =
    lat != null && lng != null
      ? `${Number(lat)},${Number(lng)}`
      : [listing.address, listing.city, listing.state].filter(Boolean).join(", ");
  const googleMapsUrl = mapsQuery ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(mapsQuery)}` : null;
  const googleDirectionsUrl =
    lat != null && lng != null ? `https://www.google.com/maps/dir/?api=1&destination=${Number(lat)},${Number(lng)}` : null;

  const fromApi = summarizePropertyDetail(detail);
  const fromSearch = summarizeFromListing(listing);
  const summary =
    fromApi || fromSearch
      ? { ...(fromSearch || {}), ...(fromApi || {}) }
      : null;

  const descriptionText =
    (summary && typeof summary.description === "string" && summary.description.trim()) ||
    (listing.description && String(listing.description).trim()) ||
    null;
  const summaryFacts =
    summary && typeof summary === "object"
      ? Object.fromEntries(Object.entries(summary).filter(([k]) => k !== "description"))
      : null;

  const chartData = extractZestimateSeries(zest || {}).map((row, i) => ({
    i,
    label: String(row.t ?? i),
    value: row.v,
  }));
  const currentZestimate = extractCurrentZestimate(zest || {});
  const showValuationBlock = chartData.length > 0 || currentZestimate != null;

  const laN = Number(lat);
  const lnN = Number(lng);
  const streetEmbed =
    Number.isFinite(laN) && Number.isFinite(lnN) ? streetViewEmbedUrl(laN, lnN, { heading: 40, pitch: 8, fov: 80 }) : null;
  const streetIntent =
    Number.isFinite(laN) && Number.isFinite(lnN) ? googleMapsStreetViewIntentUrl(laN, lnN) : null;

  return (
    <div className="fixed inset-0 z-[100] flex items-end justify-center pb-[env(safe-area-inset-bottom,0px)] sm:items-center sm:p-6">
      <button type="button" className="absolute inset-0 bg-stone-900/50 backdrop-blur-[3px]" aria-label="Close" onClick={onClose} />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="reed-modal-title"
        className="relative z-10 max-h-[min(92vh,calc(100dvh-env(safe-area-inset-bottom)-0.75rem))] w-full max-w-3xl overflow-y-auto rounded-t-3xl border border-stone-200/90 bg-gradient-to-b from-sky-50/40 via-white to-white shadow-2xl ring-1 ring-stone-100/80 sm:rounded-3xl"
      >
        <div className="sticky top-0 z-[1] flex items-start justify-between gap-4 border-b border-stone-100/90 bg-white/90 p-5 backdrop-blur-md">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-teal-600">
              {isDemoListing(listing) ? "Demo listing (UI preview)" : "Listing"}
            </p>
            <h3 id="reed-modal-title" className="font-display mt-1 text-xl font-semibold text-stone-900">
              {asText(listing.address, "Property")}
            </h3>
            <p className="text-sm text-stone-500">
              {[asText(listing.city), asText(listing.state)].filter(Boolean).join(", ") || "—"}
            </p>
          </div>
          <button
            ref={headerCloseRef}
            type="button"
            onClick={onClose}
            className="rounded-xl p-2 text-stone-400 hover:bg-stone-100 hover:text-stone-800"
            aria-label="Close listing details"
          >
            <X className="h-5 w-5" aria-hidden />
          </button>
        </div>

        <div className="space-y-6 p-5">
          {(streetEmbed || streetIntent || wikiPhoto || wikiLoading || listing.image) && (
            <section className="overflow-hidden rounded-2xl border border-sky-100/80 bg-gradient-to-br from-sky-100/50 via-white to-teal-50/40 p-4 shadow-inner ring-1 ring-sky-100/60">
              <div className="mb-3 flex items-center gap-2 text-sky-950">
                <Sparkles className="h-4 w-4 text-sky-600" />
                <h4 className="text-xs font-bold uppercase tracking-wide text-sky-900">Place & perspective</h4>
              </div>
              <p className="mb-4 text-[11px] leading-relaxed text-sky-900/75">
                Street View + Commons photos are official APIs (not scraped social feeds). Enable <strong>Maps Embed API</strong> on the same Google Cloud key as
                your map for the live panorama strip.
              </p>
              <div className="grid gap-3 md:grid-cols-2">
                {streetEmbed ? (
                  <div className="overflow-hidden rounded-xl ring-1 ring-sky-200/80">
                    <iframe
                      title="Street View near listing"
                      className="h-[min(13rem,min(40vh,280px))] w-full max-w-full border-0 bg-black/5"
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      allowFullScreen
                      src={streetEmbed}
                    />
                  </div>
                ) : streetIntent ? (
                  <a
                    href={streetIntent}
                    target="_blank"
                    rel="noreferrer"
                    className="flex h-[min(13rem,min(40vh,280px)] min-h-[180px] max-w-full flex-col items-center justify-center rounded-xl bg-sky-950/5 px-4 text-center text-sm font-medium text-sky-900 ring-1 ring-sky-200/80 hover:bg-sky-100/40"
                  >
                    <Camera className="mb-2 h-8 w-8 text-sky-600" />
                    Open immersive Street View in Google Maps
                    <span className="mt-2 text-[11px] font-normal text-sky-800/80">(Add VITE_GOOGLE_MAPS_API_KEY + Embed API for inline panorama)</span>
                  </a>
                ) : null}

                <div className="space-y-2">
                  {listing.image && (
                    <img
                      src={listing.image}
                      alt=""
                      className="reed-media-safe rounded-xl ring-1 ring-stone-200/80"
                      loading="lazy"
                    />
                  )}
                  {wikiLoading && (
                    <p className="flex items-center gap-2 text-[11px] text-stone-500">
                      <Loader2 className="h-3.5 w-3.5 animate-spin text-teal-600" />
                      Finding a nearby Commons photo…
                    </p>
                  )}
                  {wikiPhoto && (
                    <a
                      href={wikiPhoto.pageUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="group block overflow-hidden rounded-xl ring-1 ring-amber-200/80 transition hover:ring-amber-300"
                    >
                      <img
                        src={wikiPhoto.thumbUrl}
                        alt=""
                        className="reed-media-safe transition group-hover:opacity-95"
                        loading="lazy"
                      />
                      <p className="bg-amber-50/95 px-2 py-1.5 text-[10px] text-amber-950/90">
                        Wikimedia Commons · {wikiPhoto.title.replace(/^File:/, "")} · CC community license — tap for attribution
                      </p>
                    </a>
                  )}
                </div>
              </div>
            </section>
          )}

          <div className="flex flex-wrap gap-3 text-sm">
            {listing.price != null && (
              <span className="rounded-lg bg-teal-50 px-3 py-1.5 font-semibold text-teal-800 ring-1 ring-teal-100">
                $
                {Number.isFinite(Number(listing.price)) ? Number(listing.price).toLocaleString() : asText(listing.price)}
                {priceSuffix}
              </span>
            )}
            {listing.beds != null && <span className="text-stone-700">{asText(listing.beds)} bd</span>}
            {listing.baths != null && <span className="text-stone-700">{asText(listing.baths)} ba</span>}
            {listing.livingArea != null && (
              <span className="text-stone-700">
                {Number.isFinite(Number(listing.livingArea))
                  ? Number(listing.livingArea).toLocaleString()
                  : asText(listing.livingArea)}{" "}
                sqft
              </span>
            )}
          </div>

          <div className="flex flex-wrap gap-2">
            {listing.url && (
              <a
                href={listing.url}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-xl bg-amber-50 px-4 py-2.5 text-sm font-medium text-amber-900 ring-1 ring-amber-100 hover:bg-amber-100/80"
              >
                Open on Zillow
                <ExternalLink className="h-4 w-4" />
              </a>
            )}
            {googleMapsUrl && (
              <a
                href={googleMapsUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-xl bg-sky-50 px-4 py-2.5 text-sm font-medium text-sky-900 ring-1 ring-sky-100 hover:bg-sky-100/80"
              >
                <MapPin className="h-4 w-4 shrink-0" />
                Open in Google Maps
                <ExternalLink className="h-4 w-4" />
              </a>
            )}
            {googleDirectionsUrl && (
              <a
                href={googleDirectionsUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-xl border border-sky-200 bg-white px-4 py-2.5 text-sm font-medium text-sky-800 hover:bg-sky-50/80"
              >
                Directions (Google)
                <ExternalLink className="h-4 w-4" />
              </a>
            )}
          </div>

          {loading && (
            <div className="flex items-center gap-2 text-stone-500">
              <Loader2 className="h-4 w-4 animate-spin text-teal-600" />
              Loading property details…
            </div>
          )}
          {err && <p className="text-sm text-red-600">{readableError(err, "")}</p>}

          {descriptionText && !loading && (
            <section className="rounded-2xl border border-violet-200/90 bg-gradient-to-br from-violet-50/95 via-white to-fuchsia-50/50 p-4 ring-1 ring-violet-100/80">
              <h4 className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-violet-900">
                <Sparkles className="h-3.5 w-3.5 text-violet-600" />
                Listing story
              </h4>
              <p className="reed-read text-sm text-stone-800">{descriptionText}</p>
              <p className="mt-2 text-[10px] text-violet-900/60">
                Sourced from the live detail feed when available; wording belongs to the listing agent/broker.
              </p>
            </section>
          )}

          {summaryFacts && !loading && Object.keys(summaryFacts).length > 0 && (
            <div className="rounded-xl border border-stone-200 bg-stone-50/80 p-4">
              <h4 className="mb-2 text-xs font-bold uppercase tracking-wide text-stone-500">
                At a glance
                {!fromApi && fromSearch && (
                  <span className="ml-2 font-normal normal-case text-stone-400">
                    — search data fills in when the detail response is sparse
                  </span>
                )}
              </h4>
              <dl className="grid grid-cols-2 gap-2 text-sm">
                {Object.entries(summaryFacts).map(([k, v]) => (
                  <div key={k} className="flex flex-col">
                    <dt className="text-[11px] uppercase tracking-wide text-stone-500">{k.replace(/([A-Z])/g, " $1")}</dt>
                    <dd className="leading-snug text-stone-800">{asText(v, "—")}</dd>
                  </div>
                ))}
              </dl>
            </div>
          )}

          {(detail || zest) && (
            <details className="rounded-xl border border-stone-200 bg-stone-50/50">
              <summary className="cursor-pointer px-4 py-3 text-xs font-medium text-stone-500 hover:text-stone-700">
                Technical: raw API JSON (optional)
              </summary>
              <pre className="max-h-48 overflow-auto border-t border-stone-100 p-4 text-xs text-stone-600">
                {JSON.stringify(
                  {
                    ...(detail ? { propertyDetails: detail } : {}),
                    ...(zest ? { zestimate: zest } : {}),
                  },
                  null,
                  2
                )}
              </pre>
            </details>
          )}

          {showValuationBlock && !loading && (
            <div className="rounded-xl border border-teal-100 bg-gradient-to-br from-teal-50/90 to-white p-4 ring-1 ring-teal-100/80">
              <h4 className="mb-3 text-xs font-bold uppercase tracking-wide text-teal-800">Valuation</h4>
              {chartData.length > 0 ? (
                <div className="h-56 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e7e5e4" />
                      <XAxis dataKey="label" tick={{ fill: "#78716c", fontSize: 10 }} />
                      <YAxis tick={{ fill: "#78716c", fontSize: 10 }} />
                      <Tooltip
                        contentStyle={{ background: "#fff", border: "1px solid #e7e5e4", borderRadius: "8px" }}
                        labelStyle={{ color: "#57534e" }}
                      />
                      <Line type="monotone" dataKey="value" stroke="#0d9488" strokeWidth={2} dot={false} />
                    </LineChart>
                  </ResponsiveContainer>
                  <p className="mt-2 text-[11px] text-stone-500">History from Zillow valuation feed when provided by the API.</p>
                </div>
              ) : (
                <div className="flex flex-wrap items-baseline gap-2">
                  <span className="text-2xl font-semibold tabular-nums text-teal-900">
                    ${currentZestimate.toLocaleString()}
                  </span>
                  <span className="text-sm text-stone-600">current Zestimate</span>
                </div>
              )}
            </div>
          )}

          {zestErr && !loading && (
            <p className="text-xs text-stone-500">
              Valuation service: {zestErr}. Listing price and details above still apply.
            </p>
          )}

          {!loading &&
            !showValuationBlock &&
            listing.zpid &&
            !zestErr && (
              <p className="text-xs text-stone-400">
                No historical valuation curve for this listing right now. The list price and property facts above are unchanged.
              </p>
            )}
        </div>
      </div>
    </div>
  );
}
