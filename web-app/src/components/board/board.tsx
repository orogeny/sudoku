import clsx, { ClassValue } from "clsx";
import { twMerge } from "tw-merge";
import { cellSiblings } from "../../shared/cell_siblings";
import { Cell, Digit } from "../../shared/common";
import "./board.css";
import { Empty, Given, Note, Proposed } from "./cell_box";

type BoardProps = {
  cells: Cell[];
  selectedDigit?: Digit;
  selectedIndex?: number;
  clickHandler?: (index: number) => void;
};

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

function Board({
  cells,
  selectedDigit,
  selectedIndex,
  clickHandler,
}: BoardProps) {
  const handleClick = (index: number) => {
    if (clickHandler) {
      clickHandler(index);
    }
  };

  const siblings = cellSiblings(selectedIndex);

  return (
    <div className="board grid aspect-square max-w-3xl grid-cols-9 grid-rows-9">
      {cells.map((content, i) => (
        <div
          data-testid={`cell-${i}`}
          onClick={() => handleClick(i)}
          key={i}
          className={cn(
            "flex min-w-16 flex-col items-center justify-center bg-white",
            { "bg-gray-100": siblings.has(i) },
            {
              "bg-gray-300":
                "digit" in content && content.digit === selectedDigit,
            },
            { "bg-yellow-200": selectedIndex === i },
          )}
        >
          {content.kind === "empty" && <Empty />}

          {content.kind === "given" && (
            <Given
              digit={content.digit}
              highlight={selectedDigit === content.digit}
            />
          )}

          {content.kind === "proposed" && (
            <Proposed
              digit={content.digit}
              highlight={content.digit === selectedDigit}
            />
          )}

          {content.kind === "note" && (
            <Note digits={content.digits} selectedDigit={selectedDigit} />
          )}
        </div>
      ))}
    </div>
  );
}

export { Board };
