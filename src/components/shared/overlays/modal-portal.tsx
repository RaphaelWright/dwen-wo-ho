"use client";

import { createPortal } from "react-dom";
import type { ReactNode } from "react";
import { useHydrated } from "@/hooks/shared/use-hydrated";

export function ModalPortal({ children }: { children: ReactNode }) {
  const hydrated = useHydrated();

  if (!hydrated) {
    return null;
  }

  return createPortal(children, document.body);
}
