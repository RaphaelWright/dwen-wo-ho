"use client";

import { useState } from "react";
import { toast } from "@/lib/utils/toast";
import { useRouter } from "next/navigation";
import { useSelectedValuesFromReactHookForm } from "@/hooks/forms/use-selected-values";
import {
  ProviderLoginSchema,
  ProviderLoginFormData,
} from "@/lib/schemas/provider-auth-schema";
import { useAuthQuery } from "@/hooks/queries/use-auth";
import { setUserType } from "@/lib/utils/getUserType";
import { ROUTES } from "@/lib/constants/routes";
import { SIGN_UP_TEXTS } from "@/lib/constants/components/provider/auth/signup";
import { getCleanErrorMessage } from "@/lib/utils/auth-error";
import { getProviderRedirectInfo } from "@/lib/utils/auth-redirect";
import {
  buildProviderSignupResumeUrl,
  clearProviderAuthStorage,
  hasProviderAuthToken,
  isProfileIncompleteError,
  parseProfileIncompleteStepFromMessage,
} from "@/lib/utils/provider-signup-resume";
import { useAccountRecovery } from "@/hooks/auth/use-account-recovery";
import type { Route } from "next";

export const useProviderSignIn = ({
  email,
  onForgotPassword,
}: {
  email: string;
  onBack: () => void;
  onForgotPassword?: () => void;
  onProfileIncomplete?: (step: number) => void;
}) => {
  const router = useRouter();
  const [isRedirecting, setIsRedirecting] = useState(false);
  const { loginMutation } = useAuthQuery();
  const { handleRecoverAccount, isRecovering } = useAccountRecovery(
    email,
    onForgotPassword,
  );

  const { register, handleSubmit, errors } = useSelectedValuesFromReactHookForm(
    ProviderLoginSchema,
    {
      mode: "onChange",
      defaultValues: {
        email,
        password: "",
      },
    },
  );

  const onSubmit = async (values: ProviderLoginFormData) => {
    try {
      const response = await loginMutation.mutateAsync({
        email: values.email,
        password: values.password,
      });

      const {
        token,
        userData,
        refreshToken: refreshTokenValue,
      } = response || {};

      if (token) {
        localStorage.setItem("token", token);
        if (userData?.userRole === "ROLE_CURATOR") {
          localStorage.setItem("curatorToken", token);
          setUserType("curator");
        } else {
          setUserType("provider");
        }
      }

      if (refreshTokenValue) {
        localStorage.setItem("refreshToken", refreshTokenValue);
      }

      if (userData) {
        const redirectInfo = getProviderRedirectInfo(userData, response);

        if (redirectInfo.isPending) {
          localStorage.setItem("pendingUser:v1", JSON.stringify(userData));
        } else {
          localStorage.removeItem("pendingUser:v1");
        }

        setIsRedirecting(true);
        const targetPath = redirectInfo.step
          ? `${redirectInfo.path}?email=${encodeURIComponent(values.email)}&step=${redirectInfo.step}`
          : redirectInfo.path;

        router.replace(targetPath as Route);
        return;
      }

      localStorage.removeItem("pendingUser:v1");
      setIsRedirecting(true);
      router.replace(ROUTES.provider.home as Route);
    } catch (error: unknown) {
      const errMessage = getCleanErrorMessage(error);

      if (errMessage.includes("ACCOUNT PENDING")) {
        router.replace(ROUTES.provider.home as Route);
        return;
      }

      if (isProfileIncompleteError(errMessage)) {
        const step = parseProfileIncompleteStepFromMessage(errMessage);

        if (hasProviderAuthToken()) {
          setUserType("provider");
          toast.info(SIGN_UP_TEXTS.resume.continueProfile);
          setIsRedirecting(true);
          router.replace(
            buildProviderSignupResumeUrl(values.email, step) as Route,
          );
          return;
        }

        toast.error(SIGN_UP_TEXTS.resume.sessionExpired);
        return;
      }

      clearProviderAuthStorage();
      setUserType(null);
      toast.error(errMessage);
    }
  };

  return {
    register,
    handleSubmit,
    errors,
    onSubmit: handleSubmit(onSubmit),
    isLoading: loginMutation.isPending || isRedirecting,
    isRecovering,
    handleRecoverAccount,
  };
};
