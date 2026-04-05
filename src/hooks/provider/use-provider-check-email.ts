"use client";

import { useState } from "react";
import { useAuthQuery } from "@/hooks/queries/use-auth";
import { useSelectedValuesFromReactHookForm } from "@/hooks/forms/use-selected-values";
import { ProviderEmailSchema } from "@/lib/schemas/provider-auth-schema";

export function useProviderCheckEmail({
  onEmailSubmit,
}: {
  onEmailSubmit: (email: string, emailExists: boolean) => void;
}) {
  const [errorMessage, setErrorMessage] = useState("");
  const { checkEmailMutation } = useAuthQuery();

  const { register, handleSubmit, errors } = useSelectedValuesFromReactHookForm(
    ProviderEmailSchema,
    {
      mode: "onChange",
    },
  );

  const checkEmailExists = async (email: string) => {
    try {
      setErrorMessage("");
      const response = await checkEmailMutation.mutateAsync({ email });

      if (response) {
        onEmailSubmit(email, response.emailExists || false);
      }
    } catch (error) {
      // Parse error message - it might be stringified JSON
      let errorMessage = "Failed to verify email. Please try again.";
      const rawError = (error as any)?.message || "";

      // Try to parse if it's JSON
      try {
        if (rawError.startsWith("{")) {
          const parsed = JSON.parse(rawError);
          errorMessage = parsed.message || rawError;
        } else {
          errorMessage = rawError;
        }
      } catch {
        errorMessage = rawError || "Failed to verify email";
      }

      // Check if user not found - redirect to signup (expected flow, don't log)
      if (errorMessage.includes("User not found")) {
        onEmailSubmit(email, false);
        return;
      }

      // Map technical errors to user-friendly messages
      let userFriendlyMessage =
        "We couldn't verify your email. Please try again.";

      if (
        errorMessage.toLowerCase().includes("network") ||
        errorMessage.toLowerCase().includes("failed to fetch")
      ) {
        userFriendlyMessage =
          "Network error. Please check your internet connection and try again.";
      } else if (errorMessage.toLowerCase().includes("timeout")) {
        userFriendlyMessage = "Request timed out. Please try again.";
      } else if (errorMessage.toLowerCase().includes("invalid")) {
        userFriendlyMessage = "Please enter a valid email address.";
      } else if (
        errorMessage &&
        errorMessage.length < 100 &&
        !errorMessage.startsWith("{")
      ) {
        // If the error message is short, meaningful, and not JSON, show it
        userFriendlyMessage = errorMessage;
      }

      setErrorMessage(userFriendlyMessage);
    }
  };

  return {
    checkEmailExists,
    isLoading: checkEmailMutation.isPending,
    errorMessage,
    form: { register, handleSubmit, errors },
  };
}
