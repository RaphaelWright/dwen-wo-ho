import { ROUTES } from "@/lib/constants/routes";
import { DEFAULT_PENDING_USER_INFO } from "@/lib/constants/mock-data";

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

/**
 * Determines the redirect path and user info based on the provider's application status and profile completeness.
 */
export function getProviderRedirectInfo(userData: any, loginResponse?: any): RedirectInfo {
  const isPending =
    userData.applicationStatus === "PENDING" ||
    userData.status === "PENDING" ||
    loginResponse?.message === "ACCOUNT PENDING";

  if (isPending) {
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
      path: ROUTES.provider.home,
      isPending: true,
      userInfo: {
        name: `${userData.title ? `${userData.title} ` : ""}${userData.providerName || "Provider"}`,
        title: userData.professionalTitle || userData.specialty || "Health Provider",
        timeAgo,
        profileImage: userData.profilePhotoURL || userData.profileURL || undefined,
      },
    };
  }

  if (userData.applicationStatus === "APPROVED") {
    if (userData.userRole === "ROLE_CURATOR") {
      return { path: ROUTES.curator.schools, isPending: false };
    }

    if (!userData.profileURL) {
      return { path: "/provider/signup", step: "photo", isPending: false };
    }
    if (!userData.officePhoneNumber) {
      return { path: "/provider/signup", step: "bio", isPending: false };
    }
    if (!userData.specialty || !userData.specialty.trim()) {
      return { path: "/provider/signup", step: "specialty", isPending: false };
    }

    return { path: ROUTES.provider.home, isPending: false };
  }

  if (userData.applicationStatus === "REJECTED") {
    return { path: ROUTES.provider.home, isPending: true }; // Still considered "pending" UI-wise for rejection
  }

  // Fallback Curator check
  if (userData.userRole === "ROLE_CURATOR") {
    return { path: ROUTES.curator.schools, isPending: false };
  }

  // Fallback Profile Check
  if (!userData.profileURL) {
    return { path: "/provider/signup", step: "photo", isPending: false };
  }
  if (!userData.officePhoneNumber) {
    return { path: "/provider/signup", step: "bio", isPending: false };
  }
  if (!userData.specialty || !userData.specialty.trim()) {
    return { path: "/provider/signup", step: "specialty", isPending: false };
  }

  return { path: ROUTES.provider.home, isPending: false };
}
