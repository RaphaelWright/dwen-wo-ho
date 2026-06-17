import type {
  CuratorNotification,
  ProviderNotification,
} from "@/lib/types/entities/notification";

export type NotificationUserType = "curator" | "provider";

export interface ParsedWsNotification {
  notification: CuratorNotification | ProviderNotification;
  unreadCount: number;
  link: string | null;
}
