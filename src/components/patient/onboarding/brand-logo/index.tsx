"use client";

import { Logo } from "@/components/shared/logo";
import { useHydrated } from "@/hooks/shared/use-hydrated";
import type { OnboardingBrandLogoProps } from "@/lib/types/components/patient/onboarding";
import type { LogoProps } from "@/lib/types/components/shared/logo";
import { cn } from "@/lib/utils";
import { useTheme } from "next-themes";

export function OnboardingBrandLogo({
  placement = "header",
  className,
}: OnboardingBrandLogoProps) {
  const { theme } = useTheme();
  const mounted = useHydrated();

  let variant: LogoProps["variant"] = "white";
  if (placement !== "photo-side") {
    variant = mounted && theme === "light" ? "black" : "white";
  }

  return (
    <Logo
      variant={variant}
      withLink={false}
      className={cn(
        "onboarding-brand-logo",
        `onboarding-brand-logo--${placement}`,
        className,
      )}
    />
  );
}
