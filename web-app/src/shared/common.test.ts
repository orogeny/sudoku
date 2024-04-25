import { describe, expect, test } from "vitest";
import {
  DIGITS,
  Digit,
  digitsFromString,
  digitsToString,
  isDigit,
} from "./common";

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

  test("digitsFromString", () => {
    const literal = "123456789abcdef";

    const expected = (Array.from(DIGITS) as Array<Digit | ".">).concat(
      ".".repeat(6).split("") as "."[],
    );

    expect(digitsFromString(literal)).toEqual(expected);
  });

  test("digitsToString", () => {
    expect(digitsToString(Array.from(DIGITS))).toBe("123456789");
  });
});
