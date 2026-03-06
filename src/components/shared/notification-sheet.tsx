"use client";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetClose,
} from "@/components/ui/sheet";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Notification } from "@/lib/types/notification";
import NotifItem from "./notification-item";
import { Trash2, X } from "lucide-react";

interface NotificationsSheetProps {
  notifications: Notification[];
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  markAllRead: () => void;
  markOneRead: (id: string | number) => void;
  clearAllNotifications: () => void;
}

export default function NotificationsSheet({
  notifications,
  isOpen,
  onOpenChange,
  markAllRead,
  markOneRead,
  clearAllNotifications,
}: NotificationsSheetProps) {
  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="w-100 p-0 border-l flex flex-col"
        showCloseButton={false}
      >
        <SheetClose className="absolute right-1 top-0.5  size-7 rounded-full border bg-background flex items-center justify-center shadow-sm transition-all hover:scale-110 hover:bg-muted group z-50">
          <X className="size-4 text-destructive" />
          <span className="sr-only">Close</span>
        </SheetClose>
        {/* Header */}
        <SheetHeader className="px-5 pt-5 pb-4 border-b shrink-0 mt-4">
          <div className="flex items-center gap-3">
            <SheetTitle className="text-[16px] font-bold flex-1">
              Notifications
            </SheetTitle>

            {unreadCount > 0 && (
              <span className="text-[10.5px] font-bold text-white px-2 py-0.5 rounded-full bg-success">
                {unreadCount} new
              </span>
            )}

            {unreadCount > 0 && (
              <button
                onClick={markAllRead}
                className="text-[11.5px] font-semibold cursor-pointer hover:opacity-50 text-primary"
              >
                Mark all read
              </button>
            )}

            {notifications.length > 0 && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      onClick={clearAllNotifications}
                      className="flex items-center justify-center rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-destructive/15 hover:text-destructive active:scale-95"
                    >
                      <Trash2 className="size-4" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent side="bottom" sideOffset={8}>
                    <p className="text-xs font-semibold">Clear all</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
          </div>
        </SheetHeader>

        {/* List */}
        <div className="flex-1 min-h-0 px-4 overflow-y-auto no-scrollbar">
          <div className="flex flex-col gap-2 py-4">
            {notifications.map((n, i) => (
              <NotifItem
                key={n.id}
                notif={n as any}
                index={i}
                onMarkRead={() => markOneRead(n.id)}
              />
            ))}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
