"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSelectedValuesFromReactHookForm } from "@/hooks/forms/use-selected-values";
import {
  ProviderLoginSchema,
  ProviderLoginFormData,
} from "@/lib/schemas/provider-auth-schema";
import { useAuthQuery } from "@/hooks/queries/use-auth";
import { setUserType } from "@/lib/utils/getUserType";
import { ROUTES } from "@/lib/constants/routes";
import { DEFAULT_PENDING_USER_INFO } from "@/lib/constants/mock-data";
import { getCleanErrorMessage } from "@/lib/utils/auth-error";
import { getProviderRedirectInfo } from "@/lib/utils/auth-redirect";
import { useAccountRecovery } from "@/hooks/auth/use-account-recovery";

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
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [showPendingModal, setShowPendingModal] = useState(false);
  const [userInfo, setUserInfo] = useState({
    ...DEFAULT_PENDING_USER_INFO,
    profileImage: undefined as string | undefined,
  });

  const { loginMutation } = useAuthQuery();
  const { handleRecoverAccount, isRecovering, recoveryError } = useAccountRecovery(email, onForgotPassword);

  const { register, handleSubmit, errors } =
    useSelectedValuesFromReactHookForm(ProviderLoginSchema, {
      mode: "onChange",
      defaultValues: {
        email,
        password: "",
      },
    });

  const onSubmit = async (values: ProviderLoginFormData) => {
    setErrorMessage("");
    localStorage.removeItem("token");
    localStorage.removeItem("curatorToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("pendingUser");

    try {
      const response = await loginMutation.mutateAsync({
        email: values.email,
        password: values.password,
      });

      if (!response.success) {
        setErrorMessage(getCleanErrorMessage(response.message || "Sign in failed"));
        return;
      }

      const { token, userData, refreshToken: refreshTokenValue } = response.data || {};

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

        if (redirectInfo.userInfo) {
          setUserInfo(redirectInfo.userInfo);
        }

        if (redirectInfo.isPending) {
          localStorage.setItem("pendingUser", JSON.stringify(userData));
        } else {
          localStorage.removeItem("pendingUser");
        }

        setIsRedirecting(true);
        const targetPath = redirectInfo.step 
          ? `${redirectInfo.path}?email=${encodeURIComponent(values.email)}&step=${redirectInfo.step}`
          : redirectInfo.path;
          
        router.push(targetPath as any);
        return;
      }

      // Final fallback
      localStorage.removeItem("pendingUser");
      setIsRedirecting(true);
      router.push(ROUTES.provider.home);

    } catch (error: any) {
      const errMessage = getCleanErrorMessage(error);
      
      if (errMessage.includes("ACCOUNT PENDING")) {
        setUserInfo({
          name: "Provider",
          title: "Health Provider",
          timeAgo: "Recently",
          profileImage: undefined,
        });
        router.push(ROUTES.provider.home);
        return;
      }

      if (errMessage.includes("Profile is not complete")) {
        const step = errMessage.includes("upload your profile photo") ? "photo" :
                     errMessage.includes("office phone number") ? "bio" :
                     errMessage.includes("add your specialty") ? "specialty" : "photo";
        
        router.push(`/provider/signup?email=${encodeURIComponent(email)}&step=${step}`);
      } else {
        setErrorMessage(errMessage);
      }
    }
  };

  return {
    register,
    handleSubmit,
    errors,
    onSubmit: handleSubmit(onSubmit),
    errorMessage: errorMessage || recoveryError,
    isLoading: loginMutation.isPending || isRedirecting,
    isRecovering,
    handleRecoverAccount,
    showPendingModal,
    setShowPendingModal,
    userInfo,
  };
};
