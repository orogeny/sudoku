import "@testing-library/jest-dom/matchers";
import { fireEvent, render, screen, within } from "@testing-library/react";
import { describe, expect, test } from "vitest";
import { Game } from "./game";

const EMPTY_PUZZLE = ".".repeat(81);
const PUZZLE =
  "9...1.248.1.65...........6.8.4.9..3.56....827.718....4......5.3..3.764.2.9..8....";

describe("Game", () => {
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
    render(<Game puzzle={EMPTY_PUZZLE} />);

    const cell_2 = screen.getByTestId("cell-2");
    const six_button = screen.getByRole("button", { name: "6" });

    fireEvent.click(cell_2);
    fireEvent.click(six_button);

    expect(cell_2).toHaveTextContent("6");
  });
});
