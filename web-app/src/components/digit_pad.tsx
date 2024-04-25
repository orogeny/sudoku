import { DIGITS, Digit } from "../utils/generate_puzzle";

function DigitPad({
  digitClickHandler,
}: {
  digitClickHandler: (digit: Digit) => void;
}) {
  return (
    <div className="m-1 grid grid-cols-9 grid-rows-1 gap-2">
      {DIGITS.map((d) => (
        <button
          key={d}
          className="flex aspect-square flex-col items-center justify-center rounded-lg bg-sky-200 p-5 text-4xl font-bold text-slate-600 shadow-sm hover:bg-sky-300 hover:shadow-md active:bg-sky-400 active:opacity-100 active:shadow-none"
          onClick={() => digitClickHandler(d)}
        >
          {d}
        </button>
      ))}
    </div>
  );
}

export { DigitPad };
