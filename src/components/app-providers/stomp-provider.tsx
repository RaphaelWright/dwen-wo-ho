"use client";

import { ReactNode } from "react";
import { useStompProvider } from "@/hooks/realtime/use-stomp-provider";

export function StompProvider({ children }: { children: ReactNode }) {
  useStompProvider();
  return <>{children}</>;
}
