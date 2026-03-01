"use client";

import { NotificationItem } from "@/lib/types/provider/new-provider";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { Check } from "lucide-react";

/**
 * A single notification row in the notifications sheet.
 * @param {{ notif: object, index: number, onMarkRead: () => void }} props
 */
export default function NotifItem({
  notif,
  index,
  onMarkRead,
}: {
  notif: NotificationItem;
  index: number;
  onMarkRead: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: index * 0.06 }}
      className={cn(
        "relative flex items-start gap-3 p-4 rounded-xl border border-border cursor-pointer transition-all duration-300 ease-in-out",
        notif.unread
          ? "hover:translate-x-1 hover:border-success bg-card border-l-success border-l-2 shadow-sm"
          : "bg-card/50 border-muted-foreground/40 border-l-muted-foreground border-l-2",
      )}
    >
      {/* Avatar */}
      <div className="size-9 rounded-full flex items-center justify-center text-[18px] shrink-0 border bg-primary/20 border-border">
        {notif.emoji}
      </div>

      {/* Body */}
      <div className="flex-1 min-w-0">
        <p
          className={cn(
            "text-[11.5px] font-bold mb-1",
            notif.unread ? "text-foreground" : "text-muted-foreground",
          )}
        >
          {notif.patient}
        </p>
        <p className="text-[12.5px] leading-snug text-muted-foreground">
          {notif.text}
        </p>
        <p className="text-[10.5px] mt-1 text-muted-foreground">{notif.meta}</p>
      </div>

      {/* Mark as read / read indicator */}
      {notif.unread ? (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onMarkRead();
          }}
          className="shrink-0 mt-1 flex items-center gap-1 text-[10px] font-semibold text-success hover:text-success/80 cursor-pointer transition-colors"
        >
          <Check size={12} />
          Mark read
        </button>
      ) : (
        <Check size={12} className="shrink-0 mt-1 text-muted-foreground/40" />
      )}
    </motion.div>
  );
}
