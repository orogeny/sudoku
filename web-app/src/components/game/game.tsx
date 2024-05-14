import { useEffect, useReducer, useState } from "react";
import { cn } from "../../shared/cn";
import { ToggleableButton } from "./buttons";
import {
  Cell,
  DIGITS,
  Digit,
  Puzzle,
  cellSiblings,
  gameReducer,
  setup,
} from "./game_reducer";

// type Change = {
//   index: number;
//   cell: Cell;
// };

// type GameState = {
//   cells: Cell[];
//   highlightDigit?: Digit;
//   selectedIndex?: number;
//   errorIndex?: number;
//   notesToggled: boolean;
//   changes: Stack<Change>;
// };

// type GameAction =
//   | {
//       type: "cell_clicked";
//       payload: {
//         index: number;
//       };
//     }
//   | {
//       type: "digit_clicked";
//       payload: {
//         digit: Digit;
//       };
//     }
//   | {
//       type: "notes_toggled" | "undo_clicked" | "cell_error_handled";
//     };

// function setup(puzzle: string) {
//   const cells = puzzle.split("").map((d) => {
//     if (isDigit(d)) {
//       return { kind: "given", digit: d } as Cell;
//     }
//     return { kind: "empty" } as Cell;
//   });

//   return {
//     cells,
//     highlightDigit: undefined,
//     selectedIndex: undefined,
//     errorIndex: undefined,
//     notesToggled: false,
//     changes: new Stack<Change>(),
//   };
// }

// function reducer(state: GameState, action: GameAction) {
//   //
//   // ---------- cell_error_handled ----------

//   if (action.type === "cell_error_handled") {
//     return {
//       ...state,
//       errorIndex: undefined,
//     };
//   }

//   if (state.errorIndex !== undefined) {
//     // take no further actions when we have an error
//     return state;
//   }

//   //
//   // ---------- cell_clicked ----------
//   //
//   if (action.type === "cell_clicked") {
//     if (state.selectedIndex === action.payload.index) {
//       // Cell was selected, so deselect it
//       return {
//         ...state,
//         selectedDigit: undefined,
//         selectedIndex: undefined,
//       };
//     }

//     // Otherwise select the cell and highlight its digit, if any
//     return {
//       ...state,
//       highlightDigit: cellDigit(state.cells, action.payload.index),
//       selectedIndex: action.payload.index,
//     };
//   }

//   //
//   // ---------- digit_clicked ----------
//   //
//   if (action.type === "digit_clicked") {
//     if (state.selectedIndex === undefined) {
//       // no cell is selected, there are no changes
//       return state;
//     }

//     // We have a cell selected...

//     if (state.cells[state.selectedIndex].kind === "given") {
//       // Clear selection but highlight given digit
//       return {
//         ...state,
//         highlightDigit: action.payload.digit,
//         selectedIndex: undefined,
//       };
//     }

//     if (state.cells[state.selectedIndex].kind === "empty") {
//       if (state.notesToggled) {
//         const updatedChanges = state.changes.push({
//           index: state.selectedIndex,
//           cell: state.cells[state.selectedIndex],
//         });

//         const updatedCells = state.cells.map((c, i) => {
//           if (state.selectedIndex === i) {
//             return { kind: "note", digits: action.payload.digit as string };
//           }
//           return c;
//         }) as Cell[];

//         return {
//           ...state,
//           cells: updatedCells,
//           changes: updatedChanges,
//         };
//       } // end of addning note to cell

//       //
//       // Place proposed digit into an empty cell
//       //

//       const siblingIndices = cellSiblings(state.selectedIndex);

//       siblingIndices.delete(state.selectedIndex);

//       const siblingDigits = Array.from(siblingIndices)
//         .map((si) => state.cells[si])
//         .map((c) => ("digit" in c ? c.digit : undefined))
//         .filter(isDigit);

//       if (siblingDigits.includes(action.payload.digit)) {
//         return {
//           ...state,
//           errorIndex: state.selectedIndex,
//         };
//       }

//       const prunableIndices = Array.from(siblingIndices)
//         .filter((si) => state.cells[si].kind === "note")
//         .filter((si) => {
//           const cell = state.cells[si] as Cell;
//           if (cell.kind !== "note") return false;

//           return cell.digits.includes(action.payload.digit);
//         });

//       const change = state.changes.push({
//         index: state.selectedIndex,
//         cell: state.cells[state.selectedIndex],
//       });

//       const updatedCells = state.cells.map((c, i) => {
//         if (state.selectedIndex === i) {
//           return { kind: "proposed", digit: action.payload.digit };
//         }
//         if (prunableIndices.includes(i) && c.kind === "note") {
//           const notes = c.digits.includes(action.payload.digit)
//             ? c.digits.replace(action.payload.digit, "")
//             : c.digits.concat(action.payload.digit);

//           if (notes.length === 0) {
//             return { kind: "empty" };
//           }
//           return { kind: "note", digits: notes };
//         }
//         return c;
//       }) as Cell[];

//       return {
//         ...state,
//         cells: updatedCells,
//         changes: change.pushAll(
//           prunableIndices.map((pi) => ({
//             index: pi,
//             cell: state.cells[pi],
//           })),
//         ),
//       };
//     }

//     if (state.cells[state.selectedIndex].kind === "proposed") {
//       if (state.notesToggled) {
//         // highlight the cell's digit
//         return {
//           ...state,
//           highlightDigit: action.payload.digit,
//         };
//       }

//       //
//       // Place proposed digit into a cell with an existing proposed digit
//       //

//       const existingCell = state.cells[state.selectedIndex];
//       if (
//         existingCell.kind === "proposed" &&
//         existingCell.digit === action.payload.digit
//       ) {
//         // ignore proposing same digit multiple times
//         return state;
//       }

//       const siblingIndices = cellSiblings(state.selectedIndex);

//       siblingIndices.delete(state.selectedIndex);

//       const siblingDigits = Array.from(siblingIndices)
//         .map((si) => state.cells[si])
//         .map((c) => ("digit" in c ? c.digit : undefined))
//         .filter(isDigit);

//       if (siblingDigits.includes(action.payload.digit)) {
//         return {
//           ...state,
//           errorIndex: state.selectedIndex,
//         };
//       }

//       const prunableIndices = Array.from(siblingIndices)
//         .filter((si) => state.cells[si].kind === "note")
//         .filter((si) => {
//           const cell = state.cells[si];

//           return "digits" in cell && cell.digits.includes(action.payload.digit);
//         });

//       const change = state.changes.push({
//         index: state.selectedIndex,
//         cell: state.cells[state.selectedIndex],
//       });

//       const updatedCells = state.cells.map((c, i) => {
//         if (state.selectedIndex === i) {
//           return { kind: "proposed", digit: action.payload.digit };
//         }
//         if (prunableIndices.includes(i) && c.kind === "note") {
//           const notes = c.digits.includes(action.payload.digit)
//             ? c.digits.replace(action.payload.digit, "")
//             : c.digits.concat(action.payload.digit);

//           if (notes.length === 0) {
//             return { kind: "empty" };
//           }
//           return { kind: "note", digits: notes };
//         }
//         return c;
//       }) as Cell[];

//       return {
//         ...state,
//         cells: updatedCells,
//         changes: change.pushAll(
//           prunableIndices.map((pi) => ({
//             index: pi,
//             cell: state.cells[pi],
//           })),
//         ),
//       };
//     }

//     if (state.cells[state.selectedIndex].kind === "note") {
//       if (state.notesToggled) {
//         // add/remove digit from note
//         const updatedChanges = state.changes.push({
//           index: state.selectedIndex,
//           cell: state.cells[state.selectedIndex],
//         });

//         const updatedCells = state.cells.map((c, i) => {
//           if (state.selectedIndex === i) {
//             const cell = state.cells[state.selectedIndex] as {
//               kind: "note";
//               digits: string;
//             };

//             const notes = cell.digits.includes(action.payload.digit)
//               ? cell.digits.replace(action.payload.digit, "")
//               : cell.digits.concat(action.payload.digit);

//             return { kind: "note", digits: notes } as Cell;
//           }
//           return c;
//         });

//         return {
//           ...state,
//           cells: updatedCells,
//           changes: updatedChanges,
//         };
//       }

//       //
//       // Replace note with proposed digit
//       //

//       const siblingIndices = cellSiblings(state.selectedIndex);

//       siblingIndices.delete(state.selectedIndex);

//       const siblingDigits = Array.from(siblingIndices)
//         .map((si) => state.cells[si])
//         .map((c) => ("digit" in c ? c.digit : undefined))
//         .filter(isDigit);

//       if (siblingDigits.includes(action.payload.digit)) {
//         return {
//           ...state,
//           errorIndex: state.selectedIndex,
//         };
//       }

//       const prunableIndices = Array.from(siblingIndices)
//         .filter((si) => state.cells[si].kind === "note")
//         .filter((si) => {
//           const cell = state.cells[si] as Cell;
//           if (cell.kind !== "note") return false;

//           return cell.digits.includes(action.payload.digit);
//         });

//       const change = state.changes.push({
//         index: state.selectedIndex,
//         cell: state.cells[state.selectedIndex],
//       });

//       const updatedCells = state.cells.map((c, i) => {
//         if (state.selectedIndex === i) {
//           return { kind: "proposed", digit: action.payload.digit };
//         }
//         if (prunableIndices.includes(i) && c.kind === "note") {
//           const notes = c.digits.includes(action.payload.digit)
//             ? c.digits.replace(action.payload.digit, "")
//             : c.digits.concat(action.payload.digit);

//           if (notes.length === 0) {
//             return { kind: "empty" };
//           }
//           return { kind: "note", digits: notes };
//         }
//         return c;
//       }) as Cell[];

//       return {
//         ...state,
//         cells: updatedCells,
//         changes: change.pushAll(
//           prunableIndices.map((pi) => ({
//             index: pi,
//             cell: state.cells[pi],
//           })),
//         ),
//       };
//     }
//   } // end of digit_clicked

//   //
//   // ---------- notes_toggled ----------
//   //
//   if (action.type === "notes_toggled") {
//     return { ...state, notesToggled: !state.notesToggled };
//   }

//   //
//   // ---------- undo_clicked ----------
//   //
//   if (action.type === "undo_clicked") {
//     const { item, rest } = state.changes.pop();

//     if (item) {
//       const updatedCells = state.cells.map((c, i) =>
//         item.index === i ? item.cell : c,
//       );

//       return {
//         ...state,
//         cells: updatedCells,
//         changes: rest,
//       };
//     }
//   }

//   return state;
// }

function Game({ puzzle }: { puzzle: Puzzle }) {
  const [state, dispatch] = useReducer(gameReducer, puzzle, setup);
  const [eraseMode, setEraseMode] = useState(false);

  useEffect(() => {
    if (state.notification) {
      setTimeout(handleNotification, 300);
    }
  }, [state.notification]);

  const siblings = cellSiblings(state.selectedIndex);

  const handleCellClick = (index: number) => {
    dispatch({ type: "cell_clicked", payload: { index } });
  };

  const handleDigitClick = (digit: Digit) => {
    dispatch({ type: "digit_button_clicked", payload: { digit } });
  };

  const handleNotesClick = () => {
    dispatch({ type: "notes_button_clicked" });
  };

  const handleUndoClick = () => {
    dispatch({ type: "undo_button_clicked" });
  };

  const handleNotification = () => {
    dispatch({ type: "notification_cleared" });
  };

  return (
    <>
      <main className="mx-auto flex min-w-[576px] max-w-[640px] flex-col gap-6 xl:max-w-fit xl:flex-row xl:gap-8">
        <div className="grid grid-cols-4 gap-4 xl:order-2 xl:grid-cols-2 xl:gap-6 xl:self-end">
          <ToggleableButton
            className="flex h-12 basis-1/4 items-center justify-around rounded bg-zinc-300 text-2xl font-semibold text-slate-800 shadow-sm 
            xl:order-3 xl:h-16 xl:w-44"
            toggledClassName="bg-zinc-500 text-white"
            onClick={handleNotesClick}
            toggled={state.notesToggled}
          >
            Notes
          </ToggleableButton>

          <button
            className="flex h-12 basis-1/4 items-center justify-around rounded bg-zinc-300 text-2xl font-semibold text-slate-900 shadow-sm hover:bg-zinc-400 active:bg-zinc-500 xl:order-1 xl:h-16 xl:w-44"
            onClick={handleUndoClick}
          >
            Undo
          </button>

          <ToggleableButton
            className="flex h-12 basis-1/4 items-center justify-around rounded bg-zinc-300 text-2xl font-semibold text-slate-800 shadow-sm 
            xl:order-4 xl:h-16 xl:w-44"
            toggledClassName="bg-zinc-500 text-white"
            toggled={eraseMode}
            onClick={() => setEraseMode((_) => !eraseMode)}
          >
            Erase
          </ToggleableButton>

          <button className="flex h-12 basis-1/4 items-center justify-around rounded bg-blue-500 text-2xl font-semibold text-white shadow-sm hover:bg-blue-600 active:bg-blue-800 xl:order-2 xl:h-16 xl:w-44">
            Tip
          </button>
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
                  {
                    "bg-gray-200":
                      state.notification?.index === i &&
                      state.notification?.reason === "proposed",
                  },
                  {
                    "bg-red-300":
                      state.notification?.index === i &&
                      state.notification?.reason === "clash",
                  },
                )}
              >
                <Content cell={c} highlightDigit={state.highlightDigit} />
              </div>
            ))}
          </div>

          <div className="flex gap-2">
            {DIGITS.map((d) => (
              <ToggleableButton
                key={d}
                className={cn(
                  "flex aspect-square basis-1/9 items-center justify-center rounded-md bg-sky-200 text-4xl font-semibold text-slate-800 shadow-md active:bg-sky-400 xl:h-16",
                  state.notesToggled && "bg-zinc-300 active:bg-zinc-400",
                )}
                toggledClassName={cn(
                  "bg-sky-600 text-white",
                  state.notesToggled && "bg-zinc-500",
                )}
                toggled={state.toggledDigit === d}
                onClick={() => handleDigitClick(d)}
              >
                {d}
              </ToggleableButton>
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
  if (cell.kind === "given" || cell.kind === "proposed") {
    return (
      <div className="place-self-center">
        <span
          className={cn(
            "text-5xl font-normal",
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
              "place-self-center text-base font-normal leading-none text-slate-600",
              {
                "font-bold text-black": highlightDigit === d,
              },
            )}
          >
            {cell.kind === "note" && cell.digits.has(d) ? d : null}
          </span>
        ))}
      </div>
    </>
  );
}

export { Game };
