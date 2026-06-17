"use client";

import { useState } from "react";
import {
  CREATIVE_STUDIOS_DEFAULT_DRAFTS,
  useCreativeStudiosFlow,
} from "@/hooks/components/curator/create/use-creative-studios-flow";
import { CreativeStudiosFlowContext } from "@/hooks/components/curator/create/use-creative-studios-flow-context";
import type { CreativeStudiosFlowProviderProps } from "@/lib/types/components/curator/create/creative-studios";

export function CreativeStudiosFlowProvider({
  type,
  children,
}: CreativeStudiosFlowProviderProps) {
  const [drafts, setDrafts] = useState({ ...CREATIVE_STUDIOS_DEFAULT_DRAFTS });
  const flow = useCreativeStudiosFlow(type, drafts, setDrafts);

  return (
    <CreativeStudiosFlowContext.Provider value={flow}>
      {children}
    </CreativeStudiosFlowContext.Provider>
  );
}
