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
      return (
        <div className="min-h-screen bg-stone-100 p-6 text-stone-800">
          <div className="mx-auto max-w-lg rounded-2xl border border-stone-200 bg-white p-6 shadow-lg">
            <h1 className="font-display text-lg font-semibold text-stone-900">Something went wrong</h1>
            <p className="mt-2 text-sm text-stone-600">
              The UI crashed. This sometimes happens with map or chart features on low-memory devices. Try reloading — maps will fall back to a lighter mode when needed.
            </p>
            <pre className="mt-4 max-h-32 overflow-auto rounded-lg bg-stone-50 p-3 text-xs text-red-800">{String(this.state.err)}</pre>
            <button
              type="button"
              className="mt-4 rounded-xl bg-teal-600 px-4 py-2 text-sm font-semibold text-white hover:bg-teal-700"
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
