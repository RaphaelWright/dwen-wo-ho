import type {
  AuthPath,
  OnboardingScreen,
} from "@/lib/types/components/patient/onboarding";

import { ONBOARDING_SCREENS } from "@/lib/constants/components/patient/onboarding";

const STATIC_BACK_NAV: Partial<Record<OnboardingScreen, OnboardingScreen>> = {
  [ONBOARDING_SCREENS.CREATE_ACCOUNT]: ONBOARDING_SCREENS.CONTACT,

  [ONBOARDING_SCREENS.SIGN_IN]: ONBOARDING_SCREENS.CONTACT,

  [ONBOARDING_SCREENS.FORGOT_PASSWORD]: ONBOARDING_SCREENS.SIGN_IN,

  [ONBOARDING_SCREENS.NEW_PASSWORD]: ONBOARDING_SCREENS.VERIFY,

  [ONBOARDING_SCREENS.PROFILE_PHOTO]: ONBOARDING_SCREENS.VERIFY,

  [ONBOARDING_SCREENS.SCHOOL_TYPE]: ONBOARDING_SCREENS.PROFILE_PHOTO,

  [ONBOARDING_SCREENS.PROGRAMME]: ONBOARDING_SCREENS.SCHOOL_TYPE,

  [ONBOARDING_SCREENS.GRADE]: ONBOARDING_SCREENS.PROGRAMME,
};

const VERIFY_BACK_NAV: Record<AuthPath, OnboardingScreen> = {
  signup: ONBOARDING_SCREENS.CREATE_ACCOUNT,

  signin: ONBOARDING_SCREENS.CREATE_ACCOUNT,

  recovery: ONBOARDING_SCREENS.FORGOT_PASSWORD,
};

export function getPreviousScreen(params: {
  screen: OnboardingScreen;

  authPath: AuthPath;
}): OnboardingScreen | null {
  const { screen, authPath } = params;

  if (screen === ONBOARDING_SCREENS.VERIFY) {
    return VERIFY_BACK_NAV[authPath];
  }

  return STATIC_BACK_NAV[screen] ?? null;
}
