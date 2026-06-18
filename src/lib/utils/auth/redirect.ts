import { ROUTES } from "@/lib/constants/routes";
import type {
  ProviderOnboardingNextStep,
  SignInResponse,
} from "@/lib/types/api/auth";
import type { RedirectInfo } from "@/lib/types/auth/redirect";
import { verboseTimeAgo } from "@/lib/utils/shared/time-ago";
import { resolveProviderProfileResumeStep } from "@/lib/utils/provider/signup-resume";

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
  email?: string;
  nextStep?: ProviderOnboardingNextStep;
}

type LoginResponse = SignInResponse | { message?: string };

export type { RedirectInfo };

function buildPendingUserInfo(
  userData: ProviderUserData,
): RedirectInfo["userInfo"] {
  let timeAgoLabel = "Recently";
  const createdDate =
    userData.applicationTimestamp ||
    userData.createdAt ||
    userData.created_at ||
    userData.joinedAt;

  if (createdDate) {
    timeAgoLabel = verboseTimeAgo(new Date(createdDate));
  }

  return {
    name: `${userData.title ? `${userData.title} ` : ""}${userData.providerName || "Provider"}`,
    title:
      userData.professionalTitle || userData.specialty || "Health Provider",
    timeAgo: timeAgoLabel,
    profileImage: userData.profilePhotoURL || userData.profileURL || undefined,
  };
}

function buildIncompleteProfileRedirect(
  userData: ProviderUserData,
): RedirectInfo | null {
  const resumeStep = resolveProviderProfileResumeStep(userData);

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
