import { CuratorNotificationType } from "../entities/notification";

export interface CuratorSummary {
  schoolCount: number;
  providerCount: number;
  partnerCount: number;
}

export interface SendNotificationRequest {
  type: CuratorNotificationType;
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
