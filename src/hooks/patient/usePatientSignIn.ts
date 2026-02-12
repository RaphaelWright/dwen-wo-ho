"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import useAuthQuery from "@/hooks/queries/useAuthQuery";
import { ROUTES } from "@/lib/constants/routes";

const LoginSchema = z.object({
  email: z
    .string()
    .email({ message: "Please enter a valid email" })
    .min(1, "Please enter your email address"),
  password: z.string().min(1, { message: "Please enter password" }),
});

export type PatientSignInFormData = z.infer<typeof LoginSchema>;

interface UsePatientSignInProps {
  email: string | null;
}

export function usePatientSignIn({ email }: UsePatientSignInProps) {
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
          setErrorMessage(error?.message || "Sign in failed");
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
