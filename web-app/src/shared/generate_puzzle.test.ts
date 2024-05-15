import { describe, expect, test } from "vitest";
import { generatePuzzle } from "./generate_puzzle";

describe("generatePuzzle", () => {
  test("puzzles are 81 chars", () => {
    const easy = generatePuzzle("Easy", 0.999);

    expect(easy.givens).toHaveLength(81);
    expect(easy.solution).toHaveLength(81);
    expect(easy.solution).toBe(
      "412987536798635421563124789135798264879462153246351897321879645987546312654213978",
    );

    const medium = generatePuzzle("Medium", 0);

    expect(medium.givens).toHaveLength(81);
    expect(medium.solution).toHaveLength(81);

    const hard = generatePuzzle("Hard", 0.3);

    expect(hard.givens).toHaveLength(81);
    expect(hard.solution).toHaveLength(81);

    const expert = generatePuzzle("Expert", 0.6);

    expect(expert.givens).toHaveLength(81);
    expect(expert.solution).toHaveLength(81);
  });
});
