"use client";

import type { ReactNode } from "react";

import { useCuratorLayout } from "@/hooks/curator/layout/use-layout";

export function CuratorAuthGate({ children }: { children: ReactNode }) {
  const { mounted, isAuthenticated } = useCuratorLayout();

  if (!mounted || isAuthenticated === null) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <div className="border-primary mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-b-2" />

          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (isAuthenticated === false) {
    return null;
  }

  return children;
}
