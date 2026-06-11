"use client";

import { SignUpProfileProps, ProviderProfileStep } from "@/lib/types/provider/auth";
import { isProviderProfileStepValid } from "@/lib/utils/provider-profile-validation";
import { useProfileData } from "./use-profile-data";
import { useProfileSteps } from "./use-profile-steps";
import { useProfileActions } from "./use-profile-actions";

export const useSignUpProfile = ({
  email,
  onBack,
  startStep = 0,
  password,
  isResumeLocked,
}: SignUpProfileProps) => {
  const { currentStep, setCurrentStep, handleBack, hideBackAtRoot } =
    useProfileSteps(startStep, onBack, isResumeLocked);

  const { profileData, handleChange } = useProfileData();

  const { isSubmitting, handleNext } = useProfileActions({
    email,
    password,
    profileData,
    currentStep,
    setCurrentStep,
  });

  const isCurrentStepValid = isProviderProfileStepValid(
    currentStep as ProviderProfileStep,
    profileData,
  );

  return {
    currentStep,
    isSubmitting,
    profileData,
    handleChange,
    handleBack,
    handleNext,
    isCurrentStepValid,
    hideBackAtRoot,
  };
};
