import { calculateTimeAgo } from "@/lib/utils/shared/time-ago";
import { resolveProviderDisplayName } from "@/lib/utils/shared/provider-name";
import type {
  PendingApprovalProfileInput,
  PendingApprovalUserInfo,
} from "@/lib/types/components/provider/pending-approval-modal";

export const toPendingApprovalUserInfo = (
  profile?: PendingApprovalProfileInput,
): PendingApprovalUserInfo => {
  const source = profile ?? {};
  const memberSince = source.memberSince ?? source.applicationDate;

  return {
    name: resolveProviderDisplayName(source),
    title: source.specialty ?? "",
    specialty: source.specialty ?? "",
    profileImage: source.avatarUrl ?? source.profilePhotoURL,
    timeAgo: memberSince ? calculateTimeAgo(memberSince) : "Recently",
  };
};
