const LEVELS = ["Easy", "Medium", "Hard", "Expert"] as const;

type Level = (typeof LEVELS)[number];

function isLevel(value: unknown): value is Level {
  return typeof value === "string" && LEVELS.some((level) => value === level);
}

export { LEVELS, isLevel, type Level };
