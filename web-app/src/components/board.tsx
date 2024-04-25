import { Cell, DIGITS, Digit, siblingsOf } from "../utils/generate_puzzle";
import "./board.css";

type BoardProps = {
  cells: Cell[];
  selectedDigit?: Digit;
  selectedIndex?: number;
  cellClickHandler: (index: number) => void;
};

function Board({
  cells,
  selectedDigit,
  selectedIndex,
  cellClickHandler,
}: BoardProps) {
  console.log("Board::selectedIndex:", selectedIndex);

  const siblings = siblingsOf(selectedIndex);

  return (
    <div className="board grid aspect-square grid-cols-9 grid-rows-9">
      {cells.map((content, i) => (
        <div
          onClick={() => cellClickHandler(i)}
          key={i}
          className={`flex flex-col items-center justify-center ${
            selectedIndex === i
              ? "bg-yellow-200"
              : "digit" in content && content.digit === selectedDigit
                ? "bg-gray-400"
                : siblings.has(i)
                  ? "bg-gray-200"
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
      className={`text-5xl text-black ${selected ? "font-semibold" : "font-light"}`}
    >
      {digit}
    </span>
  );
}

function Proposed({ digit, selected }: { digit: Digit; selected: boolean }) {
  return (
    <span
      className={`text-5xl text-blue-700 ${selected ? "font-semibold" : "font-normal"}`}
    >
      {digit}
    </span>
  );
}

function Note({
  digits,
  selectedDigit,
}: {
  digits: Digit[];
  selectedDigit?: Digit;
}) {
  return (
    <div className="grid aspect-square grow grid-cols-3 grid-rows-3 pl-2">
      {DIGITS.map((d) => (
        <span
          key={d}
          className={`text-sm ${selectedDigit === d ? "font-bold" : "font-normal"}`}
        >
          {digits.includes(d) ? d : null}
        </span>
      ))}
    </div>
  );
}

export { Board };
