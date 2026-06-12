"use client";

import { motion, useReducedMotion } from "framer-motion";

type MotifProps = {
  palette: [string, string, string];
  parallax?: number;
  paused?: boolean;
};

const PARTICLES = [
  { cx: 248, cy: 88, delay: 0.2 },
  { cx: 312, cy: 112, delay: 0.8 },
  { cx: 340, cy: 168, delay: 1.4 },
  { cx: 318, cy: 228, delay: 0.5 },
  { cx: 268, cy: 272, delay: 1.1 },
  { cx: 208, cy: 256, delay: 1.8 },
  { cx: 172, cy: 196, delay: 0.3 },
  { cx: 188, cy: 132, delay: 1.6 },
  { cx: 292, cy: 152, delay: 0.9 },
  { cx: 332, cy: 196, delay: 1.2 },
  { cx: 224, cy: 176, delay: 0.6 },
  { cx: 356, cy: 144, delay: 1.9 },
  { cx: 276, cy: 312, delay: 0.4 },
  { cx: 196, cy: 288, delay: 1.3 },
  { cx: 348, cy: 248, delay: 0.7 },
  { cx: 256, cy: 128, delay: 1.5 },
  { cx: 304, cy: 268, delay: 1.0 },
  { cx: 228, cy: 216, delay: 1.7 },
  { cx: 364, cy: 188, delay: 0.1 },
  { cx: 180, cy: 152, delay: 2.0 },
];

export function MorphBlob({ palette, parallax = 0, paused }: MotifProps) {
  const reduced = useReducedMotion();
  const [accent] = palette;
  const still = reduced || paused;

  return (
    <svg
      viewBox="0 0 400 400"
      className="absolute inset-0 h-full w-full"
      style={{ transform: `translateX(${parallax * -6}px)` }}
      aria-hidden
    >
      <defs>
        <radialGradient id="orbGrad" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={accent} stopOpacity="0.9" />
          <stop offset="100%" stopColor={accent} stopOpacity="0" />
        </radialGradient>
      </defs>

      <g transform="translate(260, 200)">
        <motion.ellipse
          rx={250}
          ry={200}
          fill="url(#orbGrad)"
          opacity={0.08}
          animate={still ? {} : { rotate: 360 }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
        />
        <motion.ellipse
          rx={170}
          ry={140}
          fill="url(#orbGrad)"
          opacity={0.14}
          animate={still ? {} : { rotate: -360 }}
          transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
        />
        <motion.ellipse
          rx={100}
          ry={80}
          fill="url(#orbGrad)"
          opacity={0.22}
          animate={still ? { scale: 1 } : { scale: [0.95, 1.05, 0.95] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        />
      </g>

      {PARTICLES.map((p, i) => (
        <motion.circle
          key={i}
          cx={p.cx}
          cy={p.cy}
          r={2 + (i % 2)}
          fill={accent}
          opacity={0.3}
          animate={
            still
              ? {}
              : {
                  cy: [p.cy, p.cy - 6, p.cy + 4, p.cy],
                  opacity: [0.2, 0.45, 0.25, 0.2],
                }
          }
          transition={{
            duration: 3 + (i % 4),
            repeat: Infinity,
            ease: "easeInOut",
            delay: p.delay,
          }}
        />
      ))}
    </svg>
  );
}
