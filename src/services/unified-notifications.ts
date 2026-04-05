import { curatorService } from "./curator";
import { curatorProvidersService } from "@/services/curator-providers";
import { providerDashboardService } from "./provider-dashboard";
import { getUserType } from "@/lib/utils/getUserType";
import type { SendNotificationRequest } from "@/lib/types/api/curator";

/**
 * Unified notification service that automatically routes to correct
 * curator or provider endpoints based on user role.
 */

export const unifiedNotificationsService = {
  /**
   * Get notifications - Both roles have real endpoints
   */
  getNotifications: async () => {
    const userType = getUserType();
    return userType === "curator"
      ? curatorService.getNotifications()
      : providerDashboardService.getNotifications();
  },

  /**
   * Mark single notification as read
   * Curator: PUT /curator/notifications/mark-read (body: {ids: [id]})
   * Provider: PATCH /api/provider/notifications/:id/read
   */
  markNotificationRead: async (id: string): Promise<void> => {
    const userType = getUserType();
    if (userType === "curator") {
      // Curator uses batch endpoint with single ID
      return curatorService.markNotificationsRead({ notificationIds: [id] });
    } else {
      // Provider uses provider dashboard endpoint
      return providerDashboardService.markOneNotificationRead(id);
    }
  },

  /**
   * Mark all notifications as read
   * Curator: PUT /curator/notifications/mark-all-read
   * Provider: POST /api/provider/notifications/read-all
   */
  markAllNotificationsRead: async (): Promise<void> => {
    const userType = getUserType();
    return userType === "curator"
      ? curatorService.markAllNotificationsRead()
      : providerDashboardService.markAllNotificationsRead();
  },

  /**
   * Delete single notification
   * Curator: DELETE /curator/notifications/:id
   * Provider: DELETE /api/provider/notifications/:id (NOT IMPLEMENTED - using dummy)
   */
  deleteNotification: async (id: string | number): Promise<void> => {
    const userType = getUserType();
    if (userType === "curator") {
      return curatorService.deleteNotification(id);
    } else {
      // Provider dashboard delete endpoint not yet implemented in backend
      // Using dummy implementation for now
      return (
        providerDashboardService.deleteNotification?.(id) ?? Promise.resolve()
      );
    }
  },

  /**
   * Clear all notifications
   * Curator: DELETE /curator/notifications
   * Provider: DELETE /api/provider/notifications
   */
  clearAllNotifications: async (): Promise<void> => {
    const userType = getUserType();
    if (userType === "curator") {
      return curatorService.clearAllNotifications();
    } else {
      return providerDashboardService.clearAllNotifications();
    }
  },

  /**
   * Send notification - Curator only
   * Curator: POST /curator/notifications/send
   * Provider: Not allowed (curator-only feature)
   * Provider: ❌ Not allowed (curator-only feature)
   */
  sendNotification: async (data: SendNotificationRequest): Promise<void> => {
    const userType = getUserType();
    if (userType === "curator") {
      return curatorService.sendNotification(data);
    }
    throw new Error(
      "Providers cannot send notifications - curator only feature",
    );
  },
};
