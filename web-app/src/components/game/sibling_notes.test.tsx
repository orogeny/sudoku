import "@testing-library/jest-dom/matchers";
import { fireEvent, render, screen, within } from "@testing-library/react";
import { Game } from "./game";
import { Digit } from "../../shared/common";
import { describe, expect, test } from "vitest";

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

// function getCellDigits(el: HTMLElement) {
//   const inner = within(el).queryAllByText(/\b\d{1}\b/);

//   return inner.map((x) => x.textContent);
// }

describe("Remove note digits from sibling cells", () => {
  test("should remove proposed digit from sibling notes", () => {
    const { cells, digit_button, notes_button } = setup(PUZZLE);

    fireEvent.click(notes_button);

    fireEvent.click(cells[19]);
    fireEvent.click(digit_button["5"]);

    fireEvent.click(cells[24]);
    fireEvent.click(digit_button["5"]);

    fireEvent.click(cells[35]);
    fireEvent.click(digit_button["5"]);

    fireEvent.click(notes_button);

    fireEvent.click(cells[26]);
    fireEvent.click(digit_button["5"]);

    expect(cells[19]).toHaveTextContent("");
    expect(cells[24]).toHaveTextContent("");
    expect(cells[35]).toHaveTextContent("");
  });
});
