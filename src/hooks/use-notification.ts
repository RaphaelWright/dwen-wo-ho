"use client";

import { useAtom } from "jotai";
import { useCallback } from "react";
import { useRouter } from "next/navigation";
import { toast } from "@/components/ui/sonner";
import {
  curatorNotificationListAtom,
  isCuratorNotificationSheetOpenAtom,
} from "@/atoms/notification";
import { Notification } from "@/lib/types/notification";
import {
  useClearNotificationsMutation,
  useMarkNotificationReadMutation,
  useMarkAllNotificationsReadMutation,
  useDeleteNotificationMutation,
} from "@/hooks/queries/use-provider";

export const useNotification = () => {
  const [notifications, setNotifications] = useAtom(
    curatorNotificationListAtom,
  );
  const [isOpen, setIsOpen] = useAtom(isCuratorNotificationSheetOpenAtom);
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
    (type: Notification["type"], message: string, link?: string) => {
      const id = `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
      const newNotification = {
        id,
        type,
        message,
        link,
        timestamp: new Date(),
        read: false,
      };
      setNotifications((prev) => [newNotification, ...prev]);
      // Add a slight delay before opening the sheet so the toast appears first
      setTimeout(() => {
        setIsOpen(true);
      }, 500);

      newNotification.type === "success"
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
        : newNotification.type === "error"
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
    isOpen,
    setIsOpen,
    openSheet,
    closeSheet,
    toggleSheet,
  };
};
