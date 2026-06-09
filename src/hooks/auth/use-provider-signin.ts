"use client";

import { useEffect, useState } from "react";
import { toast } from "@/components/ui/sonner";
import { useRouter } from "next/navigation";
import { useSelectedValuesFromReactHookForm } from "@/hooks/forms/use-selected-values";
import {
  ProviderLoginSchema,
  ProviderLoginFormData,
} from "@/lib/schemas/provider-auth-schema";
import { useAuthQuery } from "@/hooks/queries/use-auth";
import { setUserType } from "@/lib/utils/getUserType";
import { ROUTES } from "@/lib/constants/routes";
import { getCleanErrorMessage } from "@/lib/utils/auth-error";
import { getProviderRedirectInfo } from "@/lib/utils/auth-redirect";
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
  const { handleRecoverAccount, isRecovering } = useAccountRecovery(email, onForgotPassword);

  const { register, handleSubmit, errors, setValue } =
    useSelectedValuesFromReactHookForm(ProviderLoginSchema, {
      mode: "onChange",
      defaultValues: {
        email,
        password: "",
      },
    });

  useEffect(() => {
    if (email) {
      setValue("email", email, { shouldValidate: true });
    }
  }, [email, setValue]);

  const onSubmit = async (values: ProviderLoginFormData) => {
    localStorage.removeItem("token");
    localStorage.removeItem("curatorToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("pendingUser");

    try {
      const response = await loginMutation.mutateAsync({
        email: values.email,
        password: values.password,
      });

      const { token, userData, refreshToken: refreshTokenValue } = response || {};

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
          localStorage.setItem("pendingUser", JSON.stringify(userData));
        } else {
          localStorage.removeItem("pendingUser");
        }

        setIsRedirecting(true);
        const targetPath = redirectInfo.step 
          ? `${redirectInfo.path}?email=${encodeURIComponent(values.email)}&step=${redirectInfo.step}`
          : redirectInfo.path;
          
        router.push(targetPath as Route);
        return;
      }

      // Final fallback
      localStorage.removeItem("pendingUser");
      setIsRedirecting(true);
      router.push(ROUTES.provider.home);

    } catch (error: unknown) {
      const errMessage = getCleanErrorMessage(error);
      
      if (errMessage.includes("ACCOUNT PENDING")) {
        router.push(ROUTES.provider.home);
        return;
      }

      if (errMessage.includes("Profile is not complete")) {
        const step = errMessage.includes("upload your profile photo") ? "photo" :
                     errMessage.includes("office phone number") ? "bio" :
                     errMessage.includes("add your specialty") ? "specialty" : "photo";
        
        router.push(`/provider/signup?email=${encodeURIComponent(email)}&step=${step}`);
      } else {
        toast.error(errMessage);
      }
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
