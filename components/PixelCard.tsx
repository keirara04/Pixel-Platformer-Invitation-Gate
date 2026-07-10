import { ReactNode } from "react";

const bgClasses = {
  pink: "bg-pixel-pink",
  mint: "bg-pixel-mint",
  lavender: "bg-pixel-lavender",
  butter: "bg-pixel-butter",
  peach: "bg-pixel-peach",
  white: "bg-white",
} as const;

export default function PixelCard({
  children,
  bg = "white",
  className = "",
}: {
  children: ReactNode;
  bg?: keyof typeof bgClasses;
  className?: string;
}) {
  return (
    <div className={`pixel-border ${bgClasses[bg]} p-5 ${className}`}>
      {children}
    </div>
  );
}
