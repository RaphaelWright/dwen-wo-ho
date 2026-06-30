"use client";

import { useState } from "react";
import useGetSearchParams from "@/hooks/shared/use-get-search-params";
import { ONBOARDING_INITIAL_SCREEN } from "@/lib/constants/components/patient/onboarding";
import type {
  AuthPath,
  ContactMode,
  OnboardingDraft,
  OnboardingPhase,
  OnboardingScreen,
  VerifyFlow,
} from "@/lib/types/components/patient/onboarding";
import { INITIAL_FIELD_VALIDATION } from "@/lib/utils/patient/onboarding-field-blur";
import { getInitialOnboardingDraft } from "@/lib/utils/patient/onboarding-session";

export function useOnboardingWizardState() {
  const refParam = useGetSearchParams("ref");
  const [referralHandle, setReferralHandle] = useState<string | null>(() => {
    const trimmed = refParam?.trim();
    return trimmed ? trimmed : null;
  });

  const [screen, setScreen] = useState<OnboardingScreen>(
    ONBOARDING_INITIAL_SCREEN,
  );
  const [phase, setPhase] = useState<OnboardingPhase>("auth");
  const [authPath, setAuthPath] = useState<AuthPath>("signup");
  const [verifyFlow, setVerifyFlow] = useState<VerifyFlow>("signup");
  const [contactMode, setContactMode] = useState<ContactMode>("phone");
  const [otp, setOtp] = useState("");
  const [signInPassword, setSignInPassword] = useState("");
  const [activeContactKey, setActiveContactKey] = useState<string | null>(null);
  const [fieldValidation, setFieldValidation] = useState(
    INITIAL_FIELD_VALIDATION,
  );
  const [draft, setDraft] = useState<OnboardingDraft>(
    getInitialOnboardingDraft,
  );
  const [programmeSearch, setProgrammeSearch] = useState("");
  const [schoolPickerOpen, setSchoolPickerOpen] = useState(false);

  const contactValue = contactMode === "phone" ? draft.phone : draft.email;

  return {
    referralHandle,
    setReferralHandle,
    screen,
    setScreen,
    phase,
    setPhase,
    authPath,
    setAuthPath,
    verifyFlow,
    setVerifyFlow,
    contactMode,
    setContactMode,
    otp,
    setOtp,
    signInPassword,
    setSignInPassword,
    activeContactKey,
    setActiveContactKey,
    fieldValidation,
    setFieldValidation,
    draft,
    setDraft,
    contactValue,
    programmeSearch,
    setProgrammeSearch,
    schoolPickerOpen,
    setSchoolPickerOpen,
  };
}
