import { Digit } from "./digit";

type Cell =
  | {
      kind: "given" | "proposed";
      digit: Digit;
    }
  | {
      kind: "note";
      digits: Set<Digit>;
    };

function siblingsOf(index?: number) {
  if (index === undefined) return new Set<number>();

  const column = index % 9;
  const row = Math.floor(index / 9);
  const square = Math.floor(index / 27) * 3 + Math.floor((index % 9) / 3);

  const columnSiblings = Array.from({ length: 9 }).map(
    (_, i) => column + i * 9,
  );
  const rowSiblings = Array.from({ length: 9 }).map((_, i) => row * 9 + i);
  const squareSiblings = Array.from({ length: 9 }).map(
    (_, i) =>
      Math.floor(square / 3) * 27 +
      (square % 3) * 3 +
      (i % 3) +
      Math.floor(i / 3) * 9,
  );

  const siblingIndices = new Set([
    ...columnSiblings,
    ...rowSiblings,
    ...squareSiblings,
  ]);

  siblingIndices.delete(index);

  return siblingIndices;
}

export { siblingsOf, type Cell };
