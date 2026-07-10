export default function SpeakerIcon({ muted, size = 20 }: { muted: boolean; size?: number }) {
  return (
    <svg
      viewBox="0 0 16 16"
      width={size}
      height={size}
      shapeRendering="crispEdges"
      aria-hidden
    >
      <rect x={1} y={6} width={3} height={4} fill="currentColor" />
      <rect x={4} y={4} width={2} height={8} fill="currentColor" />
      <rect x={6} y={2} width={2} height={12} fill="currentColor" />
      {muted ? (
        <>
          <rect x={10} y={5} width={2} height={2} fill="currentColor" />
          <rect x={12} y={7} width={2} height={2} fill="currentColor" />
          <rect x={10} y={9} width={2} height={2} fill="currentColor" />
          <rect x={12} y={4} width={2} height={2} fill="currentColor" />
          <rect x={12} y={10} width={2} height={2} fill="currentColor" />
        </>
      ) : (
        <>
          <rect x={10} y={6} width={2} height={4} fill="currentColor" />
          <rect x={13} y={4} width={2} height={8} fill="currentColor" />
        </>
      )}
    </svg>
  );
}
