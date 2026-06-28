"use client";

import { Input } from "@/components/ui/input";
import PasswordMatchIndicator from "@/components/shared/password-match-indicator";
import PasswordStrengthIndicator from "@/components/shared/password-strength-indicator";
import { StepShell } from "@/components/patient/onboarding/steps/step-shell";
import {
  Field,
  FieldContent,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { ONBOARDING_COPY } from "@/lib/constants/components/patient/onboarding";
import type { NewPasswordStepProps } from "@/lib/types/components/patient/onboarding";

export function NewPasswordStep({
  password,
  confirmPassword,
  onPasswordChange,
  onConfirmPasswordChange,
}: NewPasswordStepProps) {
  return (
    <StepShell
      title={ONBOARDING_COPY.newPassword.title}
      subtitle={ONBOARDING_COPY.newPassword.subtitle}
    >
      <FieldGroup>
        <Field>
          <FieldLabel htmlFor="patient-new-password">
            {ONBOARDING_COPY.newPassword.password}
          </FieldLabel>
          <FieldContent>
            <Input
              id="patient-new-password"
              type="password"
              autoComplete="new-password"
              value={password}
              onChange={(event) => onPasswordChange(event.target.value)}
            />
            {password ? (
              <PasswordStrengthIndicator password={password} />
            ) : null}
          </FieldContent>
        </Field>

        <Field>
          <FieldLabel htmlFor="patient-new-confirm-password">
            {ONBOARDING_COPY.newPassword.confirmPassword}
          </FieldLabel>
          <FieldContent>
            <Input
              id="patient-new-confirm-password"
              type="password"
              autoComplete="new-password"
              value={confirmPassword}
              onChange={(event) => onConfirmPasswordChange(event.target.value)}
            />
            {confirmPassword ? (
              <PasswordMatchIndicator
                password={password}
                confirmPassword={confirmPassword}
                matchLabel={ONBOARDING_COPY.newPassword.passwordMatch}
                mismatchLabel={ONBOARDING_COPY.newPassword.passwordMismatch}
              />
            ) : null}
          </FieldContent>
        </Field>
      </FieldGroup>
    </StepShell>
  );
}
