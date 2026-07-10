export default function ReplayIcon({ size = 14 }: { size?: number }) {
  return (
    <svg
      viewBox="0 0 16 16"
      width={size}
      height={size}
      shapeRendering="crispEdges"
      aria-hidden
      className="inline-block align-[-2px] mr-1"
    >
      <rect x={3} y={2} width={2} height={2} fill="currentColor" />
      <rect x={2} y={4} width={2} height={2} fill="currentColor" />
      <rect x={1} y={6} width={2} height={4} fill="currentColor" />
      <rect x={2} y={10} width={2} height={2} fill="currentColor" />
      <rect x={3} y={12} width={2} height={2} fill="currentColor" />
      <rect x={5} y={13} width={6} height={2} fill="currentColor" />
      <rect x={11} y={12} width={2} height={2} fill="currentColor" />
      <rect x={12} y={10} width={2} height={2} fill="currentColor" />
      <rect x={13} y={6} width={2} height={4} fill="currentColor" />
      <rect x={12} y={4} width={2} height={2} fill="currentColor" />
      <rect x={11} y={2} width={2} height={2} fill="currentColor" />
      <rect x={5} y={1} width={6} height={2} fill="currentColor" />
      <rect x={9} y={0} width={4} height={2} fill="currentColor" />
    </svg>
  );
}
