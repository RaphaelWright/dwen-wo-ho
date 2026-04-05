"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ROUTES } from "@/lib/constants/routes";
import useGetSearchParams from "@/hooks/use-get-search-params";
import { VerifyPasswordResetProps } from "@/lib/types/provider/auth";

export const useVerifyPasswordReset = ({
  email: propEmail,
  onBack,
}: VerifyPasswordResetProps) => {
  const [isRunning, setIsRunning] = useState(true);
  const [seconds, setSeconds] = useState(120);
  const searchParamEmail = useGetSearchParams("email");
  const email = propEmail || searchParamEmail;
  const router = useRouter();

  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    if (isRunning && seconds > 0) {
      intervalId = setInterval(() => {
        setSeconds((prev) => prev - 1);
      }, 1000);
    } else if (seconds === 0) {
      setIsRunning(false);
    }

    return () => clearInterval(intervalId);
  }, [isRunning, seconds]);

  const handleOTPComplete = () => {
    router.push(`${ROUTES.provider.newPassword}?email=${email}`);
  };

  const handleResend = () => {
    setSeconds(120);
    setIsRunning(true);
  };

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      router.back();
    }
  };

  return {
    isRunning,
    seconds,
    email,
    router,
    handleOTPComplete,
    handleResend,
    handleBack,
  };
};
