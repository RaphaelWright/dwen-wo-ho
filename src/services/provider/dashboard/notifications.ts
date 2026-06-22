import { api } from "@/lib/api";
import {
  STATIC_ENDPOINTS,
  DYNAMIC_ENDPOINTS,
} from "@/lib/constants/infra/endpoints";
import { ProviderNotificationListResponse } from "@/lib/types/entities/notification";

const PD = STATIC_ENDPOINTS.PROVIDER_DASHBOARD;

export const notificationsService = {
  getNotifications: async (
    page?: number,
  ): Promise<ProviderNotificationListResponse> => {
    const qs = page != null ? `?page=${page}` : "";
    const result = await api(`${PD.NOTIFICATIONS}${qs}`);
    if (result?.success && result.data) {
      return result.data as ProviderNotificationListResponse;
    }
    return {
      items: [],
      unreadCount: 0,
      totalCount: 0,
    };
  },

  markAllNotificationsRead: async (): Promise<void> => {
    await api(PD.NOTIFICATIONS_READ_ALL, { method: "POST" });
  },

  markOneNotificationRead: async (id: string): Promise<void> => {
    await api(DYNAMIC_ENDPOINTS.PROVIDERS.MARK_NOTIFICATION_READ(id), {
      method: "PATCH",
    });
  },

  deleteNotification: async (id: string | number): Promise<void> => {
    await api(DYNAMIC_ENDPOINTS.PROVIDERS.DELETE_NOTIFICATION(id), {
      method: "DELETE",
    });
  },

  clearAllNotifications: async (): Promise<void> => {
    await api(PD.CLEAR_ALL_NOTIFICATIONS, { method: "DELETE" });
  },
};
