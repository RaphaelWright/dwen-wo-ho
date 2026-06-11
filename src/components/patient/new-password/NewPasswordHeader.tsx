"use client";

import { Logo } from "@/components/shared/Logo";
import { NEW_PASSWORD_TEXTS } from "@/lib/constants/components/patient/new-password";
import { useTheme } from "next-themes";
import { useHydrated } from "@/hooks/use-hydrated";

export function NewPasswordHeader() {
  const { theme } = useTheme();
  const mounted = useHydrated();

  return (
    <div className="flex items-center justify-between w-full">
      <Logo variant={mounted && theme === "light" ? "black" : "white"} />
      <div className="flex items-center gap-1.5">
        <span className="text-xs text-muted-foreground font-medium">
          {NEW_PASSWORD_TEXTS.header.for}
        </span>
        <span className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary ring-1 ring-primary/20">
          {NEW_PASSWORD_TEXTS.header.patient}
        </span>
      </div>
    </div>
  );
}
