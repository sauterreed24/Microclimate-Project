import { ExternalLink, Shield, Sun } from "lucide-react";

export default function MexicoZonePanel({ location }) {
  return (
    <div className="rounded-2xl border border-amber-500/30 bg-gradient-to-br from-amber-950/40 to-zinc-900/80 p-6 shadow-xl backdrop-blur">
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <span className="rounded-full bg-amber-500/20 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-amber-200">
          Mexico zone
        </span>
        <span className="rounded-full bg-emerald-500/15 px-3 py-1 text-xs text-emerald-200">
          Sonora Free Zone — US plates, no TIP
        </span>
      </div>
      <h2 className="font-display text-2xl font-semibold text-white">{location.label}</h2>
      <p className="mt-2 text-sm leading-relaxed text-zinc-300">{location.notes}</p>
      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <div className="rounded-xl border border-white/10 bg-black/20 p-4">
          <div className="mb-2 flex items-center gap-2 text-amber-200">
            <Sun className="h-4 w-4" />
            <span className="text-xs font-bold uppercase tracking-wide">Climate & lifestyle</span>
          </div>
          <p className="text-sm text-zinc-400">
            Sonoran desert to oak woodland transitions; mild winters, hot summers at lower elevations. Ideal for snowbirds and
            bilingual border corridors — verify water, title, and fideicomiso with a Mexican real estate attorney.
          </p>
        </div>
        <div className="rounded-xl border border-white/10 bg-black/20 p-4">
          <div className="mb-2 flex items-center gap-2 text-emerald-200">
            <Shield className="h-4 w-4" />
            <span className="text-xs font-bold uppercase tracking-wide">Price context (USD, rough)</span>
          </div>
          <p className="text-sm text-zinc-400">
            Zillow does not cover Mexico. Typical asking prices vary widely by town — border cities often show modest homes
            from low five figures USD up; colonial hubs and beach markets higher. Cross-check{" "}
            <strong className="text-zinc-200">Vivanuncios</strong> / <strong className="text-zinc-200">Inmuebles24</strong>{" "}
            for live asks; treat as orientation only.
          </p>
        </div>
      </div>
      <div className="mt-5 flex flex-wrap gap-3">
        {(location.resourceLinks || []).map((l) => (
          <a
            key={l.href}
            href={l.href}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-lg border border-white/15 bg-white/5 px-4 py-2 text-sm text-teal-200 transition hover:bg-white/10"
          >
            {l.label}
            <ExternalLink className="h-3.5 w-3.5 opacity-70" />
          </a>
        ))}
      </div>
    </div>
  );
}
