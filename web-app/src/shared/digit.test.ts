import { describe, expect, test } from "vitest";
import { DIGITS, extractDigits, isDigit } from "./digit";

describe("common - digits", () => {
  test("isDigit", () => {
    expect(isDigit("0")).toBe(false);
    expect(isDigit("1")).toBe(true);
    expect(isDigit("2")).toBe(true);
    expect(isDigit("3")).toBe(true);
    expect(isDigit("4")).toBe(true);
    expect(isDigit("5")).toBe(true);
    expect(isDigit("6")).toBe(true);
    expect(isDigit("7")).toBe(true);
    expect(isDigit("8")).toBe(true);
    expect(isDigit("9")).toBe(true);
    expect(isDigit(".")).toBe(false);
  });

  test("extractDigits", () => {
    const literal = "123456789abcdef";

    const { digits, rejected } = extractDigits(literal);

    expect(digits).toEqual(DIGITS);
    expect(rejected).toEqual([9, 10, 11, 12, 13, 14]);
  });
});
