/** Synthetic monthly climate rows from location scalars (display / UX — not a substitute for NOAA normals). */
export function genM(sH, sL, wH, wL, r, h) {
  const c = [0, 0.05, 0.2, 0.4, 0.65, 0.85, 1, 0.95, 0.75, 0.5, 0.25, 0.08];
  const rc = [0.55, 0.45, 0.5, 0.75, 0.95, 1, 0.75, 0.8, 1, 0.85, 0.7, 0.6];
  const mn = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  return mn.map((m, i) => {
    const t = c[i];
    const hi = Math.round(wH + (sH - wH) * t);
    const lo = Math.round(wL + (sL - wL) * t);
    return {
      m,
      hi,
      lo,
      felt: Math.round(hi + (h > 70 ? 5 : h > 55 ? 2 : h < 30 ? -6 : -2) + (i >= 5 && i <= 8 ? 3 : -2)),
      rain: Math.round((r / 12) * rc[i] * 10) / 10,
    };
  });
}

export const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
