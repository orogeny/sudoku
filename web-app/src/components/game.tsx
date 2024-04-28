import { useReducer } from "react";
import { cellDigit } from "../shared/cell_digit";
import { Cell, Digit, digitsFromString, isDigit } from "../shared/common";
import { Board } from "./board/board";
import { DigitPad } from "./digit_pad";
import { ToggleableButton } from "./toggleable_button";
import { Stack } from "../shared/stack";
import { number } from "zod";

type GameState = {
  cells: Cell[];
  selectedDigit?: Digit;
  selectedIndex?: number;
  notesToggled: boolean;
  changes: Stack<{ index: number; cell: Cell }>;
};

type GameAction =
  | {
      type: "cell_clicked";
      payload: {
        index: number;
      };
    }
  | {
      type: "digit_clicked";
      payload: {
        digit: Digit;
      };
    }
  | {
      type: "notes_toggled" | "undo_clicked";
    };

type Change = {
  index: number;
  cell: Cell;
};

function setup(puzzle: string) {
  const cells = digitsFromString(puzzle).map((d) => {
    if (isDigit(d)) {
      return { kind: "given", digit: d };
    }
    return { kind: "empty" };
  }) as Cell[];

  return {
    cells,
    selectedDigit: undefined,
    selectedIndex: undefined,
    notesToggled: false,
    changes: new Stack<Change>(),
  } as GameState;
}

function reducer(state: GameState, action: GameAction) {
  const { type } = action;

  // ---------- cell_clicked ----------

  if (type === "cell_clicked") {
    const { index } = action.payload;
    const { cells, selectedIndex } = state;

    if (selectedIndex === index) {
      return { ...state, selectedDigit: undefined, selectedIndex: undefined };
    }

    return {
      ...state,
      selectedDigit: cellDigit(cells, index),
      selectedIndex: index,
    };
  }

  // ---------- digit_clicked ----------

  if (type === "digit_clicked") {
    const { digit } = action.payload;
    const { cells, selectedIndex } = state;

    if (selectedIndex === undefined) {
      return state;
    }

    // We have a cell selected, should we replace its digit
    const cell = cells[selectedIndex];

    if (cell.kind === "given") {
      // Clear selection but highlight given digit
      return {
        ...state,
        selectedDigit: digit,
        selectedIndex: undefined,
      };
    }

    if (state.notesToggled) {
      if (cell.kind === "proposed") {
        // Clear selection but highlight existing proposed digit
        return {
          ...state,
          selectedDigit: digit,
          selectedIndex: undefined,
        };
      }

      const notes =
        cell.kind === "note" ? new Set(cell.digits) : new Set<Digit>();

      notes.has(digit) ? notes.delete(digit) : notes.add(digit);

      const updatedCells = cells.map((c, i) => {
        if (selectedIndex === i) {
          return { kind: "note", digits: notes } as Cell;
        }
        return c;
      });

      return {
        ...state,
        cells: updatedCells,
      };
    }

    // We are not taking notes and cell isn't given, so replace cell
    const proposed = { kind: "proposed", digit } as Cell;

    const replaced = { index: selectedIndex, cell: state.cells[selectedIndex] };

    console.log("replaced:", replaced);
    console.log("with:", proposed);

    const updatedChanges = state.changes.push(replaced);

    console.log("changes:", updatedChanges.traverse());

    const updatedCells = cells.map((c, i) =>
      selectedIndex === i ? proposed : c,
    );

    return {
      ...state,
      cells: updatedCells,
      changes: updatedChanges,
    };
  }

  // ---------- notes_toggled ----------

  if (type === "notes_toggled") {
    return { ...state, notesToggled: !state.notesToggled };
  }

  // ---------- undo_clicked ----------

  if (type === "undo_clicked") {
    const { item, rest } = state.changes.pop();

    if (item) {
      const updatedCells = state.cells.map((c, i) =>
        item.index === i ? item.cell : c,
      );

      return {
        ...state,
        cells: updatedCells,
        changes: rest,
      };
    }
  }

  return state;
}

function Game({ puzzle }: { puzzle: string }) {
  const [state, dispatch] = useReducer(reducer, puzzle, setup);

  const handleCellClick = (index: number) => {
    dispatch({ type: "cell_clicked", payload: { index } });
  };

  const handleDigitPadClick = (digit: Digit) => {
    dispatch({ type: "digit_clicked", payload: { digit } });
  };

  const handleNotesClick = () => {
    dispatch({ type: "notes_toggled" });
  };

  const handleUndoClick = () => {
    dispatch({ type: "undo_clicked" });
  };

  return (
    <div className="flex flex-col items-center gap-4 pt-4">
      <div className="ml-10 flex flex-row justify-start gap-2 self-stretch">
        <ToggleableButton
          className="flex flex-row justify-between gap-4 py-3"
          onClick={handleNotesClick}
        >
          Notes
        </ToggleableButton>
        <button onClick={handleUndoClick}>Undo</button>
      </div>
      <Board
        cells={state.cells}
        selectedDigit={state.selectedDigit}
        selectedIndex={state.selectedIndex}
        clickHandler={handleCellClick}
      />
      <DigitPad clickHandler={handleDigitPadClick} />
    </div>
  );
}

export { Game, type GameState };
