import { useMemo, useState } from "react";
import { ChevronDown, ChevronRight, MapPin } from "lucide-react";
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
        <div key={g.key} className="overflow-hidden rounded-xl border border-stone-200/90 bg-white shadow-sm">
          <button
            type="button"
            onClick={() => setOpen((s) => ({ ...s, [g.key]: !s[g.key] }))}
            className="flex w-full items-center justify-between gap-2 px-3 py-2.5 text-left text-sm font-medium text-stone-800 hover:bg-stone-50"
          >
            <span className="truncate">{g.title}</span>
            {open[g.key] ? <ChevronDown className="h-4 w-4 shrink-0 text-stone-400" /> : <ChevronRight className="h-4 w-4 shrink-0 text-stone-400" />}
          </button>
          {open[g.key] && (
            <div className="flex flex-col gap-0.5 border-t border-stone-100 px-2 py-2">
              {g.locations.map((l) => {
                const active = l.id === locationId;
                return (
                  <button
                    key={l.id}
                    type="button"
                    onClick={() => onSelect(l.id)}
                    className={`flex items-start gap-2 rounded-lg px-2 py-2 text-left text-xs transition ${
                      active
                        ? "bg-teal-50 text-teal-900 ring-1 ring-teal-200/80"
                        : "text-stone-600 hover:bg-stone-50 hover:text-stone-900"
                    }`}
                  >
                    <span className="mt-0.5 text-base leading-none">{l.flag}</span>
                    <span className="min-w-0 flex-1">
                      <span className="font-medium">{l.label}</span>
                      <span className="mt-0.5 block text-[10px] text-stone-500">{l.region}</span>
                    </span>
                    {active && <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0 text-teal-600" />}
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
