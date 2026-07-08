"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { ROUTES } from "@/lib/constants/infra/routes";
import useGetSearchParams from "@/hooks/shared/use-get-search-params";
import { SignUpSchema } from "@/lib/schemas/patient-auth-schema";
import { SignUpFormData } from "@/lib/types/components/patient/new-password";
import { patientAuthService } from "@/services/patient/auth";

export function usePatientNewPassword() {
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const email = useGetSearchParams("email");
  const router = useRouter();

  // Client-side guard kept intentionally: the redirect depends on a value that
  // only exists in the browser (URL search param / localStorage auth tokens),
  // so it cannot be relocated to middleware or a server redirect.
  useEffect(() => {
    const recoveryToken =
      typeof window !== "undefined"
        ? localStorage.getItem("patientRecoveryToken")
        : null;

    if (!email || !recoveryToken) {
      router.push(ROUTES.patient.join);
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
    async (values: SignUpFormData) => {
      const recoveryToken = localStorage.getItem("patientRecoveryToken");
      if (!recoveryToken) {
        router.push(ROUTES.patient.join);
        return;
      }

      setIsSubmitting(true);
      try {
        await patientAuthService.setPassword({
          passwordResetToken: recoveryToken,
          password: values.password,
          confirmPassword: values.repeatPassword,
        });
        localStorage.removeItem("patientRecoveryToken");
        toast.success("Password updated. Sign in with your new password.");
        router.push(ROUTES.patient.join);
      } catch {
        toast.error("We could not update your password. Try again.");
      } finally {
        setIsSubmitting(false);
      }
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
    isSubmitting,
  };
}
