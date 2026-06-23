"use client";

import { useCallback, useEffect } from "react";

export function useScaleToFit(
  scaleRootRef: React.RefObject<HTMLDivElement | null>,
) {
  const apply = useCallback(() => {
    const el = scaleRootRef.current;
    if (!el) return;
    const natural = el.scrollHeight;
    const available = window.innerHeight - 6;
    const scale = Math.min(1, available / natural);
    el.style.transform = `scale(${scale})`;
  }, [scaleRootRef]);

  useEffect(() => {
    apply();
    window.addEventListener("resize", apply);

    const ro = new ResizeObserver(apply);
    if (scaleRootRef.current) ro.observe(scaleRootRef.current);

    return () => {
      window.removeEventListener("resize", apply);
      ro.disconnect();
    };
  }, [apply, scaleRootRef]);

  return apply;
}
