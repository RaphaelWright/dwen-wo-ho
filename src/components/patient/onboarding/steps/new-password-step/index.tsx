"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import PasswordMatchIndicator from "@/components/shared/password-match-indicator";
import PasswordStrengthIndicator from "@/components/shared/password-strength-indicator";
import { OnboardingContinueForm } from "@/components/patient/onboarding/steps/continue-form";
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
  canContinue,
  onContinue,
}: NewPasswordStepProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  return (
    <StepShell
      title={ONBOARDING_COPY.newPassword.title}
      subtitle={ONBOARDING_COPY.newPassword.subtitle}
    >
      <OnboardingContinueForm canContinue={canContinue} onContinue={onContinue}>
        <FieldGroup>
          <Field>
            <FieldLabel htmlFor="patient-new-password">
              {ONBOARDING_COPY.newPassword.password}
            </FieldLabel>
            <FieldContent>
              <div className="relative">
                <Input
                  id="patient-new-password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  value={password}
                  className="pr-16"
                  onChange={(event) => onPasswordChange(event.target.value)}
                />
                <Button
                  type="button"
                  variant="ghost"
                  className="text-muted-foreground absolute top-1/2 right-1 h-8 -translate-y-1/2 px-3 text-xs font-semibold tracking-wide"
                  onClick={() => setShowPassword((current) => !current)}
                >
                  {showPassword
                    ? ONBOARDING_COPY.createAccount.hidePassword
                    : ONBOARDING_COPY.createAccount.showPassword}
                </Button>
              </div>
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
              <div className="relative">
                <Input
                  id="patient-new-confirm-password"
                  type={showConfirmPassword ? "text" : "password"}
                  autoComplete="new-password"
                  value={confirmPassword}
                  className="pr-16"
                  onChange={(event) =>
                    onConfirmPasswordChange(event.target.value)
                  }
                />
                <Button
                  type="button"
                  variant="ghost"
                  className="text-muted-foreground absolute top-1/2 right-1 h-8 -translate-y-1/2 px-3 text-xs font-semibold tracking-wide"
                  onClick={() => setShowConfirmPassword((current) => !current)}
                >
                  {showConfirmPassword
                    ? ONBOARDING_COPY.createAccount.hidePassword
                    : ONBOARDING_COPY.createAccount.showPassword}
                </Button>
              </div>
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
      </OnboardingContinueForm>
    </StepShell>
  );
}
