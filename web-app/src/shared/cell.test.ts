import { describe, expect, test } from "vitest";
import { siblingsOf } from "./cell";

describe("siblingsOf", () => {
  test("no siblings", () => {
    expect(Array.from(siblingsOf(undefined))).toHaveLength(0);
  });

  test("top left (0)", () => {
    const expected = [
      1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 18, 19, 20, 27, 36, 45, 54, 63, 72,
    ];

    const siblings = siblingsOf(0);

    expect(siblings.has(0)).toBeFalsy();
    expect(Array.from(siblings).sort((a, b) => a - b)).toEqual(expected);
  });

  test("center (40)", () => {
    const expected = [
      4, 13, 22, 30, 31, 32, 36, 37, 38, 39, 41, 42, 43, 44, 48, 49, 50, 58, 67,
      76,
    ];

    const siblings = siblingsOf(40);

    expect(siblings.has(40)).toBeFalsy();

    expect(Array.from(siblings).sort((a, b) => a - b)).toEqual(expected);
  });

  test("bottom right (80)", () => {
    const expected = [
      8, 17, 26, 35, 44, 53, 60, 61, 62, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78,
      79,
    ];

    const siblings = siblingsOf(80);

    expect(siblings.has(80)).toBeFalsy();
    expect(Array.from(siblings).sort((a, b) => a - b)).toEqual(expected);
  });
});
