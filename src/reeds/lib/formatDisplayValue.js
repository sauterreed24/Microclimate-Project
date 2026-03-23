/**
 * Zillow / API payloads often nest address, city, or labels as objects `{ id, name, ... }`.
 * React cannot render plain objects as children — always coerce to display text here.
 */

/**
 * @param {unknown} v
 * @param {string} [fallback]
 * @returns {string}
 */
export function asText(v, fallback = "") {
  if (v == null) return fallback;
  const t = typeof v;
  if (t === "string") return v.trim() || fallback;
  if (t === "number" && Number.isFinite(v)) return String(v);
  if (t === "boolean") return v ? "Yes" : "No";
  if (t === "bigint") return v.toString();
  if (Array.isArray(v)) {
    const parts = v.map((x) => asText(x, "")).filter(Boolean);
    return parts.length ? parts.join(" · ") : fallback;
  }
  if (t === "object") {
    const o = /** @type {Record<string, unknown>} */ (v);
    if (o.streetAddress != null) return asText(o.streetAddress, fallback);
    if (o.line1 != null) return asText(o.line1, fallback);
    if (o.full != null) return asText(o.full, fallback);
    if (o.formatted != null) return asText(o.formatted, fallback);
    if (o.name != null) return asText(o.name, fallback);
    if (o.text != null) return asText(o.text, fallback);
    if (o.label != null) return asText(o.label, fallback);
    if (o.longName != null) return asText(o.longName, fallback);
    if (o.city != null || o.state != null) {
      const line = [asText(o.city, ""), asText(o.state ?? o.stateCode, "")].filter(Boolean).join(", ");
      if (line) return line;
    }
    if (o.value != null && (typeof o.value === "string" || typeof o.value === "number")) return asText(o.value, fallback);
    try {
      return JSON.stringify(o);
    } catch {
      return fallback || "—";
    }
  }
  return String(v);
}

/**
 * @param {unknown} v
 * @returns {string|null}
 */
export function asTextOrNull(v) {
  const s = asText(v, "");
  return s === "" ? null : s;
}
