"use client";

import { SignUpProfileProps } from "@/lib/types/provider/auth";
import { useProfileData } from "./use-profile-data";
import { useProfileSteps } from "./use-profile-steps";
import { useProfileStatus } from "./use-profile-status";
import { useProfileActions } from "./use-profile-actions";

export const useSignUpProfile = ({
  email,
  fullName,
  title,
  specialty,
  profileImage,
  isPending,
  onBack,
  startStep = 0,
  password,
}: SignUpProfileProps) => {
  const { currentStep, setCurrentStep, handleBack } = useProfileSteps(startStep, onBack);
  
  const { profileData, userInfo, setUserInfo, handleChange } = useProfileData({
    initialFullName: fullName || "",
    initialTitle: title || "",
    initialSpecialty: specialty,
    initialProfileImage: profileImage,
  });

  const { showPendingModal, setShowPendingModal, getProfileQuery } = useProfileStatus({
    isInitialPending: isPending,
    setUserInfo,
  });

  const { isSubmitting, handleNext } = useProfileActions({
    email,
    password,
    profileData,
    currentStep,
    setCurrentStep,
    setUserInfo,
  });

  return {
    currentStep,
    setCurrentStep,
    showPendingModal,
    setShowPendingModal,
    isSubmitting,
    profileData,
    userInfo,
    getProfileQuery,
    handleChange,
    handleBack,
    handleNext,
  };
};
