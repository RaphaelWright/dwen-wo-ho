import { calculateTimeAgo } from "@/lib/utils";
import type { ProviderProfileData } from "@/lib/types/api/provider-dashboard";
import type { PendingApprovalUserInfo } from "@/lib/types/provider/pending-approval";

export const toPendingApprovalUserInfo = (
  profile: Partial<ProviderProfileData>,
): PendingApprovalUserInfo => {
  const honorific = profile.title?.trim();
  const name = profile.name?.trim() ?? "";

  return {
    name: honorific ? `${honorific} ${name}` : name,
    title: profile.specialty ?? "",
    specialty: profile.specialty ?? "",
    profileImage: profile.avatarUrl,
    timeAgo: profile.memberSince
      ? calculateTimeAgo(profile.memberSince)
      : "Recently",
  };
};
