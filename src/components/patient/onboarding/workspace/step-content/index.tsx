"use client";

import { ONBOARDING_SCREENS } from "@/lib/constants/components/patient/onboarding";
import type {
  OnboardingScreen,
  OnboardingStepContentProps,
} from "@/lib/types/components/patient/onboarding";
import { OnboardingAuthStepContent } from "@/components/patient/onboarding/workspace/auth-step-content";
import { OnboardingEducationStepContent } from "@/components/patient/onboarding/workspace/education-step-content";

const EDUCATION_SCREENS: ReadonlySet<OnboardingScreen> = new Set([
  ONBOARDING_SCREENS.SCHOOL_TYPE,
  ONBOARDING_SCREENS.PROGRAMME,
  ONBOARDING_SCREENS.GRADE,
]);

export function OnboardingStepContent(props: OnboardingStepContentProps) {
  if (EDUCATION_SCREENS.has(props.screen)) {
    return <OnboardingEducationStepContent {...props} />;
  }

  return <OnboardingAuthStepContent {...props} />;
}
