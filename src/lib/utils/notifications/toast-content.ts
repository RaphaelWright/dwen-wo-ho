import type {
  CuratorNotification,
  ProviderNotification,
} from "@/lib/types/entities/notification";
import type { NotificationToastContent } from "@/lib/types/notifications/toast-content";
import type { NotificationUserType } from "@/lib/types/notifications/ws-handler";

export function getNotificationToastContent(
  notification: CuratorNotification | ProviderNotification,
  userType: NotificationUserType,
): NotificationToastContent {
  if (userType === "curator") {
    const curatorNotif = notification as CuratorNotification;
    return {
      title: curatorNotif.title,
      description: curatorNotif.message,
      type: curatorNotif.type === "CRITICAL_ALERT" ? "error" : "info",
    };
  }

  const providerNotif = notification as ProviderNotification;
  const notifType = providerNotif.category || "";

  return {
    title: providerNotif.targetName || "Notification",
    description: providerNotif.text || "",
    type:
      notifType !== "STAR_PROVIDER_ASSIGNED" &&
      notifType !== "NEW_PATIENT_ADDED"
        ? "error"
        : "info",
  };
}
