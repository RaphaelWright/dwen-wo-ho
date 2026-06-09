"use client";

import { useEffect, useRef, useState } from "react";
import { useAuthQuery } from "@/hooks/queries/use-auth";
import { toast } from "@/components/ui/sonner";
import { SignUpVerificationProps } from "@/lib/types/provider/auth";
import { getCleanErrorMessage } from "@/lib/utils/auth-error";
import {
  OTP_INPUT_FOCUS_DELAY_MS,
  SIGN_UP_TEXTS,
} from "@/lib/constants/components/provider/auth/signup";

export const useSignUpVerification = ({
  email,
  onNext,
}: SignUpVerificationProps) => {
  const [isRunning, setIsRunning] = useState(true);
  const [seconds, setSeconds] = useState(60);
  const [errorMessage, setErrorMessage] = useState("");
  const otpInputRef = useRef<HTMLInputElement>(null);

  const { verifyEmailMutation, sendVerificationEmailMutation, resendVerificationEmailMutation } = useAuthQuery();

  useEffect(() => {
    if (verifyEmailMutation.isPending) return;

    const timer = setTimeout(() => {
      otpInputRef.current?.focus();
    }, OTP_INPUT_FOCUS_DELAY_MS);

    return () => clearTimeout(timer);
  }, [verifyEmailMutation.isPending]);

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

      if (verifyResponse) {
        const token = verifyResponse.token;

        if (token) {
          localStorage.setItem("token", token);

          // If refreshToken is present in TokenResponse or SignInResponse
          const refreshTokenValue = verifyResponse.refreshToken;
          if (refreshTokenValue) {
            localStorage.setItem("refreshToken", refreshTokenValue);
          }

          toast.success(SIGN_UP_TEXTS.toasts.verified);
          onNext();
        } else {
          setErrorMessage(SIGN_UP_TEXTS.errors.verifySuccessLoginFailed);
          toast.error(SIGN_UP_TEXTS.errors.noToken);
        }
      }
    } catch (error: unknown) {
      const errorMsg = getCleanErrorMessage(error) || SIGN_UP_TEXTS.errors.verifyFailed;

      setErrorMessage(errorMsg);
      toast.error(errorMsg);
    }
  };

  const handleResendCode = async () => {
    try {
      await resendVerificationEmailMutation.mutateAsync({ email });
      setSeconds(60);
      setIsRunning(true);
      setErrorMessage("");
    } catch (error: unknown) {
      const errorMsg = getCleanErrorMessage(error) || SIGN_UP_TEXTS.errors.resendFailed;
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
    otpInputRef,
    resendVerificationEmailMutation,
  };
};
