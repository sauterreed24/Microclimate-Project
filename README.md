# Microclimates — field guide + map

## Google Maps API key (required for the **Map** tab)

1. Copy `.env.example` to **`.env.local`** (this file is gitignored via `*.local`).
2. Add your key:
   ```bash
   VITE_GOOGLE_MAPS_API_KEY=your_key_here
   ```
3. Restart `npm run dev`.

**Never commit** `.env.local` or paste your key into source code or chats.

### Keeping Google Cloud costs low (personal use)

- Google Maps Platform includes a **monthly $200 credit** for many products; light personal use often stays within that, but **Google bills based on usage** — we can’t guarantee “under $1/month” for you.
- In [Google Cloud Console](https://console.cloud.google.com/):
  - **Restrict the API key**: Application restrictions → **HTTP referrers** (add `http://localhost:5173/*` for dev and your production domain later). API restrictions → enable only **Maps JavaScript API** (and only what you need).
  - **Set budgets & alerts**: Billing → **Budgets & alerts** so you get emailed before charges grow.
  - **Quotas**: APIs & Services → Maps JavaScript API → **Quotas** — set sensible caps if you want a hard ceiling (may cause the map to stop loading if exceeded).
- This app only loads the map when you open the **Map** tab, which reduces unnecessary API use compared to always-on maps.

### Arizona / Sonora location pack

- Bulk **Arizona** municipalities (plus selected CDPs and reference cards for Phoenix & Tucson) and **Sonora** border / tourist-corridor towns are defined in **`src/data/arizonaSonoraPack.js`** and merged into the main catalog at runtime (`MC` + `RD`).
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
