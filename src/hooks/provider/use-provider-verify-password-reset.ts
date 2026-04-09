"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "@/components/ui/sonner";
import { ROUTES } from "@/lib/constants/routes";
import useGetSearchParams from "@/hooks/use-get-search-params";
import { useAuthQuery } from "@/hooks/queries/use-auth";

export function useProviderVerifyPasswordReset() {
  const [isRunning, setIsRunning] = useState(true);
  const [seconds, setSeconds] = useState(120); // 2 minutes
  const [isVerifying, setIsVerifying] = useState(false);

  const email = useGetSearchParams("email");
  const router = useRouter();
  const { submitRecoveryCodeMutation, recoverAccountMutation } = useAuthQuery();

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

  const handleVerifyCode = async (code: string) => {
    if (!email) {
      toast.error("Email is missing");
      return;
    }

    setIsVerifying(true);
    try {
      const response = await submitRecoveryCodeMutation.mutateAsync({
        code,
        email: email,
      });

      if (response && response.token) {
        localStorage.setItem("recoveryToken", response.token);
        localStorage.removeItem("refreshToken");

        toast.success("Code verified successfully");
        router.push(`${ROUTES.provider.newPassword}?email=${email}`);
      } else {
        toast.error("Invalid code or missing token");
      }
    } catch (error: any) {
      const errorMsg =
        error?.response?.data?.message ||
        error?.message ||
        "Verification failed";
      toast.error(errorMsg);
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResendCode = async () => {
    if (!email) return;

    setSeconds(120);
    setIsRunning(true);

    try {
      await recoverAccountMutation.mutateAsync({ email });
      toast.success("Code resent successfully");
    } catch (error) {
      toast.error("Failed to resend code");
    }
  };

  const handleBack = () => {
    router.back();
  };

  return {
    email,
    seconds,
    isVerifying,
    handleVerifyCode,
    handleResendCode,
    handleBack,
    recoverAccountMutation,
  };
}
