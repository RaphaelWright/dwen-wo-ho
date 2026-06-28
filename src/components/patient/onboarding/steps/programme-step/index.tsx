"use client";

import {
  Field,
  FieldContent,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { ProgrammeCombobox } from "@/components/patient/onboarding/steps/programme-combobox";
import { StepShell } from "@/components/patient/onboarding/steps/step-shell";
import { ONBOARDING_COPY } from "@/lib/constants/components/patient/onboarding";
import type { ProgrammeStepProps } from "@/lib/types/components/patient/onboarding";

export function ProgrammeStep({
  programme,
  onProgrammeChange,
}: ProgrammeStepProps) {
  return (
    <StepShell
      title={ONBOARDING_COPY.programme.title}
      subtitle={ONBOARDING_COPY.programme.subtitle}
    >
      <FieldGroup>
        <Field>
          <FieldLabel htmlFor="patient-programme">
            {ONBOARDING_COPY.programme.label}
          </FieldLabel>
          <FieldContent>
            <ProgrammeCombobox
              selectedProgramme={programme}
              onSelectProgramme={onProgrammeChange}
            />
          </FieldContent>
        </Field>
      </FieldGroup>
    </StepShell>
  );
}
