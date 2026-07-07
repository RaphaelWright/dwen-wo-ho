"use client";

import { IoArrowForwardOutline } from "react-icons/io5";
import type { OnboardingFieldSubmitButtonProps } from "@/lib/types/components/patient/onboarding";

export function OnboardingFieldSubmitButton({
  disabled,
}: OnboardingFieldSubmitButtonProps) {
  return (
    <button
      type="submit"
      disabled={disabled}
      aria-label="Continue"
      className="bg-primary text-primary-foreground hover:bg-primary/90 disabled:bg-muted disabled:text-muted-foreground absolute right-3 bottom-3 flex size-10 items-center justify-center rounded-full transition-colors disabled:cursor-not-allowed sm:right-4 sm:bottom-4 sm:size-11"
    >
      <IoArrowForwardOutline className="size-5" aria-hidden="true" />
    </button>
  );
}
