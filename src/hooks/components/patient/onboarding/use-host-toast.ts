"use client";

import { useCallback, useEffect, useRef, useState } from "react";

const HOST_TOAST_DURATION_MS = 2200;

export function useHostToast() {
  const [message, setMessage] = useState<string | null>(null);
  const [visible, setVisible] = useState(false);
  const hideTimerRef = useRef<number | null>(null);

  const clearHideTimer = useCallback(() => {
    if (hideTimerRef.current !== null) {
      window.clearTimeout(hideTimerRef.current);
      hideTimerRef.current = null;
    }
  }, []);

  const showToast = useCallback(
    (nextMessage: string) => {
      clearHideTimer();
      setMessage(nextMessage);
      setVisible(true);
      hideTimerRef.current = window.setTimeout(() => {
        setVisible(false);
        hideTimerRef.current = null;
      }, HOST_TOAST_DURATION_MS);
    },
    [clearHideTimer],
  );

  useEffect(() => clearHideTimer, [clearHideTimer]);

  return { message, visible, showToast };
}
