"use client";

import React from "react";
import { useHydrated } from "@/hooks/use-hydrated";

interface ClientOnlyProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export function ClientOnly({ children, fallback = null }: ClientOnlyProps) {
  const hasMounted = useHydrated();

  if (!hasMounted) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}
