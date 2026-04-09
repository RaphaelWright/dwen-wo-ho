"use client";

import { useEffect, useCallback } from "react";
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

export function useNotificationWebSocket() {
  const userType = getUserType();

  // Use role-specific atoms
  const [curatorNotifications, setCuratorNotifications] = useAtom(
    curatorNotificationListAtom,
  );
  const [providerNotifications, setProviderNotifications] = useAtom(
    providerNotificationListAtom,
  );
  const [curatorSheetOpen, setCuratorSheetOpen] = useAtom(
    isCuratorNotificationSheetOpenAtom,
  );
  const [providerSheetOpen, setProviderSheetOpen] = useAtom(
    isProviderNotificationSheetOpenAtom,
  );

  // Select the appropriate atoms based on role
  const notifications =
    userType === "curator" ? curatorNotifications : providerNotifications;
  const setSheetOpen =
    userType === "curator" ? setCuratorSheetOpen : setProviderSheetOpen;
  const [unreadCount, setUnreadCount] = useAtom(unreadCountAtom);
  const router = useRouter();
  const queryClient = useQueryClient();

  // Separate queries for each role to maintain type safety
  const curatorQuery = useQuery<CuratorNotificationListResponse, Error>({
    queryKey: [QUERY_KEYS.curator, "notifications"],
    queryFn: () => curatorService.getNotifications(),
    staleTime: 5 * 60 * 1000,
    enabled: userType === "curator",
  });

  const providerQuery = useQuery<ProviderNotificationListResponse, Error>({
    queryKey: [QUERY_KEYS.providers, "notifications"],
    queryFn: () => providerDashboardService.getNotifications(),
    staleTime: 5 * 60 * 1000,
    enabled: userType === "provider",
  });

  const initialNotifications =
    userType === "curator"
      ? curatorQuery.data?.data?.items
      : providerQuery.data?.items;

  // Seed notifications from HTTP on initial load and when data changes
  useEffect(() => {
    if (!initialNotifications) return;

    // Map based on user type since curator and provider have different formats
    if (userType === "curator") {
      setCuratorNotifications(initialNotifications as CuratorNotification[]);
      setUnreadCount(curatorQuery.data?.data?.unreadCount || 0);
    } else {
      setProviderNotifications(initialNotifications as ProviderNotification[]);
      setUnreadCount(providerQuery.data?.unreadCount || 0);
    }
  }, [
    initialNotifications,
    setCuratorNotifications,
    setProviderNotifications,
    setUnreadCount,
    userType,
    curatorQuery.data?.data?.unreadCount,
    providerQuery.data?.unreadCount,
  ]);

  const handleNotification = useCallback(
    (event: unknown) => {
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

      // Invalidate TanStack Query cache
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.providers, "notifications"],
      });

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
        toastTitle = providerNotif.targetName;
        toastDescription = providerNotif.text;
        toastType =
          providerNotif.category !== "STAR_PROVIDER_ASSIGNED" &&
          providerNotif.category !== "NEW_PATIENT_ADDED"
            ? "error"
            : "info";
      }

      const toastFn = toastType === "error" ? toast.error : toast.info;

      toastFn(toastTitle, {
        description: toastDescription,
        action: link
          ? {
              label: "View",
              onClick: () => {
                if (link) router.push(link as Route);
              },
            }
          : undefined,
      });

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
