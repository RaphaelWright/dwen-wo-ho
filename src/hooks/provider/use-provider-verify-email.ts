"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { ROUTES } from "@/lib/constants/routes";
import { useAuthQuery } from "@/hooks/queries/use-auth";
import { getCleanErrorMessage } from "@/lib/utils/auth-error";
import { toast } from "@/components/ui/sonner";

export function useProviderVerifyEmail() {
  const [isRunning, setIsRunning] = useState(true);
  const [seconds, setSeconds] = useState(120); // 2 minutes
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
      const response = await verifyEmailMutation.mutateAsync({
        code: value,
        email: decodeURIComponent(email as string),
      });

      if (response) {
        if (response.token) {
          localStorage.setItem("token", response.token);
        }
        // Redirect to profile setup (photo step)
        router.push(
          `${ROUTES.provider.signUp}?email=${encodeURIComponent(
            email as string,
          )}&step=photo`,
        );
      }
    } catch (error: unknown) {
      toast.error(
        getCleanErrorMessage(error) || "Verification failed. Please try again.",
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
