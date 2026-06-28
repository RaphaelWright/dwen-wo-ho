import {
  ONBOARDING_INITIAL_DRAFT,
  ONBOARDING_SESSION_KEYS,
} from "@/lib/constants/components/patient/onboarding";

export function setShowHomeProfileModalFlag(nickname?: string): void {
  try {
    localStorage.setItem(ONBOARDING_SESSION_KEYS.showHomeProfileModal, "1");
    if (nickname) {
      localStorage.setItem(
        `${ONBOARDING_SESSION_KEYS.showHomeProfileModal}:name`,
        nickname,
      );
    }
  } catch {
    // localStorage may be unavailable in private browsing
  }
}

export function consumeShowHomeProfileModalFlag(): {
  shouldShow: boolean;
  nickname: string;
} {
  try {
    const value = localStorage.getItem(
      ONBOARDING_SESSION_KEYS.showHomeProfileModal,
    );
    const nickname =
      localStorage.getItem(
        `${ONBOARDING_SESSION_KEYS.showHomeProfileModal}:name`,
      ) ?? "";
    if (value === "1") {
      localStorage.removeItem(ONBOARDING_SESSION_KEYS.showHomeProfileModal);
      localStorage.removeItem(
        `${ONBOARDING_SESSION_KEYS.showHomeProfileModal}:name`,
      );
      return { shouldShow: true, nickname };
    }
  } catch {
    // ignore
  }
  return { shouldShow: false, nickname: "" };
}

export function clearOnboardingSession(): void {
  try {
    localStorage.removeItem(ONBOARDING_SESSION_KEYS.showHomeProfileModal);
    localStorage.removeItem(ONBOARDING_SESSION_KEYS.draft);
  } catch {
    // ignore
  }
}

export function getInitialOnboardingDraft() {
  return { ...ONBOARDING_INITIAL_DRAFT, programmeTags: [] as string[] };
}
