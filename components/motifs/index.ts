import type { ComponentType } from "react";
import type { VisualMotifType } from "@/lib/schemas/lesson";
import { Orbit } from "./Orbit";
import { FlowNodes } from "./FlowNodes";
import { PulseBars } from "./PulseBars";
import { Wave } from "./Wave";
import { StackBlocks } from "./StackBlocks";
import { Branch } from "./Branch";
import { Spark } from "./Spark";
import { GridReveal } from "./GridReveal";
import { Spiral } from "./Spiral";
import { MorphBlob } from "./MorphBlob";

export type MotifComponentProps = {
  palette: [string, string, string];
  parallax?: number;
  paused?: boolean;
};

const REGISTRY: Record<
  VisualMotifType,
  ComponentType<MotifComponentProps>
> = {
  orbit: Orbit,
  flowNodes: FlowNodes,
  pulseBars: PulseBars,
  wave: Wave,
  stackBlocks: StackBlocks,
  branch: Branch,
  spark: Spark,
  gridReveal: GridReveal,
  spiral: Spiral,
  morphBlob: MorphBlob,
};

export function getMotif(visual: VisualMotifType) {
  return REGISTRY[visual] ?? GridReveal;
}

export {
  Orbit,
  FlowNodes,
  PulseBars,
  Wave,
  StackBlocks,
  Branch,
  Spark,
  GridReveal,
  Spiral,
  MorphBlob,
};
