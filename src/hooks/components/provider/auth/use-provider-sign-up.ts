"use client";

import { useState, useEffect } from "react";
import { ProviderSignUpProps } from "@/lib/types/provider/auth";

type SignUpStep = "create" | "verify" | "profile";

export const useProviderSignUp = ({
  email: propEmail,
  fullName: propFullName,
  title: propTitle,
  onBack,
  profileStep,
}: ProviderSignUpProps) => {
  const [currentStep, setCurrentStep] = useState<SignUpStep>("create");
  const [agreedToTerms, setAgreedToTerms] = useState<boolean>(false);
  const [isFormValid, setIsFormValid] = useState<boolean>(false);
  const [signUpData, setSignUpData] = useState({
    email: propEmail || "",
    fullName: propFullName || "",
    title: propTitle || "",
    password: "",
  });

  useEffect(() => {
    if (profileStep == null) return;
    setCurrentStep("profile");
  }, [profileStep]);

  const handleCreateAccountNext = (data: {
    email: string;
    fullName: string;
    title: string;
    password?: string;
  }) => {
    setSignUpData((prev) => ({ ...prev, ...data }));
    setCurrentStep("verify");
  };

  const handleVerificationNext = () => {
    setCurrentStep("profile");
  };

  const handleBack = () => {
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
  };
};
