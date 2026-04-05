"use client";

import { useState, useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { ROUTES } from "@/lib/constants/routes";
import { PatientCheckEmailFormSchema } from "@/lib/schemas/patient-auth-schema";
import { PatientCheckEmailFormData } from "@/lib/types/components/patient/check-email";

export function usePatientCheckEmail() {
  const router = useRouter();
  const [isValidEmail, setIsValidEmail] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PatientCheckEmailFormData>({
    resolver: zodResolver(PatientCheckEmailFormSchema),
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
