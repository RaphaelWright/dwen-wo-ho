"use client";

import { useEffect, useState } from "react";
import { useAuthQuery } from "@/hooks/queries/use-auth";
import { toast } from "@/components/ui/sonner";
import { SignUpVerificationProps } from "@/lib/types/provider/auth";
import { SIGN_UP_TEXTS } from "@/lib/constants/components/provider/auth/signup";

export const useSignUpVerification = ({
  email,
  onNext,
}: SignUpVerificationProps) => {
  const [isRunning, setIsRunning] = useState(true);
  const [seconds, setSeconds] = useState(120);
  const [errorMessage, setErrorMessage] = useState("");

  const { verifyEmailMutation, sendVerificationEmailMutation } = useAuthQuery();

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
      const verifyResponse = await verifyEmailMutation.mutateAsync({
        code: value,
        email: email.trim(),
      });

      if (verifyResponse?.success) {
        const token = verifyResponse.data?.token;

        if (token) {
          localStorage.setItem("token", token);

          const refreshTokenValue = verifyResponse.data?.refreshToken;
          if (refreshTokenValue) {
            localStorage.setItem("refreshToken", refreshTokenValue);
          }

          toast.success(SIGN_UP_TEXTS.toasts.verified);
          onNext();
        } else {
          setErrorMessage(SIGN_UP_TEXTS.errors.verifySuccessLoginFailed);
          toast.error(SIGN_UP_TEXTS.errors.noToken);
        }
      } else {
        const msg =
          verifyResponse?.message || SIGN_UP_TEXTS.errors.verifyFailed;
        setErrorMessage(msg);
        toast.error(msg);
      }
    } catch (error: any) {
      let errorMsg = SIGN_UP_TEXTS.errors.verifyFailed;

      if (error.response?.data?.message) {
        errorMsg = error.response.data.message;
      } else if (error.message) {
        try {
          if (error.message.trim().startsWith("{")) {
            const parsed = JSON.parse(error.message);
            errorMsg = parsed.message || error.message;
          } else {
            errorMsg = error.message;
          }
        } catch {
          errorMsg = error.message;
        }
      }

      setErrorMessage(errorMsg);
      toast.error(errorMsg);
    }
  };

  const handleResendCode = async () => {
    try {
      await sendVerificationEmailMutation.mutateAsync({ email });
      setSeconds(120);
      setIsRunning(true);
      setErrorMessage("");
    } catch (error: any) {
      let errorMsg = SIGN_UP_TEXTS.errors.resendFailed;

      if (error.response?.data?.message) {
        errorMsg = error.response.data.message;
      } else if (error.message) {
        try {
          if (error.message.trim().startsWith("{")) {
            const parsed = JSON.parse(error.message);
            errorMsg = parsed.message || error.message;
          } else {
            errorMsg = error.message;
          }
        } catch {
          errorMsg = error.message;
        }
      }
      setErrorMessage(errorMsg);
    }
  };

  return {
    seconds,
    errorMessage,
    verifyEmailMutation,
    sendVerificationEmailMutation,
    handleOTPComplete,
    handleResendCode,
  };
};
