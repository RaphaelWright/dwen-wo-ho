"use client";

import type { SubmitEvent } from "react";
import { useEnterToContinue } from "@/hooks/components/patient/onboarding/use-enter-continue";
import type { OnboardingContinueFormProps } from "@/lib/types/components/patient/onboarding";

export function OnboardingContinueForm({
  canContinue,
  onContinue,
  children,
  className,
  listenForEnter = false,
}: OnboardingContinueFormProps) {
  useEnterToContinue(canContinue, onContinue, listenForEnter);

  const handleSubmit = (event: SubmitEvent) => {
    event.preventDefault();
    if (!canContinue) {
      return;
    }
    onContinue();
  };

  return (
    <form onSubmit={handleSubmit} className={className}>
      {children}
    </form>
  );
}
