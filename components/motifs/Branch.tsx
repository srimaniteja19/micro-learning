"use client";

import { useReducedMotion } from "framer-motion";
import { motion } from "framer-motion";

type MotifProps = {
  palette: [string, string, string];
  parallax?: number;
  paused?: boolean;
};

const BRANCHES = [
  "M200,320 L200,200 L120,120",
  "M200,200 L280,120",
  "M200,200 L160,80",
  "M200,200 L240,80",
];

export function Branch({ palette, parallax = 0, paused }: MotifProps) {
  const reduced = useReducedMotion();
  const [c1, c2, c3] = palette;

  return (
    <svg
      viewBox="0 0 400 400"
      className="absolute inset-0 h-full w-full opacity-25"
      style={{ transform: `translateX(${parallax * -8}px)` }}
      aria-hidden
    >
      {BRANCHES.map((d, i) => (
        <motion.path
          key={i}
          d={d}
          fill="none"
          stroke={[c1, c2, c3, c2][i]}
          strokeWidth="2"
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          animate={reduced || paused ? { pathLength: 1 } : { pathLength: [0, 1, 1] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: i * 0.5 }}
        />
      ))}
      {[
        [200, 320],
        [120, 120],
        [280, 120],
        [160, 80],
        [240, 80],
      ].map(([cx, cy], i) => (
        <circle key={i} cx={cx} cy={cy} r="6" fill={i === 0 ? c1 : c3} opacity="0.7" />
      ))}
    </svg>
  );
}
