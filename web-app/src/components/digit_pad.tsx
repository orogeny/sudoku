import { DIGITS, Digit } from "../utils/generate_puzzle";

function DigitPad() {
  return (
    <div className="m-1 grid grid-cols-9 grid-rows-1 gap-2">
      {DIGITS.map((d) => (
        <DigitButton digit={d} key={d} />
      ))}
    </div>
  );
}

function DigitButton({ digit }: { digit: Digit }) {
  return (
    <button className="flex aspect-square flex-col items-center justify-center rounded-lg bg-slate-200 p-5 text-4xl font-bold text-slate-600 shadow-sm hover:bg-sky-100 hover:shadow-md active:bg-sky-200 active:opacity-100 active:shadow-none">
      {digit}
    </button>
  );
}

export { DigitPad };
