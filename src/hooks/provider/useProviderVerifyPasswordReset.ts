"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ROUTES } from "@/lib/constants/routes";
import useGetSearchParams from "@/hooks/useGetSearchParams";
import useAuthQuery from "@/hooks/queries/useAuthQuery";

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

      console.log("Submit Recovery Code Response:", response);
      if (response.success && response.data?.token) {
        // Store the token for the next step (reset password)
        // Using a distinct key to avoid conflicts with main auth token
        console.log("Setting recoveryToken:", response.data.token);
        localStorage.setItem("recoveryToken", response.data.token);
        const savedToken = localStorage.getItem("recoveryToken");
        console.log("Verified saved recoveryToken:", savedToken);

        localStorage.removeItem("refreshToken");

        toast.success("Code verified successfully");
        router.push(`${ROUTES.provider.newPassword}?email=${email}`);
      } else {
        toast.error(response.message || "Invalid code");
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
