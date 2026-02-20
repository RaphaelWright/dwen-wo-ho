"use client";

import { useAtom } from "jotai";
import { useCallback } from "react";
import { toast } from "@/components/ui/sonner";
import {
  notificationsAtom,
  notificationSheetOpenAtom,
} from "@/atoms/notification";
import { Notification } from "@/lib/types/notification";

export const useNotification = () => {
  const [notifications, setNotifications] = useAtom(notificationsAtom);
  const [isOpen, setIsOpen] = useAtom(notificationSheetOpenAtom);

  const openSheet = useCallback(() => setIsOpen(true), [setIsOpen]);
  const closeSheet = useCallback(() => setIsOpen(false), [setIsOpen]);
  const toggleSheet = useCallback(
    () => setIsOpen((prev) => !prev),
    [setIsOpen],
  );

  const addNotification = useCallback(
    (type: Notification["type"], message: string) => {
      setNotifications((prev) => [
        {
          id: `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
          type,
          message,
          timestamp: new Date(),
          read: false,
        },
        ...prev,
      ]);

      toast.info(message, {
        action: {
          label: "Open",
          onClick: () => setIsOpen(true),
        },
      });
    },
    [setNotifications, setIsOpen],
  );

  const clearNotifications = useCallback(() => {
    setNotifications([]);
  }, [setNotifications]);

  const dismissNotification = useCallback(
    (id: string) => {
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    },
    [setNotifications],
  );

  const markAsRead = useCallback(
    (id: string) => {
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
