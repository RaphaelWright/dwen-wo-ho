"use client";

export const useStepper = <T extends string[]>(
  steps: T,
  step: string,
  completedSteps: string[] = [],
) => {
  const stepStatusIndex = steps.findIndex(
    (status) => status.toLowerCase() === step?.toLowerCase(),
  );

  const isStatusActive = (currentStatusIndex: number): boolean => {
    return currentStatusIndex === stepStatusIndex;
  };

  const isStatusCompleted = (currentStatusIndex: number): boolean => {
    const label = steps[currentStatusIndex];
    if (
      label &&
      completedSteps.some(
        (completed) => completed.toLowerCase() === label.toLowerCase(),
      )
    ) {
      return true;
    }
    return currentStatusIndex < stepStatusIndex;
  };

  return {
    isStatusActive,
    isStatusCompleted,
  };
};
