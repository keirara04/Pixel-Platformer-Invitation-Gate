export default function CloseIcon({ size = 14 }: { size?: number }) {
  return (
    <svg
      viewBox="0 0 8 8"
      width={size}
      height={size}
      shapeRendering="crispEdges"
      aria-hidden
    >
      <rect x={0} y={0} width={2} height={2} fill="currentColor" />
      <rect x={2} y={2} width={2} height={2} fill="currentColor" />
      <rect x={4} y={4} width={2} height={2} fill="currentColor" />
      <rect x={6} y={6} width={2} height={2} fill="currentColor" />
      <rect x={6} y={0} width={2} height={2} fill="currentColor" />
      <rect x={4} y={2} width={2} height={2} fill="currentColor" />
      <rect x={2} y={4} width={2} height={2} fill="currentColor" />
      <rect x={0} y={6} width={2} height={2} fill="currentColor" />
    </svg>
  );
}
