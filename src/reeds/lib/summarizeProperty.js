/**
 * Pull human-readable fields from messy nested API JSON.
 */
export function summarizePropertyDetail(raw) {
  if (!raw || typeof raw !== "object") return null;

  const pick = (o) => {
    if (!o || typeof o !== "object") return {};
    const keys = ["yearBuilt", "bedrooms", "bathrooms", "livingArea", "lotSize", "lotAreaSquareFeet", "homeType"];
    const out = {};
    for (const k of keys) {
      if (o[k] != null && typeof o[k] !== "object") out[k] = o[k];
    }
    return out;
  };

  const rf = raw.resoFacts || raw.data?.resoFacts || raw.property?.resoFacts;
  const a = { ...pick(raw), ...pick(rf) };
  if (rf && typeof rf === "object") {
    if (rf.yearBuilt != null) a.yearBuilt = rf.yearBuilt;
    if (rf.bedrooms != null) a.bedrooms = rf.bedrooms;
    if (rf.bathrooms != null) a.bathrooms = rf.bathrooms;
    if (rf.livingArea != null) a.livingArea = rf.livingArea;
  }

  const entries = Object.entries(a).filter(([, v]) => v != null && v !== "");
  return entries.length ? Object.fromEntries(entries) : null;
}
