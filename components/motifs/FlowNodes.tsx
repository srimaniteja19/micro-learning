"use client";

import { useReducedMotion } from "framer-motion";
import { motion } from "framer-motion";

type MotifProps = {
  palette: [string, string, string];
  parallax?: number;
  paused?: boolean;
};

const NODES = [
  { x: 80, y: 200 },
  { x: 200, y: 80 },
  { x: 320, y: 200 },
  { x: 200, y: 320 },
  { x: 200, y: 200 },
];

const EDGES = [
  [0, 4],
  [1, 4],
  [2, 4],
  [3, 4],
  [0, 1],
  [2, 3],
];

export function FlowNodes({ palette, parallax = 0, paused }: MotifProps) {
  const reduced = useReducedMotion();
  const [c1, c2, c3] = palette;

  return (
    <svg
      viewBox="0 0 400 400"
      className="absolute inset-0 h-full w-full opacity-25"
      style={{ transform: `translateX(${parallax * -8}px)` }}
      aria-hidden
    >
      {EDGES.map(([a, b], i) => (
        <motion.line
          key={i}
          x1={NODES[a].x}
          y1={NODES[a].y}
          x2={NODES[b].x}
          y2={NODES[b].y}
          stroke={c2}
          strokeWidth="1"
          opacity="0.5"
          animate={reduced || paused ? {} : { opacity: [0.3, 0.7, 0.3] }}
          transition={{ duration: 3 + i, repeat: Infinity, ease: "easeInOut" }}
        />
      ))}
      {NODES.map((n, i) => (
        <motion.circle
          key={i}
          cx={n.x}
          cy={n.y}
          r={i === 4 ? 12 : 8}
          fill={i === 4 ? c1 : i % 2 ? c2 : c3}
          animate={
            reduced || paused ? {} : { scale: [1, 1.2, 1], opacity: [0.6, 1, 0.6] }
          }
          transition={{ duration: 4 + i * 0.5, repeat: Infinity, ease: "easeInOut" }}
        />
      ))}
    </svg>
  );
}
