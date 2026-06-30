"use client";

import type { OnboardingFieldBoxProps } from "@/lib/types/components/patient/onboarding";
import { cn } from "@/lib/utils";

export function OnboardingFieldBox({
  label,
  validationState = "idle",
  children,
  className,
}: OnboardingFieldBoxProps) {
  return (
    <div
      className={cn(
        "border-border bg-card relative flex min-h-18 flex-col justify-end rounded-xl border-2 px-4 pt-7 pb-3 transition-colors sm:min-h-20 sm:px-5 sm:pt-8 sm:pb-4",
        validationState === "valid" && "border-success",
        validationState === "invalid" && "border-destructive",
        className,
      )}
    >
      <span className="text-muted-foreground absolute top-3 left-4 text-[10px] font-semibold tracking-[0.14em] uppercase sm:left-5 sm:text-[11px]">
        {label}
      </span>
      {children}
    </div>
  );
}
