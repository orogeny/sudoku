import { ClassValue, clsx } from "clsx";
import { twMerge } from "tw-merge";
import { DIGITS, Digit } from "../../shared/common";

function Empty() {
  return <span></span>;
}

function Given({ digit, highlight }: { digit: Digit; highlight: boolean }) {
  return (
    <span
      className={cn(
        "text-4xl font-normal text-slate-700",
        highlight && "font-semibold",
      )}
    >
      {digit}
    </span>
  );
}

function Proposed({ digit, highlight }: { digit: Digit; highlight: boolean }) {
  return (
    <span
      className={cn(
        "text-4xl font-normal text-sky-600",
        highlight && "font-semibold",
      )}
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
    <div className="ml-2 mt-px grid aspect-square grow grid-cols-3 grid-rows-3 self-stretch">
      {DIGITS.map((d) => (
        <span
          key={d}
          className={cn("text-sm text-slate-700", {
            "font-bold": selectedDigit === d,
          })}
        >
          {digits.has(d) ? d : null}
        </span>
      ))}
    </div>
  );
}

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export { Empty, Given, Note, Proposed };
