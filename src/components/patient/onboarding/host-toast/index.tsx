"use client";

import { cn } from "@/lib/utils";
import type { OnboardingHostToastProps } from "@/lib/types/components/patient/onboarding";

export function OnboardingHostToast({
  message,
  visible,
}: OnboardingHostToastProps) {
  if (!message) {
    return null;
  }

  return (
    <div className={cn("host-toast", visible && "show")} id="toast">
      {message}
    </div>
  );
}
