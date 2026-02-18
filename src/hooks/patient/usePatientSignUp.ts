"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import type { Route } from "next";
import { useForm } from "react-hook-form";
import * as z from "zod/v4";
import { zodResolver } from "@hookform/resolvers/zod";
import { ROUTES } from "@/lib/constants/routes";
import useGetSearchParams from "@/hooks/useGetSearchParams";
import { PatientSignUpSchema } from "@/lib/schemas/patient.auth";

export type SignUpFormData = z.infer<typeof PatientSignUpSchema>;

export function usePatientSignUp() {
  const [showPassword, setShowPassword] = useState<boolean>(false);
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
    resolver: zodResolver(PatientSignUpSchema),
    defaultValues: {
      email: email || "",
      fullName: "",
      phoneNumber: "",
      password: "",
    },
  });

  const onSubmit = useCallback(
    (values: SignUpFormData) => {
      router.push(`${ROUTES.patient.verifyEmail}/${values.email}` as Route);
    },
    [router],
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
    email,
  };
}
