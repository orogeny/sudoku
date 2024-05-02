import { describe, expect, test } from "vitest";
import { Stack } from "./stack";

describe("Stack", () => {
  test("should create an empty stack", () => {
    const stack = new Stack();

    expect(stack.isEmpty).toBeTruthy();
  });

  test("isEmpty should pop undefined item", () => {
    const stack = new Stack();

    const { item: x1, rest: xs1 } = stack.pop();

    expect(x1).toBeUndefined();
    expect(xs1).toBe(stack);
  });

  test("should pop pushed item", () => {
    const stack = new Stack<string>();

    const { item, rest } = stack.push("One").pop();

    expect(item).toBe("One");
    expect(rest).toBe(stack);
  });

  test("should traverse in FILO order", () => {
    const stack = new Stack();

    const stored = stack.push("first in").push("middles in").push("last in");

    expect(stored.traverse()).toEqual(["last in", "middles in", "first in"]);
  });

  test("should push array of items and traverse in FILO order", () => {
    const stack = new Stack();

    const stored = stack.pushAll([1, 2, 3, 4]);

    expect(stored.traverse()).toEqual([4, 3, 2, 1]);
  });
});
