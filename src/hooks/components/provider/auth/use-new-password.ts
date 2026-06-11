"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import * as z from "zod/v4";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "@/components/ui/sonner";
import { ROUTES } from "@/lib/constants/routes";
import useGetSearchParams from "@/hooks/use-get-search-params";
import { useAuthQuery } from "@/hooks/queries/use-auth";
import { ProviderPasswordSchema } from "@/lib/schemas/provider-auth-schema";
import { NEW_PASSWORD_TEXTS } from "@/lib/constants/components/provider/auth/new-password";
import { setUserType } from "@/lib/utils/getUserType";
import { getCleanErrorMessage } from "@/lib/utils/auth-error";
import type { SignInResponse } from "@/lib/types/api/auth";
import type { Route } from "next";

export const useNewPassword = () => {
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const email = useGetSearchParams("email");
  const router = useRouter();
  const { resetPasswordMutation } = useAuthQuery();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isValid },
  } = useForm<z.infer<typeof ProviderPasswordSchema>>({
    resolver: zodResolver(ProviderPasswordSchema),
    mode: "onChange",
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const password = watch("password");
  const confirmPassword = watch("confirmPassword");

  // Client-side guard kept intentionally: the redirect depends on values that
  // only exist in the browser (URL search param + localStorage recovery token),
  // so it cannot be relocated to middleware or a server redirect.
  useEffect(() => {
    if (!email) {
      router.push(ROUTES.provider.checkEmail);
      return;
    }

    const storedToken = localStorage.getItem("recoveryToken");
    if (!storedToken) {
      toast.error(NEW_PASSWORD_TEXTS.toasts.sessionExpired);
      router.push(
        `${ROUTES.provider.verifyPasswordReset}&email=${encodeURIComponent(email)}`,
      );
    }
  }, [email, router]);

  const handleBack = () => {
    if (!email) {
      router.back();
      return;
    }
    router.push(
      `${ROUTES.provider.verifyPasswordReset}&email=${encodeURIComponent(email)}`,
    );
  };

  const onSubmit = async (values: z.infer<typeof ProviderPasswordSchema>) => {
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
      router.push(
        `${ROUTES.provider.auth}?step=sign-in&email=${encodeURIComponent(email ?? "")}&reset=success` as Route,
      );
    } catch (error: unknown) {
      toast.error(
        getCleanErrorMessage(error) || NEW_PASSWORD_TEXTS.errors.general,
      );
    }
  };

  return {
    email,
    showPassword,
    setShowPassword,
    password,
    confirmPassword,
    isFormValid: isValid,
    register,
    handleSubmit,
    errors,
    onSubmit,
    handleBack,
    resetPasswordMutation,
  };
};
