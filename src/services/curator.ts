import { api } from "@/lib/api";
import { STATIC_ENDPOINTS, DYNAMIC_ENDPOINTS } from "@/lib/constants/endpoints";
import type {
  CuratorSummary,
  SendNotificationRequest,
  MarkNotificationsReadRequest,
} from "@/lib/types/api/curator";
import type { ProviderDetailResponse } from "@/lib/types/api/providers";

export const curatorService = {
  // T3-1: Summary counts
  getSummary: async (): Promise<CuratorSummary> => {
    const result = await api(STATIC_ENDPOINTS.CURATOR.SUMMARY);
    if (result?.success && result.data) return result.data as CuratorSummary;
    return { schoolCount: 0, providerCount: 0, partnerCount: 0 };
  },

  // T3-2: Provider detail (schools + partners for a specific provider)
  getProviderDetail: async (
    providerId: string | number,
  ): Promise<ProviderDetailResponse> => {
    const result = await api(
      DYNAMIC_ENDPOINTS.CURATOR_PROVIDERS.GET(providerId),
    );
    if (result?.success && result.data)
      return result.data as ProviderDetailResponse;
    throw new Error("Failed to fetch provider detail");
  },

  // T3-3: Curator notifications
  getNotifications: async () => {
    const result = await api(STATIC_ENDPOINTS.CURATOR.NOTIFICATIONS);
    if (result?.success && result.data) return result.data;
    return { notifications: [], unreadCount: 0, totalCount: 0 };
  },

  getUnreadNotifications: async () => {
    const result = await api(STATIC_ENDPOINTS.CURATOR.NOTIFICATIONS_UNREAD);
    if (result?.success && result.data) return result.data;
    return { notifications: [], unreadCount: 0 };
  },

  sendNotification: async (data: SendNotificationRequest): Promise<void> => {
    const result = await api(STATIC_ENDPOINTS.CURATOR.SEND_NOTIFICATION, {
      method: "POST",
      body: JSON.stringify(data),
    });
    if (!result?.success) throw new Error("Failed to send notification");
  },

  markNotificationsRead: async (
    data: MarkNotificationsReadRequest,
  ): Promise<void> => {
    await api(STATIC_ENDPOINTS.CURATOR.MARK_NOTIFICATIONS_READ, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },

  markAllNotificationsRead: async (): Promise<void> => {
    await api(STATIC_ENDPOINTS.CURATOR.NOTIFICATIONS_READ_ALL, {
      method: "PUT",
    });
  },

  deleteNotification: async (id: string | number): Promise<void> => {
    await api(DYNAMIC_ENDPOINTS.CURATOR.DELETE_NOTIFICATION(id), {
      method: "DELETE",
    });
  },

  clearAllNotifications: async (): Promise<void> => {
    await api(STATIC_ENDPOINTS.CURATOR.CLEAR_ALL_NOTIFICATIONS, {
      method: "DELETE",
    });
  },
};
