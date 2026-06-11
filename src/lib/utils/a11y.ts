import type { KeyboardEvent } from "react";

/**
 * Keyboard handler that gives Enter/Space activation parity to elements using
 * `role="button"` — for clickable cards/overlays that cannot be a real
 * `<button>` (e.g. because they wrap other interactive controls).
 */
export function activateOnKeyboard(action: () => void) {
  return (event: KeyboardEvent) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      action();
    }
  };
}
