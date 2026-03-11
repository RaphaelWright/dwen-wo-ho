"use client";

import { useState, useEffect } from "react";
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

export function useProviderPassword() {
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [signupData, setSignupData] = useState<any>(null);
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

  useEffect(() => {
    const data = localStorage.getItem("signupData");
    if (data) {
      setSignupData(JSON.parse(data));
    }
  }, []);

  const onSubmit = async (values: ProviderPasswordFormData) => {
    if (!signupData) {
      setErrorMessage("Signup data not found. Please start over.");
      return;
    }

    setErrorMessage("");

    try {
      // Complete the account creation with password
      const response = await signupMutation.mutateAsync({
        email: signupData.email,
        password: values.password,
        fullName: signupData.fullName,
        professionalTitle: signupData.professionalTitle,
      });

      if (response.success) {
        localStorage.removeItem("signupData");

        // Store the token for future API calls
        if (response.data?.token) {
          localStorage.setItem("authToken", response.data.token);
        }

        router.push(`${ROUTES.provider.signUp}/${email}/profile` as Route);
      } else {
        setErrorMessage(response.message || "Account creation failed");
      }
    } catch (error: any) {
      const errorMsg =
        (error as any)?.response?.data?.message ||
        "Account creation failed. Please try again.";
      setErrorMessage(errorMsg);
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
    errorMessage,
    signupMutation,
    router,
  };
}
