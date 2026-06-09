"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ProviderLoginSchema,
  ProviderLoginFormData,
} from "@/lib/schemas/provider-auth-schema";
import { ROUTES } from "@/lib/constants/routes";
import { STATIC_ENDPOINTS } from "@/lib/constants/endpoints";
import { api } from "@/lib/api";
import { getCleanErrorMessage } from "@/lib/utils/auth-error";
import { toast } from "@/components/ui/sonner";
import useGetSearchParams from "@/hooks/use-get-search-params";

export function useProviderSignIn() {
  const router = useRouter();
  const searchEmail = useGetSearchParams("email");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [password, setPassword] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const form = useForm<ProviderLoginFormData>({
    resolver: zodResolver(ProviderLoginSchema),
    defaultValues: {
      email: searchEmail ? (searchEmail as string) : "",
      password: "",
    },
  });

  const { reset } = form;

  useEffect(() => {
    if (searchEmail) {
      reset({ email: searchEmail as string, password: "" });
    }
  }, [searchEmail, reset]);

  useEffect(() => {
    if (!searchEmail) {
      router.push(ROUTES.provider.checkEmail);
    }
  }, [searchEmail, router]);

  const onSubmit = async (values: ProviderLoginFormData) => {
    setIsLoading(true);

    try {
      const response = await api(STATIC_ENDPOINTS.AUTH.LOGIN, {
        method: "POST",
        body: JSON.stringify(values),
      });

      if (response?.success) {
        if (response?.data?.token) {
          localStorage.setItem("token", response?.data?.token);
        }

        if (response?.data?.refreshToken) {
          localStorage.setItem("refreshToken", response?.data?.refreshToken);
        }

        const userData = response?.data;
        const isPending =
          userData?.applicationStatus === "PENDING" ||
          userData?.status === "PENDING" ||
          userData?.isVerified === false ||
          response?.message === "ACCOUNT PENDING";

        if (isPending) {
          localStorage.setItem("pendingUser", JSON.stringify(userData));
        }

        router.push(ROUTES.provider.home);
      } else {
        toast.error(
          getCleanErrorMessage(response?.message ?? "Sign in failed"),
        );
      }
    } catch (error: unknown) {
      const errorMsg = getCleanErrorMessage(error);

      if (errorMsg && errorMsg.includes("Profile is not complete")) {
        localStorage.setItem("profileCompletionEmail", values.email);

        if (errorMsg.includes("upload your profile photo")) {
          router.push(
            `${ROUTES.provider.signUp}?email=${encodeURIComponent(
              values.email,
            )}&step=photo`,
          );
        } else if (errorMsg.includes("office phone number")) {
          router.push(
            `${ROUTES.provider.signUp}?email=${encodeURIComponent(
              values.email,
            )}&step=bio`,
          );
        } else if (errorMsg.includes("add your specialty")) {
          router.push(
            `${ROUTES.provider.signUp}?email=${encodeURIComponent(
              values.email,
            )}&step=specialty`,
          );
        } else {
          router.push(
            `${ROUTES.provider.signUp}?email=${encodeURIComponent(
              values.email,
            )}&step=photo`,
          );
        }
      } else {
        toast.error(errorMsg);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    form.setValue("password", e.target.value);
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  return {
    form,
    onSubmit,
    showPassword,
    togglePasswordVisibility,
    password,
    handlePasswordChange,
    isLoading,
    email: searchEmail,
    router,
  };
}
