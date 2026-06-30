"use client";

import { Mail, Phone } from "lucide-react";
import { StepShell } from "@/components/patient/onboarding/steps/step-shell";
import {
  ONBOARDING_CONTACT_MODE_OPTIONS,
  ONBOARDING_COPY,
} from "@/lib/constants/components/patient/onboarding";
import type {
  ChoiceStepProps,
  ContactMode,
} from "@/lib/types/components/patient/onboarding";
import { activateOnKeyboard } from "@/lib/utils/shared/a11y";

const CHOICE_ICONS = {
  phone: Phone,
  email: Mail,
} as const;

export function ChoiceStep({
  contactMode,
  onContactModeChange,
  onContinue,
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
      <div className="grid w-full gap-4 sm:gap-5">
        {ONBOARDING_CONTACT_MODE_OPTIONS.map(({ value, label }) => {
          const Icon = CHOICE_ICONS[value];
          const description =
            value === "phone"
              ? ONBOARDING_COPY.choice.phoneDescription
              : ONBOARDING_COPY.choice.emailDescription;

          return (
            <div
              key={value}
              role="button"
              tabIndex={0}
              aria-pressed={contactMode === value}
              onClick={() => handleSelect(value as ContactMode)}
              onKeyDown={activateOnKeyboard(() =>
                handleSelect(value as ContactMode),
              )}
              className="border-border bg-card hover:border-primary hover:bg-accent flex cursor-pointer flex-col items-center gap-3 rounded-2xl border-2 px-6 py-8 text-center transition-colors sm:py-10"
            >
              <div className="bg-primary/15 text-primary flex size-14 items-center justify-center rounded-full sm:size-16">
                <Icon className="size-7 sm:size-8" aria-hidden="true" />
              </div>
              <div className="flex flex-col gap-1">
                <span className="font-heading text-lg font-semibold sm:text-xl">
                  {label}
                </span>
                <span className="text-muted-foreground text-sm">
                  {description}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </StepShell>
  );
}
