import AppErrorBoundary from "./reeds/components/AppErrorBoundary.jsx";
import ReedsHomeFinder from "./reeds/ReedsHomeFinder.jsx";

/** Saguaro Atlas (microclimate-first). Legacy full-screen microclimate UI: `App.microclimate.backup.jsx` */
export default function App() {
  return (
    <AppErrorBoundary>
      <ReedsHomeFinder />
    </AppErrorBoundary>
  );
}
