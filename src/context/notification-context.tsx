"use client";

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
} from "react";
import { Notification } from "@/components/curator/ui/notification-sheet";

interface NotificationContextType {
  notifications: Notification[];
  addNotification: (type: Notification["type"], message: string) => void;
  clearNotifications: () => void;
  dismissNotification: (id: string) => void;
  unreadCount: number;
}

const NotificationContext = createContext<NotificationContextType | undefined>(
  undefined,
);

export const NotificationProvider = ({ children }: { children: ReactNode }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const addNotification = useCallback(
    (type: Notification["type"], message: string) => {
      setNotifications((prev) => [
        {
          id: `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
          type,
          message,
          timestamp: new Date(),
        },
        ...prev,
      ]);
    },
    [],
  );

  const clearNotifications = useCallback(() => {
    setNotifications([]);
  }, []);

  const dismissNotification = useCallback((id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);

  const value = {
    notifications,
    addNotification,
    clearNotifications,
    dismissNotification,
    unreadCount: notifications.length,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error(
      "useNotification must be used within a NotificationProvider",
    );
  }
  return context;
};
