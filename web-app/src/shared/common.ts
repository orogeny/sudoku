import { Digit } from "./digit";

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

export { type Cell, type Puzzle };
