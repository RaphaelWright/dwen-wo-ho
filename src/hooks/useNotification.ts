"use client";

import { useAtom } from "jotai";
import { useCallback } from "react";
import { useRouter } from "next/navigation";
import { toast } from "@/components/ui/sonner";
import {
  notificationsAtom,
  notificationSheetOpenAtom,
} from "@/atoms/notification";
import { Notification } from "@/lib/types/notification";

export const useNotification = () => {
  const [notifications, setNotifications] = useAtom(notificationsAtom);
  const [isOpen, setIsOpen] = useAtom(notificationSheetOpenAtom);
  const router = useRouter();

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
  }, [setNotifications]);

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
    },
    [setNotifications],
  );

  const markAllAsRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }, [setNotifications]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  return {
    notifications,
    addNotification,
    clearNotifications,
    dismissNotification,
    markAsRead,
    markAllAsRead,
    unreadCount,
    isOpen,
    setIsOpen,
    openSheet,
    closeSheet,
    toggleSheet,
  };
};
