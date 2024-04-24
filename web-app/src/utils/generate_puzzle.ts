const LEVELS = ["Easy", "Medium", "Hard", "Expert", "Master"] as const;

type Level = (typeof LEVELS)[number];

const DIGITS = ["1", "2", "3", "4", "5", "6", "7", "8", "9"] as const;

type Digit = (typeof DIGITS)[number];

type Cell =
  | {
      kind: "empty";
      digit: undefined;
    }
  | {
      kind: "given";
      digit: Digit;
    }
  | {
      kind: "proposed";
      digit: Digit;
    }
  | {
      kind: "note";
      digits: Digit[];
    };

function isDigit(value: unknown): value is Digit {
  return (
    typeof value === "string" &&
    value.length === 1 &&
    value >= "1" &&
    value <= "9"
  );
}

const puzzles = {
  Easy: ".12846.97..62....4.54973.212631984.51..72593....6..8.2.8..17..96..4891.3....6....",
  Medium:
    ".93.65...8...4..56...3.8.192.8.7.49..3.6...8.71..8.6.3..2.3.......2..83.35.81.924",
  Hard: "9...1.248.1.65...........6.8.4.9..3.56....827.718....4......5.3..3.764.2.9..8....",
  Expert:
    "9..2.1.5.81..9...77.54...2.39...47.2..7...5..6..9.7.18..1...2...7......1...5.....",
  Master:
    ".8..7..241...3.7.......4.98.9.....1..6.5..2..8.29.....92.....8...736.9...........",
};

function generatePuzzle(level: Level) {
  return puzzles[level].split("").map((v, i) => {
    if (i === 6) return { kind: "note", digits: ["2", "7"] } as Cell;
    if (i === 15) return { kind: "proposed", digit: "3" } as Cell;
    return isDigit(v) ? { kind: "given", digit: v } : { kind: "empty" };
  }) as Cell[];
}

function columnSiblings(index: number) {
  const column = index % 9;

  return Array.from({ length: 9 }).map((_, i) => column + i * 9);
}

function rowSiblings(index: number) {
  const row = Math.floor(index / 9);

  return Array.from({ length: 9 }).map((_, i) => row * 9 + i);
}

function squareSiblings(index: number) {
  const square = Math.floor(index / 27) * 3 + Math.floor((index % 9) / 3);

  return Array.from({ length: 9 }).map(
    (_, i) =>
      Math.floor(square / 3) * 27 +
      (square % 3) * 3 +
      (i % 3) +
      Math.floor(i / 3) * 9,
  );
}

function siblingsOf(index: number) {
  return new Set([
    ...columnSiblings(index),
    ...rowSiblings(index),
    ...squareSiblings(index),
  ]);
}

export {
  type Cell,
  DIGITS,
  type Digit,
  LEVELS,
  type Level,
  generatePuzzle,
  siblingsOf,
};
