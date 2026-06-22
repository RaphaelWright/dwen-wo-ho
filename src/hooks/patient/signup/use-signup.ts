"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import type { Route } from "next";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ROUTES } from "@/lib/constants/infra/routes";
import useGetSearchParams from "@/hooks/shared/use-get-search-params";
import { PatientSignUpSchema } from "@/lib/schemas/patient-auth-schema";
import { SignUpFormData } from "@/lib/types/components/patient/signup";

export function usePatientSignUp() {
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const email = useGetSearchParams("email");
  const router = useRouter();

  // Client-side guard kept intentionally: the redirect depends on a value that
  // only exists in the browser (URL search param / localStorage auth tokens),
  // so it cannot be relocated to middleware or a server redirect.
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
