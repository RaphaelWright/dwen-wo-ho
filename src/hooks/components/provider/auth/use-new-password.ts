"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import * as z from "zod/v4";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "@/components/ui/sonner";
import { ROUTES } from "@/lib/constants/routes";
import useGetSearchParams from "@/hooks/use-get-search-params";
import {useAuthQuery} from "@/hooks/queries/use-auth";
import { ProviderPasswordSchema } from "@/lib/schemas/provider-auth-schema";
import { NEW_PASSWORD_TEXTS } from "@/lib/constants/components/provider/auth/new-password";
import { setUserType } from "@/lib/utils/getUserType";
import { getCleanErrorMessage } from "@/lib/utils/auth-error";
import type { SignInResponse } from "@/lib/types/api/auth";

export const useNewPassword = () => {
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const email = useGetSearchParams("email");
  const router = useRouter();
  const { resetPasswordMutation } = useAuthQuery();

  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<z.infer<typeof ProviderPasswordSchema>>({
    resolver: zodResolver(ProviderPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  useEffect(() => {
    if (!email) {
      router.push(ROUTES.provider.checkEmail);
      return;
    }

    const storedToken = localStorage.getItem("recoveryToken");
    if (!storedToken) {
      toast.error(NEW_PASSWORD_TEXTS.toasts.sessionExpired);
      router.push(`${ROUTES.provider.verifyPasswordReset}?email=${email}`);
    }
  }, [email, router]);

  const onSubmit = async (values: z.infer<typeof ProviderPasswordSchema>) => {
    setErrorMessage("");
    try {
      const storedToken = localStorage.getItem("recoveryToken");

      const response = await resetPasswordMutation.mutateAsync({
        password: values.password,
        confirmPassword: values.confirmPassword,
        token: storedToken || undefined,
      });

      localStorage.removeItem("recoveryToken");

      const signInPayload = response as unknown;
      if (signInPayload && typeof signInPayload === "object") {
        const signInResponse = signInPayload as SignInResponse;
        const token = signInResponse.token;
        const userData = signInResponse.userData ?? signInPayload;

        if (token) {
          localStorage.setItem("token", token);
          if (
            userData &&
            typeof userData === "object" &&
            "userRole" in userData &&
            userData.userRole === "ROLE_CURATOR"
          ) {
            localStorage.setItem("curatorToken", token);
            setUserType("curator");
          } else {
            setUserType("provider");
          }
        }

        const refreshTokenValue = signInResponse.refreshToken;
        if (refreshTokenValue) {
          localStorage.setItem("refreshToken", refreshTokenValue);
        }

        toast.success(NEW_PASSWORD_TEXTS.toasts.success);

        if (
          userData &&
          typeof userData === "object" &&
          "applicationStatus" in userData &&
          userData.applicationStatus === "APPROVED"
        ) {
          router.push(ROUTES.provider.profile);
        } else {
          router.push(ROUTES.provider.home);
        }
        return;
      }

      toast.success(NEW_PASSWORD_TEXTS.toasts.success);
      router.push(ROUTES.provider.singIn);
    } catch (error: unknown) {
      setErrorMessage(getCleanErrorMessage(error) || NEW_PASSWORD_TEXTS.errors.general);
    }
  };

  return {
    showPassword,
    setShowPassword,
    errorMessage,
    control,
    register,
    handleSubmit,
    errors,
    onSubmit,
    router,
    resetPasswordMutation,
  };
};
