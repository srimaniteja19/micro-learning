export const INTEREST_CATEGORIES = [
  "GenAI",
  "System Design",
  "Finance",
  "Space",
  "Psychology",
  "History",
  "Biology",
  "Physics",
  "Philosophy",
  "Technology",
] as const;

export type InterestCategory = (typeof INTEREST_CATEGORIES)[number];

export const DEPTH_OPTIONS = [
  { value: "BEGINNER", label: "Beginner", desc: "Foundations, no jargon" },
  {
    value: "INTERMEDIATE",
    label: "Intermediate",
    desc: "Solid basics assumed",
  },
  { value: "ADVANCED", label: "Advanced", desc: "Deep dives, nuance" },
] as const;
