import { useReducer } from "react";
import { cellDigit } from "../../shared/cell_digit";
import { Cell, Digit, isDigit } from "../../shared/common";
import { Stack } from "../../shared/stack";
import { Board } from "../board/board";
import { DigitPad } from "../digit_pad";
import { ToggleableButton } from "../toggleable_button";

type Change = {
  index: number;
  cell: Cell;
};

type GameState = {
  cells: Cell[];
  highlightDigit?: Digit;
  selectedIndex?: number;
  notesToggled: boolean;
  changes: Stack<Change>;
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

function setup(puzzle: string) {
  const cells = puzzle.split("").map((d) => {
    if (isDigit(d)) {
      return { kind: "given", digit: d } as Cell;
    }
    return { kind: "empty" } as Cell;
  });

  return {
    cells,
    highlightDigit: undefined,
    selectedIndex: undefined,
    notesToggled: false,
    changes: new Stack<Change>(),
  };
}

function reducer(state: GameState, action: GameAction) {
  // ---------- cell_clicked ----------

  if (action.type === "cell_clicked") {
    if (state.selectedIndex === action.payload.index) {
      // Cell was selected, so deselect it
      return {
        ...state,
        selectedDigit: undefined,
        selectedIndex: undefined,
      };
    }

    // Otherwise select the cell and highlight its digit, if any
    return {
      ...state,
      highlightDigit: cellDigit(state.cells, action.payload.index),
      selectedIndex: action.payload.index,
    };
  }

  // ---------- digit_clicked ----------

  if (action.type === "digit_clicked") {
    if (state.selectedIndex === undefined) {
      // no cell is selected, there are no changes
      return state;
    }

    // We have a cell selected...

    if (state.cells[state.selectedIndex].kind === "given") {
      // Clear selection but highlight given digit
      return {
        ...state,
        highlightDigit: action.payload.digit,
        selectedIndex: undefined,
      };
    }

    if (state.cells[state.selectedIndex].kind === "empty") {
      if (state.notesToggled) {
        const updatedChanges = state.changes.push({
          index: state.selectedIndex,
          cell: state.cells[state.selectedIndex],
        });

        const updatedCells = state.cells.map((c, i) => {
          if (state.selectedIndex === i) {
            return { kind: "note", digits: action.payload.digit as string };
          }
          return c;
        }) as Cell[];

        return {
          ...state,
          cells: updatedCells,
          changes: updatedChanges,
        };
      }

      const updatedChanges = state.changes.push({
        index: state.selectedIndex,
        cell: state.cells[state.selectedIndex],
      });

      const updatedCells = state.cells.map((c, i) => {
        if (state.selectedIndex === i) {
          return { kind: "proposed", digit: action.payload.digit };
        }
        return c;
      }) as Cell[];

      return {
        ...state,
        cells: updatedCells,
        changes: updatedChanges,
      };
    }

    if (state.cells[state.selectedIndex].kind === "proposed") {
      if (state.notesToggled) {
        // highlight the cell's digit
        return {
          ...state,
          highlightDigit: action.payload.digit,
        };
      }

      // Replace existing proposed digit with a new one
      const updatedChanges = state.changes.push({
        index: state.selectedIndex,
        cell: state.cells[state.selectedIndex],
      });

      const updatedCells = state.cells.map((c, i) => {
        if (state.selectedIndex === i) {
          return { kind: "proposed", digit: action.payload.digit };
        }
        return c;
      }) as Cell[];

      return {
        ...state,
        cells: updatedCells,
        changes: updatedChanges,
      };
    }

    if (state.cells[state.selectedIndex].kind === "note") {
      if (state.notesToggled) {
        // add/remove digit from note
        const updatedChanges = state.changes.push({
          index: state.selectedIndex,
          cell: state.cells[state.selectedIndex],
        });

        const updatedCells = state.cells.map((c, i) => {
          if (state.selectedIndex === i) {
            const cell = state.cells[state.selectedIndex] as {
              kind: "note";
              digits: string;
            };

            const notes = cell.digits.includes(action.payload.digit)
              ? cell.digits.replace(action.payload.digit, "")
              : cell.digits.concat(action.payload.digit);

            return { kind: "note", digits: notes } as Cell;
          }
          return c;
        });

        return {
          ...state,
          cells: updatedCells,
          changes: updatedChanges,
        };
      }

      const updatedChanges = state.changes.push({
        index: state.selectedIndex,
        cell: state.cells[state.selectedIndex],
      });

      const updatedCells = state.cells.map((c, i) => {
        if (state.selectedIndex === i) {
          return { kind: "proposed", digit: action.payload.digit };
        }
        return c;
      }) as Cell[];

      return {
        ...state,
        cells: updatedCells,
        changes: updatedChanges,
      };
    }
  } // end of digit_clicked

  // ---------- notes_toggled ----------

  if (action.type === "notes_toggled") {
    return { ...state, notesToggled: !state.notesToggled };
  }

  // ---------- undo_clicked ----------

  if (action.type === "undo_clicked") {
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
        selectedDigit={state.highlightDigit}
        selectedIndex={state.selectedIndex}
        clickHandler={handleCellClick}
      />
      <DigitPad clickHandler={handleDigitPadClick} />
    </div>
  );
}

export { Game, type GameState };
