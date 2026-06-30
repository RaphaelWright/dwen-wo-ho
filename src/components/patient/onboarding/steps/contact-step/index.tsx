"use client";

import { PhoneField } from "@/components/patient/onboarding/steps/phone-field";
import { EmailField } from "@/components/patient/onboarding/steps/email-field";
import { OnboardingContinueForm } from "@/components/patient/onboarding/steps/continue-form";
import { StepShell } from "@/components/patient/onboarding/steps/step-shell";
import { ONBOARDING_COPY } from "@/lib/constants/components/patient/onboarding";
import type { ContactStepProps } from "@/lib/types/components/patient/onboarding";
import { resolveOnboardingFieldUiState } from "@/lib/utils/patient/onboarding-field-blur";

export function ContactStep({
  contactMode,
  draft,
  fieldValidation,
  onDraftChange,
  onFieldBlur,
  onSubmit,
  onOpenCanadaSheet,
  onOpenTermsSheet,
}: ContactStepProps) {
  const title =
    contactMode === "phone"
      ? ONBOARDING_COPY.contact.phoneTitle
      : ONBOARDING_COPY.contact.emailTitle;

  const fieldKey = contactMode === "phone" ? "phone" : "email";
  const { canSubmit, validationState } = resolveOnboardingFieldUiState(
    fieldValidation[fieldKey],
    draft,
    fieldKey,
  );

  return (
    <StepShell
      title={title}
      subtitle={ONBOARDING_COPY.contact.entrySubtitle}
      centered
    >
      <div className="flex w-full flex-col gap-5">
        <OnboardingContinueForm canContinue={canSubmit} onContinue={onSubmit}>
          {contactMode === "phone" ? (
            <PhoneField
              value={draft.phone}
              validationState={validationState}
              onChange={(phone) => onDraftChange({ phone })}
              onBlur={() => onFieldBlur("phone")}
              submitDisabled={!canSubmit}
            />
          ) : (
            <EmailField
              value={draft.email}
              validationState={validationState}
              onChange={(email) => onDraftChange({ email })}
              onBlur={() => onFieldBlur("email")}
              submitDisabled={!canSubmit}
            />
          )}
        </OnboardingContinueForm>

        <p className="text-muted-foreground text-left text-sm leading-relaxed">
          {ONBOARDING_COPY.contact.outsideGhanaPrefix}
          <button
            type="button"
            onClick={onOpenCanadaSheet}
            className="text-primary hover:text-primary/80 font-semibold underline underline-offset-2"
          >
            {ONBOARDING_COPY.contact.outsideGhanaLink}
          </button>
        </p>

        <p className="text-muted-foreground text-left text-sm leading-relaxed">
          {ONBOARDING_COPY.contact.termsPrefix}
          <button
            type="button"
            onClick={onOpenTermsSheet}
            className="text-primary hover:text-primary/80 font-semibold underline underline-offset-2"
          >
            {ONBOARDING_COPY.contact.termsLink}
          </button>
        </p>
      </div>
    </StepShell>
  );
}
