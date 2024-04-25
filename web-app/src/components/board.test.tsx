import { describe, expect, test } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { Cell, Digit } from "../shared/common";
import { Board } from "./board";

function emptyCells() {
  return Array.from({ length: 81 }).map(
    () => ({ kind: "empty", digit: undefined }) as const,
  ) as Cell[];
}

describe("Board", () => {
  test("empty board", () => {
    const cells = emptyCells();

    render(<Board cells={cells} />);

    expect(screen.queryAllByText(/[A-z0-9]/)).toHaveLength(0);
  });

  test("given digit", () => {
    const cells = emptyCells();

    cells[0] = { kind: "given", digit: "1" };

    render(<Board cells={cells} />);

    expect(screen.queryAllByText(/[A-z0-9]/)).toHaveLength(1);
    expect(screen.queryByText(/1/)).toBeInTheDocument();
  });

  test("proposed digit", () => {
    const cells = emptyCells();

    cells[80] = { kind: "proposed", digit: "2" };

    render(<Board cells={cells} />);

    expect(screen.queryAllByText(/[A-z0-9]/)).toHaveLength(1);
    expect(screen.queryByText(/2/)).toBeInTheDocument();
  });

  test("note digits", () => {
    const cells = emptyCells();

    cells[3] = { kind: "note", digits: new Set<Digit>(["4", "7", "9"]) };

    render(<Board cells={cells} />);

    expect(screen.queryAllByText(/[A-z0-9]/)).toHaveLength(3);
    expect(screen.queryByText(/4/)).toBeInTheDocument();
    expect(screen.queryByText(/7/)).toBeInTheDocument();
    expect(screen.queryByText(/9/)).toBeInTheDocument();
  });

  test("click cell", () => {
    const cells = emptyCells();

    cells[27] = { kind: "proposed", digit: "3" };

    let clickedCellIndex;
    const cellClicked = (index: number) => {
      clickedCellIndex = index;
    };

    render(<Board cells={cells} clickHandler={cellClicked} />);

    fireEvent.click(screen.getByText(/3/));
    expect(clickedCellIndex).toBe(27);
  });
});
