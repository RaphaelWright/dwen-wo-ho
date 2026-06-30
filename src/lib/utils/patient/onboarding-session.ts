import {
  ONBOARDING_INITIAL_DRAFT,
  ONBOARDING_SESSION_KEYS,
} from "@/lib/constants/components/patient/onboarding";
import type { HomeProfilePreview } from "@/lib/types/components/patient/onboarding";

const PREVIEW_KEY = `${ONBOARDING_SESSION_KEYS.showHomeProfileModal}:preview`;

export function setShowHomeProfileModalFlag(
  preview?: HomeProfilePreview,
): void {
  try {
    localStorage.setItem(ONBOARDING_SESSION_KEYS.showHomeProfileModal, "1");
    if (preview) {
      localStorage.setItem(PREVIEW_KEY, JSON.stringify(preview));
    }
  } catch {
    // localStorage may be unavailable in private browsing
  }
}

export function consumeShowHomeProfileModalFlag(): {
  shouldShow: boolean;
  preview: HomeProfilePreview | null;
} {
  try {
    const value = localStorage.getItem(
      ONBOARDING_SESSION_KEYS.showHomeProfileModal,
    );
    const rawPreview = localStorage.getItem(PREVIEW_KEY);
    if (value === "1") {
      localStorage.removeItem(ONBOARDING_SESSION_KEYS.showHomeProfileModal);
      localStorage.removeItem(PREVIEW_KEY);
      localStorage.removeItem(
        `${ONBOARDING_SESSION_KEYS.showHomeProfileModal}:name`,
      );

      if (rawPreview) {
        return {
          shouldShow: true,
          preview: JSON.parse(rawPreview) as HomeProfilePreview,
        };
      }

      return { shouldShow: true, preview: null };
    }
  } catch {
    // ignore
  }
  return { shouldShow: false, preview: null };
}

export function clearOnboardingSession(): void {
  try {
    localStorage.removeItem(ONBOARDING_SESSION_KEYS.showHomeProfileModal);
    localStorage.removeItem(PREVIEW_KEY);
    localStorage.removeItem(ONBOARDING_SESSION_KEYS.draft);
  } catch {
    // ignore
  }
}

export function getInitialOnboardingDraft() {
  return { ...ONBOARDING_INITIAL_DRAFT, programmeTags: [] as string[] };
}
