import { Droplets, Globe2, Mountain, Radio, Shield, Zap } from "lucide-react";
import {
  LONG_HORIZON_PLAYBOOK,
  RESILIENCE_DIMENSIONS,
  buildResilienceLookupUrls,
  crossRefMicroclimateToResilience,
} from "../data/resilienceIndex.js";

const ICONS = {
  "elevation-weather": Mountain,
  "energy-grid": Zap,
  broadband: Radio,
  water: Droplets,
  "long-horizon": Globe2,
};

export default function ResilienceIndexPanel({ location, microBundle }) {
  const links = buildResilienceLookupUrls(location || {});
  const cross = crossRefMicroclimateToResilience(microBundle);

  const linkPills = [
    { label: "FCC broadband map", href: links.fccBroadband, hint: "Street-level fixed & mobile" },
    { label: "EIA state energy", href: links.eiaState, hint: "Retail power, fuel mix" },
    { label: "NOAA climate normals", href: links.noaaNormals, hint: "Baseline weather" },
    { label: "FEMA flood maps", href: links.femaFlood, hint: "NFHL layers" },
    { label: "EPA drinking water", href: links.epaWater, hint: "Reg programs" },
    { label: "USGS water", href: links.usgsWater, hint: "Aquifers & drought science" },
    { label: "DSIRE incentives", href: links.dsire, hint: "Solar / storage rules" },
    { label: "FRED (macro)", href: links.fred, hint: "Rates & prices" },
    { label: "BLS geography", href: links.blsGeo, hint: "Local employment" },
    { label: "Verify on map", href: links.mapsPin, hint: "Lat/lng sanity check" },
  ];

  return (
    <section
      className="rounded-2xl border border-teal-200/70 bg-gradient-to-b from-white to-teal-50/30 p-4 shadow-md shadow-teal-900/5 ring-1 ring-teal-100/80"
      aria-label="Localized resilience index and live data lookups"
    >
      <div className="flex flex-wrap items-start justify-between gap-2 border-b border-teal-100/90 pb-3">
        <div>
          <h2 className="font-display flex items-center gap-2 text-base font-semibold text-stone-900">
            <Shield className="h-4 w-4 text-teal-700" aria-hidden />
            Localized resilience index
          </h2>
          <p className="mt-1 max-w-3xl text-[11px] leading-relaxed text-stone-600">
            Cross-references this market&apos;s atlas signals with <strong className="text-stone-800">authoritative tools</strong> — not a single vendor score. Real-time
            electricity rates, broadband, and water conditions change; use the links for current data.
          </p>
        </div>
      </div>

      <div className="mt-3 rounded-xl border border-stone-200 bg-white/90 p-3 ring-1 ring-stone-100/80">
        <h3 className="text-[10px] font-bold uppercase tracking-wider text-teal-800">Atlas ↔ resilience cross-check</h3>
        <ul className="mt-2 space-y-2 text-[12px] leading-relaxed text-stone-800">
          {cross.bullets.map((b) => (
            <li key={b} className="border-l-2 border-teal-400 pl-2">
              {b}
            </li>
          ))}
        </ul>
        {cross.tags.length > 0 && (
          <p className="mt-2 text-[10px] text-stone-500">
            Tags: {cross.tags.join(" · ")}
          </p>
        )}
      </div>

      <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
        {RESILIENCE_DIMENSIONS.map((d) => {
          const Glyph = ICONS[d.id] || Mountain;
          return (
            <div
              key={d.id}
              className="rounded-xl border border-stone-200/90 bg-white/95 p-3 shadow-sm ring-1 ring-stone-100/60"
            >
              <div className="flex items-center gap-2 text-xs font-semibold text-stone-900">
                <Glyph className="h-3.5 w-3.5 shrink-0 text-teal-600" aria-hidden />
                {d.title}
              </div>
              <p className="mt-1.5 text-[11px] leading-relaxed text-stone-600">{d.summary}</p>
            </div>
          );
        })}
      </div>

      <div className="mt-4 rounded-xl border border-amber-200/80 bg-amber-50/50 p-3 ring-1 ring-amber-100/70">
        <h3 className="text-xs font-bold uppercase tracking-wide text-amber-950">{LONG_HORIZON_PLAYBOOK.title}</h3>
        {LONG_HORIZON_PLAYBOOK.paragraphs.map((p) => (
          <p key={p} className="mt-2 text-[11px] leading-relaxed text-amber-950/95">
            {p}
          </p>
        ))}
      </div>

      <div className="mt-4">
        <h3 className="mb-2 text-[10px] font-bold uppercase tracking-wider text-stone-500">Live & official lookups</h3>
        <div className="flex flex-wrap gap-2">
          {linkPills.map((p) => (
            <a
              key={p.href + p.label}
              href={p.href}
              target="_blank"
              rel="noreferrer"
              title={p.hint}
              className="inline-flex flex-col rounded-lg border border-stone-200 bg-white px-2.5 py-1.5 text-left shadow-sm transition hover:border-teal-300 hover:bg-teal-50/50"
            >
              <span className="text-[11px] font-semibold text-stone-900">{p.label}</span>
              <span className="text-[9px] text-stone-500">{p.hint}</span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
