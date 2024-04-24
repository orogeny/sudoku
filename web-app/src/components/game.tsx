import { useReducer } from "react";
import {
  Cell,
  Digit,
  Level,
  generatePuzzle,
  siblingsOf,
} from "./../utils/generate_puzzle";
import { Board } from "./board";
import { DigitPad } from "./digit_pad";

type GameState = {
  level: Level;
  cells: Cell[];
  selectedDigit?: Digit;
  selectedIndex?: number;
  siblings: Set<number>;
};

type GameAction = {
  type: "cell_clicked";
  payload: {
    cellIndex: number;
  };
};

function setupGame(level: Level): GameState {
  return {
    level,
    cells: generatePuzzle(level),
    selectedDigit: undefined,
    selectedIndex: undefined,
    siblings: new Set<number>(),
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
        siblings: siblingsOf(selectedIndex),
      };

      return newState;
    } else {
      const newState = {
        ...state,
        selectedDigit: undefined,
        selectedIndex: undefined,
        siblings: new Set<number>(),
      };

      return newState;
    }
  }

  return state;
}

function Game({ level }: { level: Level }) {
  const [state, dispatch] = useReducer(reducer, level, setupGame);

  const handleCellClick = (index: number) => {
    dispatch({ type: "cell_clicked", payload: { cellIndex: index } });
  };

  return (
    <div className="flex grow self-stretch">
      <div className="flex flex-col gap-4">
        <Board game={state} cellClickHandler={handleCellClick} />
        <DigitPad />
      </div>
    </div>
  );
}

export { Game, type GameState };
