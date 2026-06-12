"use client";
import { Logo } from "@/components/shared/Logo";
import { SIGN_IN_TEXTS } from "@/lib/constants/components/patient/signin";
import { useTheme } from "next-themes";
import { useHydrated } from "@/hooks/use-hydrated";

export function SignInHeader() {
  const mounted = useHydrated();
  const { theme } = useTheme();
  return (
    <div className="flex w-full items-center justify-between px-8">
      <Logo variant={mounted && theme === "light" ? "black" : "white"} />

      <div className="flex items-center gap-2">
        <span className="text-muted-foreground text-sm font-medium">
          {SIGN_IN_TEXTS.header.for}
        </span>
        <span className="bg-primary/10 text-primary ring-primary/20 inline-flex items-center rounded-full px-3 py-1 text-sm font-semibold ring-1">
          {SIGN_IN_TEXTS.header.patient}
        </span>
      </div>
    </div>
  );
}
