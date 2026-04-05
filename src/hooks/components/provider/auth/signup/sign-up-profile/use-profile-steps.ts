"use client";

import { useState } from "react";

export const useProfileSteps = (startStep: number, onBack?: () => void) => {
  const [currentStep, setCurrentStep] = useState(startStep);

  const handleBack = () => {
    if (currentStep === 0) {
      onBack?.();
    } else {
      setCurrentStep(currentStep - 1);
    }
  };

  return {
    currentStep,
    setCurrentStep,
    handleBack,
  };
};
