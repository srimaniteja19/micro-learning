"use client";

import { motion } from "framer-motion";
import { useId } from "react";

type CardAtmosphereProps = {
  accent: string;
};

export function CardAtmosphere({ accent }: CardAtmosphereProps) {
  const noiseId = useId();

  return (
    <>
      <div
        className="pointer-events-none absolute inset-0 z-[1] opacity-[0.03]"
        aria-hidden
      >
        <svg className="h-full w-full" preserveAspectRatio="none">
          <filter id={noiseId}>
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.65"
              numOctaves={3}
              stitchTiles="stitch"
            />
          </filter>
          <rect width="100%" height="100%" filter={`url(#${noiseId})`} />
        </svg>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="pointer-events-none absolute z-[2] h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2"
        style={{
          left: "65%",
          top: "40%",
          background: `radial-gradient(circle, color-mix(in srgb, ${accent} 15%, transparent) 0%, transparent 70%)`,
          filter: "blur(48px)",
        }}
        aria-hidden
      />
    </>
  );
}
