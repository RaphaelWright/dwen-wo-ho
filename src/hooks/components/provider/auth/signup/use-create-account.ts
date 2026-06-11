"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import type { Route } from "next";
import { useSelectedValuesFromReactHookForm } from "@/hooks/forms/use-selected-values";
import { useAuthQuery } from "@/hooks/queries/use-auth";
import {
  ProviderSignUpSchema,
  ProviderSignUpFormData,
} from "@/lib/schemas/provider-auth-schema";
import { CreateAccountProps } from "@/lib/types/provider/auth";
import {
  SIGN_UP_TEXTS,
  TITLE_SELECT_OPEN_DELAY_MS,
} from "@/lib/constants/components/provider/auth/signup";
import { ROUTES } from "@/lib/constants/routes";
import { toTitleCase } from "@/lib/utils/smart-typing";
import { getCleanErrorMessage } from "@/lib/utils/auth-error";
import { toast } from "@/components/ui/sonner";

function isExistingAccountError(message: string): boolean {
  const normalized = message.toLowerCase();
  return (
    normalized.includes("already exists") ||
    normalized.includes("already registered") ||
    normalized.includes("already verified") ||
    normalized.includes("user exists")
  );
}

export const useCreateAccount = ({
  email: propEmail,
  fullName: propFullName,
  title: propTitle,
  agreedToTerms,
  onNext,
  onValidityChange,
}: CreateAccountProps) => {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [isTitleSelectOpen, setIsTitleSelectOpen] = useState<boolean>(false);

  const { signupMutation } = useAuthQuery();

  const {
    register,
    handleSubmit,
    errors,
    watch,
    setValue,
    formState: { isValid },
  } = useSelectedValuesFromReactHookForm<ProviderSignUpFormData>(
    ProviderSignUpSchema,
    {
    mode: "onChange",
    defaultValues: {
      email: propEmail || "",
      title: propTitle || "",
      fullName: propFullName ? toTitleCase(propFullName) : "",
      password: "",
    },
  });

  useEffect(() => {
    onValidityChange?.(isValid);
  }, [isValid, onValidityChange]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsTitleSelectOpen(true);
    }, TITLE_SELECT_OPEN_DELAY_MS);

    return () => clearTimeout(timer);
  }, []);

  const onSubmit = async (values: ProviderSignUpFormData) => {
    if (!agreedToTerms) {
      toast.error(SIGN_UP_TEXTS.errors.termsRequired);
      return;
    }

    try {
      const formattedFullName = toTitleCase(values.fullName);

      await signupMutation.mutateAsync({
        email: values.email,
        password: values.password,
        fullName: formattedFullName,
        professionalTitle: values.title,
      });

      onNext({
        email: values.email,
        fullName: formattedFullName,
        title: values.title,
        password: values.password,
      });
    } catch (error: unknown) {
      const errorMsg = getCleanErrorMessage(error) || SIGN_UP_TEXTS.errors.general;

      if (isExistingAccountError(errorMsg)) {
        toast.error(SIGN_UP_TEXTS.errors.accountExists);
        router.push(
          `${ROUTES.provider.singIn}&email=${encodeURIComponent(values.email)}` as Route,
        );
        return;
      }

      toast.error(errorMsg);
    }
  };

  const handleTitleChange = (value: string) => {
    setValue("title", value, { shouldValidate: true });
  };

  const fullNameRegister = register("fullName");

  const handleFullNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = toTitleCase(e.target.value);
    e.target.value = formatted;
    fullNameRegister.onChange(e);
  };

  const handleFullNameBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const formatted = toTitleCase(e.target.value);
    e.target.value = formatted;
    setValue("fullName", formatted, { shouldValidate: true });
    fullNameRegister.onBlur(e);
  };

  const email = watch("email");
  const title = watch("title");
  const fullName = watch("fullName");
  const password = watch("password");

  return {
    showPassword,
    setShowPassword,
    signupMutation,
    register,
    handleSubmit,
    errors,
    onSubmit,
    handleTitleChange,
    fullNameRegister,
    handleFullNameChange,
    handleFullNameBlur,
    isTitleSelectOpen,
    setIsTitleSelectOpen,
    email,
    title,
    fullName,
    password,
  };
};
