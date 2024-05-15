const LEVELS = ["Easy", "Medium", "Hard", "Expert"] as const;

type Level = (typeof LEVELS)[number];

const DIGITS = ["1", "2", "3", "4", "5", "6", "7", "8", "9"] as const;

type Digit = (typeof DIGITS)[number];

function isDigit(value: unknown): value is Digit {
  return (
    typeof value === "string" &&
    value.length === 1 &&
    value >= "1" &&
    value <= "9"
  );
}

function extractDigits(text: string) {
  return text.split("").reduce(
    (acc, c, i) => {
      if (isDigit(c)) {
        acc.digits.push(c);
      } else {
        acc.rejected.push(i);
      }
      return acc;
    },
    { digits: [] as Digit[], rejected: [] as number[] },
  );
}

type Cell =
  | {
      kind: "given" | "proposed";
      digit: Digit;
    }
  | {
      kind: "note";
      digits: Set<Digit>;
    };

type Puzzle = {
  givens: string;
  solution: string;
};

export {
  DIGITS,
  LEVELS,
  extractDigits,
  isDigit,
  type Cell,
  type Digit,
  type Level,
  type Puzzle,
};
