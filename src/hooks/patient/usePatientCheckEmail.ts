"use client";

import { useState, useCallback } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { ROUTES } from "@/lib/constants/routes";

export const FormSchema = z.object({
  email: z
    .email({ message: "Please enter a valid email" })
    .min(1, "Please enter your email address"),
});

export type PatientCheckEmailFormData = z.infer<typeof FormSchema>;

export function usePatientCheckEmail() {
  const router = useRouter();
  const [isValidEmail, setIsValidEmail] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<PatientCheckEmailFormData>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      email: "",
    },
  });

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const handleEmailChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setIsValidEmail(emailRegex.test(value));
    },
    [],
  );

  const onSubmit = useCallback(
    (values: PatientCheckEmailFormData) => {
      router.push(`${ROUTES.patient.singIn}?email=${values.email}`);
    },
    [router],
  );

  return {
    register,
    handleSubmit,
    errors,
    isValidEmail,
    handleEmailChange,
    onSubmit,
    router,
  };
}
