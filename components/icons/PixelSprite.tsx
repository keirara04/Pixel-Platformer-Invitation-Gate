// Small hand-drawn pixel-grid icons standing in for the emoji this page
// used to rely on — kept blocky and inline so they render identically
// everywhere instead of depending on the visitor's OS emoji font.

type Cell = [x: number, y: number];

const SHAPES: Record<"balloon" | "star" | "spark", Cell[]> = {
  balloon: [
    [1, 0], [2, 0], [3, 0],
    [0, 1], [1, 1], [2, 1], [3, 1], [4, 1],
    [0, 2], [1, 2], [2, 2], [3, 2], [4, 2],
    [0, 3], [1, 3], [2, 3], [3, 3], [4, 3],
    [1, 4], [2, 4], [3, 4],
    [2, 5],
    [2, 6],
  ],
  star: [
    [2, 0],
    [1, 1], [2, 1], [3, 1],
    [0, 2], [1, 2], [2, 2], [3, 2], [4, 2],
    [1, 3], [2, 3], [3, 3],
    [2, 4],
  ],
  spark: [
    [1, 0],
    [0, 1], [1, 1], [2, 1],
    [1, 2],
  ],
};

const GRID_SIZE: Record<keyof typeof SHAPES, [number, number]> = {
  balloon: [5, 7],
  star: [5, 5],
  spark: [3, 3],
};

export default function PixelSprite({
  kind,
  color,
  size = 28,
  className = "",
}: {
  kind: keyof typeof SHAPES;
  color: string;
  size?: number;
  className?: string;
}) {
  const [w, h] = GRID_SIZE[kind];
  return (
    <svg
      viewBox={`0 0 ${w} ${h}`}
      width={size}
      height={(size * h) / w}
      shapeRendering="crispEdges"
      className={className}
      aria-hidden
    >
      {SHAPES[kind].map(([x, y], i) => (
        <rect key={i} x={x} y={y} width={1} height={1} fill={color} />
      ))}
    </svg>
  );
}
