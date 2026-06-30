"use client";

import { StepShell } from "@/components/patient/onboarding/steps/step-shell";
import { OnboardingContinueForm } from "@/components/patient/onboarding/steps/continue-form";
import { ONBOARDING_COPY } from "@/lib/constants/components/patient/onboarding";
import type { ForgotPasswordStepProps } from "@/lib/types/components/patient/onboarding";

export function ForgotPasswordStep({
  contactValue,
  canContinue,
  onContinue,
}: ForgotPasswordStepProps) {
  return (
    <StepShell
      title={ONBOARDING_COPY.forgotPassword.title}
      subtitle={
        <>
          {ONBOARDING_COPY.forgotPassword.subtitlePrefix}{" "}
          <strong>{contactValue}</strong>
        </>
      }
      centered
    >
      <OnboardingContinueForm
        canContinue={canContinue}
        onContinue={onContinue}
        listenForEnter
      >
        <p className="sub">Tap continue to receive a verification code.</p>
      </OnboardingContinueForm>
    </StepShell>
  );
}
