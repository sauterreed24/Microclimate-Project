import { useState } from "react";
import { ChevronDown, ChevronUp, Leaf, Mountain, Sparkles } from "lucide-react";
import { asText } from "../lib/formatDisplayValue.js";

function Stat({ k, v, sub }) {
  if (v == null || v === "") return null;
  const main = asText(v, "");
  if (!main) return null;
  return (
    <div className="rounded-xl border border-stone-100 bg-stone-50/80 px-3 py-2.5">
      <p className="text-[10px] font-bold uppercase tracking-wider text-stone-500">{k}</p>
      <p className="mt-1 text-sm font-semibold leading-snug text-stone-900">{main}</p>
      {sub != null && asText(sub, "") !== "" && (
        <p className="mt-1 text-[11px] leading-relaxed text-stone-600">{asText(sub)}</p>
      )}
    </div>
  );
}

export default function MarketMicroclimatePanel({ bundle, locationLabel }) {
  const [bpOpen, setBpOpen] = useState(false);

  if (!bundle) return null;

  const { loc, rd } = bundle;
  const bp = typeof loc.bp === "string" ? loc.bp : "";

  return (
    <section className="overflow-hidden rounded-2xl border border-emerald-200/80 bg-gradient-to-br from-white via-emerald-50/30 to-teal-50/40 shadow-lg shadow-emerald-900/5 ring-1 ring-emerald-100/80">
      <div className="border-b border-emerald-100/90 bg-white/60 px-4 py-3 backdrop-blur-sm">
        <div className="flex flex-wrap items-start justify-between gap-2">
          <div className="flex min-w-0 items-start gap-2">
            <span className="mt-0.5 text-xl" aria-hidden>
              {loc.em}
            </span>
            <div className="min-w-0">
              <p className="font-display text-base font-semibold tracking-tight text-stone-900">Microclimate · {loc.n}</p>
              <p className="reed-read-wide mt-1 text-xs text-stone-600">{loc.tl}</p>
              {locationLabel && (
                <p className="mt-1 flex items-center gap-1 text-[10px] text-emerald-800/90">
                  <Sparkles className="h-3 w-3 shrink-0" />
                  Showing homes for: <span className="font-medium">{locationLabel}</span>
                </p>
              )}
            </div>
          </div>
          <span className="rounded-full border border-emerald-200/80 bg-emerald-50 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-emerald-900">
            Saguaro Atlas
          </span>
        </div>
      </div>

      <div className="space-y-3 px-4 py-4">
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
          <Stat k="Climate type" v={loc.ty} />
          <Stat k="Elevation band (ft)" v={loc.eN != null && loc.eX != null ? `${loc.eN.toLocaleString()}–${loc.eX.toLocaleString()}` : null} />
          <Stat k="USDA zone" v={loc.zo} />
          <Stat k="Sun index" v={loc.su != null ? `${loc.su}` : null} sub="Higher = more annual sun burden" />
        </div>

        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
          <Stat k="Summer high / low (°F)" v={loc.sH != null && loc.sL != null ? `${loc.sH} / ${loc.sL}` : null} />
          <Stat k="Winter high / low (°F)" v={loc.wH != null && loc.wL != null ? `${loc.wH} / ${loc.wL}` : null} />
          <Stat k="Rain (in)" v={loc.ra != null ? `${loc.ra}` : null} sub="Approx. annual" />
          <Stat k="Humidity index" v={loc.hu != null ? `${loc.hu}` : null} />
        </div>

        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
          <Stat k="Air quality" v={loc.aL} sub={loc.aq != null ? `Index ~${loc.aq}` : undefined} />
          <Stat k="Soil / geology" v={loc.so} />
          <Stat k="Nearest regional air" v={loc.nr} />
          <Stat k="Outdoor comfort" v={loc.bm} />
        </div>

        {(rd.bN || rd.wfN || rd.uR) && (
          <div className="rounded-xl border border-amber-100 bg-amber-50/50 px-3 py-2.5">
            <p className="mb-2 flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-amber-900/80">
              <Mountain className="h-3.5 w-3.5" />
              Risk & night-sky context
            </p>
            <div className="grid gap-2 sm:grid-cols-3">
              {rd.bN && (
                <Stat k="Bortle / night sky" v={rd.bN} sub={rd.bo != null ? `Class ${rd.bo}` : undefined} />
              )}
              {rd.wfN && <Stat k="Flood / wash" v={rd.wfN} sub={rd.wf != null ? `Score ${rd.wf}` : undefined} />}
              {rd.uR && <Stat k="Heat / comfort stress" v={rd.uR} sub={rd.ut != null ? `UTCI tier ${rd.ut}` : undefined} />}
            </div>
          </div>
        )}

        {Array.isArray(loc.vg) && loc.vg.length > 0 && (
          <div className="rounded-xl border border-stone-100 bg-white/80 px-3 py-2.5">
            <p className="mb-1.5 flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-stone-500">
              <Leaf className="h-3.5 w-3.5 text-emerald-600" />
              Signature vegetation
            </p>
            <p className="reed-read-wide text-xs text-stone-700">{loc.vg.join(" · ")}</p>
          </div>
        )}

        {bp && (
          <div className="rounded-xl border border-stone-200/90 bg-white px-3 py-3 shadow-inner shadow-stone-100/50">
            <button
              type="button"
              onClick={() => setBpOpen((o) => !o)}
              className="flex w-full items-center justify-between gap-2 text-left"
            >
              <span className="text-[10px] font-bold uppercase tracking-wider text-stone-500">Field narrative</span>
              {bpOpen ? <ChevronUp className="h-4 w-4 text-stone-400" /> : <ChevronDown className="h-4 w-4 text-stone-400" />}
            </button>
            <div
              className={`reed-read mt-2 text-sm text-stone-700 ${bpOpen ? "" : "line-clamp-6"}`}
              style={{ whiteSpace: "pre-line" }}
            >
              {bp}
            </div>
            {!bpOpen && bp.length > 400 && (
              <button type="button" onClick={() => setBpOpen(true)} className="mt-2 text-xs font-semibold text-teal-700 hover:text-teal-900">
                Read full narrative…
              </button>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
