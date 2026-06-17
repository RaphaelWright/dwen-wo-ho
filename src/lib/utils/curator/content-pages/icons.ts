export function sortIconsByRank<T extends { rank: number }>(icons: T[]): T[] {
  return icons.toSorted((a, b) => a.rank - b.rank);
}
