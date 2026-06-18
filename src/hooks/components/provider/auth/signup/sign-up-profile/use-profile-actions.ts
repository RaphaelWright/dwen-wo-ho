"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Route } from "next";
import { toast } from "sonner";
import { useAuthQuery } from "@/hooks/queries/use-auth";
import { SIGN_UP_TEXTS } from "@/lib/constants/components/provider/auth/signup";
import { validateProviderProfileStep } from "@/lib/utils/provider/profile-validation";
import type { ProviderProfileBioStepData } from "@/lib/schemas/provider-auth-schema";
import {
  ProviderProfileData,
  ProviderProfileStep,
} from "@/lib/types/components/provider/auth";
import { getCleanErrorMessage } from "@/lib/utils/auth/error";
import { executeProviderFinishSignup } from "@/lib/utils/auth/provider-finish-signup";
import {
  submitProviderBioStep,
  submitProviderSpecialtyStep,
} from "@/lib/utils/provider/profile-step-submit";

export const useProfileActions = ({
  email,
  password,
  profileData,
  currentStep,
  setCurrentStep,
}: {
  email: string;
  password?: string;
  profileData: ProviderProfileData;
  currentStep: number;
  setCurrentStep: React.Dispatch<React.SetStateAction<number>>;
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const { addSpecialtyMutation, updateProfileMutation, loginMutation } =
    useAuthQuery();

  const finishSignup = () =>
    executeProviderFinishSignup({
      email,
      password,
      login: loginMutation.mutateAsync,
      navigate: (path) => router.push(path as Route),
      onAutoLoginFailed: () =>
        toast.error(SIGN_UP_TEXTS.errors.autoLoginFailed),
    });

  const handleBioStep = async (bioStepData: ProviderProfileBioStepData) => {
    setIsSubmitting(true);
    try {
      await submitProviderBioStep(
        (data) => updateProfileMutation.mutateAsync(data),
        bioStepData,
      );
      toast.success(SIGN_UP_TEXTS.errors.profileUpdated);
      setCurrentStep((prev) => prev + 1);
    } catch (error: unknown) {
      toast.error(
        getCleanErrorMessage(error) || SIGN_UP_TEXTS.errors.updateProfileFailed,
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSpecialtyStep = async () => {
    setIsSubmitting(true);
    try {
      await submitProviderSpecialtyStep(
        (data) => addSpecialtyMutation.mutateAsync(data),
        profileData.specialty,
      );
      toast.success(SIGN_UP_TEXTS.errors.specialtyAdded);
      await finishSignup();
    } catch (error: unknown) {
      toast.error(
        getCleanErrorMessage(error) || SIGN_UP_TEXTS.errors.addSpecialtyFailed,
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleNext = async () => {
    const stepValidation = validateProviderProfileStep(
      currentStep as ProviderProfileStep,
      profileData,
    );

    if (!stepValidation.isValid) {
      toast.error(stepValidation.error ?? SIGN_UP_TEXTS.errors.fillAllFields);
      return;
    }

    if (currentStep === 0) {
      setCurrentStep((prev) => prev + 1);
      return;
    }

    if (currentStep === 1) {
      await handleBioStep(stepValidation.data as ProviderProfileBioStepData);
      return;
    }

    if (currentStep === 2) {
      await handleSpecialtyStep();
      return;
    }

    setCurrentStep((prev) => prev + 1);
  };

  return {
    isSubmitting,
    handleNext,
  };
};
