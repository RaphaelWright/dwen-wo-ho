import type { BackendNotification, NotificationType } from "./shared";
import type { ProviderDetailResponse } from "./providers";

export interface CuratorSummary {
  schoolCount: number;
  providerCount: number;
  partnerCount: number;
}

export interface CuratorNotification extends BackendNotification {
  curatorId?: string;
  sendToAllCurators?: boolean;
  recipientId?: string;
}

export interface CuratorNotificationListResponse {
  notifications: CuratorNotification[];
  unreadCount: number;
  totalCount: number;
}

export interface SendNotificationRequest {
  type: NotificationType;
  title: string;
  message: string;
  relatedEntityId?: string;
  relatedEntityType?: string;
  actionUrl?: string;
  schoolId?: number;
  sendToAllCurators?: boolean;
  curatorId?: string;
  recipientId?: string;
}

export interface MarkNotificationsReadRequest {
  notificationIds: string[]; // array of UUIDs
}

// Re-export curator provider detail shape (same as shared ProviderDetailResponse)
export type { ProviderDetailResponse };
