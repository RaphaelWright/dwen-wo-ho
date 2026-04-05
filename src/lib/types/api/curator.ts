import type { BackendNotification, NotificationType } from "./shared";
import type { ProviderDetailResponse } from "./providers";

/**
 * Raw curator notification from API response.
 * Note: This differs from BackendNotification which is provider-specific.
 */
export interface CuratorNotificationApiItem {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  createdAt: string;
  relatedEntityId?: string;
  relatedEntityType?: string;
  actionUrl?: string;
  schoolId?: number | null;
  read: boolean;
}

export interface CuratorSummary {
  schoolCount: number;
  providerCount: number;
  partnerCount: number;
}

/**
 * @deprecated The CuratorNotification type incorrectly extends BackendNotification.
 * Use CuratorNotificationApiItem for the actual API response format.
 */
export interface CuratorNotification extends BackendNotification {
  curatorId?: string;
  sendToAllCurators?: boolean;
  recipientId?: string;
}

export interface CuratorNotificationListResponse {
  notifications: CuratorNotificationApiItem[];
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
