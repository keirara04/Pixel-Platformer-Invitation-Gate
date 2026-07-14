"use client";

import { useRef, useState, PointerEvent, ReactNode } from "react";

const MAX_TILT_DEG = 8;

function prefersReducedMotion(): boolean {
  return (
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

export default function TiltCard({
  children,
  className = "",
  maxTilt = MAX_TILT_DEG,
}: {
  children: ReactNode;
  className?: string;
  maxTilt?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ rx: 0, ry: 0 });
  const [glow, setGlow] = useState({ x: 50, y: 50 });
  const [active, setActive] = useState(false);
  const draggingRef = useRef(false);

  function applyTiltFromPoint(clientX: number, clientY: number) {
    if (prefersReducedMotion()) return;
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const px = (clientX - rect.left) / rect.width;
    const py = (clientY - rect.top) / rect.height;
    const nx = px * 2 - 1;
    const ny = py * 2 - 1;
    setTilt({ rx: -ny * maxTilt, ry: nx * maxTilt });
    setGlow({ x: px * 100, y: py * 100 });
  }

  function reset() {
    setTilt({ rx: 0, ry: 0 });
    setGlow({ x: 50, y: 50 });
    setActive(false);
    draggingRef.current = false;
  }

  function handlePointerMove(e: PointerEvent<HTMLDivElement>) {
    if (e.pointerType === "touch" && !draggingRef.current) return;
    setActive(true);
    applyTiltFromPoint(e.clientX, e.clientY);
  }

  function handlePointerDown(e: PointerEvent<HTMLDivElement>) {
    if (e.pointerType === "touch") {
      draggingRef.current = true;
      applyTiltFromPoint(e.clientX, e.clientY);
    }
  }

  return (
    <div
      ref={ref}
      className={`relative ${className}`}
      style={{ perspective: "800px" }}
      onPointerMove={handlePointerMove}
      onPointerDown={handlePointerDown}
      onPointerUp={reset}
      onPointerLeave={reset}
      onPointerCancel={reset}
    >
      <div
        className="relative transition-transform duration-150 ease-out will-change-transform"
        style={{
          transform: `rotateX(${tilt.rx}deg) rotateY(${tilt.ry}deg)`,
          transformStyle: "preserve-3d",
        }}
      >
        {children}
        {active && (
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              background: `radial-gradient(circle at ${glow.x}% ${glow.y}%, rgba(255,255,255,0.35), transparent 60%)`,
            }}
            aria-hidden
          />
        )}
      </div>
    </div>
  );
}
