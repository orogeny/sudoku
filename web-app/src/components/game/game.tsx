import { cn } from "@/lib/utils";
import { Cell } from "@/shared/common";
import { DIGITS, Digit } from "@/shared/digit";
import { Puzzle } from "@/shared/puzzle";
import { useEffect, useReducer, useState } from "react";
import { cellSiblings, gameReducer, setup } from "./game_reducer";
import { ToggleableButton } from "./toggleable_button";

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
      <main className="flex flex-col gap-6 xl:flex-row xl:gap-8">
        <div className="grid grid-cols-4 gap-4 px-0.5 xl:order-2 xl:grid-cols-2 xl:gap-6 xl:self-end">
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

        <div className="flex flex-col gap-6">
          <div
            className={cn(
              "grid aspect-square grid-cols-9 grid-rows-9 shadow-sm",
              "[&>div]:border-r",
              "[&>div]:border-r-iron-300",
              "[&>div]:border-b",
              "[&>div]:border-b-iron-300",
              "[&>div:nth-child(9n+1)]:border-l-2",
              "[&>div:nth-child(9n+1)]:border-l-gray-chateau-500",
              "[&>div:nth-child(3n)]:border-r-2",
              "[&>div:nth-child(3n)]:border-r-gray-chateau-500",
              "[&>div:nth-child(-n+9)]:border-t-2",
              "[&>div:nth-child(-n+9)]:border-t-gray-chateau-500",
              "[&>div:nth-child(n+19):nth-child(-n+27)]:border-b-2",
              "[&>div:nth-child(n+19):nth-child(-n+27)]:border-b-gray-chateau-500",
              "[&>div:nth-child(n+46):nth-child(-n+54)]:border-b-2",
              "[&>div:nth-child(n+46):nth-child(-n+54)]:border-b-gray-chateau-500",
              "[&>div:nth-child(n+73)]:border-b-2",
              "[&>div:nth-child(n+73)]:border-b-gray-chateau-500",
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

          <div className="flex gap-2 px-0.5">
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
