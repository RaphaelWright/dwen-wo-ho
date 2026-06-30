import {
  ONBOARDING_INITIAL_DRAFT,
  ONBOARDING_SESSION_KEYS,
} from "@/lib/constants/components/patient/onboarding";
import type { HomeProfilePreview } from "@/lib/types/components/patient/onboarding";

const PREVIEW_KEY = `${ONBOARDING_SESSION_KEYS.showHomeProfileModal}:preview`;
const TOAST_KEY = `${ONBOARDING_SESSION_KEYS.showHomeProfileModal}:toast`;

export function setShowHomeProfileModalFlag(
  preview: HomeProfilePreview,
  options?: { toastMessage?: string },
): void {
  try {
    localStorage.setItem(ONBOARDING_SESSION_KEYS.showHomeProfileModal, "1");
    localStorage.setItem(PREVIEW_KEY, JSON.stringify(preview));
    if (options?.toastMessage) {
      localStorage.setItem(TOAST_KEY, options.toastMessage);
    } else {
      localStorage.removeItem(TOAST_KEY);
    }
  } catch {
    // localStorage may be unavailable in private browsing
  }
}

export function consumeShowHomeProfileModalFlag(): {
  shouldShow: boolean;
  preview: HomeProfilePreview | null;
  toastMessage: string | null;
} {
  try {
    const value = localStorage.getItem(
      ONBOARDING_SESSION_KEYS.showHomeProfileModal,
    );
    const rawPreview = localStorage.getItem(PREVIEW_KEY);
    const toastMessage = localStorage.getItem(TOAST_KEY);
    if (value === "1") {
      localStorage.removeItem(ONBOARDING_SESSION_KEYS.showHomeProfileModal);
      localStorage.removeItem(PREVIEW_KEY);
      localStorage.removeItem(TOAST_KEY);
      localStorage.removeItem(
        `${ONBOARDING_SESSION_KEYS.showHomeProfileModal}:name`,
      );

      if (rawPreview) {
        return {
          shouldShow: true,
          preview: JSON.parse(rawPreview) as HomeProfilePreview,
          toastMessage,
        };
      }

      return { shouldShow: true, preview: null, toastMessage };
    }
  } catch {
    // ignore
  }
  return { shouldShow: false, preview: null, toastMessage: null };
}

export function clearOnboardingSession(): void {
  try {
    localStorage.removeItem(ONBOARDING_SESSION_KEYS.showHomeProfileModal);
    localStorage.removeItem(PREVIEW_KEY);
    localStorage.removeItem(TOAST_KEY);
    localStorage.removeItem(ONBOARDING_SESSION_KEYS.draft);
  } catch {
    // ignore
  }
}

export function getInitialOnboardingDraft() {
  return { ...ONBOARDING_INITIAL_DRAFT, programmeTags: [] as string[] };
}
