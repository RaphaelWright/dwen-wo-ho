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
