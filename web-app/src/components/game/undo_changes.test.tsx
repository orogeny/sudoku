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

describe("Undo", () => {
  test("should initially have no effect", () => {
    const { cells, undo_button } = setup(PUZZLE);

    fireEvent.click(undo_button);

    expect(cells[4]).toHaveTextContent("1"); // Given digit
  });

  test("should undo proposed", () => {
    const { cells, digit_button, notes_button, undo_button } = setup(PUZZLE);

    fireEvent.click(cells[1]);
    fireEvent.click(notes_button);
    fireEvent.click(digit_button["3"]);

    expect(cells[1]).toHaveTextContent("3");

    fireEvent.click(undo_button);

    expect(cells[1]).toHaveTextContent("");
  });

  test("should undo proposed digit", () => {
    const { cells, digit_button, undo_button } = setup(PUZZLE);

    fireEvent.click(cells[1]);
    fireEvent.click(digit_button["3"]);

    expect(cells[1]).toHaveTextContent("3");

    fireEvent.click(undo_button);

    expect(cells[1]).toHaveTextContent("");
  });

  test("should undo second proposed", () => {
    const { cells, digit_button, undo_button } = setup(PUZZLE);

    fireEvent.click(cells[1]);
    fireEvent.click(digit_button["3"]);
    fireEvent.click(digit_button["5"]);

    fireEvent.click(undo_button);

    expect(cells[1]).toHaveTextContent("3");
  });

  test("should ignore same proposed digit", () => {
    const { cells, digit_button, undo_button } = setup(PUZZLE);

    fireEvent.click(cells[2]);
    fireEvent.click(digit_button["5"]);
    fireEvent.click(digit_button["5"]);

    fireEvent.click(undo_button);

    expect(cells[2]).toHaveTextContent("");
  });

  test("should revert new note back to empty", () => {
    const { cells, digit_button, notes_button, undo_button } = setup(PUZZLE);

    fireEvent.click(cells[1]);
    fireEvent.click(notes_button);
    fireEvent.click(digit_button["3"]);
    fireEvent.click(digit_button["5"]);

    expect(within(cells[1]).getAllByText(/\b\d{1}\b/)).toHaveLength(2);

    fireEvent.click(undo_button);

    expect(within(cells[1]).getAllByText(/\b\d{1}\b/)).toHaveLength(1);

    fireEvent.click(undo_button);

    expect(within(cells[1]).queryAllByText(/\b\d{1}\b/)).toHaveLength(0);
  });

  test("should revert proposed back to note", () => {
    const { cells, digit_button, notes_button, undo_button } = setup(PUZZLE);

    fireEvent.click(cells[1]);
    fireEvent.click(notes_button);
    fireEvent.click(digit_button["3"]);

    fireEvent.click(notes_button);
    fireEvent.click(digit_button["5"]);

    expect(cells[1]).toHaveTextContent("5");

    fireEvent.click(undo_button);

    expect(cells[1]).toHaveTextContent("3");
  });
});
