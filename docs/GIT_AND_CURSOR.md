# Git + Cursor: commit, push, troubleshoot

## If the **Commit** button is grayed out

1. **Save all files** — `Ctrl+K` then `S`, or **File → Save All**. Unsaved edits don’t count as changes Git can commit.
2. **Stage** — click `+` next to each file in Source Control, or run:
   ```powershell
   git add -A
   ```
3. **Commit** — then use Commit, or run:
   ```powershell
   git commit -m "your message"
   ```
4. **Push**:
   ```powershell
   git push origin main
   ```

## Quick health check (after pull)

```powershell
cd path\to\Microclimate-Project
git status
npm install
npm run dev
```

App: **http://localhost:5174/** (see `vite.config.js` if the port differs).

## Remote

Default GitHub remote: `origin` → your repo URL (`git remote -v` to confirm).
