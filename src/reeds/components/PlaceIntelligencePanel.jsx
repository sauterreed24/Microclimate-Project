import { BookOpen, ExternalLink, LineChart, Shield, Sparkles } from "lucide-react";
import {
  COMPETITOR_LANDSCAPE,
  HOMEBUYING_PLAYBOOK,
  PRICING_TRENDS_GUIDE,
  buildExternalSearchUrls,
  getRegionalHomebuyingNarrative,
} from "../data/placeIntelligence.js";

export default function PlaceIntelligencePanel({ location }) {
  const urls = buildExternalSearchUrls(location || {});
  const narrative = getRegionalHomebuyingNarrative(location || {});

  return (
    <section
      className="space-y-4 rounded-2xl border border-stone-200/90 bg-white/95 p-4 shadow-md shadow-stone-200/40 ring-1 ring-stone-100"
      aria-label="Place intelligence and home search education"
    >
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-stone-100 pb-2">
        <h2 className="font-display flex items-center gap-2 text-base font-semibold text-stone-900">
          <Sparkles className="h-4 w-4 text-amber-600" aria-hidden />
          Place intelligence & home search
        </h2>
        <p className="max-w-md text-[11px] leading-relaxed text-stone-500">
          Depth we can own without a feed: education, terrain context, and honest links out for live inventory.
        </p>
      </div>

      <div className="rounded-xl border border-amber-100 bg-amber-50/50 px-3 py-2.5 text-sm leading-relaxed text-stone-800 ring-1 ring-amber-100/80">
        <strong className="text-amber-950">This area in practice — </strong>
        {narrative}
      </div>

      <div className="grid gap-3 lg:grid-cols-2">
        <div className="rounded-xl border border-violet-100 bg-violet-50/40 p-3 ring-1 ring-violet-100/60">
          <h3 className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-violet-900">
            <Shield className="h-3.5 w-3.5" aria-hidden />
            What big portals often omit
          </h3>
          <ul className="mt-2 space-y-1.5 text-[12px] leading-relaxed text-violet-950/90">
            {COMPETITOR_LANDSCAPE.realEstate.slice(0, 3).map((t) => (
              <li key={t} className="border-l-2 border-violet-300 pl-2">
                {t}
              </li>
            ))}
          </ul>
          <p className="mt-2 text-[11px] text-violet-800/85">Weather & climate apps push AQI, fire, and hyperlocal radar — we fold that mindset into where you&apos;d actually live.</p>
        </div>

        <div className="rounded-xl border border-sky-100 bg-sky-50/40 p-3 ring-1 ring-sky-100/60">
          <h3 className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-sky-900">
            <LineChart className="h-3.5 w-3.5" aria-hidden />
            {PRICING_TRENDS_GUIDE.title}
          </h3>
          <ul className="mt-2 space-y-1 text-[12px] leading-relaxed text-sky-950/90">
            {PRICING_TRENDS_GUIDE.body.map((t) => (
              <li key={t}>• {t}</li>
            ))}
          </ul>
          <div className="mt-2 flex flex-wrap gap-2">
            {PRICING_TRENDS_GUIDE.links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 rounded-lg border border-sky-200 bg-white px-2 py-1 text-[11px] font-medium text-sky-900 hover:bg-sky-50"
              >
                {l.label}
                <ExternalLink className="h-3 w-3 opacity-70" aria-hidden />
              </a>
            ))}
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-stone-200 bg-stone-50/60 p-3">
        <h3 className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-stone-700">
          <BookOpen className="h-3.5 w-3.5" aria-hidden />
          Field checklist
        </h3>
        <div className="mt-2 grid gap-3 sm:grid-cols-3">
          {HOMEBUYING_PLAYBOOK.map((block) => (
            <div key={block.title}>
              <p className="text-[11px] font-semibold text-stone-900">{block.title}</p>
              <ul className="mt-1 space-y-1 text-[11px] leading-relaxed text-stone-600">
                {block.items.map((i) => (
                  <li key={i}>• {i}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="mb-2 text-xs font-bold uppercase tracking-wide text-stone-600">Live inventory — open in a new tab</h3>
        <div className="flex flex-wrap gap-2">
          <a
            href={urls.zillow}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 rounded-xl border border-stone-200 bg-white px-3 py-2 text-xs font-semibold text-stone-800 shadow-sm hover:border-teal-300 hover:bg-teal-50/50"
          >
            Zillow
            <ExternalLink className="h-3.5 w-3.5 opacity-60" aria-hidden />
          </a>
          <a
            href={urls.redfin}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 rounded-xl border border-stone-200 bg-white px-3 py-2 text-xs font-semibold text-stone-800 shadow-sm hover:border-rose-200 hover:bg-rose-50/40"
          >
            Redfin
            <ExternalLink className="h-3.5 w-3.5 opacity-60" aria-hidden />
          </a>
          <a
            href={urls.realtor}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 rounded-xl border border-stone-200 bg-white px-3 py-2 text-xs font-semibold text-stone-800 shadow-sm hover:border-blue-200 hover:bg-blue-50/40"
          >
            Realtor.com
            <ExternalLink className="h-3.5 w-3.5 opacity-60" aria-hidden />
          </a>
          <a
            href={urls.maps}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 rounded-xl border border-stone-200 bg-white px-3 py-2 text-xs font-semibold text-stone-800 shadow-sm hover:border-emerald-200 hover:bg-emerald-50/40"
          >
            Google Maps
            <ExternalLink className="h-3.5 w-3.5 opacity-60" aria-hidden />
          </a>
        </div>
        <p className="mt-2 text-[10px] leading-relaxed text-stone-500">
          We don&apos;t replace MLS feeds — use these for contracts, comps, and agent relationships. Our atlas is for climate, risk, and orientation.
        </p>
      </div>
    </section>
  );
}
