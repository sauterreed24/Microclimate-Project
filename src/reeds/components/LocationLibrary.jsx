import { useMemo, useState, useEffect } from "react";
import { ChevronDown, ChevronRight, Cloud, MapPin } from "lucide-react";
import { MICROCLIMATE_GROUPS, REGION_GROUPS } from "../../data/reeds/locations/index.js";

export default function LocationLibrary({ locationId, onSelect, search }) {
  const [browseMode, setBrowseMode] = useState("microclimate");

  const groups = browseMode === "microclimate" ? MICROCLIMATE_GROUPS : REGION_GROUPS;

  const [open, setOpen] = useState({});

  useEffect(() => {
    setOpen((prev) => {
      const next = { ...prev };
      let changed = false;
      for (const g of groups) {
        if (next[g.key] === undefined) {
          next[g.key] = !!g.pinned;
          changed = true;
        }
      }
      return changed ? next : prev;
    });
  }, [groups]);

  const filteredGroups = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return groups;
    return groups
      .map((g) => ({
        ...g,
        locations: g.locations.filter((l) => {
          const mc = (l.microclimateProfile || "").toLowerCase();
          return (
            l.label.toLowerCase().includes(q) ||
            l.region.toLowerCase().includes(q) ||
            l.state.toLowerCase().includes(q) ||
            mc.includes(q) ||
            l.tags.some((t) => t.includes(q))
          );
        }),
      }))
      .filter((g) => g.locations.length > 0);
  }, [search, groups]);

  return (
    <div className="space-y-3 pb-24">
      <div className="flex rounded-xl border border-stone-200 bg-stone-50/90 p-0.5 shadow-inner">
        <button
          type="button"
          onClick={() => setBrowseMode("microclimate")}
          className={`flex flex-1 items-center justify-center gap-1.5 rounded-lg px-2 py-2 text-[11px] font-semibold transition ${
            browseMode === "microclimate" ? "bg-white text-teal-900 shadow-sm ring-1 ring-stone-200" : "text-stone-500 hover:text-stone-800"
          }`}
        >
          <Cloud className="h-3.5 w-3.5" />
          By microclimate
        </button>
        <button
          type="button"
          onClick={() => setBrowseMode("region")}
          className={`flex flex-1 items-center justify-center gap-1.5 rounded-lg px-2 py-2 text-[11px] font-semibold transition ${
            browseMode === "region" ? "bg-white text-teal-900 shadow-sm ring-1 ring-stone-200" : "text-stone-500 hover:text-stone-800"
          }`}
        >
          <MapPin className="h-3.5 w-3.5" />
          By state & region
        </button>
      </div>

      <p className="text-[10px] leading-snug text-stone-500">
        {browseMode === "microclimate"
          ? "Territories grouped by similar climate mechanics across AZ · CA · NM — pick a profile, then a town."
          : "Classic geography: state corridors and metros."}
      </p>

      <div className="space-y-2">
        {filteredGroups.map((g) => (
          <div key={g.key} className="overflow-hidden rounded-xl border border-stone-200/90 bg-white shadow-sm">
            <button
              type="button"
              onClick={() => setOpen((s) => ({ ...s, [g.key]: !s[g.key] }))}
              className="flex w-full items-center justify-between gap-2 px-3 py-2.5 text-left text-sm font-medium text-stone-800 hover:bg-stone-50"
            >
              <span className="min-w-0 flex-1">
                <span className="block truncate">{g.title}</span>
                {g.subtitle && browseMode === "microclimate" && (
                  <span className="mt-0.5 line-clamp-2 block text-[10px] font-normal text-stone-500">{g.subtitle}</span>
                )}
              </span>
              {open[g.key] ? <ChevronDown className="h-4 w-4 shrink-0 text-stone-400" /> : <ChevronRight className="h-4 w-4 shrink-0 text-stone-400" />}
            </button>
            {open[g.key] && (
              <div className="flex max-h-[min(55vh,420px)] flex-col gap-0.5 overflow-y-auto border-t border-stone-100 px-2 py-2">
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
                        <span className="mt-0.5 block text-[10px] text-stone-500">
                          {browseMode === "microclimate" ? `${l.state} · ${l.region}` : l.region}
                        </span>
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
    </div>
  );
}
