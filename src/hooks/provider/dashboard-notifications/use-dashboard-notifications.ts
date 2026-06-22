"use client";

import { useCallback } from "react";
import { useAtom } from "jotai";
import { useQueryClient } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/lib/constants/infra/query-keys";
import { providerNotificationListAtom } from "@/atoms/notification";
import {
  useMarkNotificationReadMutation,
  useMarkAllNotificationsReadMutation,
  useDeleteNotificationMutation,
  useClearNotificationsMutation,
} from "@/hooks/queries/use-notifications-mutations";
import type { ProviderNotification } from "@/lib/types/entities/notification";

export function useProviderDashboardNotifications() {
  const [notifications, setNotifications] = useAtom(
    providerNotificationListAtom,
  );
  const queryClient = useQueryClient();

  const markReadMutation = useMarkNotificationReadMutation();
  const markAllReadMutation = useMarkAllNotificationsReadMutation();
  const deleteMutation = useDeleteNotificationMutation();
  const clearMutation = useClearNotificationsMutation();

  const unreadCount = notifications.filter((n) => n.unread).length;

  const markAllRead = useCallback(async () => {
    setNotifications((prev: ProviderNotification[]) =>
      prev.map((n) => ({ ...n, read: true, unread: false })),
    );
    await markAllReadMutation.mutateAsync();
    await queryClient.invalidateQueries({
      queryKey: [QUERY_KEYS.providers, "notifications"],
    });
  }, [setNotifications, markAllReadMutation, queryClient]);

  const markOneRead = useCallback(
    async (id: string | number) => {
      setNotifications((prev: ProviderNotification[]) =>
        prev.map((n) =>
          n.notificationId === id ? { ...n, read: true, unread: false } : n,
        ),
      );
      if (typeof id === "string") {
        await markReadMutation.mutateAsync(id);
      }
      await queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.providers, "notifications"],
      });
    },
    [setNotifications, markReadMutation, queryClient],
  );

  const clearAllNotifications = useCallback(async () => {
    setNotifications([]);
    await clearMutation.mutateAsync();
    await queryClient.invalidateQueries({
      queryKey: [QUERY_KEYS.providers, "notifications"],
    });
  }, [setNotifications, clearMutation, queryClient]);

  const deleteNotification = useCallback(
    async (id: string | number) => {
      setNotifications((prev: ProviderNotification[]) =>
        prev.filter((n) => n.notificationId !== id),
      );
      await deleteMutation.mutateAsync(id);
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: [QUERY_KEYS.providers, "notifications"],
        }),
        queryClient.refetchQueries({
          queryKey: [QUERY_KEYS.providers, "notifications"],
        }),
      ]);
    },
    [setNotifications, deleteMutation, queryClient],
  );

  return {
    notifications,
    setNotifications,
    unreadCount,
    markAllRead,
    markOneRead,
    clearAllNotifications,
    deleteNotification,
    isMarkingRead: markReadMutation.isPending,
    isMarkingAllRead: markAllReadMutation.isPending,
    isDeleting: deleteMutation.isPending,
    isClearing: clearMutation.isPending,
  };
}
