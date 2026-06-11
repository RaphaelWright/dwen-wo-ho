import type { ProviderProfileResponse } from "@/lib/types/api/auth";
import type { ProviderProfileData } from "@/lib/types/api/provider-dashboard";

export type PendingApprovalProfileInput = Partial<
  Pick<
    ProviderProfileData,
    "title" | "name" | "specialty" | "avatarUrl" | "memberSince"
  >
> &
  Partial<
    Pick<
      ProviderProfileResponse,
      | "title"
      | "providerName"
      | "professionalTitle"
      | "specialty"
      | "profilePhotoURL"
      | "applicationDate"
    >
  >;

export interface PendingApprovalUserInfo {
  name: string;
  title: string;
  specialty: string;
  profileImage?: string;
  timeAgo: string;
}

export interface PendingApprovalModalProps {
  userInfo: PendingApprovalUserInfo;
  onLogout: () => void;
}
