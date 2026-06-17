"use client";

import { NotificationSkeleton } from "../notification-skeleton";
import NotifItem from "../notification-item";
import type { NotificationSheetListProps } from "@/lib/types/components/shared/notification-sheet";

export function NotificationSheetList<N>({
  notifications,
  filter,
  isLoading,
  getNotificationId,
  isNotificationUnread,
  getNotificationActionUrl,
  getItemStatus,
  onMarkRead,
  onDelete,
  onNavigate,
  markOneRead,
  getAvatarUrl,
  getEmoji,
  getTitle,
  getText,
  getTimestamp,
}: NotificationSheetListProps<N>) {
  return (
    <div className="no-scrollbar min-h-0 flex-1 overflow-y-auto px-4">
      <div className="flex flex-col gap-2 py-4">
        {isLoading ? (
          <NotificationSkeleton count={5} />
        ) : notifications.length === 0 ? (
          <div className="text-muted-foreground py-8 text-center text-sm">
            {filter === "unread"
              ? "No unread notifications"
              : filter === "read"
                ? "No read notifications"
                : "No notifications"}
          </div>
        ) : (
          notifications.map((n, i) => {
            const notifId = getNotificationId(n);
            return (
              <NotifItem
                key={notifId ? `notif-${notifId}` : `notif-idx-${i}`}
                notif={n}
                isUnread={isNotificationUnread(n)}
                status={getItemStatus(notifId)}
                onMarkRead={() => {
                  if (notifId) onMarkRead(notifId);
                }}
                onDelete={
                  onDelete && notifId ? () => onDelete(notifId) : undefined
                }
                onClick={() => {
                  onNavigate?.(getNotificationActionUrl(n));
                  if (notifId) markOneRead(notifId);
                }}
                getAvatarUrl={
                  getAvatarUrl as (n: unknown) => string | null | undefined
                }
                getEmoji={getEmoji as (n: unknown) => string | undefined}
                getTitle={getTitle as (n: unknown) => string | undefined}
                getText={getText as (n: unknown) => string | undefined}
                getTimestamp={
                  getTimestamp as (n: unknown) => string | undefined
                }
              />
            );
          })
        )}
      </div>
    </div>
  );
}
