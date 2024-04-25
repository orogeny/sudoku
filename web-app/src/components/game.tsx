import { useReducer } from "react";
import { Board } from "./board";
import { DigitPad } from "./digit_pad";
import { Cell, Digit, Level } from "../shared/common";
import { generatePuzzle } from "../shared/generate_puzzle";

type GameState = {
  level: Level;
  cells: Cell[];
  selectedDigit?: Digit;
  selectedIndex?: number;
};

type GameAction =
  | {
      type: "cell_clicked";
      payload: {
        cellIndex: number;
      };
    }
  | {
      type: "digit_clicked";
      payload: {
        digit: Digit;
      };
    };

function setupGame(level: Level): GameState {
  return {
    level,
    cells: generatePuzzle(level),
    selectedDigit: undefined,
    selectedIndex: undefined,
  };
}

function reducer(state: GameState, action: GameAction) {
  if (action.type === "cell_clicked") {
    if (
      state.selectedIndex === undefined ||
      state.selectedIndex !== action.payload.cellIndex
    ) {
      const selectedIndex = action.payload.cellIndex;

      const selectedCell = state.cells[selectedIndex];

      const selectedDigit =
        selectedCell.kind === "given" || selectedCell.kind === "proposed"
          ? selectedCell.digit
          : undefined;

      const newState = {
        ...state,
        selectedDigit,
        selectedIndex,
      };

      return newState;
    }

    const newState = {
      ...state,
      selectedDigit: undefined,
      selectedIndex: undefined,
    };

    return newState;
  }

  if (action.type === "digit_clicked") {
    if (
      state.selectedIndex === undefined ||
      state.cells[state.selectedIndex].kind === "given"
    ) {
      // Ignore digit pad if no cell selected or it was given
      return state;
    }

    // Replace existing cell value with new value
    const cell = state.cells[state.selectedIndex];

    if (cell.kind === "proposed" && cell.digit === action.payload.digit) {
      // Ignore when cell already contains that digit
      return state;
    }

    // Replace existing cell with proposed digit
    const proposed = {
      kind: "proposed",
      digit: action.payload.digit,
    } as Cell;

    const updatedCells = state.cells.map((c, i) => {
      if (i === state.selectedIndex) {
        return proposed;
      }
      return c;
    });

    const newState = {
      ...state,
      cells: updatedCells,
      selectedDigit: undefined,
      selectedIndex: undefined,
    };

    return newState;
  }

  return state;
}

function Game({ level }: { level: Level }) {
  const [state, dispatch] = useReducer(reducer, level, setupGame);

  const handleCellClick = (index: number) => {
    dispatch({ type: "cell_clicked", payload: { cellIndex: index } });
  };

  const handleDigitPadClick = (digit: Digit) => {
    dispatch({ type: "digit_clicked", payload: { digit } });
  };

  return (
    <div className="flex grow self-stretch">
      <div className="flex flex-col gap-4">
        <Board
          cells={state.cells}
          selectedDigit={state.selectedDigit}
          selectedIndex={state.selectedIndex}
          clickHandler={handleCellClick}
        />
        <DigitPad clickHandler={handleDigitPadClick} />
      </div>
    </div>
  );
}

export { Game, type GameState };
