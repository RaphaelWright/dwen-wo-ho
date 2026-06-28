"use client";

import { useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  ONBOARDING_DEMO_OTP,
  ONBOARDING_SCREENS,
} from "@/lib/constants/components/patient/onboarding";
import type {
  FieldValidationKey,
  OnboardingDraft,
  OnboardingScreen,
} from "@/lib/types/components/patient/onboarding";
import {
  getOnboardingPhaseForScreen,
  syncDraftDerivedFields,
} from "@/lib/utils/patient/onboarding-validation";
import { getPreviousScreen } from "@/lib/utils/patient/onboarding-navigation";
import { isOnboardingScreenValid } from "@/lib/utils/patient/onboarding-screen-validation";
import { resolveFieldBlurState } from "@/lib/utils/patient/onboarding-field-blur";
import { advanceOnboardingScreen } from "@/lib/utils/patient/onboarding-wizard-navigation";
import { useOnboardingWizardActions } from "@/hooks/components/patient/onboarding/wizard/use-onboarding-wizard-actions";
import { useOnboardingWizardState } from "@/hooks/components/patient/onboarding/wizard/use-onboarding-wizard-state";

export function useOnboardingWizard() {
  const router = useRouter();
  const state = useOnboardingWizardState();
  const {
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
    referralHandle,
  } = state;

  const updateDraft = useCallback(
    (patch: Partial<OnboardingDraft>) => {
      setDraft((current) => syncDraftDerivedFields({ ...current, ...patch }));
    },
    [setDraft],
  );

  const goToScreen = useCallback(
    (nextScreen: OnboardingScreen) => {
      setScreen(nextScreen);
      setPhase(getOnboardingPhaseForScreen(nextScreen));
    },
    [setPhase, setScreen],
  );

  const actions = useOnboardingWizardActions({
    contactMode,
    contactValue,
    draft,
    signInPassword,
    verifyFlow,
    activeContactKey,
    goToScreen,
    updateDraft,
    setAuthPath,
    setVerifyFlow,
    setPhase,
    setActiveContactKey,
    setSignInPassword,
    setOtp,
    router,
  });

  const goBack = useCallback(() => {
    const previous = getPreviousScreen({ screen, authPath });
    if (!previous) {
      return;
    }
    goToScreen(previous);
  }, [authPath, goToScreen, screen]);

  const handleFieldBlur = useCallback(
    (field: FieldValidationKey) => {
      setFieldValidation((current) => ({
        ...current,
        [field]: resolveFieldBlurState(field, draft),
      }));
    },
    [draft, setFieldValidation],
  );

  const handleContactSubmit = useCallback(() => {
    if (
      !isOnboardingScreenValid(screen, draft, otp, signInPassword, contactMode)
    ) {
      return;
    }
    actions.routeAfterContactSubmit();
  }, [actions, contactMode, draft, otp, screen, signInPassword]);

  const goNext = useCallback(() => {
    advanceOnboardingScreen(screen, goToScreen, actions);
  }, [actions, goToScreen, screen]);

  useEffect(() => {
    if (screen !== ONBOARDING_SCREENS.VERIFY || otp.length !== 6) {
      return;
    }

    const timer = window.setTimeout(() => {
      if (otp === ONBOARDING_DEMO_OTP || otp.length === 6) {
        actions.handleVerifyContinue();
      }
    }, 150);

    return () => window.clearTimeout(timer);
  }, [actions, otp, screen]);

  return {
    screen,
    phase,
    authPath,
    verifyFlow,
    contactMode,
    otp,
    signInPassword,
    draft,
    referralHandle,
    fieldValidation,
    contactValue,
    activeContactKey,
    setContactMode,
    setOtp,
    setSignInPassword,
    updateDraft,
    goToScreen,
    goBack,
    goNext,
    handleContactSubmit,
    handleForgotPassword: actions.handleForgotPassword,
    handleFieldBlur,
    handleSchoolSelect: actions.handleSchoolSelect,
    handleSubmit: actions.handleSubmit,
  };
}
