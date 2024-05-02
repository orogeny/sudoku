import "@testing-library/jest-dom/matchers";
import { fireEvent, render, screen, within } from "@testing-library/react";
import { describe, expect, test } from "vitest";
import { Digit } from "../../shared/common";
import { Game } from "./game";

const PUZZLE =
  "9...1.248.1.65...........6.8.4.9..3.56....827.718....4......5.3..3.764.2.9..8....";

function setup(puzzle: string) {
  render(<Game puzzle={puzzle} />);

  const cells = screen.getAllByTestId(/cell/);
  const digit_button = screen
    .getAllByRole("button", { name: /\b\d{1}\b/ })
    .reduce((acc, d, i) => {
      return {
        ...acc,
        [(i + 1).toString()]: d,
      };
    }, {}) as Record<Digit, HTMLElement>;
  const notes_button = screen.getByRole("button", { name: /notes/i });
  const undo_button = screen.getByRole("button", { name: /undo/i });

  return {
    cells,
    digit_button,
    notes_button,
    undo_button,
    screen,
  };
}

function getCellDigits(el: HTMLElement) {
  const inner = within(el).queryAllByText(/\b\d{1}\b/);

  return inner.map((x) => x.textContent);
}

describe("Game", () => {
  test("should have initial given", () => {
    const { cells } = setup(PUZZLE);

    expect(cells[0]).toHaveTextContent("9");
  });

  test("should have initial empty", () => {
    const { cells } = setup(PUZZLE);

    expect(cells[2]).toHaveTextContent("");
  });

  test("should place proposed digit in empty cell", () => {
    const { cells, digit_button } = setup(PUZZLE);

    expect(cells[26]).toHaveTextContent("");

    fireEvent.click(cells[26]);
    fireEvent.click(digit_button["5"]);

    expect(cells[26]).toHaveTextContent("5");
  });

  test("should place notes in empty cell", () => {
    const { cells, digit_button, notes_button } = setup(PUZZLE);

    expect(cells[1]).toHaveTextContent("");

    fireEvent.click(notes_button);

    fireEvent.click(cells[1]);
    fireEvent.click(digit_button["3"]);
    fireEvent.click(digit_button["5"]);

    const notes = getCellDigits(cells[1]);

    expect(notes).toEqual(["3", "5"]);
  });

  test("should replace note with proposed digit", () => {
    const { cells, digit_button, notes_button } = setup(PUZZLE);

    fireEvent.click(notes_button);
    fireEvent.click(cells[1]);
    fireEvent.click(digit_button["3"]);

    fireEvent.click(notes_button);
    fireEvent.click(digit_button["5"]);

    expect(cells[1]).toHaveTextContent("5");
  });
});
