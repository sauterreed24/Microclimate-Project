import { useEffect, useRef } from "react";
import { X } from "lucide-react";

const ROWS = [
  { keys: ["/"], desc: "Focus the market / town search in the sidebar" },
  { keys: ["?"], desc: "Open this shortcuts panel" },
  { keys: ["Esc"], desc: "Close this panel or a listing detail modal" },
  { keys: ["Tab"], desc: "Move focus through buttons, filters, and cards" },
];

/**
 * Lightweight help overlay — keeps power users oriented without cluttering the chrome.
 */
export default function KeyboardShortcutsDialog({ open, onClose }) {
  const panelRef = useRef(null);
  const closeBtnRef = useRef(null);
  const primaryRef = useRef(null);

  useEffect(() => {
    if (!open) return undefined;
    const t = window.setTimeout(() => primaryRef.current?.focus(), 50);
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.clearTimeout(t);
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  useEffect(() => {
    if (!open) return undefined;
    const root = panelRef.current;
    if (!root) return undefined;
    const focusables = root.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const list = [...focusables].filter((el) => !el.hasAttribute("disabled"));
    if (list.length === 0) return undefined;
    const onTrap = (e) => {
      if (e.key !== "Tab") return;
      const first = list[0];
      const last = list[list.length - 1];
      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault();
          last.focus();
        }
      } else if (document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    root.addEventListener("keydown", onTrap);
    return () => root.removeEventListener("keydown", onTrap);
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-end justify-center p-4 sm:items-center" role="presentation">
      <button
        type="button"
        className="absolute inset-0 bg-slate-950/55 backdrop-blur-[2px]"
        aria-label="Close shortcuts"
        onClick={onClose}
      />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="reed-shortcuts-title"
        className="relative z-10 w-full max-w-md overflow-hidden rounded-2xl border border-violet-200/90 bg-gradient-to-b from-white via-violet-50/30 to-white shadow-2xl shadow-violet-950/20 ring-1 ring-violet-100/80"
      >
        <div className="flex items-start justify-between gap-3 border-b border-violet-100/90 bg-white/80 px-4 py-3 backdrop-blur-sm">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-violet-600">Quick help</p>
            <h2 id="reed-shortcuts-title" className="font-display text-lg font-semibold text-stone-900">
              Keyboard & focus
            </h2>
          </div>
          <button
            ref={closeBtnRef}
            type="button"
            onClick={onClose}
            className="rounded-xl p-2 text-stone-400 transition hover:bg-violet-100/80 hover:text-stone-800"
            aria-label="Close shortcuts"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <ul className="max-h-[min(60vh,320px)] space-y-0 divide-y divide-stone-100 overflow-y-auto px-2 py-2">
          {ROWS.map((row) => (
            <li key={row.desc} className="flex gap-3 px-2 py-3">
              <div className="flex shrink-0 flex-wrap gap-1">
                {row.keys.map((k) => (
                  <kbd
                    key={k}
                    className="inline-flex min-w-[1.75rem] items-center justify-center rounded-md border border-stone-200 bg-stone-50 px-2 py-1 font-mono text-[11px] font-semibold text-stone-700 shadow-sm"
                  >
                    {k}
                  </kbd>
                ))}
              </div>
              <p className="text-sm leading-snug text-stone-600">{row.desc}</p>
            </li>
          ))}
        </ul>
        <div className="flex flex-wrap items-center justify-end gap-2 border-t border-stone-100 bg-stone-50/80 px-4 py-3">
          <button
            ref={primaryRef}
            type="button"
            onClick={onClose}
            className="rounded-xl bg-gradient-to-r from-violet-600 to-teal-600 px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-violet-900/20 transition hover:brightness-105"
          >
            Got it
          </button>
        </div>
        <p className="border-t border-stone-100 px-4 py-2.5 text-[11px] leading-relaxed text-stone-500">
          Use <strong className="text-stone-700">Explore</strong> for map + list together, <strong className="text-stone-700">Refresh</strong> after changing API keys.
        </p>
      </div>
    </div>
  );
}
