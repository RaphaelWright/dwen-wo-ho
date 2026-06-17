"use client";

import { useState, useMemo } from "react";
import { useAtomValue } from "jotai";
import * as Dialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { useNotificationItemAction } from "@/hooks/components/shared/notification/use-notification-item-action";
import type {
  NotificationFilterType,
  NotificationsSheetProps,
} from "@/lib/types/components/shared/notification-sheet";
import { NotificationSheetHeader } from "./notification-sheet-header";
import { NotificationFilterTabs } from "./notification-filter-tabs";
import { NotificationSheetList } from "./notification-sheet-list";

export default function NotificationsSheet<N>({
  notifications,
  openAtom,
  onOpenChange,
  markAllRead,
  markOneRead,
  deleteOne,
  clearAllNotifications,
  onNavigate,
  isLoading = false,
  getNotificationActionUrl,
  isMarkingAllRead = false,
  isClearing = false,
  getNotificationId,
  isNotificationUnread,
  getAvatarUrl,
  getEmoji,
  getTitle,
  getText,
  getTimestamp,
}: NotificationsSheetProps<N>) {
  const open = useAtomValue(openAtom);
  const [filter, setFilter] = useState<NotificationFilterType>("all");
  const { getItemStatus, runWithActiveNotif } = useNotificationItemAction();

  const unreadCount = notifications.filter((n) =>
    isNotificationUnread(n),
  ).length;

  const readCount = notifications.filter(
    (n) => !isNotificationUnread(n),
  ).length;

  const filteredNotifications = useMemo(() => {
    switch (filter) {
      case "unread":
        return notifications.filter((n) => isNotificationUnread(n));
      case "read":
        return notifications.filter((n) => !isNotificationUnread(n));
      default:
        return notifications;
    }
  }, [notifications, filter, isNotificationUnread]);

  const handleMarkRead = (notifId: string | number) => {
    runWithActiveNotif(notifId, "mark-read", () => markOneRead(notifId));
  };

  const handleDelete = (notifId: string | number) => {
    if (!deleteOne) return;
    runWithActiveNotif(notifId, "delete", () => deleteOne(notifId));
  };

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 bg-black/50" />

        <Dialog.Content
          aria-label="Notifications"
          className="bg-background data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right fixed inset-y-0 right-0 z-50 flex w-100 max-w-[90vw] flex-col border-l p-0 shadow-lg data-[state=closed]:duration-150 data-[state=open]:duration-150 sm:max-w-sm"
        >
          <Dialog.Title className="sr-only">Notifications</Dialog.Title>

          <Dialog.Close asChild>
            <button
              type="button"
              className="bg-background hover:bg-muted group absolute top-2 right-2 z-50 flex size-7 items-center justify-center rounded-full border shadow-sm transition-all hover:scale-110"
            >
              <X className="text-destructive size-4" />
              <span className="sr-only">Close</span>
            </button>
          </Dialog.Close>

          <div className="mt-4 flex shrink-0 flex-col gap-1.5 border-b px-5 pt-5 pb-4">
            <NotificationSheetHeader />
            <NotificationFilterTabs
              filter={filter}
              onFilterChange={setFilter}
              totalCount={notifications.length}
              unreadCount={unreadCount}
              readCount={readCount}
              unreadCountForActions={unreadCount}
              hasNotifications={notifications.length > 0}
              markAllRead={markAllRead}
              clearAllNotifications={clearAllNotifications}
              isMarkingAllRead={isMarkingAllRead}
              isClearing={isClearing}
            />
          </div>

          <NotificationSheetList
            notifications={filteredNotifications}
            filter={filter}
            isLoading={isLoading}
            getNotificationId={getNotificationId}
            isNotificationUnread={isNotificationUnread}
            getNotificationActionUrl={getNotificationActionUrl}
            getItemStatus={getItemStatus}
            onMarkRead={handleMarkRead}
            onDelete={deleteOne ? handleDelete : undefined}
            onNavigate={onNavigate}
            markOneRead={markOneRead}
            getAvatarUrl={getAvatarUrl}
            getEmoji={getEmoji}
            getTitle={getTitle}
            getText={getText}
            getTimestamp={getTimestamp}
          />
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
