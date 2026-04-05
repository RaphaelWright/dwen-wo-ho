"use client";

import { useEffect, useCallback, useState } from "react";
import { useAtom } from "jotai";
import { toast } from "@/components/ui/sonner";
import { useRouter } from "next/navigation";
import {
  curatorNotificationListAtom,
  isCuratorNotificationSheetOpenAtom,
  providerNotificationListAtom,
  isProviderNotificationSheetOpenAtom,
} from "@/atoms/notification";
import { unreadCountAtom } from "@/atoms/websocket";
import { NewNotificationEvent } from "@/lib/types/websocket";
import { BackendNotification } from "@/lib/types/api/shared";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/lib/constants/query-keys";
import { providerDashboardService } from "@/services/provider-dashboard";
import { curatorService } from "@/services/curator";
import { getUserType } from "@/lib/utils/getUserType";

export function useNotificationWebSocket() {
  const userType = getUserType();

  // Use role-specific atoms
  const [curatorNotifications, setCuratorNotifications] = useAtom(
    curatorNotificationListAtom,
  );
  const [providerNotifications, setProviderNotifications] = useAtom(
    providerNotificationListAtom,
  );
  const [, setCuratorSheetOpen] = useAtom(isCuratorNotificationSheetOpenAtom);
  const [, setProviderSheetOpen] = useAtom(isProviderNotificationSheetOpenAtom);

  // Select the appropriate atoms based on role
  const notifications =
    userType === "curator" ? curatorNotifications : providerNotifications;
  const setNotifications =
    userType === "curator" ? setCuratorNotifications : setProviderNotifications;
  const setSheetOpen =
    userType === "curator" ? setCuratorSheetOpen : setProviderSheetOpen;
  const [unreadCount, setUnreadCount] = useAtom(unreadCountAtom);
  const [initialLoadComplete, setInitialLoadComplete] = useState(false);
  const router = useRouter();
  const queryClient = useQueryClient();

  // Determine correct service and query key based on role (already have userType above)
  const queryKey =
    userType === "curator"
      ? [QUERY_KEYS.curator, "notifications"]
      : [QUERY_KEYS.providers, "notifications"];

  const queryFn =
    userType === "curator"
      ? curatorService.getNotifications
      : () => providerDashboardService.getNotifications();

  // Initial load of notification history via HTTP (role-aware)
  const { data: initialNotifications } = useQuery({
    queryKey,
    queryFn,
    staleTime: 5 * 60 * 1000, // 5 minutes
    enabled: !!userType,
  });

  // Seed notifications from HTTP on initial load
  useEffect(() => {
    if (initialNotifications?.notifications && !initialLoadComplete) {
      const mapped = initialNotifications.notifications.map(
        (n: BackendNotification) => ({
          id: n.notificationId,
          type: mapNotificationType(n.category),
          message: n.text,
          title: n.targetName,
          link: `/provider/patients/${n.targetId}`,
          timestamp: new Date(n.timestamp),
          read: !n.unread,
        }),
      );
      setNotifications(mapped);
      setUnreadCount(initialNotifications.unreadCount);
      setInitialLoadComplete(true);
    }
  }, [
    initialNotifications,
    setNotifications,
    setUnreadCount,
    initialLoadComplete,
  ]);

  const handleNotification = useCallback(
    (event: CustomEvent<NewNotificationEvent>) => {
      const { notification, unreadCount: newUnreadCount } = event.detail;

      // Map backend notification to frontend format
      const newNotif = {
        id: notification.notificationId,
        type: mapNotificationType(notification.category),
        message: notification.text,
        title: notification.targetName,
        link: `/provider/patients/${notification.targetId}`,
        timestamp: new Date(notification.timestamp),
        read: !notification.unread,
      };

      // Add to atom (prepend for newest first)
      setNotifications((prev) => [newNotif, ...prev]);
      setUnreadCount(newUnreadCount);

      // Invalidate TanStack Query cache
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.providers, "notifications"],
      });

      // Show toast
      const toastFn =
        newNotif.type === "success"
          ? toast.success
          : newNotif.type === "error"
            ? toast.error
            : toast.info;

      toastFn(notification.targetName, {
        description: notification.text,
        action: `/provider/patients/${notification.targetId}`
          ? {
              label: "View",
              onClick: () => {
                router.push(
                  `/provider/patients/${notification.targetId}` as `/provider/patients/${string}`,
                );
              },
            }
          : undefined,
      });

      // Open notification sheet briefly
      setTimeout(() => setSheetOpen(true), 500);
    },
    [
      setNotifications,
      setUnreadCount,
      setSheetOpen,
      router,
      queryClient,
      userType,
    ],
  );

  const handleUnreadCountChange = useCallback(
    (event: CustomEvent<{ unreadCount: number }>) => {
      setUnreadCount(event.detail.unreadCount);
    },
    [setUnreadCount],
  );

  useEffect(() => {
    // Listen for WebSocket events
    window.addEventListener(
      "ws:notification",
      handleNotification as EventListener,
    );
    window.addEventListener(
      "ws:unread-count",
      handleUnreadCountChange as EventListener,
    );

    return () => {
      window.removeEventListener(
        "ws:notification",
        handleNotification as EventListener,
      );
      window.removeEventListener(
        "ws:unread-count",
        handleUnreadCountChange as EventListener,
      );
    };
  }, [handleNotification, handleUnreadCountChange]);

  return {
    notifications,
    unreadCount,
    userType,
  };
}

// Map backend notification type to frontend notification type
function mapNotificationType(type: string): "success" | "error" | "info" {
  switch (type) {
    case "PATIENT_REFERRED":
    case "STAR_PROVIDER_ASSIGNED":
    case "PATIENT_LOCK_IN":
      return "success";
    case "CRITICAL_ALERT":
      return "error";
    case "PROVIDER_APPLICATION_UPDATE":
    default:
      return "info";
  }
}
