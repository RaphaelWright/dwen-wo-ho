"use client";

import { useEffect, useState } from "react";
import { ONBOARDING_VERIFY_RESEND_SECONDS } from "@/lib/constants/components/patient/onboarding";

export function useVerifyResend() {
  const [resendSeconds, setResendSeconds] = useState(
    ONBOARDING_VERIFY_RESEND_SECONDS,
  );

  useEffect(() => {
    if (resendSeconds <= 0) {
      return;
    }

    const timer = window.setInterval(() => {
      setResendSeconds((current) => Math.max(current - 1, 0));
    }, 1000);

    return () => window.clearInterval(timer);
  }, [resendSeconds]);

  const resetResend = () => {
    setResendSeconds(ONBOARDING_VERIFY_RESEND_SECONDS);
  };

  return { resendSeconds, resetResend };
}
