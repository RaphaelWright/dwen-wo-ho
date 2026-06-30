"use client";

import { useState } from "react";
import { StepShell } from "@/components/patient/onboarding/steps/step-shell";
import { OnboardingContinueForm } from "@/components/patient/onboarding/steps/continue-form";
import { ONBOARDING_COPY } from "@/lib/constants/components/patient/onboarding";
import type { SignInStepProps } from "@/lib/types/components/patient/onboarding";
import { cn } from "@/lib/utils";

export function SignInStep({
  nickname,
  contactValue,
  password,
  validationState,
  onPasswordChange,
  onBlur,
  onForgotPassword,
  canContinue,
  onContinue,
}: SignInStepProps) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <StepShell
      title={
        <>
          {ONBOARDING_COPY.signIn.greetingPrefix},{" "}
          <span id="signinNickname">{nickname || "there"}</span>
        </>
      }
      subtitle={
        <>
          {ONBOARDING_COPY.signIn.subtitlePrefix}{" "}
          <strong id="signinContact">{contactValue || "—"}</strong>
        </>
      }
      centered
    >
      <OnboardingContinueForm canContinue={canContinue} onContinue={onContinue}>
        <div className="field-group">
          <div
            className={cn(
              "input-box",
              validationState === "valid" && "success",
              validationState === "invalid" && "error",
            )}
            id="signinPasswordBox"
          >
            <div className="box-title">{ONBOARDING_COPY.signIn.password}</div>
            <div className="input-wrap">
              <input
                type={showPassword ? "text" : "password"}
                id="signinPasswordInput"
                autoComplete="current-password"
                placeholder={ONBOARDING_COPY.signIn.passwordPlaceholder}
                value={password}
                onBlur={onBlur}
                onChange={(event) => onPasswordChange(event.target.value)}
              />
              <button
                className="show-toggle"
                id="signinPasswordToggle"
                type="button"
                onClick={() => setShowPassword((current) => !current)}
              >
                {showPassword
                  ? ONBOARDING_COPY.createAccount.hidePassword
                  : ONBOARDING_COPY.createAccount.showPassword}
              </button>
            </div>
          </div>
        </div>

        <button
          className="signin-btn"
          id="signinBtn"
          type="button"
          onClick={onContinue}
        >
          Sign In
        </button>
        <button
          className="forgot-link"
          id="forgotLink"
          type="button"
          onClick={onForgotPassword}
        >
          {ONBOARDING_COPY.signIn.forgotPassword}
        </button>
      </OnboardingContinueForm>
    </StepShell>
  );
}
