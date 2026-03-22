# Microclimates — field guide + map

## Google Maps API key (required for the **Map** tab)

1. Copy `.env.example` to **`.env.local`** (this file is gitignored via `*.local`).
2. Add your key:
   ```bash
   VITE_GOOGLE_MAPS_API_KEY=your_key_here
   ```
3. Restart `npm run dev` (defaults to **port 5174** in `vite.config.js`).

**Never commit** `.env.local` or paste your key into source code or chats.

## Homes tab (Zillow data via RapidAPI)

The **Homes** tab shows live listings merged with microclimate insights (Sierra Vista, Hereford, Huachuca Mountains). A small **Express** server (`server/index.js`) calls the **OpenWeb Ninja Real-Time Zillow Data** API on RapidAPI and **caches responses for 15 minutes** to stay within free-tier limits.

1. Subscribe to the API on [RapidAPI](https://rapidapi.com/) and copy your **X-RapidAPI-Key**.
2. Add to `.env`: `RAPIDAPI_KEY=your_key` (same key as `OPENWEB_NINJA_KEY` if you prefer that name).
3. Run frontend + API together:
   ```bash
   npm run dev:all
   ```
   Or run `npm run server` in one terminal and `npm run dev` in another (Vite proxies `/api` → `http://localhost:3001`).

In production, set **`VITE_API_URL`** to your API origin if the SPA is not served from the same host as `/api`.

If the upstream returns **502**, check RapidAPI’s docs for the exact endpoint path and set **`ZILLOW_SEARCH_PATH`** in `.env` if it differs from `/search`.

### Keeping Google Cloud costs low (personal use)

- Google Maps Platform includes a **monthly $200 credit** for many products; light personal use often stays within that, but **Google bills based on usage** — we can’t guarantee “under $1/month” for you.
- In [Google Cloud Console](https://console.cloud.google.com/):
  - **Restrict the API key**: Application restrictions → **HTTP referrers** (add `http://localhost:5174/*` for dev and your production domain later). API restrictions → enable only **Maps JavaScript API** (and only what you need).
  - **Set budgets & alerts**: Billing → **Budgets & alerts** so you get emailed before charges grow.
  - **Quotas**: APIs & Services → Maps JavaScript API → **Quotas** — set sensible caps if you want a hard ceiling (may cause the map to stop loading if exceeded).
- This app only loads the map when you open the **Map** tab, which reduces unnecessary API use compared to always-on maps.

### Arizona / Sonora location pack

- Bulk **Arizona** municipalities (plus selected CDPs and reference cards for Phoenix & Tucson) and **Sonora** border / tourist-corridor towns are defined in **`src/data/arizonaSonoraPack.js`** with long-form narrative templates in **`src/data/arizonaSonoraRichDefaults.js`**, merged at runtime (`MC` + `RD`). Each pack location includes a **Climate outlook** section (`out` field) with multi-decade regional themes (not parcel-level predictions).
- Mexico travel notes in the app are **not legal advice** — confirm **FMM**, insurance, and current **vehicle / Sonora-only** rules with official sources before driving.

---

# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
