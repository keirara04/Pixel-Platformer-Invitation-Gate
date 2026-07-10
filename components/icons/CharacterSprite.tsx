// Rendered from assets-src/character.json via the pixel-art skill's
// render.py — see assets-src/README.md to regenerate.
export default function CharacterSprite({
  size = 64,
  className = "",
}: {
  size?: number;
  className?: string;
}) {
  const aspect = 24 / 40;
  return (
    <img
      src="/images/character.png"
      alt="Pixel character"
      width={size * aspect}
      height={size}
      style={{ imageRendering: "pixelated" }}
      className={className}
    />
  );
}
