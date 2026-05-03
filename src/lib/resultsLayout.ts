/**
 * Tailwind grid classes for comparison columns (must be static strings for JIT).
 */
export function comparisonGridClassName(
  cardCount: number,
  gap: "gap-4" | "gap-5" | "gap-6" = "gap-5"
): string {
  const base = `grid ${gap}`;
  if (cardCount <= 1) return `${base} grid-cols-1`;
  if (cardCount === 2) return `${base} grid-cols-1 md:grid-cols-2`;
  if (cardCount === 3) return `${base} grid-cols-1 lg:grid-cols-3`;
  return `${base} grid-cols-1 sm:grid-cols-2 lg:grid-cols-4`;
}

const BOTTOM_LINE_BORDER = [
  "border-l-orange-500",
  "border-l-cyan-500",
  "border-l-green-500",
  "border-l-violet-500",
  "border-l-amber-600",
] as const;

export function bottomLineBorderClass(index: number): string {
  const i =
    ((index % BOTTOM_LINE_BORDER.length) + BOTTOM_LINE_BORDER.length) %
    BOTTOM_LINE_BORDER.length;
  return BOTTOM_LINE_BORDER[i];
}
