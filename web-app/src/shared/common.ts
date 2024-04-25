const LEVELS = ["Easy", "Medium", "Hard", "Expert", "Master"] as const;

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

function digitsToString(digits: Digit[]) {
  return digits.reduce(
    (acc, d) => (isDigit(d) ? acc.concat(d) : acc.concat(".")),
    "",
  );
}

function digitsFromString(text: string) {
  return text.split("").map((v) => (isDigit(v) ? v : ".")) as Array<
    Digit | "."
  >;
}

type Cell =
  | {
      kind: "empty";
    }
  | {
      kind: "given" | "proposed";
      digit: Digit;
    }
  | {
      kind: "note";
      digits: Set<Digit>;
    };

export { DIGITS, LEVELS, digitsFromString, digitsToString, isDigit };

export type { Cell, Digit, Level };
