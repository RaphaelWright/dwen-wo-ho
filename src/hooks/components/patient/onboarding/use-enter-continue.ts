"use client";

import { useEffect } from "react";

/**
 * Submits the current onboarding step when Enter is pressed outside text inputs
 * (e.g. grade pills selected, forgot-password info screen).
 */
export function useEnterToContinue(
  canContinue: boolean,
  onContinue: () => void,
  enabled = true,
) {
  useEffect(() => {
    if (!enabled) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (
        event.key !== "Enter" ||
        event.defaultPrevented ||
        event.isComposing
      ) {
        return;
      }

      const target = event.target;
      if (
        target instanceof HTMLInputElement ||
        target instanceof HTMLTextAreaElement ||
        target instanceof HTMLSelectElement
      ) {
        return;
      }

      if (
        target instanceof HTMLElement &&
        target.closest(
          '[role="combobox"][aria-expanded="true"], [role="listbox"]',
        )
      ) {
        return;
      }

      if (!canContinue) {
        return;
      }

      event.preventDefault();
      onContinue();
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [canContinue, enabled, onContinue]);
}
