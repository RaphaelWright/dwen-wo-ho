/**
 * Maps a string seed to an integer in [min, max] (inclusive).
 * Stable across server and client — safe for SSR hydration.
 */
export function hashStringToRange(
  seed: string,
  min: number,
  max: number,
): number {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = (hash * 31 + seed.charCodeAt(i)) | 0;
  }
  const span = max - min + 1;
  return min + (Math.abs(hash) % span);
}
