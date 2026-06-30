"use client";

import { useCallback } from "react";
import type { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { toast } from "sonner";
import { ROUTES } from "@/lib/constants/infra/routes";
import {
  ONBOARDING_COPY,
  ONBOARDING_SCREENS,
} from "@/lib/constants/components/patient/onboarding";
import type {
  AuthPath,
  ContactMode,
  OnboardingDraft,
  OnboardingScreen,
  VerifyFlow,
} from "@/lib/types/components/patient/onboarding";
import { patientOnboardingService } from "@/services/patient/onboarding/account-registry";
import { syncDraftDerivedFields } from "@/lib/utils/patient/onboarding-validation";
import { setShowHomeProfileModalFlag } from "@/lib/utils/patient/onboarding-session";
import { normalizeContactKey } from "@/lib/utils/patient/onboarding-format";
import { computeGraduationYear } from "@/lib/utils/patient/onboarding-class";

interface WizardActionDeps {
  contactMode: ContactMode;
  contactValue: string;
  draft: OnboardingDraft;
  signInPassword: string;
  verifyFlow: VerifyFlow;
  activeContactKey: string | null;
  goToScreen: (screen: OnboardingScreen) => void;
  updateDraft: (patch: Partial<OnboardingDraft>) => void;
  setAuthPath: (path: AuthPath) => void;
  setVerifyFlow: (flow: VerifyFlow) => void;
  setPhase: (phase: "auth" | "onboarding") => void;
  setActiveContactKey: (key: string | null) => void;
  setSignInPassword: (value: string) => void;
  setOtp: (value: string) => void;
  router: AppRouterInstance;
}

export function useOnboardingWizardActions(deps: WizardActionDeps) {
  const {
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
  } = deps;

  const routeAfterContactSubmit = useCallback(() => {
    const account = patientOnboardingService.lookupContact(
      contactMode,
      contactValue,
    );

    if (account) {
      setActiveContactKey(account.contactKey);
      updateDraft({ nickname: account.nickname });
      setAuthPath("signin");
      goToScreen(ONBOARDING_SCREENS.SIGN_IN);
      return;
    }

    setAuthPath("signup");
    setVerifyFlow("signup");
    goToScreen(ONBOARDING_SCREENS.CREATE_ACCOUNT);
  }, [
    contactMode,
    contactValue,
    goToScreen,
    setActiveContactKey,
    setAuthPath,
    setVerifyFlow,
    updateDraft,
  ]);

  const handleSignIn = useCallback(() => {
    const account = patientOnboardingService.verifyPassword(
      contactMode,
      contactValue,
      signInPassword,
    );

    if (!account) {
      toast.error("Incorrect password. Try again.");
      return;
    }

    setActiveContactKey(account.contactKey);

    if (account.onboardingComplete) {
      router.push(ROUTES.patient.lockIn);
      return;
    }

    setPhase("onboarding");
    goToScreen(ONBOARDING_SCREENS.SCHOOL_TYPE);
  }, [
    contactMode,
    contactValue,
    goToScreen,
    router,
    setActiveContactKey,
    setPhase,
    signInPassword,
  ]);

  const handleForgotPassword = useCallback(() => {
    setAuthPath("recovery");
    setVerifyFlow("recovery");
    goToScreen(ONBOARDING_SCREENS.FORGOT_PASSWORD);
  }, [goToScreen, setAuthPath, setVerifyFlow]);

  const handleStartRecovery = useCallback(() => {
    setOtp("");
    goToScreen(ONBOARDING_SCREENS.VERIFY);
  }, [goToScreen, setOtp]);

  const handleNewPasswordContinue = useCallback(() => {
    if (!activeContactKey) {
      return;
    }

    patientOnboardingService.updatePassword(activeContactKey, draft.password);
    setSignInPassword("");
    setAuthPath("signin");
    goToScreen(ONBOARDING_SCREENS.SIGN_IN);
    toast.success("Password updated. Sign in with your new password.");
  }, [
    activeContactKey,
    draft.password,
    goToScreen,
    setAuthPath,
    setSignInPassword,
  ]);

  const handleCreateAccountContinue = useCallback(() => {
    patientOnboardingService.registerAccount({
      contactMode,
      contactValue,
      password: draft.password,
      draft,
    });
    setActiveContactKey(
      `${contactMode}:${normalizeContactKey(contactMode, contactValue)}`,
    );
    setOtp("");
    goToScreen(ONBOARDING_SCREENS.VERIFY);
  }, [
    contactMode,
    contactValue,
    draft,
    goToScreen,
    setActiveContactKey,
    setOtp,
  ]);

  const handleVerifyContinue = useCallback(() => {
    if (verifyFlow === "recovery") {
      updateDraft({ password: "", confirmPassword: "" });
      goToScreen(ONBOARDING_SCREENS.NEW_PASSWORD);
      return;
    }
    goToScreen(ONBOARDING_SCREENS.PROFILE_PHOTO);
  }, [goToScreen, updateDraft, verifyFlow]);

  const handleProfilePhotoContinue = useCallback(() => {
    setPhase("onboarding");
    goToScreen(ONBOARDING_SCREENS.SCHOOL_TYPE);
  }, [goToScreen, setPhase]);

  const handleSchoolSelect = useCallback(
    (school: { id: string; name: string; logo?: string }) => {
      updateDraft({
        schoolId: school.id,
        schoolName: school.name,
        school: school.name,
        schoolLogo: school.logo ?? "",
      });
      goToScreen(ONBOARDING_SCREENS.PROGRAMME);
    },
    [goToScreen, updateDraft],
  );

  const handleSubmit = useCallback(() => {
    const syncedDraft = syncDraftDerivedFields(draft);
    patientOnboardingService.registerAccount({
      contactMode,
      contactValue,
      password: syncedDraft.password,
      draft: syncedDraft,
    });
    patientOnboardingService.markOnboardingComplete(
      contactMode,
      contactValue,
      syncedDraft,
    );
    const referenceYear = new Date().getFullYear();
    setShowHomeProfileModalFlag({
      nickname: syncedDraft.nickname,
      fullName: syncedDraft.fullName,
      profilePhotoUrl: syncedDraft.profilePhotoUrl,
      gender: syncedDraft.gender,
      phone: syncedDraft.phone,
      email: syncedDraft.email,
      birthYear: syncedDraft.birthYear,
      gradeShort: syncedDraft.gradeShort,
      graduationYear: syncedDraft.gradeShort
        ? computeGraduationYear(syncedDraft.gradeYearsRemaining, referenceYear)
        : null,
      programme: syncedDraft.programme,
      schoolName: syncedDraft.schoolName,
      contactMode,
    });
    toast.success(ONBOARDING_COPY.toast.onboardingComplete);
    router.push(ROUTES.patient.lockIn);
  }, [contactMode, contactValue, draft, router]);

  return {
    routeAfterContactSubmit,
    handleSignIn,
    handleForgotPassword,
    handleStartRecovery,
    handleNewPasswordContinue,
    handleCreateAccountContinue,
    handleVerifyContinue,
    handleProfilePhotoContinue,
    handleSchoolSelect,
    handleSubmit,
  };
}
