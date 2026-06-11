"use client";
import { Logo } from "@/components/shared/Logo";
import { SIGN_IN_TEXTS } from "@/lib/constants/components/patient/signin";
import { useTheme } from "next-themes";
import { useHydrated } from "@/hooks/use-hydrated";

export function SignInHeader() {
  const mounted = useHydrated();
  const { theme } = useTheme();
  return (
    <div className="flex items-center px-8 justify-between w-full">
      <Logo variant={mounted && theme === "light" ? "black" : "white"} />

      <div className="flex items-center gap-2">
        <span className="text-sm text-muted-foreground font-medium">
          {SIGN_IN_TEXTS.header.for}
        </span>
        <span className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-sm font-semibold text-primary ring-1 ring-primary/20">
          {SIGN_IN_TEXTS.header.patient}
        </span>
      </div>
    </div>
  );
}
