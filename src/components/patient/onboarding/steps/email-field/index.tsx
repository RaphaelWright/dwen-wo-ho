"use client";

import { ONBOARDING_COPY } from "@/lib/constants/components/patient/onboarding";
import { OnboardingFieldBox } from "@/components/patient/onboarding/steps/onboarding-field-box";
import { OnboardingFieldSubmitButton } from "@/components/patient/onboarding/steps/onboarding-field-box/submit-button";
import type { EmailFieldProps } from "@/lib/types/components/patient/onboarding";

export function EmailField({
  value,
  validationState,
  onChange,
  onBlur,
  submitDisabled,
}: EmailFieldProps) {
  return (
    <OnboardingFieldBox
      label={ONBOARDING_COPY.contact.emailBoxLabel}
      validationState={validationState}
      className="relative pr-14 sm:pr-16"
    >
      <input
        id="patient-email"
        type="email"
        autoComplete="email"
        placeholder={ONBOARDING_COPY.contact.emailPlaceholder}
        value={value}
        onBlur={onBlur}
        onChange={(event) => onChange(event.target.value)}
        className="text-foreground placeholder:text-muted-foreground w-full border-0 bg-transparent text-xl font-semibold outline-none sm:text-2xl"
      />
      <OnboardingFieldSubmitButton disabled={submitDisabled} />
    </OnboardingFieldBox>
  );
}
