# Reed's Home Finder — architecture

**Markets in the app:** Arizona, California, and New Mexico only (no Indiana / Greenwood or other states in the location picker).

## What runs where

| Script | Purpose |
|--------|---------|
| `npm run dev` | **Vite (5174) + Reed API (3001)** — use this so `/api` proxy works. |
| `npm run dev:web` | Vite only; run `npm run api` in another terminal or listings show “cannot reach API”. |
| `npm run api` | **Reed's** backend: `backend/index.js` — `ZILLOW_API_KEY` in `backend/.env`. |
| `npm run dev:reed` | Alias for `npm run dev`. |
| `npm run server` | **Legacy** microclimate proxy (`server/index.js`). Don’t use with Reed `api` on the same `PORT`. |

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
