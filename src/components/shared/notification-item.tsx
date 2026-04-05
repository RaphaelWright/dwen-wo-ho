"use client";

import { NotificationItem } from "@/lib/types/provider/new-provider";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { motion } from "framer-motion";
import { Check, Trash2 } from "lucide-react";

/**
 * A single notification row in the notifications sheet.
 */
export default function NotifItem({
  notif,
  index,
  onMarkRead,
  onDelete,
  onClick,
}: {
  notif: NotificationItem;
  index: number;
  onMarkRead: () => void;
  onDelete?: () => void;
  onClick?: () => void;
}) {
  return (
    <TooltipProvider delayDuration={200}>
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: index * 0.06 }}
        onClick={onClick}
        className={cn(
          "relative flex items-start gap-3 p-4 rounded-xl border border-border cursor-pointer transition-all duration-300 ease-in-out",
          !notif.read
            ? "hover:translate-x-1 hover:border-success bg-success/10 shadow-sm"
            : "bg-muted border-muted",
        )}
      >
        {/* Avatar */}
        <Avatar className="size-9 shrink-0 border border-border">
          <AvatarImage src={notif.avatarUrl} />
          {notif.targetName || notif.title ? (
            <AvatarFallback className="text-foreground">
              {(notif.targetName || notif.title || "N").charAt(0).toUpperCase()}
            </AvatarFallback>
          ) : (
            <AvatarFallback className="text-foreground">N</AvatarFallback>
          )}
        </Avatar>

        {/* Body */}
        <div className="flex-1 min-w-0">
          <p
            className={cn(
              "text-[11.5px] font-bold mb-1",
              !notif.read ? "text-foreground" : "text-muted-foreground",
            )}
          >
            {notif.targetName || notif.title}
          </p>
          <p className="text-[12.5px] leading-snug text-muted-foreground">
            {notif.text || notif.message}
          </p>
          <p className="text-[10.5px] mt-1 text-muted-foreground">
            {notif.meta}
          </p>
        </div>

        {/* Actions: Mark read + Delete (icon only with tooltips) */}
        <div className="flex flex-col gap-1 shrink-0">
          {!notif.read ? (
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onMarkRead();
                  }}
                  className="flex items-center justify-center w-7 h-7 rounded-md text-success hover:bg-success/10 hover:text-success/80 cursor-pointer transition-colors"
                >
                  <Check size={16} />
                </button>
              </TooltipTrigger>
              <TooltipContent side="left">
                <p className="text-[10px]">Mark as read</p>
              </TooltipContent>
            </Tooltip>
          ) : (
            <div className="w-7 h-7 flex items-center justify-center">
              <Check size={16} className="text-muted-foreground/40" />
            </div>
          )}

          {onDelete && (
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete();
                  }}
                  className="flex items-center justify-center w-7 h-7 rounded-md text-destructive hover:bg-destructive/10 hover:text-destructive/80 cursor-pointer transition-colors"
                >
                  <Trash2 size={16} />
                </button>
              </TooltipTrigger>
              <TooltipContent side="left">
                <p className="text-[10px]">Delete</p>
              </TooltipContent>
            </Tooltip>
          )}
        </div>
      </motion.div>
    </TooltipProvider>
  );
}
