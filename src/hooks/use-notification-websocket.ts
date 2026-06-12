"use client";

import { useEffect, useCallback } from "react";
import { useAtom } from "jotai";
import { toast } from "@/lib/utils/toast";
import { useRouter } from "next/navigation";
import {
  curatorNotificationListAtom,
  isCuratorNotificationSheetOpenAtom,
  providerNotificationListAtom,
  isProviderNotificationSheetOpenAtom,
} from "@/atoms/notification";
import { unreadCountAtom } from "@/atoms/websocket";
import { NewNotificationEvent } from "@/lib/types/websocket";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/lib/constants/query-keys";
import { providerDashboardService } from "@/services/provider-dashboard";
import { curatorService } from "@/services/curator";
import { getUserType } from "@/lib/utils/getUserType";
import {
  CuratorNotification,
  CuratorNotificationListResponse,
  ProviderNotification,
  ProviderNotificationListResponse,
} from "@/lib/types/notification";
import {
  getCuratorNotificationRoute,
  getProviderNotificationRoute,
} from "@/lib/config/notification-routing";
import { Route } from "next";
import { usePathname } from "next/navigation";

export function useNotificationWebSocket() {
  const pathname = usePathname();
  // Re-evaluate user type when route changes (e.g. after login)
  void pathname;
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
  const setSheetOpen =
    userType === "curator" ? setCuratorSheetOpen : setProviderSheetOpen;
  const [unreadCount, setUnreadCount] = useAtom(unreadCountAtom);
  const router = useRouter();
  const queryClient = useQueryClient();

  // Separate queries for each role to maintain type safety
  const { data: curatorData, refetch: refetchCurator } = useQuery<
    CuratorNotificationListResponse,
    Error
  >({
    queryKey: [QUERY_KEYS.curator, "notifications"],
    queryFn: () => curatorService.getNotifications(),
    staleTime: 5 * 60 * 1000,
    enabled: userType === "curator",
  });

  const { data: providerData, refetch: refetchProvider } = useQuery<
    ProviderNotificationListResponse,
    Error
  >({
    queryKey: [QUERY_KEYS.providers, "notifications"],
    queryFn: () => providerDashboardService.getNotifications(),
    staleTime: 5 * 60 * 1000,
    enabled: userType === "provider",
  });

  const initialNotifications =
    userType === "curator" ? curatorData?.data?.items : providerData?.items;

  // Seed notifications from HTTP on initial load and when data changes
  useEffect(() => {
    if (!initialNotifications) return;

    // Map based on user type since curator and provider have different formats
    if (userType === "curator") {
      setCuratorNotifications(initialNotifications as CuratorNotification[]);
      setUnreadCount(curatorData?.data?.unreadCount || 0);
    } else {
      setProviderNotifications(initialNotifications as ProviderNotification[]);
      setUnreadCount(providerData?.unreadCount || 0);
    }
  }, [
    initialNotifications,
    setCuratorNotifications,
    setProviderNotifications,
    setUnreadCount,
    userType,
    curatorData?.data?.unreadCount,
    providerData?.unreadCount,
  ]);

  const handleNotification = useCallback(
    (event: unknown) => {
      console.log(`[NotificationWebSocket] 📥 Received ws:notification`, event);
      if (typeof event !== "object" || event === null) return;

      const eventObj =
        userType === "curator"
          ? (event as CustomEvent<NewNotificationEvent<CuratorNotification>>)
          : (event as CustomEvent<NewNotificationEvent<ProviderNotification>>);

      if (!eventObj.detail?.notification) return;

      const { notification, unreadCount: newUnreadCount } = eventObj.detail;

      // Generate route based on action field
      const link =
        userType === "curator"
          ? getCuratorNotificationRoute(notification as CuratorNotification)
          : getProviderNotificationRoute(notification as ProviderNotification);

      const newNotif = {
        ...notification,
        link: link,
      };

      // Add to atom (prepend for newest first)
      // Using unknown cast since newNotif has a UI-specific format different from API types
      if (userType === "curator") {
        setCuratorNotifications((prev) => [
          newNotif as CuratorNotification,
          ...prev,
        ]);
      } else {
        setProviderNotifications((prev) => [
          newNotif as ProviderNotification,
          ...prev,
        ]);
      }
      setUnreadCount(newUnreadCount);

      // Invalidate TanStack Query cache for the correct role
      if (userType === "curator") {
        queryClient.invalidateQueries({
          queryKey: [QUERY_KEYS.curator, "notifications"],
        });
      } else {
        queryClient.invalidateQueries({
          queryKey: [QUERY_KEYS.providers, "notifications"],
        });
      }

      // Show toast - handle different notification shapes
      let toastTitle: string;
      let toastDescription: string;
      let toastType: "success" | "error" | "info";

      if (userType === "curator") {
        const curatorNotif = notification as CuratorNotification;
        toastTitle = curatorNotif.title;
        toastDescription = curatorNotif.message;
        toastType = curatorNotif.type === "CRITICAL_ALERT" ? "error" : "info";
      } else {
        const providerNotif = notification as ProviderNotification;
        // Use the transformed notification fields directly
        toastTitle = providerNotif.targetName || "Notification";
        toastDescription = providerNotif.text || "";
        const notifType = providerNotif.category || "";

        toastType =
          notifType !== "STAR_PROVIDER_ASSIGNED" &&
          notifType !== "NEW_PATIENT_ADDED"
            ? "error"
            : "info";
      }

      const toastFn = toastType === "error" ? toast.error : toast.info;

      toastFn(toastTitle, {
        description: toastDescription,
        duration: 5000, // 5 seconds
        action: link
          ? {
              label: "View",
              onClick: () => {
                if (link) router.push(link as Route);
              },
            }
          : undefined,
      });

      // Immediately refetch ALL active queries so dashboard, patient list,
      // schools sidebar and urgent panel all update in real-time.
      // refetchQueries({ type: "active" }) bypasses staleTime entirely.
      console.log(
        "[NotificationWebSocket] Triggering global refetch after notification...",
      );
      queryClient.refetchQueries({ type: "active" });

      // Open notification sheet briefly
      setTimeout(() => setSheetOpen(true), 500);
    },
    [
      setCuratorNotifications,
      setProviderNotifications,
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

  const handleReconnect = useCallback(() => {
    console.log(
      "[NotificationWebSocket] Reconnect detected - re-fetching notifications",
    );
    // Re-fetch notifications from REST API
    if (userType === "curator") {
      refetchCurator();
    } else if (userType === "provider") {
      refetchProvider();
    }
  }, [userType, refetchCurator, refetchProvider]);

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
    window.addEventListener("ws:reconnect", handleReconnect as EventListener);

    return () => {
      window.removeEventListener(
        "ws:notification",
        handleNotification as EventListener,
      );
      window.removeEventListener(
        "ws:unread-count",
        handleUnreadCountChange as EventListener,
      );
      window.removeEventListener(
        "ws:reconnect",
        handleReconnect as EventListener,
      );
    };
  }, [handleNotification, handleUnreadCountChange, handleReconnect]);

  return {
    notifications,
    unreadCount,
    userType,
  };
}
