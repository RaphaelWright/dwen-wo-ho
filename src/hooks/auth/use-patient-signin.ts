"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuthQuery } from "@/hooks/queries/use-auth";
import { ROUTES } from "@/lib/constants/routes";
import { LoginSchema } from "@/lib/schemas/login-auth-schema";
import { z } from "zod/v4";
import { getCleanErrorMessage } from "@/lib/utils/auth-error";

export const usePatientSignIn = ({ email }: { email: string | null }) => {
  const router = useRouter();
  const { loginMutation } = useAuthQuery();
  const [errorMessage, setErrorMessage] = useState<string>("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<z.infer<typeof LoginSchema>>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: email || "",
      password: "",
    },
  });

  const onSubmit = (values: z.infer<typeof LoginSchema>) => {
    setErrorMessage("");
    loginMutation.mutate(values, {
      onSuccess: () => {
        router.push(ROUTES.patient.waitingRoom);
      },
      onError: (error: unknown) => {
        setErrorMessage(getCleanErrorMessage(error) || "Sign in failed");
      },
    });
  };

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
  };
};
