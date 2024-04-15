import { describe, expect, test } from "vitest";
import { render, screen } from "@testing-library/react";
import { App } from "./app";

describe("App", () => {
  test("Hello there!", () => {
    render(<App />);

    const msg = screen.getByText(/hello there!/i);

    expect(msg).toBeInTheDocument();
  });
});
