import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";
import { Digit } from "../../shared/common";
import { Empty, Given, Note, Proposed } from "./cell_box";

describe("Cell components", () => {
  test("Empty", () => {
    render(<Empty />);

    expect(screen.queryAllByText(/[A-z0-9]/)).toHaveLength(0);
  });

  test("Given - highlighted", () => {
    render(<Given digit={"3"} highlight={true} />);
  });

  test("Given - not hightlighted", () => {
    render(<Given digit={"1"} highlight={false} />);

    expect(screen.getByText(/1/)).toBeInTheDocument();
  });

  test("Proposed - highlighted", () => {
    render(<Proposed digit={"3"} highlight={true} />);
  });

  test("Proposed - not hightlighted", () => {
    render(<Proposed digit={"1"} highlight={false} />);

    expect(screen.getByText(/1/)).toBeInTheDocument();
  });

  test("Note - empty", () => {
    render(<Note digits={new Set<Digit>()} selectedDigit={undefined} />);

    expect(screen.queryAllByText(/[A-z0-9]/)).toHaveLength(0);
  });

  test("Note - non selected", () => {
    render(
      <Note digits={new Set<Digit>(["2", "5", "8"])} selectedDigit={"4"} />,
    );

    const visible = screen.getAllByText(/\b[2, 5, 8]\b/);

    const allDigits = screen.getAllByText(/[0-9]/);

    expect(visible).toHaveLength(3);
    expect(allDigits).toHaveLength(3);
  });

  test("Note - one selected", () => {
    render(
      <Note digits={new Set<Digit>(["2", "5", "8"])} selectedDigit={"5"} />,
    );

    const visible = screen.getAllByText(/\b[2, 5, 8]\b/);

    const allDigits = screen.getAllByText(/[0-9]/);

    expect(visible).toHaveLength(3);
    expect(allDigits).toHaveLength(3);
  });
});
