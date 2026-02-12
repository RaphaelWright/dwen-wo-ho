"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { ROUTES } from "@/lib/constants/routes";
import useGetSearchParams from "@/hooks/useGetSearchParams";
import useAuthQuery from "@/hooks/queries/useAuthQuery";

export const SignUpSchema = z.object({
  email: z
    .email({ message: "Please enter a valid email" })
    .min(1, "Please enter your email address"),
  fullName: z.string().min(1, { message: "Please enter full name" }),
  phoneNumber: z
    .string()
    .min(1, { message: "Please enter your phone number" })
    .max(10, { message: "Phone number too long" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters" }),
});

export type SignUpFormData = z.infer<typeof SignUpSchema>;

export function usePatientSignUp() {
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
      email: email || "",
      fullName: "",
      phoneNumber: "",
      password: "",
    },
  });

  const onSubmit = useCallback(
    (values: SignUpFormData) => {
      // Note: The original code had a mutation call and an immediate redirect.
      // loginMutation.mutate(values, {
      //   onSuccess: () => {
      //     router.push("/signin");
      //   },
      // });
      // router.push(`${ROUTES.patient.verifyEmail}/${email}`)

      // I will preserve the original (slightly confusing) logic for now, but redirecting to verify is likely the goal.
      router.push(`${ROUTES.patient.verifyEmail}/${values.email}`);
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
