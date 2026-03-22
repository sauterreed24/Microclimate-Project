import { useEffect, useState } from "react";
import { X, ExternalLink, Loader2 } from "lucide-react";
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
import { extractZestimateSeries } from "../lib/extractListings.js";
import { summarizePropertyDetail } from "../lib/summarizeProperty.js";

export default function PropertyModal({ listing, onClose, priceSuffix = "" }) {
  const [detail, setDetail] = useState(null);
  const [zest, setZest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  useEffect(() => {
    let cancel = false;
    async function run() {
      if (!listing?.zpid) {
        setLoading(false);
        return;
      }
      setLoading(true);
      setErr(null);
      try {
        const [d, z] = await Promise.all([
          getPropertyDetails({ zpid: listing.zpid }).catch(() => null),
          getZestimate({ zpid: listing.zpid }).catch(() => null),
        ]);
        if (!cancel) {
          setDetail(d);
          setZest(z);
        }
      } catch (e) {
        if (!cancel) setErr(e.message || "Failed to load");
      } finally {
        if (!cancel) setLoading(false);
      }
    }
    run();
    return () => {
      cancel = true;
    };
  }, [listing?.zpid]);

  if (!listing) return null;

  const summary = summarizePropertyDetail(detail);
  const chartData = extractZestimateSeries(zest || {}).map((row, i) => ({
    i,
    label: String(row.t ?? i),
    value: row.v,
  }));

  return (
    <div className="fixed inset-0 z-[100] flex items-end justify-center sm:items-center sm:p-6">
      <button type="button" className="absolute inset-0 bg-stone-900/40 backdrop-blur-[2px]" aria-label="Close" onClick={onClose} />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="reed-modal-title"
        className="relative z-10 max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-t-3xl border border-stone-200 bg-white shadow-2xl ring-1 ring-stone-100 sm:rounded-3xl"
      >
        <div className="sticky top-0 flex items-start justify-between gap-4 border-b border-stone-100 bg-white/95 p-5 backdrop-blur">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-teal-600">Listing</p>
            <h3 id="reed-modal-title" className="font-display mt-1 text-xl font-semibold text-stone-900">
              {listing.address || "Property"}
            </h3>
            <p className="text-sm text-stone-500">
              {listing.city}
              {listing.state ? `, ${listing.state}` : ""}
            </p>
          </div>
          <button type="button" onClick={onClose} className="rounded-xl p-2 text-stone-400 hover:bg-stone-100 hover:text-stone-800">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-6 p-5">
          {listing.image && (
            <img src={listing.image} alt="" className="h-52 w-full rounded-2xl object-cover ring-1 ring-stone-200" loading="lazy" />
          )}

          <div className="flex flex-wrap gap-3 text-sm">
            {listing.price != null && (
              <span className="rounded-lg bg-teal-50 px-3 py-1.5 font-semibold text-teal-800 ring-1 ring-teal-100">
                ${listing.price.toLocaleString()}
                {priceSuffix}
              </span>
            )}
            {listing.beds != null && <span className="text-stone-700">{listing.beds} bd</span>}
            {listing.baths != null && <span className="text-stone-700">{listing.baths} ba</span>}
            {listing.livingArea != null && <span className="text-stone-700">{listing.livingArea.toLocaleString()} sqft</span>}
          </div>

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

          {loading && (
            <div className="flex items-center gap-2 text-stone-500">
              <Loader2 className="h-4 w-4 animate-spin text-teal-600" />
              Loading property details…
            </div>
          )}
          {err && <p className="text-sm text-red-600">{err}</p>}

          {summary && !loading && (
            <div className="rounded-xl border border-stone-200 bg-stone-50/80 p-4">
              <h4 className="mb-2 text-xs font-bold uppercase tracking-wide text-stone-500">From API</h4>
              <dl className="grid grid-cols-2 gap-2 text-sm">
                {Object.entries(summary).map(([k, v]) => (
                  <div key={k} className="flex flex-col">
                    <dt className="text-[10px] uppercase text-stone-500">{k.replace(/([A-Z])/g, " $1")}</dt>
                    <dd className="text-stone-800">{typeof v === "object" ? JSON.stringify(v) : String(v)}</dd>
                  </div>
                ))}
              </dl>
            </div>
          )}

          {detail && (
            <details className="rounded-xl border border-stone-200 bg-stone-50/50">
              <summary className="cursor-pointer px-4 py-3 text-xs font-medium text-stone-500 hover:text-stone-700">
                Raw API response (debug)
              </summary>
              <pre className="max-h-48 overflow-auto border-t border-stone-100 p-4 text-xs text-stone-600">
                {JSON.stringify(detail, null, 2)}
              </pre>
            </details>
          )}

          {chartData.length > 0 && (
            <div>
              <h4 className="mb-3 text-sm font-semibold uppercase tracking-wide text-stone-500">Zestimate trend</h4>
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
              </div>
            </div>
          )}

          {!loading && !chartData.length && listing.zpid && (
            <p className="text-sm text-stone-500">No chart series returned for this property — API may use a different shape.</p>
          )}
        </div>
      </div>
    </div>
  );
}
