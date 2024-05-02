import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, test, vi } from "vitest";
import { Button, DigitButton, ToggleableButton } from "./buttons";

describe("Buttons", () => {
  test("should handle click twice", () => {
    const clickHandler = vi.fn();

    render(<Button onClick={clickHandler}>Hello!</Button>);

    const helloButton = screen.getByText(/hello!/i);

    expect(helloButton).toBeInTheDocument();

    fireEvent.click(helloButton);
    fireEvent.click(helloButton);
    expect(clickHandler).toHaveBeenCalledTimes(2);
  });
});

describe("ToggleableButton", () => {
  test("should handle click", () => {
    const clickHandler = vi.fn();

    render(<ToggleableButton onClick={clickHandler}>switch</ToggleableButton>);

    const toggle = screen.getByText(/switch/);

    expect(toggle).toBeInTheDocument();

    fireEvent.click(toggle);

    expect(clickHandler).toHaveBeenCalledOnce();
  });
});

describe("DigitButton", () => {
  test("should handle click", () => {
    const clickHandler = vi.fn();

    render(<DigitButton onClick={clickHandler}>9</DigitButton>);

    const button = screen.getByText(/9/);

    expect(button).toBeInTheDocument();

    fireEvent.click(button);

    expect(clickHandler).toHaveBeenCalledOnce();
  });
});
