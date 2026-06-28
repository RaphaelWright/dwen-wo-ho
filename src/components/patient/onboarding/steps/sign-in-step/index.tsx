"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { StepShell } from "@/components/patient/onboarding/steps/step-shell";
import {
  Field,
  FieldContent,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { ONBOARDING_COPY } from "@/lib/constants/components/patient/onboarding";
import type { SignInStepProps } from "@/lib/types/components/patient/onboarding";
import { cn } from "@/lib/utils";

export function SignInStep({
  nickname,
  password,
  validationState,
  onPasswordChange,
  onBlur,
  onForgotPassword,
}: SignInStepProps) {
  return (
    <StepShell
      title={`${ONBOARDING_COPY.signIn.greetingPrefix} ${nickname || "there"}`}
      subtitle={ONBOARDING_COPY.signIn.subtitle}
    >
      <FieldGroup>
        <Field>
          <FieldLabel htmlFor="patient-sign-in-password">
            {ONBOARDING_COPY.signIn.password}
          </FieldLabel>
          <FieldContent>
            <Input
              id="patient-sign-in-password"
              type="password"
              autoComplete="current-password"
              placeholder={ONBOARDING_COPY.signIn.passwordPlaceholder}
              value={password}
              onBlur={onBlur}
              onChange={(event) => onPasswordChange(event.target.value)}
              className={cn(
                validationState === "valid" &&
                  "border-success ring-success/30 ring-1",
                validationState === "invalid" &&
                  "border-destructive ring-destructive/30 ring-1",
              )}
            />
          </FieldContent>
        </Field>

        <Button
          type="button"
          variant="link"
          className="text-primary h-auto justify-start p-0"
          onClick={onForgotPassword}
        >
          {ONBOARDING_COPY.signIn.forgotPassword}
        </Button>
      </FieldGroup>
    </StepShell>
  );
}
