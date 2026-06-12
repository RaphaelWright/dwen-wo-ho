import { ROUTES } from "@/lib/constants/routes";
import type { SignInResponse } from "@/lib/types/api/auth";
import { getProviderProfileResumeStep } from "@/lib/utils/provider-signup-resume";

interface ProviderUserData {
  applicationStatus?: string;
  status?: string;
  userRole?: string;
  profileURL?: string;
  officePhoneNumber?: string;
  specialty?: string;
  title?: string;
  providerName?: string;
  professionalTitle?: string;
  profilePhotoURL?: string;
  applicationTimestamp?: string | number | Date;
  createdAt?: string | number | Date;
  created_at?: string | number | Date;
  joinedAt?: string | number | Date;
}

type LoginResponse = SignInResponse | { message?: string };

export interface RedirectInfo {
  path: string;
  isPending: boolean;
  userInfo?: {
    name: string;
    title: string;
    timeAgo: string;
    profileImage: string | undefined;
  };
  step?: string;
}

function buildPendingUserInfo(
  userData: ProviderUserData,
): RedirectInfo["userInfo"] {
  let timeAgo = "Recently";
  const createdDate =
    userData.applicationTimestamp ||
    userData.createdAt ||
    userData.created_at ||
    userData.joinedAt;

  if (createdDate) {
    const date = new Date(createdDate);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) {
      timeAgo = "Just now";
    } else if (diffInSeconds < 3600) {
      const mins = Math.floor(diffInSeconds / 60);
      timeAgo = `${mins} minute${mins > 1 ? "s" : ""} ago`;
    } else if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600);
      timeAgo = `${hours} hour${hours > 1 ? "s" : ""} ago`;
    } else {
      const days = Math.floor(diffInSeconds / 86400);
      timeAgo = `${days} day${days > 1 ? "s" : ""} ago`;
    }
  }

  return {
    name: `${userData.title ? `${userData.title} ` : ""}${userData.providerName || "Provider"}`,
    title:
      userData.professionalTitle || userData.specialty || "Health Provider",
    timeAgo,
    profileImage: userData.profilePhotoURL || userData.profileURL || undefined,
  };
}

function buildIncompleteProfileRedirect(
  userData: ProviderUserData,
): RedirectInfo | null {
  const resumeStep = getProviderProfileResumeStep(userData);

  if (!resumeStep) {
    return null;
  }

  return {
    path: ROUTES.provider.signUp,
    step: resumeStep,
    isPending: false,
  };
}

/**
 * Determines the redirect path and user info based on the provider's application status and profile completeness.
 */
export function getProviderRedirectInfo(
  userData: ProviderUserData,
  loginResponse?: LoginResponse,
): RedirectInfo {
  if (userData.userRole === "ROLE_CURATOR") {
    return { path: ROUTES.curator.schools, isPending: false };
  }

  const incompleteProfileRedirect = buildIncompleteProfileRedirect(userData);
  if (incompleteProfileRedirect) {
    return incompleteProfileRedirect;
  }

  const isPending =
    userData.applicationStatus === "PENDING" ||
    userData.status === "PENDING" ||
    ("message" in (loginResponse ?? {}) &&
      (loginResponse as { message?: string }).message === "ACCOUNT PENDING");

  if (isPending) {
    return {
      path: ROUTES.provider.home,
      isPending: true,
      userInfo: buildPendingUserInfo(userData),
    };
  }

  if (userData.applicationStatus === "REJECTED") {
    return {
      path: ROUTES.provider.home,
      isPending: true,
      userInfo: buildPendingUserInfo(userData),
    };
  }

  return { path: ROUTES.provider.home, isPending: false };
}
