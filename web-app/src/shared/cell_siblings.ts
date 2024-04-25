function cellSiblings(index?: number) {
  if (index === undefined) return new Set<number>();

  return new Set([
    ...columnSiblings(index),
    ...rowSiblings(index),
    ...squareSiblings(index),
  ]);
}

function columnSiblings(index: number) {
  const column = index % 9;

  return Array.from({ length: 9 }).map((_, i) => column + i * 9);
}

function rowSiblings(index: number) {
  const row = Math.floor(index / 9);

  return Array.from({ length: 9 }).map((_, i) => row * 9 + i);
}

function squareSiblings(index: number) {
  const square = Math.floor(index / 27) * 3 + Math.floor((index % 9) / 3);

  return Array.from({ length: 9 }).map(
    (_, i) =>
      Math.floor(square / 3) * 27 +
      (square % 3) * 3 +
      (i % 3) +
      Math.floor(i / 3) * 9,
  );
}

export { cellSiblings };
