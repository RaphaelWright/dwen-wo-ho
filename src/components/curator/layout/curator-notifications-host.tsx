"use client";

import type { Route } from "next";
import { useRouter } from "next/navigation";

import NotificationsSheet from "@/components/shared/notification-sheet";
import { useCuratorNotification } from "@/hooks/curator/notification/use-notification";
import { isCuratorNotificationSheetOpenAtom } from "@/atoms/notification";
import { getCuratorNotificationRoute } from "@/lib/config/notification-routing";
import type { CuratorNotification } from "@/lib/types/entities/notification";

export function CuratorNotificationsHost() {
  const router = useRouter();
  const {
    notifications,
    setIsOpen,
    markAsRead,
    markAllAsRead,
    clearNotifications,
    deleteNotification,
    isMarkingRead,
    isDeleting,
    isMarkingAllRead,
    isClearing,
  } = useCuratorNotification();

  return (
    <NotificationsSheet<CuratorNotification>
      notifications={notifications}
      openAtom={isCuratorNotificationSheetOpenAtom}
      onOpenChange={setIsOpen}
      markAllRead={markAllAsRead}
      markOneRead={markAsRead}
      deleteOne={deleteNotification}
      clearAllNotifications={clearNotifications}
      isMarkingRead={isMarkingRead}
      isDeleting={isDeleting}
      isMarkingAllRead={isMarkingAllRead}
      isClearing={isClearing}
      onNavigate={(link) => router.push(link as Route)}
      getNotificationActionUrl={(n) => getCuratorNotificationRoute(n) ?? "#"}
      getNotificationId={(n) => n.id}
      isNotificationUnread={(n) => !n.read}
      getAvatarUrl={() => undefined}
      getEmoji={(n) => n.emoji}
      getTitle={(n) => n.title}
      getText={(n) => n.message}
      getTimestamp={(n) => n.createdAt}
    />
  );
}
