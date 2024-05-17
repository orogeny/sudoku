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

export { type Cell };
