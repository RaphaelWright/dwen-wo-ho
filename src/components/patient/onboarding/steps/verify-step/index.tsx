"use client";

import {
  useEffect,
  useRef,
  type ClipboardEvent,
  type KeyboardEvent,
} from "react";
import { useVerifyResend } from "@/hooks/components/patient/onboarding/verify-step/use-verify-resend";
import { OnboardingContinueForm } from "@/components/patient/onboarding/steps/continue-form";
import { StepShell } from "@/components/patient/onboarding/steps/step-shell";
import {
  ONBOARDING_COPY,
  ONBOARDING_OTP_INPUT_FOCUS_DELAY_MS,
} from "@/lib/constants/components/patient/onboarding";
import type { VerifyStepProps } from "@/lib/types/components/patient/onboarding";
import { formatResendTimer } from "@/lib/utils/shared/format-resend-timer";
import { cn } from "@/lib/utils";

export function VerifyStep({
  contactValue,
  otp,
  verifyFlow,
  onOtpChange,
  canContinue,
  onContinue,
}: VerifyStepProps) {
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const { resendSeconds, resetResend } = useVerifyResend();
  const isRecovery = verifyFlow === "recovery";

  useEffect(() => {
    const timer = window.setTimeout(() => {
      inputRefs.current[0]?.focus();
    }, ONBOARDING_OTP_INPUT_FOCUS_DELAY_MS);

    return () => window.clearTimeout(timer);
  }, []);

  const resendLabel =
    resendSeconds > 0
      ? `${ONBOARDING_COPY.verify.resendPrefix} `
      : ONBOARDING_COPY.verify.resendReady;

  const digits = Array.from({ length: 6 }, (_, index) => otp[index] ?? "");

  const focusInput = (index: number) => {
    inputRefs.current[index]?.focus();
  };

  const handleDigitChange = (index: number, value: string) => {
    const digit = value.replace(/\D/g, "").slice(-1);
    const nextDigits = [...digits];

    if (!digit) {
      nextDigits[index] = "";
      onOtpChange(nextDigits.join("").trim());
      return;
    }

    nextDigits[index] = digit;
    onOtpChange(nextDigits.join(""));

    if (index < 5) {
      focusInput(index + 1);
    }
  };

  const handleKeyDown = (
    index: number,
    event: KeyboardEvent<HTMLInputElement>,
  ) => {
    if (event.key === "Backspace" && !digits[index] && index > 0) {
      focusInput(index - 1);
    }
  };

  const handlePaste = (event: ClipboardEvent<HTMLInputElement>) => {
    event.preventDefault();
    const pasted = event.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, 6);
    onOtpChange(pasted);
    focusInput(Math.min(pasted.length, 5));
  };

  return (
    <OnboardingContinueForm canContinue={canContinue} onContinue={onContinue}>
      <StepShell
        title={
          isRecovery
            ? ONBOARDING_COPY.verify.recoveryTitle
            : ONBOARDING_COPY.verify.title
        }
        subtitle={
          <>
            {isRecovery
              ? ONBOARDING_COPY.verify.recoverySubtitlePrefix
              : ONBOARDING_COPY.verify.subtitlePrefix}
            <br />
            <strong>{contactValue}</strong>
          </>
        }
        centered
      >
        <div className={cn("otp-row", canContinue && "verified")} id="otpRow">
          {digits.map((digit, index) => (
            <input
              key={index}
              ref={(node) => {
                inputRefs.current[index] = node;
              }}
              className="otp-box"
              maxLength={1}
              inputMode="numeric"
              autoComplete={index === 0 ? "one-time-code" : "off"}
              aria-label={`Verification digit ${index + 1}`}
              value={digit}
              onChange={(event) => handleDigitChange(index, event.target.value)}
              onKeyDown={(event) => handleKeyDown(index, event)}
              onPaste={handlePaste}
            />
          ))}
        </div>

        <button
          className="resend-btn"
          id="resendBtn"
          type="button"
          disabled={resendSeconds > 0}
          onClick={resetResend}
        >
          {resendLabel}
          {resendSeconds > 0 ? (
            <span className="timer" id="resendTimer">
              {formatResendTimer(resendSeconds)}
            </span>
          ) : null}
        </button>
      </StepShell>
    </OnboardingContinueForm>
  );
}
