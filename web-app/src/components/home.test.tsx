import { describe, expect, test } from "vitest";
import { screen, render } from "@testing-library/react";
import { Home } from "./home";

describe("home", () => {
  test("hello", () => {
    render(<Home />);

    const msg = screen.getByText(/hello/i);

    expect(msg).toBeInTheDocument();

    screen.debug();
  });
});
