"use client";

import { useState } from "react";
import { OnboardingContinueForm } from "@/components/patient/onboarding/steps/continue-form";
import { StepShell } from "@/components/patient/onboarding/steps/step-shell";
import { ONBOARDING_COPY } from "@/lib/constants/components/patient/onboarding";
import type { NewPasswordStepProps } from "@/lib/types/components/patient/onboarding";
import { cn } from "@/lib/utils";

function getPasswordChecklist(password: string) {
  return {
    length: password.length >= 6,
    letter: /[A-Za-z]/.test(password),
    number: /\d/.test(password),
  };
}

export function NewPasswordStep({
  contactValue,
  password,
  confirmPassword,
  onPasswordChange,
  onConfirmPasswordChange,
  canContinue,
  onContinue,
}: NewPasswordStepProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const passwordRules = getPasswordChecklist(password);

  return (
    <StepShell
      title={ONBOARDING_COPY.newPassword.title}
      subtitle={
        <>
          {ONBOARDING_COPY.newPassword.subtitlePrefix}{" "}
          <strong id="newpassContact">{contactValue || "—"}</strong>
        </>
      }
      centered
    >
      <OnboardingContinueForm canContinue={canContinue} onContinue={onContinue}>
        <div className="field-group">
          <div className="input-box" id="newpassBox">
            <div className="box-title">
              {ONBOARDING_COPY.newPassword.password}
            </div>
            <div className="input-wrap">
              <input
                type={showPassword ? "text" : "password"}
                id="newpassInput"
                autoComplete="new-password"
                placeholder="Password (6 or more characters)"
                value={password}
                onChange={(event) => onPasswordChange(event.target.value)}
              />
              <button
                className="show-toggle"
                id="newpassToggle"
                type="button"
                onClick={() => setShowPassword((current) => !current)}
              >
                {showPassword
                  ? ONBOARDING_COPY.createAccount.hidePassword
                  : ONBOARDING_COPY.createAccount.showPassword}
              </button>
            </div>
          </div>
          <ul className="pw-checklist" id="newpassChecklist">
            <li
              data-rule="length"
              className={cn(passwordRules.length && "met")}
            >
              6+ characters
            </li>
            <li
              data-rule="letter"
              className={cn(passwordRules.letter && "met")}
            >
              One letter
            </li>
            <li
              data-rule="number"
              className={cn(passwordRules.number && "met")}
            >
              One number
            </li>
          </ul>
        </div>

        <div className="field-group">
          <div className="input-box" id="confirmpassBox">
            <div className="box-title">
              {ONBOARDING_COPY.newPassword.confirmPassword}
            </div>
            <div className="input-wrap">
              <input
                type={showConfirmPassword ? "text" : "password"}
                id="confirmpassInput"
                autoComplete="new-password"
                placeholder="Repeat your password"
                value={confirmPassword}
                onChange={(event) =>
                  onConfirmPasswordChange(event.target.value)
                }
              />
              <button
                className="show-toggle"
                id="confirmpassToggle"
                type="button"
                onClick={() => setShowConfirmPassword((current) => !current)}
              >
                {showConfirmPassword
                  ? ONBOARDING_COPY.createAccount.hidePassword
                  : ONBOARDING_COPY.createAccount.showPassword}
              </button>
            </div>
          </div>
        </div>
      </OnboardingContinueForm>
    </StepShell>
  );
}
