import { ReactNode } from "react";

const bgClasses = {
  pink: "bg-pixel-pink",
  mint: "bg-pixel-mint",
  lavender: "bg-pixel-lavender",
  butter: "bg-pixel-butter",
  peach: "bg-pixel-peach",
  white: "bg-white",
} as const;

export default function HudPanel({
  children,
  bg = "white",
  className = "",
}: {
  children: ReactNode;
  bg?: keyof typeof bgClasses;
  className?: string;
}) {
  return (
    <div className={`hud-panel ${bgClasses[bg]} p-5 ${className}`}>
      <span className="hud-corner hud-corner-tl" />
      <span className="hud-corner hud-corner-tr" />
      <span className="hud-corner hud-corner-bl" />
      <span className="hud-corner hud-corner-br" />
      {children}
    </div>
  );
}
