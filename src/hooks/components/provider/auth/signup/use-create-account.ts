"use client";

import { useState, useEffect } from "react";
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

export const useCreateAccount = ({
  email: propEmail,
  fullName: propFullName,
  title: propTitle,
  agreedToTerms,
  onNext,
  onValidityChange,
}: CreateAccountProps) => {
  const [errorMessage, setErrorMessage] = useState<string>("");
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
      fullName: propFullName || "",
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
      setErrorMessage(SIGN_UP_TEXTS.errors.termsRequired);
      return;
    }

    setErrorMessage("");

    try {
      await signupMutation.mutateAsync({
        email: values.email,
        password: values.password,
        fullName: values.fullName,
        professionalTitle: values.title,
      });

      onNext({
        email: values.email,
        fullName: values.fullName,
        title: values.title,
        password: values.password,
      });
    } catch (error: unknown) {
      let errorMsg = SIGN_UP_TEXTS.errors.general;

      if (
        error &&
        typeof error === "object" &&
        "response" in error &&
        error.response &&
        typeof error.response === "object" &&
        "data" in error.response &&
        error.response.data &&
        typeof error.response.data === "object" &&
        "message" in error.response.data &&
        typeof error.response.data.message === "string"
      ) {
        errorMsg = error.response.data.message;
      } else if (error instanceof Error) {
        try {
          if (error.message.trim().startsWith("{")) {
            const parsed = JSON.parse(error.message) as { message?: string };
            errorMsg = parsed.message || error.message;
          } else {
            errorMsg = error.message;
          }
        } catch {
          errorMsg = error.message;
        }
      }
      setErrorMessage(errorMsg);
    }
  };

  const handleTitleChange = (value: string) => {
    setValue("title", value, { shouldValidate: true });
  };

  const email = watch("email");
  const title = watch("title");
  const fullName = watch("fullName");
  const password = watch("password");

  return {
    errorMessage,
    showPassword,
    setShowPassword,
    signupMutation,
    register,
    handleSubmit,
    errors,
    onSubmit,
    handleTitleChange,
    isTitleSelectOpen,
    setIsTitleSelectOpen,
    email,
    title,
    fullName,
    password,
  };
};
