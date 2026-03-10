"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ProviderLoginSchema,
  ProviderLoginFormData,
} from "@/lib/schemas/provider.auth.schema";
import { ROUTES } from "@/lib/constants/routes";
import { STATIC_ENDPOINTS } from "@/lib/constants/endpoints";
import { api } from "@/lib/api";
import { DEFAULT_PENDING_USER_INFO } from "@/lib/constants/mock-data";
import useGetSearchParams from "@/hooks/useGetSearchParams";

export function useProviderSignIn() {
  const router = useRouter();
  const searchEmail = useGetSearchParams("email");

  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [password, setPassword] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [showPendingModal, setShowPendingModal] = useState(false);
  const [userInfo, setUserInfo] = useState({
    ...DEFAULT_PENDING_USER_INFO,
  });

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

  const getCleanErrorMessage = (error: any): string => {
    let message = "An unexpected error occurred.";

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
      } catch {}
    }

    return message;
  };

  const onSubmit = async (values: ProviderLoginFormData) => {
    setIsLoading(true);
    setErrorMessage("");

    try {
      const response = await api(STATIC_ENDPOINTS.AUTH.LOGIN, {
        method: "POST",
        body: JSON.stringify(values),
      });

      if (response?.success) {
        // Store token if needed
        if (response?.data?.token) {
          localStorage.setItem("token", response?.data?.token);
        }

        // Store refresh token if available
        if (response?.data?.refreshToken) {
          localStorage.setItem("refreshToken", response?.data?.refreshToken);
        }

        // Check for pending status
        const userData = response?.data;
        const isPending =
          userData?.applicationStatus === "PENDING" ||
          userData?.status === "PENDING" ||
          userData?.isVerified === false ||
          response?.message === "ACCOUNT PENDING";

        if (isPending) {
          const userDataStr = JSON.stringify(userData);
          localStorage.setItem("pendingUser", userDataStr);
          router.push(ROUTES.provider.home);
        } else {
          router.push(ROUTES.provider.home);
        }
      } else {
        setErrorMessage(
          getCleanErrorMessage(response?.message ?? "Sign in failed"),
        );
      }
    } catch (error: any) {
      const errorMsg = getCleanErrorMessage(error);

      // Check if error is about incomplete profile
      if (errorMsg && errorMsg.includes("Profile is not complete")) {
        localStorage.setItem("profileCompletionEmail", values.email);

        if (errorMsg.includes("upload your profile photo")) {
          router.push(
            `/provider/signup?email=${encodeURIComponent(
              values.email,
            )}&step=photo`,
          );
        } else if (errorMsg.includes("office phone number")) {
          router.push(
            `/provider/signup?email=${encodeURIComponent(
              values.email,
            )}&step=bio`,
          );
        } else if (errorMsg.includes("add your specialty")) {
          router.push(
            `/provider/signup?email=${encodeURIComponent(
              values.email,
            )}&step=specialty`,
          );
        } else {
          router.push(
            `/provider/signup?email=${encodeURIComponent(
              values.email,
            )}&step=photo`,
          );
        }
      } else {
        setErrorMessage(errorMsg);
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
    errorMessage,
    showPendingModal,
    setShowPendingModal,
    userInfo,
    email: searchEmail,
    router,
  };
}
