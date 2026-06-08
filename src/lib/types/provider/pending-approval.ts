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
