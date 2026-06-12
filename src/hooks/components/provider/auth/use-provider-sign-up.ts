"use client";

import { useState, useEffect } from "react";
import { ProviderSignUpProps } from "@/lib/types/provider/auth";
import { useProviderSignupGuard } from "@/hooks/provider/use-provider-signup-guard";
import { hasProviderAuthToken } from "@/lib/utils/provider-signup-resume";
import {
  getProviderSignupPassword,
  saveProviderSignupPassword,
} from "@/lib/utils/provider-signup-password";

type SignUpStep = "create" | "verify" | "profile";

export const useProviderSignUp = ({
  email: propEmail,
  fullName: propFullName,
  title: propTitle,
  onBack,
  profileStep: profileStepProp,
  isResumeLocked: isResumeLockedProp,
  isCheckingGuard: isCheckingGuardProp,
}: ProviderSignUpProps) => {
  const runInternalGuard = isCheckingGuardProp === undefined;
  const internalGuard = useProviderSignupGuard(propEmail, runInternalGuard);

  const isCheckingGuard = isCheckingGuardProp ?? internalGuard.isChecking;
  const guardResumeLocked = isResumeLockedProp ?? internalGuard.isResumeLocked;
  const profileStepFromGuard = profileStepProp ?? internalGuard.profileStep;

  const isResumeLocked =
    guardResumeLocked ||
    (profileStepFromGuard !== null && hasProviderAuthToken());

  const profileStep = isResumeLocked
    ? (profileStepFromGuard ?? profileStepProp ?? null)
    : (profileStepProp ?? null);

  const [currentStep, setCurrentStep] = useState<SignUpStep>(
    profileStep != null || isResumeLocked ? "profile" : "create",
  );
  const [agreedToTerms, setAgreedToTerms] = useState<boolean>(false);
  const [isFormValid, setIsFormValid] = useState<boolean>(false);
  const [signUpData, setSignUpData] = useState({
    email: propEmail || "",
    fullName: propFullName || "",
    title: propTitle || "",
    password: "",
  });

  useEffect(() => {
    if (!propEmail) {
      return;
    }

    const storedPassword = getProviderSignupPassword(propEmail);

    setSignUpData((prev) => ({
      ...prev,
      email: propEmail,
      password: storedPassword ?? prev.password,
    }));
  }, [propEmail]);

  // Advance to the profile step while rendering when resume/guard props flip,
  // instead of mirroring those props into state via effects.
  const [prevProfileStep, setPrevProfileStep] = useState(profileStep);
  const [prevIsResumeLocked, setPrevIsResumeLocked] = useState(isResumeLocked);
  if (
    profileStep !== prevProfileStep ||
    isResumeLocked !== prevIsResumeLocked
  ) {
    setPrevProfileStep(profileStep);
    setPrevIsResumeLocked(isResumeLocked);
    if (profileStep != null || isResumeLocked) {
      setCurrentStep("profile");
    }
  }

  const handleCreateAccountNext = (data: {
    email: string;
    fullName: string;
    title: string;
    password?: string;
  }) => {
    if (data.password) {
      saveProviderSignupPassword(data.email, data.password);
    }

    setSignUpData((prev) => ({ ...prev, ...data }));
    setCurrentStep("verify");
  };

  const handleVerificationNext = () => {
    setCurrentStep("profile");
  };

  const handleBack = () => {
    if (isResumeLocked && currentStep !== "create") {
      return;
    }

    if (currentStep === "create") {
      onBack?.();
    } else if (currentStep === "verify") {
      setCurrentStep("create");
    } else if (currentStep === "profile") {
      setCurrentStep("verify");
    }
  };

  const getCurrentStepLabel = (): "Create" | "Verify" | "Profile" => {
    switch (currentStep) {
      case "create":
        return "Create";
      case "verify":
        return "Verify";
      case "profile":
        return "Profile";
      default:
        return "Create";
    }
  };

  return {
    currentStep,
    setCurrentStep,
    agreedToTerms,
    setAgreedToTerms,
    isFormValid,
    setIsFormValid,
    signUpData,
    handleCreateAccountNext,
    handleVerificationNext,
    handleBack,
    getCurrentStepLabel,
    isResumeLocked,
    isCheckingGuard,
    profileStep,
  };
};
