import { Component } from "react";

/**
 * Prevents a single render error from blanking the whole app (common with map libs on weak GPUs).
 */
export default class AppErrorBoundary extends Component {
  state = { err: null };

  static getDerivedStateFromError(err) {
    return { err };
  }

  componentDidCatch(err, info) {
    console.error("App error boundary:", err, info?.componentStack);
  }

  render() {
    if (this.state.err) {
      const msg =
        this.state.err && typeof this.state.err === "object" && "message" in this.state.err
          ? String(this.state.err.message)
          : String(this.state.err);
      return (
        <div className="min-h-screen bg-gradient-to-b from-stone-100 to-stone-50 p-6 text-stone-800">
          <div className="mx-auto max-w-lg rounded-2xl border border-stone-200 bg-white p-6 shadow-xl shadow-stone-200/80 ring-1 ring-stone-100">
            <h1 className="font-display text-xl font-semibold text-stone-900">Let’s reset this screen</h1>
            <p className="mt-3 text-sm leading-relaxed text-stone-600">
              Something in the layout hit a snag (often a data shape from the listings API). Your work is safe — a refresh usually fixes it. Maps also fall back to a lighter mode automatically when needed.
            </p>
            <ul className="mt-4 list-inside list-disc space-y-1 text-sm text-stone-600">
              <li>Click reload below</li>
              <li>If it happens again, try List view before Map</li>
              <li>Check the browser console (F12) for details</li>
            </ul>
            <pre className="mt-4 max-h-28 overflow-auto rounded-xl bg-stone-50 p-3 font-mono text-[11px] leading-snug text-red-900/90 ring-1 ring-stone-100">{msg}</pre>
            <button
              type="button"
              className="mt-5 w-full rounded-xl bg-teal-600 px-4 py-3 text-sm font-semibold text-white shadow-md shadow-teal-900/15 transition hover:bg-teal-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-2"
              onClick={() => window.location.reload()}
            >
              Reload page
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
