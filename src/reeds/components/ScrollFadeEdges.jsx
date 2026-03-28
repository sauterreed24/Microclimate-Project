/**
 * Subtle top/bottom fades so scrollable rails feel “inset” without hiding content.
 */
export default function ScrollFadeEdges({ children, className = "" }) {
  return (
    <div className={`reed-rail-scroll-mask relative flex min-h-0 flex-1 flex-col ${className}`}>
      {children}
    </div>
  );
}
