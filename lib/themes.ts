import type { CSSProperties } from "react";

export type CategoryTheme = {
  gradient: [string, string];
  accent: string;
  motifPalette: [string, string, string];
  tiles: [string, string, string, string, string, string];
};

const BENTO_THEMES: Record<string, CategoryTheme> = {
  GenAI: {
    gradient: ["#1E1B4B", "#7C3AED"],
    accent: "#06B6D4",
    motifPalette: ["#818cf8", "#22d3ee", "#c084fc"],
    tiles: ["#7C3AED", "#A78BFA", "#1E1B4B", "#DDD6FE", "#4F46E5", "#EDE9FE"],
  },
  Finance: {
    gradient: ["#064E3B", "#059669"],
    accent: "#F59E0B",
    motifPalette: ["#34d399", "#14b8a6", "#fbbf24"],
    tiles: ["#059669", "#D1FAE5", "#064E3B", "#A7F3D0", "#10B981", "#ECFDF5"],
  },
  Space: {
    gradient: ["#0F172A", "#312E81"],
    accent: "#F8FAFC",
    motifPalette: ["#a78bfa", "#6366f1", "#e2e8f0"],
    tiles: ["#0F172A", "#818CF8", "#1E1B4B", "#C7D2FE", "#312E81", "#EEF2FF"],
  },
  Psychology: {
    gradient: ["#831843", "#BE185D"],
    accent: "#FDE68A",
    motifPalette: ["#fb7185", "#f472b6", "#fef3c7"],
    tiles: ["#BE185D", "#FCE7F3", "#831843", "#FBCFE8", "#DB2777", "#FDF2F8"],
  },
  "System Design": {
    gradient: ["#0C4A6E", "#0369A1"],
    accent: "#38BDF8",
    motifPalette: ["#6366f1", "#818cf8", "#38bdf8"],
    tiles: ["#0369A1", "#E0F2FE", "#0C4A6E", "#BAE6FD", "#0284C7", "#F0F9FF"],
  },
  History: {
    gradient: ["#431407", "#7C2D12"],
    accent: "#FCD34D",
    motifPalette: ["#fb923c", "#f97316", "#fcd34d"],
    tiles: ["#9A3412", "#FFEDD5", "#431407", "#FED7AA", "#EA580C", "#FFF7ED"],
  },
  Biology: {
    gradient: ["#14532D", "#166534"],
    accent: "#FDE047",
    motifPalette: ["#4ade80", "#22c55e", "#fde047"],
    tiles: ["#15803D", "#DCFCE7", "#14532D", "#BBF7D0", "#22C55E", "#F0FDF4"],
  },
  Physics: {
    gradient: ["#164E63", "#0E7490"],
    accent: "#A5F3FC",
    motifPalette: ["#22d3ee", "#06b6d4", "#a5f3fc"],
    tiles: ["#0E7490", "#CFFAFE", "#164E63", "#A5F3FC", "#0891B2", "#ECFEFF"],
  },
  Philosophy: {
    gradient: ["#1e1b4b", "#4c1d95"],
    accent: "#E9D5FF",
    motifPalette: ["#a78bfa", "#8b5cf6", "#e9d5ff"],
    tiles: ["#5B21B6", "#EDE9FE", "#3B0764", "#DDD6FE", "#7C3AED", "#F5F3FF"],
  },
  Technology: {
    gradient: ["#1E1B4B", "#7C3AED"],
    accent: "#06B6D4",
    motifPalette: ["#818cf8", "#22d3ee", "#c084fc"],
    tiles: ["#7C3AED", "#A78BFA", "#1E1B4B", "#DDD6FE", "#4F46E5", "#EDE9FE"],
  },
};

const FALLBACK_TILE_SETS: CategoryTheme["tiles"][] = [
  ["#7C3AED", "#A78BFA", "#1E1B4B", "#DDD6FE", "#4F46E5", "#EDE9FE"],
  ["#059669", "#D1FAE5", "#064E3B", "#A7F3D0", "#10B981", "#ECFDF5"],
  ["#0F172A", "#818CF8", "#1E1B4B", "#C7D2FE", "#312E81", "#EEF2FF"],
  ["#BE185D", "#FCE7F3", "#831843", "#FBCFE8", "#DB2777", "#FDF2F8"],
  ["#0369A1", "#E0F2FE", "#0C4A6E", "#BAE6FD", "#0284C7", "#F0F9FF"],
  ["#9A3412", "#FFEDD5", "#431407", "#FED7AA", "#EA580C", "#FFF7ED"],
  ["#15803D", "#DCFCE7", "#14532D", "#BBF7D0", "#22C55E", "#F0FDF4"],
  ["#0E7490", "#CFFAFE", "#164E63", "#A5F3FC", "#0891B2", "#ECFEFF"],
];

function hashCategory(name: string): number {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = (hash << 5) - hash + name.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

export function getTheme(category: string): CategoryTheme {
  if (BENTO_THEMES[category]) return BENTO_THEMES[category];

  const idx = hashCategory(category) % FALLBACK_TILE_SETS.length;
  const tiles = FALLBACK_TILE_SETS[idx];
  return {
    gradient: [tiles[2], tiles[0]],
    accent: tiles[1],
    motifPalette: [tiles[0], tiles[1], tiles[4]],
    tiles,
  };
}

export function getTileColor(theme: CategoryTheme, tileIndex: number): string {
  return theme.tiles[Math.min(tileIndex, theme.tiles.length - 1)];
}

export function themeToCssVars(theme: CategoryTheme): CSSProperties {
  return {
    ["--theme-from" as string]: theme.gradient[0],
    ["--theme-to" as string]: theme.gradient[1],
    ["--theme-accent" as string]: theme.accent,
    ["--motif-1" as string]: theme.motifPalette[0],
    ["--motif-2" as string]: theme.motifPalette[1],
    ["--motif-3" as string]: theme.motifPalette[2],
  };
}
