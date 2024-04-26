import { describe, expect, test } from "vitest";
import { generatePuzzle } from "./generate_puzzle";

describe("generatePuzzle", () => {
  test("puzzles are 81 chars", () => {
    expect(generatePuzzle("Easy")).toHaveLength(81);
    expect(generatePuzzle("Medium")).toHaveLength(81);
    expect(generatePuzzle("Hard")).toHaveLength(81);
    expect(generatePuzzle("Expert")).toHaveLength(81);
    expect(generatePuzzle("Master")).toHaveLength(81);
  });
});
