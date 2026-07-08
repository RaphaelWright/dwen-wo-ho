"use client";

import { useCallback, useEffect } from "react";
import type { Route } from "next";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useHostToast } from "@/hooks/components/patient/onboarding/use-host-toast";
import { ONBOARDING_SCREENS } from "@/lib/constants/components/patient/onboarding";
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
import { usePolicySheets } from "@/hooks/components/patient/onboarding/contact/use-policy-sheets";

export function useOnboardingWizard() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const state = useOnboardingWizardState();
  const policySheets = usePolicySheets();
  const hostToast = useHostToast();
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
    otpReference,
    setOtpReference,
    passwordResetToken,
    setPasswordResetToken,
    patientUserId,
    setPatientUserId,
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
    setReferralHandle,
  } = state;

  const {
    programmeSearch,
    setProgrammeSearch,
    schoolPickerOpen,
    setSchoolPickerOpen,
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
    otp,
    otpReference,
    passwordResetToken,
    goToScreen,
    updateDraft,
    setAuthPath,
    setVerifyFlow,
    setPhase,
    setActiveContactKey,
    setOtpReference,
    setPasswordResetToken,
    setPatientUserId,
    setSignInPassword,
    setOtp,
    router,
    showHostToast: hostToast.showToast,
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
      actions.handleVerifyContinue();
    }, 150);

    return () => window.clearTimeout(timer);
  }, [actions, otp, screen]);

  const handleChoiceContinue = useCallback(() => {
    goToScreen(ONBOARDING_SCREENS.CONTACT);
  }, [goToScreen]);

  const handleReferralChange = useCallback(
    (handle: string | null) => {
      setReferralHandle(handle);
      const params = new URLSearchParams(searchParams.toString());
      if (handle) {
        params.set("ref", handle);
      } else {
        params.delete("ref");
      }
      const query = params.toString();
      router.replace((query ? `${pathname}?${query}` : pathname) as Route, {
        scroll: false,
      });
    },
    [pathname, router, searchParams, setReferralHandle],
  );

  return {
    screen,
    phase,
    authPath,
    verifyFlow,
    contactMode,
    otp,
    otpReference,
    passwordResetToken,
    patientUserId,
    signInPassword,
    draft,
    referralHandle,
    handleReferralChange,
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
    programmeSearch,
    setProgrammeSearch,
    schoolPickerOpen,
    setSchoolPickerOpen,
    selectedSchoolLogo: draft.schoolLogo,
    ...policySheets,
    handleChoiceContinue,
    hostToastMessage: hostToast.message,
    hostToastVisible: hostToast.visible,
    showHostToast: hostToast.showToast,
  };
}
