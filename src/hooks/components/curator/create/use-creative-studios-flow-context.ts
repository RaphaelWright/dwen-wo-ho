"use client";

import { createContext, useContext } from "react";
import type { CreativeStudiosFlowContextValue } from "@/lib/types/components/curator/create/creative-studios";

export const CreativeStudiosFlowContext =
  createContext<CreativeStudiosFlowContextValue | null>(null);

export function useCreativeStudiosFlowContext() {
  const context = useContext(CreativeStudiosFlowContext);
  if (!context) {
    throw new Error(
      "useCreativeStudiosFlowContext must be used within CreativeStudiosFlowProvider",
    );
  }
  return context;
}
