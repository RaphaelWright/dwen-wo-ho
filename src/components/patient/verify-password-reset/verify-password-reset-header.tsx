"use client";

import { Logo } from "@/components/shared/logo";
import { VERIFY_PASSWORD_RESET_TEXTS } from "@/lib/constants/components/patient/auth-copy";
import { useTheme } from "next-themes";
import { useHydrated } from "@/hooks/shared/use-hydrated";

export function VerifyPasswordResetHeader() {
  const { theme } = useTheme();
  const mounted = useHydrated();

  return (
    <div className="flex w-full items-center justify-between">
      <Logo variant={mounted && theme === "light" ? "black" : "white"} />
      <div className="flex items-center gap-1.5">
        <span className="text-muted-foreground text-xs font-medium">
          {VERIFY_PASSWORD_RESET_TEXTS.header.for}
        </span>
        <span className="bg-primary/10 text-primary ring-primary/20 inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1">
          {VERIFY_PASSWORD_RESET_TEXTS.header.patient}
        </span>
      </div>
    </div>
  );
}
