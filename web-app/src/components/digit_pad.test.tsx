import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";
import { Digit } from "../shared/common";
import { DigitPad } from "./digit_pad";

describe("DigitPad", () => {
  test("displays numbers 1-9", () => {
    render(<DigitPad />);

    expect(screen.queryAllByText(/[A-z0-9]/)).toHaveLength(9);

    expect(screen.queryByText(/1/)).toBeInTheDocument();
    expect(screen.queryByText(/2/)).toBeInTheDocument();
    expect(screen.queryByText(/3/)).toBeInTheDocument();
    expect(screen.queryByText(/4/)).toBeInTheDocument();
    expect(screen.queryByText(/5/)).toBeInTheDocument();
    expect(screen.queryByText(/6/)).toBeInTheDocument();
    expect(screen.queryByText(/7/)).toBeInTheDocument();
    expect(screen.queryByText(/8/)).toBeInTheDocument();
    expect(screen.queryByText(/9/)).toBeInTheDocument();
  });

  test("clicking digit buttons", () => {
    let numberClicked;

    const buttonClicked = (digit: Digit) => {
      numberClicked = digit;
    };

    render(<DigitPad clickHandler={buttonClicked} />);

    fireEvent.click(screen.getByText(/1/));
    expect(numberClicked).toBe("1");

    fireEvent.click(screen.getByText(/2/));
    expect(numberClicked).toBe("2");

    fireEvent.click(screen.getByText(/3/));
    expect(numberClicked).toBe("3");

    fireEvent.click(screen.getByText(/4/));
    expect(numberClicked).toBe("4");

    fireEvent.click(screen.getByText(/5/));
    expect(numberClicked).toBe("5");

    fireEvent.click(screen.getByText(/6/));
    expect(numberClicked).toBe("6");

    fireEvent.click(screen.getByText(/7/));
    expect(numberClicked).toBe("7");

    fireEvent.click(screen.getByText(/8/));
    expect(numberClicked).toBe("8");

    fireEvent.click(screen.getByText(/9/));
    expect(numberClicked).toBe("9");
  });
});
