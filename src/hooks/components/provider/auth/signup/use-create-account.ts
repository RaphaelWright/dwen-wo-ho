"use client";

import { useState, useEffect } from "react";
import { useSelectedValuesFromReactHookForm } from "@/hooks/forms/useSelectedValuesFromReactHookForm";
import useAuthQuery from "@/hooks/queries/useAuth";
import {
  ProviderSignUpSchema,
  ProviderSignUpFormData,
} from "@/lib/schemas/provider.auth.schema";
import { toast } from "@/components/ui/sonner";
import { CreateAccountProps } from "@/lib/types/provider/auth";
import { SIGN_UP_TEXTS } from "@/lib/constants/components/provider/auth/signup";

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

  const { signupMutation } = useAuthQuery();

  const {
    register,
    handleSubmit,
    errors,
    watch,
    setValue,
    formState: { isValid },
  } = useSelectedValuesFromReactHookForm(ProviderSignUpSchema, {
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

  const onSubmit = async (values: ProviderSignUpFormData) => {
    if (!agreedToTerms) {
      setErrorMessage(SIGN_UP_TEXTS.errors.termsRequired);
      return;
    }

    setErrorMessage("");

    try {
      const response = await signupMutation.mutateAsync({
        email: values.email,
        password: values.password,
        fullName: values.fullName,
        professionalTitle: values.title,
      });

      if (response?.success || response) {
        onNext({
          email: values.email,
          fullName: values.fullName,
          title: values.title,
          password: values.password,
        });
      } else {
        const errorResponse = response as
          | { message?: string }
          | null
          | undefined;
        const errorMsg =
          errorResponse?.message || SIGN_UP_TEXTS.errors.createFailed;
        setErrorMessage(errorMsg);
        toast.error(errorMsg);
      }
    } catch (error: any) {
      let errorMsg = SIGN_UP_TEXTS.errors.general;

      if (error.response?.data?.message) {
        errorMsg = error.response.data.message;
      } else if (error.message) {
        try {
          if (error.message.trim().startsWith("{")) {
            const parsed = JSON.parse(error.message);
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
    setValue("title", value);
  };

  const email = watch("email");
  const title = watch("title");
  const fullName = watch("fullName");

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
    email,
    title,
    fullName,
  };
};
