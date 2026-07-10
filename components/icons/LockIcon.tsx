export default function LockIcon({ size = 16 }: { size?: number }) {
  return (
    <svg
      viewBox="0 0 12 12"
      width={size}
      height={size}
      shapeRendering="crispEdges"
      aria-hidden
    >
      <rect x={3} y={0} width={6} height={2} fill="currentColor" />
      <rect x={2} y={2} width={2} height={2} fill="currentColor" />
      <rect x={8} y={2} width={2} height={2} fill="currentColor" />
      <rect x={2} y={4} width={2} height={2} fill="currentColor" />
      <rect x={8} y={4} width={2} height={2} fill="currentColor" />
      <rect x={1} y={5} width={10} height={7} fill="currentColor" />
    </svg>
  );
}
