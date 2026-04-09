"use client";

import { useAtom, useSetAtom } from "jotai";

import { useCallback } from "react";

import { useRouter } from "next/navigation";

import { toast } from "@/components/ui/sonner";

import {
  curatorNotificationListAtom,
  isCuratorNotificationSheetOpenAtom,
} from "@/atoms/notification";

import { CuratorNotification } from "@/lib/types/notification";

import {
  useClearNotificationsMutation,
  useMarkNotificationReadMutation,
  useMarkAllNotificationsReadMutation,
  useDeleteNotificationMutation,
} from "@/hooks/queries/use-notifications-mutations";

export const useCuratorNotification = () => {
  const [notifications, setNotifications] = useAtom(
    curatorNotificationListAtom,
  );

  const setIsOpen = useSetAtom(isCuratorNotificationSheetOpenAtom);

  const router = useRouter();

  const clearMutation = useClearNotificationsMutation();

  const markReadMutation = useMarkNotificationReadMutation();

  const markAllReadMutation = useMarkAllNotificationsReadMutation();

  const deleteMutation = useDeleteNotificationMutation();

  const openSheet = useCallback(() => setIsOpen(true), [setIsOpen]);

  const closeSheet = useCallback(() => setIsOpen(false), [setIsOpen]);

  const toggleSheet = useCallback(
    () => setIsOpen((prev) => !prev),

    [setIsOpen],
  );

  const addNotification = useCallback(
    (type: "success" | "error" | "info", message: string, link?: string) => {
      const id = `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;

      // Map toast types to CuratorNotification structure
      const notificationTypeMap: Record<string, string> = {
        success: "ADMIN_ACTION_REQUIRED",
        error: "CRITICAL_ALERT",
        info: "PROVIDER_REGISTRATION",
      };

      const newNotification: CuratorNotification = {
        id,
        type: notificationTypeMap[type] as CuratorNotification["type"],
        title: type.charAt(0).toUpperCase() + type.slice(1),
        message,
        createdAt: new Date().toISOString(),
        relatedEntityId: id,
        relatedEntityType: "notification",
        action: "",
        notification: message,
        emoji: type === "success" ? "✅" : type === "error" ? "⚠️" : "ℹ️",
        schoolId: 0,
        read: false,
        link: link as CuratorNotification["link"],
      };

      setNotifications((prev) => [newNotification, ...prev]);

      // Add a slight delay before opening the sheet so the toast appears first

      setTimeout(() => {
        setIsOpen(true);
      }, 500);

      type === "success"
        ? toast.success(message, {
            action: {
              label: "Open",

              onClick: () => {
                // Mark as read when interacted with from the toast

                setNotifications((prev) =>
                  prev.map((n) => (n.id === id ? { ...n, read: true } : n)),
                );

                if (link) {
                  router.push(link as any);
                } else {
                  setIsOpen(true);
                }
              },
            },
          })
        : type === "error"
          ? toast.error(message, {
              action: {
                label: "Open",

                onClick: () => {
                  // Mark as read when interacted with from the toast

                  setNotifications((prev) =>
                    prev.map((n) => (n.id === id ? { ...n, read: true } : n)),
                  );

                  if (link) {
                    router.push(link as any);
                  } else {
                    setIsOpen(true);
                  }
                },
              },
            })
          : toast.info(message, {
              action: {
                label: "Open",

                onClick: () => {
                  // Mark as read when interacted with from the toast

                  setNotifications((prev) =>
                    prev.map((n) => (n.id === id ? { ...n, read: true } : n)),
                  );

                  if (link) {
                    router.push(link as any);
                  } else {
                    setIsOpen(true);
                  }
                },
              },
            });
    },

    [setNotifications, setIsOpen, router],
  );

  const clearNotifications = useCallback(() => {
    setNotifications([]);

    clearMutation.mutate();
  }, [setNotifications, clearMutation]);

  const dismissNotification = useCallback(
    (id: string | number) => {
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    },

    [setNotifications],
  );

  const markAsRead = useCallback(
    (id: string | number) => {
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, read: true } : n)),
      );

      if (typeof id === "string") markReadMutation.mutate(id);
    },

    [setNotifications, markReadMutation],
  );

  const markAllAsRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));

    markAllReadMutation.mutate();
  }, [setNotifications, markAllReadMutation]);

  const deleteNotification = useCallback(
    (id: string | number) => {
      setNotifications((prev) => prev.filter((n) => n.id !== id));

      deleteMutation.mutate(id);
    },

    [setNotifications, deleteMutation],
  );

  const unreadCount = notifications.filter((n) => !n.read).length;

  return {
    notifications,

    addNotification,

    clearNotifications,

    dismissNotification,

    markAsRead,

    markAllAsRead,

    deleteNotification,

    unreadCount,

    setIsOpen,

    openSheet,

    closeSheet,

    toggleSheet,

    // Loading states for UI feedback
    isMarkingRead: markReadMutation.isPending,
    isMarkingAllRead: markAllReadMutation.isPending,
    isDeleting: deleteMutation.isPending,
    isClearing: clearMutation.isPending,
  };
};
