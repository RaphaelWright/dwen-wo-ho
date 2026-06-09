"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuthQuery } from "@/hooks/queries/use-auth";
import { ROUTES } from "@/lib/constants/routes";
import { LoginSchema } from "@/lib/schemas/patient-auth-schema";
import { PatientSignInFormData } from "@/lib/types/components/patient/signin";
import { getCleanErrorMessage } from "@/lib/utils/auth-error";
import { toast } from "@/components/ui/sonner";

export function usePatientSignIn({ email }: { email: string | null }) {
  const router = useRouter();
  const { loginMutation } = useAuthQuery();
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
      loginMutation.mutate(values, {
        onSuccess: () => {
          // Redirection should likely be to patient home or dashboard
          router.push(ROUTES.patient.lockIn);
        },
        onError: (error: unknown) => {
          toast.error(getCleanErrorMessage(error) || "Sign in failed");
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
    showPassword,
    togglePasswordVisibility,
    router,
  };
}
