"use client";

import { PhoneField } from "@/components/patient/onboarding/steps/phone-field";
import { EmailField } from "@/components/patient/onboarding/steps/email-field";
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
      {contactMode === "phone" ? (
        <PhoneField
          value={draft.phone}
          validationState={validationState}
          onChange={(phone) => onDraftChange({ phone })}
          onBlur={() => onFieldBlur("phone")}
          submitDisabled={!canSubmit}
          onSubmit={onSubmit}
        />
      ) : (
        <EmailField
          value={draft.email}
          validationState={validationState}
          onChange={(email) => onDraftChange({ email })}
          onBlur={() => onFieldBlur("email")}
          submitDisabled={!canSubmit}
          onSubmit={onSubmit}
        />
      )}

      <div className="contact-notes">
        <p className="helper">{ONBOARDING_COPY.contact.outsideGhanaHelper}</p>

        <p className="helper cta">
          {ONBOARDING_COPY.contact.canadaReachOutPrefix}
          <button
            type="button"
            className="highlight"
            onClick={onOpenCanadaSheet}
          >
            {ONBOARDING_COPY.contact.canadaReachOutLink}
          </button>
        </p>

        <p className="terms">
          {ONBOARDING_COPY.contact.termsPrefix}
          <button
            type="button"
            className="highlight"
            onClick={onOpenTermsSheet}
          >
            {ONBOARDING_COPY.contact.termsLink}
          </button>
        </p>
      </div>
    </StepShell>
  );
}
