import { Level } from "../../shared/common";
import { Stack } from "../../shared/stack";

const DIGITS = ["1", "2", "3", "4", "5", "6", "7", "8", "9"] as const;

type Digit = (typeof DIGITS)[number];

function isDigit(value: unknown): value is Digit {
  return (
    typeof value === "string" &&
    value.length === 1 &&
    value >= "1" &&
    value <= "9"
  );
}

type Puzzle = {
  givens: string;
  solution: string;
};

type CellNotification = {
  index: number;
  reason: Cell[keyof Cell] | "clash";
};

type Cell =
  | {
      kind: "given" | "proposed";
      digit: Digit;
    }
  | {
      kind: "note";
      digits: Set<Digit>;
    };

type GameState = {
  cells: Cell[];
  solution: string;
  toggledDigit?: Digit;
  highlightDigit?: Digit;
  selectedIndex?: number;
  notification?: CellNotification;
  notesToggled: boolean;
  changes: Stack<{ index: number; cell: Cell }>;
};

type GameAction =
  | {
      type:
        | "notification_cleared"
        | "notes_button_clicked"
        | "undo_button_clicked";
    }
  | {
      type: "cell_clicked";
      payload: { index: number };
    }
  | {
      type: "digit_button_clicked";
      payload: { digit: Digit };
    };

function setup(puzzle: Puzzle) {
  const { givens, solution } = puzzle;

  const cells: Cell[] = givens
    .split("")
    .map((char) =>
      isDigit(char)
        ? { kind: "given", digit: char }
        : { kind: "note", digits: new Set<Digit>() },
    );

  return {
    cells,
    solution,
    toggledDigit: undefined,
    highlightDigit: undefined,
    selectedIndex: undefined,
    notification: undefined,
    notesToggled: false,
    changes: new Stack<{ index: number; cell: Cell }>(),
  };
}

function generatePuzzle(difficulty: Level) {
  if (difficulty !== "Hard") {
    return { givens: "", solution: "" };
  }

  return {
    givens:
      "9...1.248.1.65...........6.8.4.9..3.56....827.718....4......5.3..3.764.2.9..8....",
    solution:
      "956317248412658379738249165824795631569134827371862954647921583183576492295483716",
  };
}

function cellSiblings(index?: number) {
  if (index === undefined) return new Set<number>();

  const column = index % 9;
  const row = Math.floor(index / 9);
  const square = Math.floor(index / 27) * 3 + Math.floor((index % 9) / 3);

  const columnSiblings = Array.from({ length: 9 }).map(
    (_, i) => column + i * 9,
  );
  const rowSiblings = Array.from({ length: 9 }).map((_, i) => row * 9 + i);
  const squareSiblings = Array.from({ length: 9 }).map(
    (_, i) =>
      Math.floor(square / 3) * 27 +
      (square % 3) * 3 +
      (i % 3) +
      Math.floor(i / 3) * 9,
  );

  const siblingIndices = new Set([
    ...columnSiblings,
    ...rowSiblings,
    ...squareSiblings,
  ]);

  siblingIndices.delete(index);

  return siblingIndices;
}

function filledDigits(cells: Array<Cell>) {
  return cells.reduce(
    (acc, cell) => (cell.kind === "note" ? acc : acc.add(cell.digit)),
    new Set<Digit>(),
  );
}

function fillCell(state: GameState, index: number, digit: Digit): GameState {
  const selectedCell = state.cells[index];

  // console.log(`fillCell: cell-${index} with "${digit}"`);

  if (selectedCell.kind === "given") {
    return {
      ...state,
      selectedIndex: index,
      toggledDigit: undefined,
      highlightDigit: selectedCell.digit,
    };
  }

  if (selectedCell.kind === "proposed") {
    if (state.notesToggled) {
      return {
        ...state,
        notification: { index, reason: "proposed" },
      };
    }

    if (selectedCell.digit === digit) {
      const updatedCells: Cell[] = state.cells.map((cell, i) => {
        if (index === i) {
          return { kind: "note", digits: new Set<Digit>() };
        }
        return cell;
      });

      return {
        ...state,
        cells: updatedCells,
        selectedIndex: undefined,
        highlightDigit: undefined,
      };
    }

    const updatedCells: Cell[] = state.cells.map((cell, i) => {
      if (index === i) {
        return { kind: "proposed", digit };
      }
      return cell;
    });

    return {
      ...state,
      cells: updatedCells,
      selectedIndex: index,
      highlightDigit: digit,
    };
  }

  if (state.notesToggled) {
    const updatedCells: Cell[] = state.cells.map((cell, i) => {
      if (index === i && cell.kind === "note") {
        const digits = new Set(cell.digits);

        if (!digits.delete(digit)) {
          digits.add(digit);
        }

        return { ...cell, digits };
      }
      return cell;
    });

    return {
      ...state,
      cells: updatedCells,
    };
  }

  const updatedCells: Cell[] = state.cells.map((cell, i) => {
    if (index === i) {
      return { kind: "proposed", digit };
    }
    return cell;
  });

  return {
    ...state,
    cells: updatedCells,
    highlightDigit: digit,
  };
}

function gameReducer(state: GameState, action: GameAction): GameState {
  if (action.type === "notification_cleared") {
    return { ...state, notification: undefined };
  }

  if (state.notification) {
    console.log("we have notification:", state.notification);
    return state;
  }

  if (action.type === "notes_button_clicked") {
    return {
      ...state,
      notesToggled: !state.notesToggled,
    };
  }

  if (action.type === "digit_button_clicked") {
    if (state.selectedIndex) {
      return fillCell(state, state.selectedIndex, action.payload.digit);
    }

    if (state.toggledDigit === action.payload.digit) {
      return {
        ...state,
        toggledDigit: undefined,
        highlightDigit: undefined,
      };
    }

    return {
      ...state,
      toggledDigit: action.payload.digit,
      highlightDigit: action.payload.digit,
    };
  }

  if (action.type === "cell_clicked") {
    // console.log(`cell-${action.payload.index} clicked`);

    if (state.toggledDigit) {
      return fillCell(state, action.payload.index, state.toggledDigit);
    }

    if (state.selectedIndex === action.payload.index) {
      return {
        ...state,
        selectedIndex: undefined,
        highlightDigit: undefined,
      };
    }

    const selectedCell = state.cells[action.payload.index];

    const highlightDigit =
      selectedCell.kind === "note" ? undefined : selectedCell.digit;

    return {
      ...state,
      selectedIndex: action.payload.index,
      highlightDigit,
    };
  }

  throw new Error(`unhandled action: ${action.type}`);

  // if (action.type === "digit_button_clicked") {
  //   if (state.selectedIndex === undefined) {
  //     // we need to toggle a digit button
  //     if (state.toggledDigit === action.payload.digit) {
  //       // untoggle this digit button
  //       return { ...state, toggledDigit: undefined };
  //     }
  //     // Otherwise, toggle the selected digit button
  //     return { ...state, toggledDigit: action.payload.digit };
  //   }

  //   // A cell is currently selected
  //   const selectedCell = state.cells[state.selectedIndex];

  //   if (selectedCell.kind === "given") {
  //     return {
  //       ...state,
  //       selectedIndex: undefined,
  //       toggledDigit: selectedCell.digit,
  //       highlightDigit: action.payload.digit,
  //     };
  //   }
  // }

  // if (action.type === "cell_clicked") {
  //   const clickedCell = state.cells[action.payload.index];

  //   console.log(
  //     `cell[${action.payload.index}]:${clickedCell.kind} - "${clickedCell.kind !== "note" ? clickedCell.digit : "N"}"`,
  //   );

  //   if (state.toggledDigit === undefined) {
  //     if (clickedCell.kind === "given" || clickedCell.kind === "proposed") {
  //       return {
  //         ...state,
  //         selectedIndex: action.payload.index,
  //         highlightDigit: clickedCell.digit,
  //       };
  //     }
  //   }

  //   if (state.toggledDigit !== undefined) {
  //     // attempt to fill cell with digit pressed
  //     if (clickedCell.kind === "given") {
  //       return {
  //         ...state,
  //         selectedIndex: action.payload.index,
  //         highlightDigit: clickedCell.digit,
  //         toggledDigit: undefined,
  //       };
  //     }

  //     const updatedCells = state.cells.map((cell, index) => {
  //       if (index === action.payload.index) {
  //         return { kind: "proposed", digit: state.toggledDigit } as Cell;
  //       }
  //       return cell;
  //     });

  //     return { ...state, cells: updatedCells };
  //   }
  // }
}

export {
  DIGITS,
  cellSiblings,
  filledDigits,
  gameReducer,
  generatePuzzle,
  isDigit,
  setup,
  type Cell,
  type Digit,
  type GameAction,
  type GameState,
  type Puzzle,
};
