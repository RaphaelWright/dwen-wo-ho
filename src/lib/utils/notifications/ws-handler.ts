import type { Route } from "next";
import type {
  CuratorNotification,
  ProviderNotification,
} from "@/lib/types/entities/notification";
import { NewNotificationEvent } from "@/lib/types/entities/websocket";
import type {
  NotificationUserType,
  ParsedWsNotification,
} from "@/lib/types/notifications/ws-handler";
import {
  getCuratorNotificationRoute,
  getProviderNotificationRoute,
} from "@/lib/config/notification-routing";

export type { NotificationUserType, ParsedWsNotification };

export function parseWsNotificationEvent(
  event: unknown,
  userType: NotificationUserType,
): ParsedWsNotification | null {
  if (typeof event !== "object" || event === null) return null;

  const eventObj =
    userType === "curator"
      ? (event as CustomEvent<NewNotificationEvent<CuratorNotification>>)
      : (event as CustomEvent<NewNotificationEvent<ProviderNotification>>);

  if (!eventObj.detail?.notification) return null;

  const { notification, unreadCount } = eventObj.detail;

  const link =
    userType === "curator"
      ? getCuratorNotificationRoute(notification as CuratorNotification)
      : getProviderNotificationRoute(notification as ProviderNotification);

  return {
    notification: {
      ...notification,
      link: link as Route | undefined,
    },
    unreadCount,
    link,
  };
}
