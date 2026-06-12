"use client";

import { Logo } from "@/components/shared/Logo";
import { NEW_PASSWORD_TEXTS } from "@/lib/constants/components/patient/new-password";
import { useTheme } from "next-themes";
import { useHydrated } from "@/hooks/use-hydrated";

export function NewPasswordHeader() {
  const { theme } = useTheme();
  const mounted = useHydrated();

  return (
    <div className="flex w-full items-center justify-between">
      <Logo variant={mounted && theme === "light" ? "black" : "white"} />
      <div className="flex items-center gap-1.5">
        <span className="text-muted-foreground text-xs font-medium">
          {NEW_PASSWORD_TEXTS.header.for}
        </span>
        <span className="bg-primary/10 text-primary ring-primary/20 inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1">
          {NEW_PASSWORD_TEXTS.header.patient}
        </span>
      </div>
    </div>
  );
}
