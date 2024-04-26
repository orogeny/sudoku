import { describe, expect, test, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { ToggleableButton } from "./toggleable_button";

describe("ToggleableButton", () => {
  test("toggles on and off", () => {
    render(<ToggleableButton />);

    const button = screen.getByText(/off/i);

    expect(button).toBeInTheDocument();

    fireEvent.click(button);

    expect(screen.getByText(/on/i)).toBeInTheDocument();

    fireEvent.click(button);

    expect(screen.getByText(/off/i)).toBeInTheDocument();
  });

  test("children displayed", () => {
    render(<ToggleableButton>Light</ToggleableButton>);

    const toggle = screen.getByText(/light/i);

    expect(toggle).toBeInTheDocument();
    expect(screen.getByText(/off/i)).toBeInTheDocument();

    fireEvent.click(toggle);

    expect(screen.getByText(/light/i)).toBeInTheDocument();
    expect(screen.getByText(/on/i)).toBeInTheDocument();
  });

  test("onClick fires", () => {
    const handler = vi.fn();

    render(<ToggleableButton onClick={handler}>Click Me!</ToggleableButton>);

    const button = screen.getByText(/me!/i);

    fireEvent.click(button);

    expect(handler).toHaveBeenCalledOnce();
  });
});
