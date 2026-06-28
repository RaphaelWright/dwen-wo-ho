"use client";

import Stepper from "@/components/miscellaneous/stepper";
import { OnboardingFooterShell } from "@/components/patient/onboarding/workspace/footer-shell";
import {
  AUTH_FOOTER_STEP_LABELS,
  ONBOARDING_FOOTER_STEP_LABELS,
} from "@/lib/constants/components/patient/onboarding";
import type {
  AuthFooterProps,
  OnboardingPhaseFooterProps,
} from "@/lib/types/components/patient/onboarding";

export function OnboardingAuthFooter({
  stepLabel,
  showStepper = true,
  ...footerProps
}: AuthFooterProps) {
  return (
    <OnboardingFooterShell
      {...footerProps}
      stepper={
        showStepper ? (
          <Stepper
            steps={[...AUTH_FOOTER_STEP_LABELS]}
            step={stepLabel}
            className="scrollbar-hide w-full overflow-x-auto py-0"
          />
        ) : null
      }
    />
  );
}

export function OnboardingPhaseFooter({
  stepLabel,
  completedSteps,
  ...footerProps
}: OnboardingPhaseFooterProps) {
  return (
    <OnboardingFooterShell
      {...footerProps}
      stepper={
        <Stepper
          steps={[...ONBOARDING_FOOTER_STEP_LABELS]}
          step={stepLabel}
          completedSteps={completedSteps}
          className="scrollbar-hide w-full overflow-x-auto py-0"
        />
      }
    />
  );
}
