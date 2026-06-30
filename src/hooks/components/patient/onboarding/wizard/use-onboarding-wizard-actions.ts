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
  HomeProfilePreview,
  OnboardingDraft,
  OnboardingScreen,
  VerifyFlow,
} from "@/lib/types/components/patient/onboarding";
import { patientOnboardingService } from "@/services/patient/onboarding/account-registry";
import {
  buildHomeProfilePreview,
  hasCampusOnboardingData,
  mergeStoredOnboardingDraft,
  syncDraftDerivedFields,
} from "@/lib/utils/patient/onboarding-validation";
import { normalizeContactKey } from "@/lib/utils/patient/onboarding-format";
import { setShowHomeProfileModalFlag } from "@/lib/utils/patient/onboarding-session";

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
  showHostToast: (message: string) => void;
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
    showHostToast,
  } = deps;

  const navigateToPatientWithHomeModal = useCallback(
    (preview: HomeProfilePreview, toastMessage?: string) => {
      setShowHomeProfileModalFlag(preview, { toastMessage });
      router.push(ROUTES.patient.lockIn);
    },
    [router],
  );

  const openHomeOrOnboarding = useCallback(
    (accountDraft: Partial<OnboardingDraft>) => {
      const mergedDraft = mergeStoredOnboardingDraft({
        ...accountDraft,
        phone:
          contactMode === "phone" ? contactValue : (accountDraft.phone ?? ""),
        email:
          contactMode === "email" ? contactValue : (accountDraft.email ?? ""),
      });
      updateDraft(mergedDraft);

      if (hasCampusOnboardingData(mergedDraft)) {
        navigateToPatientWithHomeModal(
          buildHomeProfilePreview(mergedDraft, contactMode),
        );
        return;
      }

      setPhase("onboarding");
      goToScreen(ONBOARDING_SCREENS.SCHOOL_TYPE);
    },
    [
      contactMode,
      contactValue,
      goToScreen,
      navigateToPatientWithHomeModal,
      setPhase,
      updateDraft,
    ],
  );

  const routeAfterContactSubmit = useCallback(() => {
    const account = patientOnboardingService.lookupContact(
      contactMode,
      contactValue,
    );

    if (account) {
      setActiveContactKey(account.contactKey);
      updateDraft({ nickname: account.nickname, ...account.draft });
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
    openHomeOrOnboarding(account.draft);
  }, [
    contactMode,
    contactValue,
    openHomeOrOnboarding,
    setActiveContactKey,
    signInPassword,
  ]);

  const handleForgotPassword = useCallback(() => {
    setAuthPath("recovery");
    setVerifyFlow("recovery");
    setOtp("");
    goToScreen(ONBOARDING_SCREENS.VERIFY);
  }, [goToScreen, setAuthPath, setOtp, setVerifyFlow]);

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

    const account = patientOnboardingService.lookupContact(
      contactMode,
      contactValue,
    );
    if (!account) {
      return;
    }

    setAuthPath("signin");
    openHomeOrOnboarding({
      ...account.draft,
      password: draft.password,
      confirmPassword: draft.password,
    });
  }, [
    activeContactKey,
    contactMode,
    contactValue,
    draft.password,
    openHomeOrOnboarding,
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
      showHostToast(ONBOARDING_COPY.toast.schoolLockedIn(school.name));
      goToScreen(ONBOARDING_SCREENS.PROGRAMME);
    },
    [goToScreen, showHostToast, updateDraft],
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
    navigateToPatientWithHomeModal(
      buildHomeProfilePreview(syncedDraft, contactMode),
      ONBOARDING_COPY.toast.onboardingComplete,
    );
  }, [contactMode, contactValue, draft, navigateToPatientWithHomeModal]);

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
