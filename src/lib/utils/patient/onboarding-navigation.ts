import type {
  AuthPath,
  OnboardingScreen,
} from "@/lib/types/components/patient/onboarding";

import { ONBOARDING_SCREENS } from "@/lib/constants/components/patient/onboarding";

const STATIC_BACK_NAV: Partial<Record<OnboardingScreen, OnboardingScreen>> = {
  [ONBOARDING_SCREENS.CONTACT]: ONBOARDING_SCREENS.CHOICE,

  [ONBOARDING_SCREENS.CREATE_ACCOUNT]: ONBOARDING_SCREENS.CONTACT,

  [ONBOARDING_SCREENS.SIGN_IN]: ONBOARDING_SCREENS.CONTACT,

  [ONBOARDING_SCREENS.FORGOT_PASSWORD]: ONBOARDING_SCREENS.SIGN_IN,

  [ONBOARDING_SCREENS.NEW_PASSWORD]: ONBOARDING_SCREENS.VERIFY,

  [ONBOARDING_SCREENS.PROFILE_PHOTO]: ONBOARDING_SCREENS.VERIFY,

  [ONBOARDING_SCREENS.PROGRAMME]: ONBOARDING_SCREENS.SCHOOL_TYPE,

  [ONBOARDING_SCREENS.GRADE]: ONBOARDING_SCREENS.PROGRAMME,
};

const VERIFY_BACK_NAV: Record<AuthPath, OnboardingScreen> = {
  signup: ONBOARDING_SCREENS.CREATE_ACCOUNT,

  signin: ONBOARDING_SCREENS.SIGN_IN,

  recovery: ONBOARDING_SCREENS.SIGN_IN,
};

const SCHOOL_TYPE_BACK_NAV: Record<AuthPath, OnboardingScreen> = {
  signup: ONBOARDING_SCREENS.PROFILE_PHOTO,
  signin: ONBOARDING_SCREENS.SIGN_IN,
  recovery: ONBOARDING_SCREENS.SIGN_IN,
};

export function getPreviousScreen(params: {
  screen: OnboardingScreen;

  authPath: AuthPath;
}): OnboardingScreen | null {
  const { screen, authPath } = params;

  if (screen === ONBOARDING_SCREENS.VERIFY) {
    return VERIFY_BACK_NAV[authPath];
  }

  if (screen === ONBOARDING_SCREENS.SCHOOL_TYPE) {
    return SCHOOL_TYPE_BACK_NAV[authPath];
  }

  return STATIC_BACK_NAV[screen] ?? null;
}
