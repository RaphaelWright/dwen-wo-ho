import { calculateTimeAgo } from "@/lib/utils";
import type {
  PendingApprovalProfileInput,
  PendingApprovalUserInfo,
} from "@/lib/types/provider/pending-approval";

const resolveDisplayName = (profile: PendingApprovalProfileInput): string => {
  const honorific = (profile.title ?? profile.professionalTitle)?.trim();
  const name = (profile.name ?? profile.providerName)?.trim() ?? "";

  return honorific ? `${honorific} ${name}` : name;
};

export const toPendingApprovalUserInfo = (
  profile?: PendingApprovalProfileInput,
): PendingApprovalUserInfo => {
  const source = profile ?? {};
  const memberSince = source.memberSince ?? source.applicationDate;

  return {
    name: resolveDisplayName(source),
    title: source.specialty ?? "",
    specialty: source.specialty ?? "",
    profileImage: source.avatarUrl ?? source.profilePhotoURL,
    timeAgo: memberSince ? calculateTimeAgo(memberSince) : "Recently",
  };
};
