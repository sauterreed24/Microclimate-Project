import { useMemo, useState } from "react";
import { ChevronDown, ChevronRight, MapPin, Star } from "lucide-react";
import { REGION_GROUPS } from "../../data/reeds/locations/index.js";

export default function LocationLibrary({ locationId, onSelect, search }) {
  const [open, setOpen] = useState(() => {
    const o = {};
    REGION_GROUPS.forEach((g) => {
      o[g.key] = g.pinned || g.key.startsWith("az-");
    });
    return o;
  });

  const filteredGroups = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return REGION_GROUPS;
    return REGION_GROUPS.map((g) => ({
      ...g,
      locations: g.locations.filter(
        (l) =>
          l.label.toLowerCase().includes(q) ||
          l.region.toLowerCase().includes(q) ||
          l.state.toLowerCase().includes(q) ||
          l.tags.some((t) => t.includes(q))
      ),
    })).filter((g) => g.locations.length > 0);
  }, [search]);

  return (
    <div className="space-y-2 pb-24">
      {filteredGroups.map((g) => (
        <div key={g.key} className="overflow-hidden rounded-xl border border-white/10 bg-zinc-900/50">
          <button
            type="button"
            onClick={() => setOpen((s) => ({ ...s, [g.key]: !s[g.key] }))}
            className="flex w-full items-center justify-between gap-2 px-3 py-2.5 text-left text-sm font-medium text-zinc-200 hover:bg-white/5"
          >
            <span className="truncate">{g.title}</span>
            {open[g.key] ? <ChevronDown className="h-4 w-4 shrink-0" /> : <ChevronRight className="h-4 w-4 shrink-0" />}
          </button>
          {open[g.key] && (
            <div className="flex flex-col gap-1 border-t border-white/5 px-2 py-2">
              {g.locations.map((l) => {
                const active = l.id === locationId;
                return (
                  <button
                    key={l.id}
                    type="button"
                    onClick={() => onSelect(l.id)}
                    className={`flex items-start gap-2 rounded-lg px-2 py-2 text-left text-xs transition ${
                      active ? "bg-teal-500/20 text-teal-100 ring-1 ring-teal-500/40" : "text-zinc-400 hover:bg-white/5 hover:text-zinc-100"
                    }`}
                  >
                    <span className="mt-0.5 text-base leading-none">{l.flag}</span>
                    <span className="min-w-0 flex-1">
                      <span className="flex items-center gap-1 font-medium">
                        {l.homeStar && <Star className="h-3 w-3 fill-amber-400 text-amber-400" />}
                        {l.label}
                        {l.mexicoZone && (
                          <span className="ml-1 rounded bg-amber-500/20 px-1 text-[9px] uppercase text-amber-200">MX</span>
                        )}
                      </span>
                      <span className="mt-0.5 block text-[10px] text-zinc-500">{l.region}</span>
                    </span>
                    {active && <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0 text-teal-400" />}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
