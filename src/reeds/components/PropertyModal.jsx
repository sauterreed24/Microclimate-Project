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
      <button type="button" className="absolute inset-0 bg-black/70 backdrop-blur-sm" aria-label="Close" onClick={onClose} />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="reed-modal-title"
        className="relative z-10 max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-t-3xl border border-white/10 bg-zinc-950 shadow-2xl sm:rounded-3xl"
      >
        <div className="sticky top-0 flex items-start justify-between gap-4 border-b border-white/10 bg-zinc-950/95 p-5 backdrop-blur">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-teal-400">Listing</p>
            <h3 id="reed-modal-title" className="font-display mt-1 text-xl font-semibold text-white">
              {listing.address || "Property"}
            </h3>
            <p className="text-sm text-zinc-400">
              {listing.city}
              {listing.state ? `, ${listing.state}` : ""}
            </p>
          </div>
          <button type="button" onClick={onClose} className="rounded-xl p-2 text-zinc-400 hover:bg-white/10 hover:text-white">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-6 p-5">
          {listing.image && (
            <img src={listing.image} alt="" className="h-52 w-full rounded-2xl object-cover ring-1 ring-white/10" loading="lazy" />
          )}

          <div className="flex flex-wrap gap-3 text-sm">
            {listing.price != null && (
              <span className="rounded-lg bg-teal-500/15 px-3 py-1.5 font-semibold text-teal-200">
                ${listing.price.toLocaleString()}
                {priceSuffix}
              </span>
            )}
            {listing.beds != null && <span className="text-zinc-300">{listing.beds} bd</span>}
            {listing.baths != null && <span className="text-zinc-300">{listing.baths} ba</span>}
            {listing.livingArea != null && <span className="text-zinc-300">{listing.livingArea.toLocaleString()} sqft</span>}
          </div>

          {listing.url && (
            <a
              href={listing.url}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-xl bg-amber-500/15 px-4 py-2.5 text-sm font-medium text-amber-200 hover:bg-amber-500/25"
            >
              Open on Zillow
              <ExternalLink className="h-4 w-4" />
            </a>
          )}

          {loading && (
            <div className="flex items-center gap-2 text-zinc-400">
              <Loader2 className="h-4 w-4 animate-spin" />
              Loading property intelligence…
            </div>
          )}
          {err && <p className="text-sm text-red-400">{err}</p>}

          {summary && !loading && (
            <div className="rounded-xl border border-white/10 bg-black/30 p-4">
              <h4 className="mb-2 text-xs font-bold uppercase tracking-wide text-zinc-500">From API</h4>
              <dl className="grid grid-cols-2 gap-2 text-sm">
                {Object.entries(summary).map(([k, v]) => (
                  <div key={k} className="flex flex-col">
                    <dt className="text-[10px] uppercase text-zinc-600">{k.replace(/([A-Z])/g, " $1")}</dt>
                    <dd className="text-zinc-200">{typeof v === "object" ? JSON.stringify(v) : String(v)}</dd>
                  </div>
                ))}
              </dl>
            </div>
          )}

          {detail && (
            <details className="rounded-xl border border-white/5 bg-black/20">
              <summary className="cursor-pointer px-4 py-3 text-xs font-medium text-zinc-500 hover:text-zinc-300">
                Raw API response (debug)
              </summary>
              <pre className="max-h-48 overflow-auto border-t border-white/5 p-4 text-xs text-zinc-500">
                {JSON.stringify(detail, null, 2)}
              </pre>
            </details>
          )}

          {chartData.length > 0 && (
            <div>
              <h4 className="mb-3 text-sm font-semibold uppercase tracking-wide text-zinc-500">Zestimate trend</h4>
              <div className="h-56 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
                    <XAxis dataKey="label" tick={{ fill: "#71717a", fontSize: 10 }} />
                    <YAxis tick={{ fill: "#71717a", fontSize: 10 }} />
                    <Tooltip
                      contentStyle={{ background: "#18181b", border: "1px solid #3f3f46" }}
                      labelStyle={{ color: "#a1a1aa" }}
                    />
                    <Line type="monotone" dataKey="value" stroke="#2dd4bf" strokeWidth={2} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          {!loading && !chartData.length && listing.zpid && (
            <p className="text-sm text-zinc-500">No chart series returned for this property — API may use a different shape.</p>
          )}
        </div>
      </div>
    </div>
  );
}
