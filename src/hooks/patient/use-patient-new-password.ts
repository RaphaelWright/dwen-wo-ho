"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ROUTES } from "@/lib/constants/routes";
import useGetSearchParams from "@/hooks/use-get-search-params";
import { useAuthQuery } from "@/hooks/queries/use-auth";
import { SignUpSchema } from "@/lib/schemas/patient-auth-schema";
import { SignUpFormData } from "@/lib/types/components/patient/new-password";

export function usePatientNewPassword() {
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const { loginMutation } = useAuthQuery();
  const email = useGetSearchParams("email");
  const router = useRouter();

  useEffect(() => {
    if (!email) {
      router.push(ROUTES.patient.checkEmail);
    }
  }, [email, router]);

  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpFormData>({
    resolver: zodResolver(SignUpSchema),
    defaultValues: {
      email,
      repeatPassword: "",
      password: "",
    },
  });

  const onSubmit = useCallback(
    (values: SignUpFormData) => {
      loginMutation.mutate(values, {
        onSuccess: () => {
          router.push(ROUTES.patient.singIn);
        },
      });
    },
    [loginMutation, router],
  );

  const togglePasswordVisibility = useCallback(() => {
    setShowPassword((prev) => !prev);
  }, []);

  return {
    control,
    register,
    handleSubmit,
    errors,
    showPassword,
    togglePasswordVisibility,
    onSubmit,
    router,
    isSubmitting: loginMutation.isPending,
  };
}
