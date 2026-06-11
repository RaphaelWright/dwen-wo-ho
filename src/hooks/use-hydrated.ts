import { useSyncExternalStore } from "react";

const emptySubscribe = () => () => {};

/**
 * Returns `false` during SSR and the very first client render, then `true`
 * once hydration has completed.
 *
 * Backed by `useSyncExternalStore` so it avoids the extra "mounted" state
 * update (and the flash it causes) that a `useState(false)` + mount-only
 * `useEffect` pattern produces.
 */
export function useHydrated(): boolean {
  return useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false,
  );
}
