import { useReducer } from "react";
import { Board } from "./board";
import { DigitPad } from "./digit_pad";
import { Cell, Digit, Level } from "../shared/common";
import { generatePuzzle } from "../shared/generate_puzzle";
import { cellDigit } from "../shared/cell_digit";

type GameState = {
  cells: Cell[];
  selectedDigit?: Digit;
  selectedIndex?: number;
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
    };

function setup(level: Level) {
  return {
    cells: generatePuzzle(level),
    selectedDigit: undefined,
    selectedIndex: undefined,
  } as GameState;
}

function deducer(state: GameState, action: GameAction) {
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

    const updatedCells = cells.map((c, i) => {
      if (selectedIndex === i) {
        return { kind: "proposed", digit } as Cell;
      }
      return c;
    });

    return {
      ...state,
      cells: updatedCells,
      selectedDigit: undefined,
      selectedIndex: undefined,
    };
  }

  return state;
}

function Game({ level }: { level: Level }) {
  const [state, dispatch] = useReducer(deducer, level, setup);

  const handleCellClick = (index: number) => {
    dispatch({ type: "cell_clicked", payload: { index } });
  };

  const handleDigitPadClick = (digit: Digit) => {
    dispatch({ type: "digit_clicked", payload: { digit } });
  };

  return (
    <div className="flex flex-col items-center gap-4">
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
