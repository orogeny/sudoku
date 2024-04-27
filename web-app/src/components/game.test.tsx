import "@testing-library/jest-dom/matchers";
import { fireEvent, render, screen, within } from "@testing-library/react";
import { describe, expect, test } from "vitest";
import { Game } from "./game";

const PUZZLE =
  "9...1.248.1.65...........6.8.4.9..3.56....827.718....4......5.3..3.764.2.9..8....";

describe("Game", () => {
  // let cells: Cell[];
  // let notes_button: HTMLButtonElement;
  // let digit_buttons: HTMLButtonElement;

  test("initial given", () => {
    render(<Game puzzle={PUZZLE} />);

    const cells = screen.getAllByTestId(/cell/);

    expect(cells[0]).toHaveTextContent("9");
  });

  test("initial empty", () => {
    render(<Game puzzle={PUZZLE} />);

    const cells = screen.getAllByTestId(/cell/);

    expect(cells[2]).toHaveTextContent("");
  });

  test("proposed", () => {
    render(<Game puzzle={PUZZLE} />);

    const cell_2 = screen.getByTestId("cell-2");
    const six_button = screen.getByRole("button", { name: "6" });

    fireEvent.click(cell_2);
    fireEvent.click(six_button);

    expect(cell_2).toHaveTextContent("6");
  });

  test("notes", () => {
    render(<Game puzzle={PUZZLE} />);

    const cell_1 = screen.getByTestId("cell-1");
    const digit_buttons = screen.getAllByRole("button", { name: /\b\d{1}\b/ });
    const notes_button = screen.getByText(/Notes/i);

    fireEvent.click(notes_button);
    fireEvent.click(cell_1);
    fireEvent.click(digit_buttons[2]); // 3
    fireEvent.click(digit_buttons[4]); // 5
    fireEvent.click(digit_buttons[6]); // 7

    const notes = within(cell_1).getAllByText(/\b\d{1}\b/);

    expect(notes).toHaveLength(3);
  });
});
