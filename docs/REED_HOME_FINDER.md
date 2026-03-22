# Reed's Home Finder — architecture

**Markets in the app:** Arizona, California, and New Mexico only (no Indiana / Greenwood or other states in the location picker).

## What runs where

| Script | Purpose |
|--------|---------|
| `npm run dev` | Vite dev server (default port **5174**). Proxies `/api/*` → `http://localhost:3001`. |
| `npm run api` | **Reed's** backend: `backend/index.js` — proxies OpenWeb Ninja with `ZILLOW_API_KEY` from `backend/.env`. |
| `npm run dev:reed` | Runs **both** Vite + `api` (use this for daily home search). |
| `npm run server` | **Legacy** microclimate RapidAPI proxy (`server/index.js`). Don’t run with `api` on the same `PORT`. |

Root `server.js` is an alternate experiment; **Reed's app uses `backend/index.js`**.

## Accidental duplicate commits / reviews

If Git or the IDE created extra commits or merge noise, use `git log --oneline` and `git status` to confirm a clean tree. This doc is the source of truth for which server process Reed's UI expects.

## Personal data

- Preferences and **favorite listings (zpid)** persist in **localStorage** under `reed-home-finder-v1`.
- API keys stay in **`backend/.env`** only; the browser never sees them.

## UX shortcuts

- **`/`** focuses the location filter (when not typing in an input).
- **`Escape`** closes the property modal.
- **Hearts** on cards save favorites locally.
