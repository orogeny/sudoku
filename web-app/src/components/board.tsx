import { Cell, DIGITS, Digit } from "../shared/common";
import { cellSiblings } from "../shared/cell_siblings";
import "./board.css";

type BoardProps = {
  cells: Cell[];
  selectedDigit?: Digit;
  selectedIndex?: number;
  clickHandler?: (index: number) => void;
};

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
          onClick={() => handleClick(i)}
          key={i}
          className={`flex min-w-16 flex-col items-center justify-center ${
            selectedIndex === i
              ? "bg-yellow-200"
              : "digit" in content && content.digit === selectedDigit
                ? "bg-gray-300"
                : siblings.has(i)
                  ? "bg-gray-100"
                  : "bg-white"
          }`}
        >
          {content.kind === "empty" && <span></span>}

          {content.kind === "given" && (
            <Given
              digit={content.digit}
              selected={content.digit === selectedDigit}
            />
          )}

          {content.kind === "proposed" && (
            <Proposed
              digit={content.digit}
              selected={content.digit === selectedDigit}
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

function Given({ digit, selected }: { digit: Digit; selected: boolean }) {
  return (
    <span
      className={`text-4xl text-slate-700 ${selected ? "font-semibold" : "font-normal"}`}
    >
      {digit}
    </span>
  );
}

function Proposed({ digit, selected }: { digit: Digit; selected: boolean }) {
  return (
    <span
      className={`text-4xl text-blue-600 ${selected ? "font-semibold" : "font-normal"}`}
    >
      {digit}
    </span>
  );
}

function Note({
  digits,
  selectedDigit,
}: {
  digits: Set<Digit>;
  selectedDigit?: Digit;
}) {
  return (
    <div className="grid aspect-square grow grid-cols-3 grid-rows-3 pl-2 pt-px">
      {DIGITS.map((d) => (
        <span
          key={d}
          className={`text-sm ${selectedDigit === d ? "font-bold" : "font-normal"}`}
        >
          {digits.has(d) ? d : null}
        </span>
      ))}
    </div>
  );
}

export { Board };
