import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, test, vi } from "vitest";
import { ToggleableButton } from "./toggleable_button";

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
