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
import { Check, Trash2 } from "lucide-react";

/**
 * A single notification row in the notifications sheet with redesigned card layout.
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
      <div
        onClick={onClick}
        className={cn(
          "relative flex items-start gap-3 p-4 rounded-2xl border cursor-pointer transition-all duration-300 ease-in-out",
          !notif.read
            ? "bg-success/15 border-success/20 border-l-3 border-l-success/50 shadow-sm"
            : "bg-muted border-muted",
        )}
      >
        {/* Avatar */}
        <Avatar
          className={cn(
            "size-10 shrink-0 border border-success/20 rounded-md",
            notif.read && "border-muted-foreground/10",
          )}
        >
          <AvatarImage src={notif.avatarUrl} className="rounded-none" />
          {notif.targetName || notif.title ? (
            <AvatarFallback className="bg-muted text-sm rounded-none">
              {(notif.targetName || notif.title || "N").charAt(0).toUpperCase()}
            </AvatarFallback>
          ) : (
            <AvatarFallback className="bg-muted text-sm rounded-none">
              N
            </AvatarFallback>
          )}
        </Avatar>

        {/* Body */}
        <div className="flex-1 min-w-0">
          {/* Green badge with name/title */}
          <div className="flex items-center gap-2 mb-1">
            <span
              className={cn(
                "px-2.5 py-0.5 rounded-sm text-xs font-semibold",
                !notif.read
                  ? "bg-success text-white"
                  : "bg-muted-foreground/10 text-muted-foreground font-normal",
              )}
            >
              {notif.targetName || notif.title || "Notification"}
            </span>
          </div>

          {/* Message text as bold subtitle */}
          <p
            className={cn(
              "text-sm  mb-0.5",
              notif.read && "font-normal text-muted-foreground",
            )}
          >
            {notif.text || notif.message}
          </p>

          {/* Meta with dot separator */}
          <p className="text-xs text-muted-foreground">{notif.meta}</p>
        </div>

        {/* Right side: Green dot for unread + Actions */}
        <div className="flex flex-col items-center gap-2 shrink-0">
          {/* Unread indicator dot */}
          {!notif.read && <span className="w-2 h-2 rounded-full bg-success" />}

          {/* Actions */}
          <div className={cn("flex flex-col gap-1 mt-1", notif.read && "mt-5")}>
            {!notif.read ? (
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onMarkRead();
                    }}
                    className="flex items-center justify-center w-7 h-7 rounded-md text-success-/60 hover:bg-white/70 cursor-pointer transition-colors"
                  >
                    <Check size={16} />
                  </button>
                </TooltipTrigger>
                <TooltipContent side="left">
                  <p className="text-[10px]">Mark as read</p>
                </TooltipContent>
              </Tooltip>
            ) : (
              <button
                disabled
                className="flex items-center justify-center w-7 h-7 rounded-md text-muted-foreground/50 cursor-not-allowed"
              >
                <Check size={16} />
              </button>
            )}

            {onDelete && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete();
                    }}
                    className="flex items-center justify-center w-7 h-7 rounded-md text-destructive hover:bg-destructive/10 cursor-pointer transition-colors"
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
        </div>
      </div>
    </TooltipProvider>
  );
}
