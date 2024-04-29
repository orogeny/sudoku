import { useReducer } from "react";
import { cellDigit } from "../shared/cell_digit";
import { Cell, Digit, digitsFromString, isDigit } from "../shared/common";
import { Board } from "./board/board";
import { DigitPad } from "./digit_pad";
import { ToggleableButton } from "./toggleable_button";

type GameState = {
  cells: Cell[];
  selectedDigit?: Digit;
  selectedIndex?: number;
  notesToggled: boolean;
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
      type: "notes_toggled";
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
        // Clear selection but hightlight existing proposed digit
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
    const updatedCells = cells.map((c, i) => {
      if (selectedIndex === i) {
        return { kind: "proposed", digit } as Cell;
      }
      return c;
    });

    return {
      ...state,
      cells: updatedCells,
    };
  }

  // ---------- notes_toggled ----------

  if (type === "notes_toggled") {
    return { ...state, notesToggled: !state.notesToggled };
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

  return (
    <div className="flex flex-col items-center gap-4 pt-4">
      <div className="ml-10 flex flex-row justify-start gap-2 self-stretch">
        <ToggleableButton
          className="flex flex-row justify-between gap-4 py-3"
          onClick={handleNotesClick}
        >
          Notes
        </ToggleableButton>
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
