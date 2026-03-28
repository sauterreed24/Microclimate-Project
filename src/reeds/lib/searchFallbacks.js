/**
 * Alternate location strings for Zillow-shaped search when the primary `searchQuery`
 * returns zero listings (upstream parsing quirks, punctuation, or metro naming).
 * @param {{ searchQuery?: string, label?: string } | null | undefined} loc
 * @returns {string[]}
 */
export function locationSearchFallbacks(loc) {
  if (!loc || typeof loc !== "object") return [];
  const out = [];
  const seen = new Set();

  const push = (s) => {
    const t = String(s ?? "").trim();
    if (t.length < 2) return;
    const key = t.toLowerCase();
    if (seen.has(key)) return;
    seen.add(key);
    out.push(t);
  };

  push(loc.searchQuery);
  push(loc.label);

  const primary = String(loc.searchQuery || loc.label || "").trim();
  const comma = primary.match(/^([^,]+),\s*([A-Za-z]{2})\s*$/);
  if (comma) {
    const city = comma[1].trim();
    const st = comma[2].trim().toUpperCase();
    push(`${city} ${st}`);
    push(`${city}, ${st}`);
  }

  return out;
}
