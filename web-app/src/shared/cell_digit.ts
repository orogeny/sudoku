import { Cell } from "./common";
import { Digit } from "./digit";

function cellDigit(cell: Cell): Digit | undefined;

function cellDigit(cells: Cell[], index?: number): Digit | undefined;

function cellDigit(xs: Cell | Cell[], index?: number) {
  let cell;

  if (Array.isArray(xs)) {
    if (index === undefined) {
      return undefined;
    }
    cell = xs[index]; // xs is an array
  } else {
    cell = xs; // xs is a Cell
  }

  if (cell.kind === "note") {
    return undefined;
  }

  return cell.digit;
}

export { cellDigit };
