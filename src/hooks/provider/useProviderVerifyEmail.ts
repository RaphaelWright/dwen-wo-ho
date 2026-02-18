"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { ROUTES } from "@/lib/constants/routes";
import useAuthQuery from "@/hooks/queries/useAuthQuery";

export function useProviderVerifyEmail() {
  const [isRunning, setIsRunning] = useState(true);
  const [seconds, setSeconds] = useState(120); // 2 minutes
  const [errorMessage, setErrorMessage] = useState("");
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
    setErrorMessage("");

    try {
      const response = await verifyEmailMutation.mutateAsync({
        code: value,
        email: decodeURIComponent(email as string),
      });

      if (response.success) {
        if (response.data?.token) {
          localStorage.setItem("token", response.data.token);
        }
        // Redirect to profile setup (photo step)
        router.push(
          `${ROUTES.provider.signUp}?email=${encodeURIComponent(
            email as string,
          )}&step=photo`,
        );
      } else {
        setErrorMessage(response.message || "Verification failed");
      }
    } catch (error: any) {
      const errorMsg =
        (error as any)?.response?.data?.message ||
        "Verification failed. Please try again.";
      setErrorMessage(errorMsg);
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
    errorMessage,
    handleOTPComplete,
    resetTimer,
    verifyEmailMutation,
    router,
  };
}
