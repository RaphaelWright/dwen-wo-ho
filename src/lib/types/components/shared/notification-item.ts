export type NotifItemStatus = "idle" | "marking-read" | "deleting";

export interface NotifItemProps<N> {
  notif: N;
  isUnread: boolean;
  onMarkRead: () => void;
  onDelete?: () => void;
  onClick?: () => void;
  status?: NotifItemStatus;
  getAvatarUrl: (n: unknown) => string | null | undefined;
  getEmoji: (n: unknown) => string | undefined;
  getTitle: (n: unknown) => string | undefined;
  getText: (n: unknown) => string | undefined;
  getTimestamp: (n: unknown) => string | undefined;
}
