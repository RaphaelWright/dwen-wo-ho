"use client";

export const useStepper = <T extends string[]>(steps: T, step: string) => {
  const stepStatusIndex = steps.findIndex(
    (status) => status.toLowerCase() === step?.toLowerCase(),
  );

  const isStatusActive = (currentStatusIndex: number): boolean => {
    return currentStatusIndex === stepStatusIndex;
  };

  const isStatusCompleted = (currentStatusIndex: number): boolean => {
    return currentStatusIndex < stepStatusIndex;
  };

  return {
    isStatusActive,
    isStatusCompleted,
  };
};
