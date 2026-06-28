"use client";

import { Button } from "@/components/ui/button";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { useVerifyOtpFocus } from "@/hooks/components/patient/onboarding/verify-step/use-verify-otp-focus";
import { useVerifyResend } from "@/hooks/components/patient/onboarding/verify-step/use-verify-resend";
import { ONBOARDING_COPY } from "@/lib/constants/components/patient/onboarding";
import { VerifyStepProps } from "@/lib/types/components/patient/onboarding";
import { formatResendTimer } from "@/lib/utils/shared/format-resend-timer";

export function VerifyStep({
  contactValue,
  otp,
  onOtpChange,
}: VerifyStepProps) {
  const { otpInputRef } = useVerifyOtpFocus();
  const { resendSeconds, resetResend } = useVerifyResend();

  const resendLabel =
    resendSeconds > 0
      ? `${ONBOARDING_COPY.verify.resendPrefix} ${formatResendTimer(resendSeconds)}`
      : ONBOARDING_COPY.verify.resendReady;

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="font-heading text-foreground text-center text-2xl font-semibold tracking-tight">
          {ONBOARDING_COPY.verify.title}
        </h1>

        <p className="text-muted-foreground text-center text-sm leading-relaxed">
          {ONBOARDING_COPY.verify.subtitlePrefix}{" "}
          <strong className="text-foreground text-center font-semibold">
            {contactValue}
          </strong>
        </p>
      </div>
      <div className="flex justify-center">
        <InputOTP
          ref={otpInputRef}
          maxLength={6}
          value={otp}
          onChange={onOtpChange}
        >
          <InputOTPGroup>
            {Array.from({ length: 6 }, (_, index) => (
              <InputOTPSlot key={index} index={index} />
            ))}
          </InputOTPGroup>
        </InputOTP>
      </div>

      <Button
        type="button"
        variant="link"
        className="text-primary h-auto w-full p-0"
        disabled={resendSeconds > 0}
        onClick={resetResend}
      >
        {resendLabel}
      </Button>
    </div>
  );
}
