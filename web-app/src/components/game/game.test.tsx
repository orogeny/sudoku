import { Digit } from "@/shared/digit";
import { Puzzle } from "@/shared/puzzle";
import "@testing-library/jest-dom/matchers";
import {
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from "@testing-library/react";
import { beforeEach, describe, expect, test } from "vitest";
import { Game } from "./game";

const PUZZLE: Puzzle = {
  givens:
    "9...1.248.1.65...........6.8.4.9..3.56....827.718....4......5.3..3.764.2.9..8....",
  solution:
    "956317248412658379738249165824795631569134827371862954647921583183576492295483716",
};

let TEST_GAME: ReturnType<typeof testSetup>;

beforeEach(() => {
  TEST_GAME = testSetup(PUZZLE);
});

function testSetup(puzzle: Puzzle) {
  render(<Game puzzle={puzzle} />);

  const cell = screen.getAllByTestId(/cell/);

  const digit = screen
    .getAllByRole("button", { name: /\b\d{1}\b/ })
    .reduce((acc, d, i) => {
      return {
        ...acc,
        [(i + 1).toString()]: d,
      };
    }, {}) as Record<Digit, HTMLElement>;

  const erase = screen.getByRole("button", { name: /erase/i });
  const notes = screen.getByRole("button", { name: /notes/i });
  const undo = screen.getByRole("button", { name: /undo/i });

  return {
    cell,
    digit,
    erase,
    notes,
    undo,
    screen,
  };
}

function digits(el: HTMLElement) {
  const inner = within(el).queryAllByText(/\b\d{1}\b/);

  return inner.map((x) => x.textContent).sort();
}

describe("Game", () => {
  test("should have initial given", () => {
    const { cell } = TEST_GAME;

    expect(digits(cell[0])).toEqual(["9"]);
  });

  test("should have initial empty", () => {
    const { cell } = TEST_GAME;

    expect(digits(cell[2])).toHaveLength(0);
  });
});

describe("digit toggled 'off'", () => {
  test("should have no effect on given cell's digit", () => {
    const { cell, digit } = TEST_GAME;

    fireEvent.click(cell[0]);
    fireEvent.click(digit["5"]);

    expect(cell[0]).toHaveTextContent("9");
  });

  test("should fill empty cell with proposed digit", () => {
    const { cell, digit } = TEST_GAME;

    fireEvent.click(cell[1]);
    fireEvent.click(digit["5"]);

    expect(cell[1]).toHaveTextContent("5");
  });

  test("should clear proposed cell when same digit clicked", () => {
    const { cell, digit } = TEST_GAME;

    fireEvent.click(cell[1]);
    fireEvent.click(digit["3"]);

    fireEvent.click(digit["3"]);

    expect(digits(cell[1])).toHaveLength(0);
  });

  test("should replace existing proposed cell with different digit", () => {
    const { cell, digit } = TEST_GAME;

    fireEvent.click(cell[1]);
    fireEvent.click(digit["3"]);

    fireEvent.click(digit["5"]);

    expect(cell[1]).not.toHaveTextContent("3");
    expect(cell[1]).toHaveTextContent("5");
  });

  test("should not allow duplicate digit in siblings", () => {
    const { cell, digit } = TEST_GAME;

    fireEvent.click(cell[2]);
    fireEvent.click(digit["1"]);

    expect(digits(cell[2])).toHaveLength(0);
  });
});

describe("digit toggled 'on'", () => {
  test("should fill cell-1 with '5'", () => {
    const { cell, digit } = TEST_GAME;

    fireEvent.click(digit["5"]);
    fireEvent.click(cell[1]);

    expect(cell[1]).toHaveTextContent("5");
  });

  test("should replace '3' in cell-1 with '5'", () => {
    const { cell, digit } = TEST_GAME;

    fireEvent.click(digit["3"]);
    fireEvent.click(cell[1]);

    expect(cell[1]).toHaveTextContent("3");

    fireEvent.click(digit["5"]);
    fireEvent.click(cell[1]);

    expect(cell[1]).toHaveTextContent("5");
  });

  test("should fill multiple cells with toggled digit", () => {
    const { cell, digit } = TEST_GAME;

    fireEvent.click(digit["5"]);

    fireEvent.click(cell[1]);
    fireEvent.click(cell[26]);

    expect(cell[1]).toHaveTextContent("5");
    expect(cell[26]).toHaveTextContent("5");
  });

  test("should not replace a given cell's digit", () => {
    const { cell, digit } = TEST_GAME;

    fireEvent.click(digit["5"]);
    fireEvent.click(cell[0]);

    expect(cell[0]).toHaveTextContent("9");
  });

  test("should untoggle digit when a given cell is clicked", () => {
    const { cell, digit } = TEST_GAME;

    fireEvent.click(digit["5"]);
    fireEvent.click(cell[0]);

    fireEvent.click(cell[1]);

    expect(cell[1]).not.toHaveTextContent("5");
  });

  test("should remove proposed digit from cell on second click", () => {
    const { cell, digit } = TEST_GAME;

    fireEvent.click(digit["3"]);
    fireEvent.click(cell[1]);
    fireEvent.click(cell[1]);

    expect(digits(cell[1])).toHaveLength(0);
  });

  test("should not allow new proposed digit to clash with siblings", () => {
    const { cell, digit } = TEST_GAME;

    fireEvent.click(digit["4"]);
    fireEvent.click(cell[2]);

    expect(digits(cell[2])).toHaveLength(0);
  });

  test("should not allow replacing proposed digit clashing with siblings", () => {
    const { cell, digit } = TEST_GAME;

    fireEvent.click(cell[3]);
    fireEvent.click(digit["3"]);

    fireEvent.click(digit["8"]);

    expect(cell[3]).toHaveTextContent("3");
  });
});

describe("notes toggled: on, digit toggled: on", () => {
  test("should not add note to a given cell", () => {
    const { cell, digit, notes } = TEST_GAME;

    fireEvent.click(notes);

    fireEvent.click(digit["1"]);
    fireEvent.click(cell[25]);

    expect(cell[25]).toHaveTextContent("6");
  });

  test("should not add note to a proposed cell", () => {
    const { cell, digit, notes } = TEST_GAME;

    fireEvent.click(digit["5"]);
    fireEvent.click(cell[26]);

    fireEvent.click(notes);

    fireEvent.click(digit["9"]);
    fireEvent.click(cell[26]);

    expect(cell[26]).toHaveTextContent("5");
    expect(cell[26]).not.toHaveTextContent("9");
  });

  test("should add a note to empty cell", () => {
    const { cell, digit, notes } = TEST_GAME;

    fireEvent.click(notes);
    fireEvent.click(digit["3"]);
    fireEvent.click(cell[1]);

    expect(cell[1]).toHaveTextContent("3");
  });

  test("should add 3 and 5 to note cell", () => {
    const { cell, digit, notes } = TEST_GAME;

    fireEvent.click(notes);
    fireEvent.click(digit["3"]);
    fireEvent.click(cell[1]);
    fireEvent.click(digit["5"]);
    fireEvent.click(cell[1]);

    expect(cell[1]).toHaveTextContent("35");
  });

  test("should remove note digit already present", () => {
    const { cell, digit, notes } = TEST_GAME;

    fireEvent.click(notes);
    fireEvent.click(digit["5"]);
    fireEvent.click(cell[1]);
    fireEvent.click(digit["6"]);
    fireEvent.click(cell[1]);
    fireEvent.click(digit["7"]);
    fireEvent.click(cell[1]);

    fireEvent.click(digit["6"]);
    fireEvent.click(cell[1]);

    expect(cell[1]).toHaveTextContent("57");
  });

  test("should empty note cell", () => {
    const { cell, digit, notes } = TEST_GAME;

    fireEvent.click(notes);

    fireEvent.click(digit["3"]);
    fireEvent.click(cell[1]);

    fireEvent.click(digit["5"]);
    fireEvent.click(cell[1]);

    fireEvent.click(digit["3"]);
    fireEvent.click(cell[1]);

    fireEvent.click(digit["5"]);
    fireEvent.click(cell[1]);

    expect(digits(cell[1])).toHaveLength(0);
  });

  test("clicking on given cell has no");
});

describe("notes toggled: on, digit toggled: off", () => {
  test("should not add note to a given cell", () => {
    const { cell, digit, notes } = TEST_GAME;

    fireEvent.click(notes);

    fireEvent.click(cell[25]);
    fireEvent.click(digit["1"]);

    expect(cell[25]).toHaveTextContent("6");
  });

  test("should not add note to a proposed cell", () => {
    const { cell, digit, notes } = TEST_GAME;

    fireEvent.click(cell[26]);
    fireEvent.click(digit["5"]);

    fireEvent.click(notes);

    fireEvent.click(digit["9"]);

    expect(cell[26]).toHaveTextContent("5");
    expect(cell[26]).not.toHaveTextContent("9");
  });

  test("should add a note to empty cell", () => {
    const { cell, digit, notes } = TEST_GAME;

    fireEvent.click(notes);

    fireEvent.click(cell[3]);
    fireEvent.click(digit["7"]);

    expect(cell[3]).toHaveTextContent("7");
  });

  test("should add 2 notes to empty cell", () => {
    const { cell, digit, notes } = TEST_GAME;

    fireEvent.click(notes);

    fireEvent.click(cell[3]);
    fireEvent.click(digit["3"]);
    fireEvent.click(digit["7"]);

    expect(cell[3]).toHaveTextContent("37");
  });
});

describe("prune proposed from sibling notes", () => {
  test("should remove new proposed digit from note", () => {
    const { cell, digit, notes } = TEST_GAME;

    fireEvent.click(notes);

    fireEvent.click(cell[1]);
    fireEvent.click(digit["3"]);
    fireEvent.click(digit["7"]);

    fireEvent.click(notes);

    fireEvent.click(cell[3]);
    fireEvent.click(digit["3"]);

    expect(cell[1]).toHaveTextContent("7");
    expect(cell[1]).not.toHaveTextContent("3");
  });

  test("should remove replacement proposed digit from note", () => {
    const { cell, digit, notes } = TEST_GAME;

    fireEvent.click(notes);

    fireEvent.click(cell[1]);
    fireEvent.click(digit["3"]);
    fireEvent.click(digit["7"]);

    fireEvent.click(notes);

    fireEvent.click(cell[3]);
    fireEvent.click(digit["3"]);
    fireEvent.click(digit["7"]);

    expect(digits(cell[1])).toHaveLength(0);
  });

  test("should prune multiple siblings", () => {
    const { cell, digit, notes } = TEST_GAME;

    fireEvent.click(notes);

    fireEvent.click(digit["5"]);
    fireEvent.click(cell[1]);

    fireEvent.click(digit["3"]);
    fireEvent.click(cell[1]);
    fireEvent.click(cell[5]);

    fireEvent.click(notes);

    fireEvent.click(cell[3]);

    expect(cell[1]).toHaveTextContent("5");
    expect(cell[1]).not.toHaveTextContent("3");

    expect(digits(cell[5])).toHaveLength(0);
  });

  test("should not prune unaffected note", () => {
    const { cell, digit, notes } = TEST_GAME;

    fireEvent.click(notes);

    fireEvent.click(cell[2]);
    fireEvent.click(digit["5"]);
    fireEvent.click(digit["6"]);

    fireEvent.click(notes);

    fireEvent.click(cell[5]);
    fireEvent.click(digit["7"]);

    expect(cell[2]).toHaveTextContent("56");
  });
});

describe("undo changes", () => {
  test("should initially do nothing", () => {
    const { cell, undo } = TEST_GAME;

    fireEvent.click(cell[1]);

    fireEvent.click(undo);

    expect(digits(cell[1])).toHaveLength(0);
  });

  test("should undo proposed cell", () => {
    const { cell, digit, undo } = TEST_GAME;

    fireEvent.click(cell[1]);
    fireEvent.click(digit["3"]);

    fireEvent.click(undo);

    expect(digits(cell[1])).toHaveLength(0);
  });

  test("should undo second proposed digit", () => {
    const { cell, digit, undo } = TEST_GAME;

    fireEvent.click(digit["3"]);
    fireEvent.click(cell[1]);

    fireEvent.click(digit["5"]);
    fireEvent.click(cell[1]);

    fireEvent.click(undo);

    expect(cell[1]).toHaveTextContent("3");
  });

  test("should restore double clicked proposal", () => {
    const { cell, digit, undo } = TEST_GAME;

    fireEvent.click(digit["5"]);
    fireEvent.click(cell[1]);
    fireEvent.click(cell[1]);

    expect(digits(cell[1])).toHaveLength(0);

    fireEvent.click(undo);

    expect(cell[1]).toHaveTextContent("5");
  });

  test("should undo deletion by double click", () => {
    const { cell, digit, undo } = TEST_GAME;

    fireEvent.click(cell[1]);
    fireEvent.click(digit["5"]);
    fireEvent.click(digit["5"]);

    fireEvent.click(undo);

    expect(cell[1]).toHaveTextContent("5");
  });

  test("should empty note", () => {
    const { cell, digit, notes, undo } = TEST_GAME;

    fireEvent.click(cell[1]);

    fireEvent.click(notes);

    fireEvent.click(digit["3"]);
    fireEvent.click(digit["5"]);

    fireEvent.click(undo);
    fireEvent.click(undo);

    expect(digits(cell[1])).toHaveLength(0);
  });

  test("should revert proposed back to notes", () => {
    const { cell, digit, notes, undo } = TEST_GAME;

    fireEvent.click(cell[2]);

    fireEvent.click(notes);
    fireEvent.click(digit["5"]);
    fireEvent.click(digit["7"]);

    fireEvent.click(notes);
    fireEvent.click(digit["6"]);

    fireEvent.click(undo);

    expect(cell[2]).toHaveTextContent("57");
  });
});

describe("erase", () => {
  test("should not erase given cell", () => {
    const { cell, erase } = TEST_GAME;

    fireEvent.click(erase);

    fireEvent.click(cell[0]);

    expect(cell[0]).toHaveTextContent("9");
  });

  test("should erase a proposed cell", () => {
    const { cell, digit, erase } = TEST_GAME;

    fireEvent.click(cell[1]);
    fireEvent.click(digit["3"]);
    fireEvent.click(erase);

    expect(digits(cell[1])).toHaveLength(0);
  });

  test("should erase a note cell", () => {
    const { cell, digit, erase, notes } = TEST_GAME;

    fireEvent.click(notes);
    fireEvent.click(cell[1]);
    fireEvent.click(digit["3"]);
    fireEvent.click(digit["5"]);

    fireEvent.click(erase);

    expect(digits(cell[1])).toHaveLength(0);
  });

  test("should work with undo", () => {
    const { cell, digit, erase, undo } = TEST_GAME;

    fireEvent.click(cell[1]);
    fireEvent.click(digit["3"]);
    fireEvent.click(erase);

    fireEvent.click(undo);

    expect(cell[1]).toHaveTextContent("3");
  });

  test("should erase multiple cells when toggled: on", async () => {
    const { cell, digit, erase } = TEST_GAME;

    fireEvent.click(digit["9"]);
    fireEvent.click(cell[23]);
    fireEvent.click(cell[17]);
    fireEvent.click(digit["9"]);

    fireEvent.click(erase);

    fireEvent.click(cell[17]);

    expect(digits(cell[17])).toHaveLength(0);

    fireEvent.click(cell[0]);

    await waitFor(() => {
      expect(cell[0]).toHaveTextContent("9");

      fireEvent.click(cell[23]);

      expect(digits(cell[23])).toHaveLength(0);
    });
  });

  test("toggling notes on should toggle off erase", () => {
    const { cell, digit, erase, notes } = TEST_GAME;

    fireEvent.click(erase);

    fireEvent.click(notes);
    fireEvent.click(cell[3]);
    fireEvent.click(digit["3"]);

    expect(cell[3]).toHaveTextContent("3");
  });

  test("should toggle Erase off when a digit is toggled: on", () => {
    const { cell, digit, erase } = TEST_GAME;

    fireEvent.click(erase);

    fireEvent.click(digit["5"]);
    fireEvent.click(cell[1]);

    expect(cell[1]).toHaveTextContent("5");
  });

  test("should not toggle Erase on when trying to erase a given cell", () => {
    const { cell, digit, erase } = TEST_GAME;

    fireEvent.click(cell[1]);
    fireEvent.click(digit["5"]);

    fireEvent.click(cell[0]);
    fireEvent.click(erase);

    fireEvent.click(cell[1]);

    expect(cell[1]).toHaveTextContent("5");
  });
});
