import AppErrorBoundary from "./reeds/components/AppErrorBoundary.jsx";
import ReedsHomeFinder from "./reeds/ReedsHomeFinder.jsx";

/** Reed's Home Finder — primary app. Previous microclimate UI: `App.microclimate.backup.jsx` */
export default function App() {
  return (
    <AppErrorBoundary>
      <ReedsHomeFinder />
    </AppErrorBoundary>
  );
}
