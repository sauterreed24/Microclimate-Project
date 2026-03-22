/**
 * Proxied to Express in dev (vite.config.js).
 * Production: set VITE_API_URL to your API origin if the app is static-hosted elsewhere.
 */
function apiUrl(pathWithQuery) {
  const base = import.meta.env.VITE_API_URL || "";
  if (!base) return pathWithQuery;
  return `${String(base).replace(/\/$/, "")}${pathWithQuery.startsWith("/") ? pathWithQuery : `/${pathWithQuery}`}`;
}

export async function fetchHomesListings(mcId, page = 1, limit = 8) {
  const qs = new URLSearchParams({
    mcId: String(mcId),
    page: String(page),
    limit: String(limit),
  });
  const res = await fetch(apiUrl(`/api/homes/listings?${qs}`));
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const err = new Error(data.error || res.statusText || "Homes API error");
    err.code = data.code;
    err.status = res.status;
    throw err;
  }
  return data;
}

export async function fetchHomesMarkets() {
  const res = await fetch(apiUrl("/api/homes/markets"), { method: "GET" });
  if (!res.ok) throw new Error("Markets unavailable");
  return res.json();
}
