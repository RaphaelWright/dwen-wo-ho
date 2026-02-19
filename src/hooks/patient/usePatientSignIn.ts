"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import useAuthQuery from "@/hooks/queries/useAuthQuery";
import { ROUTES } from "@/lib/constants/routes";
import { LoginSchema } from "@/lib/schemas/patient.auth";

export type PatientSignInFormData = z.infer<typeof LoginSchema>;

export function usePatientSignIn({ email }: { email: string | null }) {
  const router = useRouter();
  const { loginMutation } = useAuthQuery();
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PatientSignInFormData>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: email || "",
      password: "",
    },
  });

  const onSubmit = useCallback(
    (values: PatientSignInFormData) => {
      setErrorMessage("");
      loginMutation.mutate(values, {
        onSuccess: () => {
          // Redirection should likely be to patient home or dashboard
          router.push(ROUTES.curator.schools); // This was previously "/signin", let's check ROUTES
        },
        onError: (error: any) => {
          let message = "Sign in failed";

          if (error?.response?.data?.message) {
            message = error.response.data.message;
          } else if (error?.message) {
            message = error.message;
          }

          if (typeof message === "string" && message.trim().startsWith("{")) {
            try {
              const parsed = JSON.parse(message);
              if (parsed.message) message = parsed.message;
            } catch {}
          }

          setErrorMessage(message);
        },
      });
    },
    [loginMutation, router],
  );

  const togglePasswordVisibility = useCallback(() => {
    setShowPassword((prev) => !prev);
  }, []);

  useEffect(() => {
    if (!email) {
      router.push(ROUTES.patient.checkEmail);
    }
  }, [email, router]);

  return {
    register,
    errors,
    onSubmit: handleSubmit(onSubmit),
    isLoading: loginMutation.isPending,
    errorMessage,
    showPassword,
    togglePasswordVisibility,
    router,
  };
}
