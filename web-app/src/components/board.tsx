import { DIGITS, Digit } from "../utils/generate_puzzle";
import "./board.css";
import { GameState } from "./game";

type BoardProps = {
  game: GameState;
  cellClickHandler: (index: number) => void;
};

function Board({ game, cellClickHandler }: BoardProps) {
  return (
    <div className="board grid aspect-square grid-cols-9 grid-rows-9">
      {game.cells.map((content, i) => (
        <div
          onClick={() => cellClickHandler(i)}
          key={i}
          className={`flex flex-col items-center justify-center ${
            game.selectedIndex === i
              ? "bg-yellow-200"
              : "digit" in content && content.digit === game.selectedDigit
                ? "bg-gray-400"
                : game.siblings.has(i)
                  ? "bg-gray-200"
                  : "bg-white"
          }`}
        >
          {content.kind === "empty" && <span></span>}

          {content.kind === "given" && (
            <Given
              digit={content.digit}
              selected={content.digit === game.selectedDigit}
            />
          )}

          {content.kind === "proposed" && (
            <Proposed
              digit={content.digit}
              selected={content.digit === game.selectedDigit}
            />
          )}

          {content.kind === "note" && (
            <Note digits={content.digits} selectedDigit={game.selectedDigit} />
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
