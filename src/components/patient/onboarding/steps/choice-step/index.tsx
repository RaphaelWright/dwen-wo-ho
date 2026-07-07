"use client";

import { IoCallOutline, IoMailOutline } from "react-icons/io5";
import { StepShell } from "@/components/patient/onboarding/steps/step-shell";
import { ONBOARDING_COPY } from "@/lib/constants/components/patient/onboarding";
import type {
  ChoiceStepProps,
  ContactMode,
} from "@/lib/types/components/patient/onboarding";
import { activateOnKeyboard } from "@/lib/utils/shared/a11y";
import { cn } from "@/lib/utils";

export function ChoiceStep({
  contactMode,
  onContactModeChange,
  onContinue,
  onOpenTermsSheet,
}: ChoiceStepProps) {
  const handleSelect = (mode: ContactMode) => {
    onContactModeChange(mode);
    onContinue();
  };

  return (
    <StepShell
      title={ONBOARDING_COPY.choice.title}
      subtitle={ONBOARDING_COPY.choice.subtitle}
      centered
    >
      <div className="choice-row">
        {(["phone", "email"] as const).map((mode) => (
          <div
            key={mode}
            role="button"
            tabIndex={0}
            aria-pressed={contactMode === mode}
            className={cn("choice-card", contactMode === mode && "selected")}
            onClick={() => handleSelect(mode)}
            onKeyDown={activateOnKeyboard(() => handleSelect(mode))}
          >
            <div className="emoji" aria-hidden="true">
              {mode === "phone" ? <IoCallOutline /> : <IoMailOutline />}
            </div>
            <div className="label">{mode === "phone" ? "PHONE" : "EMAIL"}</div>
            <div className="plus" />
          </div>
        ))}
      </div>

      <p className="terms choice-terms">
        {ONBOARDING_COPY.contact.termsPrefix}
        <button
          type="button"
          className="highlight"
          onClick={onOpenTermsSheet}
        >
          {ONBOARDING_COPY.contact.termsLink}
        </button>
      </p>
    </StepShell>
  );
}
