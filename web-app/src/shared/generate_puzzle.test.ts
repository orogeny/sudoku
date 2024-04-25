import { describe, expect, test } from "vitest";
import { isDigit } from "./common";
import { generatePuzzle } from "./generate_puzzle";

describe("generatePuzzle", () => {
  test("given", () => {
    const expected =
      ".12846.97..62....4.54973.212631984.51..72593....6..8.2.8..17..96..4891.3....6...."
        .split("")
        .map((d) =>
          isDigit(d) ? { kind: "given", digit: d } : { kind: "empty" },
        );

    expect(generatePuzzle("Easy")).toEqual(expected);
  });
});
