export type GridPlacement = {
  gridColumn: string;
  gridRow: string;
  className: string;
};

export function getGridPlacement(
  tileIndex: number,
  totalTiles: number,
  isHook: boolean,
  isQuiz: boolean,
): GridPlacement {
  if (isHook) {
    return {
      gridColumn: "1 / span 2",
      gridRow: "1 / span 2",
      className: "md:col-span-2 md:row-span-2 col-span-2 row-span-2",
    };
  }

  if (isQuiz) {
    return {
      gridColumn: "3 / span 1",
      gridRow: "2 / span 2",
      className: "md:col-span-1 md:row-span-2 col-span-1 row-span-2",
    };
  }

  const middleIndex = tileIndex - 1;
  const middleCount = totalTiles - 2;

  if (middleCount <= 1) {
    return {
      gridColumn: "3",
      gridRow: "1",
      className: "col-span-1 row-span-1",
    };
  }

  if (middleCount === 2) {
    const map = [
      "col-span-1 row-span-1 md:col-start-3 md:row-start-1",
      "col-span-1 row-span-1 md:col-start-1 md:row-start-3",
    ];
    return {
      gridColumn: middleIndex === 0 ? "3" : "1",
      gridRow: middleIndex === 0 ? "1" : "3",
      className: map[middleIndex] ?? map[0],
    };
  }

  if (middleCount === 3) {
    const map = [
      "col-span-1 row-span-1 md:col-start-3 md:row-start-1",
      "col-span-1 row-span-1 md:col-start-1 md:row-start-3",
      "col-span-1 row-span-1 md:col-start-2 md:row-start-3",
    ];
    return {
      gridColumn: String((middleIndex % 3) + 1),
      gridRow: middleIndex === 0 ? "1" : "3",
      className: map[middleIndex] ?? map[0],
    };
  }

  const map = [
    "col-span-1 row-span-1 md:col-start-3 md:row-start-1",
    "col-span-1 row-span-1 md:col-start-3 md:row-start-2",
    "col-span-1 row-span-1 md:col-start-1 md:row-start-3",
    "col-span-1 row-span-1 md:col-start-2 md:row-start-3",
  ];

  return {
    gridColumn: "auto",
    gridRow: "auto",
    className: map[middleIndex] ?? "col-span-1 row-span-1",
  };
}
