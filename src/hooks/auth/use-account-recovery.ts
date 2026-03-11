"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthQuery } from "@/hooks/queries/use-auth";
import { getCleanErrorMessage } from "@/lib/utils/auth-error";
import { ROUTES } from "@/lib/constants/routes";

export const useAccountRecovery = (email: string, onForgotPassword?: () => void) => {
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState<string>("");
  const { recoverAccountMutation } = useAuthQuery();

  const handleRecoverAccount = async () => {
    setErrorMessage("");
    try {
      const response = await recoverAccountMutation.mutateAsync({ email });
      if (response.success) {
        if (onForgotPassword) {
          onForgotPassword();
        } else {
          router.push(`${ROUTES.provider.verifyPasswordReset}?email=${email}`);
        }
      } else {
        setErrorMessage(response.message || "Failed to send recovery email.");
      }
    } catch (error: any) {
      setErrorMessage(getCleanErrorMessage(error));
    }
  };

  return {
    handleRecoverAccount,
    isRecovering: recoverAccountMutation.isPending,
    recoveryError: errorMessage,
    setRecoveryError: setErrorMessage,
  };
};
