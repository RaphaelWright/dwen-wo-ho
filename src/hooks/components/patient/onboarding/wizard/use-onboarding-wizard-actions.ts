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
import { patientAuthService } from "@/services/patient/auth";
import { applyPatientAuthTokens } from "@/lib/utils/auth/patient-tokens";
import { formatBirthDateForApi } from "@/lib/utils/patient/birth-date";
import {
  buildHomeProfilePreview,
  hasCampusOnboardingData,
  mergeStoredOnboardingDraft,
  syncDraftDerivedFields,
} from "@/lib/utils/patient/onboarding-validation";
import {
  composeFullName,
  normalizeContactKey,
} from "@/lib/utils/patient/onboarding-format";
import { setShowHomeProfileModalFlag } from "@/lib/utils/patient/onboarding-session";

interface WizardActionDeps {
  contactMode: ContactMode;
  contactValue: string;
  draft: OnboardingDraft;
  signInPassword: string;
  verifyFlow: VerifyFlow;
  otp: string;
  otpReference: string | null;
  passwordResetToken: string | null;
  goToScreen: (screen: OnboardingScreen) => void;
  updateDraft: (patch: Partial<OnboardingDraft>) => void;
  setAuthPath: (path: AuthPath) => void;
  setVerifyFlow: (flow: VerifyFlow) => void;
  setPhase: (phase: "auth" | "onboarding") => void;
  setActiveContactKey: (key: string | null) => void;
  setOtpReference: (value: string | null) => void;
  setPasswordResetToken: (value: string | null) => void;
  setPatientUserId: (value: string | null) => void;
  setSignInPassword: (value: string) => void;
  setOtp: (value: string) => void;
  router: AppRouterInstance;
  showHostToast: (message: string) => void;
}

function getContactType(contactMode: ContactMode) {
  return contactMode === "phone" ? "PHONE" : "EMAIL";
}

function getContactKey(contactMode: ContactMode, contactValue: string) {
  return `${contactMode}:${normalizeContactKey(contactMode, contactValue)}`;
}

export function useOnboardingWizardActions(deps: WizardActionDeps) {
  const {
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
    void patientAuthService
      .checkContact({
        type: getContactType(contactMode),
        value: contactValue,
      })
      .then((account) => {
        setPatientUserId(account.userId ?? null);
        setActiveContactKey(getContactKey(contactMode, contactValue));

        if (account.exists) {
          updateDraft({ nickname: account.nickname ?? "" });
          setAuthPath("signin");
          goToScreen(ONBOARDING_SCREENS.SIGN_IN);
          return;
        }

        setAuthPath("signup");
        setVerifyFlow("signup");
        goToScreen(ONBOARDING_SCREENS.CREATE_ACCOUNT);
      })
      .catch(() => {
        toast.error("We could not check that contact. Try again.");
      });
  }, [
    contactMode,
    contactValue,
    goToScreen,
    setActiveContactKey,
    setAuthPath,
    setPatientUserId,
    setVerifyFlow,
    updateDraft,
  ]);

  const handleSignIn = useCallback(() => {
    void patientAuthService
      .signin({
        contact: contactValue,
        password: signInPassword,
      })
      .then((response) => {
        applyPatientAuthTokens({
          accessToken: response.accessToken,
          refreshToken: response.refreshToken,
        });
        setPatientUserId(response.userId);
        setOtpReference(response.otpReference ?? null);
        setActiveContactKey(getContactKey(contactMode, contactValue));
        updateDraft({ nickname: response.nickname });

        if (response.onboardingCompleted) {
          navigateToPatientWithHomeModal(
            buildHomeProfilePreview(
              mergeStoredOnboardingDraft({
                ...draft,
                nickname: response.nickname,
              }),
              contactMode,
            ),
          );
          return;
        }

        openHomeOrOnboarding({ ...draft, nickname: response.nickname });
      })
      .catch(() => {
        toast.error("Incorrect password. Try again.");
      });
  }, [
    contactMode,
    contactValue,
    draft,
    navigateToPatientWithHomeModal,
    openHomeOrOnboarding,
    setActiveContactKey,
    setOtpReference,
    setPatientUserId,
    signInPassword,
    updateDraft,
  ]);

  const handleForgotPassword = useCallback(() => {
    void patientAuthService
      .forgotPassword({ contact: contactValue })
      .then((response) => {
        setOtpReference(response.otpReference);
        setPasswordResetToken(null);
        setAuthPath("recovery");
        setVerifyFlow("recovery");
        setOtp("");
        goToScreen(ONBOARDING_SCREENS.VERIFY);
      })
      .catch(() => {
        toast.error("We could not start password recovery. Try again.");
      });
  }, [
    contactValue,
    goToScreen,
    setAuthPath,
    setOtp,
    setOtpReference,
    setPasswordResetToken,
    setVerifyFlow,
  ]);

  const handleStartRecovery = useCallback(() => {
    setOtp("");
    goToScreen(ONBOARDING_SCREENS.VERIFY);
  }, [goToScreen, setOtp]);

  const handleNewPasswordContinue = useCallback(() => {
    if (!passwordResetToken) {
      toast.error("Verify your recovery code before setting a new password.");
      return;
    }

    void patientAuthService
      .setPassword({
        passwordResetToken,
        password: draft.password,
        confirmPassword: draft.confirmPassword,
      })
      .then(() => {
        setSignInPassword("");
        setPasswordResetToken(null);
        setAuthPath("signin");
        goToScreen(ONBOARDING_SCREENS.SIGN_IN);
        toast.success("Password updated. Sign in with your new password.");
      })
      .catch(() => {
        toast.error("We could not update your password. Try again.");
      });
  }, [
    draft.confirmPassword,
    draft.password,
    goToScreen,
    passwordResetToken,
    setAuthPath,
    setPasswordResetToken,
    setSignInPassword,
  ]);

  const handleCreateAccountContinue = useCallback(() => {
    const fullName = composeFullName(draft.firstName, draft.lastName);
    const dateOfBirth = formatBirthDateForApi({
      month: draft.birthMonth,
      day: draft.birthDay,
      year: draft.birthYear,
    });

    void patientAuthService
      .signup({
        contactType: getContactType(contactMode),
        contact: contactValue,
        name: fullName,
        nickname: draft.nickname,
        gender: draft.gender,
        dateOfBirth,
        password: draft.password,
      })
      .then((response) => {
        setPatientUserId(response.userId);
        setOtpReference(response.otpReference);
        setActiveContactKey(getContactKey(contactMode, contactValue));
        setOtp("");
        goToScreen(ONBOARDING_SCREENS.VERIFY);
      })
      .catch(() => {
        toast.error("We could not create your account. Try again.");
      });
  }, [
    contactMode,
    contactValue,
    draft,
    goToScreen,
    setActiveContactKey,
    setOtp,
    setOtpReference,
    setPatientUserId,
  ]);

  const handleVerifyContinue = useCallback(() => {
    if (!otpReference) {
      toast.error("Request a new verification code and try again.");
      return;
    }

    void patientAuthService
      .verifyOtp({
        otpReference,
        code: otp,
      })
      .then((response) => {
        if (!response.verified) {
          toast.error("That verification code is not valid.");
          return;
        }

        if (verifyFlow === "recovery") {
          setPasswordResetToken(response.passwordResetToken ?? null);
          updateDraft({ password: "", confirmPassword: "" });
          goToScreen(ONBOARDING_SCREENS.NEW_PASSWORD);
          return;
        }

        return patientAuthService
          .signin({
            contact: contactValue,
            password: draft.password,
          })
          .then((signinResponse) => {
            applyPatientAuthTokens({
              accessToken: signinResponse.accessToken,
              refreshToken: signinResponse.refreshToken,
            });
            setPatientUserId(signinResponse.userId);
            goToScreen(ONBOARDING_SCREENS.PROFILE_PHOTO);
          });
      })
      .catch(() => {
        toast.error("We could not verify that code. Try again.");
      });
  }, [
    contactValue,
    draft.password,
    goToScreen,
    otp,
    otpReference,
    setPatientUserId,
    setPasswordResetToken,
    updateDraft,
    verifyFlow,
  ]);

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
    navigateToPatientWithHomeModal(
      buildHomeProfilePreview(syncedDraft, contactMode),
      ONBOARDING_COPY.toast.onboardingComplete,
    );
  }, [contactMode, draft, navigateToPatientWithHomeModal]);

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
