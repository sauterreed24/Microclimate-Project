/** URL-safe id from city name + state */
export function slugifyCityState(name, state) {
  const s = `${name}-${state}`
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
  return s;
}
