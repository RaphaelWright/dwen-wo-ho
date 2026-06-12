"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import type { Route } from "next";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ProviderPasswordSchema,
  ProviderPasswordFormData,
} from "@/lib/schemas/provider-auth-schema";
import { ROUTES } from "@/lib/constants/routes";
import { useAuthQuery } from "@/hooks/queries/use-auth";
import { getCleanErrorMessage } from "@/lib/utils/auth-error";
import { toast } from "@/lib/utils/toast";

interface StoredSignupData {
  email: string;
  fullName: string;
  professionalTitle: string;
}

export function useProviderPassword() {
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState<boolean>(false);
  // Lazily read once from localStorage; only consumed in the submit handler so
  // there is no render output to mismatch during hydration.
  const [signupData] = useState<StoredSignupData | null>(() => {
    if (typeof window === "undefined") {
      return null;
    }
    const data = localStorage.getItem("signupData");
    return data ? (JSON.parse(data) as StoredSignupData) : null;
  });
  const params = useParams();
  const { email } = params;
  const router = useRouter();
  const { signupMutation } = useAuthQuery();

  const form = useForm<ProviderPasswordFormData>({
    resolver: zodResolver(ProviderPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (values: ProviderPasswordFormData) => {
    if (!signupData) {
      toast.error("Signup data not found. Please start over.");
      return;
    }

    try {
      // Complete the account creation with password
      const response = await signupMutation.mutateAsync({
        email: signupData.email,
        password: values.password,
        fullName: signupData.fullName,
        professionalTitle: signupData.professionalTitle,
      });

      if (response) {
        localStorage.removeItem("signupData");

        // Store the token for future API calls
        if (response.token) {
          localStorage.setItem("authToken", response.token);
        }

        router.push(`${ROUTES.provider.signUp}/${email}/profile` as Route);
      }
    } catch (error: unknown) {
      toast.error(
        getCleanErrorMessage(error) ||
          "Account creation failed. Please try again.",
      );
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword((prev) => !prev);
  };

  return {
    form,
    onSubmit,
    showPassword,
    togglePasswordVisibility,
    showConfirmPassword,
    toggleConfirmPasswordVisibility,
    signupMutation,
    router,
  };
}
