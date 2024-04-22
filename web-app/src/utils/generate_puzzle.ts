const LEVELS = ["Easy", "Medium", "Hard", "Expert", "Master"] as const;

type Level = (typeof LEVELS)[number];

const DIGITS = ["1", "2", "3", "4", "5", "6", "7", "8", "9"] as const;

type Digit = (typeof DIGITS)[number];

function isDigit(value: unknown): value is Digit {
  return (
    typeof value === "string" &&
    value.length === 1 &&
    "1" <= value &&
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
  return puzzles[level].split("").map((v) => {
    return isDigit(v) ? v : ".";
  }) as Array<Digit | ".">;
}

export { DIGITS, type Digit, LEVELS, type Level, generatePuzzle };
