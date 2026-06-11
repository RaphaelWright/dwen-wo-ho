"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import type { Route } from "next";
import { useAuthQuery } from "@/hooks/queries/use-auth";
import { getCleanErrorMessage } from "@/lib/utils/auth-error";
import { setUserType } from "@/lib/utils/getUserType";
import { buildProviderSignupResumeUrl } from "@/lib/utils/provider-signup-resume";
import { SIGN_UP_TEXTS } from "@/lib/constants/components/provider/auth/signup";
import { toast } from "@/components/ui/sonner";

export function useProviderVerifyEmail() {
  const [isRunning, setIsRunning] = useState(true);
  const [seconds, setSeconds] = useState(120);
  const params = useParams();
  const { email } = params;
  const { verifyEmailMutation } = useAuthQuery();
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

  const handleOTPComplete = async (value: string) => {
    try {
      const decodedEmail = decodeURIComponent(email as string);
      const response = await verifyEmailMutation.mutateAsync({
        code: value,
        email: decodedEmail,
      });

      if (response) {
        if (response.token) {
          localStorage.setItem("token", response.token);
        }

        if (response.refreshToken) {
          localStorage.setItem("refreshToken", response.refreshToken);
        }

        setUserType("provider");
        router.replace(
          buildProviderSignupResumeUrl(decodedEmail, "photo") as Route,
        );
      }
    } catch (error: unknown) {
      toast.error(
        getCleanErrorMessage(error) || SIGN_UP_TEXTS.errors.verifyFailed,
      );
    }
  };

  const resetTimer = () => {
    setSeconds(120);
    setIsRunning(true);
  };

  return {
    email,
    seconds,
    isRunning,
    handleOTPComplete,
    resetTimer,
    verifyEmailMutation,
    router,
  };
}
