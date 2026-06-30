"use client";

import Image from "next/image";
import {
  ONBOARDING_COPY,
  ONBOARDING_GHANA_PHONE,
} from "@/lib/constants/components/patient/onboarding";
import { OnboardingFieldBox } from "@/components/patient/onboarding/steps/onboarding-field-box";
import { OnboardingFieldSubmitButton } from "@/components/patient/onboarding/steps/onboarding-field-box/submit-button";
import type { PhoneFieldProps } from "@/lib/types/components/patient/onboarding";

export function PhoneField({
  value,
  validationState,
  onChange,
  onBlur,
  submitDisabled,
}: PhoneFieldProps) {
  return (
    <div className="flex gap-2 sm:gap-3">
      <OnboardingFieldBox
        label={ONBOARDING_COPY.contact.countryLabel}
        validationState={validationState}
        className="w-27 shrink-0 sm:w-30"
      >
        <div className="flex items-center justify-center gap-2">
          <Image
            src={ONBOARDING_GHANA_PHONE.flagSrc}
            alt=""
            width={28}
            height={18}
            className="rounded-sm object-cover"
          />
          <span className="text-foreground text-lg font-semibold tabular-nums sm:text-xl">
            {ONBOARDING_GHANA_PHONE.countryCode}
          </span>
        </div>
      </OnboardingFieldBox>

      <OnboardingFieldBox
        label={ONBOARDING_COPY.contact.phoneBoxLabel}
        validationState={validationState}
        className="relative min-w-0 flex-1 pr-14 sm:pr-16"
      >
        <input
          id="patient-phone"
          type="tel"
          inputMode="numeric"
          autoComplete="tel-national"
          placeholder={ONBOARDING_COPY.contact.phonePlaceholder}
          value={value}
          maxLength={ONBOARDING_GHANA_PHONE.maxLength}
          onBlur={onBlur}
          onChange={(event) =>
            onChange(
              event.target.value
                .replace(/\D/g, "")
                .slice(0, ONBOARDING_GHANA_PHONE.maxLength),
            )
          }
          className="text-foreground placeholder:text-muted-foreground w-full border-0 bg-transparent text-xl font-semibold outline-none sm:text-2xl"
        />
        <OnboardingFieldSubmitButton disabled={submitDisabled} />
      </OnboardingFieldBox>
    </div>
  );
}
