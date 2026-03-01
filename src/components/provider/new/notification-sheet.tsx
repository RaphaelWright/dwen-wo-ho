"use client";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import useNewProvider from "@/hooks/provider/use-new-provider";
import NotifItem from "./notification-item";

/**
 *
 * @param {{
 *   open:          boolean,
 *   onOpenChange:  (v: boolean) => void,
 *   notifications: object[],
 *   onMarkAllRead: () => void,
 * }} props
 */
export default function NotificationsSheet() {
  const { notifications, setNotifOpen, notifOpen, markAllRead, markOneRead } =
    useNewProvider();
  const unreadCount = notifications.filter((n) => n.unread).length;

  return (
    <Sheet open={notifOpen} onOpenChange={setNotifOpen}>
      <SheetContent side="right" className="w-100 p-0 border-l flex flex-col">
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
                className="text-[11.5px] font-semibold cursor-pointer hover:underline text-primary"
              >
                Mark all read
              </button>
            )}
          </div>
        </SheetHeader>

        {/* List */}
        <div className="flex-1 min-h-0 px-4 overflow-y-auto no-scrollbar">
          <div className="flex flex-col gap-2 py-4">
            {notifications.map((n, i) => (
              <NotifItem
                key={n.id}
                notif={n}
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
