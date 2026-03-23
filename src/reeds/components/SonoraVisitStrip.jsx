import { useState } from "react";
import { ChevronDown, ChevronUp, Plane } from "lucide-react";
import { SONORA_MEXICO } from "../../data/reeds/locations/mexico.js";

/** Compact, Mexico-forward visiting context — optimized for Sonora border & free zone trips. */
export default function SonoraVisitStrip() {
  const [open, setOpen] = useState(true);
  return (
    <div className="rounded-xl border border-amber-200/90 bg-gradient-to-r from-amber-50/95 to-orange-50/80 p-3 shadow-sm ring-1 ring-amber-100/70">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between gap-2 text-left"
      >
        <span className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-wide text-amber-950">
          <Plane className="h-4 w-4 text-amber-700" />
          Visiting Sonora (Mexico) — quick context
        </span>
        {open ? <ChevronUp className="h-4 w-4 text-amber-700" /> : <ChevronDown className="h-4 w-4 text-amber-700" />}
      </button>
      {open && (
        <div className="mt-2 space-y-2 text-[11px] leading-snug text-amber-950/90">
          <p>
            <strong>Zillow does not list Mexico homes here.</strong> Use the violet <strong>Sonora</strong> pins on the map for travel, climate, and border context. For property shopping in MX, use{" "}
            <strong>Vivanuncios</strong> / <strong>Inmuebles24</strong> and verify title with a local attorney.
          </p>
          <ul className="list-inside list-disc text-[10px] text-amber-900/85">
            <li>Free Zone / FMM / insurance rules change — confirm before driving.</li>
            <li>Border towns: Nogales, Agua Prieta, Sonoyta / Lukeville corridor, Rocky Point route.</li>
          </ul>
          <p className="text-[10px] text-amber-800/80">
            Reference towns in app: {SONORA_MEXICO.slice(0, 6).map((x) => x.label.split(",")[0]).join(" · ")}
            …
          </p>
        </div>
      )}
    </div>
  );
}
