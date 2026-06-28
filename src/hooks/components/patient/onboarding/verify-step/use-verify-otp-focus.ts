"use client";

import { useEffect, useRef } from "react";
import { ONBOARDING_OTP_INPUT_FOCUS_DELAY_MS } from "@/lib/constants/components/patient/onboarding";

export function useVerifyOtpFocus() {
  const otpInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      otpInputRef.current?.focus();
    }, ONBOARDING_OTP_INPUT_FOCUS_DELAY_MS);

    return () => window.clearTimeout(timer);
  }, []);

  return { otpInputRef };
}
