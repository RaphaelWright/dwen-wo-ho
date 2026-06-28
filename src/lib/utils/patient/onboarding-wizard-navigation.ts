import { ONBOARDING_SCREENS } from "@/lib/constants/components/patient/onboarding";
import type { OnboardingScreen } from "@/lib/types/components/patient/onboarding";

interface AdvanceScreenActions {
  handleCreateAccountContinue: () => void;
  handleVerifyContinue: () => void;
  handleProfilePhotoContinue: () => void;
  handleSignIn: () => void;
  handleStartRecovery: () => void;
  handleNewPasswordContinue: () => void;
  handleSubmit: () => void;
}

const SCREEN_ADVANCERS: Partial<
  Record<OnboardingScreen, (actions: AdvanceScreenActions) => void>
> = {
  [ONBOARDING_SCREENS.CREATE_ACCOUNT]: (actions) =>
    actions.handleCreateAccountContinue(),
  [ONBOARDING_SCREENS.VERIFY]: (actions) => actions.handleVerifyContinue(),
  [ONBOARDING_SCREENS.PROFILE_PHOTO]: (actions) =>
    actions.handleProfilePhotoContinue(),
  [ONBOARDING_SCREENS.SIGN_IN]: (actions) => actions.handleSignIn(),
  [ONBOARDING_SCREENS.FORGOT_PASSWORD]: (actions) =>
    actions.handleStartRecovery(),
  [ONBOARDING_SCREENS.NEW_PASSWORD]: (actions) =>
    actions.handleNewPasswordContinue(),
  [ONBOARDING_SCREENS.GRADE]: (actions) => actions.handleSubmit(),
};

export function advanceOnboardingScreen(
  screen: OnboardingScreen,
  goToScreen: (screen: OnboardingScreen) => void,
  actions: AdvanceScreenActions,
): void {
  if (screen === ONBOARDING_SCREENS.SCHOOL_TYPE) {
    goToScreen(ONBOARDING_SCREENS.PROGRAMME);
    return;
  }

  if (screen === ONBOARDING_SCREENS.PROGRAMME) {
    goToScreen(ONBOARDING_SCREENS.GRADE);
    return;
  }

  SCREEN_ADVANCERS[screen]?.(actions);
}
