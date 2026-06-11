"use client";

import { useState, useMemo, useEffect, useRef } from "react";

import { useStore } from "jotai";
import type { Atom } from "jotai";

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

import NotifItem from "./notification-item";

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
  const [filter, setFilter] = useState<FilterType>("all");
  // Track per-notification loading states
  const [markingReadId, setMarkingReadId] = useState<string | number | null>(
    null,
  );
  const [deletingId, setDeletingId] = useState<string | number | null>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const store = useStore();

  // Zero-render animation: subscribe to atom, manipulate DOM directly
  useEffect(() => {
    const sync = () => {
      const open = store.get(openAtom);
      const panel = panelRef.current;
      const overlay = overlayRef.current;
      if (!panel || !overlay) return;

      if (open) {
        panel.classList.remove("translate-x-full");
        panel.classList.add("translate-x-0");
        overlay.classList.remove("opacity-0", "pointer-events-none");
        overlay.classList.add("opacity-100", "pointer-events-auto");
      } else {
        panel.classList.remove("translate-x-0");
        panel.classList.add("translate-x-full");
        overlay.classList.remove("opacity-100", "pointer-events-auto");
        overlay.classList.add("opacity-0", "pointer-events-none");
      }
    };
    sync();
    return store.sub(openAtom, sync);
  }, [store, openAtom]);

  // Close on Escape key
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && store.get(openAtom)) onOpenChange(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [store, openAtom, onOpenChange]);

  // Select the appropriate notification item component based on variant

  const NotificationItem = NotifItem;

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
    <>
      {/* Overlay */}
      <div
        ref={overlayRef}
        aria-hidden
        onClick={() => onOpenChange(false)}
        className="fixed inset-0 z-50 bg-black/50 transition-opacity duration-150 ease-out opacity-0 pointer-events-none"
      />

      {/* Panel */}
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label="Notifications"
        className="fixed inset-y-0 right-0 z-50 w-100 max-w-[90vw] sm:max-w-sm bg-background border-l shadow-lg flex flex-col p-0 will-change-[translate] translate-x-full transition-[translate] duration-150 ease-[cubic-bezier(0.32,0.72,0,1)]"
      >
        <button
          type="button"
          onClick={() => onOpenChange(false)}
          className="absolute right-2 top-2 size-7 rounded-full border bg-background flex items-center justify-center shadow-sm transition-all hover:scale-110 hover:bg-muted group z-50"
        >
          <X className="size-4 text-destructive" />

          <span className="sr-only">Close</span>
        </button>

        {/* Header */}

        <div className="px-5 pt-5 pb-4 border-b shrink-0 mt-4 flex flex-col gap-1.5">
          <div className="flex items-center gap-3">
            <h2 className="text-[16px] font-bold flex-1">Notifications</h2>
          </div>

          <div className="flex justify-between items-center gap-2">
            {/* Filter tabs */}

            <div className="flex items-center gap-1 p-1 bg-muted/50 rounded-lg w-fit">
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

            <div className="flex justify-between items-center gap-2">
              {unreadCount > 0 && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button
                        type="button"
                        onClick={markAllRead}
                        disabled={isMarkingAllRead}
                        className="flex items-center justify-center rounded-md p-1.5 h-fit text-muted-foreground transition-colors hover:bg-info/15 hover:text-info active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
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
                        className="flex items-center justify-center rounded-md p-1.5 h-fit text-muted-foreground transition-colors hover:bg-destructive/15 hover:text-destructive active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
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

        <div className="flex-1 min-h-0 px-4 overflow-y-auto no-scrollbar">
          <div className="flex flex-col gap-2 py-4">
            {isLoading ? (
              <NotificationSkeleton count={5} />
            ) : filteredNotifications.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground text-sm">
                {filter === "unread"
                  ? "No unread notifications"
                  : filter === "read"
                    ? "No read notifications"
                    : "No notifications"}
              </div>
            ) : (
              filteredNotifications.map((n, i) => {
                const notifId = getNotificationId(n);
                // Per-item loading state (only the clicked item shows spinner)
                const itemIsMarkingRead = markingReadId === notifId;
                const itemIsDeleting = deletingId === notifId;
                return (
                  <NotificationItem
                    key={notifId ? `notif-${notifId}` : `notif-idx-${i}`}
                    notif={n}
                    isUnread={isNotificationUnread(n)}
                    onMarkRead={() => {
                      if (notifId) {
                        setMarkingReadId(notifId);
                        markOneRead(notifId);
                        // Clear after a reasonable timeout as fallback
                        setTimeout(
                          () =>
                            setMarkingReadId((id) =>
                              id === notifId ? null : id,
                            ),
                          3000,
                        );
                      }
                    }}
                    onDelete={
                      deleteOne && notifId
                        ? () => {
                            setDeletingId(notifId);
                            deleteOne(notifId!);
                            // Clear after a reasonable timeout as fallback
                            setTimeout(
                              () =>
                                setDeletingId((id) =>
                                  id === notifId ? null : id,
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
                    isMarkingRead={itemIsMarkingRead}
                    isDeleting={itemIsDeleting}
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
      </div>
    </>
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
        "relative px-3 py-1.5 rounded-md text-[11px] font-semibold transition-all duration-200 ease-out",

        active
          ? "bg-background text-foreground shadow-sm ring-1 ring-border"
          : "text-muted-foreground hover:text-foreground hover:bg-muted/80",
      )}
    >
      <span className="flex items-center gap-1.5">
        {label}

        {showBadge ? (
          <span
            className={cn(
              "text-[9px] px-1.5 py-0 rounded-full font-bold min-w-4 text-center",

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
