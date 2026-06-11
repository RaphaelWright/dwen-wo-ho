"use client";

import { useState } from "react";

export const useProfileSteps = (
  startStep: number,
  onBack?: () => void,
  isResumeLocked?: boolean,
) => {
  const [currentStep, setCurrentStep] = useState(startStep);

  const handleBack = () => {
    if (currentStep === 0) {
      if (isResumeLocked) {
        return;
      }

      onBack?.();
      return;
    }

    setCurrentStep(currentStep - 1);
  };

  return {
    currentStep,
    setCurrentStep,
    handleBack,
    hideBackAtRoot: isResumeLocked && currentStep === 0,
  };
};
