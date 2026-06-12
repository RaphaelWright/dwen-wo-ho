"use client";

import { useState, useMemo } from "react";

import { useAtomValue } from "jotai";
import type { Atom } from "jotai";

import * as Dialog from "@radix-ui/react-dialog";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import { CheckCircle, Trash2, X } from "lucide-react";

import { Spinner } from "@/components/ui/spinner";

import { cn } from "@/lib/utils";

import { NotificationSkeleton } from "./notification-skeleton";

import NotifItem, { type NotifItemStatus } from "./notification-item";

type FilterType = "all" | "unread" | "read";

// The isLoading/isMarkingRead/isDeleting/isMarkingAllRead/isClearing booleans
// are independent, concurrent async states (e.g. clearing while a single delete
// is in flight), not a single mutually-exclusive status. They are intentionally
// kept as separate flags rather than collapsed into one variant union.
interface NotificationsSheetProps<N> {
  notifications: N[];
  getNotificationActionUrl: (n: N) => string;
  openAtom: Atom<boolean>;
  onOpenChange: (open: boolean) => void;
  markAllRead: () => void;
  markOneRead: (id: string | number) => void;
  deleteOne?: (id: string | number) => void;
  clearAllNotifications: () => void;
  onNavigate?: (link: string) => void;
  isLoading?: boolean;
  isMarkingRead?: boolean;
  isDeleting?: boolean;
  isMarkingAllRead?: boolean;
  isClearing?: boolean;
  // Type-specific helpers
  getNotificationId: (n: N) => string | number | undefined;
  isNotificationUnread: (n: N) => boolean;
  getAvatarUrl: (n: N) => string | null | undefined;
  getEmoji: (n: N) => string | undefined;
  getTitle: (n: N) => string | undefined;
  getText: (n: N) => string | undefined;
  getTimestamp: (n: N) => string | undefined;
}

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
  const [filter, setFilter] = useState<FilterType>("all");
  // Track per-notification loading states as a single status union:
  // idle, marking-read:<id>, or deleting:<id>
  const [activeNotif, setActiveNotif] = useState<{
    id: string | number;
    action: "mark-read" | "delete";
  } | null>(null);

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

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        {/* Overlay — Radix handles Escape, focus trap, and aria-modal automatically */}
        <Dialog.Overlay className="data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 bg-black/50" />

        {/* Panel — slides in from right */}
        <Dialog.Content
          aria-label="Notifications"
          className="bg-background data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right fixed inset-y-0 right-0 z-50 flex w-100 max-w-[90vw] flex-col border-l p-0 shadow-lg data-[state=closed]:duration-150 data-[state=open]:duration-150 sm:max-w-sm"
        >
          {/* Hidden title for screen readers */}
          <Dialog.Title className="sr-only">Notifications</Dialog.Title>

          {/* Visible close button */}
          <Dialog.Close asChild>
            <button
              type="button"
              className="bg-background hover:bg-muted group absolute top-2 right-2 z-50 flex size-7 items-center justify-center rounded-full border shadow-sm transition-all hover:scale-110"
            >
              <X className="text-destructive size-4" />
              <span className="sr-only">Close</span>
            </button>
          </Dialog.Close>

          {/* Header */}
          <div className="mt-4 flex shrink-0 flex-col gap-1.5 border-b px-5 pt-5 pb-4">
            <div className="flex items-center gap-3">
              <h2 className="flex-1 text-[16px] font-bold">Notifications</h2>
            </div>

            <div className="flex items-center justify-between gap-2">
              {/* Filter tabs */}
              <div className="bg-muted/50 flex w-fit items-center gap-1 rounded-lg p-1">
                <FilterTab
                  active={filter === "all"}
                  onClick={() => setFilter("all")}
                  count={notifications.length}
                  label="All"
                />
                <FilterTab
                  active={filter === "unread"}
                  onClick={() => setFilter("unread")}
                  count={unreadCount}
                  label="Unread"
                  showBadge={unreadCount > 0}
                />
                <FilterTab
                  active={filter === "read"}
                  onClick={() => setFilter("read")}
                  count={readCount}
                  label="Read"
                />
              </div>

              <div className="flex items-center justify-between gap-2">
                {unreadCount > 0 && (
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <button
                          type="button"
                          onClick={markAllRead}
                          disabled={isMarkingAllRead}
                          className="text-muted-foreground hover:bg-info/15 hover:text-info flex h-fit items-center justify-center rounded-md p-1.5 transition-colors active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          {isMarkingAllRead ? (
                            <Spinner className="size-4" />
                          ) : (
                            <CheckCircle className="size-4" />
                          )}
                        </button>
                      </TooltipTrigger>
                      <TooltipContent side="bottom" sideOffset={8}>
                        <p className="text-[10px]"> Mark all read</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                )}

                {notifications.length > 0 && (
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <button
                          type="button"
                          onClick={clearAllNotifications}
                          disabled={isClearing}
                          className="text-muted-foreground hover:bg-destructive/15 hover:text-destructive flex h-fit items-center justify-center rounded-md p-1.5 transition-colors active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          {isClearing ? (
                            <Spinner className="size-4" />
                          ) : (
                            <Trash2 className="size-4" />
                          )}
                        </button>
                      </TooltipTrigger>
                      <TooltipContent side="bottom" sideOffset={8}>
                        <p className="text-[10px]">Clear all</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                )}
              </div>
            </div>
          </div>

          {/* List */}
          <div className="no-scrollbar min-h-0 flex-1 overflow-y-auto px-4">
            <div className="flex flex-col gap-2 py-4">
              {isLoading ? (
                <NotificationSkeleton count={5} />
              ) : filteredNotifications.length === 0 ? (
                <div className="text-muted-foreground py-8 text-center text-sm">
                  {filter === "unread"
                    ? "No unread notifications"
                    : filter === "read"
                      ? "No read notifications"
                      : "No notifications"}
                </div>
              ) : (
                filteredNotifications.map((n, i) => {
                  const notifId = getNotificationId(n);
                  const activeAction =
                    activeNotif && activeNotif.id === notifId
                      ? activeNotif.action
                      : null;
                  const status: NotifItemStatus =
                    activeAction === "mark-read"
                      ? "marking-read"
                      : activeAction === "delete"
                        ? "deleting"
                        : "idle";
                  return (
                    <NotifItem
                      key={notifId ? `notif-${notifId}` : `notif-idx-${i}`}
                      notif={n}
                      isUnread={isNotificationUnread(n)}
                      status={status}
                      onMarkRead={() => {
                        if (notifId) {
                          setActiveNotif({ id: notifId, action: "mark-read" });
                          markOneRead(notifId);
                          setTimeout(
                            () =>
                              setActiveNotif((current) =>
                                current?.id === notifId &&
                                current?.action === "mark-read"
                                  ? null
                                  : current,
                              ),
                            3000,
                          );
                        }
                      }}
                      onDelete={
                        deleteOne && notifId
                          ? () => {
                              setActiveNotif({ id: notifId, action: "delete" });
                              deleteOne(notifId!);
                              setTimeout(
                                () =>
                                  setActiveNotif((current) =>
                                    current?.id === notifId &&
                                    current?.action === "delete"
                                      ? null
                                      : current,
                                  ),
                                3000,
                              );
                            }
                          : undefined
                      }
                      onClick={() => {
                        onNavigate?.(getNotificationActionUrl(n));
                        if (notifId) markOneRead(notifId);
                      }}
                      getAvatarUrl={
                        getAvatarUrl as (
                          n: unknown,
                        ) => string | null | undefined
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
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

function FilterTab({
  active,
  onClick,
  count,
  label,
  showBadge,
}: {
  active: boolean;
  onClick: () => void;
  count: number;
  label: string;
  showBadge?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "relative rounded-md px-3 py-1.5 text-[11px] font-semibold transition-all duration-200 ease-out",
        active
          ? "bg-background text-foreground ring-border shadow-sm ring-1"
          : "text-muted-foreground hover:text-foreground hover:bg-muted/80",
      )}
    >
      <span className="flex items-center gap-1.5">
        {label}
        {showBadge ? (
          <span
            className={cn(
              "min-w-4 rounded-full px-1.5 py-0 text-center text-[9px] font-bold",
              active
                ? "bg-primary text-primary-foreground"
                : "bg-muted-foreground/20 text-muted-foreground",
            )}
          >
            {count}
          </span>
        ) : (
          <span
            className={cn(
              "text-[10px] tabular-nums",
              active ? "text-muted-foreground" : "text-muted-foreground/50",
            )}
          >
            {count}
          </span>
        )}
      </span>
    </button>
  );
}
