"use client";

import type { VisualMotifType } from "@/lib/schemas/lesson";
import { getMotif } from "@/components/motifs";

type MiniMotifProps = {
  visual: VisualMotifType;
  palette: [string, string, string];
  size?: number;
  opacity?: number;
};

export function MiniMotif({
  visual,
  palette,
  size = 80,
  opacity = 0.2,
}: MiniMotifProps) {
  const Motif = getMotif(visual);

  return (
    <div
      className="pointer-events-none absolute overflow-hidden"
      style={{
        width: size,
        height: size,
        top: 12,
        right: 12,
        opacity,
      }}
      aria-hidden
    >
      <Motif palette={palette} paused />
    </div>
  );
}
