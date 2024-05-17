import { Cell, siblingsOf } from "@/shared/cell";
import { Digit, isDigit } from "@/shared/digit";
import { Puzzle } from "@/shared/puzzle";
import { Stack } from "@/shared/stack";

type CellNotification = {
  index: number;
  reason: Cell[keyof Cell] | "clash";
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

function updateAndPrune(
  state: GameState,
  index: number,
  digit: Digit,
): GameState {
  // 1. check for sibling clash
  const siblings = siblingsOf(index);

  const siblingDigits = Array.from(siblings).reduce((acc, si) => {
    const sibling = state.cells[si];

    return sibling.kind === "note" ? acc : acc.add(sibling.digit);
  }, new Set<Digit>());

  if (siblingDigits.has(digit)) {
    return {
      ...state,
      notification: { index, reason: "clash" },
    };
  }

  // 2. find all sibling notes that will be pruned
  const prunableSiblings = Array.from(siblings)
    .map((si) => ({ index: si, cell: state.cells[si] }))
    .filter((item) => item.cell.kind === "note" && item.cell.digits.has(digit));

  const changes = state.changes
    .pushAll(prunableSiblings)
    .push({ index, cell: state.cells[index] });

  // 3. replace empty cell with proposed digit and prune sibling notes
  const updatedCells: Cell[] = state.cells.map((cell, i) => {
    if (index === i) {
      return { kind: "proposed", digit };
    }
    if (siblings.has(i) && cell.kind === "note" && cell.digits.has(digit)) {
      const digits = new Set(cell.digits);

      digits.delete(digit);

      return { kind: "note", digits };
    }
    return cell;
  });

  return {
    ...state,
    cells: updatedCells,
    highlightDigit: digit,
    changes,
  };
}

function fillCell(state: GameState, index: number, digit: Digit): GameState {
  const selectedCell = state.cells[index];

  if (selectedCell.kind === "given") {
    // clicking a given should highlight the given digit
    return {
      ...state,
      selectedIndex: index,
      toggledDigit: undefined,
      highlightDigit: selectedCell.digit,
    };
  }

  if (selectedCell.kind === "proposed") {
    if (state.notesToggled) {
      // trying to put notes in a proposed cell should briefly flash gray
      return {
        ...state,
        notification: { index, reason: "proposed" },
      };
    }

    if (selectedCell.digit === digit) {
      // remove proposed digit from cell when digit clicked a second time
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
        changes: state.changes.push({ index, cell: state.cells[index] }),
      };
    }

    // replace cell's existing proposed digit
    return updateAndPrune(state, index, digit);
  }

  if (selectedCell.kind === "note") {
    if (state.notesToggled) {
      // add/remove digit from note
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
        changes: state.changes.push({ index, cell: state.cells[index] }),
      };
    }

    // set empty cell's proposed value
    return updateAndPrune(state, index, digit);
  }

  throw new Error(`Unknown cell type: ${selectedCell.kind}`);
}

function gameReducer(state: GameState, action: GameAction): GameState {
  if (action.type === "notification_cleared") {
    return { ...state, notification: undefined };
  }

  if (state.notification) {
    return state;
  }

  if (action.type === "notes_button_clicked") {
    return {
      ...state,
      notesToggled: !state.notesToggled,
    };
  }

  if (action.type === "undo_button_clicked") {
    const { item, rest } = state.changes.pop();

    if (item) {
      const updatedCells = state.cells.map((cell, i) => {
        if (item.index === i) {
          return item.cell;
        }
        return cell;
      });

      return {
        ...state,
        cells: updatedCells,
        changes: rest,
      };
    }

    // no changes to undo
    return state;
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

  throw new Error(`Unhandled action: ${action.type}`);
}

export { gameReducer, setup, type GameAction, type GameState };
