import { useReducer, useState } from "react";
import { cellDigit } from "../../shared/cell_digit";
import { cellSiblings } from "../../shared/cell_siblings";
import { cn } from "../../shared/cn";
import { Cell, DIGITS, Digit, isDigit } from "../../shared/common";
import { Stack } from "../../shared/stack";
import { Button, DigitButton, ToggleableButton } from "./buttons";

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
  //
  // ---------- cell_clicked ----------
  //
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

  //
  // ---------- digit_clicked ----------
  //
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
      } // end of addning note to cell

      //
      // Place proposed digit into an empty cell
      //

      const siblingIndices = cellSiblings(state.selectedIndex);

      siblingIndices.delete(state.selectedIndex);

      const prunableIndices = Array.from(siblingIndices)
        .filter((si) => state.cells[si].kind === "note")
        .filter((si) => {
          const cell = state.cells[si] as Cell;
          if (cell.kind !== "note") return false;

          return cell.digits.includes(action.payload.digit);
        });

      const change = state.changes.push({
        index: state.selectedIndex,
        cell: state.cells[state.selectedIndex],
      });

      const updatedCells = state.cells.map((c, i) => {
        if (state.selectedIndex === i) {
          return { kind: "proposed", digit: action.payload.digit };
        }
        if (prunableIndices.includes(i) && c.kind === "note") {
          const notes = c.digits.includes(action.payload.digit)
            ? c.digits.replace(action.payload.digit, "")
            : c.digits.concat(action.payload.digit);

          if (notes.length === 0) {
            return { kind: "empty" };
          }
          return { kind: "note", digits: notes };
        }
        return c;
      }) as Cell[];

      return {
        ...state,
        cells: updatedCells,
        changes: change.pushAll(
          prunableIndices.map((pi) => ({
            index: pi,
            cell: state.cells[pi],
          })),
        ),
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

      //
      // Place proposed digit into a cell with an existing proposed digit
      //

      const existingCell = state.cells[state.selectedIndex];
      if (
        existingCell.kind === "proposed" &&
        existingCell.digit === action.payload.digit
      ) {
        // ignore proposing same digit multiple times
        return state;
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

      //
      // Replace note with proposed digit
      //

      const siblingIndices = cellSiblings(state.selectedIndex);

      siblingIndices.delete(state.selectedIndex);

      const prunableIndices = Array.from(siblingIndices)
        .filter((si) => state.cells[si].kind === "note")
        .filter((si) => {
          const cell = state.cells[si] as Cell;
          if (cell.kind !== "note") return false;

          return cell.digits.includes(action.payload.digit);
        });

      const change = state.changes.push({
        index: state.selectedIndex,
        cell: state.cells[state.selectedIndex],
      });

      const updatedCells = state.cells.map((c, i) => {
        if (state.selectedIndex === i) {
          return { kind: "proposed", digit: action.payload.digit };
        }
        if (prunableIndices.includes(i) && c.kind === "note") {
          const notes = c.digits.includes(action.payload.digit)
            ? c.digits.replace(action.payload.digit, "")
            : c.digits.concat(action.payload.digit);

          if (notes.length === 0) {
            return { kind: "empty" };
          }
          return { kind: "note", digits: notes };
        }
        return c;
      }) as Cell[];

      return {
        ...state,
        cells: updatedCells,
        changes: change.pushAll(
          prunableIndices.map((pi) => ({
            index: pi,
            cell: state.cells[pi],
          })),
        ),
      };
    }
  } // end of digit_clicked

  //
  // ---------- notes_toggled ----------
  //
  if (action.type === "notes_toggled") {
    return { ...state, notesToggled: !state.notesToggled };
  }

  //
  // ---------- undo_clicked ----------
  //
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
  const [eraseMode, setEraseMode] = useState(false);

  const siblings = cellSiblings(state.selectedIndex);

  const handleCellClick = (index: number) => {
    dispatch({ type: "cell_clicked", payload: { index } });
  };

  const handleDigitClick = (digit: Digit) => {
    dispatch({ type: "digit_clicked", payload: { digit } });
  };

  const handleNotesClick = () => {
    dispatch({ type: "notes_toggled" });
  };

  const handleUndoClick = () => {
    dispatch({ type: "undo_clicked" });
  };

  return (
    <>
      <main className="mx-auto flex min-w-[576px] max-w-[640px] flex-col gap-6 xl:max-w-fit xl:flex-row xl:gap-8">
        <div className="grid grid-cols-4 gap-4 xl:order-2 xl:grid-cols-2 xl:gap-6 xl:self-end">
          <ToggleableButton
            className="xl:order-3"
            onClick={handleNotesClick}
            toggled={state.notesToggled}
          >
            <span>Notes</span>
            <span>{state.notesToggled ? "on" : "off"}</span>
          </ToggleableButton>

          <Button className="xl:order-1" onClick={handleUndoClick}>
            Undo
          </Button>

          <ToggleableButton
            className="xl:order-4"
            toggled={eraseMode}
            onClick={() => setEraseMode((_) => !eraseMode)}
          >
            <span>Erase</span>
            <span>{eraseMode ? "on" : "off"}</span>
          </ToggleableButton>

          <Button className="bg-blue-400 text-slate-100 hover:bg-blue-500 active:bg-blue-600 active:text-white xl:order-2">
            Tip
          </Button>
        </div>

        <div className="flex min-w-[576px] flex-col gap-6">
          <div
            className={cn(
              "grid aspect-square grid-cols-9 grid-rows-9 shadow-sm",
              "[&>div]:border-r",
              "[&>div]:border-r-cool-gray-300",
              "[&>div]:border-b",
              "[&>div]:border-b-cool-gray-300",
              "[&>div:nth-child(9n+1)]:border-l-2",
              "[&>div:nth-child(9n+1)]:border-l-cool-gray-400",
              "[&>div:nth-child(3n)]:border-r-2",
              "[&>div:nth-child(3n)]:border-r-cool-gray-400",
              "[&>div:nth-child(-n+9)]:border-t-2",
              "[&>div:nth-child(-n+9)]:border-t-cool-gray-400",
              "[&>div:nth-child(n+19):nth-child(-n+27)]:border-b-2",
              "[&>div:nth-child(n+19):nth-child(-n+27)]:border-b-cool-gray-400",
              "[&>div:nth-child(n+46):nth-child(-n+54)]:border-b-2",
              "[&>div:nth-child(n+46):nth-child(-n+54)]:border-b-cool-gray-400",
              "[&>div:nth-child(n+73)]:border-b-2",
              "[&>div:nth-child(n+73)]:border-b-cool-gray-400",
            )}
          >
            {state.cells.map((c, i) => (
              <div
                key={i}
                data-testid={`cell-${i}`}
                onClick={() => handleCellClick(i)}
                className={cn(
                  "grid grid-cols-1",
                  { "bg-gray-100": siblings.has(i) },
                  {
                    "bg-zinc-300":
                      "digit" in c && c.digit === state.highlightDigit,
                  },
                  { "bg-yellow-200": state.selectedIndex === i },
                )}
              >
                <Content cell={c} highlightDigit={state.highlightDigit} />
              </div>
            ))}
          </div>

          <div className="flex gap-2">
            {DIGITS.map((d) => (
              <DigitButton key={d} onClick={() => handleDigitClick(d)}>
                {d}
              </DigitButton>
            ))}
          </div>
        </div>
      </main>
    </>
  );
}

function Content({
  cell,
  highlightDigit,
}: {
  cell: Cell;
  highlightDigit?: Digit;
}) {
  if (cell.kind === "empty") return null;

  if (cell.kind === "given" || cell.kind === "proposed") {
    return (
      <div className="place-self-center">
        <span
          className={cn(
            "text-4xl font-normal",
            {
              "font-semibold text-sky-500": cell.kind === "proposed",
            },
            {
              "font-bold": highlightDigit === cell.digit,
            },
          )}
        >
          {cell.digit}
        </span>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-3 grid-rows-3">
        {DIGITS.map((d) => (
          <span
            key={d}
            className={cn(
              "place-self-center text-sm font-normal text-slate-600",
              {
                "font-bold text-black": highlightDigit === d,
              },
            )}
          >
            {cell.kind === "note" && cell.digits.includes(d) ? d : null}
          </span>
        ))}
      </div>
    </>
  );
}

export { Game, type GameState };
