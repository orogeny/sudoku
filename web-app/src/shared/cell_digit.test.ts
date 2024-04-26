import { describe, expect, test } from "vitest";
import { Cell, Digit } from "./common";
import { cellDigit } from "./cell_digit";

describe("cellDigit", () => {
  test("empty", () => {
    const empty = { kind: "empty" } as Cell;

    expect(cellDigit(empty)).toBeUndefined();
  });

  test("note", () => {
    const note = {
      kind: "note",
      digits: new Set<Digit>(["1", "3", "9"]),
    } as Cell;

    expect(cellDigit(note)).toBeUndefined();
  });

  test("given", () => {
    const given = {
      kind: "given",
      digit: "7",
    } as Cell;

    expect(cellDigit(given)).toBe("7");
  });

  test("proposed", () => {
    const proposed = {
      kind: "proposed",
      digit: "9",
    } as Cell;

    expect(cellDigit(proposed)).toBe("9");
  });

  test("cells", () => {
    const list = [
      { kind: "empty" },
      { kind: "given", digit: "4" },
      { kind: "proposed", digit: "8" },
      { kind: "note", digits: new Set<Digit>(["2", "5", "7"]) },
    ] as Cell[];

    expect(cellDigit(list)).toBeUndefined();

    expect(cellDigit(list, 0)).toBeUndefined();
    expect(cellDigit(list, 1)).toBe("4");
    expect(cellDigit(list, 2)).toBe("8");
    expect(cellDigit(list, 3)).toBeUndefined();
  });
});