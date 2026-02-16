"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { ROUTES } from "@/lib/constants/routes";
import useGetSearchParams from "@/hooks/useGetSearchParams";
import useAuthQuery from "@/hooks/queries/useAuthQuery";
import { ProviderPasswordSchema } from "@/lib/schemas/provider.auth.schema";
import { NEW_PASSWORD_TEXTS } from "@/lib/constants/components/provider/auth/new-password";
import { setUserType } from "@/lib/utils/getUserType";

/* eslint-disable @typescript-eslint/no-explicit-any */
const getCleanErrorMessage = (error: any): string => {
  let message = NEW_PASSWORD_TEXTS.errors.general;

  if (typeof error === "string") {
    message = error;
  } else if (error?.response?.data?.message) {
    message = error.response.data.message;
  } else if (error?.message) {
    message = error.message;
  }

  if (typeof message === "string" && message.trim().startsWith("{")) {
    try {
      const parsed = JSON.parse(message);
      if (parsed.message) return parsed.message;
      if (parsed.error) return parsed.error;
    } catch {
      // Not JSON
    }
  }

  return message;
};

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

      if (response.success) {
        localStorage.removeItem("recoveryToken");

        const token = response.data?.token;
        const userData = response.data?.userData || response.data;

        if (token) {
          localStorage.setItem("token", token);
          if (userData?.userRole === "ROLE_CURATOR") {
            localStorage.setItem("curatorToken", token);
            setUserType("curator");
          } else {
            setUserType("provider");
          }
        }

        const refreshTokenValue = response.data?.refreshToken;
        if (refreshTokenValue) {
          localStorage.setItem("refreshToken", refreshTokenValue);
        }

        toast.success(NEW_PASSWORD_TEXTS.toasts.success);

        if (userData?.applicationStatus === "APPROVED") {
          router.push(ROUTES.provider.profile);
        } else {
          router.push(ROUTES.provider.home);
        }
      } else {
        setErrorMessage(
          getCleanErrorMessage(
            response.message || NEW_PASSWORD_TEXTS.errors.passwordResetFailed,
          ),
        );
      }
    } catch (error) {
      setErrorMessage(getCleanErrorMessage(error));
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
